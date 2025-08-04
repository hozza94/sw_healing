"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Users, Lightbulb, Shield, Target } from 'lucide-react';

export const HealingMethods: React.FC = () => {
  const methods = [
    {
      title: "인지행동치료 (CBT)",
      description: "부정적인 사고 패턴을 인식하고 긍정적인 사고로 변화시키는 치료법입니다.",
      icon: Brain,
      benefits: ["우울증 완화", "불안증 치료", "스트레스 관리"],
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "마음챙김 명상",
      description: "현재 순간에 집중하여 마음의 평화를 찾는 명상 기법입니다.",
      icon: Heart,
      benefits: ["스트레스 감소", "집중력 향상", "감정 조절"],
      color: "bg-green-50 border-green-200"
    },
    {
      title: "가족치료",
      description: "가족 구성원 간의 관계를 개선하여 전체 가족의 건강을 증진시키는 치료법입니다.",
      icon: Users,
      benefits: ["가족 관계 개선", "의사소통 향상", "갈등 해결"],
      color: "bg-purple-50 border-purple-200"
    },
    {
      title: "해결중심치료",
      description: "문제보다는 해결책에 집중하여 빠른 변화를 이끌어내는 치료법입니다.",
      icon: Lightbulb,
      benefits: ["빠른 변화", "실용적 접근", "목표 지향적"],
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      title: "트라우마 치료",
      description: "과거의 상처를 안전하게 다루어 치유하는 전문 치료법입니다.",
      icon: Shield,
      benefits: ["트라우마 치유", "안전한 환경", "전문적 접근"],
      color: "bg-red-50 border-red-200"
    },
    {
      title: "목표 설정 및 동기부여",
      description: "개인의 목표를 명확히 하고 동기를 유지하는 방법을 찾는 치료법입니다.",
      icon: Target,
      benefits: ["목표 달성", "동기 유지", "자신감 향상"],
      color: "bg-indigo-50 border-indigo-200"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="page-header">
        <h1 className="page-title">치유 기법 소개</h1>
        <p className="page-subtitle">
          수원힐링상담센터에서 제공하는 다양한 치유 기법들을 소개합니다. 
          각 기법은 개인의 상황과 필요에 맞게 맞춤형으로 적용됩니다.
        </p>
      </div>

      {/* 치유 기법 목록 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((method, index) => (
          <Card key={index} className={`${method.color} hover:shadow-lg transition-shadow duration-200`}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <method.icon className="w-6 h-6 text-gray-700" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  {method.title}
                </CardTitle>
              </div>
              <CardDescription className="text-gray-700 leading-relaxed">
                {method.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 text-sm">주요 효과:</h4>
                <div className="flex flex-wrap gap-1">
                  {method.benefits.map((benefit, benefitIndex) => (
                    <Badge key={benefitIndex} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 치료 과정 안내 */}
      <div className="mt-16">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900">치료 과정</CardTitle>
            <CardDescription className="text-blue-800">
              개인에게 최적화된 치료 과정을 통해 건강한 마음을 되찾으세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">상담 신청</h3>
                <p className="text-sm text-gray-600">전화 또는 온라인으로 상담을 신청합니다</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">초기 상담</h3>
                <p className="text-sm text-gray-600">상담사와의 첫 만남으로 상황을 파악합니다</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">치료 계획</h3>
                <p className="text-sm text-gray-600">개인에게 맞는 치료 기법을 선택합니다</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">치료 진행</h3>
                <p className="text-sm text-gray-600">정기적인 상담을 통해 치유를 진행합니다</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 