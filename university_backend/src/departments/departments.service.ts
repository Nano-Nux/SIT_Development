import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.department.findMany({
      include: {
        programs: {
          where: { isPublished: true },
          include: { directors: true },
          orderBy: { order: 'asc' },
        },
        faculty: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const cleanSlug = slug.trim().toLowerCase();
    const aliasMap: Record<string, string> = {
      'information-technology': 'it',
      'information_technology': 'it',
      'it-department': 'it',
      'dept-it': 'it',
      'business-administration-economics': 'ba-economics',
      'business-administration': 'ba-economics',
      'ba_economics': 'ba-economics',
      'ba': 'ba-economics',
      'economics': 'ba-economics',
      'communication-arts': 'communication-arts',
      'communication_arts': 'communication-arts',
      'ca': 'communication-arts',
    };

    const targetSlug = aliasMap[cleanSlug] || cleanSlug;

    // 1. Try exact or alias match
    let dept = await this.prisma.department.findFirst({
      where: {
        OR: [
          { slug: { equals: targetSlug, mode: 'insensitive' } },
          { slug: { equals: cleanSlug, mode: 'insensitive' } },
          { id: slug },
        ],
      },
      include: {
        programs: {
          include: { directors: true },
          orderBy: { order: 'asc' },
        },
        faculty: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // 2. Fallback: search by name keyword
    if (!dept) {
      const keyword = cleanSlug.replace(/[-_]/g, ' ');
      dept = await this.prisma.department.findFirst({
        where: {
          name: { contains: keyword, mode: 'insensitive' },
        },
        include: {
          programs: {
            include: { directors: true },
            orderBy: { order: 'asc' },
          },
          faculty: {
            orderBy: { order: 'asc' },
          },
        },
      });
    }

    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async findOne(id: string) {
    const dept = await this.prisma.department.findUnique({
      where: { id },
      include: {
        programs: true,
        faculty: true,
      },
    });
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  private formatJsonField(value: any): string | null | undefined {
    if (value === undefined) return undefined;
    if (value === null || value === '') return null;
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return null;
    }
  }

  async create(data: any) {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return this.prisma.department.create({
      data: {
        name: data.name,
        nameLa: data.nameLa,
        slug,
        description: data.description,
        descriptionLa: data.descriptionLa,
        heroImage: data.heroImage,
        imageUrl: data.imageUrl,
        order: data.order !== undefined ? Number(data.order) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        boxDescriptions: this.formatJsonField(data.boxDescriptions),
        boxDescriptionsLa: this.formatJsonField(data.boxDescriptionsLa),
        coreFocusAreas: this.formatJsonField(data.coreFocusAreas),
        coreFocusAreasLa: this.formatJsonField(data.coreFocusAreasLa),
        careerOutcomeDesc: data.careerOutcomeDesc,
        careerOutcomeDescLa: data.careerOutcomeDescLa,
        careerPlacementRate: data.careerPlacementRate,
        careerPlacementRateLa: data.careerPlacementRateLa,
        careerAvgSalary: data.careerAvgSalary,
        careerAvgSalaryLa: data.careerAvgSalaryLa,
        careerPartnerCompanies: data.careerPartnerCompanies,
        careerPartnerCompaniesLa: data.careerPartnerCompaniesLa,
        careerTimeToEmployment: data.careerTimeToEmployment,
        careerTimeToEmploymentLa: data.careerTimeToEmploymentLa,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.department.update({
      where: { id },
      data: {
        name: data.name,
        nameLa: data.nameLa,
        slug: data.slug,
        description: data.description,
        descriptionLa: data.descriptionLa,
        heroImage: data.heroImage,
        imageUrl: data.imageUrl,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
        boxDescriptions: this.formatJsonField(data.boxDescriptions),
        boxDescriptionsLa: this.formatJsonField(data.boxDescriptionsLa),
        coreFocusAreas: this.formatJsonField(data.coreFocusAreas),
        coreFocusAreasLa: this.formatJsonField(data.coreFocusAreasLa),
        careerOutcomeDesc: data.careerOutcomeDesc !== undefined ? data.careerOutcomeDesc : undefined,
        careerOutcomeDescLa: data.careerOutcomeDescLa !== undefined ? data.careerOutcomeDescLa : undefined,
        careerPlacementRate: data.careerPlacementRate !== undefined ? data.careerPlacementRate : undefined,
        careerPlacementRateLa: data.careerPlacementRateLa !== undefined ? data.careerPlacementRateLa : undefined,
        careerAvgSalary: data.careerAvgSalary !== undefined ? data.careerAvgSalary : undefined,
        careerAvgSalaryLa: data.careerAvgSalaryLa !== undefined ? data.careerAvgSalaryLa : undefined,
        careerPartnerCompanies: data.careerPartnerCompanies !== undefined ? data.careerPartnerCompanies : undefined,
        careerPartnerCompaniesLa: data.careerPartnerCompaniesLa !== undefined ? data.careerPartnerCompaniesLa : undefined,
        careerTimeToEmployment: data.careerTimeToEmployment !== undefined ? data.careerTimeToEmployment : undefined,
        careerTimeToEmploymentLa: data.careerTimeToEmploymentLa !== undefined ? data.careerTimeToEmploymentLa : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.department.delete({ where: { id } });
    return { success: true, message: 'Department deleted' };
  }
}
