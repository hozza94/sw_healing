from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models.review import Review
from ..models.user import User
from ..schemas.review import ReviewCreate, ReviewUpdate, Review as ReviewSchema, ReviewList
from ..dependencies import get_current_active_user, get_current_admin_user

router = APIRouter(prefix="/reviews", tags=["후기"])


@router.post("/", response_model=ReviewSchema)
def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """후기 작성"""
    # 별점 검증 (1-5)
    if not 1 <= review_data.rating <= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="별점은 1-5 사이의 값이어야 합니다."
        )
    
    db_review = Review(
        user_id=current_user.id,
        **review_data.dict()
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    return db_review


@router.get("/", response_model=ReviewList)
def get_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    counselor_id: Optional[int] = None,
    is_approved: Optional[bool] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """후기 목록 조회"""
    query = db.query(Review)
    
    if counselor_id:
        query = query.filter(Review.counselor_id == counselor_id)
    
    if is_approved is not None:
        query = query.filter(Review.is_approved == is_approved)
    
    if is_active is not None:
        query = query.filter(Review.is_active == is_active)
    
    total = query.count()
    reviews = query.offset(skip).limit(limit).all()
    
    return ReviewList(
        reviews=reviews,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/approved", response_model=ReviewList)
def get_approved_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    counselor_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """승인된 후기 목록 조회"""
    query = db.query(Review).filter(Review.is_approved == True, Review.is_active == True)
    
    if counselor_id:
        query = query.filter(Review.counselor_id == counselor_id)
    
    total = query.count()
    reviews = query.offset(skip).limit(limit).all()
    
    # 작성자와 상담사 정보 추가
    for review in reviews:
        # 작성자 정보 (익명 처리)
        if review.user and not review.is_anonymous:
            author_name = review.user.full_name
            if author_name:
                # 이름을 익명 처리 (예: "홍길동" -> "홍**")
                if len(author_name) >= 2:
                    review.author_name = author_name[0] + "**"
                else:
                    review.author_name = author_name + "**"
        else:
            review.author_name = "익명"
        
        # 상담사 정보
        if review.counselor:
            review.counselor_name = review.counselor.name
    
    return ReviewList(
        reviews=reviews,
        total=total,
        page=skip // limit + 1,
        size=limit
    )


@router.get("/{review_id}", response_model=ReviewSchema)
def get_review(
    review_id: int,
    db: Session = Depends(get_db)
):
    """후기 상세 조회 (승인된 후기만)"""
    review = db.query(Review).filter(
        Review.id == review_id,
        Review.is_approved == True,
        Review.is_active == True
    ).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="후기를 찾을 수 없습니다."
        )
    
    # 작성자와 상담사 정보 추가
    # 작성자 정보 (익명 처리)
    if review.user and not review.is_anonymous:
        author_name = review.user.full_name
        if author_name:
            # 이름을 익명 처리 (예: "홍길동" -> "홍**")
            if len(author_name) >= 2:
                review.author_name = author_name[0] + "**"
            else:
                review.author_name = author_name + "**"
    else:
        review.author_name = "익명"
    
    # 상담사 정보
    if review.counselor:
        review.counselor_name = review.counselor.name
    
    return review


@router.put("/{review_id}", response_model=ReviewSchema)
def update_review(
    review_id: int,
    review_update: ReviewUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """후기 수정"""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="후기를 찾을 수 없습니다."
        )
    
    # 본인의 후기이거나 관리자인 경우만 수정 가능
    if review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    # 일반 사용자는 승인 상태를 수정할 수 없음
    if not current_user.is_admin and review_update.is_approved is not None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="승인 상태는 관리자만 수정할 수 있습니다."
        )
    
    update_data = review_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(review, field, value)
    
    db.commit()
    db.refresh(review)
    
    return review


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """후기 삭제"""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="후기를 찾을 수 없습니다."
        )
    
    # 본인의 후기이거나 관리자인 경우만 삭제 가능
    if review.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    db.delete(review)
    db.commit()
    
    return {"message": "후기가 삭제되었습니다."} 