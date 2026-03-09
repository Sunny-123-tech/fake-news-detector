"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const login = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);
      const res = await fetch("https://fake-news-detector-1-z12g.onrender.com/api/auth/login", { method: "POST", body: formData });
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => window.location.href = "/", 1500);
      } else {
        setMessage("❌ " + (data.detail || "Login failed"));
      }
    } catch { setMessage("❌ Error connecting to API!"); }
    setLoading(false);
  };

  return (
    <main style={{backgroundColor:"#030712",minHeight:"100vh",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"12px",padding:"40px",width:"100%",maxWidth:"400px"}}>
        <h1 style={{fontSize:"28px",fontWeight:"bold",marginBottom:"8px",textAlign:"center"}}>🛡️ FakeShield</h1>
        <p style={{color:"#9ca3af",textAlign:"center",marginBottom:"32px"}}>Sign in to your account</p>
        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{width:"100%",backgroundColor:"#1f2937",border:"1px solid #374151",borderRadius:"8px",padding:"12px",color:"white",fontSize:"15px",marginBottom:"16px",boxSizing:"border-box"}}/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          style={{width:"100%",backgroundColor:"#1f2937",border:"1px solid #374151",borderRadius:"8px",padding:"12px",color:"white",fontSize:"15px",marginBottom:"24px",boxSizing:"border-box"}}/>
        <button onClick={login} disabled={loading}
          style={{width:"100%",backgroundColor:loading?"#6b7280":"#dc2626",color:"white",padding:"12px",borderRadius:"8px",border:"none",fontSize:"16px",fontWeight:"600",cursor:"pointer"}}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        {message && <p style={{marginTop:"16px",textAlign:"center",color: message.includes("✅")?"#22c55e":"#ef4444"}}>{message}</p>}
        <p style={{textAlign:"center",marginTop:"24px",color:"#9ca3af",fontSize:"14px"}}>
          Don't have an account? <a href="/register" style={{color:"#dc2626"}}>Register</a>
        </p>
      </div>
    </main>
  );
}
