import { useState, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════ */
const Y = "#ffd100";

const CATS = [
  { key:"critical",    color:"#ef4444", label:"Critical",      desc:"Must-have / blocker"   },
  { key:"high",        color:"#f97316", label:"High Priority", desc:"Significant importance" },
  { key:"medium",      color:Y,         label:"Medium",        desc:"Moderate importance"    },
  { key:"low",         color:"#22c55e", label:"Low / Done",    desc:"Minor or resolved"      },
  { key:"opportunity", color:"#3b82f6", label:"Opportunity",   desc:"Growth potential"       },
  { key:"risk",        color:"#a855f7", label:"Risk",          desc:"Threat to address"      },
  { key:"strength",    color:"#19b8c2", label:"Strength",      desc:"Core advantage"         },
  { key:"info",        color:"#64748b", label:"Info",          desc:"General reference"      },
];
const catColor = k => CATS.find(c=>c.key===k)?.color ?? Y;
const catLabel = k => CATS.find(c=>c.key===k)?.label ?? k;

const SECTIONS = {
  kp:   { name:"Key Partners",           num:"01", accent:"#3b82f6", icon:"🤝", hint:"Key suppliers, alliances & partners"  },
  ka:   { name:"Key Activities",         num:"02", accent:"#a855f7", icon:"⚙️", hint:"Core processes to deliver value"       },
  vp:   { name:"Value Propositions",     num:"03", accent:Y,         icon:"💎", hint:"What unique value do we deliver?"      },
  cr:   { name:"Customer Relationships", num:"04", accent:"#19b8c2", icon:"💬", hint:"How do we engage each segment?"         },
  cs:   { name:"Customer Segments",      num:"05", accent:"#22c55e", icon:"👥", hint:"Click a segment to trace its story →"  },
  kr:   { name:"Key Resources",          num:"06", accent:"#6366f1", icon:"🏗️", hint:"Physical, IP, human & financial"        },
  ch:   { name:"Channels",               num:"07", accent:"#0ea5e9", icon:"📡", hint:"How we reach our customers"             },
  cost: { name:"Cost Structure",         num:"08", accent:"#ef4444", icon:"📉", hint:"Most significant costs in the model"   },
  rev:  { name:"Revenue Streams",        num:"09", accent:"#22c55e", icon:"📈", hint:"Revenue generated per segment"         },
};
const LINKABLE = ["vp","cr","ch","kp","ka","kr","rev"];

/* ═══════════════════════════════════════════════════════════
   DEMO DATA
═══════════════════════════════════════════════════════════ */
const mkId = () => "e" + Date.now().toString(36) + Math.random().toString(36).slice(2,5);
const SA = mkId(), SC = mkId(), SO = mkId();

const DEMO = {
  cs:[
    {id:SA, text:"Architecture Firms (AEC Design Studios)", cat:"strength",    segs:[]},
    {id:SC, text:"General Contractors & BIM Managers",      cat:"high",        segs:[]},
    {id:SO, text:"Building Owners & Facility Managers",     cat:"opportunity", segs:[]},
  ],
  kp:[
    {id:mkId(), text:"Autodesk & Graphisoft reseller network",       cat:"strength",    segs:[SA,SC]},
    {id:mkId(), text:"IFC / buildingSMART standards body",           cat:"info",        segs:[SA,SC,SO]},
    {id:mkId(), text:"Cloud infrastructure (AWS / Azure)",           cat:"high",        segs:[SA,SC]},
    {id:mkId(), text:"University BIM research partnerships",         cat:"opportunity", segs:[SA]},
  ],
  ka:[
    {id:mkId(), text:"Continuous IFC compliance engine development", cat:"critical",    segs:[SA,SC]},
    {id:mkId(), text:"BIM model quality validation & clash detection",cat:"high",       segs:[SC]},
    {id:mkId(), text:"Customer onboarding & BIM implementation support",cat:"strength", segs:[SA,SC,SO]},
    {id:mkId(), text:"SDK & API integration for third-party tools",  cat:"opportunity", segs:[SA,SC]},
  ],
  kr:[
    {id:mkId(), text:"Proprietary IFC parsing & geometry engine",    cat:"strength",    segs:[SA,SC]},
    {id:mkId(), text:"AECO domain expert team (50+ engineers)",      cat:"high",        segs:[SA,SC,SO]},
    {id:mkId(), text:"ISO 19650 certification & compliance library", cat:"strength",    segs:[SC,SO]},
    {id:mkId(), text:"Cloud-based model repository infrastructure",  cat:"medium",      segs:[SA]},
  ],
  vp:[
    {id:mkId(), text:"Only fully openBIM-native platform with zero vendor lock-in",     cat:"strength",    segs:[SA,SC,SO]},
    {id:mkId(), text:"Real-time IFC4.3 validation reducing coordination errors by 60%", cat:"critical",    segs:[SC]},
    {id:mkId(), text:"Single source of truth for entire project lifecycle",              cat:"high",        segs:[SA,SC,SO]},
    {id:mkId(), text:"AI-assisted clash detection & automated BIM audits",              cat:"opportunity", segs:[SA,SC]},
    {id:mkId(), text:"Digital twin ready — seamless FM handover package",               cat:"strength",    segs:[SO]},
  ],
  cr:[
    {id:mkId(), text:"Dedicated BIM Success Manager per enterprise account", cat:"strength",    segs:[SA,SC,SO]},
    {id:mkId(), text:"ACCA Academy — online BIM certification programme",    cat:"high",        segs:[SA,SC]},
    {id:mkId(), text:"Community forum for openBIM practitioners",            cat:"medium",      segs:[SA,SC]},
    {id:mkId(), text:"Quarterly executive business reviews for top-tier clients", cat:"opportunity", segs:[SO]},
  ],
  ch:[
    {id:mkId(), text:"Direct SaaS subscription via acca.it platform",      cat:"strength",    segs:[SA,SC,SO]},
    {id:mkId(), text:"Authorised reseller network across 40+ countries",    cat:"high",        segs:[SA,SC]},
    {id:mkId(), text:"BIM conferences & buildingSMART events",              cat:"medium",      segs:[SA,SC]},
    {id:mkId(), text:"Partner integrations (Revit, ArchiCAD, Navisworks)",  cat:"opportunity", segs:[SA,SC]},
  ],
  cost:[
    {id:mkId(), text:"R&D — IFC engine & AI feature development",    cat:"critical", segs:[]},
    {id:mkId(), text:"Cloud hosting & storage infrastructure",        cat:"high",     segs:[]},
    {id:mkId(), text:"Sales & partner channel commissions",           cat:"medium",   segs:[]},
    {id:mkId(), text:"ISO 19650 compliance & certification audits",   cat:"medium",   segs:[]},
  ],
  rev:[
    {id:mkId(), text:"Enterprise SaaS licences (annual ARR)",         cat:"strength",    segs:[SA,SC,SO]},
    {id:mkId(), text:"Professional Services — BIM implementation",    cat:"high",        segs:[SC,SO]},
    {id:mkId(), text:"ACCA Academy certification fees",               cat:"medium",      segs:[SA,SC]},
    {id:mkId(), text:"API usage & white-label SDK licensing",         cat:"opportunity", segs:[SA,SC]},
  ],
};

/* ═══════════════════════════════════════════════════════════
   BIM BACKGROUND
═══════════════════════════════════════════════════════════ */
function BimBg() {
  return (
    <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"
           style={{width:"100%",height:"100%"}} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg1" cx="50%" cy="42%" r="70%">
            <stop offset="0%" stopColor="#0b1425"/>
            <stop offset="100%" stopColor="#06090f"/>
          </radialGradient>
          <radialGradient id="gy" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd100" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#ffd100" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="gb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.065"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </radialGradient>
          <filter id="gf">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <rect width="1600" height="900" fill="url(#bg1)"/>
        <ellipse cx="800" cy="380" rx="660" ry="430" fill="url(#gy)"/>
        <ellipse cx="140" cy="730" rx="390" ry="310" fill="url(#gb)"/>
        <ellipse cx="1460" cy="175" rx="330" ry="250" fill="url(#gb)"/>
        {/* grid */}
        <g stroke="#19294a" strokeWidth="0.55" opacity="0.42">
          {[100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500].map(x=>
            <line key={x} x1={x} y1="0" x2={x} y2="900"/>)}
          {[100,200,300,400,500,600,700,800].map(y=>
            <line key={y} x1="0" y1={y} x2="1600" y2={y}/>)}
        </g>
        {/* building left */}
        <g stroke="#1e3a6a" strokeWidth="1" fill="none" opacity="0.48" transform="translate(40,155)">
          <polygon points="0,315 0,72 168,0 336,72 336,315" stroke="#2a4d88" fill="#091422" fillOpacity="0.55"/>
          <polygon points="0,72 168,0 336,72 168,144" stroke="#3b6ab5" fill="#0e1e3a" fillOpacity="0.45"/>
          <polygon points="336,72 336,315 436,235 436,0 168,0 336,72" fill="#07101e" fillOpacity="0.5"/>
          {[28,140,252].map(x=>[118,200].map(y=>
            <rect key={`${x}${y}`} x={x} y={y} width="44" height="52"
              stroke="#2560b8" strokeWidth="0.8" fill="#1a3a6e" fillOpacity="0.32"/>))}
        </g>
        {/* building right */}
        <g stroke="#1e3a6a" strokeWidth="1" fill="none" opacity="0.36" transform="translate(1115,48)">
          <polygon points="0,455 0,52 188,0 376,52 376,455" stroke="#2a4d88" fill="#091422" fillOpacity="0.46"/>
          <polygon points="0,52 188,0 376,52 188,104" stroke="#3b6ab5" fill="#0e1e3a" fillOpacity="0.38"/>
          <polygon points="376,52 376,455 476,375 476,-38 188,0 376,52" fill="#07101e" fillOpacity="0.4"/>
          {[26,150,274].map(x=>[108,208,308].map(y=>
            <rect key={`${x}${y}`} x={x} y={y} width="48" height="56"
              stroke="#2560b8" strokeWidth="0.8" fill="#1a3a6e" fillOpacity="0.25"/>))}
        </g>
        {/* floor plan */}
        <g stroke="#1a3060" strokeWidth="0.9" fill="none" opacity="0.2" transform="translate(1058,10)">
          <rect x="0" y="0" width="316" height="214" stroke="#2a4d88"/>
          <line x1="0" y1="86" x2="316" y2="86"/>
          <line x1="128" y1="0" x2="128" y2="86"/>
          <line x1="188" y1="86" x2="188" y2="214"/>
          <rect x="18" y="18" width="66" height="44" stroke="#1e3a6a"/>
          <rect x="152" y="18" width="66" height="44" stroke="#1e3a6a"/>
          <rect x="18" y="110" width="84" height="68" stroke="#1e3a6a"/>
          <rect x="206" y="110" width="84" height="68" stroke="#1e3a6a"/>
          <path d="M18,86 A44,44 0 0,1 62,42" stroke="#3b6ab5" strokeWidth="0.8"/>
          <path d="M206,86 A44,44 0 0,0 250,42" stroke="#3b6ab5" strokeWidth="0.8"/>
        </g>
        {/* IFC nodes */}
        <g opacity="0.19" filter="url(#gf)">
          {[[500,764],[622,804],[702,734],[802,784],[882,724],[982,764],[1062,802],[762,854],[842,844]].map(([cx,cy],i)=>
            <circle key={i} cx={cx} cy={cy} r={[6,5,7,4,6,5,4,5,4][i]}
              fill={[Y,"#3b82f6",Y,"#22c55e",Y,"#3b82f6","#a855f7","#19b8c2","#f97316"][i]}/>)}
          {[[500,764,702,734],[702,734,802,784],[702,734,882,724],[882,724,982,764],[802,784,762,854],[500,764,622,804],[982,764,1062,802]].map(([x1,y1,x2,y2],i)=>
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={Y} strokeWidth="1"/>)}
        </g>
        {/* axes */}
        <g opacity="0.15" transform="translate(1462,792)">
          <line x1="0" y1="0" x2="72" y2="0" stroke="#ef4444" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="0" y2="-72" stroke="#22c55e" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="-46" y2="-46" stroke="#3b82f6" strokeWidth="1.5"/>
          <polygon points="72,0 62,-3.5 62,3.5" fill="#ef4444"/>
          <polygon points="0,-72 -3.5,-62 3.5,-62" fill="#22c55e"/>
          <polygon points="-46,-46 -42,-34 -34,-42" fill="#3b82f6"/>
          <text x="76" y="4" fill="#ef4444" fontSize="9" fontFamily="monospace">X</text>
          <text x="-6" y="-76" fill="#22c55e" fontSize="9" fontFamily="monospace">Z</text>
          <text x="-60" y="-50" fill="#3b82f6" fontSize="9" fontFamily="monospace">Y</text>
        </g>
        <text x="26" y="890" fill="#1a304e" fontSize="8.5" fontFamily="monospace" opacity="0.55">IFC4.3 · ISO 19650 · openBIM · buildingSMART</text>
        <text x="1170" y="890" fill="#1a304e" fontSize="8.5" fontFamily="monospace" opacity="0.55">AECO Industry · ACCA software S.p.A.</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO HEADER
═══════════════════════════════════════════════════════════ */
function HeroHeader({ kpis, pct, drawerOpen, onToggleDrawer, onAddEntry }) {
  return (
    <header style={{
      position:"sticky", top:0, zIndex:100,
      background:"rgba(5,8,16,0.88)",
      backdropFilter:"blur(20px) saturate(1.5)",
      WebkitBackdropFilter:"blur(20px) saturate(1.5)",
      borderBottom:"1px solid rgba(30,55,90,0.6)",
      overflow:"hidden",
    }}>
      {/* animated shimmer bar */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"2px",
        background:`linear-gradient(90deg, transparent 0%, ${Y} 20%, #fff 50%, ${Y} 80%, transparent 100%)`,
        opacity:0.9,
      }}/>
      {/* faint dot-grid bg */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:"radial-gradient(circle,rgba(255,209,0,0.04) 1px,transparent 1px)",
        backgroundSize:"28px 28px",
      }}/>

      {/* ── MAIN HERO ROW ── */}
      <div style={{
        position:"relative", zIndex:1,
        display:"grid", gridTemplateColumns:"auto 1fr auto",
        alignItems:"center", gap:20, padding:"18px 24px 14px",
      }}>

        {/* LEFT: logo + title stack */}
        <div style={{display:"flex", alignItems:"center", gap:14}}>
          {/* logo mark */}
          <div style={{
            width:50, height:50,
            background:Y, borderRadius:11,
            display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0,
            boxShadow:`0 0 24px rgba(255,209,0,0.35), 0 4px 12px rgba(0,0,0,0.4)`,
          }}>
            <svg viewBox="0 0 28 28" fill="none" width="30" height="30">
              <path d="M3 24L10 4h3.5L20 24h-3.8l-1.6-4.5H8.4L6.8 24H3zm6.5-7.5h6l-3-8.5-3 8.5z" fill="#080808"/>
              <rect x="21.5" y="4" width="3" height="20" rx="1.5" fill="#080808" opacity="0.38"/>
            </svg>
          </div>
          {/* title block */}
          <div>
            <div style={{display:"flex", alignItems:"baseline", gap:8}}>
              <span style={{
                fontSize:22, fontWeight:900, color:"#fff",
                letterSpacing:"-0.5px", lineHeight:1,
              }}>ACCA</span>
              <span style={{
                fontSize:22, fontWeight:900, color:Y,
                letterSpacing:"-0.5px", lineHeight:1,
              }}>Strategy</span>
              <span style={{
                fontSize:10, fontWeight:600, color:"rgba(255,209,0,0.6)",
                background:"rgba(255,209,0,0.1)", border:"1px solid rgba(255,209,0,0.25)",
                padding:"2px 7px", borderRadius:20, fontFamily:"monospace",
                letterSpacing:"0.5px", alignSelf:"center",
              }}>v2.0</span>
            </div>
            <div style={{
              fontSize:9, color:"rgba(255,255,255,0.38)", fontFamily:"monospace",
              letterSpacing:"2px", textTransform:"uppercase", marginTop:3,
            }}>
              Business Model Canvas · AECO / BIM Industry
            </div>
          </div>
        </div>

        {/* CENTRE: KPI tiles */}
        <div style={{display:"flex", gap:6, justifyContent:"center", flexWrap:"wrap"}}>
          {kpis.map((k,i)=>(
            <div key={i} style={{
              background:"rgba(255,255,255,0.04)",
              border:"1px solid rgba(30,55,90,0.6)",
              borderRadius:9, padding:"8px 16px", textAlign:"center",
              minWidth:80, position:"relative", overflow:"hidden",
              backdropFilter:"blur(8px)",
            }}>
              <div style={{
                position:"absolute", top:0, left:0, right:0, height:"2px",
                background:k.c,
                boxShadow:`0 0 8px ${k.c}80`,
              }}/>
              <div style={{
                fontSize:22, fontWeight:900, color:"#fff",
                fontFamily:"monospace", letterSpacing:"-1.5px", lineHeight:1,
              }}>{k.v}</div>
              <div style={{
                fontSize:8, color:"rgba(255,255,255,0.38)",
                textTransform:"uppercase", letterSpacing:"0.8px", marginTop:4,
              }}>{k.l}</div>
            </div>
          ))}
        </div>

        {/* RIGHT: actions */}
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          <button
            onClick={onToggleDrawer}
            style={{
              background: drawerOpen ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
              border:`1px solid ${drawerOpen ? "rgba(34,197,94,0.5)" : "rgba(30,55,90,0.7)"}`,
              color: drawerOpen ? "#22c55e" : "rgba(255,255,255,0.55)",
              padding:"8px 14px", borderRadius:8, fontSize:11, fontWeight:600,
              cursor:"pointer", display:"flex", alignItems:"center", gap:6,
              fontFamily:"'Inter',sans-serif", transition:"all .2s",
            }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M6.5 4v2.5l1.8 1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Story View
          </button>
          <button
            onClick={onAddEntry}
            style={{
              background:Y, border:"none", color:"#080808",
              padding:"8px 18px", borderRadius:8, fontSize:11, fontWeight:800,
              cursor:"pointer", display:"flex", alignItems:"center", gap:6,
              fontFamily:"'Inter',sans-serif",
              boxShadow:`0 0 20px rgba(255,209,0,0.3)`,
              transition:"opacity .15s, transform .1s",
            }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Entry
          </button>
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div style={{
        position:"relative", zIndex:1,
        display:"flex", alignItems:"center", gap:12,
        padding:"0 24px 12px",
      }}>
        <span style={{
          fontSize:8, color:"rgba(255,255,255,0.3)", fontFamily:"monospace",
          textTransform:"uppercase", letterSpacing:"1px", flexShrink:0,
        }}>Canvas Progress</span>
        <div style={{flex:1, height:4, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden"}}>
          <div style={{
            height:"100%", width:`${pct}%`,
            background:`linear-gradient(90deg, ${Y}, #fff176)`,
            borderRadius:99, transition:"width .6s ease",
            boxShadow:`0 0 10px rgba(255,209,0,0.5)`,
          }}/>
        </div>
        <span style={{
          fontSize:9, color:Y, fontFamily:"monospace", fontWeight:700, flexShrink:0,
        }}>{pct}%</span>
      </div>

      {/* ── LEGEND STRIP ── */}
      <div style={{
        position:"relative", zIndex:1,
        display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
        padding:"6px 24px 8px",
        borderTop:"1px solid rgba(30,55,90,0.4)",
        background:"rgba(0,0,0,0.2)",
      }}>
        <span style={{
          fontSize:8, color:"rgba(255,255,255,0.22)", fontFamily:"monospace",
          textTransform:"uppercase", letterSpacing:"1px", flexShrink:0,
        }}>Categories:</span>
        {CATS.map(c=>(
          <div key={c.key} style={{display:"flex", alignItems:"center", gap:4, fontSize:9, color:"rgba(255,255,255,0.45)"}}>
            <div style={{width:7, height:7, borderRadius:"50%", background:c.color, flexShrink:0, boxShadow:`0 0 4px ${c.color}80`}}/>
            {c.label}
          </div>
        ))}
        <span style={{marginLeft:"auto", fontSize:8, color:"rgba(255,255,255,0.2)", fontFamily:"monospace"}}>
          Click Customer Segment → Story View
        </span>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENTRY CHIP  — two-row layout, word-wrapping text
═══════════════════════════════════════════════════════════ */
function Chip({ entry, onEdit, onDelete, isSegSection, onSegClick, inlineWidth }) {
  const [hovered, setHovered] = useState(false);
  const cc = catColor(entry.cat);
  const hasLinks = (entry.segs||[]).length > 0;

  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      onClick={()=> isSegSection && onSegClick(entry.id)}
      style={{
        display:"flex", flexDirection:"column", gap:4,
        background: hovered
          ? "rgba(255,255,255,0.065)"
          : hasLinks ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
        border:`1px solid ${hovered ? "rgba(60,100,170,0.8)" : "rgba(30,55,90,0.55)"}`,
        borderLeft:`3px solid ${cc}`,
        borderRadius:7, padding:"6px 8px 7px",
        cursor: isSegSection ? "pointer" : "default",
        boxShadow: hasLinks ? `0 0 0 1px ${cc}18` : "none",
        transition:"background .15s, border-color .15s",
        width: inlineWidth ? "auto" : "100%",
        flexShrink: inlineWidth ? 0 : undefined,
      }}
    >
      {/* Row 1: category badge · seg-link tag · spacer · edit · delete */}
      <div style={{display:"flex", alignItems:"center", gap:4}}>
        {/* category badge */}
        <span style={{
          fontSize:7.5, fontWeight:700, fontFamily:"'JetBrains Mono',monospace",
          textTransform:"uppercase", letterSpacing:".5px",
          color:cc, background:`${cc}15`,
          border:`1px solid ${cc}50`,
          padding:"1.5px 5px", borderRadius:3,
          flexShrink:0, whiteSpace:"nowrap", lineHeight:1.7,
        }}>{catLabel(entry.cat)}</span>

        {hasLinks && (
          <span style={{
            fontSize:7, color:Y, fontFamily:"monospace",
            background:"rgba(255,209,0,.08)", border:"1px solid rgba(255,209,0,.22)",
            padding:"1px 4px", borderRadius:3, whiteSpace:"nowrap", lineHeight:1.7,
          }}>⟶ {entry.segs.length} seg</span>
        )}

        <div style={{flex:1}}/>

        {/* EDIT button — pencil icon, clearly visible on hover */}
        <button
          onClick={e=>{ e.stopPropagation(); onEdit(); }}
          title="Edit entry"
          style={{
            background: hovered ? "rgba(255,209,0,0.12)" : "transparent",
            border: hovered ? "1px solid rgba(255,209,0,0.3)" : "1px solid transparent",
            color: hovered ? Y : "rgba(255,255,255,0.2)",
            width:22, height:22, borderRadius:5,
            cursor:"pointer", flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all .15s",
          }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M7.5 1.5l2 2L3 10H1V8L7.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            <path d="M6 3l2 2" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
        </button>

        {/* DELETE button — trash icon, clearly visible on hover */}
        <button
          onClick={e=>{ e.stopPropagation(); onDelete(); }}
          title="Delete entry"
          style={{
            background: hovered ? "rgba(239,68,68,0.12)" : "transparent",
            border: hovered ? "1px solid rgba(239,68,68,0.35)" : "1px solid transparent",
            color: hovered ? "#ef4444" : "rgba(255,255,255,0.2)",
            width:22, height:22, borderRadius:5,
            cursor:"pointer", flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all .15s",
          }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 3h7M4.5 3V2h2v1M3.5 3l.5 6h3l.5-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Row 2: entry text — fully word-wrapped, auto height */}
      <span style={{
        fontSize:10.5, color:"#c8d4ed", lineHeight:1.5,
        wordBreak:"break-word", whiteSpace:"normal",
        display:"block", width:"100%",
      }}>
        {entry.text}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION CARD
═══════════════════════════════════════════════════════════ */
function SectionCard({ sid, entries, onAdd, onEdit, onDelete, onSegClick, wide }) {
  const s = SECTIONS[sid];
  return (
    <div style={{
      background:"rgba(11,17,30,0.72)",
      backdropFilter:"blur(16px) saturate(1.3)",
      WebkitBackdropFilter:"blur(16px) saturate(1.3)",
      border:`1px solid ${sid==="vp" ? "rgba(255,209,0,0.22)" : "rgba(30,55,90,0.55)"}`,
      borderRadius:13, display:"flex", flexDirection:"column",
      position:"relative", overflow:"hidden", height:"100%",
      boxShadow: sid==="vp" ? "0 0 40px rgba(255,209,0,0.07)" : "none",
    }}>
      {/* accent stripe */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:3,
        background:s.accent, opacity:.85, zIndex:2,
        boxShadow:`0 0 10px ${s.accent}60`,
      }}/>
      {/* dot grid */}
      <div style={{
        position:"absolute", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:"radial-gradient(circle,rgba(255,255,255,.028) 1px,transparent 1px)",
        backgroundSize:"18px 18px",
      }}/>

      <div style={{
        position:"relative", zIndex:1,
        display:"flex", flexDirection:"column",
        height:"100%", padding:"14px 13px 12px", gap:9,
      }}>
        {/* card header */}
        <div style={{display:"flex", alignItems:"center", gap:7, flexShrink:0}}>
          <span style={{
            fontFamily:"monospace", fontSize:8.5, fontWeight:700, color:s.accent,
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
            padding:"1px 5px", borderRadius:3, flexShrink:0,
          }}>{s.num}</span>
          <span style={{
            fontSize:10, fontWeight:700, color:"#dde4f0",
            textTransform:"uppercase", letterSpacing:".9px",
            flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
          }}>{s.name}</span>
          <span style={{
            fontFamily:"monospace", fontSize:9, color:"rgba(255,255,255,0.35)",
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(30,55,90,0.55)",
            padding:"1px 6px", borderRadius:20, flexShrink:0,
          }}>{entries.length}</span>
          <button
            onClick={onAdd}
            title="Add entry"
            style={{
              background:"rgba(255,209,0,0.1)", border:"1px solid rgba(255,209,0,.22)",
              color:Y, width:24, height:24, borderRadius:5, cursor:"pointer",
              fontSize:17, display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, transition:"all .15s", lineHeight:1, fontFamily:"'Inter',sans-serif",
            }}>+</button>
        </div>

        {/* divider */}
        <div style={{height:1, background:"rgba(30,55,90,0.55)", margin:"0 -13px", flexShrink:0}}/>

        {/* entries list — scrollable, auto-height chips */}
        <div style={{
          flex:1, overflowY:"auto",
          display:"flex",
          flexDirection: wide ? "row" : "column",
          flexWrap: wide ? "wrap" : "nowrap",
          gap:5, paddingRight:2, alignContent:"flex-start",
        }}>
          {entries.length === 0 ? (
            <div style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", gap:5, padding:"20px 8px",
              opacity:.32, flex:1, width:"100%",
            }}>
              <span style={{fontSize:22}}>{s.icon}</span>
              <span style={{fontSize:9, color:"#5a6e92", textAlign:"center", lineHeight:1.6}}>
                {s.hint}
              </span>
            </div>
          ) : entries.map(e=>(
            <Chip
              key={e.id} entry={e}
              onEdit={()=>onEdit(sid, e.id)}
              onDelete={()=>onDelete(sid, e.id)}
              onSegClick={onSegClick}
              isSegSection={sid==="cs"}
              inlineWidth={wide}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   STORY DRAWER
═══════════════════════════════════════════════════════════ */
const FLOW = [
  {sid:"kp",  color:"#3b82f6", label:"Key Partners"},
  {sid:"ka",  color:"#a855f7", label:"Key Activities"},
  {sid:"kr",  color:"#6366f1", label:"Key Resources"},
  {sid:"vp",  color:Y,         label:"Value Propositions"},
  {sid:"cr",  color:"#19b8c2", label:"Customer Relationships"},
  {sid:"ch",  color:"#0ea5e9", label:"Channels"},
  {sid:"rev", color:"#22c55e", label:"Revenue Streams"},
];

function countLinked(state, segId) {
  return LINKABLE.reduce((n,sid)=>n+(state[sid]||[]).filter(e=>(e.segs||[]).includes(segId)).length, 0);
}

function StoryDrawer({ state, activeSegId, onSelectSeg, onClose }) {
  const segs = state.cs ?? [];
  const seg  = segs.find(s=>s.id===activeSegId);

  return (
    <div style={{
      background:"rgba(5,8,18,0.94)",
      backdropFilter:"blur(22px)", WebkitBackdropFilter:"blur(22px)",
      borderLeft:"1px solid rgba(30,55,90,0.6)",
      display:"flex", flexDirection:"column", height:"100%", overflow:"hidden",
    }}>
      {/* head */}
      <div style={{padding:"16px 18px 12px", borderBottom:"1px solid rgba(30,55,90,0.55)", flexShrink:0, position:"relative"}}>
        <div style={{position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${Y},#22c55e)`}}/>
        <div style={{fontSize:13, fontWeight:700, color:"#fff", letterSpacing:"-.2px"}}>🗺 Success Story Tracer</div>
        <div style={{fontSize:9, color:"#5a6e92", fontFamily:"monospace", marginTop:3}}>
          {seg ? `→ ${seg.text.slice(0,36)}` : "Select a customer segment"}
        </div>
        <button onClick={onClose} style={{
          position:"absolute", top:14, right:14,
          background:"rgba(255,255,255,.04)", border:"1px solid rgba(30,55,90,0.55)",
          color:"#5a6e92", width:26, height:26, borderRadius:5, cursor:"pointer",
          fontSize:15, display:"flex", alignItems:"center", justifyContent:"center",
        }}>×</button>
      </div>

      <div style={{flex:1, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:10}}>
        {!activeSegId ? (
          <>
            <div style={{fontSize:9, color:"#5a6e92", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:.8, marginBottom:2}}>Customer Segments</div>
            {segs.length===0 ? (
              <div style={{textAlign:"center", opacity:.4, padding:"28px 0", fontSize:11, color:"#5a6e92"}}>
                Add Customer Segment entries first
              </div>
            ) : segs.map(s=>(
              <button key={s.id} onClick={()=>onSelectSeg(s.id)} style={{
                background:"rgba(255,255,255,.03)", border:"1px solid rgba(30,55,90,0.55)",
                borderRadius:8, padding:"9px 12px", cursor:"pointer", textAlign:"left",
                display:"flex", alignItems:"center", gap:8, width:"100%",
              }}>
                <span style={{fontSize:14}}>👤</span>
                <span style={{fontSize:12, fontWeight:600, color:"#cdd8f0", flex:1}}>{s.text.slice(0,42)}</span>
                <span style={{fontSize:9, color:"#5a6e92", fontFamily:"monospace"}}>{countLinked(state,s.id)} linked</span>
              </button>
            ))}
          </>
        ) : (
          <>
            <button onClick={()=>onSelectSeg(null)} style={{
              background:"rgba(255,255,255,.03)", border:"1px solid rgba(30,55,90,0.55)",
              borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:10, color:"#5a6e92", textAlign:"left",
            }}>← All Segments</button>
            <div style={{background:"rgba(255,255,255,.03)", border:"1px solid rgba(30,55,90,0.55)", borderRadius:13, overflow:"hidden"}}>
              <div style={{padding:"11px 13px", background:"linear-gradient(135deg,rgba(34,197,94,.12),rgba(34,197,94,.04))", borderBottom:"1px solid rgba(34,197,94,.2)"}}>
                <div style={{fontSize:13, fontWeight:700, color:"#fff"}}>{seg.text}</div>
                <span style={{fontSize:8, color:"#22c55e", fontFamily:"monospace", background:"rgba(34,197,94,.12)", border:"1px solid rgba(34,197,94,.3)", padding:"1px 5px", borderRadius:2, textTransform:"uppercase", letterSpacing:.5}}>{catLabel(seg.cat)}</span>
              </div>
              {FLOW.map(({sid,color,label})=>{
                const items=(state[sid]||[]).filter(e=>(e.segs||[]).includes(activeSegId));
                if(!items.length) return null;
                return (
                  <div key={sid} style={{borderBottom:"1px solid rgba(30,55,90,0.55)"}}>
                    <div style={{display:"flex", alignItems:"center", gap:8, padding:"7px 12px", background:"rgba(255,255,255,.02)"}}>
                      <div style={{width:6, height:6, borderRadius:"50%", background:color, flexShrink:0}}/>
                      <div style={{fontSize:9, fontWeight:700, color:"#5a6e92", textTransform:"uppercase", letterSpacing:.8, flex:1, fontFamily:"monospace"}}>{label}</div>
                      <div style={{fontSize:8, color:"#2d3d5a", fontFamily:"monospace"}}>{items.length}</div>
                    </div>
                    <div style={{display:"flex", flexDirection:"column", gap:3, padding:"5px 12px 9px"}}>
                      {items.map(e=>{
                        const cc=catColor(e.cat);
                        return (
                          <div key={e.id} style={{display:"flex", flexDirection:"column", gap:3, padding:"5px 8px", background:"rgba(255,255,255,.03)", borderRadius:4, borderLeft:`2px solid ${color}`}}>
                            <span style={{fontSize:7.5, color:cc, fontFamily:"monospace", background:`${cc}15`, border:`1px solid ${cc}40`, padding:"1px 4px", borderRadius:2, textTransform:"uppercase", letterSpacing:.5, alignSelf:"flex-start", lineHeight:1.6}}>{catLabel(e.cat)}</span>
                            <span style={{fontSize:10.5, color:"#c8d4ed", lineHeight:1.45, wordBreak:"break-word"}}>{e.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {countLinked(state,activeSegId)===0 && (
                <div style={{padding:"20px 16px", textAlign:"center", opacity:.4}}>
                  <div style={{fontSize:22}}>🔗</div>
                  <div style={{fontSize:11, color:"#5a6e92", marginTop:6, lineHeight:1.6}}>
                    No entries linked yet.<br/>Link entries to this segment when adding them.
                  </div>
                </div>
              )}
            </div>
            <div style={{fontSize:9, color:"#2d3d5a", fontFamily:"monospace", textAlign:"center", paddingTop:4}}>
              {countLinked(state,activeSegId)} entries linked across the canvas
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════════ */
function Modal({ open, onClose, onSave, sid, editEntry, allSegs }) {
  const [text, setText] = useState("");
  const [cat,  setCat]  = useState("medium");
  const [segs, setSegs] = useState(new Set());

  useState(()=>{
    if(open){
      setText(editEntry?.text ?? "");
      setCat(editEntry?.cat  ?? "medium");
      setSegs(new Set(editEntry?.segs ?? []));
    }
  });

  // Reset when modal opens
  const prevOpen = useRef(false);
  if(open && !prevOpen.current){
    prevOpen.current = true;
    // values already set in render via closure — handled in useEffect below
  }
  if(!open) prevOpen.current = false;

  const handleOpen = ()=>{
    setText(editEntry?.text ?? "");
    setCat(editEntry?.cat  ?? "medium");
    setSegs(new Set(editEntry?.segs ?? []));
  };

  // Use effect for reset on open
  const openRef = useRef(open);
  if(open !== openRef.current){
    openRef.current = open;
    if(open) handleOpen();
  }

  if(!open) return null;
  const s = SECTIONS[sid] ?? {};
  const isEdit = !!editEntry;
  const showLink = LINKABLE.includes(sid) && allSegs.length > 0;
  const toggleSeg = id => setSegs(p=>{ const n=new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });
  const handleSave = () => { if(!text.trim()) return; onSave({text:text.trim(), cat, segs:[...segs]}); };

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{
      position:"fixed", inset:0, background:"rgba(2,5,12,.84)",
      backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
      zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:20,
    }}>
      <div style={{
        background:"rgba(9,14,26,0.97)", border:"1px solid rgba(60,100,170,0.8)",
        borderRadius:13, width:"100%", maxWidth:500,
        boxShadow:"0 40px 100px rgba(0,0,0,.7)", overflow:"hidden",
      }}>
        <div style={{background:"rgba(255,255,255,.03)", borderBottom:"1px solid rgba(30,55,90,0.55)", padding:"18px 22px 14px", position:"relative"}}>
          <div style={{position:"absolute", top:0, left:0, right:0, height:2, background:Y}}/>
          <div style={{fontSize:8, fontFamily:"monospace", color:Y, textTransform:"uppercase", letterSpacing:1.5, marginBottom:3}}>{isEdit?"EDIT ENTRY":"ADD ENTRY"}</div>
          <div style={{fontSize:16, fontWeight:700, color:"#fff", letterSpacing:"-.2px"}}>{isEdit?"Edit Entry":"New Entry"}</div>
          <div style={{fontSize:10, color:"#5a6e92", marginTop:2}}>→ {s.name}</div>
          <button onClick={onClose} style={{position:"absolute", top:16, right:18, background:"rgba(255,255,255,.04)", border:"1px solid rgba(30,55,90,0.55)", color:"#5a6e92", width:26, height:26, borderRadius:5, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"18px 22px 20px", display:"flex", flexDirection:"column", gap:16, maxHeight:"62vh", overflowY:"auto"}}>
          <div>
            <label style={{display:"block", fontSize:9, fontWeight:700, color:"#5a6e92", textTransform:"uppercase", letterSpacing:.8, marginBottom:7, fontFamily:"monospace"}}>Description</label>
            <textarea
              value={text} onChange={e=>setText(e.target.value)} autoFocus
              placeholder="Describe this element clearly…"
              style={{width:"100%", background:"rgba(255,255,255,.04)", border:`1px solid ${text?"rgba(255,209,0,.5)":"rgba(30,55,90,0.55)"}`, color:"#cdd8f0", padding:"9px 11px", borderRadius:8, fontSize:12, fontFamily:"'Inter',sans-serif", outline:"none", resize:"vertical", minHeight:72, lineHeight:1.5}}
            />
          </div>
          <div>
            <label style={{display:"block", fontSize:9, fontWeight:700, color:"#5a6e92", textTransform:"uppercase", letterSpacing:.8, marginBottom:7, fontFamily:"monospace"}}>Category / Priority</label>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:5}}>
              {CATS.map(c=>(
                <div key={c.key} onClick={()=>setCat(c.key)} style={{
                  display:"flex", alignItems:"center", gap:8,
                  background: cat===c.key ? `${c.color}10` : "rgba(255,255,255,.02)",
                  border: cat===c.key ? `1px solid ${c.color}` : "1px solid rgba(30,55,90,0.55)",
                  borderRadius:8, padding:"7px 10px", cursor:"pointer",
                }}>
                  <div style={{width:9, height:9, borderRadius:"50%", background:c.color, flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11, fontWeight:600, color:"#dde4f0"}}>{c.label}</div>
                    <div style={{fontSize:8, color:"#5a6e92"}}>{c.desc}</div>
                  </div>
                  {cat===c.key && <span style={{fontSize:11, color:c.color}}>✓</span>}
                </div>
              ))}
            </div>
          </div>
          {showLink && (
            <div>
              <label style={{display:"block", fontSize:9, fontWeight:700, color:"#5a6e92", textTransform:"uppercase", letterSpacing:.8, marginBottom:7, fontFamily:"monospace"}}>Link to Customer Segment(s)</label>
              <div style={{display:"flex", flexDirection:"column", gap:4}}>
                {allSegs.map(seg=>(
                  <div key={seg.id} onClick={()=>toggleSeg(seg.id)} style={{
                    display:"flex", alignItems:"center", gap:7,
                    background: segs.has(seg.id) ? "rgba(34,197,94,.06)" : "rgba(255,255,255,.02)",
                    border: segs.has(seg.id) ? "1px solid #22c55e" : "1px solid rgba(30,55,90,0.55)",
                    borderRadius:5, padding:"6px 9px", cursor:"pointer",
                  }}>
                    <div style={{width:13, height:13, border: segs.has(seg.id)?"none":"1px solid rgba(30,55,90,0.55)", borderRadius:3, background:segs.has(seg.id)?"#22c55e":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#000", flexShrink:0}}>{segs.has(seg.id)?"✓":""}</div>
                    <span style={{fontSize:11, color:"#cdd8f0"}}>{seg.text.slice(0,50)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{display:"flex", gap:7, borderTop:"1px solid rgba(30,55,90,0.55)", padding:"12px 22px", background:"rgba(255,255,255,.02)"}}>
          <button onClick={onClose} style={{flex:1, background:"transparent", border:"1px solid rgba(30,55,90,0.55)", color:"#5a6e92", padding:9, borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"'Inter',sans-serif"}}>Cancel</button>
          <button onClick={handleSave} style={{flex:2, background:Y, border:"none", color:"#080808", padding:9, borderRadius:8, fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"'Inter',sans-serif"}}>
            {isEdit?"Update Entry":"Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════ */
function Toast({ msg, show }) {
  return (
    <div style={{
      position:"fixed", bottom:24, right:24, zIndex:600,
      background:"rgba(9,14,26,0.96)", border:"1px solid rgba(60,100,170,0.8)",
      color:"#cdd8f0", padding:"10px 14px 10px 11px", borderRadius:8,
      fontSize:11, fontWeight:500,
      display:"flex", alignItems:"center", gap:8,
      boxShadow:"0 8px 32px rgba(0,0,0,.5)",
      transform: show?"translateY(0)":"translateY(10px)",
      opacity: show?1:0, transition:"opacity .2s,transform .2s", pointerEvents:"none",
    }}>
      <div style={{width:3, height:26, background:Y, borderRadius:99, flexShrink:0}}/>
      {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [state,      setState]      = useState(DEMO);
  const [modal,      setModal]      = useState({open:false, sid:"vp", editEntry:null});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSegId,setActiveSegId]= useState(null);
  const [toast,      setToast]      = useState({msg:"",show:false});
  const toastTimer = useRef(null);

  const showToast = msg => {
    setToast({msg,show:true});
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(()=>setToast(t=>({...t,show:false})), 2200);
  };

  const openAdd  = sid => setModal({open:true, sid, editEntry:null});
  const openEdit = (sid,id) => setModal({open:true, sid, editEntry:state[sid]?.find(x=>x.id===id)??null});
  const closeModal = () => setModal(m=>({...m,open:false}));

  const handleSave = ({text,cat,segs}) => {
    const {sid,editEntry} = modal;
    setState(prev=>{
      const arr=[...(prev[sid]??[])];
      if(editEntry){ const i=arr.findIndex(e=>e.id===editEntry.id); if(i>-1) arr[i]={...arr[i],text,cat,segs}; showToast("Entry updated"); }
      else { arr.push({id:mkId(),text,cat,segs,ts:Date.now()}); showToast("Added to "+SECTIONS[sid].name); }
      return {...prev,[sid]:arr};
    });
    closeModal();
  };

  const handleDelete = (sid,id) => {
    setState(prev=>({...prev,[sid]:(prev[sid]??[]).filter(e=>e.id!==id)}));
    showToast("Entry removed");
  };

  const openStory = segId => { setDrawerOpen(true); setActiveSegId(segId); };

  const all    = Object.values(state).flat();
  const filled = Object.values(state).filter(a=>a.length>0).length;
  const pct    = Math.round((filled/9)*100);

  const kpis = [
    {v:all.length,                                         l:"Entries",      c:"#3b82f6"},
    {v:`${filled}/9`,                                      l:"Sections",     c:"#22c55e"},
    {v:all.filter(e=>e.cat==="critical").length,           l:"Critical",     c:"#ef4444"},
    {v:all.filter(e=>e.cat==="opportunity").length,        l:"Opps",         c:"#3b82f6"},
    {v:(state.cs??[]).length,                              l:"Segments",     c:Y        },
  ];

  return (
    <div style={{fontFamily:"'Inter',sans-serif", background:"#06090f", color:"#cdd8f0", minHeight:"100vh", position:"relative"}}>
      <BimBg/>

      <HeroHeader
        kpis={kpis} pct={pct}
        drawerOpen={drawerOpen}
        onToggleDrawer={()=>{ setDrawerOpen(v=>!v); if(!drawerOpen) setActiveSegId(null); }}
        onAddEntry={()=>openAdd("vp")}
      />

      {/* APP BODY */}
      <div style={{
        display:"grid",
        gridTemplateColumns: drawerOpen ? "1fr 360px" : "1fr",
        transition:"grid-template-columns .3s ease",
        position:"relative", zIndex:1,
      }}>
        <main style={{padding:"14px 16px 48px", overflow:"hidden"}}>
          {/* flow labels */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:8, marginBottom:7}}>
            {[["① Infrastructure",""], ["② Operations",""], ["③ Value",Y], ["④ Customer Facing",""], ["⑤ Market",""]].map(([lbl,hi],i)=>(
              <div key={i} style={{
                textAlign:"center", fontSize:8, fontFamily:"monospace",
                color: hi ? Y : "rgba(255,255,255,0.28)",
                textTransform:"uppercase", letterSpacing:1,
                padding:"4px 6px", background:"rgba(255,255,255,.02)",
                border:`1px solid ${hi ? "rgba(255,209,0,.28)" : "rgba(30,55,90,0.35)"}`,
                borderRadius:4,
              }}>{lbl}</div>
            ))}
          </div>

          {/* BMC GRID */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"1fr 1fr 1.1fr 1fr 1fr",
            gridTemplateRows:"minmax(220px,1fr) minmax(220px,1fr) minmax(150px,auto)",
            gap:8,
          }}>
            <div style={{gridColumn:"1/2", gridRow:"1/3"}}>
              <SectionCard sid="kp"   entries={state.kp??[]}   onAdd={()=>openAdd("kp")}   onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            <div style={{gridColumn:"2/3", gridRow:"1/2"}}>
              <SectionCard sid="ka"   entries={state.ka??[]}   onAdd={()=>openAdd("ka")}   onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            <div style={{gridColumn:"3/4", gridRow:"1/3"}}>
              <SectionCard sid="vp"   entries={state.vp??[]}   onAdd={()=>openAdd("vp")}   onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            <div style={{gridColumn:"4/5", gridRow:"1/2"}}>
              <SectionCard sid="cr"   entries={state.cr??[]}   onAdd={()=>openAdd("cr")}   onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            <div style={{gridColumn:"5/6", gridRow:"1/3"}}>
              <SectionCard sid="cs"   entries={state.cs??[]}   onAdd={()=>openAdd("cs")}   onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            <div style={{gridColumn:"2/3", gridRow:"2/3"}}>
              <SectionCard sid="kr"   entries={state.kr??[]}   onAdd={()=>openAdd("kr")}   onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            <div style={{gridColumn:"4/5", gridRow:"2/3"}}>
              <SectionCard sid="ch"   entries={state.ch??[]}   onAdd={()=>openAdd("ch")}   onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            <div style={{gridColumn:"1/3", gridRow:"3/4"}}>
              <SectionCard sid="cost" entries={state.cost??[]} onAdd={()=>openAdd("cost")} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory} wide/>
            </div>
            <div style={{gridColumn:"3/6", gridRow:"3/4"}}>
              <SectionCard sid="rev"  entries={state.rev??[]}  onAdd={()=>openAdd("rev")}  onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory} wide/>
            </div>
          </div>
        </main>

        {drawerOpen && (
          <StoryDrawer
            state={state} activeSegId={activeSegId}
            onSelectSeg={setActiveSegId}
            onClose={()=>setDrawerOpen(false)}
          />
        )}
      </div>

      <Modal
        open={modal.open} onClose={closeModal} onSave={handleSave}
        sid={modal.sid} editEntry={modal.editEntry} allSegs={state.cs??[]}
      />
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  );
}
