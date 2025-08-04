"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Info, MessageSquare, FileText, User, Settings } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: '소개',
    href: '/about',
    icon: Info,
    dropdown: [
      { name: '센터 소개', href: '/about' },
      { name: '치유 기법 소개', href: '/healing-methods' },
      { name: '상담사 소개', href: '/counselors' }
    ]
  },
  { name: '상담 신청', href: '/consultation', icon: MessageSquare },
  { name: '상담 후기', href: '/reviews', icon: FileText },
  { name: '마이페이지', href: '/mypage', icon: User },
  { name: '공지사항', href: '/notice', icon: Settings }
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleDropdown = (name: string) => {
    setExpandedDropdown(expandedDropdown === name ? null : name);
  };

  return (
    <div className="md:hidden py-4 border-t border-gray-200/50">
      <div className="flex flex-col space-y-1">
        {navigation.map((item) => {
          if (item.dropdown) {
            const isExpanded = expandedDropdown === item.name;
            
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        onClick={onClose}
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}; 