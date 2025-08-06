import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// 임시 후기 데이터
const reviews = [
  {
    id: 1,
    counselorName: "김상담",
    rating: 5,
    title: "정말 따뜻하고 전문적인 상담이었습니다",
    content: "처음에는 많이 긴장했는데, 상담사님이 정말 따뜻하게 맞아주셔서 편안하게 상담받을 수 있었습니다. 제 고민을 정말 깊이 들어주시고, 구체적인 해결책도 제시해주셔서 정말 도움이 많이 되었어요.",
    author: "김**",
    date: "2024-01-15",
    isAnonymous: false
  },
  {
    id: 2,
    counselorName: "이치유",
    rating: 4,
    title: "가족 관계가 많이 개선되었어요",
    content: "가족 간의 소통 문제로 상담을 받았는데, 상담사님이 각자의 입장을 이해하고 중재해주셔서 정말 도움이 되었습니다. 이제 가족들과 더 잘 소통할 수 있게 되었어요.",
    author: "이**",
    date: "2024-01-10",
    isAnonymous: true
  },
  {
    id: 3,
    counselorName: "박희망",
    rating: 5,
    title: "트라우마에서 벗어날 수 있었습니다",
    content: "오랫동안 트라우마로 힘들어했는데, 상담사님이 안전한 환경에서 차근차근 치유할 수 있도록 도와주셨습니다. 이제 더 이상 과거에 얽매이지 않고 앞으로 나아갈 수 있어요.",
    author: "박**",
    date: "2024-01-08",
    isAnonymous: false
  },
  {
    id: 4,
    counselorName: "최따뜻",
    rating: 4,
    title: "부부 관계가 회복되었습니다",
    content: "부부 간의 갈등이 심했는데, 상담사님이 각자의 감정을 이해하고 소통 방법을 가르쳐주셔서 정말 도움이 되었습니다. 이제 서로를 더 이해하고 사랑할 수 있어요.",
    author: "최**",
    date: "2024-01-05",
    isAnonymous: true
  },
  {
    id: 5,
    counselorName: "김상담",
    rating: 5,
    title: "자신감을 찾을 수 있었어요",
    content: "자신감이 없어서 상담을 받았는데, 상담사님이 제 안에 있는 장점들을 발견할 수 있도록 도와주셨습니다. 이제 더 자신감 있게 살 수 있어요.",
    author: "정**",
    date: "2024-01-03",
    isAnonymous: false
  },
  {
    id: 6,
    counselorName: "이치유",
    rating: 4,
    title: "청소년 자녀와의 관계가 개선되었습니다",
    content: "청소년 자녀와 소통이 안 되어서 상담을 받았는데, 상담사님이 자녀의 입장을 이해하고 소통 방법을 가르쳐주셔서 정말 도움이 되었습니다.",
    author: "한**",
    date: "2024-01-01",
    isAnonymous: true
  }
]

export default function ReviewsPage() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ⭐
      </span>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <Link href="/" className="text-xl font-bold text-gray-900">수원 힐링 상담센터</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/auth/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">회원가입</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">상담 후기</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            실제 상담을 받으신 분들의 생생한 후기를 확인해보세요
          </p>
        </div>

        {/* 통계 */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8</div>
              <div className="text-gray-600">평균 평점</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">총 후기 수</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">만족도</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">10+</div>
              <div className="text-gray-600">전문 상담사</div>
            </CardContent>
          </Card>
        </div>

        {/* 후기 목록 */}
        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{review.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {review.counselorName} 상담사
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{review.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{review.isAnonymous ? "익명" : review.author}</span>
                  <span>{review.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">이전</Button>
            <Button size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">다음</Button>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold mb-4">상담을 시작해보세요</h2>
              <p className="text-blue-100 mb-6">
                실제 후기를 보셨다면, 이제 당신의 차례입니다. 
                전문 상담사와 함께 치유의 여정을 시작해보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/consultation">상담 신청하기</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/counselors">상담사 소개</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 