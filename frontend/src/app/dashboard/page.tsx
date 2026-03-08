"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }
    setUser({ username: "Sunny" });
  }, []);

  const cards = [
    { label: "Total Analyses", value: 12, color: "#3b82f6", icon: "📊" },
    { label: "Fake Detected",  value: 5,  color: "#ef4444", icon: "🚨" },
    { label: "Real Content",   value: 7,  color: "#22c55e", icon: "✅" },
    { label: "Accuracy",       value: "94%", color: "#f59e0b", icon: "🎯" },
  ];

  const recent = [
    { text: "Scientists discover coffee cures cancer...", verdict: "FAKE", confidence: "97%", type: "Text", color: "#ef4444" },
    { text: "Government passes new budget bill...",       verdict: "REAL", confidence: "89%", type: "Text", color: "#22c55e" },
    { text: "Celebrity deepfake video goes viral...",     verdict: "FAKE", confidence: "94%", type: "Video", color: "#ef4444" },
  ];

  return (
    <main style={{backgroundColor:"#030712",minHeight:"100vh",color:"white",padding:"40px 24px"}}>
      <div style={{maxWidth:"1000px",margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px"}}>
          <div>
            <h1 style={{fontSize:"32px",fontWeight:"bold"}}>🛡️ Dashboard</h1>
            <p style={{color:"#9ca3af",marginTop:"4px"}}>Welcome back, {user?.username}!</p>
          </div>
          <button onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
            style={{backgroundColor:"#1f2937",border:"1px solid #374151",color:"#9ca3af",padding:"8px 16px",borderRadius:"8px",cursor:"pointer",fontSize:"14px"}}>
            Sign Out
          </button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"32px"}}>
          {cards.map((c) => (
            <div key={c.label} style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"12px",padding:"20px"}}>
              <div style={{fontSize:"28px",marginBottom:"8px"}}>{c.icon}</div>
              <div style={{fontSize:"28px",fontWeight:"bold",color:c.color}}>{c.value}</div>
              <div style={{color:"#9ca3af",fontSize:"13px",marginTop:"4px"}}>{c.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{fontSize:"20px",fontWeight:"bold",marginBottom:"16px"}}>🔍 Analyze New Content</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginBottom:"32px"}}>
          {[
            { label:"Text Article", icon:"📝", href:"/analyze/text", color:"#dc2626" },
            { label:"Image",        icon:"🖼️", href:"/analyze/image", color:"#7c3aed" },
            { label:"Video",        icon:"🎬", href:"/analyze/video", color:"#0891b2" },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"12px",padding:"24px",textDecoration:"none",color:"white",textAlign:"center",display:"block"}}>
              <div style={{fontSize:"36px",marginBottom:"8px"}}>{item.icon}</div>
              <div style={{fontWeight:"600"}}>{item.label}</div>
              <div style={{color:item.color,fontSize:"13px",marginTop:"4px"}}>Analyze →</div>
            </a>
          ))}
        </div>

        <h2 style={{fontSize:"20px",fontWeight:"bold",marginBottom:"16px"}}>📋 Recent Analyses</h2>
        <div style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"12px",overflow:"hidden"}}>
          {recent.map((item, i) => (
            <div key={i} style={{padding:"16px 20px",borderBottom:i<recent.length-1?"1px solid #1f2937":"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:"500"}}>{item.text}</div>
                <div style={{color:"#9ca3af",fontSize:"13px",marginTop:"2px"}}>{item.type} • Confidence: {item.confidence}</div>
              </div>
              <span style={{backgroundColor:item.color+"22",color:item.color,padding:"4px 12px",borderRadius:"20px",fontSize:"13px",fontWeight:"600",whiteSpace:"nowrap",marginLeft:"16px"}}>{item.verdict}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
