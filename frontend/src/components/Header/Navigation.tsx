"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Info, MessageSquare, FileText, User, Settings } from 'lucide-react';

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

export const Navigation: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleMouseEnter = (itemName: string) => {
    setOpenDropdown(itemName);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  // 드롭다운 상태에 따라 body 클래스 관리
  React.useEffect(() => {
    if (openDropdown) {
      document.body.classList.add('dropdown-open');
    } else {
      document.body.classList.remove('dropdown-open');
    }

    return () => {
      document.body.classList.remove('dropdown-open');
    };
  }, [openDropdown]);

  return (
    <nav className="hidden md:flex space-x-2">
      {navigation.map((item) => {
        if (item.dropdown) {
          return (
            <DropdownMenu 
              key={item.name} 
              open={openDropdown === item.name}
              onOpenChange={(open) => setOpenDropdown(open ? item.name : null)}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-green-700 hover:bg-green-100/80 transition-all duration-300 font-medium"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <item.icon className="w-4 h-4 mr-1" />
                  {item.name}
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="w-48 bg-white/95 backdrop-blur-sm border border-green-200/50 shadow-lg"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                {item.dropdown.map((dropdownItem) => (
                  <DropdownMenuItem key={dropdownItem.name} asChild>
                    <Link href={dropdownItem.href} className="cursor-pointer">
                      {dropdownItem.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Button
            key={item.name}
            asChild
            variant="ghost"
            className="text-gray-700 hover:text-green-700 hover:bg-green-100/80 transition-all duration-300 font-medium"
          >
            <Link href={item.href}>
              <item.icon className="w-4 h-4 mr-1" />
              {item.name}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}; 