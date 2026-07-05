import asyncio
import asyncpg

async def run():
    conn_str = "postgresql://postgres:ATOM automation.26@db.lekjnclggscuaglqzavr.supabase.co:5432/postgres"
    try:
        conn = await asyncpg.connect(conn_str)
        tables = await conn.fetch("""
            SELECT table_schema, table_name 
            FROM information_schema.tables 
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
            ORDER BY table_schema, table_name;
        """)
        for t in tables:
            print(f"{t['table_schema']}.{t['table_name']}")
        await conn.close()
    except Exception as e:
        print("Database error:", e)

asyncio.run(run())
