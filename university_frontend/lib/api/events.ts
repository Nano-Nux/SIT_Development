import { ApiClient, apiClient, RequestOptions } from './client';
import { EventItem } from './types';

export interface GetEventsParams {
  upcoming?: boolean;
  limit?: number;
  all?: boolean;
}

export class EventsService {
  constructor(private client: ApiClient = apiClient) {}

  async getEvents(params?: GetEventsParams, options?: RequestOptions): Promise<EventItem[]> {
    return this.client.fetchJson<EventItem[]>('/events', {
      params: params as any,
      ...options,
    });
  }

  async getEvent(idOrSlug: string, options?: RequestOptions): Promise<EventItem> {
    return this.client.fetchJson<EventItem>(`/events/${idOrSlug}`, options);
  }

  async createEvent(data: Partial<EventItem>): Promise<EventItem> {
    return this.client.fetchJson<EventItem>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: Partial<EventItem>): Promise<EventItem> {
    return this.client.fetchJson<EventItem>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/events/${id}`, {
      method: 'DELETE',
    });
  }
}

export const eventsApi = new EventsService();
