import asyncio
import asyncpg

async def run():
    conn_str = "postgresql://postgres:ATOM automation.26@db.lekjnclggscuaglqzavr.supabase.co:5432/postgres"
    try:
        conn = await asyncpg.connect(conn_str)
        
        # Query columns
        columns = await conn.fetch("""
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position;
        """)
        print("Columns in public schema tables:")
        current_table = ""
        for c in columns:
            if c['table_name'] != current_table:
                current_table = c['table_name']
                print(f"\nTable: {current_table}")
            print(f"  - {c['column_name']} ({c['data_type']})")
            
        # Query foreign key constraints
        fks = await conn.fetch("""
            SELECT
                tc.table_name, 
                kcu.column_name, 
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name 
            FROM 
                information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                  ON tc.constraint_name = kcu.constraint_name
                  AND tc.table_schema = kcu.table_schema
                JOIN information_schema.constraint_column_usage AS ccu
                  ON ccu.constraint_name = tc.constraint_name
                  AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';
        """)
        print("\nForeign Key Constraints in public schema:")
        for fk in fks:
            print(f"  - {fk['table_name']}.{fk['column_name']} -> {fk['foreign_table_name']}.{fk['foreign_column_name']}")
            
        await conn.close()
    except Exception as e:
        print("Database error:", e)

asyncio.run(run())
