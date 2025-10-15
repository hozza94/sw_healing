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
    const response = await apiClient.get<{success: boolean, data: {counselors: CounselorResponse[], total: number, page: number, size: number}, timestamp: string}>(API_ENDPOINTS.COUNSELORS);
    console.log('getCounselors API 응답 전체:', response); // 디버깅 로그
    console.log('getCounselors response.data:', response.data); // 디버깅 로그
    
    // 백엔드 응답 구조: {success: true, data: {counselors: [...], total: 5, page: 1, size: 5}, timestamp: "..."}
    if (response.data && response.data.data && response.data.data.counselors) {
      console.log('getCounselors 성공 - 새로운 구조 응답:', response.data.data.counselors); // 디버깅 로그
      return {
        counselors: response.data.data.counselors.map(mapCounselorResponse),
        total: response.data.data.total,
        page: response.data.data.page,
        size: response.data.data.size
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
    
    // 임시 샘플 데이터 반환
    const sampleCounselors: Counselor[] = [
      {
        id: "1",
        name: "김상담",
        email: "counselor1@suwon-healing.com",
        phone: "010-1000-1000",
        specialization: "개인상담",
        education: "서울대학교 심리학과 졸업",
        experience: "10년",
        bio: "따뜻하고 전문적인 상담을 제공합니다.",
        profile_image: "/images/counselor1.jpg",
        is_online: true,
        is_active: true,
        rating: 4.8,
        total_reviews: 25,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: "2",
        name: "이치유",
        email: "counselor2@suwon-healing.com",
        phone: "010-2000-2000",
        specialization: "부부상담",
        education: "연세대학교 상담심리학과 졸업",
        experience: "8년",
        bio: "부부 관계 개선을 위한 전문적인 상담을 제공합니다.",
        profile_image: "/images/counselor2.jpg",
        is_online: true,
        is_active: true,
        rating: 4.9,
        total_reviews: 30,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: "3",
        name: "박마음",
        email: "counselor3@suwon-healing.com",
        phone: "010-3000-3000",
        specialization: "청소년상담",
        education: "고려대학교 아동심리학과 졸업",
        experience: "12년",
        bio: "청소년의 마음을 이해하고 성장을 돕습니다.",
        profile_image: "/images/counselor3.jpg",
        is_online: false,
        is_active: true,
        rating: 4.7,
        total_reviews: 20,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      }
    ];
    
    return {
      counselors: sampleCounselors,
      total: sampleCounselors.length,
      page: 1,
      size: sampleCounselors.length
    };
  }
}

// 승인된 상담사 목록 가져오기 (일반 사용자용)
export async function getApprovedCounselors(): Promise<Counselor[]> {
  try {
    console.log('getApprovedCounselors 호출 시작');
    const response = await apiClient.get<{success: boolean, data: {counselors: CounselorResponse[], total: number, page: number, size: number}, timestamp: string}>(API_ENDPOINTS.COUNSELORS);
    console.log('getApprovedCounselors API 응답:', response);
    
    // 백엔드 응답 구조: {success: true, data: {counselors: [...], total: 5, page: 1, size: 5}, timestamp: "..."}
    const counselors = response.data?.data?.counselors || [];
    console.log('추출된 counselors:', counselors);
    return counselors.map(mapCounselorResponse);
  } catch (error) {
    console.error('상담사 목록을 가져오는데 실패했습니다:', error);
    
    // 임시 샘플 데이터 반환
    return [
      {
        id: "1",
        name: "김상담",
        email: "counselor1@suwon-healing.com",
        phone: "010-1000-1000",
        specialization: "개인상담",
        education: "서울대학교 심리학과 졸업",
        experience: "10년",
        bio: "따뜻하고 전문적인 상담을 제공합니다.",
        profile_image: "/images/counselor1.jpg",
        is_online: true,
        is_active: true,
        rating: 4.8,
        total_reviews: 25,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: "2",
        name: "이치유",
        email: "counselor2@suwon-healing.com",
        phone: "010-2000-2000",
        specialization: "부부상담",
        education: "연세대학교 상담심리학과 졸업",
        experience: "8년",
        bio: "부부 관계 개선을 위한 전문적인 상담을 제공합니다.",
        profile_image: "/images/counselor2.jpg",
        is_online: true,
        is_active: true,
        rating: 4.9,
        total_reviews: 30,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      },
      {
        id: "3",
        name: "박마음",
        email: "counselor3@suwon-healing.com",
        phone: "010-3000-3000",
        specialization: "청소년상담",
        education: "고려대학교 아동심리학과 졸업",
        experience: "12년",
        bio: "청소년의 마음을 이해하고 성장을 돕습니다.",
        profile_image: "/images/counselor3.jpg",
        is_online: false,
        is_active: true,
        rating: 4.7,
        total_reviews: 20,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      }
    ];
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
    console.log('createCounselor 호출 시작:', data);
    const response = await apiClient.post<{success: boolean, data: {id: number, message: string}, timestamp: string}>(API_ENDPOINTS.COUNSELORS, data);
    console.log('createCounselor API 응답:', response);
    
    if (response.data && response.data.data) {
      console.log('상담사 생성 성공:', response.data.data);
      // 생성된 상담사 정보를 반환하기 위해 임시 객체 생성
      const newCounselor: Counselor = {
        id: response.data.data.id.toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialization: data.specialization,
        experience: data.experience,
        education: data.education,
        certification: data.certification,
        bio: data.bio,
        profile_image: data.profile_image,
        is_online: false,
        is_active: true,
        rating: 0,
        total_reviews: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newCounselor;
    }
    
    return null;
  } catch (error) {
    console.error('상담사 생성에 실패했습니다:', error);
    throw error; // 에러를 다시 던져서 UI에서 처리할 수 있도록 함
  }
}

// 상담사 정보 수정 (관리자용)
export async function updateCounselor(data: UpdateCounselorRequest): Promise<Counselor | null> {
  try {
    console.log('updateCounselor 호출 시작:', data);
    const response = await apiClient.put<{success: boolean, data: {message: string}, timestamp: string}>(API_ENDPOINTS.COUNSELOR(data.id), data);
    console.log('updateCounselor API 응답:', response);
    
    if (response.data && response.data.data) {
      console.log('상담사 수정 성공:', response.data.data);
      // 수정된 상담사 정보를 반환하기 위해 임시 객체 생성
      const updatedCounselor: Counselor = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialization: data.specialization,
        experience: data.experience,
        education: data.education,
        certification: data.certification,
        bio: data.bio,
        profile_image: data.profile_image,
        is_online: false,
        is_active: true,
        rating: 0,
        total_reviews: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return updatedCounselor;
    }
    
    return null;
  } catch (error) {
    console.error('상담사 정보 수정에 실패했습니다:', error);
    throw error; // 에러를 다시 던져서 UI에서 처리할 수 있도록 함
  }
}

// 상담사 삭제 (관리자용)
export async function deleteCounselor(id: string): Promise<boolean> {
  try {
    console.log('deleteCounselor 호출 시작:', id);
    console.log('삭제 API 엔드포인트:', API_ENDPOINTS.COUNSELOR(id));
    const response = await apiClient.delete(API_ENDPOINTS.COUNSELOR(id));
    console.log('deleteCounselor API 응답:', response);
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
    return data.profile_image;
  } catch (error) {
    console.error('이미지 업로드에 실패했습니다:', error);
    return null;
  }
}
