'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DateSelectorProps {
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  selectedDate?: string;
  selectedTime?: string;
  onNext?: () => void;
  canProceed?: boolean;
}

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30'
];

export default function DateSelector({ onDateSelect, onTimeSelect, selectedDate, selectedTime, onNext, canProceed }: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 현재 월의 날짜들 생성
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // 이전 달의 마지막 날짜들
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // 현재 달의 날짜들
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }

    // 다음 달의 날짜들
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate === formatDate(date);
  };

  const isPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date) => {
    if (!isPast(date)) {
      onDateSelect(formatDate(date));
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">상담 일정 선택</h3>
        <p className="text-gray-600 mb-6">
          원하시는 날짜와 시간을 선택해주세요. 확정 후 연락드리겠습니다.
        </p>
      </div>

                    {/* 달력 */}
       <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
         <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
           <div className="flex items-center justify-between">
             <Button
               variant="ghost"
               size="sm"
               onClick={() => handleMonthChange('prev')}
               className="hover:bg-blue-100/50 rounded-full w-10 h-10 p-0 transition-all duration-200"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
               </svg>
             </Button>
             <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
               {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
             </CardTitle>
             <Button
               variant="ghost"
               size="sm"
               onClick={() => handleMonthChange('next')}
               className="hover:bg-blue-100/50 rounded-full w-10 h-10 p-0 transition-all duration-200"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
               </svg>
             </Button>
           </div>
         </CardHeader>
                 <CardContent className="p-6">
           {/* 요일 헤더 */}
           <div className="grid grid-cols-7 gap-2 mb-4">
             {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
               <div key={day} className={`text-center text-sm font-semibold py-3 ${
                 index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
               }`}>
                 {day}
               </div>
             ))}
           </div>

           {/* 날짜 그리드 */}
           <div className="grid grid-cols-7 gap-2">
             {days.map(({ date, isCurrentMonth }, index) => (
               <button
                 key={index}
                 onClick={() => handleDateClick(date)}
                 disabled={isPast(date)}
                                   className={`
                    aspect-square rounded-xl transition-all duration-300 font-semibold text-base
                    ${isCurrentMonth 
                      ? 'text-gray-900 bg-white hover:bg-blue-50 hover:shadow-md hover:scale-105' 
                      : 'text-gray-400 bg-gray-50'
                    }
                    ${isToday(date) ? 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-900 font-bold shadow-md' : ''}
                    ${isSelected(date) ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold shadow-lg scale-105' : ''}
                    ${isPast(date) ? 'opacity-30 cursor-not-allowed bg-gray-100' : 'cursor-pointer'}
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                  `}
               >
                 {date.getDate()}
               </button>
             ))}
           </div>
         </CardContent>
      </Card>

             {/* 시간 선택 */}
       {selectedDate && (
         <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl overflow-hidden">
           <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
             <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
               시간 선택
             </CardTitle>
             <CardDescription className="text-green-700 font-medium">
               {selectedDate} - 원하시는 시간을 선택해주세요
             </CardDescription>
           </CardHeader>
           <CardContent className="p-6">
             <div className="grid grid-cols-4 gap-3">
               {TIME_SLOTS.map((time) => (
                 <Button
                   key={time}
                   variant="ghost"
                   size="sm"
                   onClick={() => onTimeSelect(time)}
                   className={`text-sm font-medium transition-all duration-300 rounded-xl ${
                     selectedTime === time 
                       ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-105' 
                       : 'bg-white text-gray-700 hover:bg-green-50 hover:shadow-md hover:scale-105 border border-gray-200'
                   }`}
                 >
                   {time}
                 </Button>
               ))}
             </div>
           </CardContent>
         </Card>
       )}

             {/* 선택된 일정 표시 */}
       {selectedDate && selectedTime && (
         <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl rounded-2xl overflow-hidden">
           <CardContent className="p-6">
             <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl">
                 📅
               </div>
               <div className="flex-1">
                 <h4 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                   선택된 일정
                 </h4>
                 <p className="text-purple-700 font-medium text-lg">
                   {selectedDate} {selectedTime}
                 </p>
               </div>
               <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
             </div>
           </CardContent>
         </Card>
       )}

       {/* 다음 버튼 */}
       {selectedDate && selectedTime && onNext && (
         <div className="flex justify-center mt-8">
           <Button
             onClick={onNext}
             disabled={!canProceed}
             className="px-10 py-4 text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <span>다음 단계로</span>
             <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
             </svg>
           </Button>
         </div>
       )}
     </div>
   );
 }
