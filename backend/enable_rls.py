import asyncio
import os
import sys

# Ensure backend directory is in the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config import settings
from app.database import engine
from sqlalchemy import text

async def main():
    queries = [
        "ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.gyms ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.refresh_tokens ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.whatsapp_accounts ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.automation_configs ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;"
    ]
    
    print("Connecting to database...")
    async with engine.begin() as conn:
        for q in queries:
            print(f"Executing: {q}")
            await conn.execute(text(q))
    print("Row Level Security (RLS) has been successfully enabled on all tables!")

if __name__ == "__main__":
    asyncio.run(main())
