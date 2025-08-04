"use client";

import React, { useState, useEffect } from 'react';
import { getBoard, Board, getComments, Comment, createComment, CommentCreate, likeBoard, unlikeBoard } from '../services/boardService';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export const BoardDetail: React.FC = () => {
  const params = useParams();
  const boardId = params?.id ? Number(params.id) : 0;
  
  const [board, setBoard] = useState<Board | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentForm, setCommentForm] = useState<CommentCreate>({
    board_id: boardId,
    content: '',
    author_name: '',
  });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const [boardData, commentsData] = await Promise.all([
          getBoard(boardId),
          getComments(boardId)
        ]);
        setBoard(boardData);
        setComments(commentsData);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
        console.error('게시글 조회 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    if (boardId) {
      fetchBoardData();
    }
  }, [boardId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikeBoard(boardId);
        setBoard(prev => prev ? { ...prev, like_count: prev.like_count - 1 } : null);
      } else {
        await likeBoard(boardId);
        setBoard(prev => prev ? { ...prev, like_count: prev.like_count + 1 } : null);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('좋아요 처리 오류:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.content.trim() || !commentForm.author_name.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await createComment({
        ...commentForm,
        board_id: boardId,
      });
      setComments(prev => [...prev, newComment]);
      setCommentForm({ board_id: boardId, content: '', author_name: '' });
    } catch (err) {
      console.error('댓글 작성 오류:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error || '게시글을 찾을 수 없습니다.'}
        </div>
        <Link 
          href="/board"
          className="inline-flex items-center mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          게시판으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 게시글 상세 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl mb-8">
        {/* 헤더 */}
        <div className="border-b border-gray-200/50 pb-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm px-4 py-2 rounded-full font-medium">
              {board.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {board.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="font-medium">작성자: {board.author_name}</span>
              <span className="font-medium">작성일: {formatDate(board.created_at)}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>조회 {board.view_count}</span>
              </span>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-all duration-200 ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <svg className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>좋아요 {board.like_count}</span>
              </button>
            </div>
          </div>
          {board.updated_at !== board.created_at && (
            <div className="text-sm text-gray-500 mt-2">
              수정일: {formatDate(board.updated_at)}
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="prose max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
            {board.content}
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">댓글 ({comments.length})</h3>
        
        {/* 댓글 작성 폼 */}
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  작성자 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={commentForm.author_name}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, author_name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="작성자 이름"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={commentForm.content}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                  placeholder="댓글을 입력하세요"
                  required
                />
              </div>
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? '작성 중...' : '댓글 작성'}
              </button>
            </div>
          </div>
        </form>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              아직 댓글이 없습니다.
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200/50 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-gray-900">{comment.author_name}</span>
                  <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex justify-between items-center">
        <Link 
          href="/board"
          className="inline-flex items-center px-8 py-4 bg-gray-600 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로 돌아가기
        </Link>
        
        <Link 
          href="/"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}; 