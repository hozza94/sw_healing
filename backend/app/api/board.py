from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.board import Board
from app.models.comment import Comment
from app.models.like import Like
from app.schemas.board import BoardCreate, BoardUpdate, BoardResponse, BoardListResponse
from app.schemas.comment import CommentCreate, CommentResponse

router = APIRouter(prefix="/boards", tags=["boards"])

@router.post("/", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
def create_board(board: BoardCreate, db: Session = Depends(get_db)):
    """게시글 작성"""
    db_board = Board(**board.dict())
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

@router.get("/", response_model=List[BoardListResponse])
def get_boards(skip: int = 0, limit: int = 20, category: str = None, db: Session = Depends(get_db)):
    """게시글 목록 조회"""
    query = db.query(Board)
    if category:
        query = query.filter(Board.category == category)
    
    boards = query.order_by(Board.created_at.desc()).offset(skip).limit(limit).all()
    return boards

@router.get("/{board_id}", response_model=BoardResponse)
def get_board(board_id: int, db: Session = Depends(get_db)):
    """게시글 상세 조회"""
    board = db.query(Board).filter(Board.id == board_id).first()
    if board is None:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    
    # 조회수 증가
    board.view_count += 1
    db.commit()
    
    return board

@router.put("/{board_id}", response_model=BoardResponse)
def update_board(board_id: int, board: BoardUpdate, db: Session = Depends(get_db)):
    """게시글 수정"""
    db_board = db.query(Board).filter(Board.id == board_id).first()
    if db_board is None:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    
    update_data = board.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_board, field, value)
    
    db.commit()
    db.refresh(db_board)
    return db_board

@router.delete("/{board_id}")
def delete_board(board_id: int, db: Session = Depends(get_db)):
    """게시글 삭제"""
    board = db.query(Board).filter(Board.id == board_id).first()
    if board is None:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    
    db.delete(board)
    db.commit()
    return {"message": "게시글이 삭제되었습니다"}

# 댓글 관련 API
@router.post("/{board_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(board_id: int, comment: CommentCreate, db: Session = Depends(get_db)):
    """댓글 작성"""
    # 게시글 존재 확인
    board = db.query(Board).filter(Board.id == board_id).first()
    if board is None:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    
    db_comment = Comment(**comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/{board_id}/comments", response_model=List[CommentResponse])
def get_comments(board_id: int, db: Session = Depends(get_db)):
    """게시글의 댓글 목록 조회"""
    comments = db.query(Comment).filter(Comment.board_id == board_id).order_by(Comment.created_at.asc()).all()
    return comments

# 좋아요 관련 API
@router.post("/{board_id}/like")
def like_board(board_id: int, request: Request, db: Session = Depends(get_db)):
    """게시글 좋아요"""
    # 게시글 존재 확인
    board = db.query(Board).filter(Board.id == board_id).first()
    if board is None:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다")
    
    # IP 주소 가져오기
    client_ip = request.client.host
    
    # 이미 좋아요를 눌렀는지 확인
    existing_like = db.query(Like).filter(
        Like.board_id == board_id,
        Like.ip_address == client_ip
    ).first()
    
    if existing_like:
        raise HTTPException(status_code=400, detail="이미 좋아요를 눌렀습니다")
    
    # 좋아요 추가
    new_like = Like(board_id=board_id, ip_address=client_ip)
    db.add(new_like)
    
    # 게시글의 좋아요 수 증가
    board.like_count += 1
    
    db.commit()
    return {"message": "좋아요가 추가되었습니다"}

@router.delete("/{board_id}/like")
def unlike_board(board_id: int, request: Request, db: Session = Depends(get_db)):
    """게시글 좋아요 취소"""
    client_ip = request.client.host
    
    # 좋아요 찾기
    like = db.query(Like).filter(
        Like.board_id == board_id,
        Like.ip_address == client_ip
    ).first()
    
    if not like:
        raise HTTPException(status_code=404, detail="좋아요를 찾을 수 없습니다")
    
    # 게시글의 좋아요 수 감소
    board = db.query(Board).filter(Board.id == board_id).first()
    if board:
        board.like_count -= 1
    
    # 좋아요 삭제
    db.delete(like)
    db.commit()
    
    return {"message": "좋아요가 취소되었습니다"} 