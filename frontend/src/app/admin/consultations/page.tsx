'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConsultationDetailModal } from '@/components/ui/consultation-detail-modal';
import { Eye, Calendar, Clock, User, MapPin } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from '@/components/ui/toast';

interface Consultation {
  id: number;
  user_name: string;
  user_phone?: string;
  user_email?: string;
  counselor_name: string;
  counselor_specialization?: string;
  counselor_phone?: string;
  counselor_email?: string;
  scheduled_at: string;  // 백엔드 필드명과 일치
  consultation_type: string;
  consultation_type_ko?: string;  // 한국어 매핑 추가
  urgency_level?: string;
  urgency_level_ko?: string;  // 한국어 매핑 추가
  status: string;
  status_ko?: string;  // 한국어 매핑 추가
  status_color?: string;  // 상태 색상 추가
  notes?: string;
  created_at: string;
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/consultations');
      if (response.ok) {
        const data = await response.json();
        if (data.consultations) {
          setConsultations(data.consultations);
        }
      }
    } catch (error) {
      console.error('상담 신청 목록을 가져오는데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationClick = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setDetailModalOpen(true);
  };

  const handleConsultationStatusChange = async (consultationId: number, newStatus: string) => {
    try {
      console.log('상담 신청 상태 변경 시작:', { consultationId, newStatus });
      
      // 상태 변경 API 호출
      const response = await apiClient.patch(`/api/consultations/${consultationId}`, {
        status: newStatus
      });
      
      if (response.data && response.data.success) {
        const statusText = getStatusText(newStatus);
        toast.success(`상담 신청 상태가 "${statusText}"로 변경되었습니다.`);
        
        // 상담 신청 목록 새로고침
        await fetchConsultations();
        
        // 모달 닫기
        setDetailModalOpen(false);
      } else {
        toast.error('상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('상담 신청 상태 변경 실패:', error);
      toast.error('상태 변경 중 오류가 발생했습니다.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-purple-100 text-purple-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      // 소문자 버전도 지원 (기존 데이터 호환성)
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '대기중';
      case 'REVIEWING':
        return '검토중';
      case 'CONFIRMED':
        return '수락됨';
      case 'SCHEDULED':
        return '일정확정';
      case 'IN_PROGRESS':
        return '진행중';
      case 'COMPLETED':
        return '완료됨';
      case 'CANCELLED':
        return '취소됨';
      case 'REJECTED':
        return '거절됨';
      // 소문자 버전도 지원 (기존 데이터 호환성)
      case 'pending':
        return '대기중';
      case 'reviewing':
        return '검토중';
      case 'confirmed':
        return '수락됨';
      case 'scheduled':
        return '일정확정';
      case 'in_progress':
        return '진행중';
      case 'completed':
        return '완료됨';
      case 'cancelled':
        return '취소됨';
      case 'rejected':
        return '거절됨';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'null') return '미정';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString || dateString === 'null') return '미정';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">상담 신청 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">상담 신청 관리</h1>
        <p className="text-gray-600">전체 상담 신청 내역을 확인하고 관리할 수 있습니다.</p>
      </div>

      <div className="grid gap-6">
        {consultations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">상담 신청 내역이 없습니다.</p>
            </CardContent>
          </Card>
        ) : (
          consultations.map((consultation) => (
            <Card 
              key={consultation.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
              onClick={() => handleConsultationClick(consultation)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(consultation.status)}>
                      {getStatusText(consultation.status)}
                    </Badge>
                    <span className="text-sm text-gray-500">#{consultation.id}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConsultationClick(consultation);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>상세보기</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">신청자</p>
                      <p className="font-medium">{consultation.user_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">상담사</p>
                      <p className="font-medium">{consultation.counselor_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">상담 유형</p>
                      <p className="font-medium">{consultation.consultation_type_ko || consultation.consultation_type}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">상담 날짜</p>
                      <p className="font-medium">{formatDate(consultation.scheduled_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">상담 시간</p>
                      <p className="font-medium">{formatTime(consultation.scheduled_at)}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      신청일: {formatDate(consultation.created_at)}
                    </p>
                    <p className="text-sm text-gray-500">
                      클릭하여 상세 정보 확인
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 상세 정보 모달 */}
      <ConsultationDetailModal
        consultation={selectedConsultation}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onStatusChange={handleConsultationStatusChange}
      />
    </div>
  );
}
