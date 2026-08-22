import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { departmentId?: string; degree?: string; all?: boolean }) {
    const where: any = {};
    if (!query?.all) where.isPublished = true;
    if (query?.departmentId) where.departmentId = query.departmentId;
    if (query?.degree) where.degree = query.degree;

    return this.prisma.program.findMany({
      where,
      include: {
        department: { select: { id: true, name: true, slug: true } },
        directors: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const program = await this.prisma.program.findUnique({
      where: { slug },
      include: {
        department: true,
        directors: true,
      },
    });
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  async findOne(id: string) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        department: true,
        directors: true,
      },
    });
    if (!program) throw new NotFoundException('Program not found');
    return program;
  }

  async create(data: any) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const coreFocusAreas = typeof data.coreFocusAreas === 'string'
      ? data.coreFocusAreas
      : JSON.stringify(data.coreFocusAreas || []);
    const coreFocusAreasLa = data.coreFocusAreasLa !== undefined
      ? (typeof data.coreFocusAreasLa === 'string' ? data.coreFocusAreasLa : JSON.stringify(data.coreFocusAreasLa))
      : null;

    return this.prisma.program.create({
      data: {
        name: data.name,
        nameLa: data.nameLa,
        slug,
        degree: data.degree || 'Bachelor',
        degreeLa: data.degreeLa,
        duration: data.duration || '4 Years',
        durationLa: data.durationLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        heroImage: data.heroImage,
        coreFocusAreas,
        coreFocusAreasLa,
        departmentId: data.departmentId || null,
        order: data.order !== undefined ? Number(data.order) : 0,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      },
      include: {
        department: true,
        directors: true,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const coreFocusAreas = data.coreFocusAreas !== undefined
      ? (typeof data.coreFocusAreas === 'string' ? data.coreFocusAreas : JSON.stringify(data.coreFocusAreas))
      : undefined;
    const coreFocusAreasLa = data.coreFocusAreasLa !== undefined
      ? (typeof data.coreFocusAreasLa === 'string' ? data.coreFocusAreasLa : JSON.stringify(data.coreFocusAreasLa))
      : undefined;

    return this.prisma.program.update({
      where: { id },
      data: {
        name: data.name,
        nameLa: data.nameLa,
        slug: data.slug,
        degree: data.degree,
        degreeLa: data.degreeLa,
        duration: data.duration,
        durationLa: data.durationLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        heroImage: data.heroImage,
        coreFocusAreas,
        coreFocusAreasLa,
        departmentId: data.departmentId !== undefined ? data.departmentId : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : undefined,
      },
      include: {
        department: true,
        directors: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.program.delete({ where: { id } });
    return { success: true, message: 'Program deleted' };
  }

  async reorder(items: { id: string; order: number }[]) {
    await this.prisma.$transaction(
      items.map(item =>
        this.prisma.program.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
    return { success: true, message: 'Programs reordered' };
  }
}
