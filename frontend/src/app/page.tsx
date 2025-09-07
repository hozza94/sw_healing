'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 메인 히어로 섹션 */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              전문 상담사와 함께하는 마음 치유
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            마음을 치유하는
            <span className="text-blue-600"> 따뜻한 공간</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
            전문 상담사와 함께 당신의 마음을 들여다보고, 
            더 나은 내일을 위한 힘을 찾아보세요.
            언제든지 편안하게 문의해주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg px-8 py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
              <Link href="/consultation">상담 신청하기</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-50 hover:text-blue-700 border-2 border-blue-300 hover:border-blue-400 text-lg px-8 py-4 font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
              <Link href="/counselors">상담사 소개</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 서비스 섹션 */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">우리의 서비스</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed font-medium">
            다양한 상담 분야에서 전문적인 도움을 제공합니다.
            각 분야별 전문 상담사가 최적의 솔루션을 제시합니다.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-4">개인 상담</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                개인의 고민과 스트레스를 전문적으로 상담하고 해결책을 제시합니다.
                우울증, 불안증, 자존감 문제 등 다양한 개인적 어려움을 다룹니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💑</span>
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-4">부부 상담</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                부부 간의 갈등과 소통 문제를 해결하여 건강한 관계를 만들어갑니다.
                이혼 위기, 소통 부족, 갈등 해결 등 부부 관계의 모든 문제를 다룹니다.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-4">가족 상담</CardTitle>
              <CardDescription className="text-gray-600 leading-relaxed">
                가족 구성원 간의 이해와 소통을 돕고 건강한 가족 관계를 구축합니다.
                부모-자녀 관계, 형제 관계, 가족 갈등 등 가족 전체의 문제를 다룹니다.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-blue-50 rounded-2xl p-8 hover:bg-blue-100 transition-all duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-3">500+</div>
              <div className="text-gray-600 font-medium">상담 완료</div>
            </div>
            <div className="bg-green-50 rounded-2xl p-8 hover:bg-green-100 transition-all duration-300">
              <div className="text-4xl font-bold text-green-600 mb-3">98%</div>
              <div className="text-gray-600 font-medium">고객 만족도</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-8 hover:bg-purple-100 transition-all duration-300">
              <div className="text-4xl font-bold text-purple-600 mb-3">10+</div>
              <div className="text-gray-600 font-medium">전문 상담사</div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-8 hover:bg-orange-100 transition-all duration-300">
              <div className="text-4xl font-bold text-orange-600 mb-3">5년</div>
              <div className="text-gray-600 font-medium">운영 경력</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <Card className="bg-blue-600 text-white border-0 shadow-xl max-w-4xl mx-auto">
            <CardContent className="py-16">
              <h2 className="text-4xl font-bold mb-6">지금 바로 상담을 시작해보세요</h2>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed max-w-3xl mx-auto">
                전문 상담사와 함께 당신의 마음을 들여다보고, 
                더 나은 내일을 위한 힘을 찾아보세요.
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
      </section>
    </div>
  )
}
