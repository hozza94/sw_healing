const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8000';

// 환경 변수 디버깅
console.log('API_BASE_URL:', API_BASE_URL);
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

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
    // trailing slash 제거
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
    const url = `${this.baseURL}${cleanEndpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      redirect: 'error', // 리다이렉트 방지
    };

    try {
      const response = await fetch(url, config);
      
      // 리다이렉트 처리
      if (response.redirected) {
        console.log('리다이렉트 발생:', response.url);
      }
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // 백엔드에서 직접 데이터를 반환하므로 ApiResponse 구조로 래핑
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

// API 엔드포인트 상수
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
  HEALTH: '/health',
} as const;
