'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getApprovedCounselors, Counselor } from '@/lib/counselors';

interface CounselorSelectorProps {
  onSelect: (counselor: Counselor) => void;
  selectedCounselorId?: string;
  onNext?: () => void;
  canProceed?: boolean;
}

export default function CounselorSelector({ onSelect, selectedCounselorId, onNext, canProceed }: CounselorSelectorProps) {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);

  useEffect(() => {
    async function loadCounselors() {
      try {
        const data = await getApprovedCounselors();
        setCounselors(data);
        
        // 이미 선택된 상담사가 있다면 설정
        if (selectedCounselorId) {
          const counselor = data.find(c => c.id === selectedCounselorId);
          if (counselor) {
            setSelectedCounselor(counselor);
            onSelect(counselor);
          }
        }
      } catch (error) {
        console.error('상담사 정보 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCounselors();
  }, [selectedCounselorId, onSelect]);

  const handleCounselorSelect = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    onSelect(counselor);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-2xl mb-4">⏳</div>
        <div className="text-lg text-gray-600">상담사 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">상담사 선택</h3>
        <p className="text-gray-600 mb-6 font-medium">
          전문 분야와 경험을 바탕으로 가장 적합한 상담사를 선택해주세요.
        </p>
      </div>

      {/* 선택된 상담사 정보 */}
      {selectedCounselor && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200">
            <CardTitle className="text-blue-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              선택된 상담사
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">👨‍⚕️</div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-blue-900 mb-2">{selectedCounselor.name}</h4>
                <p className="text-blue-700 font-semibold text-lg mb-3">{selectedCounselor.specialization} 전문</p>
                <div className="flex items-center space-x-3 mb-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 font-semibold">
                    경력 {selectedCounselor.experience}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500 text-lg">⭐</span>
                    <span className="font-bold text-gray-700">4.8</span>
                    <span className="text-gray-500">(15)</span>
                  </div>
                </div>
                <p className="text-blue-800 leading-relaxed">
                  {selectedCounselor.description}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedCounselor(null)}
                className="bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl font-medium"
              >
                변경
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

            {/* 상담사 목록 */}
      {!selectedCounselor && (
        <div className="grid md:grid-cols-2 gap-4">
          {counselors.map((counselor) => (
            <Card 
              key={counselor.id} 
              className="bg-white/95 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 cursor-pointer shadow-lg"
              onClick={() => handleCounselorSelect(counselor)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">👨‍⚕️</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{counselor.name}</h4>
                    <p className="text-blue-600 font-semibold mb-3">{counselor.specialization} 전문</p>
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 font-medium">
                        경력 {counselor.experience}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500 text-lg">⭐</span>
                        <span className="font-semibold text-gray-700">4.8</span>
                        <span className="text-gray-500 text-sm">(15)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {counselor.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

       {/* 다음 버튼 */}
       {selectedCounselor && onNext && (
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
