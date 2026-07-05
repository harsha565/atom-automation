import asyncio
import asyncpg

async def run():
    conn_str = "postgresql://postgres:ATOM automation.26@db.lekjnclggscuaglqzavr.supabase.co:5432/postgres"
    try:
        conn = await asyncpg.connect(conn_str)
        rules = await conn.fetch("""
            SELECT
                tc.table_name, 
                kcu.column_name, 
                rc.delete_rule
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.referential_constraints AS rc
                  ON tc.constraint_name = rc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';
        """)
        print("Delete Rules for public schema tables:")
        for r in rules:
            print(f"  - {r['table_name']}.{r['column_name']}: ON DELETE {r['delete_rule']}")
        await conn.close()
    except Exception as e:
        print("Database error:", e)

asyncio.run(run())
