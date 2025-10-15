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
INSERT INTO consultation_types (code, name_ko, name_en, description) VALUES
('INDIVIDUAL', '개인상담', 'Individual Counseling', '1대1 개인 상담'),
('COUPLE', '부부상담', 'Couple Counseling', '부부 관계 상담'),
('FAMILY', '가족상담', 'Family Counseling', '가족 구성원 전체 상담'),
('GROUP', '그룹상담', 'Group Counseling', '여러 명이 함께하는 그룹 상담');

INSERT INTO urgency_levels (code, name_ko, name_en, description, priority) VALUES
('LOW', '낮음', 'Low', '일반적인 상담 요청', 1),
('MEDIUM', '보통', 'Medium', '보통 수준의 긴급성', 2),
('HIGH', '높음', 'High', '긴급한 상담 요청', 3);

INSERT INTO consultation_statuses (code, name_ko, name_en, description, color_code) VALUES
('PENDING', '대기중', 'Pending', '상담 신청이 접수되어 대기 중', 'yellow'),
('REVIEWING', '검토중', 'Reviewing', '상담사가 신청 내용을 검토 중', 'blue'),
('CONFIRMED', '수락됨', 'Confirmed', '상담사가 상담을 수락함', 'green'),
('SCHEDULED', '일정확정', 'Scheduled', '구체적인 상담 일정이 확정됨', 'purple'),
('IN_PROGRESS', '진행중', 'In Progress', '상담이 진행 중', 'orange'),
('COMPLETED', '완료됨', 'Completed', '상담이 완료됨', 'gray'),
('CANCELLED', '취소됨', 'Cancelled', '상담이 취소됨', 'red'),
('REJECTED', '거절됨', 'Rejected', '상담사가 상담을 거절함', 'red');
