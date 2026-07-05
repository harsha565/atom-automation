import uuid
from typing import Any, Dict
from sqlalchemy import Enum, ForeignKey, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.mixins import UUIDMixin, TimestampMixin
from app.core.enums import AuditAction


class AuditLog(Base, UUIDMixin, TimestampMixin):
    """
    SQLAlchemy model representing the 'audit_logs' table.
    Records system, configuration, and integration events.
    """

    __tablename__ = "audit_logs"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    # Some audit logs (like user sign-up) can exist before a gym is set up
    gym_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("gyms.id", ondelete="SET NULL"),
        nullable=True,
    )

    action: Mapped[AuditAction] = mapped_column(
        Enum(AuditAction, name="audit_action_enum", native_enum=True),
        nullable=False,
    )

    # Map Python 'log_metadata' to database column 'metadata' to avoid conflict with Base.metadata
    log_metadata: Mapped[Dict[str, Any]] = mapped_column(
        "metadata",
        JSONB,
        default=dict,
        server_default="{}",
        nullable=False,
    )

    # Relationships (Bidirectional)
    user: Mapped["User"] = relationship(
        back_populates="audit_logs",
    )
    gym: Mapped["Gym"] = relationship(
        back_populates="audit_logs",
    )

    # Table arguments for indexes
    __table_args__ = (
        Index("audit_logs_user_id_idx", "user_id"),
        Index("audit_logs_gym_id_idx", "gym_id"),
        Index("audit_logs_created_at_idx", "created_at"),
    )
