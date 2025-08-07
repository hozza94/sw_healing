# 데이터베이스 설계 문서

## 개요
수원힐링센터 웹사이트의 데이터베이스 설계 문서입니다. SQLite를 사용하며, SQLAlchemy ORM을 통해 관리됩니다.

## 테이블 구조

### 1. users (사용자)
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);
```

**관계:**
- `users` → `consultations` (1:N)
- `users` → `reviews` (1:N)
- `users` → `notices` (1:N, author)

### 2. counselors (상담사)
```sql
CREATE TABLE counselors (
    id INTEGER PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    specialization VARCHAR(200) NOT NULL,
    education VARCHAR(500) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    certification VARCHAR(500),
    bio TEXT,
    profile_image VARCHAR(500),
    is_online BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    rating FLOAT DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);
```

**관계:**
- `counselors` → `consultations` (1:N)
- `counselors` → `reviews` (1:N)

### 3. consultations (상담 신청)
```sql
CREATE TABLE consultations (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    counselor_id INTEGER,
    consultation_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    urgency_level VARCHAR(50) DEFAULT 'normal',
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    preferred_date DATETIME,
    preferred_time VARCHAR(50),
    contact_name VARCHAR(200) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    notes TEXT,
    is_confidential BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (counselor_id) REFERENCES counselors(id)
);
```

**관계:**
- `consultations` ← `users` (N:1)
- `consultations` ← `counselors` (N:1)
- `consultations` → `reviews` (1:N)

### 4. reviews (후기)
```sql
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    counselor_id INTEGER NOT NULL,
    consultation_id INTEGER,
    rating INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (counselor_id) REFERENCES counselors(id),
    FOREIGN KEY (consultation_id) REFERENCES consultations(id)
);
```

**관계:**
- `reviews` ← `users` (N:1)
- `reviews` ← `counselors` (N:1)
- `reviews` ← `consultations` (N:1)

### 5. notices (공지사항)
```sql
CREATE TABLE notices (
    id INTEGER PRIMARY KEY,
    author_id INTEGER NOT NULL,
    notice_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (author_id) REFERENCES users(id)
);
```

**관계:**
- `notices` ← `users` (N:1, author)

## 데이터 타입 및 제약사항

### Enum 값들

#### consultation_type
- `individual`: 개인 상담
- `couple`: 부부 상담
- `family`: 가족 상담
- `youth`: 청소년 상담
- `other`: 기타

#### consultation_status
- `pending`: 접수
- `reviewing`: 검토
- `confirmed`: 확정
- `completed`: 완료
- `cancelled`: 취소

#### urgency_level
- `normal`: 일반
- `urgent`: 긴급

#### notice_type
- `general`: 일반
- `important`: 중요
- `event`: 이벤트
- `maintenance`: 점검

#### notice_status
- `draft`: 초안
- `published`: 발행
- `archived`: 보관

## 인덱스

### 성능 최적화를 위한 인덱스
```sql
-- users 테이블
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- counselors 테이블
CREATE INDEX idx_counselors_email ON counselors(email);
CREATE INDEX idx_counselors_specialization ON counselors(specialization);

-- consultations 테이블
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_consultations_counselor_id ON consultations(counselor_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_created_at ON consultations(created_at);

-- reviews 테이블
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_counselor_id ON reviews(counselor_id);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- notices 테이블
CREATE INDEX idx_notices_author_id ON notices(author_id);
CREATE INDEX idx_notices_status ON notices(status);
CREATE INDEX idx_notices_is_pinned ON notices(is_pinned);
CREATE INDEX idx_notices_created_at ON notices(created_at);
```

## 샘플 데이터

### 기본 사용자
```sql
INSERT INTO users (email, username, full_name, hashed_password, is_admin) 
VALUES ('admin@suwon-healing.com', 'admin', '관리자', 'hashed_password', TRUE);
```

### 기본 상담사
```sql
INSERT INTO counselors (name, email, phone, specialization, education, experience, bio) 
VALUES 
('김민수', 'kim@suwon-healing.com', '010-1234-5678', '개인상담', '서울대학교 심리학과', '10년', '개인상담 전문가입니다.'),
('최수진', 'choi@suwon-healing.com', '010-2345-6789', '부부상담', '연세대학교 상담심리학과', '8년', '부부상담 전문가입니다.'),
('이영희', 'lee@suwon-healing.com', '010-3456-7890', '청소년상담', '고려대학교 아동심리학과', '12년', '청소년상담 전문가입니다.');
```

## API 엔드포인트

### 인증
- `POST /api/auth/login`: 로그인
- `POST /api/auth/register`: 회원가입
- `POST /api/auth/refresh`: 토큰 갱신

### 상담사
- `GET /api/counselors`: 상담사 목록
- `GET /api/counselors/{id}`: 상담사 상세
- `POST /api/counselors`: 상담사 등록 (관리자)
- `PUT /api/counselors/{id}`: 상담사 수정 (관리자)
- `DELETE /api/counselors/{id}`: 상담사 삭제 (관리자)

### 상담 신청
- `POST /api/consultations`: 상담 신청
- `GET /api/consultations`: 내 상담 목록
- `GET /api/consultations/{id}`: 상담 상세
- `PUT /api/consultations/{id}`: 상담 수정
- `DELETE /api/consultations/{id}`: 상담 삭제

### 후기
- `GET /api/reviews/approved`: 승인된 후기 목록
- `POST /api/reviews`: 후기 작성
- `GET /api/reviews/{id}`: 후기 상세
- `PUT /api/reviews/{id}`: 후기 수정
- `DELETE /api/reviews/{id}`: 후기 삭제

### 공지사항
- `GET /api/notices/published`: 발행된 공지사항 목록
- `GET /api/notices/{id}`: 공지사항 상세
- `POST /api/notices`: 공지사항 작성 (관리자)
- `PUT /api/notices/{id}`: 공지사항 수정 (관리자)
- `DELETE /api/notices/{id}`: 공지사항 삭제 (관리자)

## 보안 고려사항

1. **비밀번호**: bcrypt로 해시화하여 저장
2. **JWT 토큰**: 인증에 사용
3. **CORS**: 프론트엔드 도메인만 허용
4. **입력 검증**: Pydantic 스키마로 검증
5. **SQL 인젝션 방지**: SQLAlchemy ORM 사용

## 백업 및 복구

### 백업 명령어
```bash
# SQLite 데이터베이스 백업
cp suwon_healing.db suwon_healing_backup_$(date +%Y%m%d_%H%M%S).db
```

### 복구 명령어
```bash
# 백업에서 복구
cp suwon_healing_backup_YYYYMMDD_HHMMSS.db suwon_healing.db
```
