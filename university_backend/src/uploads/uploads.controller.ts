import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadsService } from './uploads.service';
import { AdminGuard } from '../auth/admin.guard';
import type { Response } from 'express';
import { pipeline } from 'node:stream/promises';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max limit to preserve high-res quality
      fileFilter: (req, file, callback) => {
        // Accept images, pdfs, audio, and videos without restriction
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype === 'application/pdf' ||
          file.mimetype.startsWith('video/')
        ) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.uploadsService.uploadFile(file);
  }

  @Get(':filename')
  async getUploadedFile(
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const file = await this.uploadsService.getUploadedFile(filename);
    if (!file) throw new NotFoundException('Uploaded file not found');

    response.setHeader(
      'Content-Type',
      file.contentType || 'application/octet-stream',
    );
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    if (file.contentLength !== undefined) {
      response.setHeader('Content-Length', file.contentLength);
    }
    await pipeline(file.body, response);
  }

  @Get()
  @UseGuards(AdminGuard)
  getAll() {
    return this.uploadsService.getAllMedia();
  }
}
