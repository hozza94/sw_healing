import { apiClient, API_ENDPOINTS } from './api';

export interface Counselor {
  id: string;
  name: string;
  specialization: string;
  experience_years: number;
  education: string;
  description: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCounselorRequest {
  name: string;
  specialization: string;
  experience_years: number;
  education: string;
  description: string;
  image_url?: string;
}

export interface UpdateCounselorRequest extends Partial<CreateCounselorRequest> {
  id: string;
}

// 모든 상담사 목록 가져오기
export async function getCounselors(): Promise<Counselor[]> {
  try {
    const response = await apiClient.get<Counselor[]>(API_ENDPOINTS.COUNSELORS);
    return response.data || [];
  } catch (error) {
    console.error('상담사 목록을 가져오는데 실패했습니다:', error);
    return [];
  }
}

// 특정 상담사 정보 가져오기
export async function getCounselor(id: string): Promise<Counselor | null> {
  try {
    const response = await apiClient.get<Counselor>(API_ENDPOINTS.COUNSELOR(id));
    return response.data || null;
  } catch (error) {
    console.error('상담사 정보를 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 상담사 생성 (관리자용)
export async function createCounselor(data: CreateCounselorRequest): Promise<Counselor | null> {
  try {
    const response = await apiClient.post<Counselor>(API_ENDPOINTS.COUNSELORS, data);
    return response.data || null;
  } catch (error) {
    console.error('상담사 생성에 실패했습니다:', error);
    return null;
  }
}

// 상담사 정보 수정 (관리자용)
export async function updateCounselor(data: UpdateCounselorRequest): Promise<Counselor | null> {
  try {
    const response = await apiClient.put<Counselor>(API_ENDPOINTS.COUNSELOR(data.id), data);
    return response.data || null;
  } catch (error) {
    console.error('상담사 정보 수정에 실패했습니다:', error);
    return null;
  }
}

// 상담사 삭제 (관리자용)
export async function deleteCounselor(id: string): Promise<boolean> {
  try {
    await apiClient.delete(API_ENDPOINTS.COUNSELOR(id));
    return true;
  } catch (error) {
    console.error('상담사 삭제에 실패했습니다:', error);
    return false;
  }
}
