"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* 친근한 헤더 섹션 */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                마음을 나누는 시간
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              상담 신청하기 💙
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              혼자 끌어안고 있던 고민들을 이제는 함께 나누어보세요.
              <br />
              전문 상담사가 따뜻한 마음으로 여러분을 기다리고 있습니다.
            </p>
          </div>

          {/* 친근한 안내 메시지 */}
          <Card className="mb-8 border-0 bg-blue-50/50 shadow-lg">
            <CardContent className="py-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  안전하고 따뜻한 상담을 약속드립니다
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  모든 상담은 비밀을 보장하며, 편안한 마음으로 이야기해주세요.
                  <br />
                  전문 상담사가 여러분의 이야기를 깊이 들어드리고 함께 해결책을 찾아가겠습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 상담 신청 폼 */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="text-center">
              <div className="text-3xl mb-4">📝</div>
              <CardTitle className="text-2xl text-gray-900">상담 신청서</CardTitle>
              <CardDescription className="text-lg">
                간단한 정보를 알려주시면 빠르게 연락드리겠습니다
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 상담 분야 */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    어떤 상담을 원하시나요? 💭
                  </label>
                  <select
                    name="consultationType"
                    value={formData.consultationType}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    required
                  >
                    <option value="">상담 분야를 선택해주세요</option>
                    <option value="individual">개인 상담 👤</option>
                    <option value="couple">부부 상담 💑</option>
                    <option value="family">가족 상담 👨‍👩‍👧‍👦</option>
                    <option value="youth">청소년 상담 🎓</option>
                    <option value="other">기타 💬</option>
                  </select>
                </div>

                {/* 상담 제목 */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    상담하고 싶은 내용의 제목을 알려주세요 📝
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="예: 스트레스 관리, 부부 관계 개선, 자녀와의 소통 등"
                    className="p-4 text-lg"
                    required
                  />
                </div>

                {/* 상담 내용 */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    조금 더 자세히 이야기해주세요 💭
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    placeholder="현재 겪고 계신 어려움이나 상담하고 싶은 내용을 자유롭게 적어주세요. 편안한 마음으로 작성해주시면 됩니다."
                    required
                  />
                </div>

                {/* 연락처 정보 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                      이름을 알려주세요 👋
                    </label>
                    <Input
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder="홍길동"
                      className="p-4 text-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                      연락처를 알려주세요 📞
                    </label>
                    <Input
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="010-1234-5678"
                      className="p-4 text-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    이메일도 알려주세요 📧
                  </label>
                  <Input
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="p-4 text-lg"
                    required
                  />
                </div>

                {/* 희망 일정 */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                      언제 상담받고 싶으신가요? 📅
                    </label>
                    <Input
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="p-4 text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-900 mb-3">
                      어떤 시간대가 편하신가요? ⏰
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                    >
                      <option value="">시간을 선택해주세요</option>
                      <option value="morning">오전 (09:00-12:00) 🌅</option>
                      <option value="afternoon">오후 (13:00-17:00) ☀️</option>
                      <option value="evening">저녁 (18:00-21:00) 🌆</option>
                    </select>
                  </div>
                </div>

                {/* 긴급도 */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-3">
                    상담의 긴급도를 알려주세요 ⚡
                  </label>
                  <select
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  >
                    <option value="normal">일반적인 상담 💙</option>
                    <option value="urgent">긴급한 상담이 필요합니다 🚨</option>
                  </select>
                </div>

                {/* 개인정보 동의 */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="isConfidential"
                      checked={formData.isConfidential}
                      onChange={handleChange}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-gray-700 leading-relaxed">
                      <span className="font-medium">개인정보 수집 및 이용에 동의합니다.</span>
                      <br />
                      <span className="text-sm text-gray-600">
                        입력하신 정보는 상담 목적으로만 사용되며, 철저히 보호됩니다.
                      </span>
                    </label>
                  </div>
                </div>

                {/* 제출 버튼 */}
                <div className="text-center pt-6">
                  <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-12 py-6 text-xl">
                    상담 신청하기 💙
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 따뜻한 안내사항 */}
          <Card className="mt-8 border-0 bg-green-50/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="text-3xl mb-4">💚</div>
              <CardTitle className="text-xl text-gray-900">상담 신청 후 안내사항</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">빠른 연락</h4>
                      <p className="text-gray-600">상담 신청 후 24시간 이내에 연락드립니다</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🔒</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">비밀 보장</h4>
                      <p className="text-gray-600">모든 상담 내용은 철저히 비밀로 보장됩니다</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">💻</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">온라인/대면</h4>
                      <p className="text-gray-600">온라인 또는 대면 상담 모두 가능합니다</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🚨</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">긴급 상담</h4>
                      <p className="text-gray-600">긴급한 상황은 전화로 직접 연락해주세요</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 