import { ApiClient, apiClient } from './client';
import { AuthResponse, User } from './types';

export class AuthService {
  constructor(private client: ApiClient = apiClient) {}

  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    const data = await this.client.fetchJson<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (typeof window !== 'undefined' && data.accessToken) {
      localStorage.setItem('sit_admin_token', data.accessToken);
      localStorage.setItem('sit_admin_user', JSON.stringify(data.user));
    }
    return data;
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sit_admin_token');
      localStorage.removeItem('sit_admin_user');
    }
  }

  async getMe(): Promise<User> {
    return this.client.fetchJson<User>('/auth/me');
  }
}

export const authApi = new AuthService();
