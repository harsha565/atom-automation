"""initial schema

Revision ID: 58db8b387431
Revises: 
Create Date: 2026-06-16 22:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '58db8b387431'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
        # -------------------------------------------------------------------------
        # 1. Create native PostgreSQL ENUM types
        # -------------------------------------------------------------------------
    user_role_enum = postgresql.ENUM(
        'OWNER',
        'STAFF',
        'ADMIN',
        name='user_role_enum'
    )

    whatsapp_status_enum = postgresql.ENUM(
        'CONNECTED',
        'DISCONNECTED',
        'PENDING',
        name='whatsapp_status_enum'
    )

    token_type_enum = postgresql.ENUM(
        'USER_TOKEN',
        'SYSTEM_USER_TOKEN',
        name='token_type_enum'
    )

    token_source_enum = postgresql.ENUM(
        'EMBEDDED_SIGNUP',
        'MANUAL',
        name='token_source_enum'
    )

    automation_status_enum = postgresql.ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED',
        name='automation_status_enum'
    )

    audit_action_enum = postgresql.ENUM(
        'USER_REGISTERED',
        'USER_LOGIN',
        'USER_LOGOUT',
        'GYM_UPDATED',
        'WHATSAPP_CONNECTED',
        'WHATSAPP_DISCONNECTED',
        'AUTOMATION_ENABLED',
        'AUTOMATION_DISABLED',
        name='audit_action_enum'
    )

        # -------------------------------------------------------------------------
        # 2. Create tables
        # -------------------------------------------------------------------------
        
        # --- Users Table ---
    op.create_table(
            'users',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('email', sa.String(length=255), nullable=False),
            sa.Column('password_hash', sa.String(length=255), nullable=False),
            sa.Column('role', user_role_enum, nullable=False, server_default='OWNER'),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.PrimaryKeyConstraint('id', name=op.f('pk_users')),
            sa.UniqueConstraint('email', name=op.f('uq_users_email'))
        )
    op.create_index('users_email_idx', 'users', ['email'], unique=False)

        # --- Refresh Tokens Table ---
    op.create_table(
            'refresh_tokens',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('user_id', sa.UUID(), nullable=False),
            sa.Column('token_hash', sa.String(length=255), nullable=False),
            sa.Column('expires_at', sa.DateTime(timezone=True), nullable=False),
            sa.Column('revoked', sa.Boolean(), nullable=False, server_default='false'),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_refresh_tokens_user_id_users'), ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id', name=op.f('pk_refresh_tokens'))
        )
    op.create_index('refresh_tokens_token_hash_idx', 'refresh_tokens', ['token_hash'], unique=False)
    op.create_index('refresh_tokens_user_id_idx', 'refresh_tokens', ['user_id'], unique=False)

        # --- Gyms Table ---
    op.create_table(
            'gyms',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('user_id', sa.UUID(), nullable=False),
            sa.Column('gym_name', sa.String(length=255), nullable=False),
            sa.Column('owner_name', sa.String(length=255), nullable=False),
            sa.Column('phone', sa.String(length=50), nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_gyms_user_id_users'), ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id', name=op.f('pk_gyms')),
            sa.UniqueConstraint('user_id', name=op.f('uq_gyms_user_id'))
        )
    op.create_index('gyms_user_id_idx', 'gyms', ['user_id'], unique=False)

        # --- WhatsApp Accounts Table ---
    op.create_table(
            'whatsapp_accounts',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('gym_id', sa.UUID(), nullable=False),
            sa.Column('encrypted_waba_id', sa.Text(), nullable=False),
            sa.Column('encrypted_phone_number_id', sa.Text(), nullable=False),
            sa.Column('encrypted_business_account_id', sa.Text(), nullable=False),
            sa.Column('encrypted_access_token', sa.Text(), nullable=False),
            sa.Column('token_type', token_type_enum, nullable=False),
            sa.Column('token_source', token_source_enum, nullable=False),
            sa.Column('token_expires_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('phone_number', sa.String(length=50), nullable=False),
            sa.Column('status', whatsapp_status_enum, nullable=False, server_default='PENDING'),
            sa.Column('connected_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('last_checked_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.ForeignKeyConstraint(['gym_id'], ['gyms.id'], name=op.f('fk_whatsapp_accounts_gym_id_gyms'), ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id', name=op.f('pk_whatsapp_accounts')),
            sa.UniqueConstraint('gym_id', name=op.f('uq_whatsapp_accounts_gym_id'))
        )
    op.create_index('whatsapp_accounts_gym_id_idx', 'whatsapp_accounts', ['gym_id'], unique=False)
    op.create_index('whatsapp_accounts_status_idx', 'whatsapp_accounts', ['status'], unique=False)

        # --- Automation Configs Table ---
    op.create_table(
            'automation_configs',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('gym_id', sa.UUID(), nullable=False),
            sa.Column('membership_reminder_enabled', sa.Boolean(), nullable=False, server_default='false'),
            sa.Column('rag_bot_enabled', sa.Boolean(), nullable=False, server_default='false'),
            sa.Column('n8n_workflow_id', sa.String(length=255), nullable=True),
            sa.Column('last_activation_at', sa.DateTime(timezone=True), nullable=True),
            sa.Column('last_activation_status', automation_status_enum, nullable=True),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.ForeignKeyConstraint(['gym_id'], ['gyms.id'], name=op.f('fk_automation_configs_gym_id_gyms'), ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id', name=op.f('pk_automation_configs')),
            sa.UniqueConstraint('gym_id', name=op.f('uq_automation_configs_gym_id'))
        )

        # --- Audit Logs Table ---
    op.create_table(
            'audit_logs',
            sa.Column('id', sa.UUID(), nullable=False),
            sa.Column('user_id', sa.UUID(), nullable=False),
            sa.Column('gym_id', sa.UUID(), nullable=True),
            sa.Column('action', audit_action_enum, nullable=False),
            sa.Column('metadata', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=False),
            sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
            sa.ForeignKeyConstraint(['gym_id'], ['gyms.id'], name=op.f('fk_audit_logs_gym_id_gyms'), ondelete='SET NULL'),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_audit_logs_user_id_users'), ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id', name=op.f('pk_audit_logs'))
        )
    op.create_index('audit_logs_created_at_idx', 'audit_logs', ['created_at'], unique=False)
    op.create_index('audit_logs_gym_id_idx', 'audit_logs', ['gym_id'], unique=False)
    op.create_index('audit_logs_user_id_idx', 'audit_logs', ['user_id'], unique=False)


    def downgrade() -> None:
        # Drop tables in reverse order of creation to avoid foreign key dependency issues
        op.drop_table('audit_logs')
        op.drop_table('automation_configs')
        op.drop_table('whatsapp_accounts')
        op.drop_table('gyms')
        op.drop_table('refresh_tokens')
        op.drop_table('users')

        # Drop native PostgreSQL ENUM types
        op.execute('DROP TYPE audit_action_enum')
        op.execute('DROP TYPE automation_status_enum')
        op.execute('DROP TYPE token_source_enum')
        op.execute('DROP TYPE token_type_enum')
        op.execute('DROP TYPE whatsapp_status_enum')
        op.execute('DROP TYPE user_role_enum')
