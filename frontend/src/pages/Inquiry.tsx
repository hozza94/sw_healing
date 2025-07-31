import React, { useState } from 'react';

interface Consultation {
  id: string;
  name: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  requestDate: string;
  preferredDate: string;
  counselor?: string;
  progress: number;
  currentStep?: number;
}

export const Inquiry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // 샘플 데이터
  const sampleConsultations: Consultation[] = [
    {
      id: "CONS-2024-001",
      name: "김**",
      status: "confirmed",
      requestDate: "2024-01-15",
      preferredDate: "2024-01-20",
      counselor: "박상담사",
      progress: 75,
      currentStep: 9
    },
    {
      id: "CONS-2024-002",
      name: "이**",
      status: "pending",
      requestDate: "2024-01-16",
      preferredDate: "2024-01-25",
      progress: 0
    },
    {
      id: "CONS-2024-003",
      name: "박**",
      status: "completed",
      requestDate: "2024-01-10",
      preferredDate: "2024-01-12",
      counselor: "김상담사",
      progress: 100,
      currentStep: 12
    },
    {
      id: "CONS-2024-004",
      name: "최**",
      status: "confirmed",
      requestDate: "2024-01-14",
      preferredDate: "2024-01-18",
      counselor: "이상담사",
      progress: 50,
      currentStep: 6
    }
  ];

  const statusOptions = [
    { value: 'all', label: '전체' },
    { value: 'pending', label: '대기중' },
    { value: 'confirmed', label: '확정' },
    { value: 'completed', label: '완료' },
    { value: 'cancelled', label: '취소' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'confirmed': return '확정';
      case 'completed': return '완료';
      case 'cancelled': return '취소';
      default: return '알 수 없음';
    }
  };

  const filteredConsultations = sampleConsultations.filter(consultation => {
    const matchesSearch = consultation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || consultation.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">상담 조회</h1>
        <p className="text-gray-600">
          상담 신청 내역과 진행 상황을 확인하실 수 있습니다
        </p>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              검색
            </label>
            <input
              type="text"
              placeholder="상담번호 또는 이름으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상태
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 상담 목록 */}
      <div className="space-y-4">
        {filteredConsultations.map((consultation) => (
          <div key={consultation.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-semibold">{consultation.id}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(consultation.status)}`}>
                    {getStatusLabel(consultation.status)}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">신청자:</span> {consultation.name}
                  </div>
                  <div>
                    <span className="font-medium">신청일:</span> {consultation.requestDate}
                  </div>
                  <div>
                    <span className="font-medium">희망일:</span> {consultation.preferredDate}
                  </div>
                  {consultation.counselor && (
                    <div>
                      <span className="font-medium">담당상담사:</span> {consultation.counselor}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {consultation.progress}%
                </div>
                <div className="text-sm text-gray-600">
                  {consultation.currentStep ? `${consultation.currentStep}/12단계` : '대기중'}
                </div>
              </div>
            </div>
            
            {/* 진행률 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${consultation.progress}%` }}
              ></div>
            </div>
            
            {/* 액션 버튼 */}
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                상세보기
              </button>
              {consultation.status === 'confirmed' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
                  상담 시작
                </button>
              )}
              {consultation.status === 'pending' && (
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
                  취소
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 상담 신청 안내 */}
      {filteredConsultations.length === 0 && (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            상담 신청 내역이 없습니다
          </h3>
          <p className="text-gray-600 mb-4">
            아직 상담을 신청하지 않으셨거나, 검색 조건에 맞는 내역이 없습니다.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            상담 신청하기
          </button>
        </div>
      )}

      {/* 통계 */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{sampleConsultations.length}</div>
          <div className="text-sm text-gray-600">총 신청 건수</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">
            {sampleConsultations.filter(c => c.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">완료된 상담</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">
            {sampleConsultations.filter(c => c.status === 'confirmed').length}
          </div>
          <div className="text-sm text-gray-600">진행중인 상담</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {sampleConsultations.filter(c => c.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">대기중인 상담</div>
        </div>
      </div>
    </div>
  );
}; 