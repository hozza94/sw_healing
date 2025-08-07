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
    const response = await apiClient.get<ConsultationList>(API_ENDPOINTS.CONSULTATIONS);
    return response.data;
  } catch (error) {
    console.error('상담 신청 목록을 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 특정 상담 신청 조회
export async function getConsultation(id: string): Promise<Consultation | null> {
  try {
    const response = await apiClient.get<Consultation>(API_ENDPOINTS.CONSULTATION(id));
    return response.data;
  } catch (error) {
    console.error('상담 신청 정보를 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 상담 신청 생성
export async function createConsultation(data: CreateConsultationRequest): Promise<Consultation | null> {
  try {
    const response = await apiClient.post<Consultation>(API_ENDPOINTS.CONSULTATIONS, data);
    return response.data;
  } catch (error) {
    console.error('상담 신청에 실패했습니다:', error);
    throw error;
  }
}

// 상담 신청 수정
export async function updateConsultation(id: string, data: UpdateConsultationRequest): Promise<Consultation | null> {
  try {
    const response = await apiClient.put<Consultation>(API_ENDPOINTS.CONSULTATION(id), data);
    return response.data;
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
