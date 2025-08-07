"use client"

import ConsultationForm from "@/components/forms/ConsultationForm"

export default function ConsultationPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">상담 신청</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            전문 상담사와 함께 마음 치유를 시작해보세요. 
            신청해주신 내용을 바탕으로 가장 적합한 상담사를 매칭해드립니다.
          </p>
        </div>
        
        <ConsultationForm />
      </div>
    </div>
  )
} 