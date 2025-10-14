'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getApprovedCounselors, Counselor } from "@/lib/counselors"
import { useEffect, useState } from "react"

export default function CounselorsPage() {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCounselors() {
      try {
        const data = await getApprovedCounselors();
        setCounselors(data);
      } catch (err) {
        console.error('상담사 데이터 로딩 실패:', err);
        setError('상담사 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadCounselors();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">상담사 정보를 불러오는 중...</h3>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">{error}</h3>
            <p className="text-gray-600 mb-8">잠시 후 다시 시도해주세요.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">전문 상담사 소개</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            각 분야별 전문성을 갖춘 상담사들이 여러분의 마음 치유를 도와드립니다.
            모든 상담사는 지속적인 교육과 훈련을 통해 최고의 서비스를 제공합니다.
          </p>
        </div>

        {counselors.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">상담사 정보를 불러올 수 없습니다</h3>
            <p className="text-gray-600 mb-8">잠시 후 다시 시도해주세요.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">홈으로 돌아가기</Link>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {counselors.map((counselor) => (
              <Card key={counselor.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">
                        {counselor.profile_image ? (
                          <img 
                            src={counselor.profile_image} 
                            alt={counselor.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          "👨‍⚕️"
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-gray-900">{counselor.name}</CardTitle>
                        <CardDescription className="text-blue-600 font-medium">
                          {counselor.specialization} 전문
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                        온라인
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">4.8</span>
                        <span className="text-gray-500">(15)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">전문 분야</h4>
                      <p className="text-gray-600">{counselor.specialization}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">경력</h4>
                      <p className="text-gray-600">{counselor.experience_years}년</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">학력</h4>
                      <p className="text-gray-600">{counselor.education}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">소개</h4>
                      <p className="text-gray-600 leading-relaxed">{counselor.description}</p>
                    </div>
                                                    <div className="pt-4">
                                  <Button asChild className="w-full px-6 py-3 text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl">
                                    <Link href={`/consultation?counselor=${counselor.id}`}>상담 예약하기</Link>
                                  </Button>
                                </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA 섹션 */}
        <div className="text-center mt-16">
          <Card className="bg-blue-600 text-white border-0 shadow-xl max-w-2xl mx-auto">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">상담을 시작해보세요</h2>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                전문 상담사와 함께 당신의 마음을 들여다보고, 
                더 나은 내일을 위한 힘을 찾아보세요.
              </p>
                                      <Button variant="secondary" size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                          <Link href="/consultation">상담 신청하기</Link>
                        </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 