from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import random

router = APIRouter()

class TextAnalyzeRequest(BaseModel):
    text: str
    url: str = None

class AnalysisResult(BaseModel):
    verdict: str
    confidence: float
    credibility_score: float
    sentiment: str
    explanation: str

@router.post("/text", response_model=AnalysisResult)
def analyze_text(request: TextAnalyzeRequest):
    # Placeholder - ML model will be connected later
    return AnalysisResult(
        verdict="POSSIBLY FAKE",
        confidence=0.74,
        credibility_score=0.32,
        sentiment="negative",
        explanation="This is a placeholder response. ML model will be integrated in Phase E."
    )

@router.post("/image")
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    return {
        "filename": file.filename,
        "verdict": "AUTHENTIC",
        "confidence": 0.85,
        "ela_score": 0.12,
        "deepfake_probability": 0.08,
        "explanation": "Placeholder response. ML model will be integrated in Phase E."
    }

@router.post("/video")
async def analyze_video(file: UploadFile = File(...)):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File must be a video")
    return {
        "filename": file.filename,
        "verdict": "PROCESSING",
        "message": "Video analysis will be available after ML integration in Phase E."
    }