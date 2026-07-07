from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.limiter import limiter
from app.core.responses import success_response
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, RefreshRequest
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def register(
    request: Request,
    data: RegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Registers a new gym owner user.
    Rate limit: 3 requests per minute.
    """
    tokens = await AuthService.register_user(db, data)
    return success_response(
        data=tokens,
        message="Registration successful",
        status_code=status.HTTP_201_CREATED,
    )


@router.post("/login")
@limiter.limit("5/minute")
async def login(
    request: Request,
    data: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Authenticates user credentials and issues session tokens.
    Rate limit: 5 requests per minute.
    """
    tokens = await AuthService.login_user(db, data)
    return success_response(
        data=tokens,
        message="Login successful",
    )


@router.post("/refresh")
@limiter.limit("10/minute")
async def refresh(
    request: Request,
    data: RefreshRequest,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Refreshes an expired JWT access token using a valid database refresh token.
    Rate limit: 10 requests per minute.
    """
    tokens = await AuthService.refresh_access_token(db, data)
    return success_response(
        data=tokens,
        message="Token refreshed successfully",
    )


@router.post("/logout")
@limiter.limit("10/minute")
async def logout(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Logs out the current user session.
    Rate limit: 10 requests per minute.
    """
    try:
        body = await request.json()
        refresh_token = body.get("refresh_token")
        if refresh_token:
            await AuthService.logout_user(
                db, refresh_token, current_user.id
            )
    except Exception:
        pass
    return success_response(message="Logout successful")


import logging

logger = logging.getLogger(__name__)

@router.delete("/account")
@limiter.limit("3/minute")
async def delete_account(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Permanently deletes the requesting user's account
    and all associated data from all tables.
    Deletion order respects foreign key constraints.
    """
    from sqlalchemy import delete
    from app.models.audit_log import AuditLog
    from app.models.automation import AutomationConfig
    from app.models.whatsapp import WhatsAppAccount
    from app.models.refresh_token import RefreshToken
    from app.models.gym import Gym
    import uuid

    user_id = current_user.id
    user_email = current_user.email

    logger.info(
        f"Starting account deletion for: {user_email} ({user_id})"
    )

    # Get gym_id first before deleting anything
    from sqlalchemy import select
    gym_stmt = select(Gym).where(Gym.user_id == user_id)
    gym_result = await db.execute(gym_stmt)
    gym = gym_result.scalar_one_or_none()
    gym_id = gym.id if gym else None

    # Delete in correct order (child tables first)

    # 1. Delete audit logs
    await db.execute(
        delete(AuditLog).where(AuditLog.user_id == user_id)
    )

    if gym_id:
        await db.execute(
            delete(AuditLog).where(AuditLog.gym_id == gym_id)
        )

        # 2. Delete automation configs
        await db.execute(
            delete(AutomationConfig).where(
                AutomationConfig.gym_id == gym_id
            )
        )

        # 3. Delete whatsapp accounts (soft deleted or not)
        await db.execute(
            delete(WhatsAppAccount).where(
                WhatsAppAccount.gym_id == gym_id
            )
        )

        # 4. Delete gym
        await db.execute(
            delete(Gym).where(Gym.user_id == user_id)
        )

    # 5. Delete refresh tokens
    await db.execute(
        delete(RefreshToken).where(
            RefreshToken.user_id == user_id
        )
    )

    # 6. Delete user last
    from app.models.user import User as UserModel
    await db.execute(
        delete(UserModel).where(UserModel.id == user_id)
    )

    await db.commit()

    logger.info(
        f"Account deletion complete for: {user_email} ({user_id})"
    )

    return success_response(
        message="Account permanently deleted",
    )


