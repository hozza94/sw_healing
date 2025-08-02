"use client";

import React from 'react';
import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: '홈', href: '/' },
  { name: '센터 소개', href: '/about' },
  { name: '상담 신청', href: '/consultation' },
  { name: '상담 후기', href: '/reviews' },
  { name: '상담 조회', href: '/inquiry' }
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 border-t border-gray-200/50">
      <div className="flex flex-col space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}; 