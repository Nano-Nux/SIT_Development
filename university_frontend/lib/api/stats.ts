import { ApiClient, apiClient, RequestOptions } from './client';
import { DashboardStats } from './types';

export class StatsService {
  constructor(private client: ApiClient = apiClient) {}

  async getDashboardStats(options?: RequestOptions): Promise<DashboardStats> {
    return this.client.fetchJson<DashboardStats>('/dashboard/stats', options);
  }
}

export const statsApi = new StatsService();
