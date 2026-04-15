from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    analysis_type = Column(String(20), nullable=False)   # text | image | video
    verdict = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=True)
    credibility_score = Column(Float, nullable=True)
    sentiment = Column(String(30), nullable=True)
    ela_score = Column(Float, nullable=True)
    deepfake_probability = Column(Float, nullable=True)
    filename = Column(String(255), nullable=True)
    input_text = Column(Text(length=2000), nullable=True)   # first 2000 chars of text input
    explanation = Column(Text(length=3000), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
