import asyncio
import os
import sys

sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
)

from dotenv import load_dotenv
load_dotenv()

from app.database import AsyncSessionLocal
from app.models.user import User
from app.services.whatsapp_service import WhatsAppService
from sqlalchemy import select

async def main():
    async with AsyncSessionLocal() as db:
        # Get the first user
        stmt = select(User).limit(1)
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()
        if not user:
            print("No user found in DB!")
            return
        
        print(f"Testing for user: {user.email}")
        try:
            status = await WhatsAppService.get_connection_status(db, user)
            print("Status response:", status)
        except Exception as e:
            import traceback
            print("Exception raised in WhatsAppService.get_connection_status:")
            traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
