import logging
import uuid
from typing import AsyncGenerator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import AsyncSessionLocal

logger = logging.getLogger(__name__)

from app.utils.security import decode_access_token
from app.models.user import User
from jose import JWTError

# Define the OAuth2 scheme for token retrieval
# Token URL points to the versioned login router
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login", auto_error=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency helper that yields an async database session.
    Ensures that database sessions are closed correctly after request completion.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            logger.error(f"Database session exception: {e}")
            await session.rollback()
            raise
        finally:
            await session.close()


import httpx
from app.config import settings
from app.models.gym import Gym

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme),
) -> User:
    """
    Retrieves the currently logged-in user by validating their Supabase JWT access token.
    If the user is authenticated on Supabase but doesn't exist in our local database yet,
    just-in-time provisions the User and Gym profile records.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    try:
        # Validate token with Supabase Auth API
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {token}",
                "apikey": settings.SUPABASE_ANON_KEY,
            }
            url = f"{settings.SUPABASE_URL}/auth/v1/user"
            response = await client.get(url, headers=headers)
            
            if response.status_code != 200:
                logger.error(f"Supabase auth validation failed: {response.text}")
                raise credentials_exception
            
            user_data = response.json()
            user_id_str = user_data.get("id")
            email = user_data.get("email")
            if not user_id_str or not email:
                raise credentials_exception
                
            user_id = uuid.UUID(user_id_str)
            user_metadata = user_data.get("user_metadata", {})
    except Exception as e:
        logger.error(f"Token validation error: {e}")
        raise credentials_exception

    # Query the user from the database
    user = await db.get(User, user_id)
    if not user:
        # Just-in-time provisioning of User and Gym profile
        try:
            user = User(
                id=user_id,
                email=email,
                password_hash="",  # Authenticated via Supabase
            )
            db.add(user)
            await db.flush()
            
            gym_name = user_metadata.get("gym_name") or user_metadata.get("businessName") or "My Gym"
            owner_name = user_metadata.get("owner_name") or user_metadata.get("businessName") or ""
            
            gym = Gym(
                id=uuid.uuid4(),
                user_id=user_id,
                gym_name=gym_name,
                owner_name=owner_name,
                phone="",
            )
            db.add(gym)
            await db.commit()
            logger.info(f"Just-in-time provisioned user {email} ({user_id}) and gym '{gym_name}'")
        except Exception as e:
            logger.error(f"Just-in-time provisioning failed: {e}")
            await db.rollback()
            raise credentials_exception

    return user

