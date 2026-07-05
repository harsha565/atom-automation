import uuid
from typing import List, Optional
from sqlalchemy import ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.mixins import UUIDMixin, TimestampMixin


class Gym(Base, UUIDMixin, TimestampMixin):
    """
    SQLAlchemy model representing the 'gyms' table.
    Defines gym profile information, linked to a single system user (Owner).
    """

    __tablename__ = "gyms"

    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    gym_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    owner_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    phone: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    # Relationships (Bidirectional)
    user: Mapped["User"] = relationship(
        back_populates="gym",
    )
    whatsapp_account: Mapped[Optional["WhatsAppAccount"]] = relationship(
        back_populates="gym",
        cascade="all, delete-orphan",
        uselist=False,  # Enforce one-to-one relationship
    )
    automation_config: Mapped[Optional["AutomationConfig"]] = relationship(
        back_populates="gym",
        cascade="all, delete-orphan",
        uselist=False,  # Enforce one-to-one relationship
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        back_populates="gym",
        cascade="all, delete-orphan",
    )

    # Table arguments for indexes
    __table_args__ = (Index("gyms_user_id_idx", "user_id"),)
