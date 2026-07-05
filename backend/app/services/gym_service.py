import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.enums import AuditAction
from app.core.error_codes import ErrorCode
from app.core.exceptions import ConflictException, NotFoundException
from app.models.gym import Gym
from app.models.user import User
from app.models.audit_log import AuditLog
from app.schemas.gym import GymCreateRequest, GymUpdateRequest


class GymService:
    @staticmethod
    async def create_gym(
        db: AsyncSession, user: User, data: GymCreateRequest
    ) -> Gym:
        """
        Creates a new gym profile for the user.
        Raises ConflictException if a profile already exists.
        """
        # Ensure only one gym profile can exist per user
        stmt = select(Gym).where(Gym.user_id == user.id)
        result = await db.execute(stmt)
        existing_gym = result.scalar_one_or_none()

        if existing_gym:
            raise ConflictException(
                message="Gym profile already exists for this user",
                code="GYM_ALREADY_EXISTS",
            )

        gym = Gym(
            user_id=user.id,
            gym_name=data.gym_name,
            owner_name=data.owner_name,
            phone=data.phone,
        )

        db.add(gym)
        await db.commit()
        await db.refresh(gym)

        return gym

    @staticmethod
    async def get_gym(db: AsyncSession, user: User) -> Gym:
        """
        Retrieves the gym profile associated with the user.
        Raises NotFoundException if no profile exists.
        """
        stmt = select(Gym).where(Gym.user_id == user.id)
        result = await db.execute(stmt)
        gym = result.scalar_one_or_none()

        if not gym:
            raise NotFoundException(
                message="Gym profile not found",
                code=ErrorCode.GYM_NOT_FOUND,
            )

        return gym

    @staticmethod
    async def update_gym(
        db: AsyncSession, user: User, data: GymUpdateRequest
    ) -> Gym:
        """
        Updates an existing gym profile. Only replaces fields that were explicitly sent.
        Logs modifications in the audit logs.
        """
        stmt = select(Gym).where(Gym.user_id == user.id)
        result = await db.execute(stmt)
        gym = result.scalar_one_or_none()

        if not gym:
            raise NotFoundException(
                message="Gym profile not found",
                code=ErrorCode.GYM_NOT_FOUND,
            )

        updated_fields = []

        # Update supplied fields only (ignore None values)
        if data.gym_name is not None and data.gym_name != gym.gym_name:
            gym.gym_name = data.gym_name
            updated_fields.append("gym_name")

        if data.owner_name is not None and data.owner_name != gym.owner_name:
            gym.owner_name = data.owner_name
            updated_fields.append("owner_name")

        if data.phone is not None and data.phone != gym.phone:
            gym.phone = data.phone
            updated_fields.append("phone")

        if updated_fields:
            # Create audit log entry mapping the GYM_UPDATED action
            audit_log = AuditLog(
                user_id=user.id,
                gym_id=gym.id,
                action=AuditAction.GYM_UPDATED,
                log_metadata={"updated_fields": updated_fields},
            )
            db.add(audit_log)

            await db.commit()
            await db.refresh(gym)

        return gym
