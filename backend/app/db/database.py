from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# MySQL connection via PyMySQL
# Format: mysql+pymysql://user:password@host:port/dbname
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:Sunny%40123@localhost:3306/fakenews_db"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,        # reconnect if connection dropped
    pool_recycle=300,          # recycle connections every 5 min (cloud MySQL requirement)
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