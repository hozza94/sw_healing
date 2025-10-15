-- Turso 데이터베이스 스키마 생성 스크립트

-- 상담사 테이블
CREATE TABLE IF NOT EXISTS counselors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization TEXT,
    education TEXT,
    experience TEXT,
    certification TEXT,
    bio TEXT,
    profile_image VARCHAR(500),
    is_online BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    rating FLOAT DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    full_name VARCHAR(200),
    hashed_password VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT 1,
    is_admin BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- 상담 예약 테이블
CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    counselor_id INTEGER,
    consultation_type VARCHAR(10),
    status VARCHAR(9) DEFAULT 'PENDING',
    urgency_level VARCHAR(6),
    title VARCHAR(200),
    description TEXT,
    preferred_date DATETIME,
    preferred_time VARCHAR(50),
    contact_name VARCHAR(200),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    notes TEXT,
    is_confidential BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (counselor_id) REFERENCES counselors(id)
);

-- 공지사항 테이블
CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    notice_type VARCHAR(7) DEFAULT 'GENERAL',
    status VARCHAR(9) DEFAULT 'DRAFT',
    is_pinned BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    attachment_url VARCHAR(500),
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 리뷰 테이블
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    counselor_id INTEGER,
    consultation_id INTEGER,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    is_anonymous BOOLEAN DEFAULT 0,
    is_approved BOOLEAN DEFAULT 1,
    is_active BOOLEAN DEFAULT 1,
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (counselor_id) REFERENCES counselors(id),
    FOREIGN KEY (consultation_id) REFERENCES consultations(id)
);

-- 상담 유형 마스터 테이블
CREATE TABLE IF NOT EXISTS consultation_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    name_ko VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- 긴급도 마스터 테이블
CREATE TABLE IF NOT EXISTS urgency_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(10) UNIQUE NOT NULL,
    name_ko VARCHAR(30) NOT NULL,
    name_en VARCHAR(30) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- 상담 상태 마스터 테이블
CREATE TABLE IF NOT EXISTS consultation_statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(20) UNIQUE NOT NULL,
    name_ko VARCHAR(30) NOT NULL,
    name_en VARCHAR(30) NOT NULL,
    description TEXT,
    color_code VARCHAR(20),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- 마스터 데이터 삽입
INSERT OR IGNORE INTO consultation_types (code, name_ko, name_en, description) VALUES
('INDIVIDUAL', '개인상담', 'Individual Counseling', '1대1 개인 상담'),
('COUPLE', '부부상담', 'Couple Counseling', '부부 관계 상담'),
('FAMILY', '가족상담', 'Family Counseling', '가족 구성원 전체 상담'),
('GROUP', '그룹상담', 'Group Counseling', '여러 명이 함께하는 그룹 상담');

INSERT OR IGNORE INTO urgency_levels (code, name_ko, name_en, description, priority) VALUES
('LOW', '낮음', 'Low', '일반적인 상담 요청', 1),
('MEDIUM', '보통', 'Medium', '보통 수준의 긴급성', 2),
('HIGH', '높음', 'High', '긴급한 상담 요청', 3);

INSERT OR IGNORE INTO consultation_statuses (code, name_ko, name_en, description, color_code) VALUES
('PENDING', '대기중', 'Pending', '상담 신청이 접수되어 대기 중', 'yellow'),
('REVIEWING', '검토중', 'Reviewing', '상담사가 신청 내용을 검토 중', 'blue'),
('CONFIRMED', '수락됨', 'Confirmed', '상담사가 상담을 수락함', 'green'),
('SCHEDULED', '일정확정', 'Scheduled', '구체적인 상담 일정이 확정됨', 'purple'),
('IN_PROGRESS', '진행중', 'In Progress', '상담이 진행 중', 'orange'),
('COMPLETED', '완료됨', 'Completed', '상담이 완료됨', 'gray'),
('CANCELLED', '취소됨', 'Cancelled', '상담이 취소됨', 'red'),
('REJECTED', '거절됨', 'Rejected', '상담사가 상담을 거절함', 'red');

-- 샘플 데이터 삽입
INSERT OR IGNORE INTO counselors (name, email, phone, specialization, education, experience, bio, is_online, is_active, rating, total_reviews) VALUES
('김상담', 'counselor1@suwon-healing.com', '010-1000-1000', '개인상담', '서울대학교 심리학과 졸업', '10년', '따뜻하고 전문적인 상담을 제공합니다.', 1, 1, 4.8, 25),
('이치유', 'counselor2@suwon-healing.com', '010-2000-2000', '부부상담', '연세대학교 상담심리학과 졸업', '8년', '부부 관계 개선을 위한 전문적인 상담을 제공합니다.', 1, 1, 4.9, 30),
('박마음', 'counselor3@suwon-healing.com', '010-3000-3000', '청소년상담', '고려대학교 아동심리학과 졸업', '12년', '청소년의 마음을 이해하고 성장을 돕습니다.', 0, 1, 4.7, 20),
('정트라우마', 'counselor4@suwon-healing.com', '010-4000-4000', '트라우마상담', '중앙대학교 임상심리학과 졸업', '15년', '트라우마 치유를 위한 전문적인 상담을 제공합니다.', 1, 1, 4.9, 35),
('최힐링', 'counselor5@suwon-healing.com', '010-5000-5000', '스트레스관리', '성균관대학교 심리학과 졸업', '7년', '스트레스 관리와 마음의 평화를 찾는 방법을 안내합니다.', 0, 1, 4.6, 18);

INSERT OR IGNORE INTO users (email, username, full_name, phone, is_active, is_admin) VALUES
('admin@suwon-healing.com', 'admin', '관리자', '010-0000-0000', 1, 1),
('user1@example.com', 'user1', '김철수', '010-1111-1111', 1, 0),
('user2@example.com', 'user2', '이영희', '010-2222-2222', 1, 0),
('user3@example.com', 'user3', '박민수', '010-3333-3333', 1, 0);

INSERT OR IGNORE INTO notices (author_id, title, content, notice_type, status, is_active) VALUES
(1, '상담센터 운영시간 안내', '수원 힐링 상담센터 운영시간을 안내드립니다.\n\n평일: 09:00-18:00\n토요일: 09:00-15:00\n일요일: 휴무\n\n문의사항이 있으시면 전화로 문의해주세요.', 'GENERAL', 'PUBLISHED', 1),
(1, '상담 예약 방법 안내', '온라인 상담 예약 방법을 안내드립니다.\n\n1. 홈페이지에서 상담사 선택\n2. 원하는 날짜와 시간 선택\n3. 상담 내용 작성 후 제출\n4. 확인 전화 후 상담 진행', 'GENERAL', 'PUBLISHED', 1),
(1, '개인정보 보호 안내', '수원 힐링 상담센터는 고객의 개인정보를 철저히 보호합니다.\n\n상담 내용은 절대 외부에 유출되지 않으며, 모든 상담사는 기밀유지 서약을 하고 있습니다.', 'GENERAL', 'PUBLISHED', 1);

INSERT OR IGNORE INTO reviews (user_id, counselor_id, rating, title, content, is_approved, is_active) VALUES
(2, 1, 5, '따뜻한 상담 감사합니다', '상담을 받으면서 마음이 편해지고 힘을 얻을 수 있었습니다. 정말 감사합니다.', 1, 1),
(3, 2, 5, '전문적인 상담', '부부 관계 개선에 큰 도움이 되었습니다. 전문적인 상담에 감사드립니다.', 1, 1),
(4, 3, 4, '청소년 상담 추천', '아이의 문제를 잘 이해하고 해결책을 제시해주셨습니다.', 1, 1);
