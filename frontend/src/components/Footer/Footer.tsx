import React from 'react';
import { FooterLinks } from './FooterLinks';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/80 backdrop-blur-md border-t border-gray-200/50 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 센터 정보 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">수원힐링치유상담센터</h3>
            <p className="text-gray-600 mb-4">
              전문적인 12단계 힐링 프로그램으로 당신의 마음을 치유해드립니다.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600">070-4647-1125</span>
            </div>
          </div>
          
          {/* 빠른 링크 */}
          <FooterLinks />
          
          {/* 연락처 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">연락처</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>📧 ittlc.sangdam@gmail.com</p>
              <p>📍 수원시 권선구 호매실로 90번길 116, 201호 순복음빛으로교회</p>
              <p>🕒 평일 09:00 - 18:00</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200/50 text-center">
          <p className="text-sm text-gray-500">
            &copy; 2025 수원힐링치유상담센터. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}; 