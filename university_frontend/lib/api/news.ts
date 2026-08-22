import { ApiClient, apiClient, RequestOptions } from './client';
import { NewsArticle, PaginatedResponse } from './types';

export interface GetNewsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  all?: boolean;
}

export class NewsService {
  constructor(private client: ApiClient = apiClient) {}

  async getNews(params?: GetNewsParams, options?: RequestOptions): Promise<PaginatedResponse<NewsArticle>> {
    return this.client.fetchJson<PaginatedResponse<NewsArticle>>('/news', {
      params: params as any,
      ...options,
    });
  }

  async getNewsArticle(idOrSlug: string, options?: RequestOptions): Promise<NewsArticle> {
    return this.client.fetchJson<NewsArticle>(`/news/${idOrSlug}`, options);
  }

  async createNews(data: Partial<NewsArticle>): Promise<NewsArticle> {
    return this.client.fetchJson<NewsArticle>('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateNews(id: string, data: Partial<NewsArticle>): Promise<NewsArticle> {
    return this.client.fetchJson<NewsArticle>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteNews(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/news/${id}`, {
      method: 'DELETE',
    });
  }
}

export const newsApi = new NewsService();
