import { apiClient, API_ENDPOINTS } from './api';

// 백엔드에서 받아오는 실제 데이터 구조
export interface ConsultationResponse {
  id: number;
  user_id: number;
  counselor_id?: number;
  consultation_type: 'INDIVIDUAL' | 'COUPLE' | 'FAMILY' | 'YOUTH' | 'TRAUMA' | 'OTHER';
  status: 'PENDING' | 'REVIEWING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  urgency_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  title: string;
  description: string;
  preferred_date?: string;
  preferred_time?: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  notes?: string;
  is_confidential: boolean;
  created_at: string;
  updated_at?: string;
}

// 프론트엔드에서 사용하는 구조
export interface Consultation {
  id: string;
  consultation_type: string;
  title: string;
  description: string;
  preferred_date?: string;
  preferred_time?: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  urgency_level: string;
  is_confidential: boolean;
  status: string;
  counselor_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateConsultationRequest {
  consultation_type: 'INDIVIDUAL' | 'COUPLE' | 'FAMILY' | 'YOUTH' | 'TRAUMA' | 'OTHER';
  title: string;
  description: string;
  preferred_date?: string;
  preferred_time?: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  urgency_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  is_confidential?: boolean;
  counselor_id?: string;
}

export interface UpdateConsultationRequest extends Partial<CreateConsultationRequest> {
  id: string;
  status?: 'PENDING' | 'REVIEWING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

// 백엔드 데이터를 프론트엔드 구조로 변환
function mapConsultationResponse(response: ConsultationResponse): Consultation {
  return {
    id: response.id.toString(),
    consultation_type: response.consultation_type,
    title: response.title,
    description: response.description,
    preferred_date: response.preferred_date,
    preferred_time: response.preferred_time,
    contact_name: response.contact_name,
    contact_phone: response.contact_phone,
    contact_email: response.contact_email,
    urgency_level: response.urgency_level,
    is_confidential: response.is_confidential,
    status: response.status,
    counselor_id: response.counselor_id?.toString(),
    created_at: response.created_at,
    updated_at: response.updated_at
  };
}

// 날짜를 ISO 8601 형식으로 변환
function formatDateForAPI(dateString: string): string {
  if (!dateString) return '';
  return `${dateString}T00:00:00`;
}

// 상담 신청 생성
export async function createConsultation(data: CreateConsultationRequest): Promise<Consultation | null> {
  try {
    // 날짜 형식 변환
    const apiData = {
      ...data,
      preferred_date: data.preferred_date ? formatDateForAPI(data.preferred_date) : undefined
    };
    
    const response = await apiClient.post<ConsultationResponse>(API_ENDPOINTS.CONSULTATIONS, apiData);
    return response.data ? mapConsultationResponse(response.data) : null;
  } catch (error) {
    console.error('상담 신청에 실패했습니다:', error);
    return null;
  }
}

// 사용자의 상담 목록 가져오기
export async function getUserConsultations(): Promise<Consultation[]> {
  try {
    const response = await apiClient.get<{consultations: ConsultationResponse[], total: number, page: number, size: number}>(API_ENDPOINTS.CONSULTATIONS);
    const consultations = response.data?.consultations || [];
    return consultations.map(mapConsultationResponse);
  } catch (error) {
    console.error('상담 목록을 가져오는데 실패했습니다:', error);
    return [];
  }
}

// 특정 상담 정보 가져오기
export async function getConsultation(id: string): Promise<Consultation | null> {
  try {
    const response = await apiClient.get<ConsultationResponse>(API_ENDPOINTS.CONSULTATION(id));
    return response.data ? mapConsultationResponse(response.data) : null;
  } catch (error) {
    console.error('상담 정보를 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 상담 정보 수정
export async function updateConsultation(data: UpdateConsultationRequest): Promise<Consultation | null> {
  try {
    const response = await apiClient.put<ConsultationResponse>(API_ENDPOINTS.CONSULTATION(data.id), data);
    return response.data ? mapConsultationResponse(response.data) : null;
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
