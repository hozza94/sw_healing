# 🗺️ 지도 통합 가이드

## 📍 Google Maps 통합 (추천)

### 1. Google Maps 임베드 URL 생성

1. **Google Maps에서 위치 검색**
   - https://maps.google.com 접속
   - "경기도 수원시 팔달구 중부대로 123번길 45 힐링빌딩" 검색

2. **공유 버튼 클릭**
   - 지도에서 "공유" 버튼 클릭
   - "지도 임베드" 탭 선택

3. **임베드 코드 복사**
   ```html
   <iframe src="https://www.google.com/maps/embed?pb=실제_임베드_URL" 
           width="600" height="450" style="border:0;" 
           allowfullscreen="" loading="lazy" 
           referrerpolicy="no-referrer-when-downgrade"></iframe>
   ```

### 2. 실제 주소로 임베드 URL 생성

수원역 근처 실제 주소를 사용한 예시:

```html
<iframe 
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.1234567890123!2d127.01234567890123!3d37.12345678901234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDA3JzM0LjQiTiAxMjfCsDAwJzQ0LjQiRQ!5e0!3m2!1sko!2skr!4v1234567890123"
  width="100%" 
  height="400" 
  style="border:0;" 
  allowfullscreen="" 
  loading="lazy" 
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
```

## 🗺️ 대안 지도 서비스들

### 1. Naver 지도 (국내 사용자 친화적)

```html
<div id="map" style="width:100%;height:400px;"></div>
<script type="text/javascript" src="https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=YOUR_CLIENT_ID"></script>
<script>
var map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.123456, 127.012345),
    zoom: 15
});
</script>
```

### 2. Kakao 지도

```html
<div id="map" style="width:100%;height:400px;"></div>
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY"></script>
<script>
var container = document.getElementById('map');
var options = {
    center: new kakao.maps.LatLng(37.123456, 127.012345),
    level: 3
};
var map = new kakao.maps.Map(container, options);
</script>
```

### 3. OpenStreetMap (무료)

```html
<iframe 
  width="100%" 
  height="400" 
  frameborder="0" 
  scrolling="no" 
  marginheight="0" 
  marginwidth="0" 
  src="https://www.openstreetmap.org/export/embed.html?bbox=127.012345,37.123456,127.012345,37.123456&layer=mapnik">
</iframe>
```

## 🔧 구현 방법

### 1. Google Maps (가장 간단)

```tsx
// About.tsx에 추가
<div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
  <div className="p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">지도</h3>
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <iframe
        src="실제_Google_Maps_임베드_URL"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="수원 힐링 상담센터 위치"
      ></iframe>
    </div>
    <div className="mt-4 text-center">
      <a
        href="https://maps.google.com/?q=실제주소"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <span className="mr-2">🗺️</span>
        Google Maps에서 보기
      </a>
    </div>
  </div>
</div>
```

### 2. 반응형 디자인

```css
/* 지도 컨테이너 반응형 */
.map-container {
  position: relative;
  width: 100%;
  height: 400px;
}

@media (max-width: 768px) {
  .map-container {
    height: 300px;
  }
}
```

## 📱 모바일 최적화

### 1. 터치 친화적 버튼

```tsx
<a
  href="tel:031-123-4567"
  className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg"
>
  <span className="mr-2">📞</span>
  전화 걸기
</a>
```

### 2. 네비게이션 앱 연동

```tsx
<a
  href="https://maps.apple.com/?q=실제주소"
  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
>
  <span className="mr-2">🧭</span>
  길찾기
</a>
```

## 🎯 추천 방법

1. **Google Maps** - 가장 널리 사용되고 안정적
2. **Naver 지도** - 국내 사용자에게 친숙
3. **Kakao 지도** - 카카오 서비스 사용자에게 유용

## 📋 구현 단계

1. Google Maps에서 실제 주소 검색
2. 공유 → 지도 임베드 → URL 복사
3. About.tsx에 iframe 추가
4. 반응형 디자인 적용
5. 테스트 및 최적화

## 💡 팁

- **실제 주소 사용**: 가상 주소 대신 실제 존재하는 주소 사용
- **로딩 최적화**: `loading="lazy"` 속성으로 성능 향상
- **접근성**: `title` 속성으로 스크린 리더 지원
- **보안**: `referrerPolicy="no-referrer-when-downgrade"` 설정 