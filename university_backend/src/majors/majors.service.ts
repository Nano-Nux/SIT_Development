import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MajorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(includeInactive = false) {
    return this.prisma.major.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const major = await this.prisma.major.findUnique({ where: { slug } });
    if (!major) throw new NotFoundException('Major not found');
    return major;
  }

  async findOne(id: string) {
    const major = await this.prisma.major.findUnique({ where: { id } });
    if (!major) throw new NotFoundException('Major not found');
    return major;
  }

  async create(data: any) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return this.prisma.major.create({
      data: {
        title: data.title,
        titleLa: data.titleLa,
        slug,
        description: data.description,
        descriptionLa: data.descriptionLa,
        imageUrl: data.imageUrl,
        order: data.order !== undefined ? Number(data.order) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.major.update({
      where: { id },
      data: {
        title: data.title,
        titleLa: data.titleLa,
        slug: data.slug,
        description: data.description,
        descriptionLa: data.descriptionLa,
        imageUrl: data.imageUrl,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.major.delete({ where: { id } });
    return { success: true, message: 'Major deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      items.map(item =>
        this.prisma.major.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { success: true, message: 'Majors reordered' };
  }
}
