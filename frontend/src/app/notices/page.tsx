import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

// 임시 공지사항 데이터
const notices = [
  {
    id: 1,
    title: "2024년 상담센터 운영 안내",
    content: "2024년 수원 힐링 상담센터 운영 시간 및 휴무일 안내드립니다. 평일 오전 9시부터 오후 6시까지 운영하며, 토요일은 오전 9시부터 오후 2시까지 운영합니다. 일요일 및 공휴일은 휴무입니다.",
    type: "공지",
    isPinned: true,
    date: "2024-01-15",
    viewCount: 245
  },
  {
    id: 2,
    title: "온라인 상담 서비스 시작 안내",
    content: "코로나19 상황을 고려하여 온라인 상담 서비스를 시작합니다. 화상회의를 통해 안전하고 편리하게 상담받으실 수 있습니다. 상담 신청 시 온라인 상담을 원하시는지 선택해주세요.",
    type: "안내",
    isPinned: false,
    date: "2024-01-10",
    viewCount: 189
  },
  {
    id: 3,
    title: "새로운 상담사 합류 안내",
    content: "청소년 상담 전문가 이치유 상담사가 합류하여 더욱 다양한 분야의 상담 서비스를 제공할 수 있게 되었습니다. 청소년 상담이 필요하신 분들은 언제든 연락주세요.",
    type: "안내",
    isPinned: false,
    date: "2024-01-08",
    viewCount: 156
  },
  {
    id: 4,
    title: "개인정보 처리방침 개정 안내",
    content: "개인정보보호법 개정에 따라 개인정보 처리방침이 변경되었습니다. 주요 변경사항은 개인정보 수집 및 이용 목적 명확화, 보유기간 단축 등입니다. 자세한 내용은 개인정보 처리방침을 확인해주세요.",
    type: "공지",
    isPinned: false,
    date: "2024-01-05",
    viewCount: 134
  },
  {
    id: 5,
    title: "상담 예약 시스템 개선 안내",
    content: "더욱 편리한 상담 예약을 위해 온라인 예약 시스템을 개선했습니다. 이제 실시간으로 상담사별 예약 가능 시간을 확인하고 예약하실 수 있습니다.",
    type: "안내",
    isPinned: false,
    date: "2024-01-03",
    viewCount: 98
  },
  {
    id: 6,
    title: "연말연시 상담센터 운영 안내",
    content: "연말연시 기간 동안 상담센터 운영 시간이 변경됩니다. 12월 31일은 오전 9시부터 오후 2시까지, 1월 1일은 휴무입니다. 1월 2일부터 정상 운영됩니다.",
    type: "공지",
    isPinned: false,
    date: "2023-12-28",
    viewCount: 87
  }
]

export default function NoticesPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">공지사항</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            상담센터의 주요 소식과 안내사항을 확인하세요
          </p>
        </div>

        {/* 공지사항 목록 */}
        <div className="max-w-4xl mx-auto space-y-4">
          {notices.map((notice) => (
            <Card key={notice.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {notice.isPinned && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                          고정
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        notice.type === '공지' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {notice.type}
                      </span>
                    </div>
                    <CardTitle className="text-lg">
                      <Link href={`/notices/${notice.id}`} className="hover:text-blue-600">
                        {notice.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {notice.content.length > 100 
                        ? `${notice.content.substring(0, 100)}...` 
                        : notice.content
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{notice.date}</span>
                  <span>조회수 {notice.viewCount}</span>
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
            <Button variant="outline" size="sm">다음</Button>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="py-12">
              <h2 className="text-2xl font-bold mb-4">상담을 시작해보세요</h2>
              <p className="text-blue-100 mb-6">
                공지사항을 확인하셨다면, 이제 상담을 시작해보세요. 
                전문 상담사와 함께 치유의 여정을 시작하실 수 있습니다.
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