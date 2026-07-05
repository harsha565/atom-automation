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
        """
        Processes a data deletion request triggered by Meta.
        Since user_id in AuditLog is non-nullable, we log the deletion
        request via the logger for manual/automated follow-up and
        generate a confirmation code.
        """
        confirmation_code = str(uuid.uuid4())

        logger.info(
            f"Data deletion request received for Meta user "
            f"{meta_user_id}. Confirmation code: "
            f"{confirmation_code}"
        )

        return {
            "confirmation_code": confirmation_code,
        }
