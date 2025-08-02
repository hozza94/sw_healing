import React from 'react';
import Link from 'next/link';

export const Logo: React.FC = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-sm">H</span>
      </div>
      <span className="text-xl font-bold text-gray-900">SW-Healing</span>
    </Link>
  );
}; 