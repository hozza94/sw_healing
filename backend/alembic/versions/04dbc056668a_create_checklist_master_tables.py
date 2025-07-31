"""create_checklist_master_tables

Revision ID: 04dbc056668a
Revises: a3b22ddda1cc
Create Date: 2025-07-31 05:10:15.123456

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '04dbc056668a'
down_revision: Union[str, None] = 'a3b22ddda1cc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. 체크리스트 마스터 테이블 생성
    op.create_table('checklist_masters',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=50), nullable=True),  # 스트레스, 우울증, 불안 등
        sa.Column('version', sa.String(length=10), nullable=True, default='1.0'),
        sa.Column('is_active', sa.Boolean(), nullable=True, default=True),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id')
    )
    
    # 2. 체크리스트 항목 테이블 생성
    op.create_table('checklist_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('master_id', sa.Integer(), nullable=False),
        sa.Column('question', sa.Text(), nullable=False),
        sa.Column('item_type', sa.String(length=20), nullable=True, default='checkbox'),  # checkbox, radio, text, scale
        sa.Column('options', sa.JSON(), nullable=True),  # 선택지 (radio 타입용)
        sa.Column('required', sa.Boolean(), nullable=True, default=False),
        sa.Column('order_index', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['master_id'], ['checklist_masters.id'], ondelete='CASCADE')
    )
    
    # checklist_items 인덱스
    op.create_index('idx_checklist_items_master_id', 'checklist_items', ['master_id'])
    op.create_index('idx_checklist_items_order', 'checklist_items', ['order_index'])
    
    # 3. 사용자 체크리스트 응답 테이블 생성
    op.create_table('user_checklist_responses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('consultation_id', sa.Integer(), nullable=False),
        sa.Column('master_id', sa.Integer(), nullable=False),
        sa.Column('item_id', sa.Integer(), nullable=False),
        sa.Column('response_value', sa.Text(), nullable=True),
        sa.Column('response_data', sa.JSON(), nullable=True),  # 복잡한 응답 데이터
        sa.Column('completed_at', sa.TIMESTAMP(), nullable=True, server_default=sa.text('CURRENT_TIMESTAMP')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['consultation_id'], ['consultation_requests.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['master_id'], ['checklist_masters.id']),
        sa.ForeignKeyConstraint(['item_id'], ['checklist_items.id'])
    )
    
    # user_checklist_responses 인덱스
    op.create_index('idx_user_checklist_responses_user_id', 'user_checklist_responses', ['user_id'])
    op.create_index('idx_user_checklist_responses_consultation_id', 'user_checklist_responses', ['consultation_id'])
    op.create_index('idx_user_checklist_responses_master_id', 'user_checklist_responses', ['master_id'])
    
    # 4. 기본 체크리스트 마스터 데이터 삽입
    op.execute("""
        INSERT INTO checklist_masters (name, description, category, version) VALUES
        ('스트레스 체크리스트', '일상적인 스트레스 수준을 측정하는 체크리스트', '스트레스', '1.0'),
        ('우울증 선별 검사', '우울증 증상을 선별하는 검사', '우울증', '1.0'),
        ('불안 장애 체크리스트', '불안 증상을 평가하는 체크리스트', '불안', '1.0'),
        ('수면 품질 체크리스트', '수면 패턴과 품질을 평가하는 체크리스트', '수면', '1.0'),
        ('대인관계 체크리스트', '대인관계 능력과 만족도를 평가하는 체크리스트', '대인관계', '1.0')
    """)
    
    # 5. 기본 체크리스트 항목 데이터 삽입 (스트레스 체크리스트 예시)
    op.execute("""
        INSERT INTO checklist_items (master_id, question, item_type, required, order_index) VALUES
        (1, '최근 한 달간 일상생활에서 스트레스를 느낀 적이 있나요?', 'radio', true, 1),
        (1, '스트레스로 인해 수면에 문제가 있었나요?', 'radio', true, 2),
        (1, '스트레스로 인해 식욕에 변화가 있었나요?', 'radio', true, 3),
        (1, '스트레스로 인해 집중력이 떨어졌나요?', 'radio', true, 4),
        (1, '스트레스로 인해 신체적 증상(두통, 소화불량 등)이 있었나요?', 'radio', true, 5),
        (1, '스트레스 해소를 위해 어떤 방법을 사용하시나요?', 'text', false, 6),
        (1, '현재 스트레스 수준을 1-10점으로 평가하면?', 'scale', true, 7)
    """)


def downgrade() -> None:
    # 사용자 체크리스트 응답 테이블 삭제
    op.drop_index('idx_user_checklist_responses_master_id', 'user_checklist_responses')
    op.drop_index('idx_user_checklist_responses_consultation_id', 'user_checklist_responses')
    op.drop_index('idx_user_checklist_responses_user_id', 'user_checklist_responses')
    op.drop_table('user_checklist_responses')
    
    # 체크리스트 항목 테이블 삭제
    op.drop_index('idx_checklist_items_order', 'checklist_items')
    op.drop_index('idx_checklist_items_master_id', 'checklist_items')
    op.drop_table('checklist_items')
    
    # 체크리스트 마스터 테이블 삭제
    op.drop_table('checklist_masters')
