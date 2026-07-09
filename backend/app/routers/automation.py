import httpx
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
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


@router.post("/send-test-reminder", status_code=status.HTTP_200_OK)
async def send_test_reminder(
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Sends a test reminder by invoking the external n8n webhook.
    """
    if not settings.N8N_WEBHOOK_URL:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="N8N_WEBHOOK_URL is not configured."
        )

    headers = {}
    if settings.N8N_WEBHOOK_SECRET:
        headers["X-Webhook-Secret"] = settings.N8N_WEBHOOK_SECRET

    payload = {
        "user_id": str(current_user.id),
        "email": current_user.email,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                settings.N8N_WEBHOOK_URL,
                headers=headers,
                json=payload
            )
            response.raise_for_status()
    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Reminder webhook request timed out."
        )
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Reminder service returned error: {exc.response.status_code}."
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to communicate with the reminder service: {str(exc)}."
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(exc)}."
        )

    return {"success": True, "message": "Reminder sent"}
