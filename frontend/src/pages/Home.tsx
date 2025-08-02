import React from 'react';
import Link from 'next/link';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              마음의 치유를 위한
              <span className="text-blue-600"> 따뜻한 공간</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              전문적이고 따뜻한 마음으로 여러분의 치유 과정을 함께하며, 
              건강한 마음으로 일상으로 돌아갈 수 있도록 도와드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/consultation"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                상담 신청하기
              </Link>
              <Link
                href="/about"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                센터 소개
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              전문 상담 서비스
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              다양한 심리 문제에 대한 전문적이고 체계적인 상담을 제공합니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">😔</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">우울증</h3>
              <p className="text-gray-600">
                우울감, 무기력함, 흥미 상실 등의 증상을 전문적으로 치료합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">😰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">불안장애</h3>
              <p className="text-gray-600">
                공포증, 강박증, 범불안장애 등 다양한 불안 증상을 치료합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">💔</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">대인관계</h3>
              <p className="text-gray-600">
                부부문제, 가족문제, 대인관계 스트레스 등 관계 문제를 상담합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            지금 바로 상담을 시작하세요
          </h2>
          <p className="text-blue-100 mb-8">
            전문 상담사와 함께 마음의 치유를 시작해보세요.
          </p>
          <Link
            href="/consultation"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            상담 신청하기
          </Link>
        </div>
      </section>
    </div>
  );
}; 