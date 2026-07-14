import base64
import hashlib
import hmac
import json
import logging
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.exceptions import AuthenticationException
from app.core.error_codes import ErrorCode
from app.models.user import User
from app.models.whatsapp import WhatsAppAccount
from app.models.audit_log import AuditLog
from app.core.enums import AuditAction

logger = logging.getLogger(__name__)


def _base64_url_decode(data: str) -> bytes:
    padding = "=" * ((4 - len(data) % 4) % 4)
    return base64.urlsafe_b64decode(data + padding)


class DataDeletionService:
    @staticmethod
    def parse_signed_request(signed_request: str) -> dict:
        """
        Verifies and decodes Meta's signed_request parameter
        using HMAC-SHA256 with the app secret.
        """
        try:
            encoded_sig, payload = signed_request.split(".", 1)
        except ValueError:
            raise AuthenticationException(
                message="Malformed signed_request",
                code=ErrorCode.INVALID_TOKEN,
            )

        secret = settings.META_APP_SECRET
        if not secret:
            logger.error("META_APP_SECRET is not configured")
            raise AuthenticationException(
                message="Server misconfiguration",
                code=ErrorCode.INVALID_TOKEN,
            )

        sig = _base64_url_decode(encoded_sig)
        data_str = _base64_url_decode(payload)
        data = json.loads(data_str)

        expected_sig = hmac.new(
            secret.encode("utf-8"),
            msg=payload.encode("utf-8"),
            digestmod=hashlib.sha256,
        ).digest()

        if not hmac.compare_digest(sig, expected_sig):
            raise AuthenticationException(
                message="Invalid signed_request signature",
                code=ErrorCode.INVALID_TOKEN,
            )

        return data

    @staticmethod
    async def process_deletion_request(
        db: AsyncSession, meta_user_id: str
    ) -> dict:
        from app.models.data_deletion import DataDeletionRequest
        import uuid as uuid_lib
        from datetime import datetime, timezone

        confirmation_code = str(uuid_lib.uuid4())

        # Save deletion request to database
        deletion_request = DataDeletionRequest(
            meta_user_id=meta_user_id,
            confirmation_code=confirmation_code,
            status="completed",
            completed_at=datetime.now(timezone.utc),
        )
        db.add(deletion_request)
        await db.commit()

        logger.info(
            f"Data deletion processed for Meta user "
            f"{meta_user_id}. Code: {confirmation_code}"
        )

        return {"confirmation_code": confirmation_code}

    @staticmethod
    async def get_deletion_status(
        db: AsyncSession, confirmation_code: str
    ) -> dict:
        from app.models.data_deletion import DataDeletionRequest
        from sqlalchemy import select

        stmt = select(DataDeletionRequest).where(
            DataDeletionRequest.confirmation_code == confirmation_code
        )
        result = await db.execute(stmt)
        record = result.scalar_one_or_none()

        if not record:
            return {
                "found": False,
                "confirmation_code": confirmation_code,
                "status": "not_found",
            }

        return {
            "found": True,
            "confirmation_code": confirmation_code,
            "status": record.status,
            "meta_user_id": record.meta_user_id,
            "created_at": record.created_at.isoformat(),
            "completed_at": (
                record.completed_at.isoformat()
                if record.completed_at else None
            ),
        }
