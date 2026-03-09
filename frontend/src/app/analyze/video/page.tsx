"use client";
import { useState } from "react";

export default function VideoAnalyze() {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("https://fake-news-detector-1-z12g.onrender.com/api/analyze/video", { method: "POST", body: formData });
      const data = await res.json();
      setResult(data);
    } catch { alert("Error connecting to API!"); }
    setLoading(false);
  };

  return (
    <main style={{backgroundColor:"#030712",minHeight:"100vh",color:"white",padding:"40px 24px"}}>
      <a href="/" style={{color:"#9ca3af",textDecoration:"none"}}>← Back to Home</a>
      <h1 style={{fontSize:"36px",fontWeight:"bold",margin:"24px 0"}}>🎬 Video Analyzer</h1>
      <p style={{color:"#9ca3af",marginBottom:"24px"}}>Upload a video to detect deepfakes and misinformation</p>
      <input type="file" accept="video/*" onChange={handleFile}
        style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"8px",padding:"16px",color:"white",display:"block",marginBottom:"16px"}}/>
      {file && <p style={{color:"#9ca3af",marginBottom:"16px"}}>Selected: {file.name}</p>}
      <button onClick={analyze} disabled={loading||!file}
        style={{backgroundColor:(!file||loading)?"#6b7280":"#dc2626",color:"white",padding:"12px 28px",borderRadius:"8px",border:"none",fontSize:"16px",cursor:"pointer"}}>
        {loading ? "Analyzing..." : "Analyze Video"}
      </button>
      {result && (
        <div style={{marginTop:"24px",backgroundColor:"#111827",padding:"24px",borderRadius:"12px",maxWidth:"600px"}}>
          <p style={{fontSize:"20px",fontWeight:"bold",color:"#f59e0b"}}>Status: {result.verdict}</p>
          <p style={{color:"#9ca3af"}}>{result.message}</p>
        </div>
      )}
    </main>
  );
}
