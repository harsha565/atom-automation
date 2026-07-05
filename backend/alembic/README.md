# Alembic Migrations

This folder will store all database migration scripts.
To generate a new migration, run:
```bash
alembic revision --autogenerate -m "migration description"
```
To apply migrations to the database, run:
```bash
alembic upgrade head
```
