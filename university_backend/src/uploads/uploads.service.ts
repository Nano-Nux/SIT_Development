import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { PrismaService } from '../prisma/prisma.service';
import { extname, join } from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadsService implements OnModuleInit {
  private readonly logger = new Logger(UploadsService.name);
  private s3Client: S3Client | null = null;
  private bucket: string = process.env.S3_BUCKET || 'university-media';
  private endpoint: string = process.env.S3_ENDPOINT || 'http://localhost:8333';
  private publicUrlBase: string =
    process.env.S3_PUBLIC_URL ||
    `${process.env.S3_ENDPOINT || 'http://localhost:8333'}/${process.env.S3_BUCKET || 'university-media'}`;
  private useS3: boolean = true;

  constructor(private prisma: PrismaService) {
    const endpoint = this.endpoint;
    const region = process.env.S3_REGION || 'us-east-1';
    const accessKeyId = process.env.S3_ACCESS_KEY_ID || 'any';
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || 'any';
    const forcePathStyle = process.env.S3_FORCE_PATH_STYLE !== 'false';

    try {
      this.s3Client = new S3Client({
        endpoint,
        region,
        forcePathStyle,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    } catch (err) {
      this.logger.warn(
        `Failed to initialize S3 client, will use SeaweedFS filer/local fallback: ${err}`,
      );
      this.useS3 = false;
    }
  }

  private isSeaweedOnline: boolean = false;
  private lastHealthCheck: number = 0;
  private readonly HEALTH_CHECK_INTERVAL_MS = 30000; // Check every 30 seconds

  async onModuleInit() {
    this.isSeaweedOnline = await this.checkSeaweedHealth();
    if (this.isSeaweedOnline) {
      await this.ensureBucketExists();
    } else {
      this.logger.log('SeaweedFS offline; local uploads directory will be used for zero-delay uploads');
    }
  }

  private async checkSeaweedHealth(): Promise<boolean> {
    const now = Date.now();
    // Cache positive or negative status for interval
    if (now - this.lastHealthCheck < this.HEALTH_CHECK_INTERVAL_MS) {
      return this.isSeaweedOnline;
    }
    this.lastHealthCheck = now;

    try {
      // Fast check filer or S3 endpoint with 1s abort controller
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      const res = await fetch(`${this.endpoint}/`, {
        method: 'HEAD',
        signal: controller.signal,
      }).catch(() => null);
      clearTimeout(timeoutId);

      this.isSeaweedOnline = !!res;
      return this.isSeaweedOnline;
    } catch {
      this.isSeaweedOnline = false;
      return false;
    }
  }

  private async ensureBucketExists(): Promise<boolean> {
    if (!this.s3Client || !this.useS3) return false;
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      this.logger.log(`Connected to SeaweedFS S3 bucket "${this.bucket}"`);
      return true;
    } catch (err: any) {
      try {
        await this.s3Client.send(
          new CreateBucketCommand({ Bucket: this.bucket }),
        );
        this.logger.log(`Created SeaweedFS S3 bucket "${this.bucket}"`);
        return true;
      } catch (createErr: any) {
        return false;
      }
    }
  }

  async uploadFile(file: Express.Multer.File) {
    // Generate clean sanitized filename with unique timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExt = extname(file.originalname).toLowerCase() || '.jpg';
    const cleanFieldName = (file.fieldname || 'media').replace(/[^a-zA-Z0-9_-]/g, '');
    const key = `${cleanFieldName}-${uniqueSuffix}${originalExt}`;

    let publicUrl: string | null = null;
    const contentType = file.mimetype || 'application/octet-stream';

    // 1. Check if SeaweedFS is active
    const isOnline = await this.checkSeaweedHealth();

    // 2. Primary: Upload raw buffer to SeaweedFS S3 if online
    if (isOnline && this.s3Client && this.useS3) {
      try {
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: contentType,
          }),
        );
        publicUrl = `${this.publicUrlBase}/${key}`;
        this.logger.log(`Uploaded original quality file to SeaweedFS S3: ${publicUrl}`);
      } catch (s3Error: any) {
        this.isSeaweedOnline = false;
      }
    }

    // 3. Secondary fallback: SeaweedFS Filer HTTP direct upload if online
    if (!publicUrl && isOnline) {
      try {
        const filerBase = process.env.FILER_ENDPOINT || 'http://localhost:8888';
        const filerUrl = `${filerBase}/${this.bucket}/${key}`;
        const filerRes = await fetch(filerUrl, {
          method: 'PUT',
          headers: { 'Content-Type': contentType },
          body: file.buffer as any,
        });
        if (filerRes.ok) {
          publicUrl = filerUrl;
          this.logger.log(`Uploaded to SeaweedFS Filer: ${publicUrl}`);
        }
      } catch {
        this.isSeaweedOnline = false;
      }
    }

    // 4. Local storage fallback (instant and seamless)
    if (!publicUrl) {
      publicUrl = await this.saveLocally(file, key);
    }

    // Save media record to PostgreSQL database
    const media = await this.prisma.media.create({
      data: {
        fileName: file.originalname,
        url: publicUrl,
        mimeType: contentType,
        size: file.size,
      },
    });

    return {
      url: publicUrl,
      fileName: key,
      originalName: file.originalname,
      mimeType: contentType,
      size: file.size,
      id: media.id,
    };
  }

  private async saveLocally(
    file: Express.Multer.File,
    filename: string,
  ): Promise<string> {
    const uploadDir = join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = join(uploadDir, filename);
    await fs.promises.writeFile(filePath, file.buffer);
    const backendBase =
      process.env.BACKEND_PUBLIC_URL ||
      process.env.BACKEND_URL ||
      `http://localhost:${process.env.PORT || 5000}`;
    return `${backendBase}/uploads/${filename}`;
  }

  async getAllMedia() {
    return this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
