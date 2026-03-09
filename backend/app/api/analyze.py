from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import anthropic
import os
import base64

router = APIRouter()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

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
    prompt = f"""Analyze this news text for misinformation. Respond ONLY in JSON format like this:
{{"verdict": "FAKE" or "REAL" or "POSSIBLY FAKE", "confidence": 0.0-1.0, "credibility_score": 0.0-1.0, "sentiment": "positive" or "negative" or "neutral", "explanation": "2-3 sentence explanation"}}

News text: {request.text}"""

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    import json, re
    raw = message.content[0].text
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
    base64_image = base64.standard_b64encode(image_data).decode("utf-8")
    
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=500,
        messages=[{"role": "user", "content": [
            {"type": "image", "source": {"type": "base64", "media_type": file.content_type, "data": base64_image}},
            {"type": "text", "text": "Analyze this image for signs of manipulation, deepfake, or misinformation. Respond in JSON: {\"verdict\": \"AUTHENTIC\" or \"MANIPULATED\" or \"DEEPFAKE\", \"confidence\": 0.0-1.0, \"explanation\": \"2-3 sentences\"}"}
        ]}]
    )
    
    import json, re
    raw = message.content[0].text
    match = re.search(r'\{.*\}', raw, re.DOTALL)
    if match:
        data = json.loads(match.group())
        return {"filename": file.filename, **data}
    return {"filename": file.filename, "verdict": "UNKNOWN", "confidence": 0.5, "explanation": raw}

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
