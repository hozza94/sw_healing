'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ui/image-upload';
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
    email: counselor?.email || '',
    phone: counselor?.phone || '',
    specialization: counselor?.specialization || '',
    education: counselor?.education || '',
    experience: counselor?.experience || '',
    certification: counselor?.certification || '',
    bio: counselor?.bio || '',
    profile_image: counselor?.profile_image || ''
  });

  const handleInputChange = (field: keyof CreateCounselorRequest, value: string) => {
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
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        education: '',
        certification: '',
        bio: '',
        profile_image: ''
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
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] bg-white shadow-2xl border-2 border-gray-200 flex flex-col">
        <DialogHeader className="bg-gray-50 p-6 -m-6 mb-6 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {counselor ? '상담사 정보 수정' : '새 상담사 추가'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            {counselor ? '상담사 정보를 수정합니다.' : '새로운 상담사를 추가합니다.'}
          </DialogDescription>
        </DialogHeader>
        
        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 px-2 flex-1 overflow-y-auto pr-4"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#d1d5db #f3f4f6'
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-700 font-medium">이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="홍길동"
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">이메일 *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="counselor@example.com"
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-gray-700 font-medium">전화번호</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="010-1234-5678"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="specialization" className="text-gray-700 font-medium">전문 분야 *</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                placeholder="개인상담, 부부상담 등"
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience" className="text-gray-700 font-medium">경력 *</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="5년"
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="education" className="text-gray-700 font-medium">학력 *</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                placeholder="서울대학교 심리학과"
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="certification" className="text-gray-700 font-medium">자격증</Label>
            <Input
              id="certification"
              value={formData.certification}
              onChange={(e) => handleInputChange('certification', e.target.value)}
              placeholder="상담심리사 1급"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="image_url" className="text-gray-700 font-medium">프로필 이미지</Label>
            <ImageUpload
              onImageUpload={(url) => handleInputChange('profile_image', url)}
              currentImageUrl={formData.profile_image}
              className="mt-2"
            />
          </div>

          <div>
                         <Label htmlFor="description" className="text-gray-700 font-medium">소개 *</Label>
             <Textarea
               id="description"
               value={formData.bio}
               onChange={(e) => handleInputChange('bio', e.target.value)}
               placeholder="상담사에 대한 상세한 소개를 작성해주세요..."
               rows={4}
               required
               className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
             />
          </div>

        </form>
        
        <DialogFooter className="bg-gray-50 p-6 -m-6 mt-6 border-t border-gray-200 flex-shrink-0">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-gray-300 text-gray-700 hover:bg-gray-100">
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
            {isSubmitting ? '저장 중...' : (counselor ? '수정' : '추가')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
