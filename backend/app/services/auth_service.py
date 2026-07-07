import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.enums import AuditAction
from app.core.error_codes import ErrorCode
from app.core.exceptions import ConflictException, AuthenticationException
from app.models.user import User
from app.models.gym import Gym
from app.models.audit_log import AuditLog
from app.schemas.auth import RegisterRequest, LoginRequest, RefreshRequest
from app.services.refresh_token_service import RefreshTokenService
from app.utils.security import hash_password, verify_password, create_access_token


class AuthService:
    @staticmethod
    async def register_user(db: AsyncSession, data: RegisterRequest) -> dict:
        """
        Registers a new user, hashes their password, registers an audit log,
        and returns access and refresh tokens.
        """
        # Validate email uniqueness
        stmt = select(User).where(User.email == data.email)
        result = await db.execute(stmt)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise ConflictException(
                message="Email already exists",
                code=ErrorCode.EMAIL_ALREADY_EXISTS,
            )

        # Hash password
        pwd_hash = hash_password(data.password)

        # Create user
        new_user = User(email=data.email, password_hash=pwd_hash)
        db.add(new_user)
        await db.flush()  # Flush to generate new_user.id

        # Log audit action
        audit_log = AuditLog(
            user_id=new_user.id,
            action=AuditAction.USER_REGISTERED,
            log_metadata={"email": new_user.email},
        )
        db.add(audit_log)

        # Auto-create gym profile on registration
        gym = Gym(
            user_id=new_user.id,
            gym_name=data.gym_name or "My Gym",
            owner_name=data.owner_name or "",
            phone="",
        )
        db.add(gym)

        # Generate tokens
        access_token = create_access_token(
            data={"sub": str(new_user.id), "email": new_user.email}
        )
        refresh_token = await RefreshTokenService.create_refresh_token(
            db, new_user.id
        )

        await db.commit()

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "gym_name": gym.gym_name,
        }

    @staticmethod
    async def login_user(db: AsyncSession, data: LoginRequest) -> dict:
        """
        Authenticates a user by email and password, creates a login audit log,
        and returns access and refresh tokens.
        """
        # Verify user existence
        stmt = select(User).where(User.email == data.email)
        result = await db.execute(stmt)
        user = result.scalar_one_or_none()

        if not user:
            raise AuthenticationException(
                message="Invalid email or password",
                code=ErrorCode.INVALID_CREDENTIALS,
            )

        # Verify password hash
        if not verify_password(data.password, user.password_hash):
            raise AuthenticationException(
                message="Invalid email or password",
                code=ErrorCode.INVALID_CREDENTIALS,
            )

        # Log audit action
        audit_log = AuditLog(
            user_id=user.id,
            action=AuditAction.USER_LOGIN,
            log_metadata={"email": user.email},
        )
        db.add(audit_log)

        # Generate tokens
        access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        refresh_token = await RefreshTokenService.create_refresh_token(
            db, user.id
        )

        await db.commit()

        # Clean up old revoked tokens for this user
        await RefreshTokenService.cleanup_old_tokens(db, user.id)

        # Fetch gym name to sync on login
        gym_stmt = select(Gym).where(Gym.user_id == user.id)
        gym_result = await db.execute(gym_stmt)
        gym = gym_result.scalar_one_or_none()
        gym_name = gym.gym_name if gym else user.email

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "gym_name": gym_name,
        }

    @staticmethod
    async def refresh_access_token(db: AsyncSession, data: RefreshRequest) -> dict:
        """
        Validates the refresh token, revokes it, and issues a new access token
        along with a rotated new refresh token.
        """
        # Validate incoming refresh token status
        db_token = await RefreshTokenService.validate_refresh_token(
            db, data.refresh_token
        )

        # Retrieve user record
        user = await db.get(User, db_token.user_id)
        if not user:
            raise AuthenticationException(
                message="User associated with token not found",
                code=ErrorCode.INVALID_TOKEN,
            )

        # Revoke old refresh token
        await RefreshTokenService.revoke_refresh_token(db, data.refresh_token)

        # Generate new rotated tokens
        new_refresh_token = await RefreshTokenService.create_refresh_token(
            db, user.id
        )
        new_access_token = create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )

        await db.commit()

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }


    @staticmethod
    async def logout_user(
        db: AsyncSession, refresh_token: str, user_id: uuid.UUID
    ) -> None:
        """
        Revokes a user's refresh token and creates a logout audit log.
        """
        # Revoke the refresh token in the database
        await RefreshTokenService.revoke_refresh_token(db, refresh_token)

        # Log audit action
        audit_log = AuditLog(
            user_id=user_id,
            action=AuditAction.USER_LOGOUT,
            log_metadata={},
        )
        db.add(audit_log)

        await db.commit()
