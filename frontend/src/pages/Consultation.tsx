"use client";

import React, { useState } from 'react';
import { createConsultation, ConsultationRequest } from '../services/consultationService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, Info } from 'lucide-react';

export const Consultation: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    mainConcern: '',
    preferredDate: '',
    preferredTime: '',
    additionalInfo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const consultationData: ConsultationRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender || undefined,
        main_concern: formData.mainConcern,
        preferred_date: formData.preferredDate || undefined,
        preferred_time: formData.preferredTime || undefined,
        additional_info: formData.additionalInfo || undefined,
      };

      const response = await createConsultation(consultationData);
      
      console.log('상담 신청 성공:', response);
      setSubmitStatus('success');
      
      // 폼 초기화
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        mainConcern: '',
        preferredDate: '',
        preferredTime: '',
        additionalInfo: ''
      });
      
    } catch (error) {
      console.error('상담 신청 오류:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="page-header">
        <h1 className="page-title">상담 신청</h1>
        <p className="page-subtitle">
          전문 상담사와 함께 당신의 마음 치유 여정을 시작하세요
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <User className="w-3 h-3 mr-1" />
            전문 상담사
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Clock className="w-3 h-3 mr-1" />
            맞춤형 상담
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <MessageSquare className="w-3 h-3 mr-1" />
            비밀보장
          </Badge>
        </div>
      </div>

      {/* 상태 알림 */}
      {submitStatus === 'success' && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Info className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <Info className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            상담 신청에 실패했습니다. 다시 시도해주세요.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 메인 폼 */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                상담 신청서
              </CardTitle>
              <CardDescription>
                아래 정보를 정확히 입력해 주시면 빠른 시일 내에 연락드리겠습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 기본 정보 섹션 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    기본 정보
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">이름 *</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="이름을 입력하세요"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">연락처 *</label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="010-0000-0000"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">이메일</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">나이</label>
                      <Input
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="나이"
                        min="1"
                        max="120"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">성별</label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="성별을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">남성</SelectItem>
                          <SelectItem value="female">여성</SelectItem>
                          <SelectItem value="other">기타</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 상담 정보 섹션 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    상담 정보
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">주요 고민사항 *</label>
                    <Textarea
                      name="mainConcern"
                      value={formData.mainConcern}
                      onChange={handleChange}
                      placeholder="상담하고 싶은 내용을 자유롭게 작성해 주세요"
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                </div>

                {/* 희망 일정 섹션 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    희망 일정
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">희망 날짜</label>
                      <Input
                        name="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">희망 시간</label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleSelectChange('preferredTime', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="시간을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="09:00">오전 9시</SelectItem>
                          <SelectItem value="10:00">오전 10시</SelectItem>
                          <SelectItem value="11:00">오전 11시</SelectItem>
                          <SelectItem value="13:00">오후 1시</SelectItem>
                          <SelectItem value="14:00">오후 2시</SelectItem>
                          <SelectItem value="15:00">오후 3시</SelectItem>
                          <SelectItem value="16:00">오후 4시</SelectItem>
                          <SelectItem value="17:00">오후 5시</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 추가 정보 섹션 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-orange-600" />
                    추가 정보
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">추가 요청사항</label>
                    <Textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleChange}
                      placeholder="추가로 전달하고 싶은 내용이 있으시면 작성해 주세요"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                {/* 제출 버튼 */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        신청 중...
                      </>
                    ) : (
                      '상담 신청하기'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 연락처 정보 */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                연락처 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">전화번호</p>
                  <p className="text-sm text-gray-600">031-123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">이메일</p>
                  <p className="text-sm text-gray-600">info@suwon-healing.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">운영시간</p>
                  <p className="text-sm text-gray-600">평일 09:00 - 18:00</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상담 안내 */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-blue-900">상담 안내</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-blue-800">전문 상담사가 1:1 맞춤 상담을 제공합니다</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-blue-800">모든 상담 내용은 철저히 비밀보장됩니다</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-sm text-blue-800">신청 후 24시간 내에 연락드립니다</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 