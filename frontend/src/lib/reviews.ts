import { apiClient, API_ENDPOINTS } from './api';

// 백엔드에서 받아오는 실제 데이터 구조
export interface ReviewResponse {
  id: number;
  user_id: number;
  counselor_id?: number;
  consultation_id?: number;
  rating: number;
  title: string;
  content: string;
  is_approved: boolean;
  is_active: boolean;
  view_count: number;
  author_name?: string;
  counselor_name?: string;
  created_at: string;
  updated_at?: string;
}

// 프론트엔드에서 사용하는 구조
export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  counselor_id?: string;
  consultation_id?: string;
  is_approved: boolean;
  is_active: boolean;
  view_count: number;
  author_name?: string;
  counselor_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateReviewRequest {
  counselor_id?: string;
  consultation_id?: string;
  rating: number;
  title: string;
  content: string;
}

export interface UpdateReviewRequest extends Partial<CreateReviewRequest> {
  id: string;
  is_approved?: boolean;
}

// 백엔드 데이터를 프론트엔드 구조로 변환
function mapReviewResponse(response: ReviewResponse): Review {
  return {
    id: response.id.toString(),
    rating: response.rating,
    title: response.title,
    content: response.content,
    counselor_id: response.counselor_id?.toString(),
    consultation_id: response.consultation_id?.toString(),
    is_approved: response.is_approved,
    is_active: response.is_active,
    view_count: response.view_count || 0,
    author_name: response.author_name,
    counselor_name: response.counselor_name,
    created_at: response.created_at,
    updated_at: response.updated_at
  };
}

// 승인된 후기 목록 가져오기
export async function getApprovedReviews(counselorId?: string): Promise<Review[]> {
  try {
    const endpoint = counselorId 
      ? `${API_ENDPOINTS.REVIEWS}/approved?counselor_id=${counselorId}`
      : `${API_ENDPOINTS.REVIEWS}/approved`;
    
    const response = await apiClient.get<{reviews: ReviewResponse[], total: number, page: number, size: number}>(endpoint);
    const reviews = response.data?.reviews || [];
    return reviews.map(mapReviewResponse);
  } catch (error) {
    console.error('후기 목록을 가져오는데 실패했습니다:', error);
    return [];
  }
}

// 후기 작성
export async function createReview(data: CreateReviewRequest): Promise<Review | null> {
  try {
    const response = await apiClient.post<ReviewResponse>(API_ENDPOINTS.REVIEWS, data);
    return response.data ? mapReviewResponse(response.data) : null;
  } catch (error) {
    console.error('후기 작성에 실패했습니다:', error);
    return null;
  }
}

// 특정 후기 정보 가져오기
export async function getReview(id: string): Promise<Review | null> {
  try {
    const response = await apiClient.get<ReviewResponse>(API_ENDPOINTS.REVIEW(id));
    return response.data ? mapReviewResponse(response.data) : null;
  } catch (error) {
    console.error('후기 정보를 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 후기 수정
export async function updateReview(data: UpdateReviewRequest): Promise<Review | null> {
  try {
    const response = await apiClient.put<ReviewResponse>(API_ENDPOINTS.REVIEW(data.id), data);
    return response.data ? mapReviewResponse(response.data) : null;
  } catch (error) {
    console.error('후기 수정에 실패했습니다:', error);
    return null;
  }
}

// 후기 삭제
export async function deleteReview(id: string): Promise<boolean> {
  try {
    await apiClient.delete(API_ENDPOINTS.REVIEW(id));
    return true;
  } catch (error) {
    console.error('후기 삭제에 실패했습니다:', error);
    return false;
  }
}
