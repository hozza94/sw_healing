import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function NoticesPage() {
  const notices = [
    {
      id: 1,
      title: "2024년 상담 예약 안내",
      content: "2024년 상담 예약이 시작되었습니다. 전화 또는 온라인으로 예약하실 수 있으며, 상담 시간은 평일 오전 9시부터 오후 6시까지, 토요일은 오전 9시부터 오후 2시까지입니다.",
      type: "공지",
      isPinned: true,
      viewCount: 156,
      date: "2024-01-15",
      author: "관리자"
    },
    {
      id: 2,
      title: "새로운 상담사 합류 안내",
      content: "청소년 상담 전문가 이영희 상담사가 우리 센터에 합류하셨습니다. 청소년의 성장 과정에서 겪는 어려움과 가족 관계 개선에 특화되어 있으며, 많은 관심 부탁드립니다.",
      type: "안내",
      isPinned: true,
      viewCount: 89,
      date: "2024-01-10",
      author: "관리자"
    },
    {
      id: 3,
      title: "온라인 상담 서비스 시작",
      content: "코로나19 상황을 고려하여 온라인 상담 서비스를 시작합니다. 화상회의를 통해 안전하고 편리하게 상담받으실 수 있으며, 예약은 기존과 동일하게 전화 또는 온라인으로 가능합니다.",
      type: "서비스",
      isPinned: false,
      viewCount: 234,
      date: "2024-01-08",
      author: "관리자"
    },
    {
      id: 4,
      title: "연말연시 휴무 안내",
      content: "2023년 12월 30일부터 2024년 1월 2일까지 연말연시 휴무입니다. 긴급한 상담이 필요한 경우에는 전화로 문의해주시기 바랍니다. 새해 복 많이 받으세요.",
      type: "휴무",
      isPinned: false,
      viewCount: 67,
      date: "2023-12-28",
      author: "관리자"
    },
    {
      id: 5,
      title: "상담 후기 이벤트 안내",
      content: "상담 후기를 작성해주시는 분들께 소정의 선물을 드립니다. 후기는 익명으로 작성 가능하며, 다른 분들에게 도움이 되는 소중한 정보가 됩니다. 많은 참여 부탁드립니다.",
      type: "이벤트",
      isPinned: false,
      viewCount: 123,
      date: "2023-12-25",
      author: "관리자"
    },
    {
      id: 6,
      title: "상담사 교육 프로그램 안내",
      content: "상담사들의 전문성 향상을 위한 정기 교육 프로그램이 진행됩니다. 최신 상담 기법과 이론을 습득하여 더 나은 서비스를 제공하기 위해 노력하고 있습니다.",
      type: "교육",
      isPinned: false,
      viewCount: 45,
      date: "2023-12-20",
      author: "관리자"
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "공지":
        return "bg-red-100 text-red-700"
      case "안내":
        return "bg-blue-100 text-blue-700"
      case "서비스":
        return "bg-green-100 text-green-700"
      case "휴무":
        return "bg-orange-100 text-orange-700"
      case "이벤트":
        return "bg-purple-100 text-purple-700"
      case "교육":
        return "bg-indigo-100 text-indigo-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">공지사항</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            센터의 주요 소식과 안내사항을 확인하세요.
            상담 예약, 서비스 변경, 이벤트 등 다양한 정보를 제공합니다.
          </p>
        </div>

        <div className="space-y-6">
          {notices.map((notice) => (
            <Card key={notice.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {notice.isPinned && (
                        <Badge variant="destructive" className="text-xs">
                          📌 고정
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getTypeColor(notice.type)}`}>
                        {notice.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-gray-900 mb-2">
                      <Link href={`/notices/${notice.id}`} className="hover:text-blue-600 transition-colors">
                        {notice.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {notice.date} | {notice.author} | 조회수 {notice.viewCount}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {notice.content}
                </p>
                <div className="mt-4">
                  <Link href={`/notices/${notice.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    자세히 보기 →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              이전
            </button>
            <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md">
              1
            </button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              다음
            </button>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="text-center mt-16">
          <Card className="bg-blue-600 text-white border-0 shadow-xl max-w-2xl mx-auto">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">상담을 시작해보세요</h2>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                공지사항을 확인하셨다면, 이제 전문 상담사와 함께 
                치유의 여정을 시작해보세요.
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