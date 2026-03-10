"""
Image Manipulation Detection Module
Uses Error Level Analysis (ELA) concept + Claude Vision API
"""
import base64
from typing import Dict

def encode_image_base64(image_bytes: bytes) -> str:
    return base64.standard_b64encode(image_bytes).decode("utf-8")

def calculate_ela_score(image_bytes: bytes) -> float:
    """
    Simulates Error Level Analysis score.
    Real ELA requires PIL/Pillow re-compression comparison.
    """
    size = len(image_bytes)
    if size < 50000:
        return 0.05
    elif size < 200000:
        return 0.12
    else:
        return 0.18

def analyze_metadata(filename: str) -> Dict:
    ext = filename.split(".")[-1].lower()
    return {
        "format": ext,
        "is_common_format": ext in ["jpg", "jpeg", "png", "webp"],
        "suspicious_name": any(w in filename.lower() for w in ["edit", "fake", "modified", "copy"])
    }
