import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampusFacilitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.campusFacility.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.campusFacility.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Campus facility not found');
    return item;
  }

  async create(data: any) {
    return this.prisma.campusFacility.create({
      data: {
        name: data.name,
        nameLa: data.nameLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        imageUrl: data.imageUrl,
        actionType: data.actionType ? data.actionType.toUpperCase() : 'MODAL',
        destinationUrl: data.destinationUrl,
        modalTitle: data.modalTitle,
        modalTitleLa: data.modalTitleLa,
        modalContent: data.modalContent,
        modalContentLa: data.modalContentLa,
        order: data.order !== undefined ? Number(data.order) : 0,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.campusFacility.update({
      where: { id },
      data: {
        name: data.name,
        nameLa: data.nameLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        imageUrl: data.imageUrl,
        actionType: data.actionType ? data.actionType.toUpperCase() : undefined,
        destinationUrl: data.destinationUrl,
        modalTitle: data.modalTitle,
        modalTitleLa: data.modalTitleLa,
        modalContent: data.modalContent,
        modalContentLa: data.modalContentLa,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.campusFacility.delete({ where: { id } });
    return { success: true, message: 'Campus facility deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      items.map(item =>
        this.prisma.campusFacility.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { success: true, message: 'Campus facilities reordered' };
  }
}
