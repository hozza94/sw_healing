"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Award, BookOpen, Heart, MessageSquare, Star } from 'lucide-react';

export const Counselors: React.FC = () => {
  const counselors = [
    {
      name: "김치유",
      title: "대표 상담사",
      image: "/counselor1.jpg",
      specialties: ["우울증", "불안증", "트라우마"],
      experience: "15년",
      education: "서울대학교 심리학과 졸업",
      description: "15년간 다양한 심리상담 경험을 바탕으로 개인에게 맞는 맞춤형 치료를 제공합니다.",
      certifications: ["임상심리전문가", "상담심리사 1급"],
      rating: 4.9,
      reviewCount: 127
    },
    {
      name: "이마음",
      title: "전문 상담사",
      image: "/counselor2.jpg",
      specialties: ["가족치료", "부부상담", "청소년상담"],
      experience: "12년",
      education: "연세대학교 상담심리학과 졸업",
      description: "가족과 부부 관계 개선에 특화되어 있으며, 따뜻한 마음으로 내담자를 대합니다.",
      certifications: ["가족치료전문가", "상담심리사 1급"],
      rating: 4.8,
      reviewCount: 89
    },
    {
      name: "박희망",
      title: "청소년 전문 상담사",
      image: "/counselor3.jpg",
      specialties: ["청소년상담", "학업스트레스", "대인관계"],
      experience: "10년",
      education: "고려대학교 아동심리학과 졸업",
      description: "청소년들의 마음을 이해하고 그들이 건강하게 성장할 수 있도록 돕습니다.",
      certifications: ["청소년상담사", "상담심리사 2급"],
      rating: 4.9,
      reviewCount: 156
    },
    {
      name: "최평화",
      title: "트라우마 전문 상담사",
      image: "/counselor4.jpg",
      specialties: ["트라우마치료", "PTSD", "스트레스관리"],
      experience: "18년",
      education: "경희대학교 임상심리학과 졸업",
      description: "트라우마 치료 전문가로서 안전한 환경에서 치유를 돕습니다.",
      certifications: ["트라우마치료전문가", "임상심리전문가"],
      rating: 4.9,
      reviewCount: 203
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="page-header">
        <h1 className="page-title">상담사 소개</h1>
        <p className="page-subtitle">
          수원힐링상담센터의 전문 상담사들을 소개합니다. 
          각 분야의 전문성을 바탕으로 개인에게 맞는 최적의 상담을 제공합니다.
        </p>
      </div>

      {/* 상담사 목록 */}
      <div className="grid md:grid-cols-2 gap-8">
        {counselors.map((counselor, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {counselor.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {counselor.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {counselor.title}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-600">
                    경력 {counselor.experience} | {counselor.education}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                {counselor.description}
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    전문 분야
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {counselor.specialties.map((specialty, specialtyIndex) => (
                      <Badge key={specialtyIndex} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-2 flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    자격증
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {counselor.certifications.map((cert, certIndex) => (
                      <Badge key={certIndex} variant="secondary" className="text-xs bg-green-100 text-green-800">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {counselor.rating}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({counselor.reviewCount}명)
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    상담 예약
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 상담 예약 안내 */}
      <div className="mt-16">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-900 flex items-center gap-2">
              <Heart className="w-6 h-6" />
              상담 예약 안내
            </CardTitle>
            <CardDescription className="text-green-800">
              전문 상담사와 함께 건강한 마음을 되찾으세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">전문 상담사</h3>
                <p className="text-sm text-gray-600">각 분야의 전문성을 갖춘 상담사들이 상담을 진행합니다</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">1:1 맞춤 상담</h3>
                <p className="text-sm text-gray-600">개인의 상황에 맞는 맞춤형 상담을 제공합니다</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">비밀보장</h3>
                <p className="text-sm text-gray-600">모든 상담 내용은 철저히 비밀보장됩니다</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 