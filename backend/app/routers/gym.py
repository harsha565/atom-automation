from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.responses import success_response
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.gym import GymCreateRequest, GymUpdateRequest, GymResponse
from app.services.gym_service import GymService

router = APIRouter(prefix="/gym", tags=["Gym Management"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_gym(
    data: GymCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Creates a new gym profile for the authenticated user (Owner).
    Ensures that a user can only have one gym profile.
    """
    gym = await GymService.create_gym(db, current_user, data)
    response_data = GymResponse.model_validate(gym).model_dump()
    return success_response(
        data=response_data,
        message="Gym profile created successfully",
        status_code=status.HTTP_201_CREATED,
    )


@router.get("")
async def get_gym(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Retrieves the gym profile associated with the authenticated user.
    """
    gym = await GymService.get_gym(db, current_user)
    response_data = GymResponse.model_validate(gym).model_dump()
    return success_response(
        data=response_data,
        message="Gym profile retrieved successfully",
    )


@router.put("")
async def update_gym(
    data: GymUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict:
    """
    Updates the gym profile of the authenticated user.
    Only modifies fields that are explicitly provided in the payload.
    """
    gym = await GymService.update_gym(db, current_user, data)
    response_data = GymResponse.model_validate(gym).model_dump()
    return success_response(
        data=response_data,
        message="Gym profile updated successfully",
    )
