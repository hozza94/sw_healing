# 🗺️ Kakao 지도 API 설정 가이드

## 📋 Kakao Developers API 키 발급

### 1. Kakao Developers 가입
1. **Kakao Developers 접속**: https://developers.kakao.com/
2. **회원가입/로그인** (카카오 계정으로 로그인)
3. **내 애플리케이션** 메뉴 접속

### 2. 애플리케이션 등록
1. **애플리케이션 추가** 클릭
2. **앱 이름**: "수원 힐링 상담센터"
3. **사업자명**: 개인 또는 회사명
4. **저장** 클릭

### 3. 플랫폼 설정
1. **플랫폼** 탭 선택
2. **Web 플랫폼 등록** 클릭
3. **사이트 도메인** 입력:
   - 개발용: `http://localhost:3000`
   - 프로덕션용: `https://your-domain.com`

### 4. JavaScript 키 확인
1. **앱 키** 탭 선택
2. **JavaScript 키** 복사

## 🔧 코드 설정

### 1. index.html 수정
```html
<!-- Kakao 지도 API -->
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY"></script>
```

### 2. 실제 JavaScript 키로 교체
```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=실제_JAVASCRIPT_키"></script>
```

### 3. 환경 변수 설정 (선택사항)
```env
# .env 파일
VITE_KAKAO_MAPS_APP_KEY=your_javascript_key_here
```

```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=%VITE_KAKAO_MAPS_APP_KEY%"></script>
```

## 🎯 Kakao 지도의 장점

### 1. 카카오 서비스 연동
- 카카오톡 공유 기능
- 카카오 계정으로 로그인
- 카카오 서비스 사용자에게 친숙

### 2. 한국 지도 데이터 정확
- 한국 지명/주소 검색 정확도 높음
- 상세한 POI 정보
- 실시간 교통 정보

### 3. 무료 API
- 월 300,000회 무료 호출
- 개발/테스트용으로 충분

## 🔄 Naver 지도와 비교

### Kakao 지도
- ✅ 카카오 서비스 연동
- ✅ 카카오톡 공유 기능
- ✅ 한국 지도 데이터 정확
- ✅ 무료 API 제공
- ❌ API 키 발급 필요

### Naver 지도
- ✅ 국내 사용자 친화적
- ✅ 대중교통 정보 정확
- ✅ 무료 API 제공
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
  href="https://map.kakao.com/?q=주소"
  className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-lg"
>
  <span className="mr-2">🗺️</span>
  Kakao 지도에서 보기
</a>
```

## 🚀 배포 시 주의사항

### 1. 도메인 등록
- **프로덕션 도메인**을 Kakao Developers에 등록
- **localhost**는 개발용으로만 사용

### 2. HTTPS 필수
- **프로덕션 환경**에서는 HTTPS 필수
- **http://** → **https://** 변경

### 3. API 키 보안
- **JavaScript 키**는 공개되어도 안전
- **REST API 키**는 서버에서만 사용

## 💡 팁

1. **개발 단계**: localhost로 테스트
2. **배포 단계**: 실제 도메인 등록
3. **성능 최적화**: 지도는 필요할 때만 로드
4. **접근성**: 스크린 리더 지원 고려

## 🔗 유용한 링크

- **Kakao Developers**: https://developers.kakao.com/
- **Maps API 문서**: https://developers.kakao.com/docs/latest/ko/maps-js/
- **JavaScript API 가이드**: https://apis.map.kakao.com/web/ 