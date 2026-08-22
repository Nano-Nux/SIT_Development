import { ApiClient, apiClient, RequestOptions } from './client';
import {
  AdmissionRequirement,
  AdmissionTimeline,
  ApplicationReminder,
  AdmissionFaq,
  ApplicationMaterial,
  ApplicationSubmission,
  PaginatedResponse,
  RequestInfoSubmission,
} from './types';

export interface GetApplicationsParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetRequestInfoParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export class AdmissionsService {
  constructor(private client: ApiClient = apiClient) {}

  // --- Timelines ---
  async getTimelines(options?: RequestOptions): Promise<AdmissionTimeline[]> {
    return this.client.fetchJson<AdmissionTimeline[]>('/admissions/timeline', options);
  }

  async getAdmissionTimeline(options?: RequestOptions): Promise<AdmissionTimeline[]> {
    return this.getTimelines(options);
  }

  async createTimeline(data: Partial<AdmissionTimeline>): Promise<AdmissionTimeline> {
    return this.client.fetchJson<AdmissionTimeline>('/admissions/timeline', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createAdmissionTimeline(data: Partial<AdmissionTimeline>): Promise<AdmissionTimeline> {
    return this.createTimeline(data);
  }

  async updateTimeline(id: string, data: Partial<AdmissionTimeline>): Promise<AdmissionTimeline> {
    return this.client.fetchJson<AdmissionTimeline>(`/admissions/timeline/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTimeline(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/admissions/timeline/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteAdmissionTimeline(id: string): Promise<any> {
    return this.deleteTimeline(id);
  }

  // --- Reminders ---
  async getReminders(includeInactive?: boolean, options?: RequestOptions): Promise<ApplicationReminder[]> {
    return this.client.fetchJson<ApplicationReminder[]>(
      `/admissions/reminders${includeInactive ? '?includeInactive=true' : ''}`,
      options
    );
  }

  async createReminder(data: Partial<ApplicationReminder>): Promise<ApplicationReminder> {
    return this.client.fetchJson<ApplicationReminder>('/admissions/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReminder(id: string, data: Partial<ApplicationReminder>): Promise<ApplicationReminder> {
    return this.client.fetchJson<ApplicationReminder>(`/admissions/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReminder(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/admissions/reminders/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Requirements ---
  async getRequirements(category?: string, degreeLevel?: string, options?: RequestOptions): Promise<AdmissionRequirement[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (degreeLevel) params.append('degreeLevel', degreeLevel);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.client.fetchJson<AdmissionRequirement[]>(`/admissions/requirements${qs}`, options);
  }

  async getAdmissionRequirements(degreeLevel?: string, options?: RequestOptions): Promise<AdmissionRequirement[]> {
    return this.getRequirements(undefined, degreeLevel, options);
  }

  async createRequirement(data: Partial<AdmissionRequirement>): Promise<AdmissionRequirement> {
    return this.client.fetchJson<AdmissionRequirement>('/admissions/requirements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createAdmissionRequirement(data: Partial<AdmissionRequirement>): Promise<AdmissionRequirement> {
    return this.createRequirement(data);
  }

  async updateRequirement(id: string, data: Partial<AdmissionRequirement>): Promise<AdmissionRequirement> {
    return this.client.fetchJson<AdmissionRequirement>(`/admissions/requirements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRequirement(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/admissions/requirements/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteAdmissionRequirement(id: string): Promise<any> {
    return this.deleteRequirement(id);
  }

  // --- FAQs ---
  async getFaqs(category?: string, includeInactive?: boolean, options?: RequestOptions): Promise<AdmissionFaq[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (includeInactive) params.append('includeInactive', 'true');
    const qs = params.toString() ? `?${params.toString()}` : '';
    return this.client.fetchJson<AdmissionFaq[]>(`/admissions/faqs${qs}`, options);
  }

  async createFaq(data: Partial<AdmissionFaq>): Promise<AdmissionFaq> {
    return this.client.fetchJson<AdmissionFaq>('/admissions/faqs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFaq(id: string, data: Partial<AdmissionFaq>): Promise<AdmissionFaq> {
    return this.client.fetchJson<AdmissionFaq>(`/admissions/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFaq(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/admissions/faqs/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Downloadable Application Materials ---
  async getMaterials(includeInactive?: boolean, options?: RequestOptions): Promise<ApplicationMaterial[]> {
    const qs = includeInactive ? '?includeInactive=true' : '';
    return this.client.fetchJson<ApplicationMaterial[]>(`/admissions/materials${qs}`, options);
  }

  async createMaterial(data: Partial<ApplicationMaterial>): Promise<ApplicationMaterial> {
    return this.client.fetchJson<ApplicationMaterial>('/admissions/materials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMaterial(id: string, data: Partial<ApplicationMaterial>): Promise<ApplicationMaterial> {
    return this.client.fetchJson<ApplicationMaterial>(`/admissions/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMaterial(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/admissions/materials/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Applications (Apply Now) ---
  async submitApplication(data: Partial<ApplicationSubmission>): Promise<ApplicationSubmission> {
    return this.client.fetchJson<ApplicationSubmission>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getApplications(
    params?: GetApplicationsParams,
    options?: RequestOptions
  ): Promise<PaginatedResponse<ApplicationSubmission>> {
    return this.client.fetchJson<PaginatedResponse<ApplicationSubmission>>('/applications', {
      params: params as any,
      ...options,
    });
  }

  async updateApplicationStatus(id: string, status: string, notes?: string): Promise<ApplicationSubmission> {
    return this.client.fetchJson<ApplicationSubmission>(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  async deleteApplication(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Request Info ---
  async submitRequestInfo(data: Partial<RequestInfoSubmission>): Promise<RequestInfoSubmission> {
    return this.client.fetchJson<RequestInfoSubmission>('/request-info', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRequestInfos(
    params?: GetRequestInfoParams,
    options?: RequestOptions
  ): Promise<PaginatedResponse<RequestInfoSubmission>> {
    return this.client.fetchJson<PaginatedResponse<RequestInfoSubmission>>('/request-info', {
      params: params as any,
      ...options,
    });
  }

  async getRequestInfo(
    params?: GetRequestInfoParams,
    options?: RequestOptions
  ): Promise<PaginatedResponse<RequestInfoSubmission>> {
    return this.getRequestInfos(params, options);
  }

  async updateRequestInfoStatus(id: string, status: string, notes?: string): Promise<RequestInfoSubmission> {
    return this.client.fetchJson<RequestInfoSubmission>(`/request-info/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
  }

  async deleteRequestInfo(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/request-info/${id}`, {
      method: 'DELETE',
    });
  }
}

export const admissionsApi = new AdmissionsService();
