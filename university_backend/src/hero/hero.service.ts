import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  async findByPage(page: string) {
    return this.prisma.hero.findUnique({
      where: { page: page.toUpperCase() },
    });
  }

  async findAll() {
    return this.prisma.hero.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async upsert(page: string, data: any) {
    const pageKey = page.toUpperCase();
    return this.prisma.hero.upsert({
      where: { page: pageKey },
      update: {
        title: data.title,
        titleLa: data.titleLa,
        subtitle: data.subtitle,
        subtitleLa: data.subtitleLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        buttonText: data.buttonText,
        buttonTextLa: data.buttonTextLa,
        buttonUrl: data.buttonUrl,
        imageUrl: data.imageUrl,
        image2Url: data.image2Url,
        image3Url: data.image3Url,
        image4Url: data.image4Url,
        bgVideoUrl: data.bgVideoUrl,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      create: {
        page: pageKey,
        title: data.title || 'Welcome to SIT University',
        titleLa: data.titleLa,
        subtitle: data.subtitle,
        subtitleLa: data.subtitleLa,
        description: data.description,
        descriptionLa: data.descriptionLa,
        buttonText: data.buttonText,
        buttonTextLa: data.buttonTextLa,
        buttonUrl: data.buttonUrl,
        imageUrl: data.imageUrl,
        image2Url: data.image2Url,
        image3Url: data.image3Url,
        image4Url: data.image4Url,
        bgVideoUrl: data.bgVideoUrl,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }
}
