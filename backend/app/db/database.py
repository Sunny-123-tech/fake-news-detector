from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

import certifi

# MySQL connection via PyMySQL
# Format: mysql+pymysql://user:password@host:port/dbname
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:Sunny%40123@localhost:3306/fakenews_db"
)

# Strip out query parameters from DATABASE_URL if the user added them,
# because we will manually supply the SSL connect_args for reliability.
clean_url = DATABASE_URL.split("?")[0]

engine = create_engine(
    clean_url,
    pool_pre_ping=True,
    pool_recycle=300,
    connect_args={
        "ssl": {
            "ca": certifi.where()
        }
    },
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