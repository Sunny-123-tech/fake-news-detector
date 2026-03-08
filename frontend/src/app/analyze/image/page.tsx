"use client";
import { useState } from "react";

export default function ImageAnalyze() {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [preview, setPreview] = useState<string|null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); }
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("http://localhost:8000/api/analyze/image", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch { alert("Error connecting to API!"); }
    setLoading(false);
  };

  return (
    <main style={{backgroundColor:"#030712",minHeight:"100vh",color:"white",padding:"40px 24px"}}>
      <a href="/" style={{color:"#9ca3af",textDecoration:"none"}}>← Back to Home</a>
      <h1 style={{fontSize:"36px",fontWeight:"bold",margin:"24px 0"}}>🖼️ Image Analyzer</h1>
      <input type="file" accept="image/*" onChange={handleFile}
        style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"8px",padding:"16px",color:"white",display:"block",marginBottom:"16px"}}/>
      {preview && <img src={preview} alt="preview" style={{maxWidth:"400px",borderRadius:"8px",marginBottom:"16px"}}/>}
      <button onClick={analyze} disabled={loading||!file}
        style={{backgroundColor:(!file||loading)?"#6b7280":"#dc2626",color:"white",padding:"12px 28px",borderRadius:"8px",border:"none",fontSize:"16px",cursor:"pointer"}}>
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>
      {result && (
        <div style={{marginTop:"24px",backgroundColor:"#111827",padding:"24px",borderRadius:"12px",maxWidth:"600px"}}>
          <p style={{fontSize:"20px",fontWeight:"bold",color: result.verdict==="AUTHENTIC"?"#22c55e":"#ef4444"}}>Verdict: {result.verdict}</p>
          <p>Confidence: {(result.confidence*100).toFixed(1)}%</p>
          <p>Deepfake Probability: {(result.deepfake_probability*100).toFixed(1)}%</p>
          <p>ELA Score: {result.ela_score}</p>
        </div>
      )}
    </main>
  );
}