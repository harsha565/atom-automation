from typing import Optional
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.dependencies import get_db
from app.services.refresh_token_service import RefreshTokenService

router = APIRouter(prefix="/internal", tags=["Internal"])

@router.post("/cleanup-tokens")
async def cleanup_tokens(
    x_internal_secret: Optional[str] = Header(None, alias="X-Internal-Secret"),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Protected internal endpoint to clean up expired/revoked refresh tokens.
    """
    if not x_internal_secret or x_internal_secret != settings.INTERNAL_CRON_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
        )

    deleted_count = await RefreshTokenService.cleanup_all_expired_tokens(db)
    await db.commit()

    return {"deleted": deleted_count}
