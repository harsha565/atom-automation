from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.responses import success_response
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.automation_service import AutomationService

router = APIRouter(prefix="/automations", tags=["Automations"])


@router.get("/")
async def list_automations() -> dict:
    """
    Placeholder endpoint to list gym automation configurations.
    """
    return {"message": "List automations endpoint placeholder"}


@router.post("/trigger")
async def trigger_automation() -> dict:
    """
    Placeholder endpoint to manually trigger a registered automation flow.
    """
    return {"message": "Trigger automation endpoint placeholder"}


@router.get("/status", status_code=status.HTTP_200_OK)
async def get_automation_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Retrieves the status of active automations for the current user's gym.
    """
    status_data = await AutomationService.get_automation_status(db, current_user)
    return success_response(
        data=status_data,
        message="Automation status retrieved successfully",
    )


@router.post("/activate", status_code=status.HTTP_200_OK)
async def activate_automation(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Activates the automations configuration for the user's gym.
    """
    activated_data = await AutomationService.activate_automation(db, current_user)
    return success_response(
        data=activated_data,
        message="Automation activated successfully",
    )
