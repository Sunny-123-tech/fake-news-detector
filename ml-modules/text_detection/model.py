"""
Text-based Fake News Detection Module
Uses NLP techniques + Claude LLM for analysis
"""
import re
from typing import Dict

def preprocess_text(text: str) -> str:
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text.lower().strip()

def extract_features(text: str) -> Dict:
    words = text.split()
    sentences = text.split('.')
    
    sensational_words = ['shocking', 'breaking', 'viral', 'secret', 'exposed', 'conspiracy', 'miracle', 'banned']
    sensational_count = sum(1 for w in words if w.lower() in sensational_words)
    
    return {
        "word_count": len(words),
        "sentence_count": len(sentences),
        "avg_sentence_length": len(words) / max(len(sentences), 1),
        "sensational_word_count": sensational_count,
        "sensational_ratio": sensational_count / max(len(words), 1),
        "capital_ratio": sum(1 for c in text if c.isupper()) / max(len(text), 1),
        "exclamation_count": text.count('!'),
        "question_count": text.count('?'),
    }

def analyze_credibility(features: Dict) -> float:
    score = 1.0
    if features["sensational_ratio"] > 0.05:
        score -= 0.3
    if features["capital_ratio"] > 0.1:
        score -= 0.2
    if features["exclamation_count"] > 3:
        score -= 0.2
    if features["avg_sentence_length"] < 5:
        score -= 0.1
    return max(0.0, min(1.0, score))
