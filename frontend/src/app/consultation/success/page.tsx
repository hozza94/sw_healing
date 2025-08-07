'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { getConsultation, Consultation } from "@/lib/consultations"

export default function ConsultationSuccessPage() {
  const searchParams = useSearchParams();
  const consultationId = searchParams.get('id');
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (consultationId) {
      getConsultation(consultationId).then((data) => {
        setConsultation(data);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [consultationId]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-100 min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-4">⏳</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">정보를 불러오는 중...</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-100 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">✅</div>
                             <CardTitle className="text-3xl text-green-700 tracking-tight">상담 신청이 완료되었습니다!</CardTitle>
               <CardDescription className="text-lg text-gray-600 mt-4 font-medium">
                 신청해주신 내용을 검토한 후 빠른 시일 내에 연락드리겠습니다.
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 상담 신청 번호 */}
              {consultation && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">📋 상담 신청 정보</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">신청 번호:</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        #{consultation.id}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">상담 제목:</span>
                      <span className="text-blue-900">{consultation.title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">상담 유형:</span>
                      <span className="text-blue-900">{consultation.consultation_type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">신청자:</span>
                      <span className="text-blue-900">{consultation.contact_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800 font-medium">상태:</span>
                                                        <Badge 
                                    variant={consultation.status === 'PENDING' ? 'secondary' : 'default'}
                                    className={consultation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  >
                                    {consultation.status === 'PENDING' ? '검토 중' : consultation.status}
                                  </Badge>
                    </div>
                  </div>
                </div>
              )}

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
                 <Button asChild className="flex-1 px-8 py-4 text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                   <Link href="/">홈으로 돌아가기</Link>
                 </Button>
                 <Button asChild variant="outline" className="flex-1 px-8 py-4 text-lg font-bold bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
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
