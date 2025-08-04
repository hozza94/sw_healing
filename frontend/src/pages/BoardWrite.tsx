"use client";

import React, { useState } from 'react';
import { createBoard, BoardCreate } from '../services/boardService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const BoardWrite: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<BoardCreate>({
    title: '',
    content: '',
    author_name: '',
    category: '일반',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: '일반', label: '일반' },
    { value: '상담후기', label: '상담후기' },
    { value: '치료정보', label: '치료정보' },
    { value: '건강팁', label: '건강팁' },
    { value: '질문', label: '질문' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await createBoard(formData);
      alert('게시글이 성공적으로 작성되었습니다.');
      router.push('/board');
    } catch (err) {
      setError('게시글 작성에 실패했습니다. 다시 시도해주세요.');
      console.error('게시글 작성 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">게시글 작성</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          상담 후기나 유용한 정보를 공유해보세요
        </p>
      </div>

      {/* 작성 폼 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 카테고리 선택 */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
              카테고리 <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              required
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          {/* 작성자 */}
          <div className="space-y-2">
            <label htmlFor="author_name" className="block text-sm font-semibold text-gray-700">
              작성자 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author_name"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="작성자 이름을 입력하세요"
              required
            />
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* 버튼들 */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/board"
              className="inline-flex items-center px-8 py-4 bg-gray-600 text-white font-semibold rounded-2xl hover:bg-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              취소
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  작성 중...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  작성하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 