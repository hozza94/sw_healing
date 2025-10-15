'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createConsultation, CreateConsultationRequest } from '@/lib/consultations';
import { Counselor } from '@/lib/counselors';
import { useRouter, useSearchParams } from 'next/navigation';
import CounselorSelector from './CounselorSelector';

interface ConsultationFormData {
  counselor_id: number;
  consultation_type: 'INDIVIDUAL' | 'COUPLE' | 'FAMILY' | 'GROUP';
  urgency_level: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  scheduled_at: string;
  // 추가 폼 필드들
  title: string;
  preferred_date: string;
  preferred_time: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  is_confidential: boolean;
}
import DateSelector from './DateSelector';

interface ConsultationFormProps {
  counselorId?: string;
}

export default function ConsultationForm({ counselorId }: ConsultationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCounselorId = counselorId || searchParams.get('counselor');
  
       const [formData, setFormData] = useState<ConsultationFormData>({
    counselor_id: selectedCounselorId ? parseInt(selectedCounselorId) : 0,
    consultation_type: 'INDIVIDUAL',
    urgency_level: 'MEDIUM',
    description: '',
    scheduled_at: '',
    title: '',
    preferred_date: '',
    preferred_time: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    is_confidential: true
  });
  
  const [selectedCounselor, setSelectedCounselor] = useState<Counselor | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCounselorSelect = (counselor: Counselor) => {
    setSelectedCounselor(counselor);
    setFormData(prev => ({
      ...prev,
      counselor_id: parseInt(counselor.id)
    }));
  };

  const handleDateSelect = (date: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_date: date
    }));
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_time: time
    }));
  };

  const handleInputChange = (field: keyof ConsultationFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // 날짜와 시간을 조합하여 scheduled_at 생성
      const scheduledAt = formData.preferred_date && formData.preferred_time 
        ? `${formData.preferred_date}T${formData.preferred_time}:00`
        : new Date().toISOString();
      
      // ConsultationFormData를 CreateConsultationRequest로 변환
      const consultationData: CreateConsultationRequest = {
        counselor_id: formData.counselor_id,
        consultation_type: formData.consultation_type,
        urgency_level: formData.urgency_level,
        description: formData.description,
        scheduled_at: scheduledAt,
        user_name: formData.contact_name,
        user_email: formData.contact_email,
        user_phone: formData.contact_phone,
        title: formData.title,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        is_confidential: formData.is_confidential
      };
      
      console.log('전송할 데이터:', consultationData);
      
      const result = await createConsultation(consultationData);
      if (result) {
        // 성공 시 상담 신청 번호와 함께 상세 정보 페이지로 이동
        router.push(`/consultation/success?id=${result.id}`);
      } else {
        alert('상담 신청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('상담 신청 오류:', error);
      alert('상담 신청 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && selectedCounselor) {
      setCurrentStep(2);
    } else if (currentStep === 2 && formData.preferred_date && formData.preferred_time) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* 진행 단계 표시 */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}
              `}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${currentStep > step ? 'bg-blue-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-2">
          <span className="text-sm text-gray-600">
            {currentStep === 1 && '상담사 선택'}
            {currentStep === 2 && '일정 선택'}
            {currentStep === 3 && '정보 입력'}
          </span>
        </div>
      </div>

      {/* 단계별 컨텐츠 */}
      {currentStep === 1 && (
        <CounselorSelector 
          onSelect={handleCounselorSelect}
          selectedCounselorId={selectedCounselorId || undefined}
          onNext={nextStep}
          canProceed={!!selectedCounselor}
        />
      )}

      {currentStep === 2 && (
        <DateSelector
          onDateSelect={handleDateSelect}
          onTimeSelect={handleTimeSelect}
          selectedDate={formData.preferred_date}
          selectedTime={formData.preferred_time}
          onNext={nextStep}
          canProceed={!!(formData.preferred_date && formData.preferred_time)}
        />
      )}

      {currentStep === 3 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">상담 정보 입력</CardTitle>
            <CardDescription className="text-center">
              상담에 필요한 정보를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 선택된 상담사 정보 */}
              {selectedCounselor && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">선택된 상담사</h3>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">👨‍⚕️</div>
                    <div>
                      <div className="font-medium text-gray-900">{selectedCounselor.name}</div>
                      <div className="text-sm text-gray-600">{selectedCounselor.specialization} 전문</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 선택된 일정 정보 */}
              {formData.preferred_date && formData.preferred_time && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">선택된 일정</h3>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">📅</div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {formData.preferred_date} {formData.preferred_time}
                      </div>
                      <div className="text-sm text-gray-600">확정 후 연락드리겠습니다</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 상담 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상담 제목 *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="상담하고 싶은 내용의 제목을 입력하세요"
                  required
                />
              </div>

              {/* 상담 유형 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상담 유형 *
                </label>
                                 <select
                   value={formData.consultation_type}
                   onChange={(e) => handleInputChange('consultation_type', e.target.value as any)}
                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   required
                 >
                   <option value="INDIVIDUAL">개인 상담</option>
                   <option value="COUPLE">부부 상담</option>
                   <option value="FAMILY">가족 상담</option>
                   <option value="YOUTH">청소년 상담</option>
                   <option value="TRAUMA">트라우마 상담</option>
                   <option value="OTHER">기타</option>
                 </select>
              </div>

              {/* 긴급도 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  긴급도 *
                </label>
                                 <select
                   value={formData.urgency_level}
                   onChange={(e) => handleInputChange('urgency_level', e.target.value as any)}
                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   required
                 >
                   <option value="LOW">낮음</option>
                   <option value="MEDIUM">보통</option>
                   <option value="HIGH">높음</option>
                   <option value="URGENT">긴급</option>
                 </select>
              </div>

              {/* 연락처 정보 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름 *
                  </label>
                  <Input
                    value={formData.contact_name}
                    onChange={(e) => handleInputChange('contact_name', e.target.value)}
                    placeholder="홍길동"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    연락처 *
                  </label>
                  <Input
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="010-1234-5678"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 *
                </label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  placeholder="example@email.com"
                  required
                />
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

              {/* 개인정보 동의 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.is_confidential}
                    onChange={(e) => handleInputChange('is_confidential', e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-gray-700 leading-relaxed">
                    <span className="font-medium">개인정보 수집 및 이용에 동의합니다.</span>
                    <br />
                    <span className="text-sm text-gray-600">
                      입력하신 정보는 상담 목적으로만 사용되며, 철저히 보호됩니다.
                    </span>
                  </label>
                </div>
              </div>

                             {/* 제출 버튼 */}
               <Button
                 type="submit"
                 className="w-full px-10 py-4 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                 disabled={isSubmitting}
               >
                 {isSubmitting ? (
                   <div className="flex items-center justify-center">
                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                     <span>신청 중...</span>
                   </div>
                 ) : (
                   <div className="flex items-center justify-center">
                     <span>상담 신청하기</span>
                     <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                   </div>
                 )}
               </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 이전 버튼 */}
      {currentStep > 1 && (
        <div className="flex justify-center mt-6">
          <Button
            variant="ghost"
            onClick={prevStep}
            className="px-8 py-3 text-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100/50 transition-all duration-300 rounded-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>이전 단계</span>
          </Button>
        </div>
      )}
    </div>
  );
}
