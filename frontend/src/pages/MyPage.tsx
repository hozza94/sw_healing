"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogIn, 
  AlertCircle,
  Clock,
  CheckCircle,
  Heart
} from 'lucide-react';

export const MyPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로그인하지 않은 상태의 UI
  if (!isLoggedIn) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="page-header">
          <h1 className="page-title">마이페이지</h1>
          <p className="page-subtitle">
            로그인하여 나의 상담 이력과 정보를 확인하세요
          </p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              마이페이지를 이용하려면 로그인이 필요합니다. 
              로그인 후 상담 이력, 예약 현황, 개인 정보 등을 확인할 수 있습니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setIsLoggedIn(true)} // 임시 로그인 버튼
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                로그인
              </Button>
              <Button variant="outline">
                회원가입
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 마이페이지 기능 안내 */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-900">마이페이지 기능</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">상담 예약 관리</h4>
                      <p className="text-sm text-gray-600">예약 현황 확인 및 변경</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">상담 이력</h4>
                      <p className="text-sm text-gray-600">과거 상담 기록 확인</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">상담 진행 상황</h4>
                      <p className="text-sm text-gray-600">현재 진행 중인 상담 확인</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">개인 정보 관리</h4>
                      <p className="text-sm text-gray-600">연락처 및 개인정보 수정</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 로그인한 상태의 UI
  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="page-header">
        <h1 className="page-title">마이페이지</h1>
        <p className="page-subtitle">
          안녕하세요, 김상담님! 상담 이력과 정보를 확인하세요
        </p>
      </div>

      {/* 사용자 정보 요약 */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              김
            </div>
            <div>
              <CardTitle className="text-xl">김상담님</CardTitle>
              <CardDescription>회원가입일: 2024년 1월 15일</CardDescription>
            </div>
            <div className="ml-auto">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                정보 수정
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 탭 메뉴 */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="appointments">예약 현황</TabsTrigger>
          <TabsTrigger value="history">상담 이력</TabsTrigger>
          <TabsTrigger value="settings">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  총 상담 횟수
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">12회</div>
                <p className="text-sm text-gray-600 mt-1">이번 달 3회</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  다음 상담
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">3일 후</div>
                <p className="text-sm text-gray-600 mt-1">2024년 1월 20일 오후 2시</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  상담 만족도
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">4.8/5.0</div>
                <p className="text-sm text-gray-600 mt-1">매우 만족</p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              다음 상담까지 3일 남았습니다. 상담 전 준비사항을 확인해주세요.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>예약 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">정기 상담</h4>
                      <p className="text-sm text-gray-600">2024년 1월 20일 오후 2시</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      확정
                    </Badge>
                    <Button variant="outline" size="sm">변경</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <h4 className="font-semibold">추가 상담</h4>
                      <p className="text-sm text-gray-600">2024년 1월 25일 오후 3시</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      대기
                    </Badge>
                    <Button variant="outline" size="sm">취소</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>상담 이력</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">정기 상담 #{item}</h4>
                      <p className="text-sm text-gray-600">2024년 1월 {10 + item}일</p>
                      <p className="text-sm text-gray-500">김치유 상담사</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        완료
                      </Badge>
                      <Button variant="outline" size="sm">상세보기</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>개인 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                    <input 
                      type="text" 
                      value="김상담" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                    <input 
                      type="tel" 
                      value="010-1234-5678" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input 
                    type="email" 
                    value="example@email.com" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div className="flex gap-2">
                  <Button>정보 수정</Button>
                  <Button variant="outline">비밀번호 변경</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 