import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, Clock, MessageSquare, Heart, Search, Plus } from 'lucide-react';
import { getBoards, type Board as BoardType } from '@/services/boardService';

export const Board: React.FC = () => {
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [filteredBoards, setFilteredBoards] = useState<BoardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getBoards();
        setBoards(data);
        setFilteredBoards(data);
      } catch (error) {
        console.error('게시글 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  useEffect(() => {
    let filtered = boards;

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(board => board.category === selectedCategory);
    }

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(board =>
        board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        board.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        board.author_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBoards(filtered);
  }, [boards, searchTerm, selectedCategory]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">게시글을 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티</h1>
        <p className="text-gray-600">다른 분들과 경험을 공유하고 소통해보세요</p>
      </div>

      {/* 검색 및 필터 */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="제목, 내용, 작성자로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button asChild className="w-full sm:w-auto">
          <a href="/board/write">
            <Plus className="w-4 h-4 mr-2" />
            글쓰기
          </a>
        </Button>
      </div>

      {/* 게시글 목록 */}
      <div className="space-y-4">
        {filteredBoards.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' 
                  ? '검색 결과가 없습니다.' 
                  : '아직 게시글이 없습니다.'}
              </div>
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

export default Board; 