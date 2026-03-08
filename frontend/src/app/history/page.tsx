"use client";
import { useState, useEffect } from "react";

export default function History() {
  const [filter, setFilter] = useState("ALL");

  const history = [
    { id:1, text:"Scientists discover coffee cures all cancers permanently...", verdict:"FAKE", confidence:97, type:"Text", date:"2024-01-15", color:"#ef4444" },
    { id:2, text:"Government passes new infrastructure budget bill...", verdict:"REAL", confidence:89, type:"Text", date:"2024-01-14", color:"#22c55e" },
    { id:3, text:"Celebrity deepfake video goes viral on social media...", verdict:"FAKE", confidence:94, type:"Video", date:"2024-01-13", color:"#ef4444" },
    { id:4, text:"NASA confirms water discovered on Mars surface...", verdict:"REAL", confidence:91, type:"Text", date:"2024-01-12", color:"#22c55e" },
    { id:5, text:"Manipulated protest image shared widely online...", verdict:"FAKE", confidence:88, type:"Image", date:"2024-01-11", color:"#ef4444" },
    { id:6, text:"Stock market reaches record high amid growth...", verdict:"REAL", confidence:85, type:"Text", date:"2024-01-10", color:"#22c55e" },
  ];

  const filtered = filter === "ALL" ? history : history.filter(h => h.verdict === filter);

  return (
    <main style={{backgroundColor:"#030712",minHeight:"100vh",color:"white",padding:"40px 24px"}}>
      <div style={{maxWidth:"900px",margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"32px"}}>
          <div>
            <a href="/dashboard" style={{color:"#9ca3af",textDecoration:"none",fontSize:"14px"}}>← Dashboard</a>
            <h1 style={{fontSize:"32px",fontWeight:"bold",marginTop:"8px"}}>📋 Analysis History</h1>
            <p style={{color:"#9ca3af"}}>All your past analyses in one place</p>
          </div>
        </div>

        <div style={{display:"flex",gap:"8px",marginBottom:"24px"}}>
          {["ALL","FAKE","REAL"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{padding:"8px 20px",borderRadius:"20px",border:"none",cursor:"pointer",fontWeight:"600",fontSize:"14px",
                backgroundColor: filter===f ? (f==="FAKE"?"#ef4444":f==="REAL"?"#22c55e":"#3b82f6") : "#1f2937",
                color: filter===f ? "white" : "#9ca3af"}}>
              {f}
            </button>
          ))}
          <span style={{marginLeft:"auto",color:"#9ca3af",fontSize:"14px",alignSelf:"center"}}>{filtered.length} results</span>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          {filtered.map(item => (
            <div key={item.id} style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"12px",padding:"20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:"500",marginBottom:"6px"}}>{item.text}</div>
                <div style={{display:"flex",gap:"16px",fontSize:"13px",color:"#9ca3af"}}>
                  <span>🗂 {item.type}</span>
                  <span>📅 {item.date}</span>
                  <span>🎯 {item.confidence}% confidence</span>
                </div>
              </div>
              <span style={{backgroundColor:item.color+"22",color:item.color,padding:"6px 16px",borderRadius:"20px",fontSize:"13px",fontWeight:"700",marginLeft:"16px",whiteSpace:"nowrap"}}>
                {item.verdict}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
