# 📚 수원 힐링 상담센터 API 문서

## 🌐 API 서버 정보

- **프로덕션**: https://sw-healing-api.hozza94.workers.dev
- **개발**: https://dev-sw-healing-api.workers.dev
- **로컬**: http://localhost:8787

## 📋 API 엔드포인트 목록

### 🏥 Health Check
- `GET /api/health` - 서버 상태 확인

### 👨‍⚕️ 상담사 (Counselors)
- `GET /api/counselors` - 상담사 목록 조회
- `GET /api/counselors/{id}` - 특정 상담사 조회

### 📢 공지사항 (Notices)
- `GET /api/notices` - 공지사항 목록 조회
- `GET /api/notices/{id}` - 특정 공지사항 조회

### ⭐ 리뷰 (Reviews)
- `GET /api/reviews` - 리뷰 목록 조회
- `GET /api/reviews/{id}` - 특정 리뷰 조회

### 📝 상담 신청 (Consultations)
- `GET /api/consultations` - 상담 목록 조회
- `POST /api/consultations` - 상담 신청

## 🔧 사용 방법

### 1. OpenAPI 스펙 확인
```bash
# OpenAPI 스펙 파일 다운로드
curl https://sw-healing-api.hozza94.workers.dev/openapi.json
```

### 2. Swagger UI에서 확인
- [Swagger Editor](https://editor.swagger.io/)에서 `openapi.json` 파일을 열어서 확인
- 또는 [Swagger UI Online](https://petstore.swagger.io/)에서 확인

### 3. Postman Collection
```bash
# Postman에서 Import > Link
https://sw-healing-api.hozza94.workers.dev/openapi.json
```

## 📊 응답 형식

### 성공 응답
```json
{
  "status": "success",
  "data": { ... },
  "message": "요청이 성공적으로 처리되었습니다."
}
```

### 에러 응답
```json
{
  "error": "Not Found",
  "message": "요청한 리소스를 찾을 수 없습니다."
}
```

## 🔐 인증

현재 API는 공개 API로 인증이 필요하지 않습니다.

## 📝 예시 요청

### 상담사 목록 조회
```bash
curl -X GET "https://sw-healing-api.hozza94.workers.dev/api/counselors" \
  -H "Accept: application/json"
```

### 상담 신청
```bash
curl -X POST "https://sw-healing-api.hozza94.workers.dev/api/consultations" \
  -H "Content-Type: application/json" \
  -d '{
    "user_name": "김철수",
    "user_email": "kim@example.com",
    "user_phone": "010-1111-1111",
    "consultation_type": "개인상담",
    "preferred_date": "2024-01-15",
    "preferred_time": "14:00",
    "message": "스트레스 관리에 대해 상담받고 싶습니다."
  }'
```

## 🚀 개발자 도구

### API 테스트 도구
- **Postman**: [Collection 다운로드](https://sw-healing-api.hozza94.workers.dev/openapi.json)
- **Insomnia**: OpenAPI 스펙 import
- **curl**: 명령줄에서 직접 테스트

### 코드 생성
- **OpenAPI Generator**: 다양한 언어의 클라이언트 코드 생성
- **Swagger Codegen**: API 클라이언트 자동 생성

## 📞 지원

API 관련 문의사항이 있으시면 다음으로 연락해주세요:
- **이메일**: info@suwon-healing.com
- **전화**: 031-123-4567

---

*마지막 업데이트: 2025-01-14*
