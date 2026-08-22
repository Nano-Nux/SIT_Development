import { ApiClient, apiClient, RequestOptions } from './client';
import {
  CampusFacility,
  ContactInfo,
  CoreValue,
  HeroData,
  Partner,
  Spotlight,
  StudentLifeActivity,
} from './types';

export class ContentService {
  constructor(private client: ApiClient = apiClient) {}

  // --- Hero ---
  async getHero(page: string, options?: RequestOptions): Promise<HeroData> {
    return this.client.fetchJson<HeroData>(`/hero/${page}`, options);
  }

  async getAllHeroes(options?: RequestOptions): Promise<HeroData[]> {
    return this.client.fetchJson<HeroData[]>('/hero', options);
  }

  async updateHero(page: string, data: Partial<HeroData>): Promise<HeroData> {
    return this.client.fetchJson<HeroData>(`/hero/${page}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async upsertHero(data: Partial<HeroData>): Promise<HeroData> {
    return this.client.fetchJson<HeroData>('/hero', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // --- Core Values ---
  async getCoreValues(includeInactive = false, options?: RequestOptions): Promise<CoreValue[]> {
    return this.client.fetchJson<CoreValue[]>(`/core-values${includeInactive ? '?all=true' : ''}`, options);
  }

  async createCoreValue(data: Partial<CoreValue>): Promise<CoreValue> {
    return this.client.fetchJson<CoreValue>('/core-values', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCoreValue(id: string, data: Partial<CoreValue>): Promise<CoreValue> {
    return this.client.fetchJson<CoreValue>(`/core-values/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCoreValue(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/core-values/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderCoreValues(items: { id: string; order: number }[]): Promise<any> {
    return this.client.fetchJson<any>('/core-values/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  }

  // --- Spotlights ---
  async getSpotlights(type?: string, all = false, options?: RequestOptions): Promise<Spotlight[]> {
    return this.client.fetchJson<Spotlight[]>('/spotlights', {
      params: { type, all: all ? 'true' : undefined },
      ...options,
    });
  }

  async createSpotlight(data: Partial<Spotlight>): Promise<Spotlight> {
    return this.client.fetchJson<Spotlight>('/spotlights', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSpotlight(id: string, data: Partial<Spotlight>): Promise<Spotlight> {
    return this.client.fetchJson<Spotlight>(`/spotlights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSpotlight(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/spotlights/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Partners ---
  async getPartners(type?: string, all = false, options?: RequestOptions): Promise<Partner[]> {
    return this.client.fetchJson<Partner[]>('/partners', {
      params: { type, all: all ? 'true' : undefined },
      ...options,
    });
  }

  async createPartner(data: Partial<Partner>): Promise<Partner> {
    return this.client.fetchJson<Partner>('/partners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePartner(id: string, data: Partial<Partner>): Promise<Partner> {
    return this.client.fetchJson<Partner>(`/partners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePartner(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/partners/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Campus Facilities ---
  async getCampusFacilities(options?: RequestOptions): Promise<CampusFacility[]> {
    return this.client.fetchJson<CampusFacility[]>('/campus-facilities', options);
  }

  async createCampusFacility(data: Partial<CampusFacility>): Promise<CampusFacility> {
    return this.client.fetchJson<CampusFacility>('/campus-facilities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampusFacility(id: string, data: Partial<CampusFacility>): Promise<CampusFacility> {
    return this.client.fetchJson<CampusFacility>(`/campus-facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampusFacility(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/campus-facilities/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Student Life ---
  async getStudentLife(category?: string, options?: RequestOptions): Promise<StudentLifeActivity[]> {
    return this.client.fetchJson<StudentLifeActivity[]>('/student-life', {
      params: { category },
      ...options,
    });
  }

  async createStudentLife(data: Partial<StudentLifeActivity>): Promise<StudentLifeActivity> {
    return this.client.fetchJson<StudentLifeActivity>('/student-life', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStudentLife(id: string, data: Partial<StudentLifeActivity>): Promise<StudentLifeActivity> {
    return this.client.fetchJson<StudentLifeActivity>(`/student-life/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStudentLife(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/student-life/${id}`, {
      method: 'DELETE',
    });
  }

  // --- About Section (Founder, Vision/Mission, Members, History) ---
  async getFounder(options?: RequestOptions): Promise<any> {
    return this.client.fetchJson<any>('/about/founder', options);
  }

  async updateFounder(data: any): Promise<any> {
    return this.client.fetchJson<any>('/about/founder', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async upsertFounder(data: any): Promise<any> {
    return this.client.fetchJson<any>('/about/founder', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getVisionMission(options?: RequestOptions): Promise<any> {
    return this.client.fetchJson<any>('/about/vision-mission', options);
  }

  async updateVisionMission(data: any): Promise<any> {
    return this.client.fetchJson<any>('/about/vision-mission', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async upsertVisionMission(data: any): Promise<any> {
    return this.client.fetchJson<any>('/about/vision-mission', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getMembers(category?: string, options?: RequestOptions): Promise<any[]> {
    return this.client.fetchJson<any[]>('/about/members', {
      params: { category },
      ...options,
    });
  }

  async createMember(data: any): Promise<any> {
    return this.client.fetchJson<any>('/about/members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMember(id: string, data: any): Promise<any> {
    return this.client.fetchJson<any>(`/about/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMember(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/about/members/${id}`, {
      method: 'DELETE',
    });
  }

  async getHistory(options?: RequestOptions): Promise<any[]> {
    return this.client.fetchJson<any[]>('/about/history', options);
  }

  async createHistory(data: any): Promise<any> {
    return this.client.fetchJson<any>('/about/history', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateHistory(id: string, data: any): Promise<any> {
    return this.client.fetchJson<any>(`/about/history/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteHistory(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/about/history/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Contact ---
  async getContact(options?: RequestOptions): Promise<ContactInfo> {
    return this.client.fetchJson<ContactInfo>('/contact', options);
  }

  async updateContact(data: Partial<ContactInfo>): Promise<ContactInfo> {
    return this.client.fetchJson<ContactInfo>('/contact', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const contentApi = new ContentService();
