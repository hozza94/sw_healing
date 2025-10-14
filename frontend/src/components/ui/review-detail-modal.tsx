'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Review } from "@/lib/reviews";

interface ReviewDetailModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewDetailModal({ review, isOpen, onClose }: ReviewDetailModalProps) {
  if (!review) return null;

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  리뷰
                </Badge>
                <div className={`text-2xl font-bold ${getRatingColor(review.rating)}`}>
                  {getRatingStars(review.rating)}
                </div>
              </div>
              <DialogTitle className="text-2xl text-gray-900 mb-2 tracking-tight">
                {review.title}
              </DialogTitle>
              <div className="text-sm text-gray-600">
                {new Date(review.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>평점: {review.rating}/5</div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 리뷰 내용 */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">리뷰 내용</h3>
            <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
              {review.content}
            </div>
          </div>

          {/* 리뷰 정보 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">📋 리뷰 정보</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">평점:</span>
                  <div className={`text-xl font-bold ${getRatingColor(review.rating)}`}>
                    {getRatingStars(review.rating)}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">상태:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {review.is_approved ? '승인됨' : '대기중'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">작성일:</span>
                  <span className="text-blue-900">
                    {new Date(review.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-800 font-medium">상담사:</span>
                  <span className="text-blue-900">{review.counselor_name}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">💬 리뷰 특징</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">익명 여부:</span>
                  <Badge variant="secondary" className={review.is_anonymous ? "bg-gray-100 text-gray-800" : "bg-blue-100 text-blue-800"}>
                    {review.is_anonymous ? '익명' : '공개'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">만족도:</span>
                  <span className="text-green-900">
                    {review.rating >= 4 ? '매우 만족' : 
                     review.rating >= 3 ? '만족' : '보통'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">업데이트:</span>
                  <span className="text-green-900">
                    {review.updated_at ? 
                      new Date(review.updated_at).toLocaleDateString('ko-KR') : 
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
