"use client";

import React, { useState, useEffect } from 'react';
import { getNotices, type Notice as NoticeType } from '../services/noticeService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Pin, AlertCircle, Loader2 } from 'lucide-react';

export const Notice: React.FC = () => {
  const [notices, setNotices] = useState<NoticeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getNotices();
        setNotices(data);
      } catch (err) {
        setError('공지사항을 불러오는데 실패했습니다.');
        console.error('공지사항 로딩 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">공지사항을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="page-header">
        <h1 className="page-title">공지사항</h1>
        <p className="page-subtitle">
          수원힐링상담센터의 최신 소식과 중요한 안내사항을 확인하세요
        </p>
      </div>

      {/* 공지사항 목록 */}
      <div className="space-y-6">
        {notices.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">등록된 공지사항이 없습니다</h3>
              <p className="text-gray-600">새로운 공지사항이 등록되면 여기에 표시됩니다.</p>
            </CardContent>
          </Card>
        ) : (
          notices.map((notice) => (
            <Card key={notice.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {notice.is_pinned && (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                          <Pin className="w-3 h-3 mr-1" />
                          중요
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {notice.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                      {notice.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(notice.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(notice.created_at).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {notice.content.length > 200 
                    ? `${notice.content.substring(0, 200)}...` 
                    : notice.content
                  }
                </p>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={`/notice/${notice.id}`}>
                    자세히 보기
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 페이지 하단 안내 */}
      <div className="mt-12 text-center">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">공지사항 안내</h3>
            <p className="text-blue-800 text-sm">
              중요한 공지사항은 상단에 고정되어 표시됩니다. 
              정기적으로 확인하시어 놓치지 마세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 