"""create_healing_tables

Revision ID: a3b22ddda1cc
Revises: 2430f8b58f85
Create Date: 2025-07-31 05:07:03.080291

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a3b22ddda1cc'
down_revision: Union[str, None] = '2430f8b58f85'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. consultation_sessions 테이블 생성
    op.create_table('consultation_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('consultation_id', sa.Integer(), nullable=False),
        sa.Column('session_number', sa.Integer(), nullable=False),
        sa.Column('session_date', sa.Date(), nullable=True),
        sa.Column('session_time', sa.Time(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=True, default=60),
        sa.Column('counselor_id', sa.Integer(), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True, default='scheduled'),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['consultation_id'], ['consultation_requests.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['counselor_id'], ['users.id'])
    )
    
    # consultation_sessions 인덱스
    op.create_index('idx_consultation_sessions_consultation_id', 'consultation_sessions', ['consultation_id'])
    op.create_index('idx_consultation_sessions_date', 'consultation_sessions', ['session_date'])
    
    # 2. healing_progress 테이블 생성
    op.create_table('healing_progress',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('consultation_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('current_step', sa.Integer(), nullable=True, default=1),
        sa.Column('completed_steps', sa.Integer(), nullable=True, default=0),
        sa.Column('total_sessions', sa.Integer(), nullable=True, default=12),
        sa.Column('progress_percentage', sa.DECIMAL(precision=5, scale=2), nullable=True, default=0.00),
        sa.Column('last_session_date', sa.Date(), nullable=True),
        sa.Column('next_session_date', sa.Date(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True, default='in_progress'),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['consultation_id'], ['consultation_requests.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE')
    )
    
    # healing_progress 인덱스
    op.create_index('idx_healing_progress_consultation_id', 'healing_progress', ['consultation_id'])
    op.create_index('idx_healing_progress_user_id', 'healing_progress', ['user_id'])
    
    # 3. 12단계 상담 데이터 테이블들 생성
    # 1단계
    op.create_table('healing_sangdam_1st',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('consultation_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.Integer(), nullable=True),
        sa.Column('current_situation', sa.Text(), nullable=True),
        sa.Column('main_concern', sa.Text(), nullable=True),
        sa.Column('stress_level', sa.Integer(), nullable=True),
        sa.Column('question_1', sa.Text(), nullable=True),
        sa.Column('answer_1', sa.Text(), nullable=True),
        sa.Column('question_2', sa.Text(), nullable=True),
        sa.Column('answer_2', sa.Text(), nullable=True),
        sa.Column('question_3', sa.Text(), nullable=True),
        sa.Column('answer_3', sa.Text(), nullable=True),
        sa.Column('question_4', sa.Text(), nullable=True),
        sa.Column('answer_4', sa.Text(), nullable=True),
        sa.Column('question_5', sa.Text(), nullable=True),
        sa.Column('answer_5', sa.Text(), nullable=True),
        sa.Column('additional_notes', sa.Text(), nullable=True),
        sa.Column('counselor_feedback', sa.Text(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['consultation_id'], ['consultation_requests.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['session_id'], ['consultation_sessions.id']),
        sa.CheckConstraint('stress_level >= 1 AND stress_level <= 10')
    )
    
    # 2단계
    op.create_table('healing_sangdam_2nd',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('consultation_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.Integer(), nullable=True),
        sa.Column('emotional_state', sa.Text(), nullable=True),
        sa.Column('coping_mechanisms', sa.Text(), nullable=True),
        sa.Column('question_1', sa.Text(), nullable=True),
        sa.Column('answer_1', sa.Text(), nullable=True),
        sa.Column('question_2', sa.Text(), nullable=True),
        sa.Column('answer_2', sa.Text(), nullable=True),
        sa.Column('question_3', sa.Text(), nullable=True),
        sa.Column('answer_3', sa.Text(), nullable=True),
        sa.Column('question_4', sa.Text(), nullable=True),
        sa.Column('answer_4', sa.Text(), nullable=True),
        sa.Column('question_5', sa.Text(), nullable=True),
        sa.Column('answer_5', sa.Text(), nullable=True),
        sa.Column('additional_notes', sa.Text(), nullable=True),
        sa.Column('counselor_feedback', sa.Text(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['consultation_id'], ['consultation_requests.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['session_id'], ['consultation_sessions.id'])
    )
    
    # 3-12단계 (동일한 구조로 생성)
    for step in range(3, 13):
        table_name = f'healing_sangdam_{step}th'
        op.create_table(table_name,
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('consultation_id', sa.Integer(), nullable=False),
            sa.Column('user_id', sa.Integer(), nullable=False),
            sa.Column('session_id', sa.Integer(), nullable=True),
            sa.Column('question_1', sa.Text(), nullable=True),
            sa.Column('answer_1', sa.Text(), nullable=True),
            sa.Column('question_2', sa.Text(), nullable=True),
            sa.Column('answer_2', sa.Text(), nullable=True),
            sa.Column('question_3', sa.Text(), nullable=True),
            sa.Column('answer_3', sa.Text(), nullable=True),
            sa.Column('question_4', sa.Text(), nullable=True),
            sa.Column('answer_4', sa.Text(), nullable=True),
            sa.Column('question_5', sa.Text(), nullable=True),
            sa.Column('answer_5', sa.Text(), nullable=True),
            sa.Column('additional_notes', sa.Text(), nullable=True),
            sa.Column('counselor_feedback', sa.Text(), nullable=True),
            sa.Column('created_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
            sa.Column('updated_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
            sa.PrimaryKeyConstraint('id'),
            sa.ForeignKeyConstraint(['consultation_id'], ['consultation_requests.id'], ondelete='CASCADE'),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
            sa.ForeignKeyConstraint(['session_id'], ['consultation_sessions.id'])
        )


def downgrade() -> None:
    # 3-12단계 테이블 삭제 (역순)
    for step in range(12, 2, -1):
        table_name = f'healing_sangdam_{step}th'
        op.drop_table(table_name)
    
    # 2단계 테이블 삭제
    op.drop_table('healing_sangdam_2nd')
    
    # 1단계 테이블 삭제
    op.drop_table('healing_sangdam_1st')
    
    # healing_progress 테이블 삭제
    op.drop_index('idx_healing_progress_user_id', 'healing_progress')
    op.drop_index('idx_healing_progress_consultation_id', 'healing_progress')
    op.drop_table('healing_progress')
    
    # consultation_sessions 테이블 삭제
    op.drop_index('idx_consultation_sessions_date', 'consultation_sessions')
    op.drop_index('idx_consultation_sessions_consultation_id', 'consultation_sessions')
    op.drop_table('consultation_sessions')
