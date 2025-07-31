import React from 'react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/consultation', label: '상담 신청' },
  { to: '/reviews', label: '상담 후기' },
  { to: '/inquiry', label: '상담 조회' }
];

export const FooterLinks: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 링크</h3>
      <div className="space-y-2">
        {quickLinks.map((item) => (
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
  );
}; 