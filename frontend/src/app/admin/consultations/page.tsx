'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConsultationDetailModal } from '@/components/ui/consultation-detail-modal';
import { Eye, Calendar, Clock, User, MapPin } from 'lucide-react';

interface Consultation {
  id: number;
  user_name: string;
  user_phone?: string;
  user_email?: string;
  counselor_name: string;
  counselor_specialization?: string;
  counselor_phone?: string;
  counselor_email?: string;
  consultation_date: string;
  consultation_time: string;
  consultation_type: string;
  status: string;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
                      <p className="font-medium">{consultation.consultation_type}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">상담 날짜</p>
                      <p className="font-medium">{formatDate(consultation.consultation_date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">상담 시간</p>
                      <p className="font-medium">{formatTime(consultation.consultation_time)}</p>
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
      />
    </div>
  );
}
