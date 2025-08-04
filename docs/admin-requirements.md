# 관리자 기능 요구사항 정의서

## 1. 프로젝트 개요

### 1.1 목적
수원힐링상담센터의 운영 효율성을 높이고, 상담 서비스의 품질을 관리하기 위한 종합적인 관리자 시스템 구축

### 1.2 범위
- 상담 예약 및 일정 관리
- 회원 및 상담사 관리
- 콘텐츠 관리 (공지사항, 게시판)
- 통계 및 분석
- 시스템 설정 및 보안

## 2. 기능 요구사항

### 2.1 사용자 관리 시스템

#### 2.1.1 회원 관리
- **회원 목록 조회**
  - 검색 기능 (이름, 연락처, 이메일, 가입일)
  - 필터링 (활성/비활성, 상담 이력 유무, 최근 활동일)
  - 페이지네이션 (20명씩 표시)
  - 엑셀 내보내기 기능

- **회원 상세 정보**
  - 기본 정보 (이름, 연락처, 이메일, 가입일)
  - 상담 이력 (총 상담 횟수, 최근 상담일, 상담사)
  - 예약 현황 (현재 예약, 과거 예약)
  - 상담 만족도 및 후기
  - 개인정보 수정 이력

- **회원 상태 관리**
  - 계정 활성화/비활성화
  - 회원 등급 관리 (일반/정기/프리미엄)
  - 탈퇴 처리 및 복구
  - 개인정보 삭제 요청 처리

#### 2.1.2 상담사 관리
- **상담사 프로필 관리**
  - 기본 정보 (이름, 연락처, 이메일, 사진)
  - 전문 분야 및 자격증
  - 경력 및 학력 정보
  - 상담 가능 시간 설정

- **상담사 일정 관리**
  - 개인별 상담 가능 시간 설정
  - 휴가 및 부재일 관리
  - 상담 일정 확인 및 조정
  - 상담사별 예약 현황

- **상담사 성과 관리**
  - 월별/연간 상담 건수
  - 고객 만족도 평균
  - 상담 완료율
  - 수익 실적

### 2.2 상담 예약 관리 시스템

#### 2.2.1 예약 관리
- **예약 현황 대시보드**
  - 일별/주별/월별 예약 현황
  - 상담사별 예약 현황
  - 예약 상태별 통계 (확정/대기/취소)
  - 실시간 예약 알림

- **예약 처리**
  - 예약 생성/수정/취소
  - 상담사 배정 및 변경
  - 예약 시간 조정
  - 예약 확인 및 알림 발송

- **일정 관리**
  - 상담사별 일정 확인
  - 충돌 예약 방지
  - 예약 가능 시간 설정
  - 휴일 및 특별 운영일 관리

#### 2.2.2 상담 진행 관리
- **상담 기록 관리**
  - 상담 시작/종료 시간 기록
  - 상담 내용 요약 입력
  - 다음 상담 계획 수립
  - 상담 노트 작성

- **상담 이력 관리**
  - 회원별 상담 이력 조회
  - 상담사별 상담 이력
  - 상담 결과 분석
  - 상담 자료 관리

### 2.3 콘텐츠 관리 시스템

#### 2.3.1 공지사항 관리
- **공지사항 작성/수정**
  - 제목, 내용, 카테고리 설정
  - 중요도 설정 (일반/중요/긴급)
  - 고정 여부 설정
  - 이미지 첨부 기능

- **공지사항 관리**
  - 공지사항 목록 조회
  - 검색 및 필터링
  - 수정/삭제 기능
  - 조회수 및 반응 통계

#### 2.3.2 게시판 관리
- **게시글 관리**
  - 게시글 목록 조회
  - 카테고리별 필터링
  - 신고된 게시글 처리
  - 부적절한 게시글 삭제

- **댓글 관리**
  - 댓글 목록 조회
  - 신고된 댓글 처리
  - 댓글 삭제 기능
  - 댓글 통계

- **게시판 설정**
  - 카테고리 추가/수정/삭제
  - 게시판 권한 설정
  - 게시글 작성 권한 관리

### 2.4 통계 및 분석 시스템

#### 2.4.1 대시보드
- **실시간 현황**
  - 오늘의 예약 건수
  - 현재 진행 중인 상담
  - 신규 회원 가입 수
  - 신규 예약 건수

- **주요 지표**
  - 월별 상담 건수
  - 회원 가입 추이
  - 상담 만족도 평균
  - 수익 현황

#### 2.4.2 상세 통계
- **회원 통계**
  - 연령대별 분포
  - 지역별 분포
  - 상담 유형별 분포
  - 재방문율

- **상담 통계**
  - 상담사별 성과
  - 상담 유형별 통계
  - 상담 시간대별 분포
  - 취소율 및 노쇼율

- **수익 통계**
  - 월별/연간 수익
  - 상담사별 수익
  - 상담 유형별 수익
  - 결제 방법별 통계

### 2.5 시스템 관리

#### 2.5.1 관리자 계정 관리
- **관리자 권한 시스템**
  - Super Admin (최고 관리자)
  - Admin (일반 관리자)
  - Counselor Admin (상담사 관리자)
  - Content Admin (콘텐츠 관리자)

- **권한별 기능 제한**
  - 메뉴 접근 권한
  - 데이터 조회/수정 권한
  - 시스템 설정 권한

#### 2.5.2 시스템 설정
- **기본 설정**
  - 센터 정보 관리
  - 운영 시간 설정
  - 상담료 설정
  - 예약 가능 시간 설정

- **알림 설정**
  - 예약 알림 설정
  - 상담 전날 알림
  - 시스템 공지 알림
  - 이메일/SMS 발송 설정

#### 2.5.3 보안 관리
- **로그 관리**
  - 관리자 로그인/로그아웃 기록
  - 데이터 수정 이력
  - 시스템 접근 기록
  - 보안 이벤트 기록

- **백업 및 복구**
  - 자동 백업 설정
  - 수동 백업 기능
  - 데이터 복구 기능
  - 백업 파일 관리

## 3. 기술 요구사항

### 3.1 보안 요구사항
- **인증 및 인가**
  - JWT 기반 인증
  - 세션 관리
  - 권한별 접근 제어
  - 비밀번호 정책 설정

- **데이터 보안**
  - 개인정보 암호화
  - HTTPS 통신
  - SQL Injection 방지
  - XSS 방지

### 3.2 성능 요구사항
- **응답 시간**
  - 페이지 로딩: 3초 이내
  - 데이터 조회: 1초 이내
  - 파일 업로드: 10초 이내

- **동시 사용자**
  - 최소 10명의 관리자 동시 접속
  - 데이터베이스 연결 풀 관리

### 3.3 사용성 요구사항
- **반응형 디자인**
  - 데스크톱, 태블릿, 모바일 지원
  - 직관적인 UI/UX
  - 키보드 단축키 지원

- **접근성**
  - 스크린 리더 지원
  - 고대비 모드 지원
  - 키보드 네비게이션 지원

## 4. 데이터베이스 설계

### 4.1 관리자 관련 테이블
```sql
-- 관리자 계정
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL, -- super_admin, admin, counselor_admin, content_admin
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 관리자 활동 로그
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admins(id),
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(50),
    target_id INTEGER,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.2 상담사 관리 테이블
```sql
-- 상담사 정보
CREATE TABLE counselors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialties TEXT[],
    certifications TEXT[],
    experience_years INTEGER,
    education TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 상담사 일정
CREATE TABLE counselor_schedules (
    id SERIAL PRIMARY KEY,
    counselor_id INTEGER REFERENCES counselors(id),
    day_of_week INTEGER, -- 0=일요일, 1=월요일, ...
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.3 예약 관리 테이블
```sql
-- 예약 정보
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    counselor_id INTEGER REFERENCES counselors(id),
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    consultation_type VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 상담 기록
CREATE TABLE consultation_records (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id),
    counselor_id INTEGER REFERENCES counselors(id),
    user_id INTEGER REFERENCES users(id),
    consultation_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    summary TEXT,
    next_plan TEXT,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4.4 통계 및 분석 테이블
```sql
-- 일일 통계
CREATE TABLE daily_statistics (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_appointments INTEGER DEFAULT 0,
    completed_appointments INTEGER DEFAULT 0,
    cancelled_appointments INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 월별 통계
CREATE TABLE monthly_statistics (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    total_appointments INTEGER DEFAULT 0,
    completed_appointments INTEGER DEFAULT 0,
    new_users INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0,
    average_satisfaction DECIMAL(3,2) DEFAULT 0,
    UNIQUE(year, month),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 5. 개발 일정

### 5.1 Phase 1 (4주) - 기본 관리자 기능
- 관리자 로그인/권한 시스템
- 회원 관리 기본 기능
- 상담 예약 관리
- 공지사항 관리

### 5.2 Phase 2 (3주) - 상담사 관리
- 상담사 프로필 관리
- 상담사 일정 관리
- 상담 이력 관리
- 성과 분석

### 5.3 Phase 3 (3주) - 통계 및 분석
- 대시보드 구현
- 상세 통계 기능
- 리포트 생성
- 데이터 내보내기

### 5.4 Phase 4 (2주) - 고급 기능
- 게시판 관리
- 시스템 설정
- 보안 강화
- 성능 최적화

## 6. 테스트 요구사항

### 6.1 기능 테스트
- 모든 CRUD 기능 테스트
- 권한별 접근 제어 테스트
- 데이터 검증 테스트
- 에러 처리 테스트

### 6.2 보안 테스트
- 인증/인가 테스트
- SQL Injection 테스트
- XSS 테스트
- CSRF 테스트

### 6.3 성능 테스트
- 부하 테스트
- 동시 사용자 테스트
- 데이터베이스 성능 테스트
- 메모리 사용량 테스트

## 7. 유지보수 요구사항

### 7.1 모니터링
- 시스템 상태 모니터링
- 에러 로그 모니터링
- 성능 모니터링
- 보안 이벤트 모니터링

### 7.2 백업 및 복구
- 자동 백업 스케줄링
- 백업 파일 검증
- 복구 절차 문서화
- 재해 복구 계획

## 8. 관리자 대시보드 구조

### 8.1 메인 대시보드
```
/admin
├── /dashboard          # 전체 현황 대시보드
├── /users             # 사용자 관리
├── /appointments      # 상담 예약 관리
├── /notices           # 공지사항 관리
├── /boards            # 게시판 관리
├── /counselors        # 상담사 관리
└── /analytics         # 통계 및 분석
```

### 8.2 권한별 접근 메뉴
- **Super Admin**: 모든 메뉴 접근 가능
- **Admin**: 사용자 관리, 예약 관리, 공지사항 관리
- **Counselor Admin**: 상담사 관리, 예약 관리, 상담 이력
- **Content Admin**: 공지사항 관리, 게시판 관리

## 9. API 엔드포인트 설계

### 9.1 관리자 인증
```
POST /api/admin/login
POST /api/admin/logout
GET /api/admin/profile
PUT /api/admin/profile
```

### 9.2 사용자 관리
```
GET /api/admin/users
GET /api/admin/users/{id}
PUT /api/admin/users/{id}
DELETE /api/admin/users/{id}
GET /api/admin/users/export
```

### 9.3 예약 관리
```
GET /api/admin/appointments
GET /api/admin/appointments/{id}
POST /api/admin/appointments
PUT /api/admin/appointments/{id}
DELETE /api/admin/appointments/{id}
GET /api/admin/appointments/calendar
```

### 9.4 통계 및 분석
```
GET /api/admin/statistics/dashboard
GET /api/admin/statistics/users
GET /api/admin/statistics/appointments
GET /api/admin/statistics/revenue
GET /api/admin/statistics/export
```

## 10. 보안 정책

### 10.1 접근 제어
- IP 화이트리스트 설정
- 관리자 계정 잠금 정책
- 세션 타임아웃 설정
- 비밀번호 정책 강화

### 10.2 데이터 보호
- 개인정보 암호화 저장
- 로그 데이터 마스킹
- 백업 데이터 암호화
- 접근 로그 보관

### 10.3 감사 및 모니터링
- 관리자 활동 로그
- 데이터 수정 이력
- 보안 이벤트 알림
- 정기 보안 점검

이 요구사항 정의서를 바탕으로 단계적으로 관리자 기능을 개발할 수 있습니다. 우선순위에 따라 Phase별로 진행하는 것을 권장합니다. 