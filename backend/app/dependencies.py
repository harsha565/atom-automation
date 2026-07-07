import logging
import uuid
from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.config import settings
from app.utils.security import decode_access_token
from app.models.user import User
from jose import JWTError

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="api/v1/auth/login",
    auto_error=False
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session exception: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    try:
        payload = decode_access_token(token)
        user_id_str: Optional[str] = payload.get("sub")
        if not user_id_str:
            raise credentials_exception
        user_id = uuid.UUID(user_id_str)
    except (JWTError, ValueError):
        raise credentials_exception

    user = await db.get(User, user_id)
    if not user:
        raise credentials_exception

    return user
