import { apiGet, apiPost, apiPut, apiDelete, API_ENDPOINTS } from '../config/api';

export interface Board {
  id: number;
  title: string;
  content: string;
  author_name: string;
  category: string;
  user_id?: number;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface BoardCreate {
  title: string;
  content: string;
  author_name: string;
  category?: string;
}

export interface BoardUpdate {
  title?: string;
  content?: string;
  category?: string;
}

export interface Comment {
  id: number;
  board_id: number;
  content: string;
  author_name: string;
  user_id?: number;
  created_at: string;
  updated_at: string;
}

export interface CommentCreate {
  board_id: number;
  content: string;
  author_name: string;
}

export const getBoards = async (category?: string): Promise<Board[]> => {
  try {
    const url = category 
      ? `${API_ENDPOINTS.BOARD.LIST}?category=${encodeURIComponent(category)}`
      : API_ENDPOINTS.BOARD.LIST;
    
    const response = await apiGet(url);

    if (!response.ok) {
      throw new Error('게시글 목록을 불러오는데 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    throw error;
  }
};

export const getBoard = async (id: number): Promise<Board> => {
  try {
    const response = await apiGet(`${API_ENDPOINTS.BOARD.DETAIL}/${id}`);

    if (!response.ok) {
      throw new Error('게시글을 불러오는데 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    throw error;
  }
};

export const createBoard = async (data: BoardCreate): Promise<Board> => {
  try {
    const response = await apiPost(API_ENDPOINTS.BOARD.CREATE, data);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '게시글 작성에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    throw error;
  }
};

export const updateBoard = async (id: number, data: BoardUpdate): Promise<Board> => {
  try {
    const response = await apiPut(`${API_ENDPOINTS.BOARD.UPDATE}/${id}`, data);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '게시글 수정에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    throw error;
  }
};

export const deleteBoard = async (id: number): Promise<void> => {
  try {
    const response = await apiDelete(`${API_ENDPOINTS.BOARD.DELETE}/${id}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '게시글 삭제에 실패했습니다.');
    }
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    throw error;
  }
};

// 댓글 관련 함수들
export const getComments = async (boardId: number): Promise<Comment[]> => {
  try {
    const response = await apiGet(`${API_ENDPOINTS.BOARD.COMMENTS}/${boardId}`);

    if (!response.ok) {
      throw new Error('댓글 목록을 불러오는데 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('댓글 목록 조회 오류:', error);
    throw error;
  }
};

export const createComment = async (data: CommentCreate): Promise<Comment> => {
  try {
    const response = await apiPost(`${API_ENDPOINTS.BOARD.COMMENTS}/${data.board_id}`, data);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '댓글 작성에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    throw error;
  }
};

// 좋아요 관련 함수들
export const likeBoard = async (boardId: number): Promise<void> => {
  try {
    const response = await apiPost(`${API_ENDPOINTS.BOARD.LIKE}/${boardId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '좋아요에 실패했습니다.');
    }
  } catch (error) {
    console.error('좋아요 오류:', error);
    throw error;
  }
};

export const unlikeBoard = async (boardId: number): Promise<void> => {
  try {
    const response = await apiDelete(`${API_ENDPOINTS.BOARD.LIKE}/${boardId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || '좋아요 취소에 실패했습니다.');
    }
  } catch (error) {
    console.error('좋아요 취소 오류:', error);
    throw error;
  }
}; 