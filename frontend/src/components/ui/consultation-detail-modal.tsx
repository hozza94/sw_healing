'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

interface ConsultationDetail {
  id: number;
  user_name: string;
  counselor_name: string;
  consultation_date: string;
  consultation_time: string;
  consultation_type: string;
  status: string;
  created_at: string;
  user_phone?: string;
  user_email?: string;
  notes?: string;
  counselor_specialization?: string;
  counselor_phone?: string;
  counselor_email?: string;
}

interface ConsultationDetailModalProps {
  consultation: ConsultationDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConsultationDetailModal({ consultation, open, onOpenChange }: ConsultationDetailModalProps) {
  if (!consultation) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기중';
      case 'confirmed':
        return '확정됨';
      case 'cancelled':
        return '취소됨';
      case 'completed':
        return '완료됨';
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-white shadow-2xl border-2 border-gray-200 flex flex-col">
        <DialogHeader className="bg-gray-50 p-6 -m-6 mb-6 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            상담 신청 상세 정보
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            상담 신청에 대한 자세한 정보를 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4 space-y-6">
          {/* 상담 정보 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              상담 일정
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-blue-700 font-medium">상담 날짜</p>
                <p className="text-blue-900">{formatDate(consultation.consultation_date)}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">상담 시간</p>
                <p className="text-blue-900">{formatTime(consultation.consultation_time)}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm text-blue-700 font-medium">상담 유형</p>
              <p className="text-blue-900">{consultation.consultation_type}</p>
            </div>
            <div className="mt-3">
              <p className="text-sm text-blue-700 font-medium">상태</p>
              <Badge className={getStatusColor(consultation.status)}>
                {getStatusText(consultation.status)}
              </Badge>
            </div>
          </div>

          {/* 신청자 정보 */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              신청자 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-green-700 font-medium">이름</p>
                <p className="text-green-900">{consultation.user_name}</p>
              </div>
              {consultation.user_phone && (
                <div>
                  <p className="text-sm text-green-700 font-medium">연락처</p>
                  <p className="text-green-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {consultation.user_phone}
                  </p>
                </div>
              )}
            </div>
            {consultation.user_email && (
              <div className="mt-3">
                <p className="text-sm text-green-700 font-medium">이메일</p>
                <p className="text-green-900 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {consultation.user_email}
                </p>
              </div>
            )}
          </div>

          {/* 상담사 정보 */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              상담사 정보
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-purple-700 font-medium">이름</p>
                <p className="text-purple-900">{consultation.counselor_name}</p>
              </div>
              {consultation.counselor_specialization && (
                <div>
                  <p className="text-sm text-purple-700 font-medium">전문 분야</p>
                  <p className="text-purple-900">{consultation.counselor_specialization}</p>
                </div>
              )}
            </div>
            {consultation.counselor_phone && (
              <div className="mt-3">
                <p className="text-sm text-purple-700 font-medium">연락처</p>
                <p className="text-purple-900 flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {consultation.counselor_phone}
                </p>
              </div>
            )}
            {consultation.counselor_email && (
              <div className="mt-3">
                <p className="text-sm text-purple-700 font-medium">이메일</p>
                <p className="text-purple-900 flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {consultation.counselor_email}
                </p>
              </div>
            )}
          </div>

          {/* 추가 정보 */}
          {consultation.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                추가 요청사항
              </h3>
              <p className="text-gray-700 whitespace-pre-wrap">{consultation.notes}</p>
            </div>
          )}

          {/* 신청 일시 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">신청 일시</h3>
            <p className="text-gray-700">{formatDate(consultation.created_at)}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 -m-6 mt-6 border-t border-gray-200 flex-shrink-0">
          <Button 
            type="button" 
            onClick={() => onOpenChange(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


