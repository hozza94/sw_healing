import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              마음을 치유하는
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                새로운 시작
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              전문적인 12단계 힐링 프로그램으로 당신의 마음을 치유하고 새로운 삶을 시작하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/consultation"
                className="group relative px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
              >
                <span className="relative z-10">상담 신청하기</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">상담 신청하기</span>
              </Link>
              <Link
                to="/reviews"
                className="px-8 py-4 border-2 border-white text-white rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 backdrop-blur-sm"
              >
                상담 후기 보기
              </Link>
            </div>
          </div>
        </div>
        
        {/* 배경 장식 */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </section>

      {/* 서비스 소개 */}
      <section className="py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">왜 수원 힐링인가요?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            체계적인 프로그램과 전문 상담사가 함께하는 맞춤형 힐링 서비스
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "12단계 힐링 프로그램",
              description: "체계적인 12단계 과정을 통해 단계별로 마음을 치유하고 성장시킵니다.",
              gradient: "from-green-500 to-emerald-500"
            },
            {
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              title: "전문 상담사",
              description: "경험 많은 전문 상담사들이 개인별 맞춤 상담을 제공합니다.",
              gradient: "from-blue-500 to-indigo-500"
            },
            {
              icon: (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              title: "진행 상황 추적",
              description: "체크리스트와 설문을 통해 상담 진행 상황을 체계적으로 관리합니다.",
              gradient: "from-purple-500 to-pink-500"
            }
          ].map((service, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative p-8 rounded-3xl border border-gray-200/50 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 통계 */}
      <section className="py-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-gray-200/50 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">우리 센터의 성과</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "총 상담 건수", color: "text-blue-600" },
              { number: "95%", label: "만족도", color: "text-green-600" },
              { number: "12단계", label: "체계적 프로그램", color: "text-purple-600" },
              { number: "24/7", label: "온라인 상담", color: "text-orange-600" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 text-center">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">지금 바로 상담을 시작해보세요</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              전문 상담사와 함께 당신의 마음 치유 여정을 시작하세요
            </p>
            <Link
              to="/consultation"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              무료 상담 신청
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          
          {/* 배경 장식 */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>
      </section>
    </div>
  );
}; 