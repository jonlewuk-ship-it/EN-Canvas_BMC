import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   GLOBAL STYLES injected once
───────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Inter', sans-serif; background: #06090f; color: #e2e8f8; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e3050; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #2d4a78; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,209,0,0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(255,209,0,0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  .chip-enter { animation: fadeUp 0.22s ease forwards; }
  .card-hover { transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s; }
  .card-hover:hover { transform: translateY(-1px); }
  .btn-icon { transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.12s; }
  .btn-icon:hover { transform: scale(1.1); }
  .seg-btn-anim { transition: background 0.15s, border-color 0.15s, transform 0.12s; }
  .seg-btn-anim:hover { transform: translateX(3px); }
`;

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const Y = "#ffd100";
const MONO = "'JetBrains Mono', monospace";

const CATS = [
  { key:"critical",    color:"#ff4d4d", label:"Critical",      desc:"Blocker / must-have"   },
  { key:"high",        color:"#ff8c00", label:"High",          desc:"Significant importance" },
  { key:"medium",      color:Y,         label:"Medium",        desc:"Moderate priority"      },
  { key:"low",         color:"#4ade80", label:"Low / Done",    desc:"Minor or resolved"      },
  { key:"opportunity", color:"#60a5fa", label:"Opportunity",   desc:"Growth potential"       },
  { key:"risk",        color:"#c084fc", label:"Risk",          desc:"Threat to address"      },
  { key:"strength",    color:"#22d3ee", label:"Strength",      desc:"Core advantage"         },
  { key:"info",        color:"#94a3b8", label:"Info",          desc:"General reference"      },
];
const cc  = k => CATS.find(c=>c.key===k)?.color ?? Y;
const cl  = k => CATS.find(c=>c.key===k)?.label ?? k;
const mkId= () => "e"+Date.now().toString(36)+Math.random().toString(36).slice(2,5);

const SECTIONS = {
  kp:   { name:"Key Partners",           num:"01", accent:"#60a5fa", icon:"🤝", hint:"Key suppliers, alliances & partners"       },
  ka:   { name:"Key Activities",         num:"02", accent:"#c084fc", icon:"⚙️", hint:"Core processes to deliver value"            },
  vp:   { name:"Value Propositions",     num:"03", accent:Y,         icon:"💎", hint:"What unique value do we deliver?"           },
  cr:   { name:"Customer Relationships", num:"04", accent:"#22d3ee", icon:"💬", hint:"How we engage each segment"                 },
  cs:   { name:"Customer Segments",      num:"05", accent:"#4ade80", icon:"👥", hint:"Click any segment to trace its success →"  },
  kr:   { name:"Key Resources",          num:"06", accent:"#818cf8", icon:"🏗️", hint:"Physical, IP, human & financial assets"     },
  ch:   { name:"Channels",               num:"07", accent:"#38bdf8", icon:"📡", hint:"How we reach our customers"                 },
  cost: { name:"Cost Structure",         num:"08", accent:"#ff4d4d", icon:"📉", hint:"Most significant costs in the model"        },
  rev:  { name:"Revenue Streams",        num:"09", accent:"#4ade80", icon:"📈", hint:"Revenue generated per segment"              },
  notes:{ name:"Brainstorm & Notes",     num:"💡", accent:"#fb923c", icon:"🧠", hint:"Free-form ideas, hypotheses & open questions"},
};
const LINKABLE = ["vp","cr","ch","kp","ka","kr","rev"];
const ALL_SIDS  = Object.keys(SECTIONS);

/* ─────────────────────────────────────────────────────────
   DEMO SEED DATA  — expanded AECO/BIM segments
───────────────────────────────────────────────────────── */
const SA=mkId(),SC=mkId(),SO=mkId(),SB=mkId(),SI=mkId(),SP=mkId();

const DEMO = {
  cs:[
    {id:SA, text:"Architecture & AEC Design Firms",          cat:"strength",    segs:[]},
    {id:SC, text:"General Contractors & BIM Managers",       cat:"high",        segs:[]},
    {id:SO, text:"Building Owners & Facility Managers",      cat:"opportunity", segs:[]},
    {id:SB, text:"BIM Consultants & Digital Delivery Firms", cat:"strength",    segs:[]},
    {id:SI, text:"Infrastructure & Asset Management Cos.",   cat:"opportunity", segs:[]},
    {id:SP, text:"Public Authorities, Municipalities & Ministries", cat:"high", segs:[]},
  ],
  kp:[
    {id:mkId(),text:"Autodesk & Graphisoft reseller network",       cat:"strength",    segs:[SA,SC,SB]},
    {id:mkId(),text:"IFC / buildingSMART international standards",  cat:"info",        segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"Cloud infrastructure providers (AWS / Azure)", cat:"high",        segs:[SA,SC,SB]},
    {id:mkId(),text:"University BIM research partnerships",         cat:"opportunity", segs:[SA,SB]},
    {id:mkId(),text:"National BIM mandating bodies & regulators",   cat:"strength",    segs:[SP,SI]},
  ],
  ka:[
    {id:mkId(),text:"Continuous IFC compliance engine development",      cat:"critical",    segs:[SA,SC,SB]},
    {id:mkId(),text:"BIM model validation, clash detection & QA",        cat:"high",        segs:[SC,SB]},
    {id:mkId(),text:"Customer onboarding & BIM implementation support",  cat:"strength",    segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"SDK & API integration for third-party tools",       cat:"opportunity", segs:[SA,SC,SB]},
    {id:mkId(),text:"Public sector procurement & tender support",        cat:"high",        segs:[SP,SI]},
  ],
  kr:[
    {id:mkId(),text:"Proprietary IFC parsing & geometry engine",     cat:"strength",    segs:[SA,SC,SB]},
    {id:mkId(),text:"AECO domain expert team (50+ engineers)",       cat:"high",        segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"ISO 19650 certification & compliance library",  cat:"strength",    segs:[SC,SO,SP,SI]},
    {id:mkId(),text:"Cloud-based model repository infrastructure",   cat:"medium",      segs:[SA,SB]},
    {id:mkId(),text:"GIS & infrastructure data integrations layer",  cat:"opportunity", segs:[SI,SP]},
  ],
  vp:[
    {id:mkId(),text:"Only fully openBIM-native platform — zero vendor lock-in",       cat:"strength",    segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"Real-time IFC4.3 validation reducing coordination errors by 60%",cat:"critical",    segs:[SC,SB]},
    {id:mkId(),text:"Single source of truth for entire project lifecycle",             cat:"high",        segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"AI-assisted clash detection & automated BIM audits",             cat:"opportunity", segs:[SA,SC,SB]},
    {id:mkId(),text:"Digital twin ready — seamless FM handover package",              cat:"strength",    segs:[SO,SI,SP]},
    {id:mkId(),text:"ISO 19650 & EU BIM mandate compliance out of the box",           cat:"high",        segs:[SP,SI,SB]},
  ],
  cr:[
    {id:mkId(),text:"Dedicated BIM Success Manager per enterprise account", cat:"strength",    segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"ACCA Academy — online BIM certification programme",    cat:"high",        segs:[SA,SC,SB]},
    {id:mkId(),text:"Community forum for openBIM practitioners",            cat:"medium",      segs:[SA,SC,SB]},
    {id:mkId(),text:"Quarterly executive business reviews",                 cat:"opportunity", segs:[SO,SP,SI]},
    {id:mkId(),text:"Government & public sector engagement programme",      cat:"high",        segs:[SP,SI]},
  ],
  ch:[
    {id:mkId(),text:"Direct SaaS subscription via acca.it platform",    cat:"strength",    segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"Authorised reseller network across 40+ countries", cat:"high",        segs:[SA,SC,SB]},
    {id:mkId(),text:"BIM conferences & buildingSMART events",           cat:"medium",      segs:[SA,SC,SB]},
    {id:mkId(),text:"Partner integrations (Revit, ArchiCAD, Navisworks)",cat:"opportunity",segs:[SA,SC,SB]},
    {id:mkId(),text:"Public tender & e-procurement platforms",          cat:"high",        segs:[SP,SI]},
  ],
  cost:[
    {id:mkId(),text:"R&D — IFC engine & AI feature development",   cat:"critical", segs:[]},
    {id:mkId(),text:"Cloud hosting & storage infrastructure",       cat:"high",     segs:[]},
    {id:mkId(),text:"Sales & partner channel commissions",          cat:"medium",   segs:[]},
    {id:mkId(),text:"ISO 19650 compliance & certification audits",  cat:"medium",   segs:[]},
  ],
  rev:[
    {id:mkId(),text:"Enterprise SaaS licences (annual ARR)",       cat:"strength",    segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"Professional Services — BIM implementation",  cat:"high",        segs:[SC,SO,SB,SI,SP]},
    {id:mkId(),text:"ACCA Academy certification fees",             cat:"medium",      segs:[SA,SC,SB]},
    {id:mkId(),text:"API usage & white-label SDK licensing",       cat:"opportunity", segs:[SA,SC,SB]},
    {id:mkId(),text:"Public sector framework contracts",           cat:"high",        segs:[SP,SI]},
  ],
  notes:[
    {id:mkId(),text:"Explore AI-driven code checking for building permits in EU municipalities — massive untapped public sector TAM",cat:"opportunity",segs:[]},
    {id:mkId(),text:"BIM Consultants segment growing 30% YoY — consider dedicated onboarding track and reseller tier",              cat:"high",       segs:[]},
    {id:mkId(),text:"Infrastructure management cos. need GIS ↔ IFC bridge — evaluate partnership with Esri / Bentley",             cat:"risk",       segs:[]},
  ],
};

/* ─────────────────────────────────────────────────────────
   BIM BACKGROUND
───────────────────────────────────────────────────────── */
function BimBg(){
  return(
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" style={{width:"100%",height:"100%"}}>
        <defs>
          <radialGradient id="rg1" cx="50%" cy="42%" r="70%">
            <stop offset="0%" stopColor="#0b1525"/><stop offset="100%" stopColor="#06090f"/>
          </radialGradient>
          <radialGradient id="rgy" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd100" stopOpacity="0.07"/><stop offset="100%" stopColor="#ffd100" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="rgb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.06"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </radialGradient>
          <filter id="gf"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="1600" height="900" fill="url(#rg1)"/>
        <ellipse cx="800" cy="380" rx="660" ry="430" fill="url(#rgy)"/>
        <ellipse cx="140" cy="730" rx="390" ry="310" fill="url(#rgb)"/>
        <ellipse cx="1460" cy="175" rx="330" ry="250" fill="url(#rgb)"/>
        <g stroke="#18284a" strokeWidth="0.5" opacity="0.4">
          {[100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500].map(x=><line key={x} x1={x} y1="0" x2={x} y2="900"/>)}
          {[100,200,300,400,500,600,700,800].map(y=><line key={y} x1="0" y1={y} x2="1600" y2={y}/>)}
        </g>
        {/* Building left */}
        <g stroke="#1e3a6a" strokeWidth="1" fill="none" opacity="0.45" transform="translate(36,150)">
          <polygon points="0,320 0,70 170,0 340,70 340,320" stroke="#2a4d88" fill="#091422" fillOpacity="0.55"/>
          <polygon points="0,70 170,0 340,70 170,140" stroke="#3b6ab5" fill="#0e1e3a" fillOpacity="0.45"/>
          <polygon points="340,70 340,320 440,240 440,0 170,0 340,70" fill="#07101e" fillOpacity="0.5"/>
          {[26,138,252].map(x=>[115,198].map(y=><rect key={`${x}${y}`} x={x} y={y} width="44" height="52" stroke="#2560b8" strokeWidth="0.8" fill="#1a3a6e" fillOpacity="0.3"/>))}
        </g>
        {/* Building right */}
        <g stroke="#1e3a6a" strokeWidth="1" fill="none" opacity="0.34" transform="translate(1110,44)">
          <polygon points="0,460 0,50 190,0 380,50 380,460" stroke="#2a4d88" fill="#091422" fillOpacity="0.45"/>
          <polygon points="0,50 190,0 380,50 190,100" stroke="#3b6ab5" fill="#0e1e3a" fillOpacity="0.38"/>
          <polygon points="380,50 380,460 480,380 480,-38 190,0 380,50" fill="#07101e" fillOpacity="0.4"/>
          {[24,148,272].map(x=>[105,205,305].map(y=><rect key={`${x}${y}`} x={x} y={y} width="48" height="56" stroke="#2560b8" strokeWidth="0.8" fill="#1a3a6e" fillOpacity="0.22"/>))}
        </g>
        {/* Floor plan */}
        <g stroke="#1a3060" strokeWidth="0.9" fill="none" opacity="0.18" transform="translate(1055,8)">
          <rect x="0" y="0" width="320" height="216" stroke="#2a4d88"/>
          <line x1="0" y1="88" x2="320" y2="88"/>
          <line x1="130" y1="0" x2="130" y2="88"/>
          <line x1="190" y1="88" x2="190" y2="216"/>
          <rect x="16" y="16" width="68" height="46" stroke="#1e3a6a"/><rect x="154" y="16" width="68" height="46" stroke="#1e3a6a"/>
          <rect x="16" y="112" width="86" height="70" stroke="#1e3a6a"/><rect x="208" y="112" width="86" height="70" stroke="#1e3a6a"/>
          <path d="M16,88 A46,46 0 0,1 62,42" stroke="#3b6ab5" strokeWidth="0.8"/>
        </g>
        {/* IFC nodes */}
        <g opacity="0.18" filter="url(#gf)">
          {[[498,762],[620,802],[700,732],[800,782],[880,722],[980,762],[1060,800],[760,852]].map(([cx,cy],i)=>
            <circle key={i} cx={cx} cy={cy} r={[6,5,7,4,6,5,4,5][i]} fill={[Y,"#60a5fa",Y,"#4ade80",Y,"#60a5fa","#c084fc","#22d3ee"][i]}/>)}
          {[[498,762,700,732],[700,732,800,782],[700,732,880,722],[880,722,980,762],[800,782,760,852],[498,762,620,802]].map(([x1,y1,x2,y2],i)=>
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={Y} strokeWidth="1"/>)}
        </g>
        {/* Axes */}
        <g opacity="0.14" transform="translate(1460,790)">
          <line x1="0" y1="0" x2="70" y2="0" stroke="#ff4d4d" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="0" y2="-70" stroke="#4ade80" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="-45" y2="-45" stroke="#60a5fa" strokeWidth="1.5"/>
          <polygon points="70,0 60,-3.5 60,3.5" fill="#ff4d4d"/>
          <polygon points="0,-70 -3.5,-60 3.5,-60" fill="#4ade80"/>
          <polygon points="-45,-45 -41,-33 -33,-41" fill="#60a5fa"/>
          <text x="74" y="4" fill="#ff4d4d" fontSize="9" fontFamily="monospace">X</text>
          <text x="-5" y="-74" fill="#4ade80" fontSize="9" fontFamily="monospace">Z</text>
          <text x="-58" y="-49" fill="#60a5fa" fontSize="9" fontFamily="monospace">Y</text>
        </g>
        <text x="24" y="892" fill="#192d4a" fontSize="8.5" fontFamily="monospace" opacity="0.55">IFC4.3 · ISO 19650 · openBIM · buildingSMART · EU BIM Mandate</text>
        <text x="1080" y="892" fill="#192d4a" fontSize="8.5" fontFamily="monospace" opacity="0.55">AECO / BIM Industry · ACCA software S.p.A.</text>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   RESPONSIVE HOOK
───────────────────────────────────────────────────────── */
function useWW(){
  const [w,setW]=useState(typeof window!=="undefined"?window.innerWidth:1200);
  useEffect(()=>{
    const h=()=>setW(window.innerWidth);
    window.addEventListener("resize",h);
    return()=>window.removeEventListener("resize",h);
  },[]);
  return w;
}

/* ─────────────────────────────────────────────────────────
   HERO HEADER  — fully responsive
───────────────────────────────────────────────────────── */
function HeroHeader({kpis,pct,drawerOpen,onToggleDrawer,onAddEntry}){
  const w=useWW();
  const mobile=w<640;
  const tablet=w<1024;

  return(
    <header style={{position:"sticky",top:0,zIndex:200,
      background:"rgba(4,7,14,0.94)",
      backdropFilter:"blur(20px) saturate(1.6)",
      WebkitBackdropFilter:"blur(20px) saturate(1.6)",
      borderBottom:"1px solid rgba(30,52,90,0.7)",
      overflow:"hidden",
    }}>
      {/* shimmer line */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",
        background:`linear-gradient(90deg,transparent,${Y} 20%,#fff 50%,${Y} 80%,transparent)`,
        opacity:.9,pointerEvents:"none"}}/>
      {/* dot grid */}
      <div style={{position:"absolute",inset:0,
        backgroundImage:"radial-gradient(circle,rgba(255,209,0,0.03) 1px,transparent 1px)",
        backgroundSize:"28px 28px",pointerEvents:"none"}}/>

      {/* ── ROW 1: brand + actions (always visible) ── */}
      <div style={{position:"relative",zIndex:1,
        display:"flex",alignItems:"center",gap:10,
        padding: mobile?"10px 14px":"12px 22px 8px",
      }}>
        {/* Logo mark */}
        <div style={{
          width: mobile?36:42, height: mobile?36:42,
          background:Y, borderRadius:9, flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:"0 0 20px rgba(255,209,0,0.35)",
        }}>
          <svg viewBox="0 0 28 28" fill="none" width={mobile?20:24} height={mobile?20:24}>
            <path d="M3 24L10.2 4h3.6L21 24h-4l-1.7-4.8H8.7L7 24H3zm7-8h7l-3.5-9.4L10 16z" fill="#050505"/>
            <rect x="22" y="4" width="3" height="20" rx="1.5" fill="#050505" opacity="0.35"/>
          </svg>
        </div>

        {/* Title */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"baseline",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:mobile?17:21,fontWeight:900,color:"#fff",letterSpacing:"-0.5px",lineHeight:1}}>ACCA</span>
            <span style={{fontSize:mobile?17:21,fontWeight:900,color:Y,letterSpacing:"-0.5px",lineHeight:1}}>Strategic Canvas</span>
            {!mobile&&(
              <span style={{fontSize:9,fontWeight:700,color:"rgba(255,209,0,0.9)",
                background:"rgba(255,209,0,0.1)",border:"1px solid rgba(255,209,0,0.3)",
                padding:"2px 7px",borderRadius:20,fontFamily:MONO,letterSpacing:"0.5px",
                alignSelf:"center",whiteSpace:"nowrap"}}>BIM·AECO Sectors</span>
            )}
          </div>
          <div style={{fontSize:mobile?7.5:8,color:"rgba(255,255,255,30)",fontFamily:MONO,
            letterSpacing:"1.6px",textTransform:"uppercase",marginTop:2,
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {mobile?"BMC · AECO / BIM":"Business Model Canvas · AECO / BIM Industry"}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
          {/* Story View — icon-only on mobile */}
          <button onClick={onToggleDrawer} className="btn-icon" style={{
            background:drawerOpen?"rgba(34,211,238,0.12)":"rgba(255,255,255,0.05)",
            border:`1px solid ${drawerOpen?"rgba(34,211,238,0.5)":"rgba(30,52,90,0.7)"}`,
            color:drawerOpen?"#22d3ee":"rgba(255,255,255,0.6)",
            padding: mobile?"7px":"7px 13px",
            borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",
            display:"flex",alignItems:"center",gap:5,fontFamily:"'Inter',sans-serif",
            minWidth: mobile?36:undefined, justifyContent:"center",
          }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M6.5 4v2.5l1.8 1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {!mobile&&"Story View"}
          </button>
          {/* Add Entry — icon+text or icon-only */}
          <button onClick={onAddEntry} className="btn-icon" style={{
            background:Y,border:"none",color:"#060606",
            padding: mobile?"7px":"7px 15px",
            borderRadius:8,fontSize:11,fontWeight:800,cursor:"pointer",
            display:"flex",alignItems:"center",gap:5,fontFamily:"'Inter',sans-serif",
            boxShadow:"0 0 18px rgba(255,209,0,0.3)",
            minWidth: mobile?36:undefined, justifyContent:"center",
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {!mobile&&"Add Entry"}
          </button>
        </div>
      </div>

      {/* ── ROW 2: KPI tiles — scrollable row on mobile ── */}
      <div style={{position:"relative",zIndex:1,
        display:"flex",gap:5,
        padding: mobile?"0 14px 8px":"0 22px 8px",
        overflowX:"auto",overflowY:"hidden",
        scrollbarWidth:"none",
      }}>
        {kpis.map((k,i)=>(
          <div key={i} style={{
            background:"rgba(255,255,255,0.05)",
            border:"1px solid rgba(30,52,90,0.7)",
            borderRadius:8,
            padding: mobile?"6px 10px":"7px 14px",
            textAlign:"center",
            flexShrink:0,
            minWidth: mobile?60:72,
            position:"relative",overflow:"hidden",
          }}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",
              background:k.c,boxShadow:`0 0 8px ${k.c}80`}}/>
            <div style={{
              fontSize: mobile?16:20,
              fontWeight:900,color:"#fff",fontFamily:MONO,
              letterSpacing:"-1px",lineHeight:1,
            }}>{k.v}</div>
            <div style={{
              fontSize: mobile?7:7.5,
              color:"rgba(255,255,255,0.5)",
              textTransform:"uppercase",letterSpacing:"0.6px",marginTop:3,
              whiteSpace:"nowrap",
            }}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* ── ROW 3: progress bar ── */}
      <div style={{position:"relative",zIndex:1,
        display:"flex",alignItems:"center",gap:10,
        padding: mobile?"0 14px 8px":"0 22px 8px",
      }}>
        {!mobile&&<span style={{fontSize:7.5,color:"rgba(255,255,255,0.28)",fontFamily:MONO,
          textTransform:"uppercase",letterSpacing:"1px",flexShrink:0}}>Completion</span>}
        <div style={{flex:1,height:3,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,
            background:`linear-gradient(90deg,${Y},#fff176)`,
            borderRadius:99,transition:"width .6s ease",
            boxShadow:"0 0 10px rgba(255,209,0,0.5)"}}/>
        </div>
        <span style={{fontSize:9,color:Y,fontFamily:MONO,fontWeight:700,flexShrink:0}}>{pct}%</span>
      </div>

      {/* ── ROW 4: legend (hidden on mobile) ── */}
      {!mobile&&(
        <div style={{position:"relative",zIndex:1,
          display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",
          padding:"5px 22px 8px",
          borderTop:"1px solid rgba(30,52,90,0.4)",
          background:"rgba(0,0,0,0.15)",
        }}>
          <span style={{fontSize:7.5,color:"rgba(255,255,255,0.22)",fontFamily:MONO,
            textTransform:"uppercase",letterSpacing:"1px",flexShrink:0}}>Tags:</span>
          {CATS.map(c=>(
            <div key={c.key} style={{display:"flex",alignItems:"center",gap:4,
              fontSize:8.5,color:"rgba(255,255,255,0.5)"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:c.color,
                flexShrink:0,boxShadow:`0 0 4px ${c.color}80`}}/>
              {c.label}
            </div>
          ))}
          <span style={{marginLeft:"auto",fontSize:7.5,color:"rgba(255,255,255,0.2)",fontFamily:MONO}}>
            Click Customer Segment → Story Tracer
          </span>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────
   CHIP
───────────────────────────────────────────────────────── */
function Chip({entry,onEdit,onDelete,onSegClick,isSegSection,wide,idx=0}){
  const [hov,setHov]=useState(false);
  const chipColor=cc(entry.cat);
  const hasLinks=(entry.segs||[]).length>0;
  return(
    <div
      className="chip-enter card-hover"
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>setHov(false)}
      onClick={()=>isSegSection&&onSegClick(entry.id)}
      style={{
        animationDelay:`${idx*40}ms`,
        display:"flex",flexDirection:"column",gap:5,
        background:hov?"rgba(255,255,255,0.07)":hasLinks?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.03)",
        border:`1px solid ${hov?"rgba(80,120,200,0.9)":"rgba(30,52,90,0.6)"}`,
        borderLeft:`3px solid ${chipColor}`,
        borderRadius:7,padding:"7px 9px 8px",
        cursor:isSegSection?"pointer":"default",
        boxShadow:hasLinks?`0 0 0 1px ${chipColor}20`:"none",
        /* CRITICAL: no overflow hidden, no fixed height, no min-width */
        width:"100%", minWidth:0, flexShrink:0,
        wordBreak:"break-word",overflowWrap:"break-word",
      }}
    >
      {/* Row 1: badge + seg tag + spacer + action buttons */}
      <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"nowrap",minWidth:0}}>
        <span style={{fontSize:7.5,fontWeight:700,fontFamily:MONO,textTransform:"uppercase",letterSpacing:".5px",color:chipColor,background:`${chipColor}18`,border:`1px solid ${chipColor}55`,padding:"2px 5px",borderRadius:3,flexShrink:0,whiteSpace:"nowrap",lineHeight:1.6}}>
          {cl(entry.cat)}
        </span>
        {hasLinks&&(
          <span style={{fontSize:7,color:Y,fontFamily:MONO,background:"rgba(255,209,0,0.1)",border:"1px solid rgba(255,209,0,0.3)",padding:"2px 5px",borderRadius:3,whiteSpace:"nowrap",lineHeight:1.6,flexShrink:0}}>
            ⟶ {entry.segs.length}
          </span>
        )}
        <div style={{flex:1,minWidth:0}}/>
        {/* Edit — pencil SVG */}
        <button onClick={e=>{e.stopPropagation();onEdit();}} title="Edit" className="btn-icon"
          style={{width:22,height:22,borderRadius:5,border:`1px solid ${hov?"rgba(255,209,0,0.45)":"transparent"}`,background:hov?"rgba(255,209,0,0.12)":"transparent",color:hov?Y:"rgba(255,255,255,0.3)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M7.8 1.5L9.5 3.2 3.2 9.5H1.5V7.8L7.8 1.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
            <path d="M6.2 3l1.8 1.8" stroke="currentColor" strokeWidth="1.25"/>
          </svg>
        </button>
        {/* Delete — trash SVG */}
        <button onClick={e=>{e.stopPropagation();onDelete();}} title="Delete" className="btn-icon"
          style={{width:22,height:22,borderRadius:5,border:`1px solid ${hov?"rgba(255,77,77,0.45)":"transparent"}`,background:hov?"rgba(255,77,77,0.12)":"transparent",color:hov?"#ff4d4d":"rgba(255,255,255,0.3)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 3h7M4.5 3V2h2v1M3.5 3l.5 6h3l.5-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {/* Row 2: text — full width, natural wrap */}
      <span style={{fontSize:11,color:"#dde6f8",lineHeight:1.52,display:"block",width:"100%",wordBreak:"break-word",overflowWrap:"break-word",whiteSpace:"normal"}}>
        {entry.text}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────────────────── */
function SectionCard({sid,entries,onAdd,onEdit,onDelete,onSegClick}){
  const s=SECTIONS[sid];
  const isWide=(sid==="cost"||sid==="rev");
  const isNotes=sid==="notes";
  return(
    <div className="card-hover" style={{
      background:"rgba(10,15,28,0.76)",
      backdropFilter:"blur(18px) saturate(1.4)",WebkitBackdropFilter:"blur(18px) saturate(1.4)",
      border:`1px solid ${sid==="vp"?"rgba(255,209,0,0.25)":isNotes?"rgba(251,146,60,0.25)":"rgba(30,52,90,0.6)"}`,
      borderRadius:13,display:"flex",flexDirection:"column",
      position:"relative",overflow:"hidden",height:"100%",
      boxShadow:sid==="vp"?"0 0 42px rgba(255,209,0,0.08)":isNotes?"0 0 32px rgba(251,146,60,0.06)":"none",
    }}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.accent,opacity:.85,zIndex:2,boxShadow:`0 0 12px ${s.accent}60`}}/>
      <div style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none",backgroundImage:"radial-gradient(circle,rgba(255,255,255,.025) 1px,transparent 1px)",backgroundSize:"18px 18px"}}/>
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",padding:"13px 12px 11px",gap:8}}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
          <span style={{fontFamily:MONO,fontSize:9,fontWeight:700,color:s.accent,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",padding:"1px 6px",borderRadius:3,flexShrink:0}}>{s.num}</span>
          <span style={{fontSize:10.5,fontWeight:700,color:"#e8edf8",textTransform:"uppercase",letterSpacing:".8px",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
          <span style={{fontFamily:MONO,fontSize:9,color:"rgba(255,255,255,0.5)",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(30,52,90,0.6)",padding:"1px 7px",borderRadius:20,flexShrink:0}}>{entries.length}</span>
          <button onClick={onAdd} title="Add entry" className="btn-icon"
            style={{background:"rgba(255,209,0,0.1)",border:"1px solid rgba(255,209,0,0.28)",color:Y,width:25,height:25,borderRadius:6,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'Inter',sans-serif",lineHeight:1}}>+</button>
        </div>
        <div style={{height:1,background:"rgba(30,52,90,0.6)",margin:"0 -12px",flexShrink:0}}/>
        {/* Entries */}
        <div style={{
          flex:1,overflowY:"auto",overflowX:"hidden",
          display:"flex",flexDirection:"column",gap:5,
          /* No horizontal scroll: width constrained, chips wrap text */
          width:"100%",minWidth:0,
        }}>
          {entries.length===0?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,padding:"18px 8px",opacity:.35,flex:1}}>
              <span style={{fontSize:22}}>{s.icon}</span>
              <span style={{fontSize:9.5,color:"#94a3b8",textAlign:"center",lineHeight:1.6}}>{s.hint}</span>
            </div>
          ):entries.map((e,i)=>(
            <Chip key={e.id} entry={e} idx={i}
              onEdit={()=>onEdit(sid,e.id)}
              onDelete={()=>onDelete(sid,e.id)}
              onSegClick={onSegClick}
              isSegSection={sid==="cs"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STORY DRAWER — improved KPI metrics
───────────────────────────────────────────────────────── */
const FLOW=[
  {sid:"kp",  color:"#60a5fa",label:"Key Partners"},
  {sid:"ka",  color:"#c084fc",label:"Key Activities"},
  {sid:"kr",  color:"#818cf8",label:"Key Resources"},
  {sid:"vp",  color:Y,        label:"Value Propositions"},
  {sid:"cr",  color:"#22d3ee",label:"Customer Relationships"},
  {sid:"ch",  color:"#38bdf8",label:"Channels"},
  {sid:"rev", color:"#4ade80",label:"Revenue Streams"},
];

function countLinked(state,segId){
  return LINKABLE.reduce((n,sid)=>n+(state[sid]||[]).filter(e=>(e.segs||[]).includes(segId)).length,0);
}

function SegMetrics({state,segId}){
  const bySection=FLOW.map(({sid,color,label})=>{
    const n=(state[sid]||[]).filter(e=>(e.segs||[]).includes(segId)).length;
    return{sid,color,label,n};
  }).filter(x=>x.n>0);
  const total=bySection.reduce((s,x)=>s+x.n,0);
  const byCat=CATS.map(c=>({...c,n:LINKABLE.reduce((s,sid)=>s+(state[sid]||[]).filter(e=>(e.segs||[]).includes(segId)&&e.cat===c.key).length,0)})).filter(x=>x.n>0);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10,animation:"fadeUp 0.3s ease"}}>
      {/* total */}
      <div style={{display:"flex",gap:6}}>
        <div style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(30,52,90,0.7)",borderRadius:8,padding:"10px 12px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:Y}}/>
          <div style={{fontSize:28,fontWeight:900,color:"#fff",fontFamily:MONO,lineHeight:1}}>{total}</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:1,marginTop:4}}>Linked Entries</div>
        </div>
        <div style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(30,52,90,0.7)",borderRadius:8,padding:"10px 12px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"#4ade80"}}/>
          <div style={{fontSize:28,fontWeight:900,color:"#fff",fontFamily:MONO,lineHeight:1}}>{bySection.length}</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:1,marginTop:4}}>BMC Sections</div>
        </div>
      </div>
      {/* section bar chart */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(30,52,90,0.55)",borderRadius:8,padding:"10px 12px"}}>
        <div style={{fontSize:8,color:"rgba(255,255,255,0.35)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Entries per BMC Section</div>
        {FLOW.map(({sid,color,label})=>{
          const n=(state[sid]||[]).filter(e=>(e.segs||[]).includes(segId)).length;
          const pct=total>0?Math.round((n/total)*100):0;
          return(
            <div key={sid} style={{marginBottom:6}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:9.5,color:"#c8d4ed",fontWeight:500}}>{label}</span>
                <span style={{fontSize:9,color:n>0?color:"rgba(255,255,255,0.2)",fontFamily:MONO,fontWeight:700}}>{n}</span>
              </div>
              <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99,transition:"width .5s ease",boxShadow:`0 0 6px ${color}80`}}/>
              </div>
            </div>
          );
        })}
      </div>
      {/* category breakdown */}
      {byCat.length>0&&(
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(30,52,90,0.55)",borderRadius:8,padding:"10px 12px"}}>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.35)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Category Breakdown</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {byCat.map(c=>(
              <div key={c.key} style={{display:"flex",alignItems:"center",gap:5,background:`${c.color}14`,border:`1px solid ${c.color}40`,borderRadius:6,padding:"4px 8px"}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:c.color,flexShrink:0,boxShadow:`0 0 5px ${c.color}80`}}/>
                <span style={{fontSize:10,color:"#dde6f8",fontWeight:600}}>{c.label}</span>
                <span style={{fontSize:11,color:c.color,fontFamily:MONO,fontWeight:800}}>{c.n}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StoryDrawer({state,activeSegId,onSelectSeg,onClose}){
  const segs=state.cs??[];
  const seg=segs.find(s=>s.id===activeSegId);
  const [expandedSid,setExpandedSid]=useState(null);
  const toggleSid=sid=>setExpandedSid(p=>p===sid?null:sid);

  return(
    <div style={{background:"rgba(4,7,16,0.95)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderLeft:"1px solid rgba(30,52,90,0.65)",display:"flex",flexDirection:"column",height:"100%",overflow:"hidden",animation:"slideIn 0.25s ease"}}>
      <div style={{padding:"15px 18px 12px",borderBottom:"1px solid rgba(30,52,90,0.6)",flexShrink:0,position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${Y},#22d3ee)`}}/>
        <div style={{fontSize:13,fontWeight:700,color:"#fff",letterSpacing:"-.2px"}}>🗺 Success Story Tracer</div>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontFamily:MONO,marginTop:3}}>
          {seg?`→ ${seg.text.slice(0,38)}`:"Select a customer segment below"}
        </div>
        <button onClick={onClose} style={{position:"absolute",top:13,right:14,background:"rgba(255,255,255,.04)",border:"1px solid rgba(30,52,90,0.6)",color:"rgba(255,255,255,0.5)",width:26,height:26,borderRadius:5,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {!activeSegId?(
          <>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.3)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:.8,marginBottom:2}}>AECO / BIM Customer Segments</div>
            {segs.length===0?(
              <div style={{textAlign:"center",opacity:.4,padding:"28px 0",fontSize:11,color:"rgba(255,255,255,0.4)"}}>Add Customer Segment entries first</div>
            ):segs.map(s=>{
              const linked=countLinked(state,s.id);
              return(
                <button key={s.id} onClick={()=>onSelectSeg(s.id)} className="seg-btn-anim"
                  style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(30,52,90,0.6)",borderRadius:9,padding:"10px 12px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:9,width:"100%"}}>
                  <span style={{fontSize:16,flexShrink:0}}>👤</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11.5,fontWeight:600,color:"#dde6f8",lineHeight:1.4,wordBreak:"break-word"}}>{s.text}</div>
                    <div style={{fontSize:9,color:cc(s.cat),fontFamily:MONO,marginTop:2}}>{cl(s.cat)}</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:18,fontWeight:900,color:linked>0?"#fff":"rgba(255,255,255,0.2)",fontFamily:MONO,lineHeight:1}}>{linked}</div>
                    <div style={{fontSize:7.5,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:.5}}>linked</div>
                  </div>
                </button>
              );
            })}
          </>
        ):(
          <>
            <button onClick={()=>onSelectSeg(null)} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(30,52,90,0.6)",borderRadius:6,padding:"5px 11px",cursor:"pointer",fontSize:10,color:"rgba(255,255,255,0.5)",textAlign:"left",width:"fit-content"}}>← All Segments</button>

            {/* Segment banner */}
            <div style={{background:"linear-gradient(135deg,rgba(74,222,128,0.14),rgba(74,222,128,0.04))",border:"1px solid rgba(74,222,128,0.25)",borderRadius:10,padding:"11px 14px",animation:"fadeUp 0.2s ease"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",lineHeight:1.35,wordBreak:"break-word"}}>{seg.text}</div>
              <span style={{display:"inline-block",marginTop:5,fontSize:8,color:"#4ade80",fontFamily:MONO,background:"rgba(74,222,128,0.12)",border:"1px solid rgba(74,222,128,0.3)",padding:"2px 6px",borderRadius:3,textTransform:"uppercase",letterSpacing:.5}}>{cl(seg.cat)}</span>
            </div>

            {/* KPI metrics */}
            <SegMetrics state={state} segId={activeSegId}/>

            {/* Flow detail — collapsible sections */}
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(30,52,90,0.55)",borderRadius:10,overflow:"hidden",animation:"fadeUp 0.3s ease"}}>
              <div style={{padding:"8px 12px",borderBottom:"1px solid rgba(30,52,90,0.5)",background:"rgba(255,255,255,0.02)"}}>
                <div style={{fontSize:8,color:"rgba(255,255,255,0.3)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:1}}>Canvas Flow · Partners → Revenue</div>
              </div>
              {FLOW.map(({sid,color,label})=>{
                const items=(state[sid]||[]).filter(e=>(e.segs||[]).includes(activeSegId));
                if(!items.length) return null;
                const expanded=expandedSid===sid;
                return(
                  <div key={sid} style={{borderBottom:"1px solid rgba(30,52,90,0.4)"}}>
                    <div onClick={()=>toggleSid(sid)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",cursor:"pointer",background:expanded?"rgba(255,255,255,0.04)":"transparent",transition:"background .15s"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0,boxShadow:`0 0 6px ${color}90`}}/>
                      <div style={{fontSize:10,fontWeight:700,color:"#dde6f8",textTransform:"uppercase",letterSpacing:.7,flex:1,fontFamily:MONO}}>{label}</div>
                      <div style={{fontSize:11,color:color,fontFamily:MONO,fontWeight:800,marginRight:4}}>{items.length}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",transform:expanded?"rotate(90deg)":"rotate(0deg)",transition:"transform .2s"}}>▶</div>
                    </div>
                    {expanded&&(
                      <div style={{display:"flex",flexDirection:"column",gap:4,padding:"4px 12px 10px",animation:"fadeIn 0.18s ease"}}>
                        {items.map(e=>{
                          const eColor=cc(e.cat);
                          return(
                            <div key={e.id} style={{display:"flex",flexDirection:"column",gap:3,padding:"6px 9px",background:"rgba(255,255,255,0.04)",borderRadius:6,borderLeft:`2px solid ${color}`}}>
                              <span style={{fontSize:7.5,color:eColor,fontFamily:MONO,background:`${eColor}18`,border:`1px solid ${eColor}45`,padding:"1.5px 5px",borderRadius:3,textTransform:"uppercase",letterSpacing:.5,alignSelf:"flex-start",lineHeight:1.6}}>{cl(e.cat)}</span>
                              <span style={{fontSize:11,color:"#dde6f8",lineHeight:1.45,wordBreak:"break-word"}}>{e.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {countLinked(state,activeSegId)===0&&(
                <div style={{padding:"22px 16px",textAlign:"center",opacity:.4}}>
                  <div style={{fontSize:24}}>🔗</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:8,lineHeight:1.6}}>No entries linked yet.<br/>When adding entries, link them to this segment.</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────────── */
function Modal({open,onClose,onSave,sid,editEntry,allSegs}){
  const [text,setText]=useState("");
  const [cat,setCat]=useState("medium");
  const [segs,setSegs]=useState(new Set());
  const prevSid=useRef(null);
  const prevEdit=useRef(null);

  useEffect(()=>{
    if(open&&(sid!==prevSid.current||editEntry!==prevEdit.current)){
      prevSid.current=sid;prevEdit.current=editEntry;
      setText(editEntry?.text??"");
      setCat(editEntry?.cat??"medium");
      setSegs(new Set(editEntry?.segs??[]));
    }
  },[open,sid,editEntry]);

  if(!open) return null;
  const s=SECTIONS[sid]??{};
  const isEdit=!!editEntry;
  const showLink=LINKABLE.includes(sid)&&allSegs.length>0;
  const toggleSeg=id=>setSegs(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const doSave=()=>{if(!text.trim())return;onSave({text:text.trim(),cat,segs:[...segs]});};

  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(1,3,10,0.86)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.18s ease"}}>
      <div style={{background:"rgba(8,12,24,0.98)",border:"1px solid rgba(60,100,170,0.85)",borderRadius:14,width:"100%",maxWidth:500,boxShadow:"0 40px 100px rgba(0,0,0,.75)",overflow:"hidden",animation:"fadeUp 0.22s ease"}}>
        <div style={{background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(30,52,90,0.6)",padding:"18px 22px 14px",position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:Y}}/>
          <div style={{fontSize:8,fontFamily:MONO,color:Y,textTransform:"uppercase",letterSpacing:1.5,marginBottom:3}}>{isEdit?"EDIT ENTRY":"ADD ENTRY"}</div>
          <div style={{fontSize:16,fontWeight:700,color:"#fff",letterSpacing:"-.2px"}}>{isEdit?"Edit Entry":"New Entry"}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginTop:2}}>→ {s.name}</div>
          <button onClick={onClose} style={{position:"absolute",top:16,right:18,background:"rgba(255,255,255,.04)",border:"1px solid rgba(30,52,90,0.6)",color:"rgba(255,255,255,0.5)",width:26,height:26,borderRadius:5,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"16px 22px 18px",display:"flex",flexDirection:"column",gap:14,maxHeight:"64vh",overflowY:"auto"}}>
          <div>
            <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:.8,marginBottom:7,fontFamily:MONO}}>Description</label>
            <textarea value={text} onChange={e=>setText(e.target.value)} autoFocus placeholder="Describe this element clearly…"
              onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter"){e.preventDefault();doSave();}}}
              style={{width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${text?"rgba(255,209,0,0.55)":"rgba(30,52,90,0.7)"}`,color:"#dde6f8",padding:"10px 12px",borderRadius:8,fontSize:12.5,fontFamily:"'Inter',sans-serif",outline:"none",resize:"vertical",minHeight:80,lineHeight:1.55,transition:"border-color .15s"}}/>
          </div>
          <div>
            <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:.8,marginBottom:7,fontFamily:MONO}}>Category / Priority</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              {CATS.map(c=>(
                <div key={c.key} onClick={()=>setCat(c.key)} style={{display:"flex",alignItems:"center",gap:8,background:cat===c.key?`${c.color}12`:"rgba(255,255,255,.03)",border:`1px solid ${cat===c.key?c.color:"rgba(30,52,90,0.6)"}`,borderRadius:8,padding:"7px 10px",cursor:"pointer",transition:"all .15s"}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:c.color,flexShrink:0,boxShadow:cat===c.key?`0 0 8px ${c.color}80`:"none"}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11.5,fontWeight:600,color:"#dde6f8"}}>{c.label}</div>
                    <div style={{fontSize:8.5,color:"rgba(255,255,255,0.4)"}}>{c.desc}</div>
                  </div>
                  {cat===c.key&&<span style={{fontSize:12,color:c.color,fontWeight:700}}>✓</span>}
                </div>
              ))}
            </div>
          </div>
          {showLink&&(
            <div>
              <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.45)",textTransform:"uppercase",letterSpacing:.8,marginBottom:7,fontFamily:MONO}}>Link to Customer Segment(s)</label>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {allSegs.map(seg=>(
                  <div key={seg.id} onClick={()=>toggleSeg(seg.id)} style={{display:"flex",alignItems:"center",gap:7,background:segs.has(seg.id)?"rgba(74,222,128,.07)":"rgba(255,255,255,.03)",border:`1px solid ${segs.has(seg.id)?"rgba(74,222,128,0.5)":"rgba(30,52,90,0.6)"}`,borderRadius:6,padding:"7px 10px",cursor:"pointer",transition:"all .15s"}}>
                    <div style={{width:14,height:14,border:segs.has(seg.id)?"none":"1px solid rgba(30,52,90,0.6)",borderRadius:3,background:segs.has(seg.id)?"#4ade80":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#080808",flexShrink:0,transition:"all .15s"}}>{segs.has(seg.id)?"✓":""}</div>
                    <span style={{fontSize:11.5,color:"#dde6f8",flex:1,wordBreak:"break-word"}}>{seg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:7,borderTop:"1px solid rgba(30,52,90,0.6)",padding:"12px 22px",background:"rgba(255,255,255,0.02)"}}>
          <button onClick={onClose} style={{flex:1,background:"transparent",border:"1px solid rgba(30,52,90,0.6)",color:"rgba(255,255,255,0.5)",padding:10,borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .15s"}}>Cancel</button>
          <button onClick={doSave} style={{flex:2,background:Y,border:"none",color:"#060606",padding:10,borderRadius:8,fontSize:12.5,fontWeight:800,cursor:"pointer",fontFamily:"'Inter',sans-serif",boxShadow:`0 0 18px rgba(255,209,0,0.3)`}}>
            {isEdit?"Update Entry":"Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────── */
function Toast({msg,show}){
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:600,background:"rgba(8,12,24,0.97)",border:"1px solid rgba(60,100,170,0.85)",color:"#dde6f8",padding:"10px 15px 10px 11px",borderRadius:9,fontSize:11.5,fontWeight:500,display:"flex",alignItems:"center",gap:9,boxShadow:"0 8px 32px rgba(0,0,0,.55)",transform:show?"translateY(0)":"translateY(10px)",opacity:show?1:0,transition:"opacity .2s,transform .2s",pointerEvents:"none"}}>
      <div style={{width:3,height:28,background:Y,borderRadius:99,flexShrink:0,boxShadow:`0 0 8px ${Y}80`}}/>
      {msg}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CANVAS LAYOUT
   Desktop (≥1024px): standard 9-box BMC grid, Notes full-width below
   Tablet (640-1023): 2-column abbreviated grid
   Mobile (<640px):  single-column logical stack
───────────────────────────────────────────────────────── */
function CanvasLayout({state,drawerOpen,openAdd,openEdit,handleDelete,openStory,activeSegId,setActiveSegId,setDrawerOpen}){
  const w   = useWW();
  const mob = w < 640;
  const tab = w < 1024;

  /* Reusable card renderer */
  const C = (sid) => (
    <SectionCard
      sid={sid}
      entries={state[sid] ?? []}
      onAdd={()=>openAdd(sid)}
      onEdit={openEdit}
      onDelete={handleDelete}
      onSegClick={openStory}
    />
  );

  /* ── Standard BMC grid (desktop ≥1024px) ──────────────────
     5 columns × 3 rows then full-width Notes row

     Col:  1          2          3(VP)      4          5
     R1:   KP─────┐  KA         VP─────┐   CR         CS─────┐
     R2:   KP─────┘  KR         VP─────┘   CH         CS─────┘
     R3:   COST──────────────────┐          REV─────────────────┐
     R4:   NOTES (full width, outside grid)
  ─────────────────────────────────────────────────────────── */
  const DesktopGrid = () => (
    <>
      {/* Flow direction labels */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",
        gap:7, marginBottom:8,
      }}>
        {[
          ["① Partners",   ""],
          ["② Operations", ""],
          ["③ Value",      Y ],
          ["④ Customers",  ""],
          ["⑤ Segments",   ""],
        ].map(([lbl,hi],i)=>(
          <div key={i} style={{
            textAlign:"center", fontSize:8, fontFamily:MONO,
            color:hi?Y:"rgba(255,255,255,0.32)",
            textTransform:"uppercase", letterSpacing:"0.9px",
            padding:"4px 0",
            background:"rgba(255,255,255,0.025)",
            border:`1px solid ${hi?"rgba(255,209,0,0.3)":"rgba(30,52,90,0.38)"}`,
            borderRadius:4,
            boxShadow:hi?"0 0 10px rgba(255,209,0,0.1)":"none",
          }}>{lbl}</div>
        ))}
      </div>

      {/* 9-box grid */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"1fr 1fr 1.1fr 1fr 1fr",
        gridTemplateRows:"minmax(210px,1fr) minmax(210px,1fr) minmax(140px,auto)",
        gap:8,
      }}>
        {/* KP — col 1, rows 1-2 */}
        <div style={{gridColumn:"1/2", gridRow:"1/3"}}>{C("kp")}</div>
        {/* KA — col 2, row 1 */}
        <div style={{gridColumn:"2/3", gridRow:"1/2"}}>{C("ka")}</div>
        {/* VP — col 3, rows 1-2  ← centre */}
        <div style={{gridColumn:"3/4", gridRow:"1/3"}}>{C("vp")}</div>
        {/* CR — col 4, row 1 */}
        <div style={{gridColumn:"4/5", gridRow:"1/2"}}>{C("cr")}</div>
        {/* CS — col 5, rows 1-2 */}
        <div style={{gridColumn:"5/6", gridRow:"1/3"}}>{C("cs")}</div>
        {/* KR — col 2, row 2 */}
        <div style={{gridColumn:"2/3", gridRow:"2/3"}}>{C("kr")}</div>
        {/* CH — col 4, row 2 */}
        <div style={{gridColumn:"4/5", gridRow:"2/3"}}>{C("ch")}</div>
        {/* COST — cols 1-3, row 3 (left half) */}
        <div style={{gridColumn:"1/4", gridRow:"3/4"}}>{C("cost")}</div>
        {/* REV  — cols 3-6, row 3 (right half) */}
        <div style={{gridColumn:"4/6", gridRow:"3/4"}}>{C("rev")}</div>
      </div>

      {/* Notes — full width below the 9-box grid */}
      <div style={{marginTop:8}}>{C("notes")}</div>
    </>
  );

  /* ── Tablet grid (640-1023px): 2 col abbreviated ────────── */
  const TabletGrid = () => (
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {[
        {label:"① Partners & Operations", sids:["kp","ka","kr"], accent:"#60a5fa"},
        {label:"③ Value Propositions",    sids:["vp"],           accent:Y},
        {label:"④ Customer Facing",       sids:["cr","ch","cs"], accent:"#22d3ee"},
        {label:"Financial",               sids:["cost","rev"],   accent:"#4ade80"},
        {label:"💡 Brainstorm & Notes",   sids:["notes"],        accent:"#fb923c"},
      ].map(group=>(
        <div key={group.label}>
          <div style={{
            fontSize:8, fontFamily:MONO, color:"rgba(255,255,255,0.35)",
            textTransform:"uppercase", letterSpacing:"1px",
            borderLeft:`2px solid ${group.accent}`,
            paddingLeft:7, marginBottom:5,
          }}>{group.label}</div>
          <div style={{
            display:"grid",
            gridTemplateColumns: group.sids.length > 1 ? "1fr 1fr" : "1fr",
            gap:8,
          }}>
            {group.sids.map(sid=>(
              <div key={sid} style={{minHeight:160}}>{C(sid)}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  /* ── Mobile stack (<640px): single column, BMC order ───── */
  const MobileStack = () => (
    <div style={{display:"flex",flexDirection:"column",gap:7}}>
      {["kp","ka","kr","vp","cr","ch","cs","cost","rev","notes"].map(sid=>(
        <div key={sid} style={{minHeight:sid==="notes"?100:150}}>{C(sid)}</div>
      ))}
    </div>
  );

  return (
    <div style={{
      display:"grid",
      gridTemplateColumns: drawerOpen && !tab ? "1fr 360px" : "1fr",
      transition:"grid-template-columns .3s ease",
      position:"relative", zIndex:1, alignItems:"start",
    }}>

      {/* ── Main canvas area ── */}
      <main style={{
        padding: mob ? "10px 10px 48px" : "14px 16px 48px",
        overflow:"hidden", minWidth:0,
      }}>
        {!tab  && <DesktopGrid/>}
        {tab && !mob && <TabletGrid/>}
        {mob   && <MobileStack/>}
      </main>

      {/* ── Story drawer ── */}
      {drawerOpen && (
        tab ? (
          /* Mobile/tablet: bottom sheet overlay */
          <div
            style={{position:"fixed",inset:0,zIndex:300,
              background:"rgba(0,0,0,0.65)",backdropFilter:"blur(6px)",
              display:"flex",flexDirection:"column",justifyContent:"flex-end",
            }}
            onClick={e=>{if(e.target===e.currentTarget)setDrawerOpen(false);}}
          >
            <div style={{height:"82vh",background:"rgba(4,7,16,0.98)",
              borderTop:"1px solid rgba(30,52,90,0.7)",
              borderRadius:"18px 18px 0 0",overflow:"hidden",
              display:"flex",flexDirection:"column",
            }}>
              <StoryDrawer state={state} activeSegId={activeSegId}
                onSelectSeg={setActiveSegId} onClose={()=>setDrawerOpen(false)}/>
            </div>
          </div>
        ) : (
          /* Desktop: inline side panel */
          <StoryDrawer state={state} activeSegId={activeSegId}
            onSelectSeg={setActiveSegId} onClose={()=>setDrawerOpen(false)}/>
        )
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────── */
export default function App(){
  /* Inject global CSS */
  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent=GLOBAL_CSS;
    document.head.appendChild(style);
    return()=>document.head.removeChild(style);
  },[]);

  const [state,setState]=useState(DEMO);
  const [modal,setModal]=useState({open:false,sid:"vp",editEntry:null});
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [activeSegId,setActiveSegId]=useState(null);
  const [toast,setToast]=useState({msg:"",show:false});
  const toastTimer=useRef(null);

  const showToast=useCallback(msg=>{
    setToast({msg,show:true});
    clearTimeout(toastTimer.current);
    toastTimer.current=setTimeout(()=>setToast(t=>({...t,show:false})),2400);
  },[]);

  const openAdd=sid=>setModal({open:true,sid,editEntry:null});
  const openEdit=(sid,id)=>setModal({open:true,sid,editEntry:state[sid]?.find(x=>x.id===id)??null});
  const closeModal=()=>setModal(m=>({...m,open:false}));

  const handleSave=({text,cat,segs})=>{
    const{sid,editEntry}=modal;
    setState(prev=>{
      const arr=[...(prev[sid]??[])];
      if(editEntry){const i=arr.findIndex(e=>e.id===editEntry.id);if(i>-1)arr[i]={...arr[i],text,cat,segs};showToast("Entry updated");}
      else{arr.push({id:mkId(),text,cat,segs,ts:Date.now()});showToast("Added to "+SECTIONS[sid].name);}
      return{...prev,[sid]:arr};
    });
    closeModal();
  };

  const handleDelete=(sid,id)=>{
    setState(prev=>({...prev,[sid]:(prev[sid]??[]).filter(e=>e.id!==id)}));
    showToast("Entry removed");
  };

  const openStory=segId=>{setDrawerOpen(true);setActiveSegId(segId);};

  const all=Object.values(state).flat();
  const filled=Object.keys(SECTIONS).filter(k=>k!=="notes"&&(state[k]?.length||0)>0).length;
  const pct=Math.round((filled/9)*100);

  const kpis=[
    {v:all.length,                                      l:"Total Entries",  c:"#60a5fa"},
    {v:`${filled}/9`,                                   l:"BMC Sections",   c:"#4ade80"},
    {v:all.filter(e=>e.cat==="critical").length,        l:"Critical",       c:"#ff4d4d"},
    {v:all.filter(e=>e.cat==="opportunity").length,     l:"Opportunities",  c:"#60a5fa"},
    {v:(state.cs??[]).length,                           l:"Segments",       c:Y        },
    {v:(state.notes??[]).length,                        l:"Ideas",          c:"#fb923c"},
  ];

  return(
    <div style={{fontFamily:"'Inter',sans-serif",background:"#06090f",color:"#dde6f8",minHeight:"100vh",position:"relative"}}>
      <BimBg/>
      <HeroHeader kpis={kpis} pct={pct} drawerOpen={drawerOpen}
        onToggleDrawer={()=>{setDrawerOpen(v=>!v);if(!drawerOpen)setActiveSegId(null);}}
        onAddEntry={()=>openAdd("vp")}/>

      <CanvasLayout
        state={state} drawerOpen={drawerOpen}
        openAdd={openAdd} openEdit={openEdit}
        handleDelete={handleDelete} openStory={openStory}
        activeSegId={activeSegId} setActiveSegId={setActiveSegId}
        setDrawerOpen={setDrawerOpen}
      />

      <Modal open={modal.open} onClose={closeModal} onSave={handleSave} sid={modal.sid} editEntry={modal.editEntry} allSegs={state.cs??[]}/>
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  );
}
