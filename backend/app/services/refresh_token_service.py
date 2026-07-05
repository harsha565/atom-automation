import hashlib
import hmac
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.exceptions import AuthenticationException
from app.core.error_codes import ErrorCode
from app.models.refresh_token import RefreshToken


class RefreshTokenService:
    @staticmethod
    def _hash_token(raw_token: str) -> str:
        """
        Hashes a raw token string using SHA-256.
        """
        return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

    @classmethod
    async def create_refresh_token(
        cls, db: AsyncSession, user_id: uuid.UUID
    ) -> str:
        """
        Generates a secure raw refresh token, stores its hash in the database,
        and returns the raw token.
        """
        # Generate cryptographically secure random url-safe token
        raw_token = secrets.token_urlsafe(32)
        await cls.store_refresh_token(db, user_id, raw_token)
        return raw_token

    @classmethod
    async def store_refresh_token(
        cls, db: AsyncSession, user_id: uuid.UUID, raw_token: str
    ) -> None:
        """
        Hashes a raw refresh token and persists it in the database.
        """
        token_hash = cls._hash_token(raw_token)
        expires_at = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

        db_token = RefreshToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
            revoked=False,
        )

        db.add(db_token)
        await db.flush()  # Push to database transactions (committed by outer AuthService block)

    @classmethod
    async def validate_refresh_token(
        cls, db: AsyncSession, raw_token: str
    ) -> RefreshToken:
        """
        Hashes a raw refresh token, compares it securely, and validates its status.
        Raises AuthenticationException if invalid, revoked, or expired.
        """
        token_hash = cls._hash_token(raw_token)

        # Query database for the token hash
        stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        result = await db.execute(stmt)
        db_token = result.scalar_one_or_none()

        if not db_token:
            raise AuthenticationException(
                message="Invalid refresh token", code=ErrorCode.INVALID_TOKEN
            )

        # Constant-time comparison check to defend against timing attacks
        if not hmac.compare_digest(db_token.token_hash, token_hash):
            raise AuthenticationException(
                message="Invalid refresh token", code=ErrorCode.INVALID_TOKEN
            )

        if db_token.revoked:
            raise AuthenticationException(
                message="Refresh token has been revoked",
                code=ErrorCode.INVALID_TOKEN,
            )

        # Check token expiration
        # Ensure db_token.expires_at is timezone-aware
        expires_at = db_token.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)

        if expires_at < datetime.now(timezone.utc):
            raise AuthenticationException(
                message="Refresh token has expired",
                code=ErrorCode.TOKEN_EXPIRED,
            )

        return db_token

    @classmethod
    async def revoke_refresh_token(cls, db: AsyncSession, raw_token: str) -> None:
        """
        Locates a refresh token by hashing it and marks it as revoked.
        """
        token_hash = cls._hash_token(raw_token)

        stmt = select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        result = await db.execute(stmt)
        db_token = result.scalar_one_or_none()

        if db_token:
            db_token.revoked = True
            db.add(db_token)
            await db.flush()
