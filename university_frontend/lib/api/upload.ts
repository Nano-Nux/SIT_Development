import { ApiClient, apiClient } from './client';

export class UploadService {
  constructor(private client: ApiClient = apiClient) {}

  async uploadFile(file: File): Promise<{ url: string; [key: string]: any }> {
    const formData = new FormData();
    formData.append('file', file);
    const token = typeof window !== 'undefined' ? localStorage.getItem('sit_admin_token') : null;

    const res = await fetch(`${this.client.baseUrl}/uploads`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      let errorMsg = 'File upload failed';
      try {
        const data = await res.json();
        if (data && data.message) {
          errorMsg = data.message;
        }
      } catch {
        errorMsg = res.statusText || errorMsg;
      }
      throw new Error(errorMsg);
    }

    return res.json();
  }
}

export const uploadApi = new UploadService();
