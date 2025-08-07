'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getReview, Review } from "@/lib/reviews"

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reviewId = params.id as string;
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (reviewId) {
      getReview(reviewId).then((data) => {
        if (data) {
          setReview(data);
        } else {
          setError('후기를 찾을 수 없습니다.');
        }
        setIsLoading(false);
      }).catch(() => {
        setError('후기를 불러오는데 실패했습니다.');
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
      setError('후기 ID가 없습니다.');
    }
  }, [reviewId]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">⏳</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">후기 정보를 불러오는 중...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{error || '후기를 찾을 수 없습니다.'}</h3>
              <p className="text-gray-600 mb-8">다른 후기를 확인해보세요.</p>
              <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                <Link href="/reviews">후기 목록으로</Link>
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

          {/* 후기 상세 정보 */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl text-gray-900 mb-2 tracking-tight">{review.title}</CardTitle>
                  <CardDescription className="text-lg text-blue-600 font-semibold">
                    {review.counselor_name ? `${review.counselor_name} 상담사` : '일반 후기'}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-500 text-xl" : "text-gray-300 text-xl"}>
                        ⭐
                      </span>
                    ))}
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {new Date(review.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 후기 내용 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">후기 내용</h3>
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {review.content}
                </p>
              </div>

              {/* 후기 정보 */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">📊 후기 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">평점:</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {review.rating}/5점
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">작성자:</span>
                      <span className="text-blue-900">{review.author_name || '익명'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">작성일:</span>
                      <span className="text-blue-900">
                        {new Date(review.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-3">👨‍⚕️ 상담 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-medium">상담사:</span>
                      <span className="text-green-900">{review.counselor_name || '미지정'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-medium">상담 ID:</span>
                      <span className="text-green-900">{review.consultation_id || '미연결'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-800 font-medium">승인 상태:</span>
                      <Badge variant="secondary" className={review.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {review.is_approved ? '승인됨' : '대기중'}
                      </Badge>
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
                  <Link href="/reviews">다른 후기 보기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
