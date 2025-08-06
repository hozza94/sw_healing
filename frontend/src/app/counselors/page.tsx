import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// 임시 상담사 데이터
const counselors = [
  {
    id: 1,
    name: "김상담",
    specialization: "개인상담, 부부상담",
    education: "심리학 박사",
    experience: "10년 경력",
    bio: "개인과 부부의 심리적 어려움을 전문적으로 상담하며, 따뜻하고 공감적인 접근으로 내담자의 변화를 돕습니다.",
    rating: 4.8,
    totalReviews: 127,
    isOnline: true,
    profileImage: "👩‍⚕️"
  },
  {
    id: 2,
    name: "이치유",
    specialization: "가족상담, 청소년상담",
    education: "가족치료 전문가",
    experience: "8년 경력",
    bio: "가족 구성원 간의 소통과 이해를 돕고, 청소년의 성장 과정에서 겪는 어려움을 전문적으로 상담합니다.",
    rating: 4.9,
    totalReviews: 95,
    isOnline: true,
    profileImage: "👨‍⚕️"
  },
  {
    id: 3,
    name: "박희망",
    specialization: "트라우마 상담, 우울증 상담",
    education: "임상심리학 석사",
    experience: "6년 경력",
    bio: "트라우마와 우울증을 전문으로 하며, 내담자가 안전한 환경에서 치유의 여정을 시작할 수 있도록 돕습니다.",
    rating: 4.7,
    totalReviews: 83,
    isOnline: false,
    profileImage: "👩‍🦰"
  },
  {
    id: 4,
    name: "최따뜻",
    specialization: "부부상담, 이혼상담",
    education: "부부가족치료 전문가",
    experience: "12년 경력",
    bio: "부부 관계의 회복과 치유를 전문으로 하며, 건강한 관계로의 변화를 돕습니다.",
    rating: 4.6,
    totalReviews: 156,
    isOnline: true,
    profileImage: "👨‍🦱"
  }
]

export default function CounselorsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">전문 상담사 소개</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            각 분야의 전문성을 갖춘 상담사들이 당신의 마음 치유를 돕겠습니다
          </p>
        </div>

        {/* 상담사 목록 */}
        <div className="grid md:grid-cols-2 gap-8">
          {counselors.map((counselor) => (
            <Card key={counselor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                      {counselor.profileImage}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{counselor.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {counselor.specialization}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm font-medium">{counselor.rating}</span>
                    <span className="text-xs text-gray-500">({counselor.totalReviews})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">전문 분야</h4>
                    <p className="text-sm text-gray-600">{counselor.specialization}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">학력 및 경력</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>• {counselor.education}</p>
                      <p>• {counselor.experience}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">소개</h4>
                    <p className="text-sm text-gray-600">{counselor.bio}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${counselor.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm text-gray-600">
                        {counselor.isOnline ? '온라인' : '오프라인'}
                      </span>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/counselors/${counselor.id}`}>상세보기</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA 섹션 */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold mb-4">상담을 시작해보세요</h2>
              <p className="text-blue-100 mb-6">
                전문 상담사와 함께 당신의 마음을 들여다보고, 
                더 나은 내일을 위한 힘을 찾아보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/consultation">상담 신청하기</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/reviews">후기 보기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 