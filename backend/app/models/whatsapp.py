import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, Enum, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin
from app.core.enums import WhatsAppStatus, TokenType, TokenSource


class WhatsAppAccount(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    SQLAlchemy model representing the 'whatsapp_accounts' table.
    Stores encrypted credentials, IDs, and statuses for gym WhatsApp integrations.
    Supports soft deletion.
    """

    __tablename__ = "whatsapp_accounts"

    gym_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("gyms.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    encrypted_waba_id: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    encrypted_phone_number_id: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    encrypted_business_account_id: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    encrypted_access_token: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )
    encrypted_pin: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    token_type: Mapped[TokenType] = mapped_column(
        Enum(TokenType, name="token_type_enum", native_enum=True),
        nullable=False,
    )
    token_source: Mapped[TokenSource] = mapped_column(
        Enum(TokenSource, name="token_source_enum", native_enum=True),
        nullable=False,
    )
    token_expires_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    phone_number: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    status: Mapped[WhatsAppStatus] = mapped_column(
        Enum(WhatsAppStatus, name="whatsapp_status_enum", native_enum=True),
        default=WhatsAppStatus.PENDING,
        nullable=False,
    )

    connected_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    last_checked_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # Relationships (Bidirectional)
    gym: Mapped["Gym"] = relationship(
        back_populates="whatsapp_account",
    )

    # Table arguments for indexes
    __table_args__ = (
        Index("whatsapp_accounts_gym_id_idx", "gym_id"),
        Index("whatsapp_accounts_status_idx", "status"),
    )
