import { apiClient, API_ENDPOINTS } from './api';

export interface Consultation {
  id: string;
  user_id: string;
  counselor_id: string;
  consultation_type: string;
  preferred_date: string;
  preferred_time: string;
  consultation_method: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CreateConsultationRequest {
  counselor_id: string;
  consultation_type: string;
  preferred_date: string;
  preferred_time: string;
  consultation_method: string;
  description: string;
}

export interface UpdateConsultationRequest extends Partial<CreateConsultationRequest> {
  id: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// 상담 신청 생성
export async function createConsultation(data: CreateConsultationRequest): Promise<Consultation | null> {
  try {
    const response = await apiClient.post<Consultation>(API_ENDPOINTS.CONSULTATIONS, data);
    return response.data || null;
  } catch (error) {
    console.error('상담 신청에 실패했습니다:', error);
    return null;
  }
}

// 사용자의 상담 목록 가져오기
export async function getUserConsultations(userId: string): Promise<Consultation[]> {
  try {
    const response = await apiClient.get<Consultation[]>(`${API_ENDPOINTS.CONSULTATIONS}?user_id=${userId}`);
    return response.data || [];
  } catch (error) {
    console.error('상담 목록을 가져오는데 실패했습니다:', error);
    return [];
  }
}

// 특정 상담 정보 가져오기
export async function getConsultation(id: string): Promise<Consultation | null> {
  try {
    const response = await apiClient.get<Consultation>(API_ENDPOINTS.CONSULTATION(id));
    return response.data || null;
  } catch (error) {
    console.error('상담 정보를 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 상담 정보 수정
export async function updateConsultation(data: UpdateConsultationRequest): Promise<Consultation | null> {
  try {
    const response = await apiClient.put<Consultation>(API_ENDPOINTS.CONSULTATION(data.id), data);
    return response.data || null;
  } catch (error) {
    console.error('상담 정보 수정에 실패했습니다:', error);
    return null;
  }
}

// 상담 취소
export async function cancelConsultation(id: string): Promise<boolean> {
  try {
    await apiClient.put(API_ENDPOINTS.CONSULTATION(id), { status: 'cancelled' });
    return true;
  } catch (error) {
    console.error('상담 취소에 실패했습니다:', error);
    return false;
  }
}
