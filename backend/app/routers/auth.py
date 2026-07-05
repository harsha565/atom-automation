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
    data: RefreshRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Revokes the provided refresh token and logs out the current user session.
    Rate limit: 10 requests per minute.
    """
    await AuthService.logout_user(db, data.refresh_token, current_user.id)
    return success_response(
        message="Logout successful",
    )


import logging
from app.config import settings
import httpx

logger = logging.getLogger(__name__)

@router.delete("/account")
@limiter.limit("3/minute")
async def delete_account(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Permanently deletes the requesting user's account and all associated data.
    """
    user_id = current_user.id
    user_email = current_user.email
    
    # 1. Hard-delete the user record from the local database
    # SQLAlchemy will cascade delete because ON DELETE CASCADE is set on the foreign keys
    await db.delete(current_user)
    await db.commit()
    logger.info(f"Successfully deleted local DB records for user: {user_email} ({user_id})")
    
    # 2. Hard-delete the user from Supabase Auth via Admin API
    if settings.SUPABASE_SERVICE_ROLE_KEY:
        headers = {
            "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
            "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
        }
        url = f"{settings.SUPABASE_URL}/auth/v1/admin/users/{user_id}"
        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(url, headers=headers)
                if response.status_code not in [200, 204]:
                    logger.error(f"Failed to delete user {user_id} from Supabase: {response.status_code} - {response.text}")
                else:
                    logger.info(f"Successfully deleted user {user_id} from Supabase Auth.")
            except Exception as e:
                logger.error(f"Error calling Supabase Auth Admin API to delete user: {e}")
    else:
        logger.warning(f"SUPABASE_SERVICE_ROLE_KEY is not configured. User {user_id} deleted from local DB but not from Supabase Auth.")

    return success_response(
        message="Account permanently deleted",
    )

