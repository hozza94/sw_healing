'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createCounselor, updateCounselor, Counselor, CreateCounselorRequest, UpdateCounselorRequest } from '@/lib/counselors';

interface CounselorFormProps {
  counselor?: Counselor;
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export default function CounselorForm({ counselor, onSuccess, trigger }: CounselorFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateCounselorRequest>({
    name: counselor?.name || '',
    specialization: counselor?.specialization || '',
    experience_years: counselor?.experience_years || 0,
    education: counselor?.education || '',
    description: counselor?.description || '',
    image_url: counselor?.image_url || ''
  });

  const handleInputChange = (field: keyof CreateCounselorRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (counselor) {
        // 수정
        const updateData: UpdateCounselorRequest = {
          id: counselor.id,
          ...formData
        };
        await updateCounselor(updateData);
      } else {
        // 새로 추가
        await createCounselor(formData);
      }
      
      setOpen(false);
      onSuccess();
      // 폼 초기화
      setFormData({
        name: '',
        specialization: '',
        experience_years: 0,
        education: '',
        description: '',
        image_url: ''
      });
    } catch (error) {
      console.error('상담사 저장 실패:', error);
      alert('상담사 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
            새 상담사 추가
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {counselor ? '상담사 정보 수정' : '새 상담사 추가'}
          </DialogTitle>
          <DialogDescription>
            {counselor ? '상담사 정보를 수정합니다.' : '새로운 상담사를 추가합니다.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="홍길동"
                required
              />
            </div>
            <div>
              <Label htmlFor="specialization">전문 분야 *</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                placeholder="개인상담, 부부상담 등"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience_years">경력 (년) *</Label>
              <Input
                id="experience_years"
                type="number"
                min="0"
                value={formData.experience_years}
                onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                placeholder="5"
                required
              />
            </div>
            <div>
              <Label htmlFor="education">학력 *</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                placeholder="서울대학교 심리학과"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">프로필 이미지 URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <Label htmlFor="description">소개 *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="상담사에 대한 상세한 소개를 작성해주세요..."
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : (counselor ? '수정' : '추가')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
