import asyncio
import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy import delete as sql_delete, or_, and_

from app.database import AsyncSessionLocal
from app.models.refresh_token import RefreshToken

# Setup basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def cleanup_expired_tokens() -> None:
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=1)

    async with AsyncSessionLocal() as db:
        try:
            stmt = sql_delete(RefreshToken).where(
                or_(
                    and_(RefreshToken.revoked == True, RefreshToken.updated_at < cutoff),
                    RefreshToken.expires_at < now
                )
            )
            result = await db.execute(stmt)
            await db.commit()
            
            deleted_count = result.rowcount
            print(f"Cleanup complete. Deleted {deleted_count} expired/revoked refresh tokens.")
            logger.info(f"Cleanup complete. Deleted {deleted_count} expired/revoked refresh tokens.")
        except Exception as e:
            logger.error(f"Error during token cleanup: {e}")
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(cleanup_expired_tokens())
