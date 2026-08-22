import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdmissionsService {
  constructor(private prisma: PrismaService) {}

  // ================= TIMELINES =================
  async getTimelines() {
    return this.prisma.applicationTimeline.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async createTimeline(data: any) {
    return this.prisma.applicationTimeline.create({
      data: {
        intakeName: data.intakeName,
        intakeNameLa: data.intakeNameLa,
        intakeYear: data.intakeYear || '2026',
        openingDate: new Date(data.openingDate || Date.now()),
        closingDate: new Date(data.closingDate || Date.now() + 30 * 86400000),
        deadlineDate: data.deadlineDate ? new Date(data.deadlineDate) : null,
        classesBeginDate: data.classesBeginDate ? new Date(data.classesBeginDate) : null,
        additionalNotes: data.additionalNotes || null,
        additionalNotesLa: data.additionalNotesLa || null,
        status: data.status || 'Open',
        statusLa: data.statusLa,
        order: data.order !== undefined ? Number(data.order) : 0,
      },
    });
  }

  async updateTimeline(id: string, data: any) {
    return this.prisma.applicationTimeline.update({
      where: { id },
      data: {
        intakeName: data.intakeName,
        intakeNameLa: data.intakeNameLa,
        intakeYear: data.intakeYear,
        openingDate: data.openingDate ? new Date(data.openingDate) : undefined,
        closingDate: data.closingDate ? new Date(data.closingDate) : undefined,
        deadlineDate: data.deadlineDate !== undefined ? (data.deadlineDate ? new Date(data.deadlineDate) : null) : undefined,
        classesBeginDate: data.classesBeginDate !== undefined ? (data.classesBeginDate ? new Date(data.classesBeginDate) : null) : undefined,
        additionalNotes: data.additionalNotes !== undefined ? data.additionalNotes : undefined,
        additionalNotesLa: data.additionalNotesLa !== undefined ? data.additionalNotesLa : undefined,
        status: data.status,
        statusLa: data.statusLa,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });
  }

  async deleteTimeline(id: string) {
    await this.prisma.applicationTimeline.delete({ where: { id } });
    return { success: true, message: 'Timeline deleted' };
  }

  // ================= REMINDERS =================
  async getReminders(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };
    return this.prisma.applicationReminder.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async createReminder(data: any) {
    return this.prisma.applicationReminder.create({
      data: {
        title: data.title,
        titleLa: data.titleLa || null,
        description: data.description,
        descriptionLa: data.descriptionLa || null,
        icon: data.icon || 'bell',
        order: data.order !== undefined ? Number(data.order) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async updateReminder(id: string, data: any) {
    return this.prisma.applicationReminder.update({
      where: { id },
      data: {
        title: data.title,
        titleLa: data.titleLa !== undefined ? data.titleLa : undefined,
        description: data.description,
        descriptionLa: data.descriptionLa !== undefined ? data.descriptionLa : undefined,
        icon: data.icon !== undefined ? data.icon : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });
  }

  async deleteReminder(id: string) {
    await this.prisma.applicationReminder.delete({ where: { id } });
    return { success: true, message: 'Reminder deleted' };
  }

  // ================= REQUIREMENTS =================
  async getRequirements(category?: string, degreeLevel?: string) {
    const where: any = {};
    if (category) where.category = category.toUpperCase();
    if (degreeLevel) where.degreeLevel = degreeLevel;
    return this.prisma.admissionRequirement.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async createRequirement(data: any) {
    const requirementsList = typeof data.requirementsList === 'string'
      ? data.requirementsList
      : JSON.stringify(data.requirementsList || []);
    const requirementsListLa = data.requirementsListLa !== undefined
      ? (typeof data.requirementsListLa === 'string' ? data.requirementsListLa : JSON.stringify(data.requirementsListLa))
      : null;

    return this.prisma.admissionRequirement.create({
      data: {
        category: (data.category || 'ACADEMIC').toUpperCase(),
        degreeLevel: data.degreeLevel || 'Undergraduate',
        title: data.title,
        titleLa: data.titleLa,
        subtitle: data.subtitle || null,
        subtitleLa: data.subtitleLa || null,
        description: data.description || null,
        descriptionLa: data.descriptionLa || null,
        requirementsList,
        requirementsListLa,
        icon: data.icon || null,
        order: data.order !== undefined ? Number(data.order) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async updateRequirement(id: string, data: any) {
    const requirementsList = data.requirementsList !== undefined
      ? (typeof data.requirementsList === 'string' ? data.requirementsList : JSON.stringify(data.requirementsList))
      : undefined;
    const requirementsListLa = data.requirementsListLa !== undefined
      ? (typeof data.requirementsListLa === 'string' ? data.requirementsListLa : JSON.stringify(data.requirementsListLa))
      : undefined;

    return this.prisma.admissionRequirement.update({
      where: { id },
      data: {
        category: data.category ? data.category.toUpperCase() : undefined,
        degreeLevel: data.degreeLevel,
        title: data.title,
        titleLa: data.titleLa,
        subtitle: data.subtitle !== undefined ? data.subtitle : undefined,
        subtitleLa: data.subtitleLa !== undefined ? data.subtitleLa : undefined,
        description: data.description !== undefined ? data.description : undefined,
        descriptionLa: data.descriptionLa !== undefined ? data.descriptionLa : undefined,
        requirementsList,
        requirementsListLa,
        icon: data.icon !== undefined ? data.icon : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });
  }

  async deleteRequirement(id: string) {
    await this.prisma.admissionRequirement.delete({ where: { id } });
    return { success: true, message: 'Requirement deleted' };
  }

  // ================= FAQS =================
  async getFaqs(category?: string, includeInactive: boolean = false) {
    const where: any = {};
    if (!includeInactive) where.isActive = true;
    if (category && category !== 'ALL') where.category = category;
    return this.prisma.admissionFaq.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async createFaq(data: any) {
    return this.prisma.admissionFaq.create({
      data: {
        question: data.question,
        questionLa: data.questionLa || null,
        answer: data.answer,
        answerLa: data.answerLa || null,
        category: data.category || 'General',
        order: data.order !== undefined ? Number(data.order) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async updateFaq(id: string, data: any) {
    return this.prisma.admissionFaq.update({
      where: { id },
      data: {
        question: data.question,
        questionLa: data.questionLa !== undefined ? data.questionLa : undefined,
        answer: data.answer,
        answerLa: data.answerLa !== undefined ? data.answerLa : undefined,
        category: data.category !== undefined ? data.category : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });
  }

  async deleteFaq(id: string) {
    await this.prisma.admissionFaq.delete({ where: { id } });
    return { success: true, message: 'FAQ deleted' };
  }

  // ================= MATERIALS =================
  async getMaterials(includeInactive: boolean = false) {
    const where = includeInactive ? {} : { isActive: true };
    return (this.prisma as any).applicationMaterial.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async createMaterial(data: any) {
    return (this.prisma as any).applicationMaterial.create({
      data: {
        title: data.title,
        titleLa: data.titleLa || null,
        description: data.description || null,
        descriptionLa: data.descriptionLa || null,
        fileUrl: data.fileUrl,
        fileType: data.fileType || 'PDF',
        fileSize: data.fileSize || null,
        icon: data.icon || 'Download',
        badgeColor: data.badgeColor || '#0400CC',
        order: data.order !== undefined ? Number(data.order) : 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  async updateMaterial(id: string, data: any) {
    return (this.prisma as any).applicationMaterial.update({
      where: { id },
      data: {
        title: data.title,
        titleLa: data.titleLa !== undefined ? data.titleLa : undefined,
        description: data.description !== undefined ? data.description : undefined,
        descriptionLa: data.descriptionLa !== undefined ? data.descriptionLa : undefined,
        fileUrl: data.fileUrl,
        fileType: data.fileType !== undefined ? data.fileType : undefined,
        fileSize: data.fileSize !== undefined ? data.fileSize : undefined,
        icon: data.icon !== undefined ? data.icon : undefined,
        badgeColor: data.badgeColor !== undefined ? data.badgeColor : undefined,
        order: data.order !== undefined ? Number(data.order) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });
  }

  async deleteMaterial(id: string) {
    await (this.prisma as any).applicationMaterial.delete({ where: { id } });
    return { success: true, message: 'Material deleted' };
  }
}

