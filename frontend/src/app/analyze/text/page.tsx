"use client";
import { useState } from "react";

export default function TextAnalyze() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("https://fake-news-detector-1-z12g.onrender.com/api/analyze/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Error connecting to API!");
    }
    setLoading(false);
  };

  return (
    <main style={{backgroundColor:"#030712",minHeight:"100vh",color:"white",padding:"40px 24px"}}>
      <a href="/">Back to Home</a>
      <h1 style={{fontSize:"36px",fontWeight:"bold",margin:"24px 0"}}>?? Text Analyzer</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Paste news article here..."
        style={{width:"100%",maxWidth:"800px",height:"180px",backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"8px",padding:"16px",color:"white",display:"block"}}
      />
      <button onClick={analyze} disabled={loading}
        style={{marginTop:"16px",backgroundColor:"#dc2626",color:"white",padding:"12px 28px",borderRadius:"8px",border:"none",fontSize:"16px",cursor:"pointer"}}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {result && (
        <div style={{marginTop:"24px",backgroundColor:"#111827",padding:"24px",borderRadius:"12px",maxWidth:"800px"}}>
          <p style={{fontSize:"20px",color:"#ef4444"}}>Verdict: {result.verdict}</p>
          <p>Confidence: {(result.confidence*100).toFixed(1)}%</p>
          <p>Explanation: {result.explanation}</p>
        </div>
      )}
    </main>
  );
}
