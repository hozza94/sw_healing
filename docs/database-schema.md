# 데이터베이스 스키마 정의서

## 📋 개요

수원 힐링 상담센터 웹사이트의 데이터베이스 스키마 정의서입니다.
PostgreSQL을 기반으로 설계되었으며, 12단계 상담 프로세스와 체크리스트 시스템을 지원합니다.

## 🗄️ 테이블 구조

### 1. 사용자 관리 (User Management)

#### 1.1 users 테이블
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    gender VARCHAR(10),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
```

#### 1.2 user_sessions 테이블
```sql
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
```

### 2. 상담 관리 (Consultation Management)

#### 2.1 consultation_requests 테이블
```sql
CREATE TABLE consultation_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    consultation_type VARCHAR(50) NOT NULL, -- 개인상담, 그룹상담, 온라인상담 등
    preferred_date DATE,
    preferred_time VARCHAR(20), -- 오전, 오후, 저녁
    reason TEXT,
    urgency_level INTEGER DEFAULT 1, -- 1-5 (1: 낮음, 5: 높음)
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    assigned_counselor_id INTEGER REFERENCES users(id),
    notes TEXT, -- 상담사 메모
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_consultation_requests_user_id ON consultation_requests(user_id);
CREATE INDEX idx_consultation_requests_status ON consultation_requests(status);
CREATE INDEX idx_consultation_requests_date ON consultation_requests(preferred_date);
```

#### 2.2 consultation_sessions 테이블
```sql
CREATE TABLE consultation_sessions (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultation_requests(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL, -- 1-12단계
    session_date DATE,
    session_time TIME,
    duration_minutes INTEGER DEFAULT 60,
    counselor_id INTEGER REFERENCES users(id),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_consultation_sessions_consultation_id ON consultation_sessions(consultation_id);
CREATE INDEX idx_consultation_sessions_date ON consultation_sessions(session_date);
```

### 3. 12단계 상담 데이터 (Healing Process Data)

#### 3.1 healing_sangdam_1st ~ healing_sangdam_12th 테이블
```sql
-- 1단계 상담 데이터
CREATE TABLE healing_sangdam_1st (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultation_requests(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES consultation_sessions(id),
    
    -- 기본 정보
    current_situation TEXT,
    main_concern TEXT,
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    
    -- 설문 항목들
    question_1 TEXT,
    answer_1 TEXT,
    question_2 TEXT,
    answer_2 TEXT,
    question_3 TEXT,
    answer_3 TEXT,
    question_4 TEXT,
    answer_4 TEXT,
    question_5 TEXT,
    answer_5 TEXT,
    
    -- 추가 필드
    additional_notes TEXT,
    counselor_feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2단계 상담 데이터
CREATE TABLE healing_sangdam_2nd (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultation_requests(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES consultation_sessions(id),
    
    -- 2단계 특화 필드
    emotional_state TEXT,
    coping_mechanisms TEXT,
    
    -- 설문 항목들
    question_1 TEXT,
    answer_1 TEXT,
    question_2 TEXT,
    answer_2 TEXT,
    question_3 TEXT,
    answer_3 TEXT,
    question_4 TEXT,
    answer_4 TEXT,
    question_5 TEXT,
    answer_5 TEXT,
    
    additional_notes TEXT,
    counselor_feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3-12단계도 동일한 구조로 생성
-- (실제 구현 시 각 단계별 특화 필드 추가)
```

#### 3.2 healing_progress 테이블
```sql
CREATE TABLE healing_progress (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER REFERENCES consultation_requests(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    current_step INTEGER DEFAULT 1, -- 1-12
    completed_steps INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 12,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_session_date DATE,
    next_session_date DATE,
    status VARCHAR(20) DEFAULT 'in_progress', -- not_started, in_progress, completed, paused
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_healing_progress_consultation_id ON healing_progress(consultation_id);
CREATE INDEX idx_healing_progress_user_id ON healing_progress(user_id);
```

### 4. 체크리스트 시스템 (Checklist System)

#### 4.1 checklist_templates 테이블
```sql
CREATE TABLE checklist_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 스트레스, 우울증, 불안 등
    items JSONB NOT NULL, -- 체크리스트 항목들
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.2 user_checklists 테이블
```sql
CREATE TABLE user_checklists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    consultation_id INTEGER REFERENCES consultation_requests(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES checklist_templates(id),
    checklist_name VARCHAR(100) NOT NULL,
    items JSONB NOT NULL, -- 사용자가 작성한 체크리스트
    completed_items JSONB, -- 완료된 항목들
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_user_checklists_user_id ON user_checklists(user_id);
CREATE INDEX idx_user_checklists_consultation_id ON user_checklists(consultation_id);
```

### 5. 상담 후기 (Reviews)

#### 5.1 reviews 테이블
```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    consultation_id INTEGER REFERENCES consultation_requests(id) ON DELETE CASCADE,
    title VARCHAR(200),
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    counselor_rating INTEGER CHECK (counselor_rating >= 1 AND counselor_rating <= 5),
    overall_satisfaction INTEGER CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 5),
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE, -- 관리자 승인 여부
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_consultation_id ON reviews(consultation_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
```

#### 5.2 review_likes 테이블
```sql
CREATE TABLE review_likes (
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(review_id, user_id)
);

-- 인덱스
CREATE INDEX idx_review_likes_review_id ON review_likes(review_id);
CREATE INDEX idx_review_likes_user_id ON review_likes(user_id);
```

### 6. 관리자 기능 (Admin Features)

#### 6.1 counselors 테이블
```sql
CREATE TABLE counselors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    specialization TEXT,
    experience_years INTEGER,
    education TEXT,
    certifications TEXT,
    bio TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    max_clients INTEGER DEFAULT 10,
    current_clients INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_counselors_user_id ON counselors(user_id);
CREATE INDEX idx_counselors_available ON counselors(is_available);
```

#### 6.2 admin_logs 테이블
```sql
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_table VARCHAR(50),
    target_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);
```

### 7. 시스템 설정 (System Settings)

#### 7.1 system_settings 테이블
```sql
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기본 설정 데이터
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('site_name', '수원 힐링 상담센터', '사이트 이름'),
('contact_email', 'info@suwon-healing.com', '연락처 이메일'),
('contact_phone', '031-123-4567', '연락처 전화번호'),
('address', '경기도 수원시 영통구', '센터 주소'),
('business_hours', '09:00-18:00', '운영 시간'),
('max_consultation_duration', '60', '상담 시간 (분)'),
('session_interval_days', '7', '상담 간격 (일)');
```

## 🔄 트리거 및 함수

### 1. updated_at 자동 업데이트 트리거
```sql
-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 각 테이블에 트리거 적용
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultation_requests_updated_at BEFORE UPDATE ON consultation_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... 다른 테이블들에도 적용
```

### 2. 진행률 자동 계산 함수
```sql
CREATE OR REPLACE FUNCTION calculate_progress_percentage()
RETURNS TRIGGER AS $$
BEGIN
    NEW.progress_percentage = (NEW.completed_steps::DECIMAL / NEW.total_sessions::DECIMAL) * 100;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_progress_percentage BEFORE INSERT OR UPDATE ON healing_progress FOR EACH ROW EXECUTE FUNCTION calculate_progress_percentage();
```

## 📊 뷰 (Views)

### 1. 상담 현황 뷰
```sql
CREATE VIEW consultation_summary AS
SELECT 
    cr.id,
    cr.name,
    cr.phone,
    cr.email,
    cr.consultation_type,
    cr.status,
    cr.created_at,
    hp.current_step,
    hp.progress_percentage,
    COUNT(cs.id) as total_sessions,
    COUNT(CASE WHEN cs.status = 'completed' THEN 1 END) as completed_sessions
FROM consultation_requests cr
LEFT JOIN healing_progress hp ON cr.id = hp.consultation_id
LEFT JOIN consultation_sessions cs ON cr.id = cs.consultation_id
GROUP BY cr.id, hp.current_step, hp.progress_percentage;
```

### 2. 상담사 현황 뷰
```sql
CREATE VIEW counselor_summary AS
SELECT 
    c.id,
    u.name,
    c.specialization,
    c.experience_years,
    c.current_clients,
    c.max_clients,
    COUNT(cr.id) as total_consultations,
    AVG(r.rating) as avg_rating
FROM counselors c
JOIN users u ON c.user_id = u.id
LEFT JOIN consultation_requests cr ON c.user_id = cr.assigned_counselor_id
LEFT JOIN reviews r ON cr.id = r.consultation_id
GROUP BY c.id, u.name, c.specialization, c.experience_years, c.current_clients, c.max_clients;
```

## 🔐 보안 설정

### 1. RLS (Row Level Security) 설정
```sql
-- 사용자별 데이터 접근 제한
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE healing_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_checklists ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY user_own_consultations ON consultation_requests
    FOR ALL USING (user_id = current_setting('app.current_user_id')::INTEGER);
```

## 📈 성능 최적화

### 1. 파티셔닝 (대용량 데이터용)
```sql
-- 상담 세션 테이블 파티셔닝 (월별)
CREATE TABLE consultation_sessions_2024_01 PARTITION OF consultation_sessions
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE consultation_sessions_2024_02 PARTITION OF consultation_sessions
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

### 2. 통계 정보 업데이트
```sql
-- 주기적으로 통계 정보 업데이트
ANALYZE users;
ANALYZE consultation_requests;
ANALYZE healing_progress;
ANALYZE reviews;
```

## 🗂️ 백업 및 복구

### 1. 백업 스크립트 예시
```bash
#!/bin/bash
# daily_backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U healing_user -d suwon_healing > backup_$DATE.sql
```

## 📋 마이그레이션 가이드

### 1. 초기 마이그레이션
```sql
-- 1단계: 기본 테이블 생성
-- users, consultation_requests, reviews 테이블

-- 2단계: 상담 프로세스 테이블 생성
-- healing_sangdam_1st ~ healing_sangdam_12th

-- 3단계: 체크리스트 시스템 추가
-- checklist_templates, user_checklists

-- 4단계: 관리자 기능 추가
-- counselors, admin_logs

-- 5단계: 뷰 및 인덱스 생성
-- consultation_summary, counselor_summary
```

이 스키마는 확장 가능하고 성능이 최적화된 구조로 설계되었습니다. 실제 구현 시에는 비즈니스 요구사항에 따라 추가적인 필드나 테이블이 필요할 수 있습니다. 