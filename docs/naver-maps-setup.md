# 🗺️ Naver 지도 API 설정 가이드

## 📋 Naver Cloud Platform API 키 발급

### 1. Naver Cloud Platform 가입
1. **Naver Cloud Platform 접속**: https://www.ncloud.com/
2. **회원가입/로그인**
3. **무료 크레딧 신청** (선택사항)

### 2. Maps API 등록
1. **Console 접속**: https://console.ncloud.com/
2. **AI·NAVER API** → **Maps** 선택
3. **Application 등록** 클릭
4. **서비스 환경 설정**:
   - **웹 서비스 URL**: `http://localhost:3000`
   - **Android 패키지명**: (선택사항)
   - **iOS Bundle ID**: (선택사항)

### 3. API 키 확인
- **Client ID** 복사
- **Client Secret** 복사 (필요시)

## 🔧 코드 설정

### 1. index.html 수정
```html
<!-- Naver 지도 API -->
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID"></script>
```

### 2. 실제 Client ID로 교체
```html
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=실제_CLIENT_ID"></script>
```

### 3. 환경 변수 설정 (선택사항)
```env
# .env 파일
VITE_NAVER_MAPS_CLIENT_ID=your_client_id_here
```

```html
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=%VITE_NAVER_MAPS_CLIENT_ID%"></script>
```

## 🎯 Naver 지도의 장점

### 1. 국내 사용자 친화적
- 한국 지명/주소 검색 정확도 높음
- 한국어 인터페이스
- 국내 사용자에게 친숙

### 2. 상세한 정보
- 대중교통 정보 정확
- 실시간 교통 정보
- 상세한 POI 정보

### 3. 무료 API
- 월 25,000회 무료 호출
- 개발/테스트용으로 충분

## 🔄 Kakao 지도와 비교

### Naver 지도
- ✅ 국내 사용자 친화적
- ✅ 대중교통 정보 정확
- ✅ 무료 API 제공
- ❌ API 키 발급 필요

### Kakao 지도
- ✅ 카카오 서비스 연동
- ✅ 카카오톡 공유 기능
- ✅ 한국 지도 데이터 정확
- ❌ API 키 발급 필요

## 📱 모바일 최적화

### 1. 반응형 지도
```css
.map-container {
  width: 100%;
  height: 400px;
}

@media (max-width: 768px) {
  .map-container {
    height: 300px;
  }
}
```

### 2. 터치 친화적 버튼
```tsx
<a
  href="https://map.naver.com/?query=주소"
  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
>
  <span className="mr-2">🗺️</span>
  Naver 지도에서 보기
</a>
```

## 🚀 배포 시 주의사항

### 1. 도메인 등록
- **프로덕션 도메인**을 Naver Cloud Console에 등록
- **localhost**는 개발용으로만 사용

### 2. HTTPS 필수
- **프로덕션 환경**에서는 HTTPS 필수
- **http://** → **https://** 변경

### 3. API 키 보안
- **Client ID**는 공개되어도 안전
- **Client Secret**은 서버에서만 사용

## 💡 팁

1. **개발 단계**: localhost로 테스트
2. **배포 단계**: 실제 도메인 등록
3. **성능 최적화**: 지도는 필요할 때만 로드
4. **접근성**: 스크린 리더 지원 고려

## 🔗 유용한 링크

- **Naver Cloud Platform**: https://www.ncloud.com/
- **Maps API 문서**: https://api.ncloud-docs.com/docs/ai-naver-mapsgeocoding-geocoding
- **개발자 센터**: https://developers.naver.com/main/ 