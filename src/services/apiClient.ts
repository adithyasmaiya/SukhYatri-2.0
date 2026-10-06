/// <reference types="vite/client" />
// Centralized API Client for SukhYatri

export const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string) ||
  ((import.meta as any).env?.VITE_API_BASE_URL as string) ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
export const TOKEN_STORAGE_KEY = 'sukhyatri_auth_token';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
  errors?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiError extends Error {
  code?: string;
  statusCode: number;
  errors?: any;

  constructor(message: string, statusCode: number = 400, code?: string, errors?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Attach JWT Bearer token if available
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Sensible 15-second request timeout controller
  const controller = new AbortController();
  const timeoutMs = 15000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
      headers,
    });
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError(
        'Unable to connect to SukhYatri. Request timed out.',
        504,
        'NETWORK_TIMEOUT'
      );
    }
    throw new ApiError(
      'Unable to connect to SukhYatri. Please check your network connection and try again.',
      503,
      'CONNECTION_FAILED'
    );
  } finally {
    clearTimeout(timeoutId);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  let json: any;
  try {
    json = await response.json();
  } catch {
    json = { success: response.ok, message: response.statusText };
  }

  if (!response.ok) {
    // If 401 Unauthorized, notify or clear stale token if appropriate
    if (response.status === 401 && !endpoint.includes('/login') && !endpoint.includes('/register')) {
      console.warn('[ApiClient] 401 Unauthorized detected for', endpoint);
    }

    throw new ApiError(
      json.message || `Request failed with status ${response.status}`,
      response.status,
      json.code,
      json.errors
    );
  }

  // If response matches standard API envelope, unwrap data
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data as T;
  }

  return json as T;
}

export const apiClient = {
  get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return apiRequest<T>(endpoint, { method: 'GET', headers });
  },

  post<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers,
    });
  },

  put<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers,
    });
  },

  patch<T = any>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
    return apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      headers,
    });
  },

  delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return apiRequest<T>(endpoint, { method: 'DELETE', headers });
  },
};
