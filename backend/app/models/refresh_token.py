import uuid
from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.mixins import UUIDMixin, TimestampMixin


class RefreshToken(Base, UUIDMixin, TimestampMixin):
    """
    SQLAlchemy model representing the 'refresh_tokens' table.
    Tracks active user sessions and refresh token states.
    """

    __tablename__ = "refresh_tokens"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    token_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    revoked: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    # Relationships (Bidirectional)
    user: Mapped["User"] = relationship(
        back_populates="refresh_tokens",
    )

    # Table arguments for indexes
    __table_args__ = (
        Index("refresh_tokens_user_id_idx", "user_id"),
        Index("refresh_tokens_token_hash_idx", "token_hash"),
    )
