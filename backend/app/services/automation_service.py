from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.automation import AutomationConfig
from app.core.enums import AutomationStatus, AuditAction
from app.models.audit_log import AuditLog
from app.services.gym_service import GymService

class AutomationService:
    @staticmethod
    async def get_automation_status(db: AsyncSession, user: User) -> dict:
        """
        Retrieves the automation configurations for the user's Gym.
        """
        gym = await GymService.get_gym(db, user)
        stmt = select(AutomationConfig).where(AutomationConfig.gym_id == gym.id)
        result = await db.execute(stmt)
        config = result.scalar_one_or_none()

        if not config:
            return {
                "configured": False,
                "membership_reminder_enabled": False,
                "rag_bot_enabled": False,
                "last_activation_status": None,
                "last_activation_at": None,
            }

        return {
            "configured": config.n8n_workflow_id is not None,
            "membership_reminder_enabled": config.membership_reminder_enabled,
            "rag_bot_enabled": config.rag_bot_enabled,
            "last_activation_status": config.last_activation_status.value if config.last_activation_status else None,
            "last_activation_at": config.last_activation_at.isoformat() if config.last_activation_at else None,
        }

    @staticmethod
    async def activate_automation(db: AsyncSession, user: User) -> dict:
        """
        Activates the automations configuration for the user's Gym (simulates n8n trigger/registration).
        """
        gym = await GymService.get_gym(db, user)
        stmt = select(AutomationConfig).where(AutomationConfig.gym_id == gym.id)
        result = await db.execute(stmt)
        config = result.scalar_one_or_none()

        now = datetime.now(timezone.utc)
        if not config:
            config = AutomationConfig(
                gym_id=gym.id,
                membership_reminder_enabled=True,
                rag_bot_enabled=True,
                n8n_workflow_id="wf_dummy_n8n_id",
                last_activation_at=now,
                last_activation_status=AutomationStatus.SUCCESS,
            )
            db.add(config)
        else:
            config.membership_reminder_enabled = True
            config.rag_bot_enabled = True
            config.n8n_workflow_id = "wf_dummy_n8n_id"
            config.last_activation_at = now
            config.last_activation_status = AutomationStatus.SUCCESS

        # Log audit action
        audit_log = AuditLog(
            user_id=user.id,
            gym_id=gym.id,
            action=AuditAction.AUTOMATION_ENABLED,
            log_metadata={"n8n_workflow_id": "wf_dummy_n8n_id"},
        )
        db.add(audit_log)

        await db.commit()

        return {
            "configured": True,
            "membership_reminder_enabled": True,
            "rag_bot_enabled": True,
            "last_activation_status": "SUCCESS",
            "last_activation_at": now.isoformat(),
        }
