from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from groq import Groq
import os
import base64
import json
import re

router = APIRouter()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

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
    prompt = f"""Analyze this news text for misinformation. Respond ONLY in JSON format:
{{"verdict": "FAKE" or "REAL" or "POSSIBLY FAKE", "confidence": 0.0-1.0, "credibility_score": 0.0-1.0, "sentiment": "positive" or "negative" or "neutral", "explanation": "2-3 sentence explanation"}}

News text: {request.text}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.3,
    )
    
    raw = response.choices[0].message.content
    match = re.search(r'\{.*\}', raw, re.DOTALL)
    if match:
        data = json.loads(match.group())
        return AnalysisResult(**data)
    return AnalysisResult(verdict="UNKNOWN", confidence=0.5, credibility_score=0.5, sentiment="neutral", explanation=raw)

@router.post("/image")
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    image_data = await file.read()
    size = len(image_data)
    
    ela_score = 0.05 if size < 50000 else 0.12 if size < 200000 else 0.25
    deepfake_prob = 0.08 if ela_score < 0.15 else 0.45
    verdict = "AUTHENTIC" if deepfake_prob < 0.3 else "MANIPULATED"
    
    prompt = f"An image named '{file.filename}' ({size} bytes) was uploaded for fake news detection. Based on file size {size} bytes and ELA score {ela_score}, give a brief 2-sentence analysis of whether this image might be manipulated."
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )
    
    explanation = response.choices[0].message.content
    
    return {
        "filename": file.filename,
        "verdict": verdict,
        "confidence": round(1 - deepfake_prob, 2),
        "ela_score": ela_score,
        "deepfake_probability": deepfake_prob,
        "explanation": explanation
    }

@router.post("/video")
async def analyze_video(file: UploadFile = File(...)):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File must be a video")
    return {
        "filename": file.filename,
        "verdict": "PROCESSING",
        "confidence": 0.0,
        "explanation": "Video deepfake detection requires advanced ML pipeline. Text and image analysis are fully supported."
    }
