'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getNotice, Notice } from "@/lib/notices"

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noticeId = params.id as string;
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (noticeId) {
      getNotice(noticeId).then((data) => {
        if (data) {
          setNotice(data);
        } else {
          setError('공지사항을 찾을 수 없습니다.');
        }
        setIsLoading(false);
      }).catch(() => {
        setError('공지사항을 불러오는데 실패했습니다.');
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
      setError('공지사항 ID가 없습니다.');
    }
  }, [noticeId]);

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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">⏳</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">공지사항을 불러오는 중...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{error || '공지사항을 찾을 수 없습니다.'}</h3>
              <p className="text-gray-600 mb-8">다른 공지사항을 확인해보세요.</p>
              <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                <Link href="/notices">공지사항 목록으로</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 뒤로가기 버튼 */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              뒤로가기
            </Button>
          </div>

          {/* 공지사항 상세 정보 */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {notice.is_pinned && (
                      <Badge variant="destructive" className="text-xs">
                        📌 고정
                      </Badge>
                    )}
                    <Badge className={`text-xs ${getNoticeTypeColor(notice.notice_type)}`}>
                      {getNoticeTypeLabel(notice.notice_type)}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl text-gray-900 mb-2 tracking-tight">{notice.title}</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
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
            <CardContent className="space-y-6">
              {/* 공지사항 내용 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">공지사항 내용</h3>
                <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {notice.content}
                </div>
              </div>

              {/* 공지사항 정보 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">📋 공지사항 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">유형:</span>
                      <Badge className={`text-xs ${getNoticeTypeColor(notice.notice_type)}`}>
                        {getNoticeTypeLabel(notice.notice_type)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">상태:</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {notice.status === 'published' ? '발행됨' : notice.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">작성일:</span>
                      <span className="text-blue-900">
                        {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">조회수:</span>
                      <span className="text-blue-900">{notice.view_count}회</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">📢 공지사항 특징</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-medium">고정 여부:</span>
                      <Badge variant="secondary" className={notice.is_pinned ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}>
                        {notice.is_pinned ? '고정됨' : '일반'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-medium">우선순위:</span>
                      <span className="text-green-900">
                        {notice.notice_type === 'important' ? '높음' : 
                         notice.notice_type === 'event' ? '보통' : '일반'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-medium">업데이트:</span>
                      <span className="text-green-900">
                        {notice.updated_at ? 
                          new Date(notice.updated_at).toLocaleDateString('ko-KR') : 
                          '없음'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button asChild className="flex-1 px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                  <Link href="/consultation">상담 신청하기</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 px-8 py-4 text-lg font-bold bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
                  <Link href="/notices">다른 공지사항 보기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
