import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              <h1 className="text-xl font-bold text-gray-900">수원 힐링 상담센터</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/about" className="text-gray-600 hover:text-gray-900">소개</Link>
              <Link href="/consultation" className="text-gray-600 hover:text-gray-900">상담 신청</Link>
              <Link href="/counselors" className="text-gray-600 hover:text-gray-900">상담사</Link>
              <Link href="/reviews" className="text-gray-600 hover:text-gray-900">후기</Link>
              <Link href="/notices" className="text-gray-600 hover:text-gray-900">공지사항</Link>
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

      {/* 메인 히어로 섹션 */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            마음을 치유하는
            <span className="text-blue-600"> 따뜻한 공간</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            전문 상담사와 함께 당신의 마음을 들여다보고, 
            더 나은 내일을 위한 힘을 찾아보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/consultation">상담 신청하기</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/counselors">상담사 소개</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 서비스 섹션 */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">우리의 서비스</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            다양한 상담 분야에서 전문적인 도움을 제공합니다
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <CardTitle>개인 상담</CardTitle>
              <CardDescription>
                개인의 고민과 스트레스를 전문적으로 상담하고 해결책을 제시합니다
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💑</span>
              </div>
              <CardTitle>부부 상담</CardTitle>
              <CardDescription>
                부부 간의 갈등과 소통 문제를 해결하여 건강한 관계를 만들어갑니다
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
              </div>
              <CardTitle>가족 상담</CardTitle>
              <CardDescription>
                가족 구성원 간의 이해와 소통을 돕고 건강한 가족 관계를 구축합니다
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">상담 완료</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">고객 만족도</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">10+</div>
              <div className="text-gray-600">전문 상담사</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">5년+</div>
              <div className="text-gray-600">운영 경력</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4">지금 바로 상담을 시작해보세요</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              전문 상담사와 함께 당신의 마음을 들여다보고, 
              더 나은 내일을 위한 첫 걸음을 내딛어보세요.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/consultation">무료 상담 신청</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">수원 힐링 상담센터</h3>
              <p className="text-gray-400">
                마음을 치유하는 따뜻한 공간
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/consultation" className="hover:text-white">상담 신청</Link></li>
                <li><Link href="/counselors" className="hover:text-white">상담사 소개</Link></li>
                <li><Link href="/reviews" className="hover:text-white">후기</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">고객지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/notices" className="hover:text-white">공지사항</Link></li>
                <li><Link href="/about" className="hover:text-white">센터 소개</Link></li>
                <li><Link href="/contact" className="hover:text-white">연락처</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">연락처</h4>
              <div className="space-y-2 text-gray-400">
                <p>📞 031-123-4567</p>
                <p>📧 info@suwon-healing.com</p>
                <p>📍 수원시 팔달구 중부대로 123</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 수원 힐링 상담센터. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
