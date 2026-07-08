from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from app.core.sentry import init_sentry

from app.config import settings
from app.core.exceptions import register_exception_handlers
from app.routers.auth import router as auth_router
from app.routers.gym import router as gym_router
from app.routers.whatsapp import router as whatsapp_router
from app.routers.webhook import router as webhook_router
from app.routers.automation import router as automation_router
from app.routers.health import router as health_router
from app.routers.internal import router as internal_router
from app.core.limiter import limiter

# Configure logging format and default severity level based on DEBUG flag
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize Sentry SDK
init_sentry()


# SlowAPI rate limiter is imported from core.limiter


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Modern lifespan context manager to handle application startup and shutdown events.
    Replaces deprecated @app.on_event("startup" / "shutdown") syntax.
    """
    logger.info(
        f"Starting up {settings.APP_NAME} in environment: '{settings.APP_ENV}'"
    )
    yield
    logger.info(f"Shutting down {settings.APP_NAME}...")


# Create FastAPI application instance
app = FastAPI(
    title="Gym WhatsApp Automation API",
    version="1.0.0",
    lifespan=lifespan,
    debug=settings.DEBUG,
)

# Register global custom error handlers
register_exception_handlers(app)

# Connect slowapi Limiter state and configure global handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Register CORS Middleware using configured ALLOWED_ORIGINS
if settings.ALLOWED_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info(f"CORS middleware configured for origins: {settings.ALLOWED_ORIGINS}")
else:
    logger.warning("CORS middleware: No origins specified. Server is locked.")

# Mount API Routers under version namespace `/api/v1`
app.include_router(auth_router, prefix="/api/v1")
app.include_router(gym_router, prefix="/api/v1")
app.include_router(whatsapp_router, prefix="/api/v1")
app.include_router(webhook_router, prefix="/api/v1")
app.include_router(automation_router, prefix="/api/v1")
app.include_router(health_router, prefix="/api/v1")
app.include_router(internal_router, prefix="/api/v1")

logger.info("API version 1.0.0 routes registered successfully.")
