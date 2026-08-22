export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export class ApiClient {
  public readonly baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  public getAuthHeader(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    try {
      const token = localStorage.getItem('sit_admin_token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
      return {};
    }
  }

  public buildQuery(params?: Record<string, string | number | boolean | undefined | null>): string {
    if (!params) return '';
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    return qs ? `?${qs}` : '';
  }

  async fetchJson<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...restOptions } = options;
    const queryString = this.buildQuery(params);
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${normalizedEndpoint}${queryString}`;

    const mergedHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...((headers as Record<string, string>) || {}),
    };

    const res = await fetch(url, {
      ...restOptions,
      headers: mergedHeaders,
    });

    if (!res.ok) {
      let errorMsg = `Request failed with status ${res.status}`;
      let errorData: any = null;
      try {
        errorData = await res.json();
        if (errorData && typeof errorData === 'object' && errorData.message) {
          errorMsg = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.message;
        }
      } catch {
        errorMsg = res.statusText || errorMsg;
      }
      throw new ApiError(errorMsg, res.status, errorData);
    }

    return res.json();
  }
}

export const apiClient = new ApiClient();
