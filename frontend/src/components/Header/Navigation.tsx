import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common';

const navigationItems = [
  { to: '/', label: '홈' },
  { to: '/consultation', label: '상담신청' },
  { to: '/inquiry', label: '상담조회' },
  { to: '/reviews', label: '상담후기' }
];

export const Navigation: React.FC = () => {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navigationItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
        >
          {item.label}
          <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
        </Link>
      ))}
      <Button href="/login" variant="primary" size="md" className="ml-4">
        로그인
      </Button>
    </nav>
  );
}; 