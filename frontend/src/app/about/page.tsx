import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                센터 소개
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">수원 힐링 상담센터 소개</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              마음을 치유하는 따뜻한 공간으로 여러분을 초대합니다
            </p>
          </div>

          {/* 센터 소개 */}
          <Card className="mb-16 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-blue-600">
                우리의 이야기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
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
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600">우리의 미션</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  전문적이고 따뜻한 상담을 통해 모든 내담자가 건강한 마음을 회복하고, 
                  더 나은 삶을 살아갈 수 있도록 돕는 것입니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-green-600">우리의 비전</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  수원 지역의 대표적인 상담센터로 성장하여, 
                  마음의 치유가 필요한 모든 분들에게 신뢰받는 상담 서비스를 제공합니다.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 핵심 가치 */}
          <Card className="mb-16 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-blue-600">
                우리의 핵심 가치
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-blue-600">신뢰</h3>
                  <p className="text-gray-600 leading-relaxed">
                    내담자의 개인정보를 철저히 보호하고, 
                    안전한 환경에서 상담받을 수 있도록 합니다.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">💙</span>
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-green-600">공감</h3>
                  <p className="text-gray-600 leading-relaxed">
                    내담자의 감정과 상황을 깊이 이해하고, 
                    따뜻한 마음으로 함께합니다.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-purple-600">전문성</h3>
                  <p className="text-gray-600 leading-relaxed">
                    지속적인 교육과 훈련을 통해 
                    최고의 상담 서비스를 제공합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 상담 분야 */}
          <Card className="mb-16 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-blue-600">
                상담 분야
              </CardTitle>
              <CardDescription className="text-lg">
                다양한 분야의 전문 상담을 제공합니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">개인 상담</h4>
                      <p className="text-gray-600 leading-relaxed">스트레스, 우울증, 불안, 트라우마 등 개인의 심리적 어려움</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">2</div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">부부 상담</h4>
                      <p className="text-gray-600 leading-relaxed">부부 간 소통 문제, 갈등 해결, 관계 개선</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">3</div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">가족 상담</h4>
                      <p className="text-gray-600 leading-relaxed">가족 구성원 간의 이해와 소통, 가족 관계 개선</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">4</div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">청소년 상담</h4>
                      <p className="text-gray-600 leading-relaxed">청소년의 성장 과정에서 겪는 어려움과 스트레스</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">5</div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">트라우마 상담</h4>
                      <p className="text-gray-600 leading-relaxed">과거의 상처와 트라우마 치유</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">6</div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">이혼 상담</h4>
                      <p className="text-gray-600 leading-relaxed">이혼 과정에서의 심리적 지원과 회복</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 연락처 및 위치 */}
          <Card className="mb-16 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-blue-600">
                연락처 및 위치
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-bold text-2xl mb-6 text-blue-600">연락처</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">📞</span>
                      <span className="text-lg">031-123-4567</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">📧</span>
                      <span className="text-lg">info@suwon-healing.com</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">🕒</span>
                      <span className="text-lg">평일 09:00-18:00, 토요일 09:00-14:00</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-2xl mb-6 text-green-600">위치</h3>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-start space-x-4">
                      <span className="text-2xl">📍</span>
                      <span className="text-lg">수원시 팔달구 중부대로 123<br />힐링빌딩 3층</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">🚇</span>
                      <span className="text-lg">수원역 1번 출구에서 도보 5분</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">🚌</span>
                      <span className="text-lg">수원역 정류장 하차</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA 섹션 */}
          <div className="text-center">
            <Card className="bg-blue-600 text-white border-0 shadow-xl">
              <CardContent className="py-16">
                <h2 className="text-4xl font-bold mb-6">상담을 시작해보세요</h2>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
                  우리 센터에 대해 더 자세히 알아보셨다면, 
                  이제 전문 상담사와 함께 치유의 여정을 시작해보세요.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
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
    </div>
  )
} 