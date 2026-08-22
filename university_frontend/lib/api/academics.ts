import { ApiClient, apiClient, RequestOptions } from './client';
import { Department, Faculty, Major, Program, ProgramDirector } from './types';

export interface GetProgramsParams {
  departmentId?: string;
  degree?: string;
  all?: boolean;
}

export interface GetFacultyParams {
  departmentId?: string;
  isFeatured?: boolean;
}

export class AcademicsService {
  constructor(private client: ApiClient = apiClient) {}

  // --- Majors ---
  async getMajors(includeInactive = false, options?: RequestOptions): Promise<Major[]> {
    return this.client.fetchJson<Major[]>(`/majors${includeInactive ? '?all=true' : ''}`, options);
  }

  async getMajor(idOrSlug: string, options?: RequestOptions): Promise<Major> {
    return this.client.fetchJson<Major>(`/majors/${idOrSlug}`, options);
  }

  async createMajor(data: Partial<Major>): Promise<Major> {
    return this.client.fetchJson<Major>('/majors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMajor(id: string, data: Partial<Major>): Promise<Major> {
    return this.client.fetchJson<Major>(`/majors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMajor(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/majors/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderMajors(items: { id: string; order: number }[]): Promise<any> {
    return this.client.fetchJson<any>('/majors/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  }

  // --- Departments ---
  async getDepartments(options?: RequestOptions): Promise<Department[]> {
    return this.client.fetchJson<Department[]>('/departments', options);
  }

  async getDepartment(idOrSlug: string, options?: RequestOptions): Promise<Department> {
    return this.client.fetchJson<Department>(`/departments/${idOrSlug}`, options);
  }

  async createDepartment(data: Partial<Department>): Promise<Department> {
    return this.client.fetchJson<Department>('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    return this.client.fetchJson<Department>(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDepartment(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/departments/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Programs ---
  async getPrograms(params?: GetProgramsParams, options?: RequestOptions): Promise<Program[]> {
    return this.client.fetchJson<Program[]>('/programs', {
      params: params as any,
      ...options,
    });
  }

  async getProgram(idOrSlug: string, options?: RequestOptions): Promise<Program> {
    return this.client.fetchJson<Program>(`/programs/${idOrSlug}`, options);
  }

  async createProgram(data: Partial<Program>): Promise<Program> {
    return this.client.fetchJson<Program>('/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProgram(id: string, data: Partial<Program>): Promise<Program> {
    return this.client.fetchJson<Program>(`/programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProgram(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/programs/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderPrograms(items: { id: string; order: number }[]): Promise<any> {
    return this.client.fetchJson<any>('/programs/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  }

  // --- Faculty ---
  async getFaculty(params?: GetFacultyParams, options?: RequestOptions): Promise<Faculty[]> {
    return this.client.fetchJson<Faculty[]>('/faculty', {
      params: params as any,
      ...options,
    });
  }

  async createFaculty(data: Partial<Faculty>): Promise<Faculty> {
    return this.client.fetchJson<Faculty>('/faculty', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFaculty(id: string, data: Partial<Faculty>): Promise<Faculty> {
    return this.client.fetchJson<Faculty>(`/faculty/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFaculty(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/faculty/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderFaculty(items: { id: string; order: number }[]): Promise<any> {
    return this.client.fetchJson<any>('/faculty/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  }

  // --- Program Directors ---
  async getProgramDirectors(programId?: string, options?: RequestOptions): Promise<ProgramDirector[]> {
    return this.client.fetchJson<ProgramDirector[]>('/program-directors', {
      params: programId ? { programId } : undefined,
      ...options,
    });
  }

  async createProgramDirector(data: Partial<ProgramDirector>): Promise<ProgramDirector> {
    return this.client.fetchJson<ProgramDirector>('/program-directors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProgramDirector(id: string, data: Partial<ProgramDirector>): Promise<ProgramDirector> {
    return this.client.fetchJson<ProgramDirector>(`/program-directors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProgramDirector(id: string): Promise<any> {
    return this.client.fetchJson<any>(`/program-directors/${id}`, {
      method: 'DELETE',
    });
  }
}

export const academicsApi = new AcademicsService();
