"use client";

import React, { useState } from 'react';
import { Logo } from '../common';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="backdrop-blur-md bg-gradient-to-r from-green-50/95 to-emerald-50/95 border-b border-green-200/50 sticky top-0 z-50 w-full relative overflow-hidden">
      {/* 힐링 패턴 배경 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url(/images/healing-pattern.svg)',
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center'
        }}
      />
      {/* 컨텐츠 레이어 */}
      <div className="relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* 데스크톱 네비게이션 */}
          <Navigation />
          
          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-green-700 hover:bg-green-100/80 transition-all duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 모바일 메뉴 */}
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      </div>
      </div>
    </header>
  );
}; 