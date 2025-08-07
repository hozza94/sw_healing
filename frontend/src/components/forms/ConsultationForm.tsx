'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createConsultation, CreateConsultationRequest } from '@/lib/consultations';
import { getCounselor, Counselor } from '@/lib/counselors';
import { useRouter, useSearchParams } from 'next/navigation';

interface ConsultationFormProps {
  counselorId?: string;
}

export default function ConsultationForm({ counselorId }: ConsultationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCounselorId = counselorId || searchParams.get('counselor');
  
  const [formData, setFormData] = useState<CreateConsultationRequest>({
    counselor_id: selectedCounselorId || '',
    consultation_type: '',
    preferred_date: '',
    preferred_time: '',
    consultation_method: 'online',
    description: ''
  });
  
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 상담사 정보 가져오기
  useState(() => {
    if (selectedCounselorId) {
      setIsLoading(true);
      getCounselor(selectedCounselorId).then((data) => {
        setCounselor(data);
        setIsLoading(false);
      });
    }
  });

  const handleInputChange = (field: keyof CreateConsultationRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.counselor_id) {
      alert('상담사를 선택해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createConsultation(formData);
      if (result) {
        alert('상담 신청이 완료되었습니다. 곧 연락드리겠습니다.');
        router.push('/consultation/success');
      } else {
        alert('상담 신청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      alert('상담 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-2xl mb-4">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">상담 신청</CardTitle>
          <CardDescription className="text-center">
            전문 상담사와 함께 마음 치유를 시작해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 선택된 상담사 정보 */}
            {counselor && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">선택된 상담사</h3>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {counselor.image_url ? (
                      <img 
                        src={counselor.image_url} 
                        alt={counselor.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      "👨‍⚕️"
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{counselor.name}</div>
                    <div className="text-sm text-gray-600">{counselor.specialization} 전문</div>
                  </div>
                </div>
              </div>
            )}

            {/* 상담 유형 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상담 유형 *
              </label>
              <select
                value={formData.consultation_type}
                onChange={(e) => handleInputChange('consultation_type', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">상담 유형을 선택하세요</option>
                <option value="individual">개인 상담</option>
                <option value="couple">부부 상담</option>
                <option value="family">가족 상담</option>
                <option value="youth">청소년 상담</option>
                <option value="trauma">트라우마 상담</option>
              </select>
            </div>

            {/* 상담 방법 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상담 방법 *
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="consultation_method"
                    value="online"
                    checked={formData.consultation_method === 'online'}
                    onChange={(e) => handleInputChange('consultation_method', e.target.value)}
                    className="text-blue-600"
                  />
                  <span>온라인 상담 (화상)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="consultation_method"
                    value="offline"
                    checked={formData.consultation_method === 'offline'}
                    onChange={(e) => handleInputChange('consultation_method', e.target.value)}
                    className="text-blue-600"
                  />
                  <span>대면 상담</span>
                </label>
              </div>
            </div>

            {/* 희망 날짜 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                희망 날짜 *
              </label>
              <Input
                type="date"
                value={formData.preferred_date}
                onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* 희망 시간 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                희망 시간 *
              </label>
              <select
                value={formData.preferred_time}
                onChange={(e) => handleInputChange('preferred_time', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">시간을 선택하세요</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="13:00">13:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
              </select>
            </div>

            {/* 상담 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상담 내용 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="상담하고 싶은 내용을 자유롭게 작성해주세요..."
                required
              />
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? '신청 중...' : '상담 신청하기'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
