"use client";

import React, { useState, useEffect } from 'react';
import { getBoards, type Board as BoardType } from '../services/boardService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, MessageSquare, Heart, User, AlertCircle, Loader2, Plus } from 'lucide-react';

export const Board: React.FC = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getBoards();
        setBoards(data);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
        console.error('게시글 로딩 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const categories = [
    { value: 'all', label: '전체' },
    { value: '상담후기', label: '상담후기' },
    { value: '질문', label: '질문' },
    { value: '정보공유', label: '정보공유' },
    { value: '일반', label: '일반' }
  ];

  const filteredBoards = selectedCategory === 'all' 
    ? boards 
    : boards.filter(board => board.category === selectedCategory);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* 헤더 */}
      <div className="page-header">
        <h1 className="page-title">게시판</h1>
        <p className="page-subtitle">
          상담 후기와 다양한 정보를 공유하는 공간입니다
        </p>
      </div>

      {/* 필터 및 글쓰기 버튼 */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">카테고리:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <a href="/board/write">
            <Plus className="w-4 h-4 mr-2" />
            글쓰기
          </a>
        </Button>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-6">
        {filteredBoards.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {selectedCategory === 'all' ? '등록된 게시글이 없습니다' : '해당 카테고리의 게시글이 없습니다'}
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedCategory === 'all' 
                  ? '첫 번째 게시글을 작성해보세요!' 
                  : '다른 카테고리를 선택하거나 새로운 글을 작성해보세요.'
                }
              </p>
              {selectedCategory !== 'all' && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory('all')}
                  className="mr-2"
                >
                  전체 보기
                </Button>
              )}
              <Button asChild>
                <a href="/board/write">
                  <Plus className="w-4 h-4 mr-2" />
                  글쓰기
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredBoards.map((board) => (
            <Card key={board.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {board.category}
                      </Badge>
                      {board.is_pinned && (
                        <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                          공지
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                      {board.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {board.author_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(board.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(board.created_at).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {board.content.length > 200 
                    ? `${board.content.substring(0, 200)}...` 
                    : board.content
                  }
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      댓글 {board.comment_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      좋아요 {board.like_count || 0}
                    </span>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a href={`/board/${board.id}`}>
                      자세히 보기
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 페이지 하단 안내 */}
      <div className="mt-12">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="py-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">게시판 이용 안내</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
              <div>
                <h4 className="font-medium mb-2">게시판 규칙</h4>
                <ul className="space-y-1">
                  <li>• 서로를 존중하는 마음으로 글을 작성해주세요</li>
                  <li>• 개인정보나 민감한 정보는 공개하지 마세요</li>
                  <li>• 상담 관련 전문적인 조언은 상담사와 상담하세요</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">카테고리 안내</h4>
                <ul className="space-y-1">
                  <li>• <strong>상담후기:</strong> 상담 경험과 후기 공유</li>
                  <li>• <strong>질문:</strong> 궁금한 점이나 도움이 필요한 내용</li>
                  <li>• <strong>정보공유:</strong> 유용한 정보나 경험 공유</li>
                  <li>• <strong>일반:</strong> 기타 자유로운 소통</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 