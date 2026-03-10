"""
Shared utilities for ML modules
"""
from datetime import datetime

def format_confidence(score: float) -> str:
    if score >= 0.9:
        return "Very High"
    elif score >= 0.7:
        return "High"
    elif score >= 0.5:
        return "Medium"
    else:
        return "Low"

def get_verdict_color(verdict: str) -> str:
    colors = {
        "FAKE": "#ef4444",
        "REAL": "#22c55e", 
        "POSSIBLY FAKE": "#f59e0b",
        "AUTHENTIC": "#22c55e",
        "MANIPULATED": "#ef4444",
        "DEEPFAKE": "#ef4444"
    }
    return colors.get(verdict, "#9ca3af")

def log_analysis(verdict: str, confidence: float, content_type: str):
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "verdict": verdict,
        "confidence": confidence,
        "content_type": content_type
    }
