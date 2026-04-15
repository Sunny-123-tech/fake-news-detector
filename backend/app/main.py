from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, analyze, users
from app.db.database import engine, Base
import logging
from contextlib import asynccontextmanager

db_status = "Unknown"
db_error = ""

@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_status, db_error
    try:
        from app.models import user, analysis  # noqa: F401
        Base.metadata.create_all(bind=engine)
        logging.info("Database tables verified.")
        db_status = "Connected and tables created!"
        db_error = "None"
    except Exception as e:
        logging.error(f"Failed to connect to database on startup: {e}")
        db_status = "Connection Failed"
        db_error = str(e)
    yield

app = FastAPI(
    title="Fake News Detector API",
    description="AI-powered fake news detection for text, images and videos",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(analyze.router, prefix="/api/analyze", tags=["Analysis"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

@app.get("/")
def root():
    return {
        "status": "Fake News Detector API is running!", 
        "database": db_status, 
        "error": db_error
    }
