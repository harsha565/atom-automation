import asyncio
import os
import sys

# Ensure backend directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

async def main():
    async with engine.begin() as conn:
        result = await conn.execute(text("SELECT id, email, confirmed_at, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;"))
        rows = result.fetchall()
        print("Recent Users in Auth:")
        for r in rows:
            print(f"ID: {r[0]} | Email: {r[1]} | Confirmed At: {r[2]} | Created At: {r[3]}")

if __name__ == "__main__":
    asyncio.run(main())
