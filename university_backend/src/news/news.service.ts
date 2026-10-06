import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { imageGalleryData } from '../common/image-gallery';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { category?: string; all?: boolean; limit?: number; page?: number; search?: string }) {
    const where: any = {};
    if (!query?.all) where.isPublished = true;
    if (query?.category && query.category !== 'All') where.category = query.category;
    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { titleLa: { contains: query.search, mode: 'insensitive' } },
        { summary: { contains: query.search, mode: 'insensitive' } },
        { summaryLa: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const take = query?.limit ? Number(query.limit) : 20;
    const skip = query?.page ? (Number(query.page) - 1) * take : 0;

    const [items, total] = await Promise.all([
      this.prisma.news.findMany({
        where,
        take,
        skip,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.news.count({ where }),
    ]);

    return { items, total, page: query?.page ? Number(query.page) : 1, limit: take };
  }

  async findBySlug(slug: string, incrementView = true) {
    const news = await this.prisma.news.findUnique({ where: { slug } });
    if (!news) throw new NotFoundException('News article not found');

    if (incrementView) {
      await this.prisma.news.update({
        where: { id: news.id },
        data: { views: { increment: 1 } },
      });
    }

    return news;
  }

  async findOne(id: string) {
    const news = await this.prisma.news.findUnique({ where: { id } });
    if (!news) throw new NotFoundException('News article not found');
    return news;
  }

  async create(data: any) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return this.prisma.news.create({
      data: {
        title: data.title,
        titleLa: data.titleLa,
        slug,
        summary: data.summary,
        summaryLa: data.summaryLa,
        content: data.content,
        contentLa: data.contentLa,
        category: data.category || 'General',
        categoryLa: data.categoryLa,
        ...imageGalleryData(data),
        author: data.author || 'SIT Communications',
        authorLa: data.authorLa,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      },
    });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    return this.prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        titleLa: data.titleLa,
        slug: data.slug,
        summary: data.summary,
        summaryLa: data.summaryLa,
        content: data.content,
        contentLa: data.contentLa,
        category: data.category,
        categoryLa: data.categoryLa,
        ...imageGalleryData(data),
        author: data.author,
        authorLa: data.authorLa,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.news.delete({ where: { id } });
    return { success: true, message: 'News article deleted' };
  }
}
