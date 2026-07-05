import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import settings

logger = logging.getLogger(__name__)

# Configure SQLAlchemy connection pooling parameters.
# Since Supabase has connection limits, we configure reasonable pool sizes
# and use pool_pre_ping to verify connection health before utilizing it.
POOL_SIZE = 10
MAX_OVERFLOW = 5
POOL_RECYCLE = 1800  # Recycle connections after 30 minutes
POOL_PRE_PING = True

try:
    engine = create_async_engine(
        settings.DATABASE_URL,
        pool_size=POOL_SIZE,
        max_overflow=MAX_OVERFLOW,
        pool_recycle=POOL_RECYCLE,
        pool_pre_ping=POOL_PRE_PING,
        echo=settings.DEBUG,  # Echo SQL queries in development
        connect_args={"statement_cache_size": 0},
    )
except Exception as e:
    logger.error(f"Failed to create database engine: {e}")
    raise e

# Create an async sessionmaker instance
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


from app.models.base import Base
