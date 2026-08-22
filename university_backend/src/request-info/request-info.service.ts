import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class RequestInfoService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async submit(data: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    phone?: string;
    country?: string;
    city?: string;
    currentEducationLevel?: string;
    graduationYear?: string | number;
    programOfInterest?: string;
    program?: string;
    intakeTerm?: string;
    term?: string;
    planToStart?: string;
    interests?: any;
    hearAboutUs?: string;
    communicationPreferences?: any;
    message?: string;
  }) {
    const fullName = data.fullName || (data.firstName || data.lastName ? `${data.firstName || ''} ${data.lastName || ''}`.trim() : data.name) || 'Prospective Student';
    const programOfInterest = data.programOfInterest || data.program || 'General Inquiry';
    const intakeTerm = data.planToStart || data.intakeTerm || data.term || 'Fall 2026';
    const graduationYear = data.graduationYear !== undefined ? String(data.graduationYear) : null;
    const interests = typeof data.interests === 'string'
      ? data.interests
      : (data.interests ? JSON.stringify(data.interests) : null);
    const communicationPreferences = typeof data.communicationPreferences === 'string'
      ? data.communicationPreferences
      : (data.communicationPreferences ? JSON.stringify(data.communicationPreferences) : null);

    const request = await this.prisma.requestInfo.create({
      data: {
        fullName,
        email: data.email,
        phone: data.phone || '',
        country: data.country || '',
        city: data.city || '',
        currentEducationLevel: data.currentEducationLevel || null,
        graduationYear,
        programOfInterest,
        intakeTerm,
        planToStart: data.planToStart || intakeTerm,
        interests,
        hearAboutUs: data.hearAboutUs || null,
        communicationPreferences,
        message: data.message || '',
        status: 'PENDING',
      },
    });

    // Send email notification & confirmation in background
    this.emailService.sendRequestInfoSubmission({
      id: request.id,
      fullName: request.fullName,
      email: request.email,
      phone: request.phone || undefined,
      country: request.country || undefined,
      city: request.city || undefined,
      currentEducationLevel: request.currentEducationLevel || undefined,
      graduationYear: request.graduationYear || undefined,
      programOfInterest: request.programOfInterest,
      intakeTerm: request.intakeTerm || undefined,
      planToStart: request.planToStart || undefined,
      interests: request.interests || undefined,
      hearAboutUs: request.hearAboutUs || undefined,
      communicationPreferences: request.communicationPreferences || undefined,
      message: request.message || undefined,
    }).catch(() => null);

    return request;
  }

  async findAll(query?: { status?: string; search?: string; page?: number; limit?: number }) {
    const where: any = {};
    if (query?.status && query.status !== 'ALL') where.status = query.status.toUpperCase();
    if (query?.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
        { programOfInterest: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const take = query?.limit ? Number(query.limit) : 25;
    const skip = query?.page ? (Number(query.page) - 1) * take : 0;

    const [items, total] = await Promise.all([
      this.prisma.requestInfo.findMany({
        where,
        take,
        skip,
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.requestInfo.count({ where }),
    ]);

    return { items, total, page: query?.page ? Number(query.page) : 1, limit: take };
  }

  async findOne(id: string) {
    const item = await this.prisma.requestInfo.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Request info inquiry not found');
    return item;
  }

  async updateStatus(id: string, status: string, notes?: string) {
    await this.findOne(id);
    return this.prisma.requestInfo.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        notes: notes !== undefined ? notes : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.requestInfo.delete({ where: { id } });
    return { success: true, message: 'Request info inquiry deleted' };
  }
}
