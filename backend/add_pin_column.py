import asyncio
import os
import sys

# Ensure backend directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config import settings
from app.database import engine
from sqlalchemy import text

async def main():
    masked_url = settings.DATABASE_URL
    if "@" in masked_url:
        parts = masked_url.split("@")
        masked_url = parts[0].split(":")[0] + "://***:***@" + parts[1]
    print(f"Connecting to database: {masked_url}")
    async with engine.begin() as conn:
        await conn.execute(text(
            "ALTER TABLE public.whatsapp_accounts ADD COLUMN IF NOT EXISTS encrypted_pin TEXT NULL;"
        ))
    print("Migration completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
