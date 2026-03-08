"use client";
import { useState } from "react";

export default function Profile() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ username:"Sunny", email:"sunnywankhede3192@gmail.com", bio:"Engineering student building AI projects" });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const stats = [
    { label:"Analyses Run", value:12 },
    { label:"Fake Caught",  value:5  },
    { label:"Accuracy",     value:"94%" },
    { label:"Days Active",  value:7  },
  ];

  return (
    <main style={{backgroundColor:"#030712",minHeight:"100vh",color:"white",padding:"40px 24px"}}>
      <div style={{maxWidth:"700px",margin:"0 auto"}}>
        <a href="/dashboard" style={{color:"#9ca3af",textDecoration:"none",fontSize:"14px"}}>← Dashboard</a>
        <h1 style={{fontSize:"32px",fontWeight:"bold",margin:"8px 0 4px"}}>👤 Profile</h1>
        <p style={{color:"#9ca3af",marginBottom:"32px"}}>Manage your account settings</p>

        <div style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"12px",padding:"32px",marginBottom:"24px",textAlign:"center"}}>
          <div style={{width:"80px",height:"80px",borderRadius:"50%",backgroundColor:"#dc2626",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"32px",margin:"0 auto 16px"}}>
            {form.username[0]}
          </div>
          <div style={{fontSize:"22px",fontWeight:"bold"}}>{form.username}</div>
          <div style={{color:"#9ca3af",fontSize:"14px"}}>{form.email}</div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"24px"}}>
          {stats.map(s => (
            <div key={s.label} style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"10px",padding:"16px",textAlign:"center"}}>
              <div style={{fontSize:"22px",fontWeight:"bold",color:"#3b82f6"}}>{s.value}</div>
              <div style={{color:"#9ca3af",fontSize:"12px",marginTop:"4px"}}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{backgroundColor:"#111827",border:"1px solid #374151",borderRadius:"12px",padding:"32px"}}>
          <h2 style={{fontSize:"18px",fontWeight:"bold",marginBottom:"20px"}}>Edit Profile</h2>
          {[
            { label:"Username", key:"username", type:"text" },
            { label:"Email",    key:"email",    type:"email" },
            { label:"Bio",      key:"bio",      type:"text" },
          ].map(field => (
            <div key={field.key} style={{marginBottom:"16px"}}>
              <label style={{display:"block",color:"#9ca3af",fontSize:"13px",marginBottom:"6px"}}>{field.label}</label>
              <input type={field.type} value={form[field.key as keyof typeof form]}
                onChange={e => setForm({...form, [field.key]: e.target.value})}
                style={{width:"100%",backgroundColor:"#1f2937",border:"1px solid #374151",borderRadius:"8px",padding:"10px 14px",color:"white",fontSize:"15px",boxSizing:"border-box"}}/>
            </div>
          ))}
          <button onClick={save}
            style={{marginTop:"8px",backgroundColor:saved?"#22c55e":"#dc2626",color:"white",padding:"10px 28px",borderRadius:"8px",border:"none",fontSize:"15px",fontWeight:"600",cursor:"pointer"}}>
            {saved ? "✅ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  );
}
