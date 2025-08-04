"use client";

import React, { useState, useEffect } from 'react';
import { getNotice, Notice } from '../services/noticeService';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export const NoticeDetail: React.FC = () => {
  const params = useParams();
  const noticeId = params?.id ? Number(params.id) : 0;
  
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await getNotice(noticeId);
        setNotice(data);
      } catch (err) {
        setError('공지사항을 불러오는데 실패했습니다.');
        console.error('공지사항 조회 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">공지사항을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error || '공지사항을 찾을 수 없습니다.'}
        </div>
        <Link 
          href="/notice"
          className="inline-flex items-center mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          공지사항 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 공지사항 상세 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl">
        {/* 헤더 */}
        <div className="border-b border-gray-200/50 pb-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            {notice.is_pinned && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-4 py-2 rounded-full font-medium">
                공지
              </span>
            )}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm px-4 py-2 rounded-full font-medium">
              {notice.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {notice.title}
          </h1>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span className="font-medium">작성일: {formatDate(notice.created_at)}</span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>조회수: {notice.view_count}</span>
              </span>
            </div>
          </div>
          {notice.updated_at !== notice.created_at && (
            <div className="text-sm text-gray-500 mt-2">
              수정일: {formatDate(notice.updated_at)}
            </div>
          )}
        </div>

        {/* 내용 */}
        <div className="prose max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
            {notice.content}
          </div>
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex justify-between items-center mt-12">
        <Link 
          href="/notice"
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