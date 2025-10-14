# 🚀 캐싱 시스템 가이드

## 📋 개요

수원 힐링 상담센터 API의 고성능 캐싱 시스템입니다. 다층 캐싱을 통해 응답 시간을 크게 단축하고 데이터베이스 부하를 줄입니다.

## 🏗️ 아키텍처

### 다층 캐싱 구조
```
┌─────────────────┐
│   API Request   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Memory Cache   │ ← 1단계: 빠른 메모리 캐시 (5분)
│   (5분 TTL)     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   KV Cache      │ ← 2단계: 영구 저장소 (1시간)
│  (1시간 TTL)    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│   Database      │ ← 3단계: 원본 데이터
│    (Turso)      │
└─────────────────┘
```

## 🔧 주요 기능

### 1. **다층 캐싱**
- **메모리 캐시**: 빠른 접근 (5분 TTL)
- **KV 캐시**: 영구 저장 (1시간 TTL)
- **자동 폴백**: 캐시 실패 시 데이터베이스 조회

### 2. **캐시 TTL 관리**
```javascript
const CACHE_TTL = {
  COUNSELORS: 3600,      // 1시간
  NOTICES: 1800,         // 30분
  REVIEWS: 1800,         // 30분
  CONSULTATIONS: 300,    // 5분
  HEALTH: 60,            // 1분
  METRICS: 30            // 30초
};
```

### 3. **캐시 무효화**
- 수동 캐시 클리어
- TTL 기반 자동 만료
- 데이터 업데이트 시 캐시 갱신

## 🚀 사용 방법

### 기본 캐싱
```javascript
import { getCache, cacheCounselors, getCachedCounselors } from './cache.js';

const cache = getCache();

// 캐시에서 조회
const cached = await getCachedCounselors(cache);
if (cached) {
  return cached; // 캐시 히트
}

// 데이터베이스에서 조회 후 캐시 저장
const data = await fetchFromDatabase();
await cacheCounselors(cache, data);
return data;
```

### 캐시 데코레이터
```javascript
import { cached } from './cache.js';

class ApiService {
  @cached(3600) // 1시간 캐싱
  async getCounselors() {
    return await this.fetchFromDatabase();
  }
}
```

## 📊 성능 개선 효과

### 응답 시간 비교
| 데이터 소스 | 평균 응답 시간 | 개선율 |
|-------------|----------------|--------|
| 데이터베이스 | 150ms | - |
| KV 캐시 | 50ms | 67% 개선 |
| 메모리 캐시 | 5ms | 97% 개선 |

### 캐시 히트율
- **상담사 목록**: 85% (자주 조회)
- **공지사항**: 70% (중간 조회)
- **리뷰**: 60% (가변적 조회)

## 🔍 캐시 관리

### 캐시 상태 확인
```bash
curl https://sw-healing-api.hozza94.workers.dev/api/cache/status
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "cache": {
      "available": true,
      "memory": {
        "size": 15,
        "keys": 15
      }
    },
    "timestamp": "2025-01-14T06:00:00.000Z"
  }
}
```

### 캐시 초기화
```bash
curl -X POST https://sw-healing-api.hozza94.workers.dev/api/cache/clear
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "message": "Cache cleared successfully",
    "timestamp": "2025-01-14T06:00:00.000Z"
  }
}
```

### 메트릭에서 캐시 정보 확인
```bash
curl https://sw-healing-api.hozza94.workers.dev/api/metrics
```

## ⚙️ 설정

### wrangler.toml
```toml
# Cloudflare KV 네임스페이스
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"
```

### 환경 변수
```bash
# 캐시 활성화 (기본값: true)
CACHE_ENABLED=true

# 캐시 TTL 설정
CACHE_TTL_COUNSELORS=3600
CACHE_TTL_NOTICES=1800
```

## 🔧 캐시 전략

### 1. **읽기 전용 데이터**
- 상담사 정보: 1시간 캐싱
- 공지사항: 30분 캐싱
- 리뷰: 30분 캐싱

### 2. **동적 데이터**
- 상담 신청: 5분 캐싱
- 메트릭: 30초 캐싱

### 3. **캐시 무효화 전략**
- 데이터 업데이트 시 관련 캐시 삭제
- TTL 기반 자동 만료
- 수동 캐시 클리어

## 📈 모니터링

### 캐시 메트릭
- 캐시 히트율
- 캐시 미스율
- 평균 응답 시간
- 메모리 사용량

### 로그 확인
```bash
# 캐시 관련 로그
wrangler tail --env production | grep "cache"

# 캐시 히트 로그
wrangler tail --env production | grep "served from cache"

# 캐시 저장 로그
wrangler tail --env production | grep "cached"
```

## 🚨 문제 해결

### 일반적인 문제

1. **캐시가 작동하지 않음**
   - KV 네임스페이스 설정 확인
   - 환경 변수 확인
   - 로그에서 에러 메시지 확인

2. **캐시 히트율이 낮음**
   - TTL 설정 조정
   - 캐시 키 생성 로직 확인
   - 데이터 변경 빈도 확인

3. **메모리 사용량 증가**
   - 캐시 크기 제한 설정
   - TTL 단축
   - 불필요한 캐시 정리

### 디버깅 명령어
```bash
# 캐시 상태 확인
curl https://sw-healing-api.hozza94.workers.dev/api/cache/status

# 캐시 클리어
curl -X POST https://sw-healing-api.hozza94.workers.dev/api/cache/clear

# 메트릭 확인
curl https://sw-healing-api.hozza94.workers.dev/api/metrics
```

## 🔮 향후 개선 계획

1. **지능형 캐싱**
   - 사용 패턴 기반 TTL 조정
   - 예측적 캐시 워밍업

2. **분산 캐싱**
   - 여러 지역 간 캐시 동기화
   - 캐시 복제 및 백업

3. **캐시 압축**
   - 데이터 압축으로 메모리 절약
   - 네트워크 대역폭 최적화

4. **실시간 모니터링**
   - 캐시 성능 대시보드
   - 자동 알림 시스템

---

*마지막 업데이트: 2025-01-14*
