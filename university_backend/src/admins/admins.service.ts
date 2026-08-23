import { Injectable, NotFoundException, BadRequestException, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminsService implements OnModuleInit {
  private readonly logger = new Logger(AdminsService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.syncAdminFromEnv();
  }

  /**
   * Automatically ensure configured admin credentials exist and delete legacy demo accounts
   */
  async syncAdminFromEnv() {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@sit.edu.la').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecure2026!';
    const adminName = process.env.ADMIN_NAME || 'SIT Super Admin';

    try {
      // 1. Remove legacy demo account if different from configured admin email
      if (adminEmail !== 'admin@sit.edu.kh') {
        const deletedDemo = await this.prisma.admin.deleteMany({
          where: { email: 'admin@sit.edu.kh' },
        });
        if (deletedDemo.count > 0) {
          this.logger.log(`Removed ${deletedDemo.count} legacy demo admin account(s) from database.`);
        }
      }

      // 2. Ensure primary admin exists / update password hash
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      const existing = await this.prisma.admin.findUnique({
        where: { email: adminEmail },
      });

      if (!existing) {
        await this.prisma.admin.create({
          data: {
            email: adminEmail,
            passwordHash,
            name: adminName,
            role: 'SUPER_ADMIN',
          },
        });
        this.logger.log(`Created primary admin account from .env (${adminEmail})`);
      } else {
        await this.prisma.admin.update({
          where: { id: existing.id },
          data: {
            passwordHash,
            name: existing.name || adminName,
            role: 'SUPER_ADMIN',
          },
        });
        this.logger.log(`Verified/updated primary admin account credentials from .env (${adminEmail})`);
      }
    } catch (err: any) {
      this.logger.warn(`Could not sync admin credentials from .env: ${err.message}`);
    }
  }

  async findAll() {
    return this.prisma.admin.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async create(data: { email: string; password: string; name: string; role?: string }) {
    const existing = await this.prisma.admin.findUnique({ where: { email: data.email.toLowerCase().trim() } });
    if (existing) throw new BadRequestException('Email already exists');
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.admin.create({
      data: {
        email: data.email.toLowerCase().trim(),
        name: data.name,
        passwordHash,
        role: data.role || 'ADMIN',
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async update(id: string, data: { name?: string; role?: string; password?: string }) {
    await this.findOne(id);
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.role) updateData.role = data.role;
    if (data.password) updateData.passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.admin.update({
      where: { id },
      data: updateData,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.admin.delete({ where: { id } });
    return { success: true, message: 'Admin deleted' };
  }
}
