# 🏥 수원 힐링 상담센터 API

## 📋 개요

수원 힐링 상담센터의 Cloudflare Workers 기반 API 서버입니다.

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
npm install -g wrangler
```

### 2. 환경 설정
```bash
# Cloudflare 계정 로그인
wrangler login

# 환경 변수 설정 (secrets)
wrangler secret put DATABASE_AUTH_TOKEN --env production
```

### 3. 로컬 개발
```bash
# 개발 서버 실행
wrangler dev

# http://localhost:8787 에서 확인
```

### 4. 배포
```bash
# 프로덕션 배포
wrangler deploy --env production

# 개발 환경 배포
wrangler deploy --env development
```

## 📁 프로젝트 구조

```
backend/
├── src/                    # 소스 코드
│   ├── index.js           # 메인 Workers 파일
│   ├── errors.js          # 에러 처리 시스템
│   └── logger.js          # 로깅 시스템
├── docs/                  # 문서
│   ├── README.md          # 문서 목록
│   ├── API_DOCUMENTATION.md
│   ├── ERROR_HANDLING.md
│   └── LOGGING_SYSTEM.md
├── fastapi-legacy/        # FastAPI 레거시 코드
├── wrangler.toml          # Workers 설정
└── README.md              # 이 파일
```

## 🌐 배포된 서비스

- **프로덕션**: https://sw-healing-api.hozza94.workers.dev
- **개발**: https://dev-sw-healing-api.workers.dev
- **API 문서**: https://sw-healing-api.hozza94.workers.dev/docs

## 📚 문서

자세한 문서는 [docs/](docs/) 폴더를 참고하세요:

- [API 문서](docs/API_DOCUMENTATION.md) - 엔드포인트 및 사용법
- [에러 처리](docs/ERROR_HANDLING.md) - 에러 처리 시스템
- [로깅 시스템](docs/LOGGING_SYSTEM.md) - 로깅 및 모니터링

## 🔧 주요 기능

- ✅ REST API 엔드포인트
- ✅ 구조화된 에러 처리
- ✅ 고급 로깅 시스템
- ✅ 성능 메트릭 수집
- ✅ OpenAPI 문서화
- ✅ CORS 지원
- ✅ 환경별 설정

## 📊 모니터링

### 메트릭 조회
```bash
curl https://sw-healing-api.hozza94.workers.dev/api/metrics
```

### 로그 확인
```bash
wrangler tail --env production
```

## 🛠️ 개발 도구

### API 테스트
```bash
# 헬스 체크
curl https://sw-healing-api.hozza94.workers.dev/api/health

# 상담사 목록
curl https://sw-healing-api.hozza94.workers.dev/api/counselors

# 상담 신청
curl -X POST https://sw-healing-api.hozza94.workers.dev/api/consultations \
  -H "Content-Type: application/json" \
  -d '{"user_name":"김철수","user_email":"kim@example.com","user_phone":"010-1111-1111","consultation_type":"개인상담"}'
```

### 환경 변수
```bash
# 로그 레벨 설정
LOG_LEVEL=DEBUG  # 개발용
LOG_LEVEL=INFO   # 프로덕션용

# 환경 설정
ENVIRONMENT=development
ENVIRONMENT=production
```

## 📞 지원

- **이메일**: info@suwon-healing.com
- **전화**: 031-123-4567

---

*마지막 업데이트: 2025-01-14*
