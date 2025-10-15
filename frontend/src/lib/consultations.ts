import { apiClient, API_ENDPOINTS } from './api';

export interface Consultation {
  id: number;
  user_id: number;
  counselor_id: number;
  consultation_type: string;
  urgency_level: string;
  description: string;
  scheduled_at: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultationList {
  consultations: Consultation[];
  total: number;
  page: number;
  size: number;
}

export interface CreateConsultationRequest {
  counselor_id: number;
  consultation_type: 'INDIVIDUAL' | 'COUPLE' | 'FAMILY' | 'GROUP';
  urgency_level: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  scheduled_at: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  title?: string;
  preferred_date?: string;
  preferred_time?: string;
  is_confidential?: boolean;
}

// 상담 상태 정의
export const CONSULTATION_STATUS = {
  PENDING: 'PENDING',        // 대기중 (신청 접수)
  REVIEWING: 'REVIEWING',    // 검토중 (상담사가 검토)
  CONFIRMED: 'CONFIRMED',    // 확정됨 (상담사가 수락)
  SCHEDULED: 'SCHEDULED',    // 일정 확정 (구체적 시간 확정)
  IN_PROGRESS: 'IN_PROGRESS', // 진행중 (상담 시작)
  COMPLETED: 'COMPLETED',    // 완료됨 (상담 종료)
  CANCELLED: 'CANCELLED',    // 취소됨 (신청자 또는 상담사 취소)
  REJECTED: 'REJECTED'       // 거절됨 (상담사가 거절)
} as const;

// 상담 상태별 한글 표시
export const CONSULTATION_STATUS_LABELS = {
  [CONSULTATION_STATUS.PENDING]: '대기중',
  [CONSULTATION_STATUS.REVIEWING]: '검토중',
  [CONSULTATION_STATUS.CONFIRMED]: '수락됨',
  [CONSULTATION_STATUS.SCHEDULED]: '일정확정',
  [CONSULTATION_STATUS.IN_PROGRESS]: '진행중',
  [CONSULTATION_STATUS.COMPLETED]: '완료됨',
  [CONSULTATION_STATUS.CANCELLED]: '취소됨',
  [CONSULTATION_STATUS.REJECTED]: '거절됨'
} as const;

// 상담 상태별 색상
export const CONSULTATION_STATUS_COLORS = {
  [CONSULTATION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [CONSULTATION_STATUS.REVIEWING]: 'bg-blue-100 text-blue-800',
  [CONSULTATION_STATUS.CONFIRMED]: 'bg-green-100 text-green-800',
  [CONSULTATION_STATUS.SCHEDULED]: 'bg-purple-100 text-purple-800',
  [CONSULTATION_STATUS.IN_PROGRESS]: 'bg-orange-100 text-orange-800',
  [CONSULTATION_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800',
  [CONSULTATION_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
  [CONSULTATION_STATUS.REJECTED]: 'bg-red-100 text-red-800'
} as const;

export interface UpdateConsultationStatusRequest {
  status: keyof typeof CONSULTATION_STATUS;
  scheduled_at?: string;
  reason?: string;
}

export interface UpdateConsultationRequest {
  consultation_type?: 'INDIVIDUAL' | 'COUPLE' | 'FAMILY' | 'GROUP';
  urgency_level?: 'LOW' | 'MEDIUM' | 'HIGH';
  description?: string;
  scheduled_at?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

// 상담 신청 목록 조회
export async function getConsultations(): Promise<ConsultationList | null> {
  try {
    console.log('getConsultations 호출 시작');
    const response = await apiClient.get<{success: boolean, data: {consultations: Consultation[], count: number}, timestamp: string}>(API_ENDPOINTS.CONSULTATIONS);
    console.log('getConsultations API 응답:', response);
    
    // 백엔드 응답 구조: {success: true, data: {consultations: [...], count: 5}, timestamp: "..."}
    if (response.data && response.data.data && response.data.data.consultations) {
      console.log('getConsultations 성공 - 새로운 구조 응답:', response.data.data.consultations);
      return {
        consultations: response.data.data.consultations,
        total: response.data.data.count,
        page: 1,
        size: response.data.data.count
      };
    }
    
    // 기존 구조: {data: {consultations: [...], count: 5}}
    if (response.data && response.data.consultations) {
      console.log('getConsultations 성공 - 기존 구조 응답:', response.data.consultations);
      return {
        consultations: response.data.consultations,
        total: response.data.count,
        page: 1,
        size: response.data.count
      };
    }
    
    console.log('getConsultations 실패 - 지원되지 않는 응답 구조');
    return null;
  } catch (error) {
    console.error('상담 신청 목록을 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 특정 상담 신청 조회
export async function getConsultation(id: string): Promise<Consultation | null> {
  try {
    const response = await apiClient.get<Consultation>(API_ENDPOINTS.CONSULTATION(id));
    return response.data || null;
  } catch (error) {
    console.error('상담 신청 정보를 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 상담 상태 업데이트
export async function updateConsultationStatus(
  id: string, 
  data: UpdateConsultationStatusRequest
): Promise<{ success: boolean; message: string } | null> {
  try {
    console.log('상담 상태 업데이트 시작:', { id, data });
    const response = await apiClient.patch<{ success: boolean; data: { message: string } }>(
      API_ENDPOINTS.CONSULTATION(id), 
      data
    );
    console.log('상담 상태 업데이트 API 응답:', response);
    
    if (response.data && response.data.data) {
      console.log('상담 상태 업데이트 성공:', response.data.data);
      return {
        success: true,
        message: response.data.data.message
      };
    }
    return null;
  } catch (error) {
    console.error('상담 상태 업데이트에 실패했습니다:', error);
    throw error;
  }
}

// 상담 신청 생성
export async function createConsultation(data: CreateConsultationRequest): Promise<Consultation | null> {
  try {
    const response = await apiClient.post<Consultation>(API_ENDPOINTS.CONSULTATIONS, data);
    return response.data || null;
  } catch (error) {
    console.error('상담 신청에 실패했습니다:', error);
    throw error;
  }
}

// 상담 신청 수정
export async function updateConsultation(id: string, data: UpdateConsultationRequest): Promise<Consultation | null> {
  try {
    const response = await apiClient.put<Consultation>(API_ENDPOINTS.CONSULTATION(id), data);
    return response.data || null;
  } catch (error) {
    console.error('상담 신청 수정에 실패했습니다:', error);
    return null;
  }
}

// 상담 신청 삭제
export async function deleteConsultation(id: string): Promise<boolean> {
  try {
    await apiClient.delete(API_ENDPOINTS.CONSULTATION(id));
    return true;
  } catch (error) {
    console.error('상담 신청 삭제에 실패했습니다:', error);
    return false;
  }
}
