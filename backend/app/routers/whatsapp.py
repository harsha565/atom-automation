from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.responses import success_response
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.whatsapp import WhatsAppConnectRequest
from app.services.whatsapp_service import WhatsAppService

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp Integration"])


@router.post("/connect", status_code=status.HTTP_200_OK)
async def connect_whatsapp(
    data: WhatsAppConnectRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Exchanges a Meta Embedded Signup authorization code, retrieves WABA accounts,
    encrypts access credentials, and connects the account to the Gym profile.
    """
    await WhatsAppService.connect_whatsapp(db, current_user, data)
    return success_response(
        message="WhatsApp account connected successfully",
        status_code=status.HTTP_200_OK,
    )


@router.get("/status", status_code=status.HTTP_200_OK)
async def get_connection_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Retrieves the connection status, status indicator, and registered phone number
    for the user's WhatsApp Business Account integration.
    """
    status_data = await WhatsAppService.get_connection_status(db, current_user)
    return success_response(
        data=status_data,
        message="Connection status retrieved successfully",
    )


@router.post("/disconnect", status_code=status.HTTP_200_OK)
async def disconnect_whatsapp(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Terminates active Meta synchronization for the current user's gym.
    """
    await WhatsAppService.disconnect_whatsapp(db, current_user)
    return success_response(
        message="WhatsApp connection disconnected successfully",
        status_code=status.HTTP_200_OK,
    )
