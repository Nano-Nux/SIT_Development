import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpotlightsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { type?: string; all?: boolean }) {
    const where: any = {};
    if (!query?.all) where.isActive = true;
    if (query?.type) where.type = query.type.toUpperCase();

    return this.prisma.spotlight.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.spotlight.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Spotlight not found');
    return item;
  }

  async create(data: any) {
    return this.prisma.spotlight.create({
      data: {
        type: data.type ? data.type.toUpperCase() : 'STUDENT',
        title: data.title || null,
        titleLa: data.titleLa || null,
        subtitle: data.subtitle || null,
        subtitleLa: data.subtitleLa || null,
        quote: data.quote || null,
        quoteLa: data.quoteLa || null,
        description: data.description || null,
        descriptionLa: data.descriptionLa || null,
        authorName: data.authorName || null,
        authorNameLa: data.authorNameLa || null,
        authorRole: data.authorRole || null,
        authorRoleLa: data.authorRoleLa || null,
        imageUrl: data.imageUrl || null,
        order: data.order !== undefined ? Number(data.order) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.spotlight.update({
      where: { id },
      data: {
        type: data.type ? data.type.toUpperCase() : undefined,
        title: data.title !== undefined ? (data.title || null) : undefined,
        titleLa: data.titleLa !== undefined ? (data.titleLa || null) : undefined,
        subtitle: data.subtitle !== undefined ? (data.subtitle || null) : undefined,
        subtitleLa: data.subtitleLa !== undefined ? (data.subtitleLa || null) : undefined,
        quote: data.quote !== undefined ? (data.quote || null) : undefined,
        quoteLa: data.quoteLa !== undefined ? (data.quoteLa || null) : undefined,
        description: data.description !== undefined ? (data.description || null) : undefined,
        descriptionLa: data.descriptionLa !== undefined ? (data.descriptionLa || null) : undefined,
        authorName: data.authorName !== undefined ? (data.authorName || null) : undefined,
        authorNameLa: data.authorNameLa !== undefined ? (data.authorNameLa || null) : undefined,
        authorRole: data.authorRole !== undefined ? (data.authorRole || null) : undefined,
        authorRoleLa: data.authorRoleLa !== undefined ? (data.authorRoleLa || null) : undefined,
        imageUrl: data.imageUrl !== undefined ? (data.imageUrl || null) : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.spotlight.delete({ where: { id } });
    return { success: true, message: 'Spotlight deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      items.map(item =>
        this.prisma.spotlight.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { success: true, message: 'Spotlights reordered' };
  }
}
