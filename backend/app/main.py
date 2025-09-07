from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from .config import settings
from .database import engine, get_db
from .models import user, counselor, consultation, review, notice
from .api import auth, counselors, consultations, reviews, notices
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

# HTTPS는 배포 플랫폼에서 자동으로 처리됩니다

# 라우터 등록
app.include_router(auth.router, prefix="/api")
app.include_router(consultations.router, prefix="/api")
app.include_router(counselors.router, prefix="/api")
app.include_router(reviews.router, prefix="/api")
app.include_router(notices.router, prefix="/api")

# 정적 파일 서빙
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# 시작 이벤트
@app.on_event("startup")
async def startup_event():
    """애플리케이션 시작 시 실행"""
    # 데이터베이스 테이블 생성
    from .database import create_tables
    create_tables()
    
    # 개발 환경에서 샘플 데이터 삽입
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


@app.get("/api/health")
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

@app.post("/api/insert-sample-data")
async def insert_sample_data():
    """샘플 데이터 수동 삽입"""
    try:
        from .database import get_db
        from .models.counselor import Counselor
        
        db = next(get_db())
        
        # 기존 데이터 확인
        existing_count = db.query(Counselor).count()
        if existing_count > 0:
            return {"message": f"이미 {existing_count}명의 상담사가 있습니다."}
        
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
        
        return {
            "message": "샘플 데이터 삽입 완료",
            "inserted_count": len(sample_counselors)
        }
        
    except Exception as e:
        return {"error": str(e)} 

@app.post("/api/insert-sample-consultations")
async def insert_sample_consultations():
    """샘플 상담 신청 데이터 삽입"""
    try:
        from .database import get_db
        from .models.consultation import Consultation
        from .models.user import User
        from .models.counselor import Counselor
        from datetime import datetime, timedelta
        
        db = next(get_db())
        
        # 기존 데이터 확인
        existing_count = db.query(Consultation).count()
        if existing_count > 0:
            return {"message": f"이미 {existing_count}개의 상담 신청이 있습니다."}
        
        # 사용자와 상담사 확인
        users = db.query(User).all()
        counselors = db.query(Counselor).all()
        
        if not users or not counselors:
            return {"error": "사용자나 상담사 데이터가 없습니다. 먼저 사용자와 상담사를 추가해주세요."}
        
        # 샘플 상담 신청 데이터
        sample_consultations = [
            Consultation(
                user_id=users[0].id,
                counselor_id=counselors[0].id,
                consultation_date=datetime.now().date() + timedelta(days=7),
                consultation_time=datetime.strptime("14:00", "%H:%M").time(),
                consultation_type="INDIVIDUAL",
                status="pending",
                created_at=datetime.now()
            ),
            Consultation(
                user_id=users[0].id,
                counselor_id=counselors[1].id,
                consultation_date=datetime.now().date() + timedelta(days=10),
                consultation_time=datetime.strptime("16:00", "%H:%M").time(),
                consultation_type="FAMILY",
                status="confirmed",
                created_at=datetime.now()
            ),
            Consultation(
                user_id=users[0].id,
                counselor_id=counselors[2].id,
                consultation_date=datetime.now().date() + timedelta(days=14),
                consultation_time=datetime.strptime("10:00", "%H:%M").time(),
                consultation_type="COUPLE",
                status="pending",
                created_at=datetime.now()
            )
        ]
        
        for consultation in sample_consultations:
            db.add(consultation)
        
        db.commit()
        
        return {
            "message": "샘플 상담 신청 데이터 삽입 완료",
            "inserted_count": len(sample_consultations)
        }
        
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/insert-sample-users")
async def insert_sample_users():
    """샘플 사용자 데이터 삽입"""
    try:
        from .database import get_db
        from .models.user import User
        
        db = next(get_db())
        
        # 기존 데이터 확인
        existing_count = db.query(User).count()
        if existing_count > 0:
            return {"message": f"이미 {existing_count}명의 사용자가 있습니다."}
        
        # 샘플 사용자 데이터
        sample_users = [
            User(
                email="user1@example.com",
                full_name="김사용자",
                phone="010-1111-1111",
                is_active=True
            ),
            User(
                email="user2@example.com",
                full_name="이상담",
                phone="010-2222-2222",
                is_active=True
            )
        ]
        
        for user in sample_users:
            db.add(user)
        
        db.commit()
        
        return {
            "message": "샘플 사용자 데이터 삽입 완료",
            "inserted_count": len(sample_users)
        }
        
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/admin/stats")
async def get_admin_stats():
    """관리자 대시보드 통계 (공개)"""
    try:
        from .database import get_db
        from .models.counselor import Counselor
        from .models.consultation import Consultation
        from .models.review import Review
        from .models.notice import Notice
        
        db = next(get_db())
        
        stats = {
            "counselors": db.query(Counselor).count(),
            "consultations": db.query(Consultation).count(),
            "reviews": db.query(Review).count(),
            "notices": db.query(Notice).count()
        }
        
        return stats
        
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/admin/counselors")
async def get_admin_counselors():
    """관리자용 상담사 목록 (공개)"""
    try:
        from .database import get_db
        from .models.counselor import Counselor
        
        db = next(get_db())
        counselors = db.query(Counselor).all()
        
        return {
            "counselors": [
                {
                    "id": c.id,
                    "name": c.name,
                    "email": c.email,
                    "specialization": c.specialization,
                    "rating": c.rating,
                    "total_reviews": c.total_reviews,
                    "is_active": c.is_active,
                    "is_online": c.is_online
                } for c in counselors
            ],
            "total": len(counselors)
        }
        
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/admin/consultations")
async def get_admin_consultations():
    """관리자용 상담 신청 목록 (공개)"""
    try:
        from .database import get_db
        from .models.consultation import Consultation
        from .models.user import User
        from .models.counselor import Counselor
        
        db = next(get_db())
        consultations = db.query(Consultation).all()
        
        result = []
        for c in consultations:
            user = db.query(User).filter(User.id == c.user_id).first()
            counselor = db.query(Counselor).filter(Counselor.id == c.counselor_id).first()
            
            result.append({
                "id": c.id,
                "user_name": user.full_name if user else "알 수 없음",
                "user_phone": user.phone if user else None,
                "user_email": user.email if user else None,
                "counselor_name": counselor.name if counselor else "알 수 없음",
                "counselor_specialization": counselor.specialization if counselor else None,
                "counselor_phone": counselor.phone if counselor else None,
                "counselor_email": counselor.email if counselor else None,
                "consultation_date": str(c.consultation_date),
                "consultation_time": str(c.consultation_time),
                "consultation_type": c.consultation_type,
                "status": c.status,
                "notes": getattr(c, 'notes', None),  # 상담 요청사항 (모델에 있다면)
                "created_at": str(c.created_at)
            })
        
        return {
            "consultations": result,
            "total": len(result)
        }
        
    except Exception as e:
        return {"error": str(e)} 