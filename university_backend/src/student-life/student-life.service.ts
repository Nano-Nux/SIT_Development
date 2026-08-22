import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StudentLifeService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string) {
    const where: any = {};
    if (category) where.category = category;

    return this.prisma.studentLife.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.studentLife.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Student life item not found');
    return item;
  }

  async create(data: any) {
    const gallery = typeof data.gallery === 'string'
      ? data.gallery
      : JSON.stringify(data.gallery || []);

    return this.prisma.studentLife.create({
      data: {
        title: data.title,
        titleLa: data.titleLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        category: data.category || 'Campus Life',
        categoryLa: data.categoryLa,
        imageUrl: data.imageUrl,
        gallery,
        order: data.order !== undefined ? Number(data.order) : 0,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const gallery = data.gallery !== undefined
      ? (typeof data.gallery === 'string' ? data.gallery : JSON.stringify(data.gallery))
      : undefined;

    return this.prisma.studentLife.update({
      where: { id },
      data: {
        title: data.title,
        titleLa: data.titleLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        category: data.category,
        categoryLa: data.categoryLa,
        imageUrl: data.imageUrl,
        gallery,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.studentLife.delete({ where: { id } });
    return { success: true, message: 'Student life item deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      items.map(item =>
        this.prisma.studentLife.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { success: true, message: 'Student life items reordered' };
  }
}
