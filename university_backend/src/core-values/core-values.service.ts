import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoreValuesService {
  constructor(private prisma: PrismaService) {}

  async findAll(includeInactive = false) {
    return this.prisma.coreValue.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.coreValue.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Core value not found');
    return item;
  }

  async create(data: any) {
    return this.prisma.coreValue.create({
      data: {
        title: data.title,
        titleLa: data.titleLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        icon: data.icon,
        order: data.order !== undefined ? Number(data.order) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.coreValue.update({
      where: { id },
      data: {
        title: data.title,
        titleLa: data.titleLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        icon: data.icon,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.coreValue.delete({ where: { id } });
    return { success: true, message: 'Core value deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      items.map(item =>
        this.prisma.coreValue.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { success: true, message: 'Core values reordered' };
  }
}
