export default function Home() {
  return (
    <main style={{backgroundColor:"#030712",minHeight:"100vh",color:"white",fontFamily:"sans-serif"}}>
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 40px",borderBottom:"1px solid #1f2937"}}>
        <div style={{fontSize:"22px",fontWeight:"bold"}}>🛡️ FakeShield</div>
        <div style={{display:"flex",gap:"12px"}}>
          <a href="/login" style={{color:"#9ca3af",textDecoration:"none",padding:"8px 16px"}}>Login</a>
          <a href="/register" style={{backgroundColor:"#dc2626",color:"white",textDecoration:"none",padding:"8px 20px",borderRadius:"8px",fontWeight:"600"}}>Get Started</a>
        </div>
      </nav>

      <section style={{textAlign:"center",padding:"80px 24px 60px"}}>
        <div style={{display:"inline-block",backgroundColor:"#dc262622",border:"1px solid #dc262644",borderRadius:"20px",padding:"6px 16px",fontSize:"13px",color:"#ef4444",marginBottom:"24px"}}>
          🤖 Powered by AI & LLMs
        </div>
        <h1 style={{fontSize:"clamp(36px,6vw,72px)",fontWeight:"900",lineHeight:"1.1",marginBottom:"24px"}}>
          Detect Fake News<br/>
          <span style={{color:"#dc2626"}}>Instantly with AI</span>
        </h1>
        <p style={{fontSize:"18px",color:"#9ca3af",maxWidth:"600px",margin:"0 auto 40px",lineHeight:"1.7"}}>
          FakeShield uses advanced LLMs to analyze text, images, and videos for misinformation — in seconds.
        </p>
        <div style={{display:"flex",gap:"16px",justifyContent:"center",flexWrap:"wrap"}}>
          <a href="/analyze/text" style={{backgroundColor:"#dc2626",color:"white",textDecoration:"none",padding:"14px 32px",borderRadius:"8px",fontWeight:"700",fontSize:"16px"}}>
            🚀 Try Free Now
          </a>
          <a href="/dashboard" style={{backgroundColor:"#1f2937",color:"white",textDecoration:"none",padding:"14px 32px",borderRadius:"8px",fontWeight:"700",fontSize:"16px",border:"1px solid #374151"}}>
            📊 Dashboard
          </a>
        </div>
      </section>

      <section style={{padding:"20px 40px 60px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"16px",maxWidth:"900px",margin:"0 auto"}}>
          {[
            { icon:"📝", label:"Text Analysis",   desc:"Paste any article or news snippet",   href:"/analyze/text"  },
            { icon:"🖼️", label:"Image Detection", desc:"Spot manipulated or AI-generated images", href:"/analyze/image" },
            { icon:"🎬", label:"Video Analysis",  desc:"Detect deepfakes in video content",   href:"/analyze/video" },
            { icon:"📊", label:"Dashboard",       desc:"Track all your past analyses",        href:"/dashboard"     },
            { icon:"📋", label:"History",         desc:"View and filter all results",         href:"/history"       },
            { icon:"👤", label:"Profile",         desc:"Manage your account settings",        href:"/profile"       },
          ].map(item => (
            <a key={item.label} href={item.href} style={{backgroundColor:"#111827",border:"1px solid #1f2937",borderRadius:"12px",padding:"24px",textDecoration:"none",color:"white",display:"block",transition:"border-color 0.2s"}}>
              <div style={{fontSize:"32px",marginBottom:"12px"}}>{item.icon}</div>
              <div style={{fontWeight:"700",fontSize:"16px",marginBottom:"6px"}}>{item.label}</div>
              <div style={{color:"#6b7280",fontSize:"13px"}}>{item.desc}</div>
            </a>
          ))}
        </div>
      </section>

      <section style={{textAlign:"center",padding:"40px 24px 80px"}}>
        <div style={{display:"inline-flex",gap:"40px",backgroundColor:"#111827",border:"1px solid #1f2937",borderRadius:"16px",padding:"32px 48px",flexWrap:"wrap",justifyContent:"center"}}>
          {[
            { value:"99.2%", label:"Detection Accuracy" },
            { value:"50ms",  label:"Analysis Speed"     },
            { value:"3",     label:"Content Types"      },
            { value:"24/7",  label:"Always Available"   },
          ].map(s => (
            <div key={s.label} style={{textAlign:"center"}}>
              <div style={{fontSize:"32px",fontWeight:"900",color:"#dc2626"}}>{s.value}</div>
              <div style={{color:"#9ca3af",fontSize:"13px",marginTop:"4px"}}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{borderTop:"1px solid #1f2937",padding:"24px 40px",textAlign:"center",color:"#4b5563",fontSize:"13px"}}>
        🛡️ FakeShield — Built with Next.js, FastAPI, PostgreSQL & Claude AI
      </footer>
    </main>
  );
}
