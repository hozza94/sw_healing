"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export const About: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isContainerReady, setIsContainerReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 컨테이너가 준비되었는지 확인
    const checkContainer = () => {
      if (mapContainerRef.current) {
        console.log('지도 컨테이너 찾음');
        setIsContainerReady(true);
      } else {
        console.log('지도 컨테이너를 찾을 수 없습니다, 재시도 중...');
        setTimeout(checkContainer, 100);
      }
    };

    // 컨테이너 확인 시작
    checkContainer();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadKakaoMapScript = () => {
      // 스크립트가 이미 로드되었는지 확인
      if (window.kakao && window.kakao.maps) {
        console.log('Kakao Maps API가 이미 로드되어 있습니다.');
        initMap();
        return;
      }

      // 기존 스크립트 제거 (중복 방지)
      const existingScripts = document.querySelectorAll('script[src*="dapi.kakao.com"]');
      existingScripts.forEach(script => script.remove());

      // 카카오맵 스크립트를 동적으로 로드
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAPS_APP_KEY}&libraries=services&autoload=false`;
      
      script.onload = () => {
        console.log('Kakao Maps 스크립트 로드 완료');
        if (isMounted) {
          window.kakao.maps.load(() => {
            console.log('Kakao Maps API 초기화 완료');
            if (isMounted) {
              setIsMapLoaded(true);
            }
          });
        }
      };

      script.onerror = () => {
        console.error('Kakao Maps 스크립트 로드 실패');
        if (isMounted) {
          setMapError('Kakao Maps 스크립트 로드 실패');
        }
      };
      
      document.head.appendChild(script);
    };

    const initMap = () => {
      try {
        console.log('지도 초기화 시작');

        const container = mapContainerRef.current;
        if (!container) {
          console.log('지도 컨테이너를 찾을 수 없습니다');
          return;
        }

        // API 객체 확인
        if (!window.kakao?.maps?.LatLng || 
            !window.kakao?.maps?.Map || 
            !window.kakao?.maps?.Marker ||
            !window.kakao?.maps?.InfoWindow ||
            !window.kakao?.maps?.event) {
          console.error('API 객체 확인 실패:', {
            LatLng: !!window.kakao?.maps?.LatLng,
            Map: !!window.kakao?.maps?.Map,
            Marker: !!window.kakao?.maps?.Marker,
            InfoWindow: !!window.kakao?.maps?.InfoWindow,
            event: !!window.kakao?.maps?.event
          });
          throw new Error('Kakao Maps API 객체들이 로드되지 않았습니다');
        }

        // 좌표 설정
        const coords = new window.kakao.maps.LatLng(37.2601095, 126.9627869);
        console.log('좌표 생성 완료:', coords);
        
        // 지도 옵션
        const mapOptions = {
          center: coords,
          level: 3
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(container, mapOptions);
        console.log('지도 객체 생성 완료');

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: coords
        });
        marker.setMap(map);
        console.log('마커 생성 완료');

        // 정보창 생성
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">수원 힐링 상담센터</h3>
              <p style="margin: 0; font-size: 12px; line-height: 1.4;">
                수원시 권선구 호매실로 90번길 116, 201호<br/>
                순복음빛으로교회
              </p>
            </div>
          `
        });

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker);
        });

        console.log('지도 초기화 완료');
      } catch (error) {
        console.error('지도 초기화 오류:', error);
        if (isMounted) {
          setMapError(error instanceof Error ? error.message : '지도 초기화 중 오류가 발생했습니다');
        }
      }
    };

    // 클라이언트 환경에서만 실행
    if (typeof window !== 'undefined') {
      loadKakaoMapScript();
    }

    // 클린업 함수
    return () => {
      isMounted = false;
    };
  }, []);

  // API가 로드되고 컨테이너가 준비되면 지도 초기화
  useEffect(() => {
    if (isMapLoaded && isContainerReady && mapContainerRef.current) {
      console.log('API와 컨테이너가 모두 준비됨, 지도 초기화 시작');
      
      try {
        const container = mapContainerRef.current;
        
        // API 객체 확인
        if (!window.kakao?.maps?.LatLng || 
            !window.kakao?.maps?.Map || 
            !window.kakao?.maps?.Marker ||
            !window.kakao?.maps?.InfoWindow ||
            !window.kakao?.maps?.event) {
          console.error('API 객체 확인 실패');
          throw new Error('Kakao Maps API 객체들이 로드되지 않았습니다');
        }

        // 좌표 설정
        const coords = new window.kakao.maps.LatLng(37.2601095, 126.9627869);
        console.log('좌표 생성 완료:', coords);
        
        // 지도 옵션
        const mapOptions = {
          center: coords,
          level: 3
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(container, mapOptions);
        console.log('지도 객체 생성 완료');

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: coords
        });
        marker.setMap(map);
        console.log('마커 생성 완료');

        // 정보창 생성
        const infowindow = new window.kakao.maps.InfoWindow({
          content: `
            <div style="padding: 10px; min-width: 200px;">
              <h3 style="margin: 0 0 5px 0; font-size: 14px; font-weight: bold;">수원 힐링 상담센터</h3>
              <p style="margin: 0; font-size: 12px; line-height: 1.4;">
                수원시 권선구 호매실로 90번길 116, 201호<br/>
                순복음빛으로교회
              </p>
            </div>
          `
        });

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker);
        });

        console.log('지도 초기화 완료');
      } catch (error) {
        console.error('지도 초기화 오류:', error);
        setMapError(error instanceof Error ? error.message : '지도 초기화 중 오류가 발생했습니다');
      }
    }
  }, [isMapLoaded, isContainerReady]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          수원 힐링 상담센터
        </h1>
        <p className="text-xl text-gray-600">
          마음의 치유를 위한 따뜻한 공간
        </p>
      </div>

      {/* 센터장 인사말 */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            센터장 인사말
          </h2>
          <div className="flex items-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6">
              센터장
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">김힐링</h3>
              <p className="text-gray-600">상담심리학 박사 / 임상심리전문가</p>
            </div>
          </div>
          <div className="text-gray-700 leading-relaxed">
            <p className="mb-4">
              안녕하세요. 수원 힐링 상담센터 센터장 김힐링입니다.
            </p>
            <p className="mb-4">
              현대 사회의 복잡한 문제들로 인해 많은 분들이 마음의 어려움을 겪고 계십니다. 
              우리 센터는 전문적이고 따뜻한 마음으로 여러분의 치유 과정을 함께하며, 
              건강한 마음으로 일상으로 돌아갈 수 있도록 도와드립니다.
            </p>
            <p className="mb-4">
              20년간의 상담 경험을 바탕으로 개인 맞춤형 상담을 제공하며, 
              최신 심리치료 기법을 활용하여 효과적인 치료를 진행합니다.
            </p>
            <p>
              여러분의 마음이 치유받을 수 있는 안전한 공간이 되도록 최선을 다하겠습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 센터 소개 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          센터 소개
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">비전</h3>
            <p className="text-gray-600">
              마음의 치유를 통해 건강한 사회를 만들어가는 
              전문적이고 따뜻한 상담센터
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">💝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">미션</h3>
            <p className="text-gray-600">
              전문적이고 체계적인 상담을 통해 
              내담자의 마음 치유와 성장을 돕습니다
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">🌟</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">핵심가치</h3>
            <p className="text-gray-600">
              전문성, 따뜻함, 비밀보장, 
              개인 맞춤형 상담을 중시합니다
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 text-xl">📈</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">연혁</h3>
            <p className="text-gray-600">
              2010년 설립 이후 13년간  
              5,000명 이상의 내담자와 함께했습니다
            </p>
          </div>
        </div>
      </section>

      {/* 전문 분야 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          전문 분야
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-2xl">😔</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">우울증</h3>
            <p className="text-gray-600 text-sm">
              우울감, 무기력함, 흥미 상실 등의 
              증상을 전문적으로 치료합니다
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-2xl">😰</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">불안장애</h3>
            <p className="text-gray-600 text-sm">
              공포증, 강박증, 범불안장애 등 
              다양한 불안 증상을 치료합니다
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-2xl">💔</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">대인관계</h3>
            <p className="text-gray-600 text-sm">
              부부문제, 가족문제, 대인관계 스트레스 등 
              관계 문제를 상담합니다
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-600 text-2xl">👶</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">아동청소년</h3>
            <p className="text-gray-600 text-sm">
              발달장애, 학습문제, 학교폭력 등 
              아동청소년 문제를 전문적으로 상담합니다
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">트라우마</h3>
            <p className="text-gray-600 text-sm">
              PTSD, 성폭력, 사고 후유증 등 
              트라우마 치료를 전문으로 합니다
            </p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-indigo-600 text-2xl">🧠</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">성인ADHD</h3>
            <p className="text-gray-600 text-sm">
              성인 ADHD 진단 및 치료, 
              일상생활 적응을 돕습니다
            </p>
          </div>
        </div>
      </section>

      {/* 오시는 길 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          오시는 길
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">주소</h3>
            <div className="space-y-3 text-gray-600">
              <p className="flex items-start">
                <span className="text-blue-600 mr-3">📍</span>
                수원시 권선구 호매실로 90번길 116, 201호<br/>
                순복음빛으로교회
              </p>
              <p className="flex items-center">
                <span className="text-green-600 mr-3">📞</span>
                070-4647-1125
              </p>
              <p className="flex items-center">
                <span className="text-purple-600 mr-3">📧</span>
                ittlc.sangdam@gmail.com
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">운영시간</h3>
            <div className="space-y-2 text-gray-600">
              <p className="flex justify-between">
                <span>평일</span>
                <span>09:00 - 18:00</span>
              </p>
              <p className="flex justify-between">
                <span>토요일</span>
                <span>09:00 - 15:00</span>
              </p>
              <p className="flex justify-between">
                <span>일요일</span>
                <span>휴무</span>
              </p>
              <p className="flex justify-between">
                <span>공휴일</span>
                <span>휴무</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Kakao 지도 */}
        <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">지도</h3>
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              {mapError ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-600 mb-2">지도를 불러올 수 없습니다</p>
                    <p className="text-sm text-gray-500">{mapError}</p>
                  </div>
                </div>
              ) : !isMapLoaded ? (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">지도를 불러오는 중...</p>
                  </div>
                </div>
              ) : (
                <div ref={mapContainerRef} className="w-full h-full"></div>
              )}
            </div>
            <div className="mt-4 text-center space-x-4">
              <a
                href="https://map.kakao.com/?q=수원시+권선구+호매실로+90번길+116+순복음빛으로교회"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <span className="mr-2">🗺️</span>
                Kakao 지도에서 보기
              </a>
              <a
                href="https://map.naver.com/?query=수원시+권선구+호매실로+90번길+116+순복음빛으로교회"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <span className="mr-2">🗺️</span>
                Naver 지도에서 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 교통편 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          교통편
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-xl">🚇</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">지하철</h3>
            <p className="text-gray-600 text-sm">
              1호선 수원역 3번 출구에서<br />
              도보 5분 거리입니다
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-xl">🚌</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">버스</h3>
            <p className="text-gray-600 text-sm">
              수원역 정류장 하차<br />
              2-1, 5-1, 7-1, 9-1번 버스 이용
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-xl">🚗</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">자가용</h3>
            <p className="text-gray-600 text-sm">
              순복음빛으로교회 주차장 이용 가능<br />
              2시간 무료주차
            </p>
          </div>
        </div>
      </section>

      {/* 시설 안내 */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          시설 안내
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">상담실</h3>
            <div className="space-y-3 text-gray-600">
              <p>• 개인상담실 3개</p>
              <p>• 부부상담실 1개</p>
              <p>• 가족상담실 1개</p>
              <p>• 그룹상담실 1개</p>
              <p>• 심리검사실 1개</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">편의시설</h3>
            <div className="space-y-3 text-gray-600">
              <p>• 대기실 및 휴게공간</p>
              <p>• 음료 자판기</p>
              <p>• 무료 Wi-Fi</p>
              <p>• 엘리베이터</p>
              <p>• 장애인 편의시설</p>
            </div>
          </div>
        </div>
      </section>

      {/* 연락처 */}
      <section className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            상담 문의
          </h2>
          <p className="text-gray-600 mb-6">
            상담에 대한 궁금한 점이 있으시면 언제든 연락주세요.
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/consultation"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              상담 신청하기
            </Link>
            <a
              href="tel:070-4647-1125"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              전화 문의
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}; 