'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ConsultationSuccessPage() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-100 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <CardTitle className="text-3xl text-green-700">상담 신청이 완료되었습니다!</CardTitle>
              <CardDescription className="text-lg text-gray-600 mt-4">
                신청해주신 내용을 검토한 후 빠른 시일 내에 연락드리겠습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 안내 사항 */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">📋 다음 단계</h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">1.</span>
                    <span>신청 내용 검토 (1-2일 소요)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">2.</span>
                    <span>적합한 상담사 매칭</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">3.</span>
                    <span>상담 일정 조율 및 확정</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">4.</span>
                    <span>상담 진행</span>
                  </li>
                </ul>
              </div>

              {/* 연락처 정보 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">📞 문의사항</h3>
                <div className="space-y-2 text-gray-700">
                  <p>궁금한 점이 있으시면 언제든 연락주세요.</p>
                  <p className="font-medium">전화: 02-1234-5678</p>
                  <p className="font-medium">이메일: info@suwon-healing.com</p>
                </div>
              </div>

              {/* 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Link href="/">홈으로 돌아가기</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/counselors">상담사 소개 보기</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
