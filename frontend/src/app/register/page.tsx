"use client";
import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const register = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://fake-news-detector-1-z12g.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.email) {
        setMessage("✅ Account created! Redirecting to login...");
        setTimeout(() => window.location.href = "/login", 1500);
      } else {
        setMessage("❌ " + (data.detail || "Registration failed"));
      }
    } catch { setMessage("❌ Error connecting to API!"); }
    setLoading(false);
  };

  return (
    <main style={{backgroundColor:"#030712",minHeight:"100vh",color:"white",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"12px",padding:"40px",width:"100%",maxWidth:"400px"}}>
        <h1 style={{fontSize:"28px",fontWeight:"bold",marginBottom:"8px",textAlign:"center"}}>🛡️ FakeShield</h1>
        <p style={{color:"#9ca3af",textAlign:"center",marginBottom:"32px"}}>Create your account</p>
        <input type="email" placeholder="Email address" value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          style={{width:"100%",backgroundColor:"#1f2937",border:"1px solid #374151",borderRadius:"8px",padding:"12px",color:"white",fontSize:"15px",marginBottom:"16px",boxSizing:"border-box"}}/>
        <input type="text" placeholder="Username" value={form.username}
          onChange={(e) => setForm({...form, username: e.target.value})}
          style={{width:"100%",backgroundColor:"#1f2937",border:"1px solid #374151",borderRadius:"8px",padding:"12px",color:"white",fontSize:"15px",marginBottom:"16px",boxSizing:"border-box"}}/>
        <input type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          style={{width:"100%",backgroundColor:"#1f2937",border:"1px solid #374151",borderRadius:"8px",padding:"12px",color:"white",fontSize:"15px",marginBottom:"24px",boxSizing:"border-box"}}/>
        <button onClick={register} disabled={loading}
          style={{width:"100%",backgroundColor:loading?"#6b7280":"#dc2626",color:"white",padding:"12px",borderRadius:"8px",border:"none",fontSize:"16px",fontWeight:"600",cursor:"pointer"}}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
        {message && <p style={{marginTop:"16px",textAlign:"center",color:message.includes("✅")?"#22c55e":"#ef4444"}}>{message}</p>}
        <p style={{textAlign:"center",marginTop:"24px",color:"#9ca3af",fontSize:"14px"}}>
          Already have an account? <a href="/login" style={{color:"#dc2626"}}>Sign In</a>
        </p>
      </div>
    </main>
  );
}
