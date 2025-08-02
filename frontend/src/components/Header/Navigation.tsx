import React from 'react';
import Link from 'next/link';

const navigation = [
  { name: '홈', href: '/' },
  { name: '센터 소개', href: '/about' },
  { name: '상담 신청', href: '/consultation' },
  { name: '상담 후기', href: '/reviews' },
  { name: '상담 조회', href: '/inquiry' }
];

export const Navigation: React.FC = () => {
  return (
    <nav className="hidden md:flex space-x-8">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );
}; 