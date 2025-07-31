# API 문서

## 개요

수원 힐링 상담센터 웹사이트의 RESTful API 문서입니다.

- **Base URL**: `http://localhost:8000`
- **API Version**: v1
- **Authentication**: JWT Bearer Token

## 인증 (Authentication)

### 로그인
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동"
  }
}
```

### 회원가입
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## 상담 신청 (Consultation Requests)

### 상담 신청 목록 조회
```http
GET /api/v1/consultations
Authorization: Bearer {token}
```

**Query Parameters:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10)
- `status`: 상태 필터 (pending, confirmed, completed, cancelled)

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "홍길동",
      "phone": "010-1234-5678",
      "email": "user@example.com",
      "consultation_type": "개인상담",
      "preferred_date": "2024-01-15",
      "reason": "스트레스 관리 상담을 받고 싶습니다.",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 상담 신청 생성
```http
POST /api/v1/consultations
```

**Request Body:**
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "email": "user@example.com",
  "consultation_type": "개인상담",
  "preferred_date": "2024-01-15",
  "reason": "스트레스 관리 상담을 받고 싶습니다."
}
```

**Response:**
```json
{
  "id": 1,
  "name": "홍길동",
  "phone": "010-1234-5678",
  "email": "user@example.com",
  "consultation_type": "개인상담",
  "preferred_date": "2024-01-15",
  "reason": "스트레스 관리 상담을 받고 싶습니다.",
  "status": "pending",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 상담 신청 상세 조회
```http
GET /api/v1/consultations/{consultation_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "name": "홍길동",
  "phone": "010-1234-5678",
  "email": "user@example.com",
  "consultation_type": "개인상담",
  "preferred_date": "2024-01-15",
  "reason": "스트레스 관리 상담을 받고 싶습니다.",
  "status": "pending",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 상담 신청 상태 업데이트
```http
PATCH /api/v1/consultations/{consultation_id}
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

## 상담 후기 (Reviews)

### 후기 목록 조회
```http
GET /api/v1/reviews
```

**Query Parameters:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 항목 수 (기본값: 10)
- `rating`: 평점 필터 (1-5)
- `consultation_type`: 상담 유형 필터

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "title": "정말 도움이 되었습니다",
      "content": "상담을 통해 많은 도움을 받았습니다.",
      "rating": 5,
      "consultation_type": "개인상담",
      "is_anonymous": false,
      "created_at": "2024-01-01T00:00:00Z",
      "user": {
        "name": "홍길동"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### 후기 생성
```http
POST /api/v1/reviews
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "title": "정말 도움이 되었습니다",
  "content": "상담을 통해 많은 도움을 받았습니다.",
  "rating": 5,
  "consultation_id": 1,
  "is_anonymous": false
}
```

**Response:**
```json
{
  "id": 1,
  "title": "정말 도움이 되었습니다",
  "content": "상담을 통해 많은 도움을 받았습니다.",
  "rating": 5,
  "consultation_id": 1,
  "is_anonymous": false,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 후기 상세 조회
```http
GET /api/v1/reviews/{review_id}
```

**Response:**
```json
{
  "id": 1,
  "title": "정말 도움이 되었습니다",
  "content": "상담을 통해 많은 도움을 받았습니다.",
  "rating": 5,
  "consultation_id": 1,
  "is_anonymous": false,
  "created_at": "2024-01-01T00:00:00Z",
  "user": {
    "name": "홍길동"
  },
  "consultation": {
    "consultation_type": "개인상담"
  }
}
```

## 12단계 상담 데이터 (Healing Consultation)

### 1단계 상담 데이터 조회
```http
GET /api/v1/healing/1st/{consultation_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "consultation_id": 1,
  "user_id": 1,
  "question_1": "현재 스트레스 수준은 어느 정도입니까?",
  "answer_1": "매우 높음",
  "question_2": "주요 스트레스 원인은 무엇입니까?",
  "answer_2": "업무 압박",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 1단계 상담 데이터 생성/업데이트
```http
POST /api/v1/healing/1st
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "consultation_id": 1,
  "question_1": "현재 스트레스 수준은 어느 정도입니까?",
  "answer_1": "매우 높음",
  "question_2": "주요 스트레스 원인은 무엇입니까?",
  "answer_2": "업무 압박"
}
```

### 2-12단계 상담 데이터
각 단계별로 동일한 패턴으로 API 엔드포인트가 제공됩니다:
- `GET /api/v1/healing/{step}/{consultation_id}`
- `POST /api/v1/healing/{step}`

## 체크리스트 (Checklists)

### 체크리스트 조회
```http
GET /api/v1/checklists/{consultation_id}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "consultation_id": 1,
  "user_id": 1,
  "checklist_type": "스트레스 체크리스트",
  "items": [
    {
      "id": 1,
      "question": "잠을 잘 자고 있습니까?",
      "answer": true,
      "note": "잠들기 어려운 편입니다."
    }
  ],
  "completed_at": "2024-01-01T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 체크리스트 생성/업데이트
```http
POST /api/v1/checklists
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "consultation_id": 1,
  "checklist_type": "스트레스 체크리스트",
  "items": [
    {
      "question": "잠을 잘 자고 있습니까?",
      "answer": true,
      "note": "잠들기 어려운 편입니다."
    }
  ]
}
```

## 사용자 관리 (Users)

### 현재 사용자 정보 조회
```http
GET /api/v1/users/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 사용자 정보 업데이트
```http
PATCH /api/v1/users/me
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

## 에러 응답

### 400 Bad Request
```json
{
  "detail": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## 상태 코드

- `200 OK`: 요청 성공
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스를 찾을 수 없음
- `422 Unprocessable Entity`: 유효성 검사 실패
- `500 Internal Server Error`: 서버 내부 오류

## Rate Limiting

API 요청은 다음과 같이 제한됩니다:
- 인증되지 않은 요청: 100 requests/hour
- 인증된 요청: 1000 requests/hour

## API 버전 관리

현재 API 버전은 v1입니다. 향후 호환성을 위해 새로운 버전이 필요할 때는 `/api/v2/` 형태로 제공됩니다. 