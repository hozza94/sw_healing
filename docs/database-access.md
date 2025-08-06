# 📊 SQLite 데이터베이스 접근 가이드

## 개요

수원 힐링 상담센터 프로젝트는 현재 로컬 SQLite 데이터베이스를 사용하고 있습니다. 이 문서에서는 데이터베이스에 접근하고 데이터를 확인하는 다양한 방법을 설명합니다.

## 📁 데이터베이스 파일 정보

- **파일 경로**: `backend/suwon_healing.db`
- **파일 크기**: 약 57KB
- **테이블 개수**: 5개
- **테이블 목록**:
  - `users` - 사용자 정보
  - `counselors` - 상담사 정보
  - `consultations` - 상담 신청 정보
  - `notices` - 공지사항
  - `reviews` - 후기

## 🔍 데이터베이스 접근 방법

### 1. 명령어로 확인 (추천)

가장 간단한 방법으로 데이터베이스 상태를 확인할 수 있습니다.

```bash
# backend 디렉토리로 이동
cd backend

# 데이터베이스 확인 스크립트 실행
python check_db.py
```

**출력 예시:**
```
🔍 SQLite 데이터베이스 확인
📁 데이터베이스 경로: C:\Users\NoahKu\Documents\GIT\suwon_healing\backend\suwon_healing.db
✅ 데이터베이스 파일 존재: 57344 bytes

📋 테이블 목록 (5개):
  - users
  - counselors
  - consultations
  - notices
  - reviews

📊 테이블: users
  컬럼:
    - id (INTEGER)
    - email (VARCHAR(255))
    - username (VARCHAR(100))
    - full_name (VARCHAR(200))
    - hashed_password (VARCHAR(255))
    - phone (VARCHAR(20))
    - is_active (BOOLEAN)
    - is_admin (BOOLEAN)
    - created_at (DATETIME)
    - updated_at (DATETIME)
  데이터 개수: 0
```

### 2. GUI 웹 인터페이스 (가장 편리)

웹 브라우저를 통해 데이터베이스를 시각적으로 확인하고 SQL 쿼리를 실행할 수 있습니다.

```bash
# backend 디렉토리로 이동
cd backend

# GUI 도구 실행
python db_gui.py
```

**접속 방법:**
- **URL**: http://localhost:5000
- **브라우저**: Chrome, Firefox, Edge 등

**주요 기능:**
- 📋 데이터베이스 정보 확인
- 📊 테이블 구조 및 데이터 개수 확인
- 🔍 SQL 쿼리 직접 실행
- 📝 실시간 데이터 조회/수정

### 3. SQLite 명령어 (설치 필요)

SQLite CLI가 설치되어 있다면 직접 명령어로 접근할 수 있습니다.

```bash
# SQLite CLI 설치 (Windows)
# https://www.sqlite.org/download.html 에서 다운로드

# 데이터베이스 접속
sqlite3 suwon_healing.db

# 유용한 명령어들
.tables                    # 테이블 목록 확인
.schema users              # users 테이블 구조 확인
SELECT * FROM users;       # users 테이블 데이터 조회
SELECT COUNT(*) FROM users; # users 테이블 데이터 개수
.quit                      # 종료
```

## 💡 유용한 SQL 쿼리 예시

### 기본 조회 쿼리

```sql
-- 모든 사용자 조회
SELECT * FROM users;

-- 활성화된 사용자만 조회
SELECT * FROM users WHERE is_active = 1;

-- 상담사 목록 조회
SELECT id, name, email, specialization, rating FROM counselors;

-- 최근 상담 신청 조회
SELECT * FROM consultations ORDER BY created_at DESC LIMIT 10;

-- 공지사항 조회
SELECT * FROM notices WHERE is_active = 1 ORDER BY created_at DESC;
```

### 테이블 구조 확인

```sql
-- 테이블 구조 확인
PRAGMA table_info(users);

-- 인덱스 확인
PRAGMA index_list(users);

-- 외래키 확인
PRAGMA foreign_key_list(users);
```

### 데이터 통계

```sql
-- 각 테이블의 데이터 개수
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'counselors', COUNT(*) FROM counselors
UNION ALL
SELECT 'consultations', COUNT(*) FROM consultations
UNION ALL
SELECT 'notices', COUNT(*) FROM notices
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;
```

## 🛠️ 데이터베이스 관리 도구

### 1. 테스트 데이터 삽입

```python
# test_data.py
import sqlite3
from datetime import datetime

def insert_test_data():
    conn = sqlite3.connect('suwon_healing.db')
    cursor = conn.cursor()
    
    # 테스트 사용자 추가
    cursor.execute("""
        INSERT INTO users (email, username, full_name, hashed_password, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, ('test@example.com', 'testuser', '테스트 사용자', 'hashed_password', 1, datetime.now()))
    
    conn.commit()
    conn.close()
    print("테스트 데이터 삽입 완료!")

if __name__ == "__main__":
    insert_test_data()
```

### 2. 데이터베이스 백업

```bash
# 데이터베이스 백업
cp suwon_healing.db suwon_healing_backup_$(date +%Y%m%d).db

# 또는 SQL 덤프 생성
sqlite3 suwon_healing.db .dump > backup_$(date +%Y%m%d).sql
```

### 3. 데이터베이스 초기화

```bash
# 데이터베이스 파일 삭제 (주의!)
rm suwon_healing.db

# 백엔드 서버 재시작하면 테이블이 다시 생성됩니다
python -m uvicorn app.main:app --reload
```

## 🔧 문제 해결

### 일반적인 문제들

1. **데이터베이스 파일이 없음**
   ```bash
   # 백엔드 서버를 실행하면 자동으로 생성됩니다
   python -m uvicorn app.main:app --reload
   ```

2. **권한 오류**
   ```bash
   # 파일 권한 확인
   ls -la suwon_healing.db
   
   # 권한 수정 (Linux/Mac)
   chmod 644 suwon_healing.db
   ```

3. **데이터베이스 잠금**
   ```bash
   # 모든 연결 종료 후 다시 시도
   # 또는 데이터베이스 파일을 백업하고 새로 생성
   ```

### 성능 최적화

```sql
-- 인덱스 생성
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_consultations_user_id ON consultations(user_id);
CREATE INDEX idx_reviews_counselor_id ON reviews(counselor_id);

-- 통계 업데이트
ANALYZE;
```

## 📚 추가 리소스

- [SQLite 공식 문서](https://www.sqlite.org/docs.html)
- [SQLite 명령어 참조](https://www.sqlite.org/cli.html)
- [Python sqlite3 모듈](https://docs.python.org/3/library/sqlite3.html)

## 🎯 다음 단계

1. **테스트 데이터 생성**: 실제 데이터로 API 테스트
2. **데이터베이스 마이그레이션**: Alembic 설정
3. **백업 전략**: 정기적인 데이터베이스 백업
4. **성능 모니터링**: 쿼리 성능 최적화

---

**마지막 업데이트**: 2024년 1월
**작성자**: 개발팀 