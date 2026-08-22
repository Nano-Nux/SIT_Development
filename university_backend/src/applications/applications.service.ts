import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async submit(data: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    address?: string;
    intendedProgram?: string;
    program?: string;
    programOfInterest?: string;
    degreeLevel?: string;
    previousSchool?: string;
    highSchool?: string;
    gpa?: string;
    graduationYear?: string | number;
    englishScore?: string;
    statement?: string;
    personalStatement?: string;
    documents?: any;
  }) {
    const fullName = data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Applicant';
    const intendedProgram = data.intendedProgram || data.programOfInterest || data.program || 'Undergraduate Degree';
    const previousSchool = data.previousSchool || data.highSchool || 'High School';
    const graduationYear = data.graduationYear !== undefined ? String(data.graduationYear) : '2026';
    const statement = data.statement || data.personalStatement || '';
    const documents = typeof data.documents === 'string'
      ? data.documents
      : (data.documents ? JSON.stringify(data.documents) : null);

    const application = await this.prisma.application.create({
      data: {
        fullName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth || '',
        gender: data.gender || 'Not specified',
        nationality: data.nationality || 'Lao',
        address: data.address || '',
        intendedProgram,
        degreeLevel: data.degreeLevel || 'Undergraduate',
        previousSchool,
        gpa: data.gpa || '',
        graduationYear,
        englishScore: data.englishScore || '',
        statement,
        documents,
        status: 'PENDING',
      },
    });

    // Send email notification & confirmation in background
    this.emailService.sendApplicationSubmission({
      id: application.id,
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      dateOfBirth: application.dateOfBirth,
      gender: application.gender,
      nationality: application.nationality,
      address: application.address,
      intendedProgram: application.intendedProgram,
      degreeLevel: application.degreeLevel,
      previousSchool: application.previousSchool,
      gpa: application.gpa || undefined,
      graduationYear: application.graduationYear || undefined,
      statement: application.statement || undefined,
      documents: application.documents || undefined,
    }).catch(() => null);

    return application;
  }

  async findAll(query?: { status?: string; search?: string; page?: number; limit?: number }) {
    const where: any = {};
    if (query?.status && query.status !== 'ALL') where.status = query.status.toUpperCase();
    if (query?.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
        { intendedProgram: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const take = query?.limit ? Number(query.limit) : 25;
    const skip = query?.page ? (Number(query.page) - 1) * take : 0;

    const [items, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        take,
        skip,
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.application.count({ where }),
    ]);

    return { items, total, page: query?.page ? Number(query.page) : 1, limit: take };
  }

  async findOne(id: string) {
    const app = await this.prisma.application.findUnique({ where: { id } });
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }

  async updateStatus(id: string, status: string, notes?: string) {
    await this.findOne(id);
    return this.prisma.application.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
        notes: notes !== undefined ? notes : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.application.delete({ where: { id } });
    return { success: true, message: 'Application deleted' };
  }
}
