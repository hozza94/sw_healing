from sqlalchemy import Column, Integer, DateTime, ForeignKey, func, UniqueConstraint, String
from app.core.database import Base

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # 로그인하지 않은 사용자도 좋아요 가능
    ip_address = Column(String(45), nullable=False)  # IP 주소로 중복 방지
    created_at = Column(DateTime, default=func.now())

    # 한 사용자가 한 게시글에 한 번만 좋아요 가능
    __table_args__ = (UniqueConstraint('board_id', 'ip_address', name='unique_board_ip'),) 