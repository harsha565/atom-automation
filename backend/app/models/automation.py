import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.mixins import UUIDMixin, TimestampMixin
from app.core.enums import AutomationStatus


class AutomationConfig(Base, UUIDMixin, TimestampMixin):
    """
    SQLAlchemy model representing the 'automation_configs' table.
    Stores gym automation workflow configuration and active status.
    """

    __tablename__ = "automation_configs"

    gym_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("gyms.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    membership_reminder_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    rag_bot_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    n8n_workflow_id: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    last_activation_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
    last_activation_status: Mapped[Optional[AutomationStatus]] = mapped_column(
        Enum(AutomationStatus, name="automation_status_enum", native_enum=True),
        nullable=True,
    )

    # Relationships (Bidirectional)
    gym: Mapped["Gym"] = relationship(
        back_populates="automation_config",
    )
