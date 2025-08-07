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
      
      // 각 데이터 타입별로 개수 조회
      const [counselorsRes, consultationsRes, reviewsRes, noticesRes] = await Promise.all([
        getCounselors(),
        getConsultations(),
        getReviews(),
        getNotices()
      ]);

      setStats({
        counselors: counselorsRes?.data?.total || 0,
        consultations: consultationsRes?.data?.total || 0,
        reviews: reviewsRes?.data?.total || 0,
        notices: noticesRes?.data?.total || 0
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="counselors">상담사 관리</TabsTrigger>
          <TabsTrigger value="consultations">상담 신청</TabsTrigger>
          <TabsTrigger value="reviews">후기 관리</TabsTrigger>
          <TabsTrigger value="notices">공지사항</TabsTrigger>
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
      setCounselors(response?.data?.counselors || []);
    } catch (error) {
      console.error('상담사 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">상담사 데이터 로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">상담사 목록</h2>
        <Button variant="outline">새 상담사 추가</Button>
      </div>
      
      <div className="grid gap-4">
        {counselors.map((counselor) => (
          <Card key={counselor.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{counselor.name}</h3>
                  <p className="text-gray-600">{counselor.specialization}</p>
                  <p className="text-sm text-gray-500">{counselor.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant={counselor.is_online ? "default" : "secondary"}>
                    {counselor.is_online ? '온라인' : '오프라인'}
                  </Badge>
                  <div className="mt-2">
                    <span className="text-yellow-600 font-semibold">★ {counselor.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({counselor.total_reviews}개 후기)</span>
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

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await getConsultations();
      setConsultations(response?.data?.consultations || []);
    } catch (error) {
      console.error('상담 신청 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">상담 신청 데이터 로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">상담 신청 목록</h2>
      </div>
      
      <div className="grid gap-4">
        {consultations.map((consultation) => (
          <Card key={consultation.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">상담 신청 #{consultation.id}</h3>
                  <p className="text-gray-600">{consultation.consultation_type}</p>
                  <p className="text-sm text-gray-500">{consultation.scheduled_at}</p>
                </div>
                <div className="text-right">
                  <Badge variant={consultation.status === 'PENDING' ? 'secondary' : 'default'}>
                    {consultation.status === 'PENDING' ? '대기중' : '확정'}
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
      setReviews(response?.data?.reviews || []);
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
      setNotices(response?.data?.notices || []);
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
