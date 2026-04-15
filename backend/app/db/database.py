from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection string
DATABASE_URL = os.getenv("DATABASE_URL")

# Format: postgresql://user:password@host:port/dbname
if DATABASE_URL:
    # SQLAlchemy 1.4+ requires "postgresql://" instead of "postgres://"
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    # Fallback to local SQLite for fast local development
    DATABASE_URL = "sqlite:///./fakenews.db"

# Setting up the engine
if "sqlite" in DATABASE_URL:
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}, echo=False
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,        # reconnect if connection dropped
        pool_recycle=300,          # recycle connections every 5 min
        echo=False
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()