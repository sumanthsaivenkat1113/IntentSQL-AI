from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    pass


engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def execute_sql(query: str, limit: int = 500):
    """
    Execute a read-only SQL query and return rows as list of dicts.
    Enforces a max row limit as a safety net.
    """
    with engine.connect() as conn:
        result = conn.execute(text(query))
        columns = list(result.keys())
        rows = result.fetchmany(limit)
        return [dict(zip(columns, row)) for row in rows]
