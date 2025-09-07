'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { getCounselors } from '@/lib/counselors';
import { getReviews } from '@/lib/reviews';
import { getNotices } from '@/lib/notices';
import { getConsultations } from '@/lib/consultations';
import CounselorForm from '@/components/forms/CounselorForm';
import { deleteCounselor, updateCounselor, toggleCounselorStatus } from '@/lib/counselors';
import { ConsultationDetailModal } from '@/components/ui/consultation-detail-modal';
import { Eye, Calendar, Clock, User, MapPin } from 'lucide-react';

interface DashboardStats {
  counselors: number;
  consultations: number;
  reviews: number;
  notices: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    counselors: 0,
    consultations: 0,
    reviews: 0,
    notices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 임시로 기존 API 사용 (백엔드 서버 재시작 후 새로운 API로 변경)
      const [counselorsRes, consultationsRes, reviewsRes, noticesRes] = await Promise.all([
        getCounselors(),
        getConsultations(),
        getReviews(),
        getNotices()
      ]);

      console.log('대시보드 데이터 로딩 결과:', {
        counselors: counselorsRes,
        consultations: consultationsRes,
        reviews: reviewsRes,
        notices: noticesRes
      }); // 디버깅 로그

      setStats({
        counselors: counselorsRes?.total || 0,
        consultations: consultationsRes?.total || (consultationsRes?.consultations?.length || 0), // total이 없으면 배열 길이 사용
        reviews: reviewsRes?.total || 0,
        notices: noticesRes?.total || 0
      });
    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">관리자 대시보드 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
        <p className="text-gray-600">수원 힐링 상담센터 데이터 관리</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">상담사</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.counselors}</div>
            <p className="text-blue-100 text-sm">등록된 상담사</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">상담 신청</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.consultations}</div>
            <p className="text-green-100 text-sm">총 상담 신청</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">후기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.reviews}</div>
            <p className="text-purple-100 text-sm">등록된 후기</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">공지사항</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.notices}</div>
            <p className="text-orange-100 text-sm">등록된 공지</p>
          </CardContent>
        </Card>
      </div>

             {/* 데이터 관리 탭 */}
       <Tabs defaultValue="counselors" className="w-full">
         <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg h-12">
           <TabsTrigger 
             value="counselors" 
             className="text-sm font-semibold px-4 py-2 h-10 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-md transition-all duration-200 flex items-center justify-center"
           >
             상담사 관리
           </TabsTrigger>
           <TabsTrigger 
             value="consultations" 
             className="text-sm font-semibold px-4 py-2 h-10 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-md transition-all duration-200 flex items-center justify-center"
           >
             상담 신청
           </TabsTrigger>
           <TabsTrigger 
             value="reviews" 
             className="text-sm font-semibold px-4 py-2 h-10 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-md transition-all duration-200 flex items-center justify-center"
           >
             후기 관리
           </TabsTrigger>
           <TabsTrigger 
             value="notices" 
             className="text-sm font-semibold px-4 py-2 h-10 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md rounded-md transition-all duration-200 flex items-center justify-center"
           >
             공지사항
           </TabsTrigger>
         </TabsList>

        <TabsContent value="counselors" className="mt-6">
          <CounselorsTab />
        </TabsContent>

        <TabsContent value="consultations" className="mt-6">
          <ConsultationsTab />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewsTab />
        </TabsContent>

        <TabsContent value="notices" className="mt-6">
          <NoticesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 상담사 관리 탭
function CounselorsTab() {
  const [counselors, setCounselors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      setLoading(true);
      const response = await getCounselors();
      console.log('상담사 API 응답:', response); // 디버깅 로그
      console.log('상담사 배열:', response?.counselors); // 디버깅 로그
      // getCounselors는 {counselors: [...], total: 5, page: 1, size: 10} 형태로 반환
      setCounselors(response?.counselors || []);
    } catch (error) {
      console.error('상담사 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCounselorSuccess = () => {
    fetchCounselors(); // 목록 새로고침
  };

  const handleDeleteCounselor = async (counselorId: string) => {
    if (confirm('정말로 이 상담사를 삭제하시겠습니까?')) {
      try {
        await deleteCounselor(counselorId);
        fetchCounselors(); // 목록 새로고침
        alert('상담사가 삭제되었습니다.');
      } catch (error) {
        console.error('상담사 삭제 실패:', error);
        alert('상담사 삭제에 실패했습니다.');
      }
    }
  };

  const handleToggleActive = async (counselorId: string, currentStatus: boolean) => {
    try {
      const statusText = currentStatus ? '비활성화' : '활성화';
      
      if (confirm(`정말로 이 상담사를 ${statusText}하시겠습니까?`)) {
        // 새로운 toggleCounselorStatus API 사용
        const success = await toggleCounselorStatus(counselorId);
        
        if (success) {
          alert(`상담사가 ${statusText}되었습니다.`);
          fetchCounselors(); // 목록 새로고침
        } else {
          alert(`${statusText}에 실패했습니다.`);
        }
      }
    } catch (error) {
      console.error('상담사 상태 변경 실패:', error);
      alert('상담사 상태 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">상담사 데이터 로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">상담사 목록</h2>
        <CounselorForm onSuccess={handleCounselorSuccess} />
      </div>
      
      <div className="grid gap-4">
        {counselors.map((counselor) => (
          <Card key={counselor.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{counselor.name}</h3>
                  <p className="text-gray-600">{counselor.specialization}</p>
                  <p className="text-sm text-gray-500">경력: {counselor.experience_years}년</p>
                  <p className="text-sm text-gray-500">{counselor.education}</p>
                  {counselor.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {counselor.description}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="flex space-x-2">
                    <CounselorForm 
                      counselor={counselor} 
                      onSuccess={handleCounselorSuccess}
                      trigger={
                        <Button variant="outline" size="sm">
                          수정
                        </Button>
                      }
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`${
                        counselor.is_active 
                          ? 'text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700' 
                          : 'text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700'
                      }`}
                      onClick={() => handleToggleActive(counselor.id, counselor.is_active)}
                    >
                      {counselor.is_active ? '비활성화' : '활성화'}
                    </Button>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={counselor.is_active ? "default" : "secondary"}
                      onClick={() => handleToggleActive(counselor.id, counselor.is_active)}
                      className="cursor-pointer hover:bg-blue-500 transition-colors"
                    >
                      {counselor.is_active ? '활성' : '비활성'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// 상담 신청 탭
function ConsultationsTab() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await getConsultations();
      console.log('상담신청 API 응답:', response); // 디버깅 로그
      console.log('상담신청 배열:', response?.consultations); // 디버깅 로그
      // getConsultations는 {consultations: [...], total: 5, page: 1, size: 10} 형태로 반환
      setConsultations(response?.consultations || []);
    } catch (error) {
      console.error('상담 신청 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationClick = (consultation: any) => {
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
    return <div className="text-center py-8">상담 신청 데이터 로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">상담 신청 목록</h2>
        <Button 
          variant="outline" 
          onClick={() => window.open('/admin/consultations', '_blank')}
        >
          전체 보기
        </Button>
      </div>
      
      <div className="grid gap-4">
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
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={getStatusColor(consultation.status)}>
                        {getStatusText(consultation.status)}
                      </Badge>
                      <span className="text-sm text-gray-500">#{consultation.id}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">신청자</p>
                          <p className="font-medium">{consultation.user_name || '알 수 없음'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">상담사</p>
                          <p className="font-medium">{consultation.counselor_name || '알 수 없음'}</p>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConsultationClick(consultation);
                    }}
                    className="flex items-center space-x-2 ml-4"
                  >
                    <Eye className="w-4 h-4" />
                    <span>상세보기</span>
                  </Button>
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

// 후기 관리 탭
function ReviewsTab() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviews();
      // getReviews는 {reviews: [...], total: 5, page: 1, size: 10} 형태로 반환
      setReviews(response?.reviews || []);
    } catch (error) {
      console.error('후기 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">후기 데이터 로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">후기 목록</h2>
      </div>
      
      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{review.author_name}</h3>
                  <p className="text-gray-600">{review.content}</p>
                  <p className="text-sm text-gray-500">{review.created_at}</p>
                </div>
                <div className="text-right">
                  <Badge variant={review.is_approved ? "default" : "secondary"}>
                    {review.is_approved ? '승인됨' : '대기중'}
                  </Badge>
                  <div className="mt-2">
                    <span className="text-yellow-600 font-semibold">★ {review.rating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// 공지사항 탭
function NoticesTab() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await getNotices();
      // getNotices는 {notices: [...], total: 5, page: 1, size: 10} 형태로 반환
      setNotices(response?.notices || []);
    } catch (error) {
      console.error('공지사항 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">공지사항 데이터 로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">공지사항 목록</h2>
        <Button variant="outline">새 공지사항 추가</Button>
      </div>
      
      <div className="grid gap-4">
        {notices.map((notice) => (
          <Card key={notice.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{notice.title}</h3>
                  <p className="text-gray-600">{notice.content}</p>
                  <p className="text-sm text-gray-500">{notice.created_at}</p>
                </div>
                <div className="text-right">
                  <Badge variant={notice.is_active ? "default" : "secondary"}>
                    {notice.is_active ? '활성' : '비활성'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
