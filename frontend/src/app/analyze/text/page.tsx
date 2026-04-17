"use client";
import { useState } from "react";

export default function TextAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 180000);
      const res = await fetch("https://fake-news-detector-ysi0.onrender.com/api/analyze/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      if (e.name === "AbortError") {
        setError("Request timed out. The server is waking up - please try again!");
      } else {
        setError("Error connecting to API. Please try again in 30 seconds.");
      }
    }
    setLoading(false);
  };

  const getColor = (verdict: string) => {
    if (verdict?.includes("FAKE")) return "#ef4444";
    if (verdict === "REAL") return "#22c55e";
    return "#f59e0b";
  };

  return (
    <main style={{backgroundColor:"#030712",minHeight:"100vh",color:"white",padding:"40px 24px"}}>
      <div style={{maxWidth:"800px",margin:"0 auto"}}>
        <a href="/" style={{color:"#9ca3af",textDecoration:"none",fontSize:"14px"}}>? Back to Home</a>
        <h1 style={{fontSize:"32px",fontWeight:"bold",margin:"24px 0 8px"}}>?? Text Analyzer</h1>
        <p style={{color:"#9ca3af",marginBottom:"24px"}}>Paste any news article or claim to analyze</p>
        
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Paste news article or claim here..."
          style={{width:"100%",minHeight:"200px",backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"8px",padding:"16px",color:"white",fontSize:"15px",resize:"vertical",boxSizing:"border-box"}}/>
        
        <button onClick={analyze} disabled={loading || !text.trim()}
          style={{marginTop:"16px",backgroundColor:loading?"#374151":"#dc2626",color:"white",padding:"12px 32px",borderRadius:"8px",border:"none",fontSize:"16px",fontWeight:"600",cursor:loading?"not-allowed":"pointer"}}>
          {loading ? "? Analyzing... (may take 60s on first run)" : "?? Analyze"}
        </button>

        {error && (
          <div style={{marginTop:"24px",backgroundColor:"#1f2937",border:"1px solid #ef4444",borderRadius:"12px",padding:"20px"}}>
            <p style={{color:"#ef4444"}}>?? {error}</p>
          </div>
        )}

        {result && (
          <div style={{marginTop:"24px",backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"12px",padding:"24px"}}>
            <h2 style={{fontSize:"22px",fontWeight:"bold",color:getColor(result.verdict),marginBottom:"16px"}}>
              Verdict: {result.verdict}
            </h2>
            <p style={{color:"#d1d5db",marginBottom:"8px"}}>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
            <p style={{color:"#d1d5db",marginBottom:"8px"}}>Credibility Score: {(result.credibility_score * 100).toFixed(1)}%</p>
            <p style={{color:"#d1d5db",marginBottom:"16px"}}>Sentiment: {result.sentiment}</p>
            <div style={{backgroundColor:"#1f2937",borderRadius:"8px",padding:"16px"}}>
              <p style={{color:"#9ca3af",fontSize:"14px",fontWeight:"600",marginBottom:"8px"}}>AI EXPLANATION</p>
              <p style={{color:"#d1d5db",lineHeight:"1.6"}}>{result.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
