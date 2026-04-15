from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, analyze, users
from app.db.database import engine, Base

# Import all models so SQLAlchemy knows about them and creates tables
from app.models import user, analysis  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fake News Detector API",
    description="AI-powered fake news detection for text, images and videos",
    version="1.0.0"
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
    return {"status": "Fake News Detector API is running!", "database": "MySQL connected ✓"}
