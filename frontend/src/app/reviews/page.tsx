import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      title: "마음이 가벼워졌어요",
      content: "오랫동안 혼자 끌어안고 있던 고민들을 상담사님과 나누면서 마음이 정말 가벼워졌습니다. 전문적이고 따뜻한 상담에 감사드려요.",
      author: "김**",
      rating: 5,
      date: "2024-01-15",
      counselor: "김민수 상담사",
      category: "개인 상담"
    },
    {
      id: 2,
      title: "부부 관계가 많이 개선되었습니다",
      content: "부부 간 소통 문제로 힘들어했는데, 상담을 통해 서로를 더 잘 이해하게 되었어요. 이제는 건강한 관계를 만들어가고 있습니다.",
      author: "이**",
      rating: 5,
      date: "2024-01-10",
      counselor: "최수진 상담사",
      category: "부부 상담"
    },
    {
      id: 3,
      title: "청소년 상담이 정말 도움이 되었어요",
      content: "아이가 학교생활에서 겪는 어려움을 상담사님과 함께 해결해나가면서 많이 성장했습니다. 전문적인 도움에 감사합니다.",
      author: "박**",
      rating: 4,
      date: "2024-01-08",
      counselor: "이영희 상담사",
      category: "청소년 상담"
    },
    {
      id: 4,
      title: "트라우마 치유에 큰 도움이 되었습니다",
      content: "과거의 상처로 힘들어했는데, 상담을 통해 치유의 과정을 거치면서 많이 회복되었어요. 안전한 환경에서 상담받을 수 있어서 좋았습니다.",
      author: "최**",
      rating: 5,
      date: "2024-01-05",
      counselor: "박준호 상담사",
      category: "트라우마 상담"
    },
    {
      id: 5,
      title: "가족 관계가 개선되었어요",
      content: "가족 구성원 간의 이해와 소통이 부족했는데, 상담을 통해 서로를 더 잘 이해하게 되었습니다. 이제는 건강한 가족 관계를 만들어가고 있어요.",
      author: "정**",
      rating: 4,
      date: "2024-01-03",
      counselor: "이영희 상담사",
      category: "가족 상담"
    },
    {
      id: 6,
      title: "전문적이고 따뜻한 상담이었습니다",
      content: "상담사님의 전문성과 따뜻함이 정말 인상적이었어요. 내담자의 입장에서 깊이 공감해주시고, 실질적인 도움을 주셔서 감사합니다.",
      author: "한**",
      rating: 5,
      date: "2023-12-28",
      counselor: "김민수 상담사",
      category: "개인 상담"
    }
  ]

  const getRatingStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating)
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">상담 후기</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            실제 상담을 받으신 분들의 생생한 후기를 확인해보세요.
            전문 상담사와 함께한 치유의 여정을 통해 얻은 변화와 성장을 공유합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-gray-900 mb-2">{review.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {review.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{review.counselor}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-500 text-sm mb-1">
                      {getRatingStars(review.rating)}
                    </div>
                    <div className="text-xs text-gray-500">{review.date}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {review.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">- {review.author}</span>
                  <Link href={`/reviews/${review.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    자세히 보기 →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA 섹션 */}
        <div className="text-center mt-16">
          <Card className="bg-blue-600 text-white border-0 shadow-xl max-w-2xl mx-auto">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">상담을 시작해보세요</h2>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                후기를 보셨다면, 이제 여러분도 전문 상담사와 함께 
                치유의 여정을 시작해보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                  <Link href="/consultation">상담 신청하기</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4" asChild>
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