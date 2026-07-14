"""Add data deletion requests table
Revision ID: add_deletion_requests
Revises: 58db8b387431
Create Date: 2026-07-14
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'add_deletion_requests'
down_revision = '58db8b387431'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'data_deletion_requests',
        sa.Column('id', postgresql.UUID(as_uuid=True),
                  primary_key=True,
                  server_default=sa.text('gen_random_uuid()')),
        sa.Column('meta_user_id', sa.String(255),
                  nullable=True),
        sa.Column('confirmation_code', sa.String(255),
                  nullable=False, unique=True),
        sa.Column('status', sa.String(50),
                  nullable=False,
                  server_default='pending'),
        sa.Column('created_at',
                  sa.DateTime(timezone=True),
                  server_default=sa.func.now()),
        sa.Column('completed_at',
                  sa.DateTime(timezone=True),
                  nullable=True),
    )

def downgrade():
    op.drop_table('data_deletion_requests')
