# 📊 로깅 시스템 가이드

## 📋 개요

수원 힐링 상담센터 API의 고급 로깅 시스템입니다. 구조화된 로그, 성능 메트릭, 에러 추적을 제공합니다.

## 🔧 주요 기능

### 1. **구조화된 로그**
- JSON 형식의 일관된 로그 구조
- 타임스탬프, 로그 레벨, 컨텍스트 정보 포함
- 개발/프로덕션 환경별 최적화

### 2. **로그 레벨 관리**
- `ERROR`: 에러 및 예외 상황
- `WARN`: 경고 및 주의사항
- `INFO`: 일반적인 정보
- `DEBUG`: 디버깅 정보
- `TRACE`: 상세한 추적 정보

### 3. **성능 메트릭 수집**
- 요청 수, 에러 수, 응답 시간
- 데이터베이스 쿼리 성능
- 평균 응답 시간 및 에러율

### 4. **에러 추적**
- 스택 트레이스 포함
- 컨텍스트 정보 자동 수집
- 에러 분류 및 분석

## 🚀 사용 방법

### 기본 로깅
```javascript
import { getLogger } from './logger.js';

const logger = getLogger();

// 레벨별 로깅
logger.error('Database connection failed', { error: error.message });
logger.warn('High response time detected', { responseTime: '2.5s' });
logger.info('User login successful', { userId: 123 });
logger.debug('Processing request', { method: 'POST', path: '/api/consultations' });
```

### 특화된 로깅
```javascript
// 요청 로깅
logger.request('GET', '/api/counselors', 200, 150);

// 데이터베이스 로깅
logger.database('SELECT', 'SELECT * FROM counselors', true, 45);

// 성능 로깅
logger.performance('fetchCounselors', 120);
```

### 메트릭 조회
```javascript
// 메트릭 조회
const metrics = logger.getMetrics();
console.log(metrics);
```

## 📊 로그 형식

### 개발 환경 (색상 포함)
```
[2025-01-14T05:42:53.635Z] INFO: Request Started
{
  "method": "GET",
  "path": "/api/counselors",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}
Context: {
  "env": "development",
  "worker": "sw-healing-api",
  "version": "1.0.0"
}
```

### 프로덕션 환경 (JSON)
```json
{
  "timestamp": "2025-01-14T05:42:53.635Z",
  "level": "INFO",
  "message": "Request Started",
  "data": {
    "method": "GET",
    "path": "/api/counselors",
    "userAgent": "Mozilla/5.0...",
    "ip": "192.168.1.1"
  },
  "context": {
    "env": "production",
    "worker": "sw-healing-api",
    "version": "1.0.0"
  }
}
```

## 🔍 메트릭 엔드포인트

### 메트릭 조회
```bash
curl https://sw-healing-api.hozza94.workers.dev/api/metrics
```

**응답 예시:**
```json
{
  "success": true,
  "data": {
    "metrics": {
      "requests": 1250,
      "errors": 15,
      "responseTime": [120, 95, 110, ...],
      "avgResponseTime": 105.5,
      "errorRate": 1.2,
      "databaseQueries": 890,
      "databaseErrors": 3,
      "uptime": "3600s",
      "memory": {
        "used": "45MB",
        "total": "128MB"
      }
    },
    "timestamp": "2025-01-14T05:42:53.635Z"
  }
}
```

## 🛠️ 환경 설정

### wrangler.toml
```toml
[env.development.vars]
LOG_LEVEL = "DEBUG"
ENVIRONMENT = "development"

[env.production.vars]
LOG_LEVEL = "INFO"
ENVIRONMENT = "production"
```

### 로그 레벨 설정
- `DEBUG`: 모든 로그 출력 (개발용)
- `INFO`: INFO 이상 레벨만 출력 (프로덕션 기본)
- `WARN`: WARN 이상 레벨만 출력
- `ERROR`: ERROR 레벨만 출력

## 📈 모니터링 및 분석

### Cloudflare Workers 대시보드
```bash
# 실시간 로그 확인
wrangler tail --env production

# 특정 에러만 필터링
wrangler tail --env production | grep ERROR
```

### 로그 분석 도구
- **Cloudflare Analytics**: 기본 메트릭
- **Grafana**: 시각화 대시보드
- **ELK Stack**: 로그 수집 및 분석
- **Sentry**: 에러 추적 및 알림

## 🔧 커스터마이징

### 커스텀 로그 포맷터
```javascript
class CustomLogFormatter extends LogFormatter {
  static format(level, message, data, context) {
    // 커스텀 포맷 로직
    return customFormattedLog;
  }
}
```

### 커스텀 메트릭 수집기
```javascript
class CustomMetricsCollector extends MetricsCollector {
  recordCustomMetric(name, value) {
    // 커스텀 메트릭 수집
  }
}
```

## 🚨 알림 설정

### 에러율 모니터링
```javascript
// 에러율이 5% 이상일 때 알림
if (metrics.errorRate > 5) {
  logger.warn('High error rate detected', { errorRate: metrics.errorRate });
  // 알림 발송 로직
}
```

### 응답 시간 모니터링
```javascript
// 평균 응답 시간이 1초 이상일 때 알림
if (metrics.avgResponseTime > 1000) {
  logger.warn('Slow response time detected', { 
    avgResponseTime: metrics.avgResponseTime 
  });
}
```

## 📊 성능 최적화

### 로그 레벨 최적화
- 프로덕션에서는 `INFO` 이상만 사용
- 디버그 로그는 조건부 실행
- 민감한 정보는 마스킹

### 메모리 관리
- 로그 버퍼 크기 제한
- 오래된 메트릭 자동 정리
- 메모리 사용량 모니터링

## 🔍 디버깅 가이드

### 일반적인 문제 해결
1. **로그가 보이지 않음**: 로그 레벨 확인
2. **성능 저하**: 로그 출력 빈도 확인
3. **메모리 부족**: 로그 버퍼 크기 조정

### 디버깅 명령어
```bash
# 특정 엔드포인트 로그 확인
wrangler tail --env production | grep "/api/counselors"

# 에러 로그만 확인
wrangler tail --env production | grep "ERROR"

# 성능 로그 확인
wrangler tail --env production | grep "Performance"
```

## 🚀 향후 개선 계획

1. **분산 추적**: 요청 ID 기반 추적
2. **구조화된 로그**: OpenTelemetry 연동
3. **실시간 알림**: Slack/Email 연동
4. **대시보드**: Grafana 대시보드 구축
5. **ML 기반 이상 탐지**: 자동 이상 상황 감지

---

*마지막 업데이트: 2025-01-14*
