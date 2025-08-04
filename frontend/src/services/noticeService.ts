import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../config/api';

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface NoticeCreate {
  title: string;
  content: string;
  category?: string;
  is_pinned?: boolean;
}

export interface NoticeUpdate {
  title?: string;
  content?: string;
  category?: string;
  is_pinned?: boolean;
}

export const getNotices = async (): Promise<Notice[]> => {
  try {
    const response = await apiGet(API_ENDPOINTS.NOTICE.LIST);

    if (!response.ok) {
      throw new Error('공지사항 목록을 불러오는데 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('공지사항 목록 조회 오류:', error);
    throw error;
  }
};

export const getNotice = async (id: number): Promise<Notice> => {
  try {
    const response = await apiGet(`${API_ENDPOINTS.NOTICE.DETAIL}/${id}`);

    if (!response.ok) {
      throw new Error('공지사항을 불러오는데 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    throw error;
  }
};

export const createNotice = async (data: NoticeCreate): Promise<Notice> => {
  try {
    const response = await apiPost(API_ENDPOINTS.NOTICE.CREATE, data);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '공지사항 생성에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('공지사항 생성 오류:', error);
    throw error;
  }
};

export const updateNotice = async (id: number, data: NoticeUpdate): Promise<Notice> => {
  try {
    const response = await apiPut(`${API_ENDPOINTS.NOTICE.UPDATE}/${id}`, data);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '공지사항 수정에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    throw error;
  }
};

export const deleteNotice = async (id: number): Promise<void> => {
  try {
    const response = await apiDelete(`${API_ENDPOINTS.NOTICE.DELETE}/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '공지사항 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    throw error;
  }
}; 