import { apiPost, apiGet, API_ENDPOINTS } from '../config/api';

// 상담 신청 데이터 타입
export interface ConsultationRequest {
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: string;
  main_concern: string;
  preferred_date?: string;
  preferred_time?: string;
  additional_info?: string;
}

// 상담 신청 응답 타입
export interface ConsultationResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: string;
  main_concern: string;
  preferred_date?: string;
  preferred_time?: string;
  additional_info?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// 상담 목록 응답 타입
export interface ConsultationListResponse {
  consultations: ConsultationResponse[];
  total: number;
  page: number;
  size: number;
}

// 상담 통계 타입
export interface ConsultationStats {
  total_requests: number;
  pending_requests: number;
  confirmed_requests: number;
  completed_requests: number;
  cancelled_requests: number;
}

// 상담 신청
export const createConsultation = async (data: ConsultationRequest): Promise<ConsultationResponse> => {
  try {
    const response = await apiPost(API_ENDPOINTS.CONSULTATION.CREATE, data);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '상담 신청에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('상담 신청 오류:', error);
    throw error;
  }
};

// 상담 목록 조회
export const getConsultations = async (
  page: number = 1,
  size: number = 10,
  status?: string
): Promise<ConsultationListResponse> => {
  try {
    let url = `${API_ENDPOINTS.CONSULTATION.LIST}?page=${page}&size=${size}`;
    if (status) {
      url += `&status=${status}`;
    }
    
    const response = await apiGet(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '상담 목록 조회에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('상담 목록 조회 오류:', error);
    throw error;
  }
};

// 상담 상세 조회
export const getConsultation = async (id: number): Promise<ConsultationResponse> => {
  try {
    const response = await apiGet(API_ENDPOINTS.CONSULTATION.DETAIL(id.toString()));
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '상담 상세 조회에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('상담 상세 조회 오류:', error);
    throw error;
  }
};

// 상담 통계 조회
export const getConsultationStats = async (): Promise<ConsultationStats> => {
  try {
    const response = await apiGet(`${API_ENDPOINTS.CONSULTATION.LIST}/stats/overview`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '상담 통계 조회에 실패했습니다.');
    }
    
    return await response.json();
  } catch (error) {
    console.error('상담 통계 조회 오류:', error);
    throw error;
  }
}; 