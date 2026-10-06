import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HeroService {
  constructor(private prisma: PrismaService) {}

  async findByPage(page: string) {
    const hero = await this.prisma.hero.findUnique({
      where: { page: page.toUpperCase() },
    });
    return this.omitHomePoster(hero);
  }

  async findAll() {
    const heroes = await this.prisma.hero.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return heroes.map((hero) => this.omitHomePoster(hero));
  }

  async upsert(page: string, data: any) {
    const pageKey = page.toUpperCase();
    const hero = await this.prisma.hero.upsert({
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
        imageUrl: pageKey === 'HOME' ? null : data.imageUrl,
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
        imageUrl: pageKey === 'HOME' ? null : data.imageUrl,
        image2Url: data.image2Url,
        image3Url: data.image3Url,
        image4Url: data.image4Url,
        bgVideoUrl: data.bgVideoUrl,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    return this.omitHomePoster(hero);
  }

  private omitHomePoster<T extends { page: string; imageUrl?: string | null }>(
    hero: T | null,
  ): Omit<T, 'imageUrl'> | T | null {
    if (!hero || hero.page.toUpperCase() !== 'HOME') return hero;
    const homepageHero = { ...hero };
    Reflect.deleteProperty(homepageHero, 'imageUrl');
    return homepageHero;
  }
}
