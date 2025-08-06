"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    consultationType: "",
    title: "",
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    preferredDate: "",
    preferredTime: "",
    urgencyLevel: "normal",
    isConfidential: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API 호출 로직 구현
    console.log("상담 신청:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">상담 신청</h1>
            <p className="text-xl text-gray-600">
              전문 상담사와 함께 당신의 고민을 나누어보세요
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>상담 신청서</CardTitle>
              <CardDescription>
                아래 양식을 작성해주시면 빠른 시일 내에 연락드리겠습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 상담 분야 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상담 분야 *
                  </label>
                  <select
                    name="consultationType"
                    value={formData.consultationType}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">상담 분야를 선택해주세요</option>
                    <option value="individual">개인 상담</option>
                    <option value="couple">부부 상담</option>
                    <option value="family">가족 상담</option>
                    <option value="youth">청소년 상담</option>
                    <option value="other">기타</option>
                  </select>
                </div>

                {/* 상담 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상담 제목 *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="상담하고 싶은 내용의 제목을 입력해주세요"
                    required
                  />
                </div>

                {/* 상담 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    상담 내용 *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="상담하고 싶은 내용을 자세히 적어주세요"
                    required
                  />
                </div>

                {/* 연락처 정보 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 이름 *
                    </label>
                    <Input
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="이름을 입력해주세요"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 전화번호 *
                    </label>
                    <Input
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="010-1234-5678"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일 *
                  </label>
                  <Input
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                {/* 희망 일정 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      희망 날짜
                    </label>
                    <Input
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      희망 시간
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">시간을 선택해주세요</option>
                      <option value="morning">오전 (09:00-12:00)</option>
                      <option value="afternoon">오후 (13:00-17:00)</option>
                      <option value="evening">저녁 (18:00-21:00)</option>
                    </select>
                  </div>
                </div>

                {/* 긴급도 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    긴급도
                  </label>
                  <select
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="normal">일반</option>
                    <option value="urgent">긴급</option>
                  </select>
                </div>

                {/* 개인정보 동의 */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isConfidential"
                    checked={formData.isConfidential}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">
                    개인정보 수집 및 이용에 동의합니다. (필수)
                  </label>
                </div>

                {/* 제출 버튼 */}
                <div className="flex justify-center">
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    상담 신청하기
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 안내사항 */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>상담 신청 안내</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>• 상담 신청 후 24시간 이내에 연락드립니다.</li>
                <li>• 개인정보는 상담 목적으로만 사용되며 철저히 보호됩니다.</li>
                <li>• 긴급한 상황이라면 전화로 직접 연락해주세요.</li>
                <li>• 상담은 온라인 또는 대면으로 진행 가능합니다.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 