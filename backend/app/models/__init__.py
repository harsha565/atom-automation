from app.models.base import Base
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.gym import Gym
from app.models.whatsapp import WhatsAppAccount
from app.models.automation import AutomationConfig
from app.models.audit_log import AuditLog

# Export all models so that they are loaded in one place
# and discoverable automatically by Alembic migrations
__all__ = [
    "Base",
    "User",
    "RefreshToken",
    "Gym",
    "WhatsAppAccount",
    "AutomationConfig",
    "AuditLog",
]
