// API 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
  },
  
  // 상담
  CONSULTATION: {
    CREATE: '/api/v1/consultations',
    LIST: '/api/v1/consultations',
    DETAIL: (id: string) => `/api/v1/consultations/${id}`,
    UPDATE: (id: string) => `/api/v1/consultations/${id}`,
    DELETE: (id: string) => `/api/v1/consultations/${id}`,
  },
  
  // 후기
  REVIEWS: {
    CREATE: '/api/v1/reviews',
    LIST: '/api/v1/reviews',
    DETAIL: (id: string) => `/api/v1/reviews/${id}`,
    UPDATE: (id: string) => `/api/v1/reviews/${id}`,
    DELETE: (id: string) => `/api/v1/reviews/${id}`,
  },
  
  // 체크리스트
  CHECKLIST: {
    LIST: '/api/v1/checklists',
    DETAIL: (id: string) => `/api/v1/checklists/${id}`,
  },
  
  // 힐링 상담
  HEALING: {
    LIST: '/api/v1/healing',
    DETAIL: (id: string) => `/api/v1/healing/${id}`,
  },
};

// API 호출 함수
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      ...API_CONFIG.headers,
      ...options.headers,
    },
    ...options,
  };

  // 토큰이 있으면 헤더에 추가
  const token = localStorage.getItem('access_token');
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, defaultOptions);
  
  // 401 에러 시 토큰 갱신 시도
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.AUTH.REFRESH}`, {
          method: 'POST',
          headers: API_CONFIG.headers,
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const { access_token } = await refreshResponse.json();
          localStorage.setItem('access_token', access_token);
          
          // 원래 요청 재시도
          defaultOptions.headers = {
            ...defaultOptions.headers,
            Authorization: `Bearer ${access_token}`,
          };
          return fetch(url, defaultOptions);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
  }
  
  return response;
};

// GET 요청
export const apiGet = (endpoint: string) => 
  apiCall(endpoint, { method: 'GET' });

// POST 요청
export const apiPost = (endpoint: string, data: any) => 
  apiCall(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  });

// PUT 요청
export const apiPut = (endpoint: string, data: any) => 
  apiCall(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  });

// DELETE 요청
export const apiDelete = (endpoint: string) => 
  apiCall(endpoint, { method: 'DELETE' }); 