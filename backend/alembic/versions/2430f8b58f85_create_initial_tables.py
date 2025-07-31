"""create_initial_tables

Revision ID: 2430f8b58f85
Revises: 
Create Date: 2025-07-31 05:03:58.928344

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2430f8b58f85'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users 테이블 생성
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('birth_date', sa.Date(), nullable=True),
        sa.Column('gender', sa.String(length=10), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('emergency_contact', sa.String(length=100), nullable=True),
        sa.Column('emergency_phone', sa.String(length=20), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('is_admin', sa.Boolean(), nullable=True, default=False),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    
    # users 테이블 인덱스
    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_users_phone', 'users', ['phone'])
    
    # 2. consultation_requests 테이블 생성
    op.create_table('consultation_requests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('consultation_type', sa.String(length=50), nullable=False),
        sa.Column('preferred_date', sa.Date(), nullable=True),
        sa.Column('preferred_time', sa.String(length=20), nullable=True),
        sa.Column('reason', sa.Text(), nullable=True),
        sa.Column('urgency_level', sa.Integer(), nullable=True, default=1),
        sa.Column('status', sa.String(length=20), nullable=True, default='pending'),
        sa.Column('assigned_counselor_id', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['assigned_counselor_id'], ['users.id'])
    )
    
    # consultation_requests 테이블 인덱스
    op.create_index('idx_consultation_requests_user_id', 'consultation_requests', ['user_id'])
    op.create_index('idx_consultation_requests_status', 'consultation_requests', ['status'])
    op.create_index('idx_consultation_requests_date', 'consultation_requests', ['preferred_date'])
    
    # 3. reviews 테이블 생성
    op.create_table('reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('consultation_id', sa.Integer(), nullable=True),
        sa.Column('title', sa.String(length=200), nullable=True),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=True),
        sa.Column('counselor_rating', sa.Integer(), nullable=True),
        sa.Column('overall_satisfaction', sa.Integer(), nullable=True),
        sa.Column('is_anonymous', sa.Boolean(), nullable=True, default=False),
        sa.Column('is_approved', sa.Boolean(), nullable=True, default=False),
        sa.Column('view_count', sa.Integer(), nullable=True, default=0),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['consultation_id'], ['consultation_requests.id'], ondelete='CASCADE'),
        sa.CheckConstraint('rating >= 1 AND rating <= 5'),
        sa.CheckConstraint('counselor_rating >= 1 AND counselor_rating <= 5'),
        sa.CheckConstraint('overall_satisfaction >= 1 AND overall_satisfaction <= 5')
    )
    
    # reviews 테이블 인덱스
    op.create_index('idx_reviews_user_id', 'reviews', ['user_id'])
    op.create_index('idx_reviews_consultation_id', 'reviews', ['consultation_id'])
    op.create_index('idx_reviews_rating', 'reviews', ['rating'])
    op.create_index('idx_reviews_created_at', 'reviews', ['created_at'])


def downgrade() -> None:
    # 테이블 삭제 (역순)
    op.drop_index('idx_reviews_created_at', 'reviews')
    op.drop_index('idx_reviews_rating', 'reviews')
    op.drop_index('idx_reviews_consultation_id', 'reviews')
    op.drop_index('idx_reviews_user_id', 'reviews')
    op.drop_table('reviews')
    
    op.drop_index('idx_consultation_requests_date', 'consultation_requests')
    op.drop_index('idx_consultation_requests_status', 'consultation_requests')
    op.drop_index('idx_consultation_requests_user_id', 'consultation_requests')
    op.drop_table('consultation_requests')
    
    op.drop_index('idx_users_phone', 'users')
    op.drop_index('idx_users_email', 'users')
    op.drop_table('users')
