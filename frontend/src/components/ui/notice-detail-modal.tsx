'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Notice } from "@/lib/notices";

interface NoticeDetailModalProps {
  notice: Notice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NoticeDetailModal({ notice, isOpen, onClose }: NoticeDetailModalProps) {
  if (!notice) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
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
              <DialogTitle className="text-2xl text-gray-900 mb-2 tracking-tight">
                {notice.title}
              </DialogTitle>
              <div className="text-sm text-gray-600">
                {new Date(notice.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>조회수: {notice.view_count}</div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
