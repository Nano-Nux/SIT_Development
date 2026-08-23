import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalApplications,
      pendingApplications,
      totalInquiries,
      pendingInquiries,
      totalPrograms,
      totalFaculty,
      totalNews,
      totalEvents,
      totalPartners,
      totalSpotlights,
      recentApplications,
      recentInquiries,
      recentNews,
    ] = await Promise.all([
      this.prisma.application.count(),
      this.prisma.application.count({ where: { status: 'PENDING' } }),
      this.prisma.requestInfo.count(),
      this.prisma.requestInfo.count({ where: { status: 'PENDING' } }),
      this.prisma.program.count(),
      this.prisma.faculty.count(),
      this.prisma.news.count(),
      this.prisma.event.count(),
      this.prisma.partner.count(),
      this.prisma.spotlight.count(),
      this.prisma.application.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.requestInfo.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
      }),
      this.prisma.news.findMany({
        take: 5,
        orderBy: { publishedAt: 'desc' },
        select: { id: true, title: true, category: true, publishedAt: true, views: true },
      }),
    ]);

    const overview = {
      totalApplications,
      pendingApplications,
      totalInquiries,
      pendingInquiries,
      totalPrograms,
      totalFaculty,
      totalNews,
      totalEvents,
      totalPartners,
      totalSpotlights,
    };

    return {
      overview,
      counts: overview,
      recentApplications,
      recentInquiries,
      recentNews,
    };
  }
}
