import asyncio
import os
import sys

# Ensure backend directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from sqlalchemy import text

async def main():
    print("Fetching RLS policies for all public tables...")
    async with engine.connect() as conn:
        result = await conn.execute(text(
            "SELECT tablename, policyname, cmd, qual, with_check FROM pg_policies WHERE schemaname = 'public';"
        ))
        policies = result.fetchall()
        if not policies:
            print("No RLS policies found for any public table.")
        for p in policies:
            print(f"Table: {p[0]}")
            print(f"Policy Name: {p[1]}")
            print(f"Command: {p[2]}")
            print(f"Filter (USING): {p[3]}")
            print(f"With Check (WITH CHECK): {p[4]}")
            print("-" * 40)

if __name__ == "__main__":
    asyncio.run(main())
