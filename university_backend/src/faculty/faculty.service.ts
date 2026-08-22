import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacultyService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { departmentId?: string; isFeatured?: boolean }) {
    const where: any = {};
    if (query?.departmentId) where.departmentId = query.departmentId;
    if (query?.isFeatured !== undefined) where.isFeatured = query.isFeatured;

    return this.prisma.faculty.findMany({
      where,
      include: {
        department: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
      include: { department: true },
    });
    if (!faculty) throw new NotFoundException('Faculty not found');
    return faculty;
  }

  async create(data: any) {
    const isFeatured = data.isFeatured !== undefined
      ? Boolean(data.isFeatured)
      : data.featured !== undefined
        ? Boolean(data.featured)
        : false;

    return this.prisma.faculty.create({
      data: {
        name: data.name,
        nameLa: data.nameLa,
        position: data.position,
        positionLa: data.positionLa,
        departmentName: data.departmentName,
        departmentNameLa: data.departmentNameLa,
        biography: data.biography,
        biographyLa: data.biographyLa,
        imageUrl: data.imageUrl,
        email: data.email,
        departmentId: data.departmentId || null,
        order: data.order !== undefined ? Number(data.order) : 0,
        isFeatured,
      },
      include: { department: true },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const isFeatured = data.isFeatured !== undefined
      ? Boolean(data.isFeatured)
      : data.featured !== undefined
        ? Boolean(data.featured)
        : undefined;

    return this.prisma.faculty.update({
      where: { id },
      data: {
        name: data.name,
        nameLa: data.nameLa,
        position: data.position,
        positionLa: data.positionLa,
        departmentName: data.departmentName,
        departmentNameLa: data.departmentNameLa,
        biography: data.biography,
        biographyLa: data.biographyLa,
        imageUrl: data.imageUrl,
        email: data.email,
        departmentId: data.departmentId !== undefined ? data.departmentId : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured : undefined,
      },
      include: { department: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.faculty.delete({ where: { id } });
    return { success: true, message: 'Faculty deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      items.map(item =>
        this.prisma.faculty.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { success: true, message: 'Faculty reordered' };
  }
}
