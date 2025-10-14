# 📚 수원 힐링 상담센터 API 문서

## 📋 개요

수원 힐링 상담센터의 Cloudflare Workers 기반 API 서버 문서입니다.

## 📖 문서 목록

### 🔌 [API 문서](API_DOCUMENTATION.md)
- API 엔드포인트 목록
- 요청/응답 형식
- 사용 예시
- 개발자 도구

### 🚨 [에러 처리](ERROR_HANDLING.md)
- 커스텀 에러 클래스
- 에러 응답 형식
- 입력 검증
- HTTP 상태 코드

### 📊 [로깅 시스템](LOGGING_SYSTEM.md)
- 구조화된 로깅
- 성능 메트릭
- 모니터링
- 디버깅 가이드

### 🚀 [캐싱 시스템](CACHING_SYSTEM.md)
- 다층 캐싱 (메모리 + KV)
- 성능 최적화
- 캐시 관리
- 모니터링

### ⚡ [성능 최적화](PERFORMANCE_OPTIMIZATION.md)
- 쿼리 최적화
- 병렬 처리
- 응답 압축
- 성능 모니터링

### 🧠 [메모리 최적화](MEMORY_OPTIMIZATION.md)
- 메모리 모니터링
- 자동 가비지 컬렉션
- 버퍼 관리
- 메모리 압박 감지

## 🚀 빠른 시작

### 1. API 테스트
```bash
# 헬스 체크
curl https://sw-healing-api.hozza94.workers.dev/api/health

# 상담사 목록
curl https://sw-healing-api.hozza94.workers.dev/api/counselors

# 메트릭 조회
curl https://sw-healing-api.hozza94.workers.dev/api/metrics

# 캐시 상태 확인
curl https://sw-healing-api.hozza94.workers.dev/api/cache/status

# 캐시 초기화
curl -X POST https://sw-healing-api.hozza94.workers.dev/api/cache/clear

# 대시보드 데이터 (병렬 처리)
curl https://sw-healing-api.hozza94.workers.dev/api/dashboard

# 메모리 상태 확인
curl https://sw-healing-api.hozza94.workers.dev/api/memory/status

# 메모리 최적화 실행
curl -X POST https://sw-healing-api.hozza94.workers.dev/api/memory/optimize
```

### 2. API 문서 확인
- **Swagger UI**: https://sw-healing-api.hozza94.workers.dev/docs
- **OpenAPI 스펙**: https://sw-healing-api.hozza94.workers.dev/openapi.json

### 3. 로컬 개발
```bash
# 의존성 설치
npm install

# 로컬 서버 실행
wrangler dev

# 배포
wrangler deploy --env production
```

## 🔧 기술 스택

- **Runtime**: Cloudflare Workers (JavaScript)
- **Database**: Turso (SQLite)
- **API**: REST API
- **Documentation**: OpenAPI 3.0
- **Logging**: 구조화된 로깅 시스템

## 📊 모니터링

### 실시간 메트릭
- 요청 수, 에러 수, 응답 시간
- 데이터베이스 쿼리 성능
- 평균 응답 시간 및 에러율

### 로그 확인
```bash
# Cloudflare Workers 로그
wrangler tail --env production

# 특정 에러만 필터링
wrangler tail --env production | grep ERROR
```

## 🛠️ 개발 도구

### API 테스트
- **Postman**: [Collection 다운로드](https://sw-healing-api.hozza94.workers.dev/openapi.json)
- **curl**: 명령줄 테스트
- **Swagger UI**: 브라우저에서 테스트

### 코드 생성
- **OpenAPI Generator**: 클라이언트 코드 생성
- **Swagger Codegen**: API 클라이언트 자동 생성

## 📞 지원

API 관련 문의사항이 있으시면 다음으로 연락해주세요:
- **이메일**: info@suwon-healing.com
- **전화**: 031-123-4567

---

*마지막 업데이트: 2025-01-14*
