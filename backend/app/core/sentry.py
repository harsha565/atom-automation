import logging
import sentry_sdk
from app.config import settings

logger = logging.getLogger(__name__)


def init_sentry() -> None:
    """
    Initializes the Sentry SDK for error logging and APM profiling.
    Only activates if settings.SENTRY_DSN is populated.
    """
    if not settings.SENTRY_DSN:
        logger.info("Sentry DSN is empty. Error monitoring is disabled.")
        return

    try:
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.APP_ENV,
            release="gym-whatsapp-api@1.0.0",
            traces_sample_rate=1.0,
            profiles_sample_rate=1.0,
        )
        logger.info(
            f"Sentry SDK initialized successfully (Env: '{settings.APP_ENV}')."
        )
    except Exception as e:
        logger.error(f"Failed to initialize Sentry SDK: {e}")
