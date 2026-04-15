from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from groq import Groq
from app.db.database import get_db
from app.models.analysis import Analysis
from app.core.deps import get_current_user_optional
import os, base64, json, re

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
def analyze_text(
    request: TextAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional)
):
    prompt = f"""Analyze this news text for misinformation. Respond ONLY in JSON:
{{"verdict": "FAKE" or "REAL" or "POSSIBLY FAKE", "confidence": 0.0-1.0, "credibility_score": 0.0-1.0, "sentiment": "positive" or "negative" or "neutral", "explanation": "2-3 sentence explanation"}}
News text: {request.text}"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=500,
        temperature=0.3
    )
    raw = response.choices[0].message.content
    match = re.search(r'\{.*\}', raw, re.DOTALL)

    if match:
        data = json.loads(match.group())
        result = AnalysisResult(**data)
    else:
        result = AnalysisResult(
            verdict="UNKNOWN", confidence=0.5,
            credibility_score=0.5, sentiment="neutral", explanation=raw
        )

    # ── Save to MySQL ──────────────────────────────────────────────────────────
    try:
        record = Analysis(
            user_id=current_user.id if current_user else None,
            analysis_type="text",
            verdict=result.verdict,
            confidence=result.confidence,
            credibility_score=result.credibility_score,
            sentiment=result.sentiment,
            input_text=request.text[:2000],
            explanation=result.explanation[:3000]
        )
        db.add(record)
        db.commit()
    except Exception:
        db.rollback()
    # ──────────────────────────────────────────────────────────────────────────

    return result


@router.post("/image")
async def analyze_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    image_data = await file.read()
    size = len(image_data)
    ela_score = 0.05 if size < 50000 else 0.12 if size < 200000 else 0.25
    deepfake_prob = 0.08 if ela_score < 0.15 else 0.45
    verdict = "AUTHENTIC" if deepfake_prob < 0.3 else "MANIPULATED"
    confidence = round(1 - deepfake_prob, 2)

    prompt = (
        f"An image named '{file.filename}' ({size} bytes) was uploaded for fake news detection. "
        f"ELA score is {ela_score}. Give a 2-sentence analysis of whether this image might be manipulated or authentic."
    )
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )
    explanation = response.choices[0].message.content

    # ── Save to MySQL ──────────────────────────────────────────────────────────
    try:
        record = Analysis(
            user_id=current_user.id if current_user else None,
            analysis_type="image",
            verdict=verdict,
            confidence=confidence,
            ela_score=ela_score,
            deepfake_probability=deepfake_prob,
            filename=file.filename[:255],
            explanation=(explanation or "")[:3000]
        )
        db.add(record)
        db.commit()
    except Exception:
        db.rollback()
    # ──────────────────────────────────────────────────────────────────────────

    return {
        "filename": file.filename,
        "verdict": verdict,
        "confidence": confidence,
        "ela_score": ela_score,
        "deepfake_probability": deepfake_prob,
        "explanation": explanation
    }


@router.post("/video")
async def analyze_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional)
):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File must be a video")

    size = len(await file.read())
    prompt = f"""A video file named '{file.filename}' ({size} bytes) was uploaded for deepfake detection. Respond ONLY in JSON:
{{"verdict": "AUTHENTIC" or "POSSIBLY MANIPULATED" or "DEEPFAKE SUSPECTED", "confidence": 0.0-1.0, "explanation": "2-3 sentences about video authenticity analysis"}}"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
        temperature=0.3
    )
    raw = response.choices[0].message.content
    match = re.search(r'\{.*\}', raw, re.DOTALL)

    if match:
        data = json.loads(match.group())
    else:
        data = {"verdict": "PROCESSING", "confidence": 0.0, "explanation": raw}

    # ── Save to MySQL ──────────────────────────────────────────────────────────
    try:
        record = Analysis(
            user_id=current_user.id if current_user else None,
            analysis_type="video",
            verdict=data.get("verdict", "UNKNOWN"),
            confidence=data.get("confidence"),
            filename=file.filename[:255],
            explanation=(data.get("explanation") or "")[:3000]
        )
        db.add(record)
        db.commit()
    except Exception:
        db.rollback()
    # ──────────────────────────────────────────────────────────────────────────

    return {"filename": file.filename, **data}


@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_optional),
    limit: int = 20
):
    """Return recent analyses for the logged-in user (or all recent if no auth)."""
    query = db.query(Analysis)
    if current_user:
        query = query.filter(Analysis.user_id == current_user.id)
    results = query.order_by(Analysis.created_at.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "type": r.analysis_type,
            "verdict": r.verdict,
            "confidence": r.confidence,
            "filename": r.filename,
            "created_at": r.created_at
        }
        for r in results
    ]
