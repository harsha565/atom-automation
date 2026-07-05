from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.schema import MetaData

# Define clean naming conventions for all database indexes, primary keys, foreign keys, and constraints.
# This prevents database-specific naming collisions and makes Alembic migrations robust and deterministic.
naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=naming_convention)


class Base(DeclarativeBase):
    """
    Main declarative base class for all database models.
    Centralizes metadata and naming conventions.
    """

    metadata = metadata
