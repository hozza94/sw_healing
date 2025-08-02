# 🚀 개발 환경 가이드

## 📋 자동 재시작 기능

### ✅ 현재 설정된 기능들

#### **1. 실시간 코드 반영**
- **프론트엔드**: Vite의 HMR (Hot Module Replacement) 사용
- **백엔드**: Uvicorn의 `--reload` 옵션 사용
- **볼륨 마운트**: 소스 코드가 컨테이너와 실시간 동기화

#### **2. 파일 변경 감지**
- **Windows 최적화**: `CHOKIDAR_USEPOLLING: "true"`
- **폴링 간격**: 1초마다 파일 변경 확인
- **HMR 오버레이**: 오류 시 브라우저에 표시

#### **3. 개발 환경 설정**
- **환경 변수**: `NODE_ENV=development`, `DEBUG=true`
- **자동 재시작**: `restart: unless-stopped`
- **캐시 제외**: 불필요한 파일들 볼륨에서 제외

## 🛠️ 개발 환경 시작

### **방법 1: 개발 스크립트 사용 (권장)**
```bash
# 개발 환경 시작
./scripts/dev.sh

# 또는
bash scripts/dev.sh
```

### **방법 2: 직접 Docker Compose 사용**
```bash
# 개발용 설정으로 시작
docker compose -f docker-compose.dev.yml up --build -d

# 로그 확인
docker compose -f docker-compose.dev.yml logs -f
```

### **방법 3: 기존 설정 사용**
```bash
# 기존 설정으로 시작
docker compose up --build -d
```

## 📁 파일 구조

```
suwon_healing/
├── docker-compose.yml          # 프로덕션 설정
├── docker-compose.dev.yml      # 개발 설정 (새로 추가)
├── scripts/
│   └── dev.sh                 # 개발 환경 시작 스크립트
├── frontend/
│   ├── vite.config.ts         # Vite 개발 설정
│   └── Dockerfile             # 프론트엔드 컨테이너
└── backend/
    ├── Dockerfile             # 백엔드 컨테이너
    └── app/
        └── main.py            # FastAPI 앱
```

## 🔄 자동 재시작 동작 방식

### **프론트엔드 (React + Vite)**
```typescript
// frontend/vite.config.ts
export default defineConfig({
  server: {
    watch: {
      usePolling: true,  // Windows 파일 감지 개선
      interval: 1000,    // 1초마다 확인
    },
    hmr: {
      overlay: true,     // 오류 오버레이
    },
  },
})
```

### **백엔드 (FastAPI + Uvicorn)**
```dockerfile
# backend/Dockerfile
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### **볼륨 마운트**
```yaml
# docker-compose.dev.yml
volumes:
  - ./frontend:/app          # 소스 코드 실시간 동기화
  - /app/node_modules        # node_modules 제외
  - /app/dist               # 빌드 결과물 제외
```

## 🎯 개발 워크플로우

### **1. 개발 시작**
```bash
./scripts/dev.sh
```

### **2. 코드 수정**
- **프론트엔드**: `frontend/src/` 폴더의 파일 수정
- **백엔드**: `backend/app/` 폴더의 파일 수정

### **3. 자동 반영 확인**
- **브라우저**: 자동으로 새로고침되거나 HMR로 업데이트
- **API**: 백엔드 자동 재시작 후 변경사항 반영

### **4. 로그 확인**
```bash
# 전체 로그
docker compose -f docker-compose.dev.yml logs -f

# 프론트엔드만
docker compose -f docker-compose.dev.yml logs -f frontend

# 백엔드만
docker compose -f docker-compose.dev.yml logs -f backend
```

## 🔧 유용한 명령어

### **개발 환경 관리**
```bash
# 개발 환경 시작
./scripts/dev.sh

# 개발 환경 중지
docker compose -f docker-compose.dev.yml down

# 컨테이너 재시작
docker compose -f docker-compose.dev.yml restart

# 특정 서비스만 재시작
docker compose -f docker-compose.dev.yml restart frontend
docker compose -f docker-compose.dev.yml restart backend
```

### **로그 및 디버깅**
```bash
# 실시간 로그 확인
docker compose -f docker-compose.dev.yml logs -f

# 특정 서비스 로그
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f backend

# 컨테이너 상태 확인
docker compose -f docker-compose.dev.yml ps

# 컨테이너 내부 접속
docker exec -it suwon-healing-web sh
docker exec -it suwon-healing-api bash
```

### **데이터베이스 관리**
```bash
# 데이터베이스 접속
docker exec -it suwon-healing-db psql -U healing_user -d suwon_healing

# 데이터베이스 백업
docker exec suwon-healing-db pg_dump -U healing_user suwon_healing > backup.sql

# 데이터베이스 복원
docker exec -i suwon-healing-db psql -U healing_user -d suwon_healing < backup.sql
```

## 🚨 문제 해결

### **자동 재시작이 안 될 때**
```bash
# 컨테이너 재시작
docker compose -f docker-compose.dev.yml restart

# 볼륨 확인
docker volume ls

# 캐시 정리
docker system prune -f
```

### **파일 변경이 감지되지 않을 때**
```bash
# Windows에서 파일 감지 개선
# docker-compose.dev.yml에서 CHOKIDAR_USEPOLLING: "true" 확인

# 수동으로 재시작
docker compose -f docker-compose.dev.yml restart frontend
```

### **포트 충돌 시**
```bash
# 사용 중인 포트 확인
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# 프로세스 종료
taskkill /PID <프로세스ID> /F
```

## 📊 성능 최적화

### **개발 환경 최적화**
- **캐시 제외**: `node_modules`, `dist`, `__pycache__` 등
- **폴링 간격**: 1초로 설정하여 반응성과 성능 균형
- **HMR**: 핫 모듈 교체로 빠른 개발

### **메모리 사용량 최적화**
```bash
# 사용하지 않는 컨테이너 정리
docker container prune

# 사용하지 않는 이미지 정리
docker image prune

# 전체 시스템 정리
docker system prune -a
```

## 🎉 개발 팁

### **1. 빠른 개발을 위한 팁**
- **브라우저 개발자 도구** 활용
- **React Developer Tools** 확장 프로그램 설치
- **FastAPI 자동 문서** 활용: `http://localhost:8000/docs`

### **2. 디버깅 팁**
- **콘솔 로그** 확인
- **네트워크 탭**에서 API 요청 확인
- **Docker 로그** 실시간 모니터링

### **3. 코드 품질**
- **ESLint** 설정 확인
- **TypeScript** 타입 체크
- **Prettier** 코드 포맷팅

이제 코드를 수정하면 자동으로 반영됩니다! 🚀 