import hashlib
import hmac
import logging
from typing import Any, Dict, Optional
import httpx

from app.config import settings
from app.core.error_codes import ErrorCode
from app.core.exceptions import MetaAPIException

logger = logging.getLogger(__name__)


class MetaService:
    """
    Centralized Graph API client for communicating with Meta (WhatsApp Cloud API).
    Target API Version: v23.0
    """

    BASE_URL = "https://graph.facebook.com/v25.0"

    @classmethod
    def generate_app_secret_proof(cls, access_token: str) -> str:
        """
        Calculates the appsecret_proof for Meta Graph API calls to prevent token hijacking.
        Uses HMAC-SHA256 signature of access_token signed with META_APP_SECRET.
        """
        if not settings.META_APP_SECRET:
            logger.error("META_APP_SECRET is not configured in Settings.")
            raise MetaAPIException(
                message="Meta Service Configuration Error: META_APP_SECRET is missing.",
                code=ErrorCode.META_API_ERROR,
                status_code=500,
            )
        try:
            key_bytes = settings.META_APP_SECRET.encode("utf-8")
            msg_bytes = access_token.encode("utf-8")
            return hmac.new(key_bytes, msg_bytes, hashlib.sha256).hexdigest()
        except Exception as e:
            logger.error(f"Failed to generate Meta appsecret_proof: {e}")
            raise MetaAPIException(
                message="Internal security proof generation failed.",
                code=ErrorCode.META_API_ERROR,
                status_code=500,
            )

    @classmethod
    async def _make_request(
        cls,
        method: str,
        path: str,
        access_token: str,
        params: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Internal request runner that attaches access credentials,
        validates HTTP responses, masks logging trace outputs, and catches connection errors.
        """
        if params is None:
            params = {}

        # Append credentials and HMAC security proof
        proof = cls.generate_app_secret_proof(access_token)
        request_params = params.copy()
        request_params.update(
            {"access_token": access_token, "appsecret_proof": proof}
        )

        url = f"{cls.BASE_URL}{path}"

        # Mask access token and security proof details for safe logging
        logging_params = request_params.copy()
        logging_params["access_token"] = "MASKED"
        logging_params["appsecret_proof"] = "MASKED"

        logger.info(
            f"Invoking Meta API: {method} '{path}' with parameters: {logging_params}"
        )

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.request(
                    method, url, params=request_params
                )

                if response.status_code != 200:
                    try:
                        error_json = response.json()
                        error_details = error_json.get("error", {})
                        error_message = error_details.get(
                            "message", "Unknown Meta API response exception"
                        )
                        error_code = error_details.get("code", -1)
                        fbtrace_id = error_details.get("fbtrace_id", "N/A")
                    except Exception:
                        error_message = response.text or "Error parsing JSON"
                        error_code = -1
                        fbtrace_id = "N/A"

                    logger.error(
                        f"Meta Graph API error response [{response.status_code}]: "
                        f"Message: '{error_message}', Code: {error_code}, fbtrace_id: {fbtrace_id}"
                    )

                    # Map typical token invalidations (Meta Error Code 190) to local unauthorized code
                    status_code = response.status_code
                    app_error_code = ErrorCode.META_API_ERROR
                    if error_code == 190 or "token" in error_message.lower():
                        app_error_code = ErrorCode.META_INVALID_TOKEN
                        status_code = 401

                    raise MetaAPIException(
                        message=f"Meta API failure: {error_message}",
                        code=app_error_code,
                        status_code=status_code,
                    )

                return response.json()

        except httpx.RequestError as exc:
            logger.error(
                f"Connection exception encountered during Meta API call to '{path}': {exc}"
            )
            raise MetaAPIException(
                message="Connection to Meta Graph API server failed.",
                code=ErrorCode.META_CONNECTION_FAILED,
                status_code=502,
            )
        except Exception as exc:
            if isinstance(exc, MetaAPIException):
                raise
            logger.exception("Unhandled exception during Meta Graph API execution")
            raise MetaAPIException(
                message="An unexpected error occurred during API communication.",
                code=ErrorCode.META_API_ERROR,
                status_code=500,
            )

    @classmethod
    async def validate_access_token(cls, access_token: str) -> Dict[str, Any]:
        """
        Validates a temporary Meta user access token.
        Queries details for current user profile.
        """
        return await cls._make_request(
            "GET", "/me", access_token, params={"fields": "id,name"}
        )

    @classmethod
    async def get_business_accounts(cls, access_token: str) -> Dict[str, Any]:
        """
        Retrieves all Meta Business Manager accounts associated with the user.
        """
        return await cls._make_request("GET", "/me/businesses", access_token)

    @classmethod
    async def get_waba_details(
        cls, waba_id: str, access_token: str
    ) -> Dict[str, Any]:
        """
        Retrieves registration and settings details for a WhatsApp Business Account (WABA).
        """
        return await cls._make_request("GET", f"/{waba_id}", access_token)

    @classmethod
    async def exchange_code_for_token(cls, authorization_code: str) -> str:
        """
        Exchanges a Meta authorization code for a user access token.
        Endpoint: /oauth/access_token
        """
        if not settings.META_APP_ID or not settings.META_APP_SECRET:
            logger.error("Meta client ID or Secret is not configured in Settings.")
            raise MetaAPIException(
                message="Meta configuration error: Client credentials missing.",
                code=ErrorCode.META_API_ERROR,
                status_code=500,
            )

        url = f"{cls.BASE_URL}/oauth/access_token"
        params = {
            "client_id": settings.META_APP_ID,
            "client_secret": settings.META_APP_SECRET,
            "code": authorization_code,
        }

        # Log parameters securely (masking META_APP_SECRET)
        masked_params = params.copy()
        masked_params["client_secret"] = "MASKED"

        logger.info(
            f"Exchanging authorization code for token: GET {url} with params: {masked_params}"
        )

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params)

                if response.status_code != 200:
                    try:
                        error_json = response.json()
                        error_message = error_json.get("error", {}).get(
                            "message", "Token exchange failed"
                        )
                    except Exception:
                        error_message = response.text or "Error parsing JSON"

                    logger.error(
                        f"Meta token exchange failure [{response.status_code}]: {error_message}"
                    )
                    raise MetaAPIException(
                        message=f"Meta exchange failure: {error_message}",
                        code=ErrorCode.META_API_ERROR,
                        status_code=response.status_code,
                    )

                resp_data = response.json()
                access_token = resp_data.get("access_token")
                if not access_token:
                    logger.error("Meta response did not contain access_token parameter")
                    raise MetaAPIException(
                        message="Invalid Meta server response: access_token missing.",
                        code=ErrorCode.META_API_ERROR,
                        status_code=500,
                    )

                return access_token

        except httpx.RequestError as exc:
            logger.error(f"Connection error during token exchange: {exc}")
            raise MetaAPIException(
                message="Connection to Meta Graph API token exchange server failed.",
                code=ErrorCode.META_CONNECTION_FAILED,
                status_code=502,
            )

    @classmethod
    async def get_waba_accounts(
        cls, business_id: str, access_token: str
    ) -> Dict[str, Any]:
        """
        Retrieves WABAs owned by a Meta Business Manager account.
        Endpoint: /{business_id}/owned_whatsapp_business_accounts
        """
        return await cls._make_request(
            "GET",
            f"/{business_id}/owned_whatsapp_business_accounts",
            access_token,
        )

    @classmethod
    async def get_phone_numbers(
        cls, waba_id: str, access_token: str
    ) -> Dict[str, Any]:
        """
        Retrieves phone numbers associated with a WhatsApp Business Account.
        Endpoint: /{waba_id}/phone_numbers
        """
        return await cls._make_request(
            "GET", f"/{waba_id}/phone_numbers", access_token
        )

    @classmethod
    async def subscribe_app_to_waba(
        cls, waba_id: str, access_token: str
    ) -> Dict[str, Any]:
        """
        Subscribes the app to a WhatsApp Business Account (WABA).
        Endpoint: POST /{waba_id}/subscribed_apps
        """
        return await cls._make_request(
            "POST", f"/{waba_id}/subscribed_apps", access_token
        )

    @classmethod
    async def unsubscribe_app_from_waba(
        cls, waba_id: str, access_token: str
    ) -> Dict[str, Any]:
        """
        Unsubscribes the app from a WhatsApp Business Account (WABA).
        Endpoint: DELETE /{waba_id}/subscribed_apps
        """
        return await cls._make_request(
            "DELETE", f"/{waba_id}/subscribed_apps", access_token
        )

    @classmethod
    async def register_phone_number(
        cls, phone_number_id: str, access_token: str, pin: str
    ) -> Dict[str, Any]:
        """
        Registers a phone number for WhatsApp Cloud API messaging.
        Endpoint: POST /{phone_number_id}/register
        """
        params = {
            "messaging_product": "whatsapp",
            "pin": pin
        }
        return await cls._make_request(
            "POST", f"/{phone_number_id}/register", access_token, params=params
        )

