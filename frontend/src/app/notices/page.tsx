'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getPublishedNotices, Notice, getNotice } from "@/lib/notices"
import { useEffect, useState } from "react"
import { NoticeDetailModal } from "@/components/ui/notice-detail-modal"

export default function NoticesPage() {
  const router = useRouter();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await getPublishedNotices();
        setNotices(data);
      } catch (err) {
        console.error('공지사항 데이터 로딩 실패:', err);
        setError('공지사항을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadNotices();
  }, []);

  const handleNoticeClick = async (noticeId: string) => {
    try {
      const notice = await getNotice(noticeId);
      if (notice) {
        setSelectedNotice(notice);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('공지사항 상세 정보 로딩 실패:', err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  const getNoticeTypeLabel = (type: string) => {
    switch (type) {
      case 'general': return '일반';
      case 'important': return '중요';
      case 'event': return '이벤트';
      case 'maintenance': return '점검';
      default: return type;
    }
  };

  const getNoticeTypeColor = (type: string) => {
    switch (type) {
      case 'important': return 'bg-red-500 hover:bg-red-600';
      case 'event': return 'bg-green-500 hover:bg-green-600';
      case 'maintenance': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">공지사항을 불러오는 중...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">{error}</h3>
            <p className="text-gray-600 mb-8">잠시 후 다시 시도해주세요.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">공지사항</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            수원힐링센터의 최신 소식과 중요한 안내사항을 확인하세요.
            <br />
            고객님의 편의를 위해 항상 최신 정보를 제공합니다.
          </p>
        </div>

        {notices.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">등록된 공지사항이 없습니다</h3>
            <p className="text-gray-600 mb-8">곧 새로운 소식을 전해드리겠습니다.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {notices.map((notice) => (
              <Card key={notice.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm cursor-pointer group" onClick={() => handleNoticeClick(notice.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {notice.is_pinned && (
                          <Badge variant="destructive" className="text-xs">
                            📌 고정
                          </Badge>
                        )}
                        <Badge className={`text-xs ${getNoticeTypeColor(notice.notice_type)}`}>
                          {getNoticeTypeLabel(notice.notice_type)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{notice.title}</CardTitle>
                      <CardDescription className="text-gray-600">
                        {new Date(notice.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </CardDescription>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>조회수: {notice.view_count}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {notice.content.length > 200 
                      ? `${notice.content.substring(0, 200)}...` 
                      : notice.content
                    }
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      상태: {notice.status === 'published' ? '발행됨' : notice.status}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNoticeClick(notice.id);
                      }}
                    >
                      <span>자세히 보기</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA 섹션 */}
        <div className="text-center mt-16">
          <Card className="bg-blue-600 text-white border-0 shadow-xl max-w-2xl mx-auto">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">상담을 시작해보세요</h2>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                공지사항을 확인하셨다면, 이제 전문 상담사와 함께 
                마음 치유의 여정을 시작해보세요.
              </p>
              <Button variant="secondary" size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                <Link href="/consultation">상담 신청하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 공지사항 상세 모달 */}
      <NoticeDetailModal 
        notice={selectedNotice}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  )
} 