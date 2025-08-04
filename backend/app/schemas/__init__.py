# 기본 스키마
from app.schemas.base import BaseSchema, BaseResponse

# 사용자 스키마
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserResponse,
    Token,
    TokenData,
    UserListResponse
)

# 상담 스키마
from app.schemas.consultation import (
    ConsultationRequestCreate,
    ConsultationRequestUpdate,
    ConsultationRequestResponse,
    ConsultationSessionCreate,
    ConsultationSessionUpdate,
    ConsultationSessionResponse,
    ConsultationListResponse,
    ConsultationStats
)

# 힐링 스키마
from app.schemas.healing import (
    HealingProgressCreate,
    HealingProgressUpdate,
    HealingProgressResponse,
    HealingSangdam1stCreate,
    HealingSangdam1stUpdate,
    HealingSangdam1stResponse,
    HealingSangdam2ndCreate,
    HealingSangdam2ndUpdate,
    HealingSangdam2ndResponse,
    HealingSangdam3rdCreate,
    HealingSangdam3rdUpdate,
    HealingSangdam3rdResponse
)

# 체크리스트 스키마
from app.schemas.checklist import (
    ChecklistMasterCreate,
    ChecklistMasterUpdate,
    ChecklistMasterResponse,
    ChecklistItemCreate,
    ChecklistItemUpdate,
    ChecklistItemResponse,
    UserChecklistResponseCreate,
    UserChecklistResponseUpdate,
    UserChecklistResponseResponse,
    ChecklistCompletionCreate,
    ChecklistCompletionResponse,
    ChecklistListResponse,
    ChecklistStats
)

# 리뷰 스키마
from app.schemas.review import (
    ReviewCreate,
    ReviewUpdate,
    ReviewResponse,
    ReviewLikeCreate,
    ReviewLikeResponse,
    ReviewListResponse,
    ReviewStats,
    ReviewFilter
)

# 공지사항 스키마
from app.schemas.notice import (
    NoticeCreate,
    NoticeUpdate,
    NoticeResponse
)

# 게시판 스키마
from app.schemas.board import (
    BoardCreate,
    BoardUpdate,
    BoardResponse,
    BoardListResponse
)

# 댓글 스키마
from app.schemas.comment import (
    CommentCreate,
    CommentUpdate,
    CommentResponse
)

# 모든 스키마를 한 곳에서 import할 수 있도록 설정
__all__ = [
    "BaseSchema",
    "BaseResponse",
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "UserResponse",
    "Token",
    "TokenData",
    "UserListResponse",
    "ConsultationRequestCreate",
    "ConsultationRequestUpdate",
    "ConsultationRequestResponse",
    "ConsultationSessionCreate",
    "ConsultationSessionUpdate",
    "ConsultationSessionResponse",
    "ConsultationListResponse",
    "ConsultationStats",
    "HealingProgressCreate",
    "HealingProgressUpdate",
    "HealingProgressResponse",
    "HealingSangdam1stCreate",
    "HealingSangdam1stUpdate",
    "HealingSangdam1stResponse",
    "HealingSangdam2ndCreate",
    "HealingSangdam2ndUpdate",
    "HealingSangdam2ndResponse",
    "HealingSangdam3rdCreate",
    "HealingSangdam3rdUpdate",
    "HealingSangdam3rdResponse",
    "ChecklistMasterCreate",
    "ChecklistMasterUpdate",
    "ChecklistMasterResponse",
    "ChecklistItemCreate",
    "ChecklistItemUpdate",
    "ChecklistItemResponse",
    "UserChecklistResponseCreate",
    "UserChecklistResponseUpdate",
    "UserChecklistResponseResponse",
    "ChecklistCompletionCreate",
    "ChecklistCompletionResponse",
    "ChecklistListResponse",
    "ChecklistStats",
    "ReviewCreate",
    "ReviewUpdate",
    "ReviewResponse",
    "ReviewLikeCreate",
    "ReviewLikeResponse",
    "ReviewListResponse",
    "ReviewStats",
    "ReviewFilter",
    "NoticeCreate",
    "NoticeUpdate",
    "NoticeResponse",
    "BoardCreate",
    "BoardUpdate",
    "BoardResponse",
    "BoardListResponse",
    "CommentCreate",
    "CommentUpdate",
    "CommentResponse"
] 