import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { to: '/', label: '홈' },
  { to: '/consultation', label: '상담신청' },
  { to: '/inquiry', label: '상담조회' },
  { to: '/reviews', label: '상담후기' }
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 border-t border-gray-200/50">
      <div className="flex flex-col space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {item.label}
          </Link>
        ))}
        <div className="mx-4 mt-2">
          <Button href="/login" variant="primary" size="md" onClick={onClose} className="w-full">
            로그인
          </Button>
        </div>
      </div>
    </div>
  );
}; 