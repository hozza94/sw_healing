import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AboutPage() {
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">수원 힐링 상담센터 소개</h1>
            <p className="text-xl text-gray-600">
              마음을 치유하는 따뜻한 공간으로 여러분을 초대합니다
            </p>
          </div>

          {/* 센터 소개 */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">우리의 이야기</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-gray-700">
                <p>
                  수원 힐링 상담센터는 2019년 설립되어, 수원 지역에서 마음의 치유를 필요로 하는 
                  모든 분들에게 전문적이고 따뜻한 상담 서비스를 제공하고 있습니다.
                </p>
                <p>
                  우리는 개인, 부부, 가족, 청소년 등 다양한 대상에게 맞춤형 상담을 제공하며, 
                  각 내담자의 고유한 상황과 필요에 맞는 해결책을 함께 찾아갑니다.
                </p>
                <p>
                  전문 상담사들은 지속적인 교육과 훈련을 통해 최신 상담 기법을 습득하고, 
                  내담자의 변화와 성장을 돕기 위해 끊임없이 노력하고 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 미션과 비전 */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">우리의 미션</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  전문적이고 따뜻한 상담을 통해 모든 내담자가 건강한 마음을 회복하고, 
                  더 나은 삶을 살아갈 수 있도록 돕는 것입니다.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">우리의 비전</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  수원 지역의 대표적인 상담센터로 성장하여, 
                  마음의 치유가 필요한 모든 분들에게 신뢰받는 상담 서비스를 제공합니다.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 핵심 가치 */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">우리의 핵심 가치</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">신뢰</h3>
                  <p className="text-gray-600 text-sm">
                    내담자의 개인정보를 철저히 보호하고, 
                    안전한 환경에서 상담받을 수 있도록 합니다.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💙</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">공감</h3>
                  <p className="text-gray-600 text-sm">
                    내담자의 감정과 상황을 깊이 이해하고, 
                    따뜻한 마음으로 함께합니다.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">전문성</h3>
                  <p className="text-gray-600 text-sm">
                    지속적인 교육과 훈련을 통해 
                    최고의 상담 서비스를 제공합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상담 분야 */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">상담 분야</CardTitle>
              <CardDescription>
                다양한 분야의 전문 상담을 제공합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-semibold">개인 상담</h4>
                      <p className="text-sm text-gray-600">스트레스, 우울증, 불안, 트라우마 등 개인의 심리적 어려움</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-semibold">부부 상담</h4>
                      <p className="text-sm text-gray-600">부부 간 소통 문제, 갈등 해결, 관계 개선</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-semibold">가족 상담</h4>
                      <p className="text-sm text-gray-600">가족 구성원 간의 이해와 소통, 가족 관계 개선</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-semibold">청소년 상담</h4>
                      <p className="text-sm text-gray-600">청소년의 성장 과정에서 겪는 어려움과 스트레스</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-sm font-bold">5</div>
                    <div>
                      <h4 className="font-semibold">트라우마 상담</h4>
                      <p className="text-sm text-gray-600">과거의 상처와 트라우마 치유</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-bold">6</div>
                    <div>
                      <h4 className="font-semibold">이혼 상담</h4>
                      <p className="text-sm text-gray-600">이혼 과정에서의 심리적 지원과 회복</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 연락처 및 위치 */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">연락처 및 위치</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">연락처</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-600">📞</span>
                      <span>031-123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-600">📧</span>
                      <span>info@suwon-healing.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-600">🕒</span>
                      <span>평일 09:00-18:00, 토요일 09:00-14:00</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4">위치</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-600">📍</span>
                      <span>수원시 팔달구 중부대로 123<br />힐링빌딩 3층</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-600">🚇</span>
                      <span>수원역 1번 출구에서 도보 5분</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-600">🚌</span>
                      <span>수원역 정류장 하차</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA 섹션 */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardContent className="py-12">
                <h2 className="text-2xl font-bold mb-4">상담을 시작해보세요</h2>
                <p className="text-blue-100 mb-6">
                  우리 센터에 대해 더 자세히 알아보셨다면, 
                  이제 전문 상담사와 함께 치유의 여정을 시작해보세요.
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
    </div>
  )
} 