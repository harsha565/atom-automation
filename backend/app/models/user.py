from typing import List, Optional
from sqlalchemy import Enum, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.mixins import UUIDMixin, TimestampMixin
from app.core.enums import UserRole


class User(Base, UUIDMixin, TimestampMixin):
    """
    SQLAlchemy model representing the 'users' table.
    Contains profile, hashing credentials, and relationships to associated entities.
    """

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )
    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, name="user_role_enum", native_enum=True),
        default=UserRole.OWNER,
        nullable=False,
    )

    # Relationships (Bidirectional)
    refresh_tokens: Mapped[List["RefreshToken"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )
    gym: Mapped[Optional["Gym"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,  # Enforce one-to-one relationship
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    # Table arguments for indexes
    __table_args__ = (Index("users_email_idx", "email"),)
