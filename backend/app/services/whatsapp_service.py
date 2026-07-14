from datetime import datetime, timezone
import logging
import secrets
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.enums import AuditAction, TokenType, TokenSource, WhatsAppStatus
from app.core.exceptions import MetaAPIException, NotFoundException
from app.core.error_codes import ErrorCode
from app.models.user import User
from app.models.whatsapp import WhatsAppAccount
from app.models.audit_log import AuditLog
from app.services.gym_service import GymService
from app.services.meta_service import MetaService
from app.services.encryption_service import EncryptionService
from app.schemas.whatsapp import WhatsAppConnectRequest

logger = logging.getLogger(__name__)


class WhatsAppService:
    @staticmethod
    async def connect_whatsapp(
        db: AsyncSession, user: User, data: WhatsAppConnectRequest
    ) -> WhatsAppAccount:
        """
        Executes the Meta Embedded Signup connection flow:
        Exchanges code -> fetches business details -> WABA ID -> phone number -> encrypts -> stores/updates DB.
        """
        # 1. Fetch current user's gym profile (raises NotFoundException if missing)
        gym = await GymService.get_gym(db, user)

        # 2. Exchange authorization code for a long-lived access token
        token_data = await MetaService.exchange_code_for_token(
            data.authorization_code
        )
        access_token = token_data["access_token"]
        expires_in = token_data.get("expires_in", 0)

        # 3. Retrieve business accounts owned by the user
        businesses = await MetaService.get_business_accounts(access_token)
        biz_list = businesses.get("data", [])
        if not biz_list:
            logger.error(f"No business accounts found for user: {user.id}")
            raise MetaAPIException(
                message="No Meta Business Manager accounts linked to this profile.",
                code=ErrorCode.META_API_ERROR,
                status_code=400,
            )

        if data.business_id and data.waba_id and data.phone_number_id:
            # Verify submitted business_id exists in Meta retrieved list
            if not any(b.get("id") == data.business_id for b in biz_list):
                logger.error(f"Graph validation failure: Submitted business_id {data.business_id} not found in user's business accounts.")
                raise MetaAPIException(
                    message="Submitted business account ID is invalid or not owned by user.",
                    code=ErrorCode.META_API_ERROR,
                    status_code=400,
                )
            business_id = data.business_id
            logger.info("Graph validation success: business_id verified")

            # Retrieve WABAs owned by the resolved business account
            waba_accounts = await MetaService.get_waba_accounts(
                business_id, access_token
            )
            waba_list = waba_accounts.get("data", [])
            
            # Verify submitted waba_id exists in retrieved list
            if not any(w.get("id") == data.waba_id for w in waba_list):
                logger.error(f"Graph validation failure: Submitted waba_id {data.waba_id} not found in business's WABA list.")
                raise MetaAPIException(
                    message="Submitted WhatsApp Business Account ID is invalid or not owned by the business.",
                    code=ErrorCode.META_API_ERROR,
                    status_code=400,
                )
            waba_id = data.waba_id
            logger.info("Graph validation success: waba_id verified")

            # Retrieve phone number metadata linked to the WABA ID
            phone_numbers = await MetaService.get_phone_numbers(
                waba_id, access_token
            )
            phone_list = phone_numbers.get("data", [])
            
            # Verify submitted phone_number_id exists in retrieved list
            target_phone = None
            for p in phone_list:
                if p.get("id") == data.phone_number_id:
                    target_phone = p
                    break
            
            if not target_phone:
                logger.error(f"Graph validation failure: Submitted phone_number_id {data.phone_number_id} not found in WABA's phone number list.")
                raise MetaAPIException(
                    message="Submitted phone number ID is invalid or not registered under the WABA.",
                    code=ErrorCode.META_API_ERROR,
                    status_code=400,
                )
            
            phone_number_id = data.phone_number_id
            phone_number = target_phone.get("display_phone_number") or target_phone.get(
                "phone_number", ""
            )
            logger.info("Graph validation success: phone_number_id verified")

        else:
            # Fallback behavior (selecting the first account parameters)
            business_id = biz_list[0]["id"]

            # 4. Retrieve WABAs owned by the resolved business account
            waba_accounts = await MetaService.get_waba_accounts(
                business_id, access_token
            )
            waba_list = waba_accounts.get("data", [])
            if not waba_list:
                logger.error(f"No WhatsApp Business Accounts found for business: {business_id}")
                raise MetaAPIException(
                    message="No WhatsApp Business Accounts (WABA) found under the resolved business profile.",
                    code=ErrorCode.META_API_ERROR,
                    status_code=400,
                )
            waba_id = waba_list[0]["id"]

            # 5. Retrieve phone number metadata linked to the WABA ID
            phone_numbers = await MetaService.get_phone_numbers(
                waba_id, access_token
            )
            phone_list = phone_numbers.get("data", [])
            if not phone_list:
                logger.error(f"No phone numbers found for WABA ID: {waba_id}")
                raise MetaAPIException(
                    message="No phone numbers registered under the WhatsApp Business Account.",
                    code=ErrorCode.META_API_ERROR,
                    status_code=400,
                )
            # Select first available phone number
            phone_data = phone_list[0]
            phone_number = phone_data.get("display_phone_number") or phone_data.get(
                "phone_number", ""
            )
            phone_number_id = phone_data.get("id")

        if not phone_number_id:
            raise MetaAPIException(
                message="Meta API response is missing a valid phone_number_id.",
                code=ErrorCode.META_API_ERROR,
                status_code=500,
            )

        # 6. Encrypt sensitive parameters using Fernet Encryption Service
        encrypted_access_token = EncryptionService.encrypt(access_token)
        encrypted_waba_id = EncryptionService.encrypt(waba_id)
        encrypted_phone_number_id = EncryptionService.encrypt(phone_number_id)
        encrypted_business_account_id = EncryptionService.encrypt(business_id)

        # 6.5 Subscribe the app to the WABA to receive webhooks
        logger.info(f"Subscribing app to WABA: {waba_id}")
        await MetaService.subscribe_app_to_waba(waba_id, access_token)

        # 6.6 Register the phone number for Cloud API messaging with a system-generated PIN
        pin = "".join(secrets.choice("0123456789") for _ in range(6))
        logger.info(f"Registering phone number {phone_number_id} with system-generated PIN")
        await MetaService.register_phone_number(phone_number_id, access_token, pin)
        encrypted_pin = EncryptionService.encrypt(pin)

        # 7. Check if a WhatsApp Account connection already exists for the Gym
        stmt = (
            select(WhatsAppAccount)
            .where(WhatsAppAccount.gym_id == gym.id)
            .where(WhatsAppAccount.deleted_at.is_(None))
        )
        result = await db.execute(stmt)
        whatsapp_acc = result.scalar_one_or_none()

        from datetime import datetime, timezone, timedelta

        token_expires_at = (
            datetime.now(timezone.utc) +
            timedelta(seconds=expires_in)
            if expires_in > 0 else None
        )

        now = datetime.now(timezone.utc)

        if whatsapp_acc:
            logger.info(f"Updating existing WhatsApp account connection for gym: {gym.id}")
            whatsapp_acc.encrypted_access_token = encrypted_access_token
            whatsapp_acc.encrypted_waba_id = encrypted_waba_id
            whatsapp_acc.encrypted_phone_number_id = encrypted_phone_number_id
            whatsapp_acc.encrypted_business_account_id = (
                encrypted_business_account_id
            )
            whatsapp_acc.encrypted_pin = encrypted_pin
            whatsapp_acc.phone_number = phone_number
            whatsapp_acc.status = WhatsAppStatus.PENDING  # Default to PENDING
            whatsapp_acc.connected_at = now
            whatsapp_acc.token_type = TokenType.USER_TOKEN
            whatsapp_acc.token_source = TokenSource.EMBEDDED_SIGNUP
            whatsapp_acc.token_expires_at = token_expires_at
        else:
            logger.info(f"Creating new WhatsApp account connection for gym: {gym.id}")
            whatsapp_acc = WhatsAppAccount(
                gym_id=gym.id,
                encrypted_access_token=encrypted_access_token,
                encrypted_waba_id=encrypted_waba_id,
                encrypted_phone_number_id=encrypted_phone_number_id,
                encrypted_business_account_id=encrypted_business_account_id,
                encrypted_pin=encrypted_pin,
                phone_number=phone_number,
                status=WhatsAppStatus.PENDING,  # Default to PENDING
                connected_at=now,
                token_type=TokenType.USER_TOKEN,
                token_source=TokenSource.EMBEDDED_SIGNUP,
                token_expires_at=token_expires_at,
            )
            db.add(whatsapp_acc)

        # 8. Log the connection audit event
        audit_log = AuditLog(
            user_id=user.id,
            gym_id=gym.id,
            action=AuditAction.WHATSAPP_CONNECTED,
            log_metadata={"waba_id": waba_id, "phone_number": phone_number},
        )
        db.add(audit_log)

        await db.commit()
        await db.refresh(whatsapp_acc)

        # Set status to CONNECTED only after database commit is successful
        whatsapp_acc.status = WhatsAppStatus.CONNECTED
        await db.commit()
        await db.refresh(whatsapp_acc)

        return whatsapp_acc

    @staticmethod
    async def get_connection_status(db: AsyncSession, user: User) -> dict:
        """
        Retrieves connection metrics for the user's WhatsApp integration.
        """
        # Get gym profile
        gym = await GymService.get_gym(db, user)

        # Query WhatsApp Account status
        stmt = (
            select(WhatsAppAccount)
            .where(WhatsAppAccount.gym_id == gym.id)
            .where(WhatsAppAccount.deleted_at.is_(None))
        )
        result = await db.execute(stmt)
        whatsapp_acc = result.scalar_one_or_none()

        if not whatsapp_acc:
            return {
                "connected": False,
                "status": "DISCONNECTED",
                "phone_number": "",
            }

        return {
            "connected": True,
            "status": whatsapp_acc.status,
            "phone_number": whatsapp_acc.phone_number,
        }

    @staticmethod
    async def disconnect_whatsapp(db: AsyncSession, user: User) -> None:
        """
        Soft-deletes the active WhatsApp Account for the user's Gym.
        """
        gym = await GymService.get_gym(db, user)
        stmt = (
            select(WhatsAppAccount)
            .where(WhatsAppAccount.gym_id == gym.id)
            .where(WhatsAppAccount.deleted_at.is_(None))
        )
        result = await db.execute(stmt)
        whatsapp_acc = result.scalar_one_or_none()

        if not whatsapp_acc:
            raise NotFoundException(
                message="No connected WhatsApp Business Account found to disconnect.",
                code=ErrorCode.NOT_FOUND
            )

        # Decrypt access token and waba_id to call unsubscribe on disconnect
        try:
            access_token = EncryptionService.decrypt(whatsapp_acc.encrypted_access_token)
            waba_id = EncryptionService.decrypt(whatsapp_acc.encrypted_waba_id)
            logger.info(f"Unsubscribing app from WABA: {waba_id}")
            await MetaService.unsubscribe_app_from_waba(waba_id, access_token)
        except Exception as e:
            logger.error(f"Failed to unsubscribe app from WABA during disconnect: {e}")

        now = datetime.now(timezone.utc)
        whatsapp_acc.deleted_at = now

        # Audit log
        audit_log = AuditLog(
            user_id=user.id,
            gym_id=gym.id,
            action=AuditAction.WHATSAPP_DISCONNECTED,
            log_metadata={"phone_number": whatsapp_acc.phone_number},
        )
        db.add(audit_log)
        await db.commit()
