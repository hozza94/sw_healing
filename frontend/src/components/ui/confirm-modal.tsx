'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  type = 'danger',
  onConfirm,
  onCancel
}: ConfirmModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => onConfirm(), 150);
  };

  const handleCancel = () => {
    setIsVisible(false);
    setTimeout(() => onCancel(), 150);
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-8 h-8 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'info':
        return <AlertTriangle className="w-8 h-8 text-blue-500" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 배경 오버레이 */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
          }`}
          onClick={handleCancel}
        />
        
        {/* 모달 */}
        <div
          className={`
            relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto
            transform transition-all duration-300 ease-in-out
            ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          `}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* 내용 */}
          <div className="p-6">
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* 푸터 */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-4 py-2"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              className={`px-4 py-2 ${getConfirmButtonStyle()}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 전역 확인 모달 관리
interface GlobalConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
}

let globalConfirmState: GlobalConfirmState = {
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  type: 'danger',
  onConfirm: () => {},
  onCancel: () => {}
};

let setGlobalConfirmState: React.Dispatch<React.SetStateAction<GlobalConfirmState>> | null = null;

export const GlobalConfirmModal = () => {
  const [state, setState] = useState<GlobalConfirmState>(globalConfirmState);
  setGlobalConfirmState = setState;

  const handleConfirm = () => {
    if (state.onConfirm) {
      state.onConfirm();
    }
    setState(prev => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    if (state.onCancel) {
      state.onCancel();
    }
    setState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmModal
      isOpen={state.isOpen}
      title={state.title}
      message={state.message}
      confirmText={state.confirmText}
      cancelText={state.cancelText}
      type={state.type}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
};

// 편의 함수
export const confirm = (
  title: string,
  message: string,
  options?: {
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!setGlobalConfirmState) {
      resolve(false);
      return;
    }

    setGlobalConfirmState({
      isOpen: true,
      title,
      message,
      confirmText: options?.confirmText || '확인',
      cancelText: options?.cancelText || '취소',
      type: options?.type || 'danger',
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false)
    });
  });
};
