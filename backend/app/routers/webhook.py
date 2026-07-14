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
async def receive_whatsapp_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Receives incoming WhatsApp webhook payloads.
    Verifies HMAC signature, parses messages,
    and forwards to n8n for processing.
    Must respond 200 quickly — processing is async.
    """
    import hmac
    import hashlib
    import httpx
    from sqlalchemy import select
    from app.models.whatsapp import WhatsAppAccount
    from app.models.gym import Gym

    # Get raw body for signature verification
    body = await request.body()

    # Verify Meta signature
    sig_header = request.headers.get(
        "X-Hub-Signature-256", ""
    )
    if settings.META_APP_SECRET and sig_header:
        expected = "sha256=" + hmac.new(
            settings.META_APP_SECRET.encode(),
            body,
            hashlib.sha256,
        ).hexdigest()
        if not hmac.compare_digest(sig_header, expected):
            logger.warning("Invalid webhook signature")
            return {"status": "invalid_signature"}

    try:
        payload = await request.json()
    except Exception:
        return {"status": "invalid_payload"}

    # Process entries asynchronously
    # Return 200 immediately to Meta
    entries = payload.get("entry", [])

    for entry in entries:
        waba_id = entry.get("id")
        changes = entry.get("changes", [])

        for change in changes:
            field = change.get("field")
            value = change.get("value", {})

            logger.info(
                f"Webhook event: field={field} "
                f"waba_id={waba_id}"
            )

            if field == "messages":
                messages = value.get("messages", [])
                statuses = value.get("statuses", [])
                phone_number_id = value.get(
                    "metadata", {}
                ).get("phone_number_id")

                # Log incoming messages
                for msg in messages:
                    logger.info(
                        f"Incoming message from "
                        f"{msg.get('from')}: "
                        f"{msg.get('text', {}).get('body', '')}"
                    )

                # Forward to n8n if configured
                if settings.N8N_WEBHOOK_URL and (
                    messages or statuses
                ):
                    try:
                        async with httpx.AsyncClient(
                            timeout=5.0
                        ) as client:
                            await client.post(
                                settings.N8N_WEBHOOK_URL
                                + "/incoming",
                                json={
                                    "waba_id": waba_id,
                                    "phone_number_id":
                                        phone_number_id,
                                    "messages": messages,
                                    "statuses": statuses,
                                    "raw": value,
                                },
                            )
                    except Exception as e:
                        logger.warning(
                            f"n8n forward failed: {e}"
                        )

    return {"status": "ok"}



@router.post("/data-deletion")
async def meta_data_deletion_callback(
    request: Request,
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

    scheme = request.headers.get("x-forwarded-proto", request.url.scheme)
    host = request.headers.get("x-forwarded-host", request.headers.get("host"))
    if host:
        if "8000" in host:
            base_url = settings.APP_PUBLIC_URL
        else:
            base_url = f"{scheme}://{host}"
    else:
        base_url = settings.APP_PUBLIC_URL

    status_check_url = (
        f"{base_url}/legal/data-deletion-status"
        f"?id={result['confirmation_code']}"
    )

    return DataDeletionResponse(
        url=status_check_url,
        confirmation_code=result["confirmation_code"],
    )


@router.get("/data-deletion-status")
async def get_data_deletion_status(
    id: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """
    Returns the status of a data deletion request.
    Meta checks this URL after sending a deletion callback.
    """
    from app.services.data_deletion_service import (
        DataDeletionService
    )
    status = await DataDeletionService.get_deletion_status(
        db, id
    )
    return status


