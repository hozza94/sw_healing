import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CounselorsPage() {
  const counselors = [
    {
      id: 1,
      name: "김민수",
      title: "수석 상담사",
      specialty: "개인 상담, 부부 상담",
      experience: "15년",
      rating: 4.9,
      reviewCount: 127,
      isOnline: true,
      image: "👨‍⚕️",
      description: "개인과 부부의 심리적 어려움을 전문적으로 상담하며, 내담자의 변화와 성장을 돕습니다."
    },
    {
      id: 2,
      name: "이영희",
      title: "전문 상담사",
      specialty: "청소년 상담, 가족 상담",
      experience: "12년",
      rating: 4.8,
      reviewCount: 98,
      isOnline: true,
      image: "👩‍⚕️",
      description: "청소년의 성장 과정에서 겪는 어려움과 가족 관계 개선에 특화되어 있습니다."
    },
    {
      id: 3,
      name: "박준호",
      title: "전문 상담사",
      specialty: "트라우마 상담, 개인 상담",
      experience: "10년",
      rating: 4.7,
      reviewCount: 85,
      isOnline: false,
      image: "👨‍⚕️",
      description: "과거의 상처와 트라우마 치유에 전문성을 가지고 있으며, 안전한 환경에서 상담을 제공합니다."
    },
    {
      id: 4,
      name: "최수진",
      title: "전문 상담사",
      specialty: "부부 상담, 이혼 상담",
      experience: "8년",
      rating: 4.6,
      reviewCount: 73,
      isOnline: true,
      image: "👩‍⚕️",
      description: "부부 간의 갈등 해결과 건강한 관계 구축을 돕는 전문 상담사입니다."
    }
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">전문 상담사 소개</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            각 분야별 전문성을 갖춘 상담사들이 여러분의 마음 치유를 도와드립니다.
            모든 상담사는 지속적인 교육과 훈련을 통해 최고의 서비스를 제공합니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {counselors.map((counselor) => (
            <Card key={counselor.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{counselor.image}</div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900">{counselor.name}</CardTitle>
                      <CardDescription className="text-blue-600 font-medium">{counselor.title}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={counselor.isOnline ? "default" : "secondary"}>
                      {counselor.isOnline ? "온라인" : "오프라인"}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-medium">{counselor.rating}</span>
                      <span className="text-gray-500">({counselor.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">전문 분야</h4>
                    <p className="text-gray-600">{counselor.specialty}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">경력</h4>
                    <p className="text-gray-600">{counselor.experience}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">소개</h4>
                    <p className="text-gray-600 leading-relaxed">{counselor.description}</p>
                  </div>
                  <div className="pt-4">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link href={`/counselors/${counselor.id}`}>상담 예약하기</Link>
                    </Button>
                  </div>
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
                전문 상담사와 함께 당신의 마음을 들여다보고, 
                더 나은 내일을 위한 힘을 찾아보세요.
              </p>
              <Button variant="secondary" size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                <Link href="/consultation">상담 신청하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 