# 배포 환경에서 환경 변수 관리 가이드

## 개요

이 문서는 수원 힐링 상담센터 프로젝트의 배포 환경에서 환경 변수를 관리하는 방법을 설명합니다.

## 환경 변수 관리 방법

### 1. GitHub Secrets (권장)

GitHub Actions에서 환경 변수를 안전하게 관리하는 방법입니다.

#### 설정 방법:
1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. 다음 환경 변수들을 추가:

```
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-secret-key-here
VITE_API_BASE_URL=https://your-backend-domain.com
RAILWAY_TOKEN=your-railway-token
CUSTOM_DOMAIN=your-domain.com (선택사항)
```

#### 장점:
- ✅ 보안성: 환경 변수가 암호화되어 저장
- ✅ 접근 제어: 저장소 관리자만 수정 가능
- ✅ 자동화: CI/CD 파이프라인에서 자동 사용

### 2. Railway 환경 변수

Railway 배포 플랫폼에서 환경 변수를 설정하는 방법입니다.

#### 설정 방법:
1. Railway 대시보드 → 프로젝트 선택
2. Variables 탭 클릭
3. 환경 변수 추가:

```
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
API_V1_STR=/api/v1
PROJECT_NAME=Suwon Healing Counseling Center
BACKEND_CORS_ORIGINS=["https://your-frontend-domain.com"]
ENVIRONMENT=production
DEBUG=False
```

### 3. Vercel 환경 변수 (프론트엔드)

Vercel에서 프론트엔드 배포 시 환경 변수를 설정하는 방법입니다.

#### 설정 방법:
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 환경 변수 추가:

```
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_APP_NAME=수원 힐링 상담센터
```

## 환경별 설정

### 개발 환경 (로컬)
```bash
# .env 파일 사용
DATABASE_URL=sqlite:///./suwon_healing.db
SECRET_KEY=09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
DEBUG=True
```

### 테스트 환경 (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  SECRET_KEY: ${{ secrets.SECRET_KEY }}
  DEBUG: False
```

### 프로덕션 환경 (Railway)
```bash
# Railway 환경 변수
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=production-secret-key
DEBUG=False
```

## 보안 고려사항

### 1. .env 파일 관리
- ✅ `.env` 파일은 `.gitignore`에 포함되어야 함
- ✅ 실제 값은 GitHub Secrets에 저장
- ✅ 로컬 개발용 `.env.example` 파일 제공

### 2. SECRET_KEY 관리
- ✅ 개발용과 프로덕션용을 다르게 설정
- ✅ 충분히 긴 랜덤 문자열 사용
- ✅ 정기적으로 변경

### 3. 데이터베이스 URL 관리
- ✅ 개발: SQLite 사용
- ✅ 프로덕션: PostgreSQL 사용
- ✅ 연결 문자열에 민감한 정보 포함

## 문제 해결

### 환경 변수가 로드되지 않는 경우
1. 환경 변수 이름 확인
2. 애플리케이션 재시작
3. 캐시 정리

### GitHub Actions에서 환경 변수 오류
1. GitHub Secrets 설정 확인
2. 워크플로우 파일의 환경 변수 이름 확인
3. 권한 설정 확인

## 참고 자료

- [GitHub Secrets 문서](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Railway 환경 변수 문서](https://docs.railway.app/develop/variables)
- [Vercel 환경 변수 문서](https://vercel.com/docs/concepts/projects/environment-variables) 