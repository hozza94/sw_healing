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
  email: string;
  phone?: string;
  specialization?: string;
  experience?: string;
  education?: string;
  certification?: string;
  bio?: string;
  profile_image?: string;
  is_online: boolean;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCounselorRequest {
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  education?: string;
  experience?: string;
  certification?: string;
  bio?: string;
  profile_image?: string;
}

export interface UpdateCounselorRequest extends Partial<CreateCounselorRequest> {
  id: string;
  is_online?: boolean;
  is_active?: boolean;
}

// 백엔드 데이터를 프론트엔드 구조로 변환
function mapCounselorResponse(response: CounselorResponse): Counselor {
  // 경력에서 숫자만 추출 (예: "10년" -> 10)
  const experienceYears = parseInt(response.experience.replace(/[^0-9]/g, '')) || 0;
  
  return {
    id: response.id.toString(),
    name: response.name,
    email: response.email,
    phone: response.phone,
    specialization: response.specialization,
    experience: response.experience,
    education: response.education,
    certification: response.certification,
    bio: response.bio,
    profile_image: response.profile_image || undefined,
    is_online: response.is_online,
    is_active: response.is_active,
    rating: response.rating,
    total_reviews: response.total_reviews,
    created_at: response.created_at,
    updated_at: response.updated_at || response.created_at
  };
}

// 모든 상담사 목록 가져오기 (관리자용)
export async function getCounselors(): Promise<{counselors: Counselor[], total: number, page: number, size: number} | null> {
  try {
    console.log('getCounselors 호출 시작'); // 디버깅 로그
    const response = await apiClient.get<{counselors: CounselorResponse[], total: number, page: number, size: number}>(API_ENDPOINTS.COUNSELORS);
    console.log('getCounselors API 응답 전체:', response); // 디버깅 로그
    console.log('getCounselors response.data:', response.data); // 디버깅 로그
    
    // 백엔드 응답 구조: {data: [...], message: 'Success'}
    if (response.data && Array.isArray(response.data)) {
      console.log('getCounselors 성공 - 직접 배열 응답:', response.data); // 디버깅 로그
      return {
        counselors: response.data.map(mapCounselorResponse),
        total: response.data.length,
        page: 1,
        size: response.data.length
      };
    }
    
    // 기존 구조: {data: {counselors: [...], total: 5, page: 1, size: 10}}
    if (response.data && response.data.counselors) {
      console.log('getCounselors 성공 - counselors 키 응답:', response.data.counselors); // 디버깅 로그
      return {
        counselors: response.data.counselors.map(mapCounselorResponse),
        total: response.data.total,
        page: response.data.page,
        size: response.data.size
      };
    }
    
    console.log('getCounselors 실패 - 지원되지 않는 응답 구조'); // 디버깅 로그
    return null;
  } catch (error) {
    console.error('getCounselors 에러 발생:', error); // 디버깅 로그
    return null;
  }
}

// 승인된 상담사 목록 가져오기 (일반 사용자용)
export async function getApprovedCounselors(): Promise<Counselor[]> {
  try {
    const response = await apiClient.get<{counselors: CounselorResponse[], total: number, page: number, size: number}>(API_ENDPOINTS.COUNSELORS);
    
    // 백엔드 응답 구조에서 counselors 배열을 추출하고 매핑
    const counselors = response.data?.counselors || [];
    return counselors.map(mapCounselorResponse);
  } catch (error) {
    console.error('상담사 목록을 가져오는데 실패했습니다:', error);
    return [];
  }
}

// 특정 상담사 정보 가져오기
export async function getCounselor(id: string): Promise<Counselor | null> {
  try {
    const response = await apiClient.get<CounselorResponse>(API_ENDPOINTS.COUNSELOR(id));
    return response.data ? mapCounselorResponse(response.data) : null;
  } catch (error) {
    console.error('상담사 정보를 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 상담사 생성 (관리자용)
export async function createCounselor(data: CreateCounselorRequest): Promise<Counselor | null> {
  try {
    const response = await apiClient.post<CounselorResponse>(API_ENDPOINTS.COUNSELORS, data);
    return response.data ? mapCounselorResponse(response.data) : null;
  } catch (error) {
    console.error('상담사 생성에 실패했습니다:', error);
    return null;
  }
}

// 상담사 정보 수정 (관리자용)
export async function updateCounselor(data: UpdateCounselorRequest): Promise<Counselor | null> {
  try {
    const response = await apiClient.put<CounselorResponse>(API_ENDPOINTS.COUNSELOR(data.id), data);
    return response.data ? mapCounselorResponse(response.data) : null;
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

// 상담사 상태 토글 (활성/비활성)
export async function toggleCounselorStatus(id: string): Promise<boolean> {
  try {
    const response = await apiClient.patch(API_ENDPOINTS.COUNSELOR_TOGGLE_STATUS(id));
    return response.data !== undefined;
  } catch (error) {
    console.error('상담사 상태 변경에 실패했습니다:', error);
    return false;
  }
}

// 프로필 이미지 업로드
export async function uploadProfileImage(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : ''}/api${API_ENDPOINTS.COUNSELOR_UPLOAD_IMAGE}`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.image_url;
  } catch (error) {
    console.error('이미지 업로드에 실패했습니다:', error);
    return null;
  }
}
