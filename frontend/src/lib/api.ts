// Vercel API Routes를 사용하므로 상대 경로 사용
const API_BASE_URL = '';

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return {
        data: data,
        message: 'Success'
      };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// API 클라이언트 인스턴스 생성
export const apiClient = new ApiClient(API_BASE_URL);

// API 엔드포인트 상수 (Vercel API Routes)
export const API_ENDPOINTS = {
  // 상담 관련
  CONSULTATIONS: '/api/consultations',
  CONSULTATION: (id: string) => `/api/consultations/${id}`,
  
  // 상담사 관련
  COUNSELORS: '/api/counselors',
  COUNSELOR: (id: string) => `/api/counselors/${id}`,
  
  // 리뷰 관련
  REVIEWS: '/api/reviews',
  REVIEW: (id: string) => `/api/reviews/${id}`,
  
  // 공지사항 관련
  NOTICES: '/api/notices',
  NOTICE: (id: string) => `/api/notices/${id}`,
  
  // 인증 관련
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_REFRESH: '/api/auth/refresh',
  
  // 헬스 체크
  HEALTH: '/api/health',
} as const;
