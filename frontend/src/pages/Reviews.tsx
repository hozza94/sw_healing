"use client";

import React, { useState } from 'react';

interface Review {
  id: number;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  category: string;
}

export const Reviews: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  // 샘플 데이터
  const sampleReviews: Review[] = [
    {
      id: 1,
      author: "김**",
      rating: 5,
      title: "12단계 프로그램으로 큰 변화를 경험했습니다",
      content: "처음에는 회의적이었지만, 체계적인 12단계 프로그램을 통해 정말 많은 변화를 경험했습니다. 상담사님의 따뜻한 관심과 전문적인 상담 덕분에 이제는 훨씬 건강한 마음으로 살고 있습니다.",
      date: "2024-01-15",
      category: "스트레스"
    },
    {
      id: 2,
      author: "이**",
      rating: 5,
      title: "우울증에서 벗어날 수 있었어요",
      content: "우울증으로 힘들어하던 중 이곳을 알게 되었습니다. 체크리스트를 통한 체계적인 관리와 상담사님의 꾸준한 관심 덕분에 이제는 밝은 미래를 그릴 수 있게 되었습니다.",
      date: "2024-01-10",
      category: "우울증"
    },
    {
      id: 3,
      author: "박**",
      rating: 4,
      title: "불안증상이 크게 개선되었습니다",
      content: "불안으로 인해 일상생활이 어려웠는데, 상담을 받으면서 점차 안정을 찾을 수 있었습니다. 특히 체크리스트를 통한 자기 점검이 도움이 많이 되었어요.",
      date: "2024-01-08",
      category: "불안"
    },
    {
      id: 4,
      author: "최**",
      rating: 5,
      title: "수면 문제가 해결되었어요",
      content: "수면 문제로 고민하던 중 상담을 받게 되었습니다. 수면 품질 체크리스트를 통해 문제점을 파악하고, 상담사님의 도움으로 이제는 편안하게 잠들 수 있게 되었습니다.",
      date: "2024-01-05",
      category: "수면"
    },
    {
      id: 5,
      author: "정**",
      rating: 4,
      title: "대인관계가 개선되었습니다",
      content: "대인관계에서 어려움을 겪고 있었는데, 상담을 통해 자신감을 되찾을 수 있었습니다. 체계적인 프로그램 덕분에 이제는 사람들과 더 편안하게 소통할 수 있어요.",
      date: "2024-01-03",
      category: "대인관계"
    }
  ];

  const categories = [
    { value: 'all', label: '전체' },
    { value: '스트레스', label: '스트레스' },
    { value: '우울증', label: '우울증' },
    { value: '불안', label: '불안' },
    { value: '수면', label: '수면' },
    { value: '대인관계', label: '대인관계' }
  ];

  const filteredReviews = sampleReviews
    .filter(review => selectedCategory === 'all' || review.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.rating - a.rating;
    });

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="page-header">
        <h1 className="page-title">상담 후기</h1>
        <p className="page-subtitle">
          수원 힐링 상담센터를 이용하신 고객님들의 생생한 후기를 확인해보세요
        </p>
      </div>

      {/* 필터 및 정렬 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">카테고리:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">정렬:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">최신순</option>
              <option value="rating">평점순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 통계 */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{sampleReviews.length}</div>
          <div className="text-sm text-gray-600">총 후기 수</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">4.6</div>
          <div className="text-sm text-gray-600">평균 평점</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">95%</div>
          <div className="text-sm text-gray-600">만족도</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">12단계</div>
          <div className="text-sm text-gray-600">프로그램</div>
        </div>
      </div>

      {/* 후기 목록 */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{review.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{review.author}</span>
                  <span>{review.date}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {review.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {renderStars(review.rating)}
                <span className="text-sm text-gray-600">({review.rating}/5)</span>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed">
              {review.content}
            </p>
          </div>
        ))}
      </div>

      {/* 후기 작성 안내 */}
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          상담을 받으신 후 후기를 남겨주세요
        </h3>
        <p className="text-blue-700 mb-4">
          다른 분들에게 도움이 되는 소중한 후기를 남겨주시면 감사하겠습니다.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          후기 작성하기
        </button>
      </div>
    </div>
  );
}; 