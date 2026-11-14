import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgramDirectorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(programId?: string) {
    const where: any = {};
    if (programId) where.programId = programId;

    return this.prisma.programDirector.findMany({
      where,
      include: {
        program: {
          select: {
            id: true,
            name: true,
            nameLa: true,
            nameZh: true,
            slug: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const director = await this.prisma.programDirector.findUnique({
      where: { id },
      include: { program: true },
    });
    if (!director) throw new NotFoundException('Program director not found');
    return director;
  }

  async create(data: any) {
    return this.prisma.programDirector.create({
      data: {
        name: data.name,
        nameLa: data.nameLa,
        nameZh: data.nameZh,
        position: data.position,
        positionLa: data.positionLa,
        positionZh: data.positionZh,
        departmentName: data.departmentName,
        departmentNameLa: data.departmentNameLa,
        departmentNameZh: data.departmentNameZh,
        biography: data.biography,
        biographyLa: data.biographyLa,
        biographyZh: data.biographyZh,
        imageUrl: data.imageUrl,
        email: data.email,
        programId: data.programId || null,
        order: data.order !== undefined ? Number(data.order) : 0,
      },
      include: { program: true },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.programDirector.update({
      where: { id },
      data: {
        name: data.name,
        nameLa: data.nameLa,
        nameZh: data.nameZh,
        position: data.position,
        positionLa: data.positionLa,
        positionZh: data.positionZh,
        departmentName: data.departmentName,
        departmentNameLa: data.departmentNameLa,
        departmentNameZh: data.departmentNameZh,
        biography: data.biography,
        biographyLa: data.biographyLa,
        biographyZh: data.biographyZh,
        imageUrl: data.imageUrl,
        email: data.email,
        programId: data.programId !== undefined ? data.programId : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
      include: { program: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.programDirector.delete({ where: { id } });
    return { success: true, message: 'Program director deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.programDirector.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { success: true, message: 'Program directors reordered' };
  }
}
