# 🚨 에러 처리 개선 가이드

## 📋 개요

수원 힐링 상담센터 API의 에러 처리를 체계적이고 사용자 친화적으로 개선했습니다.

## 🔧 개선된 기능들

### 1. **커스텀 에러 클래스**
- `AppError`: 기본 에러 클래스
- `ValidationError`: 입력 검증 에러 (422)
- `DatabaseError`: 데이터베이스 에러 (503)
- `NotFoundError`: 리소스 없음 에러 (404)
- `AuthenticationError`: 인증 에러 (401)
- `AuthorizationError`: 권한 에러 (403)

### 2. **일관된 에러 응답 형식**
```json
{
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "statusCode": 422,
    "timestamp": "2025-01-14T05:44:36.479Z",
    "details": {
      "field": "user_email",
      "value": "invalid-email"
    }
  }
}
```

### 3. **성공 응답 형식**
```json
{
  "success": true,
  "data": {
    "id": 1234567890,
    "message": "상담 신청이 완료되었습니다."
  },
  "timestamp": "2025-01-14T05:44:36.479Z"
}
```

### 4. **입력 검증 함수들**
- `validateRequired()`: 필수 필드 검증
- `validateEmail()`: 이메일 형식 검증
- `validatePhone()`: 전화번호 형식 검증
- `validateId()`: ID 형식 검증

### 5. **에러 로깅 시스템**
- 개발 환경: 상세 로그
- 프로덕션 환경: 간소화된 로그
- 컨텍스트 정보 포함

## 🚀 사용 예시

### 입력 검증
```javascript
// 필수 필드 검증
validateRequired(body.user_name, 'user_name');

// 이메일 검증
validateEmail(body.user_email);

// 전화번호 검증
validatePhone(body.user_phone);

// ID 검증
validateId(body.counselor_id, 'counselor');
```

### 에러 처리
```javascript
try {
  // API 로직
} catch (error) {
  if (error instanceof ValidationError) {
    throw error; // 검증 에러는 그대로 전달
  }
  handleDatabaseError(error, 'fetch counselors');
}
```

### 응답 생성
```javascript
// 성공 응답
return createSuccessResponse(data, HTTP_STATUS.OK, corsHeaders);

// 에러 응답
return createErrorResponse(error, corsHeaders);
```

## 📊 HTTP 상태 코드

| 상태 코드 | 의미 | 사용 사례 |
|-----------|------|-----------|
| 200 | OK | 성공적인 조회 |
| 201 | Created | 리소스 생성 성공 |
| 400 | Bad Request | 잘못된 요청 형식 |
| 401 | Unauthorized | 인증 필요 |
| 403 | Forbidden | 권한 부족 |
| 404 | Not Found | 리소스 없음 |
| 422 | Unprocessable Entity | 입력 검증 실패 |
| 500 | Internal Server Error | 서버 내부 에러 |
| 503 | Service Unavailable | 데이터베이스 연결 실패 |

## 🔍 에러 타입

| 타입 | 설명 | 상태 코드 |
|------|------|-----------|
| `VALIDATION_ERROR` | 입력 검증 실패 | 422 |
| `DATABASE_ERROR` | 데이터베이스 에러 | 503 |
| `AUTHENTICATION_ERROR` | 인증 실패 | 401 |
| `AUTHORIZATION_ERROR` | 권한 부족 | 403 |
| `NOT_FOUND_ERROR` | 리소스 없음 | 404 |
| `INTERNAL_ERROR` | 서버 내부 에러 | 500 |
| `EXTERNAL_SERVICE_ERROR` | 외부 서비스 에러 | 503 |

## 🧪 테스트 예시

### 1. 성공 케이스
```bash
curl -X GET https://sw-healing-api.hozza94.workers.dev/api/health
```
**응답:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "message": "수원 힐링 상담센터 API",
    "version": "1.0.0"
  },
  "timestamp": "2025-01-14T05:42:53.635Z"
}
```

### 2. 검증 에러 케이스
```bash
curl -X POST https://sw-healing-api.hozza94.workers.dev/api/consultations \
  -H "Content-Type: application/json" \
  -d '{"user_name":"","user_email":"invalid-email"}'
```
**응답:**
```json
{
  "error": {
    "type": "VALIDATION_ERROR",
    "message": "user_name is required",
    "statusCode": 422,
    "timestamp": "2025-01-14T05:44:36.479Z",
    "details": null
  }
}
```

### 3. 데이터베이스 에러 케이스
```bash
curl -X GET https://sw-healing-api.hozza94.workers.dev/api/counselors
```
**응답 (데이터베이스 연결 실패 시):**
```json
{
  "error": {
    "type": "DATABASE_ERROR",
    "message": "Database authentication failed",
    "statusCode": 503,
    "timestamp": "2025-01-14T05:44:36.479Z",
    "details": null
  }
}
```

## 🔧 개발자 도구

### 에러 로그 확인
```bash
# Cloudflare Workers 대시보드에서 로그 확인
wrangler tail --env production
```

### 로컬 테스트
```bash
# 로컬 개발 서버 실행
wrangler dev

# 에러 테스트
curl -X POST http://localhost:8787/api/consultations \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
```

## 📈 모니터링

### 주요 메트릭
- 에러 발생률
- 응답 시간
- 데이터베이스 연결 상태
- API 사용량

### 알림 설정
- 데이터베이스 연결 실패
- 5xx 에러 급증
- 응답 시간 지연

## 🚀 향후 개선 계획

1. **에러 추적 시스템** (Sentry, Bugsnag)
2. **성능 모니터링** (APM)
3. **자동 복구 메커니즘**
4. **에러 분석 대시보드**

---

*마지막 업데이트: 2025-01-14*
