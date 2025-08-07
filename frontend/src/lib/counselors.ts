import { apiClient, API_ENDPOINTS } from './api';

// 백엔드에서 받아오는 실제 데이터 구조
export interface CounselorResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  education: string;
  experience: string;
  certification: string;
  bio: string;
  profile_image: string;
  is_online: boolean;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string | null;
}

// 프론트엔드에서 사용하는 구조
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

// 백엔드 데이터를 프론트엔드 구조로 변환
function mapCounselorResponse(response: CounselorResponse): Counselor {
  // 경력에서 숫자만 추출 (예: "10년" -> 10)
  const experienceYears = parseInt(response.experience.replace(/[^0-9]/g, '')) || 0;
  
  return {
    id: response.id.toString(),
    name: response.name,
    specialization: response.specialization,
    experience_years: experienceYears,
    education: response.education,
    description: response.bio,
    image_url: response.profile_image || undefined,
    created_at: response.created_at,
    updated_at: response.updated_at || response.created_at
  };
}

// 모든 상담사 목록 가져오기
export async function getCounselors(): Promise<Counselor[]> {
  try {
    console.log('🔄 상담사 목록을 가져오는 중...');
    console.log('📡 API URL:', `${apiClient['baseURL']}${API_ENDPOINTS.COUNSELORS}`);
    
    const response = await apiClient.get<{counselors: CounselorResponse[], total: number, page: number, size: number}>(API_ENDPOINTS.COUNSELORS);
    console.log('✅ 상담사 목록 가져오기 성공:', response);
    console.log('📊 response.data:', response.data);
    
    // 백엔드 응답 구조에서 counselors 배열을 추출하고 매핑
    const counselors = response.data?.counselors || [];
    console.log('👥 원본 counselors 배열:', counselors);
    console.log('📏 counselors 배열 길이:', counselors.length);
    
    const mappedCounselors = counselors.map(mapCounselorResponse);
    console.log('🔄 매핑된 counselors:', mappedCounselors);
    console.log('📏 매핑된 배열 길이:', mappedCounselors.length);
    
    return mappedCounselors;
  } catch (error) {
    console.error('❌ 상담사 목록을 가져오는데 실패했습니다:', error);
    return [];
  }
}

// 특정 상담사 정보 가져오기
export async function getCounselor(id: string): Promise<Counselor | null> {
  try {
    console.log('🔄 상담사 정보를 가져오는 중...', id);
    const response = await apiClient.get<CounselorResponse>(API_ENDPOINTS.COUNSELOR(id));
    console.log('✅ 상담사 정보 가져오기 성공:', response);
    return response.data ? mapCounselorResponse(response.data) : null;
  } catch (error) {
    console.error('❌ 상담사 정보를 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 상담사 생성 (관리자용)
export async function createCounselor(data: CreateCounselorRequest): Promise<Counselor | null> {
  try {
    console.log('🔄 상담사 생성 중...', data);
    const response = await apiClient.post<CounselorResponse>(API_ENDPOINTS.COUNSELORS, data);
    console.log('✅ 상담사 생성 성공:', response);
    return response.data ? mapCounselorResponse(response.data) : null;
  } catch (error) {
    console.error('❌ 상담사 생성에 실패했습니다:', error);
    return null;
  }
}

// 상담사 정보 수정 (관리자용)
export async function updateCounselor(data: UpdateCounselorRequest): Promise<Counselor | null> {
  try {
    console.log('🔄 상담사 정보 수정 중...', data);
    const response = await apiClient.put<CounselorResponse>(API_ENDPOINTS.COUNSELOR(data.id), data);
    console.log('✅ 상담사 정보 수정 성공:', response);
    return response.data ? mapCounselorResponse(response.data) : null;
  } catch (error) {
    console.error('❌ 상담사 정보 수정에 실패했습니다:', error);
    return null;
  }
}

// 상담사 삭제 (관리자용)
export async function deleteCounselor(id: string): Promise<boolean> {
  try {
    console.log('🔄 상담사 삭제 중...', id);
    await apiClient.delete(API_ENDPOINTS.COUNSELOR(id));
    console.log('✅ 상담사 삭제 성공');
    return true;
  } catch (error) {
    console.error('❌ 상담사 삭제에 실패했습니다:', error);
    return false;
  }
}
