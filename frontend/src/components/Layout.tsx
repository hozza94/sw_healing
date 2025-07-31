import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 헤더 */}
      <header className="backdrop-blur-md bg-white/80 border-b border-gray-200/50 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                  수원 힐링
                </span>
              </Link>
            </div>
            
            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { to: '/', label: '홈' },
                { to: '/consultation', label: '상담신청' },
                { to: '/inquiry', label: '상담조회' },
                { to: '/reviews', label: '상담후기' }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
                >
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              ))}
              <Link
                to="/login"
                className="ml-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                로그인
              </Link>
            </nav>
            
            {/* 모바일 메뉴 버튼 */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* 모바일 메뉴 */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200/50">
              <div className="flex flex-col space-y-2">
                {[
                  { to: '/', label: '홈' },
                  { to: '/consultation', label: '상담신청' },
                  { to: '/inquiry', label: '상담조회' },
                  { to: '/reviews', label: '상담후기' }
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mx-4 mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-center"
                >
                  로그인
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* 푸터 */}
      <footer className="w-full bg-white/80 backdrop-blur-md border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* 센터 정보 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">수원 힐링 상담센터</h3>
              <p className="text-gray-600 mb-4">
                전문적인 12단계 힐링 프로그램으로 당신의 마음을 치유해드립니다.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">031-123-4567</span>
              </div>
            </div>
            
            {/* 빠른 링크 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 링크</h3>
              <div className="space-y-2">
                {[
                  { to: '/consultation', label: '상담 신청' },
                  { to: '/reviews', label: '상담 후기' },
                  { to: '/inquiry', label: '상담 조회' }
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* 연락처 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">연락처</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 info@suwon-healing.com</p>
                <p>📍 수원시 영통구 영통동</p>
                <p>🕒 평일 09:00 - 18:00</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200/50 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2024 수원 힐링 상담센터. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 