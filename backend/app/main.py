from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from .config import settings
from .database import create_tables
from .api import auth, consultations, counselors, reviews, notices
import os

# FastAPI 앱 생성
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="수원 힐링 상담센터 API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HTTPS 강제 적용 미들웨어
@app.middleware("http")
async def force_https(request: Request, call_next):
    """HTTPS 강제 적용 미들웨어"""
    # 프로덕션 환경에서만 HTTPS 강제 적용
    if settings.ENVIRONMENT == "production" and request.url.scheme == "http":
        https_url = str(request.url).replace("http://", "https://")
        return RedirectResponse(url=https_url, status_code=301)
    
    response = await call_next(request)
    return response

# 라우터 등록
app.include_router(auth.router, prefix="/api")
app.include_router(consultations.router, prefix="/api")
app.include_router(counselors.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(notices.router, prefix="/api")

# 시작 이벤트
@app.on_event("startup")
async def startup_event():
    """애플리케이션 시작 시 실행"""
    create_tables()
    
    # 프로덕션 환경에서 샘플 데이터 삽입
    if settings.ENVIRONMENT == "production":
        try:
            from .database import get_db
            from sqlalchemy.orm import Session
            from .models.counselor import Counselor
            from .models.user import User
            from .models.review import Review
            from .models.notice import Notice
            
            # 데이터베이스 세션 생성
            db = next(get_db())
            
            # 상담사 데이터가 없으면 샘플 데이터 삽입
            if db.query(Counselor).count() == 0:
                print("📝 샘플 데이터 삽입 중...")
                
                # 샘플 상담사 데이터
                sample_counselors = [
                    Counselor(
                        name="김상담",
                        email="counselor1@suwon-healing.com",
                        phone="010-1000-1000",
                        specialization="개인상담",
                        education="서울대학교 심리학과 졸업",
                        experience="10년",
                        certification="상담심리사 1급",
                        bio="개인상담 전문가로서 다양한 심리적 어려움을 겪는 분들에게 따뜻한 마음으로 상담을 제공합니다.",
                        is_online=True,
                        is_active=True,
                        rating=4.8,
                        total_reviews=25
                    ),
                    Counselor(
                        name="이치유",
                        email="counselor2@suwon-healing.com",
                        phone="010-2000-2000",
                        specialization="부부상담",
                        education="연세대학교 가족학과 졸업",
                        experience="8년",
                        certification="부부상담 전문가",
                        bio="부부 간 소통 문제와 갈등 해결에 특화되어 있습니다. 건강한 관계 회복을 돕습니다.",
                        is_online=True,
                        is_active=True,
                        rating=4.9,
                        total_reviews=30
                    ),
                    Counselor(
                        name="박가족",
                        email="counselor3@suwon-healing.com",
                        phone="010-3000-3000",
                        specialization="가족상담",
                        education="고려대학교 아동가족학과 졸업",
                        experience="12년",
                        certification="가족상담사",
                        bio="가족 구성원 간의 이해와 소통을 돕고, 건강한 가족 관계를 만들어갑니다.",
                        is_online=True,
                        is_active=True,
                        rating=4.7,
                        total_reviews=20
                    )
                ]
                
                for counselor in sample_counselors:
                    db.add(counselor)
                
                db.commit()
                print("✅ 샘플 데이터 삽입 완료!")
                
        except Exception as e:
            print(f"⚠️ 샘플 데이터 삽입 실패: {e}")


@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "수원 힐링 상담센터 API",
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "healthy"}


@app.get("/test-counselors")
async def test_counselors():
    """상담사 테스트 엔드포인트"""
    try:
        from .database import get_db
        from .models.counselor import Counselor
        
        db = next(get_db())
        counselors = db.query(Counselor).all()
        
        return {
            "message": "상담사 테스트",
            "count": len(counselors),
            "counselors": [
                {
                    "id": c.id,
                    "name": c.name,
                    "specialization": c.specialization,
                    "rating": c.rating
                } for c in counselors
            ]
        }
    except Exception as e:
        return {"error": str(e)} 