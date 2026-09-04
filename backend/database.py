from sqlalchemy import create_engine, Column, String, inspect
from sqlalchemy.orm import sessionmaker
from models import Base, User
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./users.db")

_engine_kwargs = {}
if DATABASE_URL.startswith("sqlite"):
    _engine_kwargs["connect_args"] = {"check_same_thread": False}
else:
    _engine_kwargs["pool_pre_ping"] = True

engine = create_engine(DATABASE_URL, **_engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    # Lightweight migration: ensure any columns added to existing models exist
    # in pre-existing SQLite databases. (No-op on fresh databases.)
    if DATABASE_URL.startswith("sqlite"):
        inspector = inspect(engine)
        try:
            existing_cols = {
                col["name"] for col in inspector.get_columns("users")
            }
        except Exception:
            existing_cols = set()

        if "password_hash" not in existing_cols:
            with engine.connect() as conn:
                conn.exec_driver_sql("ALTER TABLE users ADD COLUMN password_hash VARCHAR")
                conn.commit()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()