from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.auth import get_current_user
from app.models import Review, ReviewLike, User
from app.schemas import (
    ReviewCreate,
    ReviewUpdate,
    ReviewResponse,
    ReviewLikeCreate,
    ReviewLikeResponse,
    ReviewListResponse,
    ReviewStats,
    ReviewFilter
)

router = APIRouter(prefix="/reviews", tags=["리뷰"])

@router.post("/", response_model=ReviewResponse)
async def create_review(
    review: ReviewCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """리뷰 작성"""
    # 사용자 확인
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다."
        )
    
    db_review = Review(
        user_id=current_user["user_id"],
        **review.dict(exclude={"user_id"})
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.get("/", response_model=ReviewListResponse)
async def get_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = Query(None),
    rating: Optional[int] = Query(None, ge=1, le=5),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: Session = Depends(get_db)
):
    """리뷰 목록 조회"""
    query = db.query(Review).filter(Review.is_approved == True)
    
    # 필터링
    if category:
        query = query.filter(Review.category == category)
    if rating:
        query = query.filter(Review.rating == rating)
    
    # 정렬
    if sort_by == "rating":
        if sort_order == "desc":
            query = query.order_by(Review.rating.desc())
        else:
            query = query.order_by(Review.rating.asc())
    else:  # created_at
        if sort_order == "desc":
            query = query.order_by(Review.created_at.desc())
        else:
            query = query.order_by(Review.created_at.asc())
    
    total = query.count()
    reviews = query.offset(skip).limit(limit).all()
    
    # 평균 평점 계산
    total_ratings = db.query(Review).filter(Review.is_approved == True).count()
    if total_ratings > 0:
        avg_rating = db.query(Review.rating).filter(Review.is_approved == True).all()
        average_rating = sum([r[0] for r in avg_rating]) / total_ratings
    else:
        average_rating = 0.0
    
    return {
        "reviews": reviews,
        "total": total,
        "page": skip // limit + 1,
        "size": limit,
        "average_rating": round(average_rating, 1),
        "total_ratings": total_ratings
    }

@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(
    review_id: int,
    db: Session = Depends(get_db)
):
    """리뷰 상세 조회"""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="리뷰를 찾을 수 없습니다."
        )
    
    return review

@router.put("/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: int,
    review_update: ReviewUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """리뷰 수정"""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="리뷰를 찾을 수 없습니다."
        )
    
    # 본인 리뷰만 수정 가능
    if review.user_id != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="본인의 리뷰만 수정할 수 있습니다."
        )
    
    # 업데이트
    for field, value in review_update.dict(exclude_unset=True).items():
        setattr(review, field, value)
    
    db.commit()
    db.refresh(review)
    return review

@router.delete("/{review_id}")
async def delete_review(
    review_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """리뷰 삭제"""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="리뷰를 찾을 수 없습니다."
        )
    
    # 본인 리뷰만 삭제 가능
    if review.user_id != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="본인의 리뷰만 삭제할 수 있습니다."
        )
    
    db.delete(review)
    db.commit()
    
    return {"message": "리뷰가 삭제되었습니다."}

@router.post("/{review_id}/like", response_model=ReviewLikeResponse)
async def like_review(
    review_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """리뷰 좋아요"""
    # 리뷰 확인
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="리뷰를 찾을 수 없습니다."
        )
    
    # 이미 좋아요 했는지 확인
    existing_like = db.query(ReviewLike).filter(
        ReviewLike.review_id == review_id,
        ReviewLike.user_id == current_user["user_id"]
    ).first()
    
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 좋아요를 눌렀습니다."
        )
    
    # 좋아요 생성
    like = ReviewLike(
        review_id=review_id,
        user_id=current_user["user_id"]
    )
    
    db.add(like)
    db.commit()
    db.refresh(like)
    return like

@router.delete("/{review_id}/like")
async def unlike_review(
    review_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """리뷰 좋아요 취소"""
    like = db.query(ReviewLike).filter(
        ReviewLike.review_id == review_id,
        ReviewLike.user_id == current_user["user_id"]
    ).first()
    
    if not like:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="좋아요를 찾을 수 없습니다."
        )
    
    db.delete(like)
    db.commit()
    
    return {"message": "좋아요가 취소되었습니다."}

@router.get("/stats/overview", response_model=ReviewStats)
async def get_review_stats(db: Session = Depends(get_db)):
    """리뷰 통계 조회"""
    total_reviews = db.query(Review).count()
    approved_reviews = db.query(Review).filter(Review.is_approved == True).count()
    pending_reviews = db.query(Review).filter(Review.is_approved == False).count()
    total_likes = db.query(ReviewLike).count()
    
    # 평균 평점
    if total_reviews > 0:
        avg_rating = db.query(Review.rating).all()
        average_rating = sum([r[0] for r in avg_rating]) / total_reviews
    else:
        average_rating = 0.0
    
    # 평점 분포
    rating_distribution = {}
    for i in range(1, 6):
        count = db.query(Review).filter(Review.rating == i).count()
        rating_distribution[str(i)] = count
    
    return {
        "total_reviews": total_reviews,
        "average_rating": round(average_rating, 1),
        "rating_distribution": rating_distribution,
        "approved_reviews": approved_reviews,
        "pending_reviews": pending_reviews,
        "total_likes": total_likes
    } 