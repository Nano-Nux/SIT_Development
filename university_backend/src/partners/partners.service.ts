import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { type?: string; all?: boolean }) {
    const where: any = {};
    if (!query?.all) where.isActive = true;
    if (query?.type) where.type = query.type.toUpperCase();

    return this.prisma.partner.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) throw new NotFoundException('Partner not found');
    return partner;
  }

  async create(data: any) {
    return this.prisma.partner.create({
      data: {
        name: data.name,
        nameLa: data.nameLa,
        type: data.type ? data.type.toUpperCase() : 'UNIVERSITY',
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        country: data.country,
        countryLa: data.countryLa,
        order: data.order !== undefined ? Number(data.order) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.partner.update({
      where: { id },
      data: {
        name: data.name,
        nameLa: data.nameLa,
        type: data.type ? data.type.toUpperCase() : undefined,
        logoUrl: data.logoUrl,
        websiteUrl: data.websiteUrl,
        country: data.country,
        countryLa: data.countryLa,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.partner.delete({ where: { id } });
    return { success: true, message: 'Partner deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      items.map(item =>
        this.prisma.partner.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { success: true, message: 'Partners reordered' };
  }
}
