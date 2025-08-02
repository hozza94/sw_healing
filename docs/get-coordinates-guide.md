# 📍 실제 위도/경도 구하는 방법

## 🗺️ 방법 1: Kakao 지도에서 직접 확인 (가장 정확)

### 1단계: Kakao 지도 접속
- **Kakao 지도** 접속: https://map.kakao.com/
- **"순복음빛으로교회"** 검색

### 2단계: 좌표 확인
1. **검색 결과**에서 해당 위치 클릭
2. **우클릭** → **좌표 복사**
3. **복사된 좌표** 형식: `37.2589, 127.0167`

### 3단계: 코드에 적용
```typescript
// frontend/src/pages/About.tsx
center: new window.kakao.maps.LatLng(실제_위도, 실제_경도),
const markerPosition = new window.kakao.maps.LatLng(실제_위도, 실제_경도);
```

## 🌐 방법 2: Google Maps에서 확인

### 1단계: Google Maps 접속
- **Google Maps** 접속: https://maps.google.com/
- **"순복음빛으로교회"** 검색

### 2단계: 좌표 확인
1. **검색 결과**에서 해당 위치 클릭
2. **우클릭** → **이 위치는 어디인가요?**
3. **좌표 표시**: `37.2589, 127.0167`

### 3단계: 좌표 복사
- **좌표 클릭** → 자동으로 복사됨
- **위도, 경도** 순서로 표시

## 📱 방법 3: Naver 지도에서 확인

### 1단계: Naver 지도 접속
- **Naver 지도** 접속: https://map.naver.com/
- **"순복음빛으로교회"** 검색

### 2단계: 좌표 확인
1. **검색 결과**에서 해당 위치 클릭
2. **우클릭** → **좌표 복사**
3. **복사된 좌표** 사용

## 🔧 방법 4: 프로그래밍으로 자동화

### Kakao 지도 API로 주소 → 좌표 변환
```javascript
// 주소로 좌표 검색
const geocoder = new kakao.maps.services.Geocoder();
geocoder.addressSearch('경기도 수원시 권선구 호매실로90번길 116', function(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        console.log('위도:', result[0].y);
        console.log('경도:', result[0].x);
    }
});
```

### Google Maps Geocoding API 사용
```javascript
// Google Maps Geocoding API
const address = '경기도 수원시 권선구 호매실로90번길 116';
const apiKey = 'YOUR_GOOGLE_API_KEY';
const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        const location = data.results[0].geometry.location;
        console.log('위도:', location.lat);
        console.log('경도:', location.lng);
    });
```

## 🎯 방법 5: 브라우저 개발자 도구 활용

### 1단계: 지도 페이지 접속
- **Kakao 지도** 또는 **Google Maps** 접속
- **개발자 도구** 열기 (F12)

### 2단계: 네트워크 탭 확인
1. **Network** 탭 선택
2. **지도 이동** 또는 **검색**
3. **API 요청**에서 좌표 정보 확인

### 3단계: 콘솔에서 확인
```javascript
// Kakao 지도에서 현재 중심 좌표 확인
map.getCenter().getLat(); // 위도
map.getCenter().getLng(); // 경도
```

## 📋 추천 순서

### 1순위: **Kakao 지도 직접 확인**
- 가장 정확하고 한국 지도에 최적화
- 실제 사용할 지도 서비스와 동일

### 2순위: **Google Maps 확인**
- 전 세계적으로 표준
- 다양한 좌표계 지원

### 3순위: **프로그래밍 자동화**
- 대량의 주소 처리 시 유용
- 실시간 좌표 변환 필요 시

## 💡 팁

### 정확도 향상
- **상세 주소** 사용: "순복음빛으로교회 201호"
- **우편번호** 추가: "경기도 수원시 권선구 호매실로90번길 116, 16423"
- **주변 랜드마크** 포함: "순복음빛으로교회 근처"

### 좌표 검증
- **여러 지도 서비스**에서 동일한 좌표 확인
- **실제 방문**하여 정확성 검증
- **마커 위치** 미세 조정

## 🔗 유용한 링크

- **Kakao 지도**: https://map.kakao.com/
- **Google Maps**: https://maps.google.com/
- **Naver 지도**: https://map.naver.com/
- **Kakao 지도 API**: https://developers.kakao.com/docs/latest/ko/maps-js/
- **Google Maps API**: https://developers.google.com/maps/documentation/geocoding 