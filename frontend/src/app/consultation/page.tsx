"use client"

import ConsultationForm from "@/components/forms/ConsultationForm"

export default function ConsultationPage() {
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
          <div className="mb-8">
            <div className="bg-blue-50/50 p-8 rounded-lg shadow-lg">
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
            </div>
          </div>

          {/* 상담 신청 폼 */}
          <ConsultationForm />

          {/* 따뜻한 안내사항 */}
          <div className="mt-8">
            <div className="bg-green-50/50 p-8 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <div className="text-3xl mb-4">💚</div>
                <h3 className="text-xl font-semibold text-gray-900">상담 신청 후 안내사항</h3>
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 