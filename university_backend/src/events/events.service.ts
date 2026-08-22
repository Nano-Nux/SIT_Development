import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { upcomingOnly?: boolean; all?: boolean; limit?: number }) {
    const where: any = {};
    if (!query?.all) where.isPublished = true;
    if (query?.upcomingOnly) {
      where.eventDate = { gte: new Date() };
    }

    return this.prisma.event.findMany({
      where,
      take: query?.limit ? Number(query.limit) : undefined,
      orderBy: { eventDate: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({ where: { slug } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async create(data: any) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return this.prisma.event.create({
      data: {
        title: data.title,
        titleLa: data.titleLa,
        slug,
        summary: data.summary,
        summaryLa: data.summaryLa,
        content: data.content,
        contentLa: data.contentLa,
        location: data.location || 'SIT Main Campus',
        locationLa: data.locationLa,
        eventDate: new Date(data.eventDate || Date.now()),
        time: data.time || '09:00 AM - 12:00 PM',
        timeLa: data.timeLa,
        imageUrl: data.imageUrl,
        registrationUrl: data.registrationUrl,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        titleLa: data.titleLa,
        slug: data.slug,
        summary: data.summary,
        summaryLa: data.summaryLa,
        content: data.content,
        contentLa: data.contentLa,
        location: data.location,
        locationLa: data.locationLa,
        eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
        time: data.time,
        timeLa: data.timeLa,
        imageUrl: data.imageUrl,
        registrationUrl: data.registrationUrl,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.event.delete({ where: { id } });
    return { success: true, message: 'Event deleted' };
  }
}
