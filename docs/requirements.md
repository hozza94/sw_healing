# 상담센터 홈페이지 요구사항 정의서

## 1. 프로젝트 개요

### 1.1 프로젝트명
수원 힐링 상담센터 웹사이트

### 1.2 프로젝트 목적
- 상담 신청 및 관리 시스템 구축
- 상담 후기 공유 플랫폼 제공
- 12단계 상담 프로세스 관리
- 사용자 친화적인 웹 인터페이스 제공

### 1.3 기술 스택
- **Backend**: FastAPI (Python)
- **Frontend**: React + TypeScript
- **UI Library**: shadcn/ui
- **Database**: PostgreSQL (추천)
- **Authentication**: JWT

## 2. 기능 요구사항

### 2.1 Phase 1 - 기본 기능 (MVP)

#### 2.1.1 홈페이지
- [ ] 센터 소개 페이지
- [ ] 상담 프로그램 안내
- [ ] 상담사 소개
- [ ] 연락처 및 위치 정보

#### 2.1.2 상담 신청
- [ ] 상담 신청 폼
  - 기본 정보 입력 (이름, 연락처, 상담 희망일 등)
  - 상담 유형 선택
  - 상담 신청 사유 간단 작성
- [ ] 상담 신청 확인 및 알림
- [ ] 상담 신청 현황 조회

#### 2.1.3 상담 조회
- [ ] 상담 신청 현황 조회
- [ ] 상담 일정 확인
- [ ] 상담 진행 상태 확인

#### 2.1.4 상담 후기
- [ ] 상담 후기 목록 조회
- [ ] 상담 후기 상세 보기
- [ ] 후기 작성 (익명 옵션)
- [ ] 후기 검색 및 필터링

### 2.2 Phase 2 - 사용자 관리

#### 2.2.1 회원가입/로그인
- [ ] 회원가입 기능
- [ ] 로그인/로그아웃
- [ ] 비밀번호 찾기
- [ ] 프로필 관리

#### 2.2.2 사용자별 기능
- [ ] 개인 상담 이력 관리
- [ ] 개인 상담 일정 관리
- [ ] 개인 후기 관리

### 2.3 Phase 3 - 상담 관리 시스템

#### 2.3.1 12단계 상담 프로세스
- [ ] 각 단계별 설문지 관리
- [ ] 상담 진행 상태 추적
- [ ] 단계별 결과 저장 및 조회

#### 2.3.2 체크리스트 관리
- [ ] 상황별 체크리스트 제공
- [ ] 체크리스트 결과 저장
- [ ] 체크리스트 히스토리 관리

## 3. 데이터베이스 설계

### 3.1 핵심 테이블 구조

#### 3.1.1 사용자 관리
```sql
-- users 테이블
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.1.2 상담 신청
```sql
-- consultation_requests 테이블
CREATE TABLE consultation_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    consultation_type VARCHAR(50),
    preferred_date DATE,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.1.3 상담 후기
```sql
-- reviews 테이블
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    consultation_id INTEGER REFERENCES consultation_requests(id),
    title VARCHAR(200),
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.1.4 12단계 상담 데이터
```sql
-- healing_sangdam_1st ~ healing_sangdam_12th 테이블
CREATE TABLE healing_sangdam_1st (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultation_requests(id),
    user_id INTEGER REFERENCES users(id),
    question_1 TEXT,
    answer_1 TEXT,
    question_2 TEXT,
    answer_2 TEXT,
    -- ... 추가 설문 항목들
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 나머지 2~12단계도 동일한 구조로 생성
```

#### 3.1.5 체크리스트
```sql
-- checklists 테이블
CREATE TABLE checklists (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultation_requests(id),
    user_id INTEGER REFERENCES users(id),
    checklist_type VARCHAR(50),
    items JSONB, -- 체크리스트 항목들을 JSON으로 저장
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 4. 기술적 요구사항

### 4.1 Frontend (React + shadcn/ui)
- [ ] 반응형 디자인
- [ ] 다크/라이트 모드 지원
- [ ] 접근성 고려
- [ ] SEO 최적화

### 4.2 Backend (FastAPI)
- [ ] RESTful API 설계
- [ ] JWT 인증 구현
- [ ] 데이터 검증 (Pydantic)
- [ ] 에러 핸들링
- [ ] 로깅 시스템

### 4.3 보안 요구사항
- [ ] HTTPS 적용
- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] CSRF 방지
- [ ] 개인정보 암호화

## 5. 개발 일정

### 5.1 Phase 1 (4-6주)
- 프로젝트 설정 및 기본 구조 구축
- 홈페이지 및 상담 신청 기능
- 상담 조회 및 후기 기능

### 5.2 Phase 2 (2-3주)
- 사용자 인증 시스템
- 개인화 기능

### 5.3 Phase 3 (4-6주)
- 12단계 상담 프로세스
- 체크리스트 시스템
- 관리자 기능

## 6. 성능 요구사항

- 페이지 로딩 시간: 3초 이내
- 동시 사용자: 100명 이상
- 데이터베이스 응답 시간: 1초 이내

## 7. 유지보수 요구사항

- 코드 문서화
- API 문서 자동 생성
- 로그 모니터링
- 백업 시스템 구축

## 8. 향후 확장 계획

- 모바일 앱 개발
- AI 상담 보조 시스템
- 온라인 상담 기능
- 결제 시스템 연동 