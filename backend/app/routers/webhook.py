from fastapi import APIRouter, Query, Response, status, Form, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies import get_db
from app.services.data_deletion_service import DataDeletionService
from app.schemas.data_deletion import DataDeletionResponse
from app.config import settings
from app.core.limiter import limiter
import hmac
import hashlib
import json
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


def verify_signature(body_bytes: bytes, signature: str, secret: str) -> bool:
    if not signature.startswith("sha256="):
        return False
    actual_sig = signature[7:]
    expected_sig = hmac.new(
        secret.encode("utf-8"),
        body_bytes,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(actual_sig, expected_sig)


@router.get("/whatsapp")
@limiter.limit("10/minute")
async def verify_whatsapp_webhook(
    request: Request,
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_challenge: int = Query(None, alias="hub.challenge"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
) -> Response:
    """
    Endpoint for WhatsApp Webhook verification (GET request).
    Meta sends this request to verify the server's authenticity.
    """
    if hub_mode == "subscribe" and hub_verify_token == settings.META_WEBHOOK_VERIFY_TOKEN:
        if hub_challenge is not None:
            return Response(content=str(hub_challenge), media_type="text/plain")
    return Response(content="Verification failed", status_code=status.HTTP_403_FORBIDDEN)


@router.post("/whatsapp")
@limiter.limit("60/minute")
async def receive_whatsapp_webhook(
    request: Request,
) -> Response:
    """
    Endpoint to receive incoming WhatsApp webhook payloads (messages, delivery receipts, status updates).
    """
    if not settings.META_APP_SECRET:
        logger.error("META_APP_SECRET is not configured! Webhook POST requests are blocked for security.")
        return Response(content='{"error":"Security configuration missing"}', status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, media_type="application/json")

    signature = request.headers.get("x-hub-signature-256")
    if not signature:
        logger.warning("Missing x-hub-signature-256 header")
        return Response(content='{"error":"Missing signature"}', status_code=status.HTTP_401_UNAUTHORIZED, media_type="application/json")

    raw_body = await request.body()
    if not verify_signature(raw_body, signature, settings.META_APP_SECRET):
        logger.warning("Invalid x-hub-signature-256 signature")
        return Response(content='{"error":"Invalid signature"}', status_code=status.HTTP_401_UNAUTHORIZED, media_type="application/json")

    return Response(content='{"status":"success","received":true}', media_type="application/json")


@router.post("/data-deletion")
async def meta_data_deletion_callback(
    signed_request: str = Form(...),
    db: AsyncSession = Depends(get_db),
) -> DataDeletionResponse:
    """
    Meta Data Deletion Callback.
    Meta calls this endpoint via signed POST request when
    a user requests deletion of their data through Facebook
    account settings.
    """
    payload = DataDeletionService.parse_signed_request(
        signed_request
    )
    meta_user_id = payload.get("user_id", "unknown")

    result = await DataDeletionService.process_deletion_request(
        db, meta_user_id
    )

    status_check_url = (
        f"{settings.APP_PUBLIC_URL}/legal/data-deletion-status"
        f"?id={result['confirmation_code']}"
    )

    return DataDeletionResponse(
        url=status_check_url,
        confirmation_code=result["confirmation_code"],
    )

