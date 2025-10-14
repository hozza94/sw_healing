'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getApprovedReviews, Review, getReview } from "@/lib/reviews"
import { useEffect, useState } from "react"
import { ReviewDetailModal } from "@/components/ui/review-detail-modal"

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getApprovedReviews();
        setReviews(data);
      } catch (err) {
        console.error('후기 데이터 로딩 실패:', err);
        setError('후기 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadReviews();
  }, []);

  const handleReviewClick = async (reviewId: string) => {
    try {
      const review = await getReview(reviewId);
      if (review) {
        setSelectedReview(review);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('리뷰 상세 정보 로딩 실패:', err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">후기 정보를 불러오는 중...</h3>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-6">고객 후기</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            실제 상담을 받으신 고객들의 생생한 후기입니다.
            <br />
            여러분의 마음 치유 여정에 도움이 될 것입니다.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">아직 후기가 없습니다</h3>
            <p className="text-gray-600 mb-8">첫 번째 후기를 작성해보세요!</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/consultation">상담 신청하기</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm cursor-pointer group" onClick={() => handleReviewClick(review.id)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{review.title}</CardTitle>
                      <CardDescription className="text-blue-600 font-medium">
                        {review.counselor_name ? `${review.counselor_name} 상담사` : '일반 후기'}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(review.created_at).toLocaleDateString('ko-KR')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3">{review.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>평점: {review.rating}/5</span>
                      <span>작성자: {review.author_name || '익명'}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReviewClick(review.id);
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
                전문 상담사와 함께 당신의 마음을 들여다보고, 
                더 나은 내일을 위한 힘을 찾아보세요.
              </p>
                                        <Button variant="secondary" size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                            <Link href="/consultation">상담 신청하기</Link>
                          </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 리뷰 상세 모달 */}
      <ReviewDetailModal 
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  )
} 