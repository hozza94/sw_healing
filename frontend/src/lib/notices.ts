import { apiClient, API_ENDPOINTS } from './api';

// 백엔드에서 받아오는 실제 데이터 구조
export interface NoticeResponse {
  id: number;
  author_id: number;
  notice_type: 'general' | 'important' | 'event' | 'maintenance';
  status: 'draft' | 'published' | 'archived';
  title: string;
  content: string;
  is_pinned: boolean;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at?: string;
}

// 프론트엔드에서 사용하는 구조
export interface Notice {
  id: string;
  notice_type: string;
  status: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at?: string;
}

export interface CreateNoticeRequest {
  notice_type: 'general' | 'important' | 'event' | 'maintenance';
  title: string;
  content: string;
  is_pinned?: boolean;
  is_active?: boolean;
}

export interface UpdateNoticeRequest extends Partial<CreateNoticeRequest> {
  id: string;
  status?: 'draft' | 'published' | 'archived';
}

// 백엔드 데이터를 프론트엔드 구조로 변환
function mapNoticeResponse(response: NoticeResponse): Notice {
  return {
    id: response.id.toString(),
    notice_type: response.notice_type,
    status: response.status,
    title: response.title,
    content: response.content,
    is_pinned: response.is_pinned,
    is_active: response.is_active,
    view_count: response.view_count,
    created_at: response.created_at,
    updated_at: response.updated_at
  };
}

// 모든 공지사항 목록 가져오기 (관리자용)
export async function getNotices(): Promise<{notices: Notice[], total: number, page: number, size: number} | null> {
  try {
    const response = await apiClient.get<{notices: NoticeResponse[], total: number, page: number, size: number}>(API_ENDPOINTS.NOTICES);
    if (response.data) {
      return {
        notices: response.data.notices.map(mapNoticeResponse),
        total: response.data.total,
        page: response.data.page,
        size: response.data.size
      };
    }
    return null;
  } catch (error) {
    console.error('공지사항 목록을 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 발행된 공지사항 목록 가져오기
export async function getPublishedNotices(): Promise<Notice[]> {
  try {
    const response = await apiClient.get<{notices: NoticeResponse[], total: number, page: number, size: number}>(`${API_ENDPOINTS.NOTICES}/published`);
    const notices = response.data?.notices || [];
    return notices.map(mapNoticeResponse);
  } catch (error) {
    console.error('공지사항 목록을 가져오는데 실패했습니다:', error);
    return [];
  }
}

// 공지사항 상세 조회
export async function getNotice(id: string): Promise<Notice | null> {
  try {
    const response = await apiClient.get<NoticeResponse>(API_ENDPOINTS.NOTICE(id));
    return response.data ? mapNoticeResponse(response.data) : null;
  } catch (error) {
    console.error('공지사항을 가져오는데 실패했습니다:', error);
    return null;
  }
}

// 공지사항 작성 (관리자용)
export async function createNotice(data: CreateNoticeRequest): Promise<Notice | null> {
  try {
    const response = await apiClient.post<NoticeResponse>(API_ENDPOINTS.NOTICES, data);
    return response.data ? mapNoticeResponse(response.data) : null;
  } catch (error) {
    console.error('공지사항 작성에 실패했습니다:', error);
    return null;
  }
}

// 공지사항 수정 (관리자용)
export async function updateNotice(data: UpdateNoticeRequest): Promise<Notice | null> {
  try {
    const response = await apiClient.put<NoticeResponse>(API_ENDPOINTS.NOTICE(data.id), data);
    return response.data ? mapNoticeResponse(response.data) : null;
  } catch (error) {
    console.error('공지사항 수정에 실패했습니다:', error);
    return null;
  }
}

// 공지사항 삭제 (관리자용)
export async function deleteNotice(id: string): Promise<boolean> {
  try {
    await apiClient.delete(API_ENDPOINTS.NOTICE(id));
    return true;
  } catch (error) {
    console.error('공지사항 삭제에 실패했습니다:', error);
    return false;
  }
}
