import { useState, useEffect, useRef } from "react";
 
/* ─── PALETTE & CONSTANTS ───────────────────────────────── */
const Y = "#ffd100";
const CATS = [
  { key:"critical",    color:"#ef4444", label:"Critical",      desc:"Must-have / blocker"    },
  { key:"high",        color:"#f97316", label:"High Priority", desc:"Significant importance"  },
  { key:"medium",      color:Y,         label:"Medium",        desc:"Moderate importance"     },
  { key:"low",         color:"#22c55e", label:"Low / Done",    desc:"Minor or resolved"       },
  { key:"opportunity", color:"#3b82f6", label:"Opportunity",   desc:"Growth potential"        },
  { key:"risk",        color:"#a855f7", label:"Risk",          desc:"Threat to address"       },
  { key:"strength",    color:"#19b8c2", label:"Strength",      desc:"Core advantage"          },
  { key:"info",        color:"#64748b", label:"Info",          desc:"General reference"       },
];
const catColor = (key) => CATS.find(c=>c.key===key)?.color ?? Y;
const catLabel = (key) => CATS.find(c=>c.key===key)?.label ?? key;

const SECTIONS = {
  kp:   { name:"Key Partners",           num:"01", accent:"#3b82f6", icon:"🤝", hint:"Key suppliers, alliances & partners" },
  ka:   { name:"Key Activities",         num:"02", accent:"#a855f7", icon:"⚙️", hint:"Core processes to deliver value"      },
  vp:   { name:"Value Propositions",     num:"03", accent:Y,         icon:"💎", hint:"What unique value do we deliver?"     },
  cr:   { name:"Customer Relationships", num:"04", accent:"#19b8c2", icon:"💬", hint:"How do we engage each segment?"        },
  cs:   { name:"Customer Segments",      num:"05", accent:"#22c55e", icon:"👥", hint:"Click a segment → trace its story"    },
  kr:   { name:"Key Resources",          num:"06", accent:"#6366f1", icon:"🏗️", hint:"Physical, IP, human & financial"       },
  ch:   { name:"Channels",              num:"07", accent:"#0ea5e9", icon:"📡", hint:"How we reach our customers"            },
  cost: { name:"Cost Structure",         num:"08", accent:"#ef4444", icon:"📉", hint:"Most significant costs"               },
  rev:  { name:"Revenue Streams",        num:"09", accent:"#22c55e", icon:"📈", hint:"Revenue generated per segment"        },
};
const LINKABLE = ["vp","cr","ch","kp","ka","kr","rev"];

/* ─── DEMO SEED DATA ────────────────────────────────────── */
const mkId = () => "e" + Date.now().toString(36) + Math.random().toString(36).slice(2,5);
const SEG_ARCH = mkId(), SEG_CONT = mkId(), SEG_OWNER = mkId();

const DEMO = {
  cs: [
    { id:SEG_ARCH,  text:"Architecture Firms (AEC Design Studios)", cat:"strength", segs:[] },
    { id:SEG_CONT,  text:"General Contractors & BIM Managers",       cat:"high",     segs:[] },
    { id:SEG_OWNER, text:"Building Owners & Facility Managers",       cat:"opportunity", segs:[] },
  ],
  kp: [
    { id:mkId(), text:"Autodesk & Graphisoft reseller network",      cat:"strength",    segs:[SEG_ARCH,SEG_CONT] },
    { id:mkId(), text:"IFC/buildingSMART standards body",            cat:"info",        segs:[SEG_ARCH,SEG_CONT,SEG_OWNER] },
    { id:mkId(), text:"Cloud infrastructure (AWS / Azure)",          cat:"high",        segs:[SEG_ARCH,SEG_CONT] },
    { id:mkId(), text:"University BIM research partnerships",        cat:"opportunity", segs:[SEG_ARCH] },
  ],
  ka: [
    { id:mkId(), text:"Continuous IFC compliance engine development", cat:"critical",   segs:[SEG_ARCH,SEG_CONT] },
    { id:mkId(), text:"BIM model quality validation & clash detection",cat:"high",      segs:[SEG_CONT] },
    { id:mkId(), text:"Customer onboarding & BIM implementation support",cat:"strength",segs:[SEG_ARCH,SEG_CONT,SEG_OWNER] },
    { id:mkId(), text:"SDK & API integration for third-party tools",  cat:"opportunity",segs:[SEG_ARCH,SEG_CONT] },
  ],
  kr: [
    { id:mkId(), text:"Proprietary IFC parsing & geometry engine",   cat:"strength",    segs:[SEG_ARCH,SEG_CONT] },
    { id:mkId(), text:"AECO domain expert team (50+ engineers)",     cat:"high",        segs:[SEG_ARCH,SEG_CONT,SEG_OWNER] },
    { id:mkId(), text:"ISO 19650 certification & compliance library", cat:"strength",   segs:[SEG_CONT,SEG_OWNER] },
    { id:mkId(), text:"Cloud-based model repository infrastructure",  cat:"medium",     segs:[SEG_ARCH] },
  ],
  vp: [
    { id:mkId(), text:"Only fully openBIM-native platform with zero vendor lock-in", cat:"strength",    segs:[SEG_ARCH,SEG_CONT,SEG_OWNER] },
    { id:mkId(), text:"Real-time IFC4.3 validation reducing coordination errors by 60%", cat:"critical",segs:[SEG_CONT] },
    { id:mkId(), text:"Single source of truth for entire project lifecycle",          cat:"high",       segs:[SEG_ARCH,SEG_CONT,SEG_OWNER] },
    { id:mkId(), text:"AI-assisted clash detection & automated BIM audits",           cat:"opportunity",segs:[SEG_ARCH,SEG_CONT] },
    { id:mkId(), text:"Digital twin ready — seamless FM handover package",            cat:"strength",   segs:[SEG_OWNER] },
  ],
  cr: [
    { id:mkId(), text:"Dedicated BIM Success Manager per enterprise account",        cat:"strength",    segs:[SEG_ARCH,SEG_CONT,SEG_OWNER] },
    { id:mkId(), text:"ACCA Academy — online BIM certification programme",           cat:"high",        segs:[SEG_ARCH,SEG_CONT] },
    { id:mkId(), text:"Community forum for openBIM practitioners",                   cat:"medium",      segs:[SEG_ARCH,SEG_CONT] },
    { id:mkId(), text:"Quarterly executive business reviews for top-tier clients",   cat:"opportunity", segs:[SEG_OWNER] },
  ],
  ch: [
    { id:mkId(), text:"Direct SaaS subscription via acca.it platform",              cat:"strength",    segs:[SEG_ARCH,SEG_CONT,SEG_OWNER] },
    { id:mkId(), text:"Authorised reseller network across 40+ countries",            cat:"high",        segs:[SEG_ARCH,SEG_CONT] },
    { id:mkId(), text:"BIM conferences & buildingSMART events",                      cat:"medium",      segs:[SEG_ARCH,SEG_CONT] },
    { id:mkId(), text:"Partner integrations (Revit, ArchiCAD, Navisworks)",          cat:"opportunity", segs:[SEG_ARCH,SEG_CONT] },
  ],
  cost: [
    { id:mkId(), text:"R&D — IFC engine & AI feature development",   cat:"critical",   segs:[] },
    { id:mkId(), text:"Cloud hosting & storage infrastructure",       cat:"high",       segs:[] },
    { id:mkId(), text:"Sales & partner channel commissions",          cat:"medium",     segs:[] },
    { id:mkId(), text:"ISO 19650 compliance & certification audits",  cat:"medium",     segs:[] },
  ],
  rev: [
    { id:mkId(), text:"Enterprise SaaS licences (annual ARR)",        cat:"strength",   segs:[SEG_ARCH,SEG_CONT,SEG_OWNER] },
    { id:mkId(), text:"Professional Services — BIM implementation",   cat:"high",       segs:[SEG_CONT,SEG_OWNER] },
    { id:mkId(), text:"ACCA Academy certification fees",              cat:"medium",     segs:[SEG_ARCH,SEG_CONT] },
    { id:mkId(), text:"API usage & white-label SDK licensing",        cat:"opportunity",segs:[SEG_ARCH,SEG_CONT] },
  ],
};

/* ─── BIM SVG BACKGROUND ────────────────────────────────── */
function BimBackground() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"
           style={{ width:"100%", height:"100%" }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bg1" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#0c1628"/>
            <stop offset="100%" stopColor="#06090f"/>
          </radialGradient>
          <radialGradient id="gy" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd100" stopOpacity="0.07"/>
            <stop offset="100%" stopColor="#ffd100" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="gb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.06"/>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
          </radialGradient>
          <filter id="gf"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect width="1600" height="900" fill="url(#bg1)"/>
        <ellipse cx="800" cy="380" rx="650" ry="420" fill="url(#gy)"/>
        <ellipse cx="150" cy="720" rx="380" ry="300" fill="url(#gb)"/>
        <ellipse cx="1450" cy="180" rx="320" ry="240" fill="url(#gb)"/>

        {/* Grid */}
        <g stroke="#1a2d4a" strokeWidth="0.55" opacity="0.45">
          {[100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500].map(x=>
            <line key={x} x1={x} y1="0" x2={x} y2="900"/>)}
          {[100,200,300,400,500,600,700,800].map(y=>
            <line key={y} x1="0" y1={y} x2="1600" y2={y}/>)}
        </g>

        {/* Building left */}
        <g stroke="#1e3a6a" strokeWidth="1" fill="none" opacity="0.5" transform="translate(40,160)">
          <polygon points="0,310 0,75 165,0 330,75 330,310" stroke="#2a4d88" fill="#091422" fillOpacity="0.55"/>
          <polygon points="0,75 165,0 330,75 165,150" stroke="#3b6ab5" fill="#0e1e3a" fillOpacity="0.45"/>
          <polygon points="330,75 330,310 430,230 430,0 165,0 330,75" fill="#070f1c" fillOpacity="0.5"/>
          {[30,140,250].map(x=>[120,205].map(y=>
            <rect key={`${x}${y}`} x={x} y={y} width="42" height="52" stroke="#2560b8" strokeWidth="0.8" fill="#1a3a6e" fillOpacity="0.35"/>
          ))}
        </g>

        {/* Building right */}
        <g stroke="#1e3a6a" strokeWidth="1" fill="none" opacity="0.38" transform="translate(1120,50)">
          <polygon points="0,450 0,55 185,0 370,55 370,450" stroke="#2a4d88" fill="#091422" fillOpacity="0.48"/>
          <polygon points="0,55 185,0 370,55 185,110" stroke="#3b6ab5" fill="#0e1e3a" fillOpacity="0.4"/>
          <polygon points="370,55 370,450 470,370 470,-35 185,0 370,55" fill="#070f1c" fillOpacity="0.42"/>
          {[28,148,270].map(x=>[115,215,315].map(y=>
            <rect key={`${x}${y}`} x={x} y={y} width="46" height="56" stroke="#2560b8" strokeWidth="0.8" fill="#1a3a6e" fillOpacity="0.28"/>
          ))}
        </g>

        {/* Floor plan top-right */}
        <g stroke="#1a3060" strokeWidth="0.9" fill="none" opacity="0.22" transform="translate(1060,12)">
          <rect x="0" y="0" width="310" height="210" stroke="#2a4d88"/>
          <line x1="0" y1="85" x2="310" y2="85"/>
          <line x1="125" y1="0" x2="125" y2="85"/>
          <line x1="185" y1="85" x2="185" y2="210"/>
          <rect x="18" y="18" width="64" height="42" stroke="#1e3a6a"/>
          <rect x="148" y="18" width="64" height="42" stroke="#1e3a6a"/>
          <rect x="18" y="112" width="82" height="64" stroke="#1e3a6a"/>
          <rect x="204" y="112" width="82" height="64" stroke="#1e3a6a"/>
          <path d="M18,85 A42,42 0 0,1 60,43" stroke="#3b6ab5" strokeWidth="0.8"/>
          <path d="M205,85 A42,42 0 0,0 247,43" stroke="#3b6ab5" strokeWidth="0.8"/>
        </g>

        {/* IFC nodes bottom-centre */}
        <g opacity="0.2" filter="url(#gf)">
          {[[500,762],[620,802],[700,732],[800,782],[880,722],[980,762],[1060,800],[760,852],[840,842]].map(([cx,cy],i)=>
            <circle key={i} cx={cx} cy={cy} r={[6,5,7,4,6,5,4,5,4][i]}
              fill={["#ffd100","#3b82f6","#ffd100","#22c55e","#ffd100","#3b82f6","#a855f7","#19b8c2","#f97316"][i]}/>
          )}
          {[[500,762,700,732],[700,732,800,782],[700,732,880,722],[880,722,980,762],[800,782,760,852],[500,762,620,802]].map(([x1,y1,x2,y2],i)=>
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffd100" strokeWidth="1"/>
          )}
        </g>

        {/* Coordinate axes */}
        <g opacity="0.16" transform="translate(1460,790)">
          <line x1="0" y1="0" x2="75" y2="0" stroke="#ef4444" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="0" y2="-75" stroke="#22c55e" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="-48" y2="-48" stroke="#3b82f6" strokeWidth="1.5"/>
          <polygon points="75,0 65,-4 65,4" fill="#ef4444"/>
          <polygon points="0,-75 -4,-65 4,-65" fill="#22c55e"/>
          <polygon points="-48,-48 -44,-36 -36,-44" fill="#3b82f6"/>
          <text x="80" y="5" fill="#ef4444" fontSize="9" fontFamily="monospace">X</text>
          <text x="-7" y="-79" fill="#22c55e" fontSize="9" fontFamily="monospace">Z</text>
          <text x="-62" y="-52" fill="#3b82f6" fontSize="9" fontFamily="monospace">Y</text>
        </g>

        <text x="28" y="888" fill="#1a3050" fontSize="8.5" fontFamily="monospace" opacity="0.6">IFC4.3 · ISO 19650 · openBIM · buildingSMART</text>
        <text x="1170" y="888" fill="#1a3050" fontSize="8.5" fontFamily="monospace" opacity="0.6">AECO Industry · ACCA software S.p.A.</text>
      </svg>
    </div>
  );
}

/* ─── CHIP ──────────────────────────────────────────────── */
function Chip({ entry, onEdit, onDelete, onSegClick, isSegSection, inlineWidth }) {
  const cc = catColor(entry.cat);
  const hasLinks = (entry.segs||[]).length > 0;
  return (
    <div
      onClick={() => isSegSection ? onSegClick(entry.id) : null}
      style={{
        display:"flex", flexDirection:"column", gap:3,
        background: hasLinks ? "rgba(255,255,255,0.055)" : "rgba(255,255,255,0.025)",
        border:"1px solid rgba(40,65,110,0.5)",
        borderLeft:`3px solid ${cc}`,
        borderRadius:6, padding:"5px 7px 6px",
        cursor: isSegSection ? "pointer" : "default",
        boxShadow: hasLinks ? `0 0 0 1px ${cc}1a` : "none",
        transition:"background .15s, border-color .15s",
        width: inlineWidth ? "auto" : "100%",
      }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
        <span style={{
          fontSize:7, fontWeight:700, fontFamily:"'JetBrains Mono',monospace",
          textTransform:"uppercase", letterSpacing:.5,
          color:cc, background:"rgba(255,255,255,0.05)",
          border:`1px solid ${cc}55`,
          padding:"1px 4px", borderRadius:2, flexShrink:0, opacity:.9,
          whiteSpace:"nowrap", lineHeight:1.6,
        }}>{catLabel(entry.cat)}</span>
        {hasLinks && (
          <span style={{
            fontSize:7, color:Y, fontFamily:"monospace",
            background:"rgba(255,209,0,.07)", border:"1px solid rgba(255,209,0,.2)",
            padding:"1px 4px", borderRadius:2, whiteSpace:"nowrap", lineHeight:1.6,
          }}>⟶ {entry.segs.length} seg</span>
        )}
        <div style={{ flex:1 }}/>
        
        {/* EDIT BUTTON (Updated for Visibility) */}
        <button
          onClick={(e)=>{ e.stopPropagation(); onEdit(); }}
          title="Edit"
          style={{ 
            background:"rgba(255,255,255,0.06)", 
            border:"1px solid rgba(100,120,160,0.5)", 
            color:"#a0b0d0", 
            cursor:"pointer",
            width:18, height:18, borderRadius:3, 
            fontSize:10, display:"flex",
            alignItems:"center", justifyContent:"center", flexShrink:0,
            transition:"all .2s ease"
          }}>✎</button>

        {/* DELETE BUTTON (Updated for Visibility) */}
        <button
          onClick={(e)=>{ e.stopPropagation(); onDelete(); }}
          title="Delete"
          style={{ 
            background:"rgba(239, 68, 68, 0.08)", 
            border:"1px solid rgba(239, 68, 68, 0.3)", 
            color:"#ef4444", 
            cursor:"pointer",
            width:18, height:18, borderRadius:3, 
            fontSize:10, display:"flex",
            alignItems:"center", justifyContent:"center", flexShrink:0,
            transition:"all .2s ease"
          }}>✕</button>
      </div>
      <span style={{
        fontSize:10, color:"#c8d4ec", lineHeight:1.45,
        wordBreak:"break-word", whiteSpace:"normal",
        display:"block", width:"100%",
      }}>
        {entry.text}
      </span>
    </div>
  );
}

/* ─── SECTION CARD ──────────────────────────────────────── */
function SectionCard({ sid, entries, onAdd, onEdit, onDelete, onSegClick, wide }) {
  const s = SECTIONS[sid];
  return (
    <div style={{
      background:"rgba(12,18,32,0.72)",
      backdropFilter:"blur(16px) saturate(1.3)",
      WebkitBackdropFilter:"blur(16px) saturate(1.3)",
      border:`1px solid ${sid==="vp"?"rgba(255,209,0,.22)":"rgba(40,65,110,0.55)"}`,
      borderRadius:13,
      display:"flex", flexDirection:"column",
      position:"relative", overflow:"hidden",
      boxShadow: sid==="vp" ? "0 0 36px rgba(255,209,0,.07)" : "none",
      height:"100%",
    }}>
      {/* accent stripe */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:s.accent, opacity:.85, zIndex:2 }}/>
      {/* dot grid */}
      <div style={{
        position:"absolute", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:"radial-gradient(circle,rgba(255,255,255,.03) 1px,transparent 1px)",
        backgroundSize:"18px 18px",
      }}/>
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", height:"100%", padding:13, gap:9 }}>
        {/* header */}
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{
            fontFamily:"monospace", fontSize:9, fontWeight:600, color:s.accent,
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
            padding:"1px 5px", borderRadius:3, flexShrink:0,
          }}>{s.num}</span>
          <span style={{ fontSize:10, fontWeight:700, color:"#dde4f0", textTransform:"uppercase", letterSpacing:.9, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {s.name}
          </span>
          <span style={{
            fontFamily:"monospace", fontSize:9, color:"#5a6e92",
            background:"rgba(255,255,255,0.04)", border:"1px solid rgba(40,65,110,0.55)",
            padding:"1px 6px", borderRadius:20, flexShrink:0,
          }}>{entries.length}</span>
          <button onClick={onAdd}
            title="Add entry"
            style={{
              background:"rgba(255,209,0,0.12)", border:"1px solid rgba(255,209,0,.22)",
              color:Y, width:24, height:24, borderRadius:5, cursor:"pointer",
              fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, transition:"all .15s", lineHeight:1,
            }}>+</button>
        </div>
        <div style={{ height:1, background:"rgba(40,65,110,0.55)", margin:"0 -13px", flexShrink:0 }}/>
        {/* entries */}
        <div style={{
          flex:1, overflowY:"auto", display:"flex",
          flexDirection: wide ? "row" : "column",
          flexWrap: wide ? "wrap" : "nowrap",
          gap:3, paddingRight:2, alignContent:"flex-start",
        }}>
          {entries.length === 0 ? (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              gap:5, padding:"18px 8px", opacity:.35, flex:1, width:"100%" }}>
              <span style={{ fontSize:20 }}>{s.icon}</span>
              <span style={{ fontSize:9, color:"#5a6e92", textAlign:"center", lineHeight:1.5 }}>{s.hint}</span>
            </div>
          ) : entries.map(e => (
            <Chip key={e.id} entry={e}
              onEdit={() => onEdit(sid, e.id)}
              onDelete={() => onDelete(sid, e.id)}
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

/* ─── MODAL ─────────────────────────────────────────────── */
function Modal({ open, onClose, onSave, sid, editEntry, allSegs }) {
  const [text, setText] = useState("");
  const [cat, setCat] = useState("medium");
  const [segs, setSegs] = useState(new Set());

  useEffect(() => {
    if (open) {
      setText(editEntry?.text ?? "");
      setCat(editEntry?.cat ?? "medium");
      setSegs(new Set(editEntry?.segs ?? []));
    }
  }, [open, editEntry]);

  if (!open) return null;
  const s = SECTIONS[sid] ?? {};
  const isEdit = !!editEntry;
  const showLink = LINKABLE.includes(sid) && allSegs.length > 0;

  const toggleSeg = (id) => setSegs(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({ text:text.trim(), cat, segs:[...segs] });
  };

  return (
    <div onClick={(e)=>{ if(e.target===e.currentTarget) onClose(); }}
      style={{
        position:"fixed", inset:0, background:"rgba(2,5,12,.83)",
        backdropFilter:"blur(8px)", WebkitBackdropFilter:"blur(8px)",
        zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:20,
      }}>
      <div style={{
        background:"rgba(10,15,26,0.97)", border:"1px solid rgba(60,100,170,0.8)",
        borderRadius:13, width:"100%", maxWidth:500,
        boxShadow:"0 40px 100px rgba(0,0,0,.7)",
        overflow:"hidden",
      }}>
        {/* top */}
        <div style={{ background:"rgba(255,255,255,.03)", borderBottom:"1px solid rgba(40,65,110,0.55)", padding:"18px 22px 14px", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:Y }}/>
          <div style={{ fontSize:8, fontFamily:"monospace", color:Y, textTransform:"uppercase", letterSpacing:1.5, marginBottom:3 }}>{isEdit?"EDIT ENTRY":"ADD ENTRY"}</div>
          <div style={{ fontSize:16, fontWeight:700, color:"#fff", letterSpacing:"-.2px" }}>{isEdit?"Edit Entry":"New Entry"}</div>
          <div style={{ fontSize:10, color:"#5a6e92", marginTop:2 }}>→ {s.name}</div>
          <button onClick={onClose} style={{ position:"absolute", top:16, right:18, background:"rgba(255,255,255,.04)", border:"1px solid rgba(40,65,110,0.55)", color:"#5a6e92", width:26, height:26, borderRadius:5, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>

        <div style={{ padding:"18px 22px 20px", display:"flex", flexDirection:"column", gap:16, maxHeight:"60vh", overflowY:"auto" }}>
          {/* text */}
          <div>
            <label style={{ display:"block", fontSize:9, fontWeight:700, color:"#5a6e92", textTransform:"uppercase", letterSpacing:.8, marginBottom:7, fontFamily:"monospace" }}>Description</label>
            <textarea value={text} onChange={e=>setText(e.target.value)}
              placeholder="Describe this element clearly…"
              autoFocus
              style={{ width:"100%", background:"rgba(255,255,255,.04)", border:`1px solid ${text?"rgba(255,209,0,.5)":"rgba(40,65,110,0.55)"}`, color:"#cdd8f0", padding:"9px 11px", borderRadius:8, fontSize:12, fontFamily:"'Inter',sans-serif", outline:"none", resize:"vertical", minHeight:70, lineHeight:1.5 }}/>
          </div>

          {/* category */}
          <div>
            <label style={{ display:"block", fontSize:9, fontWeight:700, color:"#5a6e92", textTransform:"uppercase", letterSpacing:.8, marginBottom:7, fontFamily:"monospace" }}>Category / Priority</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
              {CATS.map(c => (
                <div key={c.key} onClick={()=>setCat(c.key)}
                  style={{
                    display:"flex", alignItems:"center", gap:8,
                    background: cat===c.key ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.02)",
                    border: cat===c.key ? `1px solid ${c.color}` : "1px solid rgba(40,65,110,0.55)",
                    borderRadius:8, padding:"7px 10px", cursor:"pointer",
                    boxShadow: cat===c.key ? `inset 0 0 0 1px ${c.color}` : "none",
                  }}>
                  <div style={{ width:9, height:9, borderRadius:"50%", background:c.color, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:"#dde4f0" }}>{c.label}</div>
                    <div style={{ fontSize:8, color:"#5a6e92" }}>{c.desc}</div>
                  </div>
                  {cat===c.key && <span style={{ fontSize:11, color:c.color }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* segment linking */}
          {showLink && (
            <div>
              <label style={{ display:"block", fontSize:9, fontWeight:700, color:"#5a6e92", textTransform:"uppercase", letterSpacing:.8, marginBottom:7, fontFamily:"monospace" }}>Link to Customer Segment(s)</label>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {allSegs.map(seg => (
                  <div key={seg.id} onClick={()=>toggleSeg(seg.id)}
                    style={{
                      display:"flex", alignItems:"center", gap:7,
                      background: segs.has(seg.id) ? "rgba(34,197,94,.06)" : "rgba(255,255,255,.02)",
                      border: segs.has(seg.id) ? "1px solid #22c55e" : "1px solid rgba(40,65,110,0.55)",
                      borderRadius:5, padding:"6px 9px", cursor:"pointer",
                    }}>
                    <div style={{ width:13, height:13, border: segs.has(seg.id) ? "none" : "1px solid rgba(40,65,110,0.55)", borderRadius:3, background: segs.has(seg.id)?"#22c55e":"transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#000", flexShrink:0 }}>
                      {segs.has(seg.id)?"✓":""}
                    </div>
                    <span style={{ fontSize:11, color:"#cdd8f0" }}>{seg.text.slice(0,50)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div style={{ display:"flex", gap:7, borderTop:"1px solid rgba(40,65,110,0.55)", padding:"12px 22px", background:"rgba(255,255,255,.02)" }}>
          <button onClick={onClose} style={{ flex:1, background:"transparent", border:"1px solid rgba(40,65,110,0.55)", color:"#5a6e92", padding:9, borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>Cancel</button>
          <button onClick={handleSave} style={{ flex:2, background:Y, border:"none", color:"#090909", padding:9, borderRadius:8, fontSize:12, fontWeight:800, cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>
            {isEdit?"Update Entry":"Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── STORY DRAWER ──────────────────────────────────────── */
const FLOW_ORDER = [
  {sid:"kp",  color:"#3b82f6", label:"Key Partners"},
  {sid:"ka",  color:"#a855f7", label:"Key Activities"},
  {sid:"kr",  color:"#6366f1", label:"Key Resources"},
  {sid:"vp",  color:Y,         label:"Value Propositions"},
  {sid:"cr",  color:"#19b8c2", label:"Customer Relationships"},
  {sid:"ch",  color:"#0ea5e9", label:"Channels"},
  {sid:"rev", color:"#22c55e", label:"Revenue Streams"},
];

function StoryDrawer({ state, activeSegId, onSelectSeg, onClose }) {
  const segs = state.cs ?? [];
  const seg = segs.find(s=>s.id===activeSegId);

  const countLinked = (segId) =>
    LINKABLE.reduce((n,sid)=>n+(state[sid]||[]).filter(e=>(e.segs||[]).includes(segId)).length, 0);

  return (
    <div style={{
      background:"rgba(6,9,18,0.94)", backdropFilter:"blur(22px)",
      WebkitBackdropFilter:"blur(22px)",
      borderLeft:"1px solid rgba(40,65,110,0.55)",
      display:"flex", flexDirection:"column", height:"100%", overflow:"hidden",
    }}>
      {/* head */}
      <div style={{ padding:"16px 18px 12px", borderBottom:"1px solid rgba(40,65,110,0.55)", flexShrink:0, position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${Y},#22c55e)` }}/>
        <div style={{ fontSize:13, fontWeight:700, color:"#fff", letterSpacing:"-.2px" }}>🗺 Success Story Tracer</div>
        <div style={{ fontSize:9, color:"#5a6e92", fontFamily:"monospace", marginTop:3 }}>
          {seg ? `→ ${seg.text.slice(0,34)}` : "Select a customer segment"}
        </div>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,.04)", border:"1px solid rgba(40,65,110,0.55)", color:"#5a6e92", width:26, height:26, borderRadius:5, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
        {/* segment picker */}
        {!activeSegId ? (
          <>
            <div style={{ fontSize:9, color:"#5a6e92", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:.8, marginBottom:2 }}>Customer Segments</div>
            {segs.length === 0 ? (
              <div style={{ textAlign:"center", opacity:.45, padding:"28px 0", fontSize:11, color:"#5a6e92" }}>Add Customer Segment entries first</div>
            ) : segs.map(s => (
              <button key={s.id} onClick={()=>onSelectSeg(s.id)}
                style={{
                  background:"rgba(255,255,255,.03)", border:"1px solid rgba(40,65,110,0.55)",
                  borderRadius:8, padding:"9px 12px", cursor:"pointer", textAlign:"left",
                  display:"flex", alignItems:"center", gap:8, width:"100%",
                }}>
                <span style={{ fontSize:14 }}>👤</span>
                <span style={{ fontSize:12, fontWeight:600, color:"#cdd8f0", flex:1 }}>{s.text.slice(0,42)}</span>
                <span style={{ fontSize:9, color:"#5a6e92", fontFamily:"monospace" }}>{countLinked(s.id)} linked</span>
              </button>
            ))}
          </>
        ) : (
          <>
            <button onClick={()=>onSelectSeg(null)}
              style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(40,65,110,0.55)", borderRadius:6, padding:"5px 10px", cursor:"pointer", fontSize:10, color:"#5a6e92", textAlign:"left" }}>
              ← All Segments
            </button>
            {/* story card */}
            <div style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(40,65,110,0.55)", borderRadius:13, overflow:"hidden" }}>
              <div style={{ padding:"11px 13px", background:"linear-gradient(135deg,rgba(34,197,94,.12),rgba(34,197,94,.04))", borderBottom:"1px solid rgba(34,197,94,.2)" }}>
                <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{seg.text}</div>
                <span style={{ fontSize:8, color:"#22c55e", fontFamily:"monospace", background:"rgba(34,197,94,.12)", border:"1px solid rgba(34,197,94,.3)", padding:"1px 5px", borderRadius:2, textTransform:"uppercase", letterSpacing:.5 }}>{catLabel(seg.cat)}</span>
              </div>
              {FLOW_ORDER.map(({sid,color,label}) => {
                const items=(state[sid]||[]).filter(e=>(e.segs||[]).includes(activeSegId));
                if(!items.length) return null;
                return (
                  <div key={sid} style={{ borderBottom:"1px solid rgba(40,65,110,0.55)" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 12px", background:"rgba(255,255,255,.02)" }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0 }}/>
                      <div style={{ fontSize:9, fontWeight:700, color:"#5a6e92", textTransform:"uppercase", letterSpacing:.8, flex:1, fontFamily:"monospace" }}>{label}</div>
                      <div style={{ fontSize:8, color:"#2d3d5a", fontFamily:"monospace" }}>{items.length}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:3, padding:"5px 12px 9px" }}>
                      {items.map(e => {
                        const cc=catColor(e.cat);
                        return (
                          <div key={e.id} style={{ fontSize:11, color:"#cdd8f0", lineHeight:1.4, padding:"5px 8px", background:"rgba(255,255,255,.03)", borderRadius:4, borderLeft:`2px solid ${color}` }}>
                            <span style={{ fontSize:8, color:cc, fontFamily:"monospace", background:"rgba(255,255,255,.04)", border:`1px solid ${cc}40`, padding:"1px 4px", borderRadius:2, marginRight:5, textTransform:"uppercase" }}>{catLabel(e.cat)}</span>
                            {e.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {countLinked(activeSegId)===0 && (
                <div style={{ padding:"20px 16px", textAlign:"center", opacity:.45 }}>
                  <div style={{ fontSize:22 }}>🔗</div>
                  <div style={{ fontSize:11, color:"#5a6e92", marginTop:6, lineHeight:1.6 }}>No entries linked yet.<br/>Link entries to this segment when adding them.</div>
                </div>
              )}
            </div>
            <div style={{ fontSize:9, color:"#2d3d5a", fontFamily:"monospace", textAlign:"center", paddingTop:4 }}>
              {countLinked(activeSegId)} entries linked across the canvas
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── TOAST ─────────────────────────────────────────────── */
function Toast({ msg, show }) {
  return (
    <div style={{
      position:"fixed", bottom:24, right:24, zIndex:600,
      background:"rgba(10,15,26,0.96)", border:"1px solid rgba(60,100,170,0.8)",
      color:"#cdd8f0", padding:"10px 14px 10px 11px", borderRadius:8,
      fontSize:11, fontWeight:500,
      display:"flex", alignItems:"center", gap:8,
      boxShadow:"0 8px 32px rgba(0,0,0,.5)",
      transform: show?"translateY(0)":"translateY(10px)",
      opacity: show?1:0,
      transition:"opacity .2s,transform .2s",
      pointerEvents:"none",
    }}>
      <div style={{ width:3, height:26, background:Y, borderRadius:99, flexShrink:0 }}/>
      {msg}
    </div>
  );
}

/* ─── ROOT APP ──────────────────────────────────────────── */
export default function App() {
  const [state, setState] = useState(DEMO);
  const [modal, setModal] = useState({ open:false, sid:"vp", editEntry:null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSegId, setActiveSegId] = useState(null);
  const [toast, setToast] = useState({ msg:"", show:false });
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast({ msg, show:true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t=>({...t,show:false})), 2200);
  };

  const openAdd = (sid) => setModal({ open:true, sid, editEntry:null });
  const openEdit = (sid, id) => {
    const e = state[sid]?.find(x=>x.id===id);
    setModal({ open:true, sid, editEntry:e??null });
  };
  const closeModal = () => setModal(m=>({...m,open:false}));

  const handleSave = ({ text, cat, segs }) => {
    const { sid, editEntry } = modal;
    setState(prev => {
      const arr = [...(prev[sid]??[])];
      if (editEntry) {
        const i = arr.findIndex(e=>e.id===editEntry.id);
        if(i>-1) arr[i] = {...arr[i], text, cat, segs};
        showToast("Entry updated");
      } else {
        arr.push({ id:mkId(), text, cat, segs, ts:Date.now() });
        showToast("Added to "+SECTIONS[sid].name);
      }
      return {...prev,[sid]:arr};
    });
    closeModal();
  };

  const handleDelete = (sid, id) => {
    setState(prev=>({...prev,[sid]:(prev[sid]??[]).filter(e=>e.id!==id)}));
    showToast("Entry removed");
  };

  const openStory = (segId) => {
    setDrawerOpen(true);
    setActiveSegId(segId);
  };

  // KPI computations
  const all = Object.values(state).flat();
  const filled = Object.values(state).filter(a=>a.length>0).length;
  const pct = Math.round((filled/9)*100);

  const kpis = [
    { v: all.length,                                        l:"Entries",      c:"#3b82f6" },
    { v: `${filled}/9`,                                     l:"Sections",     c:"#22c55e" },
    { v: all.filter(e=>e.cat==="critical").length,          l:"Critical",     c:"#ef4444" },
    { v: all.filter(e=>e.cat==="opportunity").length,       l:"Opps",         c:"#3b82f6" },
    { v: (state.cs??[]).length,                             l:"Segments",     c:Y         },
  ];

  return (
    <div style={{ fontFamily:"'Inter',sans-serif", background:"#06090f", color:"#cdd8f0", minHeight:"100vh", position:"relative" }}>
      <BimBackground/>

      {/* HEADER */}
      <header style={{ position:"sticky", top:0, zIndex:100, background:"rgba(6,9,15,0.84)", backdropFilter:"blur(18px) saturate(1.4)", WebkitBackdropFilter:"blur(18px) saturate(1.4)", borderBottom:"1px solid rgba(40,65,110,0.55)", overflow:"hidden" }}>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${Y} 25%,${Y} 75%,transparent)`, opacity:.9 }}/>
        <div style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"auto 1fr auto", alignItems:"center", gap:20, padding:"13px 22px" }}>
          {/* brand */}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:42, height:42, background:Y, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg viewBox="0 0 26 26" fill="none" width="26" height="26">
                <path d="M3 22L9.5 4h3L19 22h-3.5l-1.5-4H8L6.5 22H3zm6-7h5.5L11 8 9 15z" fill="#090909"/>
                <rect x="20" y="4" width="2.5" height="18" rx="1.25" fill="#090909" opacity=".4"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:"#fff", letterSpacing:"-.3px" }}>ACCA <span style={{color:Y}}>Strategy</span></div>
              <div style={{ fontSize:9, color:"#5a6e92", fontFamily:"monospace", letterSpacing:"1.5px", textTransform:"uppercase", marginTop:2 }}>Business Model Canvas · AECO/BIM</div>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display:"flex", gap:5, justifyContent:"center", flexWrap:"wrap" }}>
            {kpis.map((k,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,.04)", border:"1px solid rgba(40,65,110,0.55)", borderRadius:8, padding:"7px 14px", textAlign:"center", minWidth:75, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:k.c }}/>
                <div style={{ fontSize:20, fontWeight:800, color:"#fff", fontFamily:"monospace", letterSpacing:-1, lineHeight:1 }}>{k.v}</div>
                <div style={{ fontSize:8, color:"#5a6e92", textTransform:"uppercase", letterSpacing:.8, marginTop:3 }}>{k.l}</div>
              </div>
            ))}
          </div>

          {/* actions */}
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <button onClick={()=>{ setDrawerOpen(v=>!v); if(!drawerOpen) setActiveSegId(null); }}
              style={{ background:"rgba(255,255,255,.04)", border:`1px solid ${drawerOpen?"rgba(34,197,94,.5)":"rgba(40,65,110,0.55)"}`, color: drawerOpen?"#22c55e":"#5a6e92", padding:"7px 13px", borderRadius:8, fontSize:11, fontWeight:500, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
              🗺 Story View
            </button>
            <button onClick={()=>openAdd("vp")}
              style={{ background:Y, border:"none", color:"#090909", padding:"7px 16px", borderRadius:8, fontSize:11, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
              + Add Entry
            </button>
          </div>
        </div>
        {/* progress */}
        <div style={{ height:3, background:"rgba(40,65,110,0.55)", overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${Y},#ffe566)`, transition:"width .5s ease" }}/>
        </div>
      </header>

      {/* LEGEND */}
      <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", padding:"7px 22px", background:"rgba(6,9,15,0.72)", backdropFilter:"blur(10px)", borderBottom:"1px solid rgba(40,65,110,0.55)", position:"relative", zIndex:99 }}>
        <span style={{ fontSize:8, color:"#2d3d5a", fontFamily:"monospace", textTransform:"uppercase", letterSpacing:1, flexShrink:0 }}>Categories:</span>
        {CATS.map(c=>(
          <div key={c.key} style={{ display:"flex", alignItems:"center", gap:4, fontSize:9, color:"#5a6e92" }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:c.color, flexShrink:0 }}/>
            {c.label}
          </div>
        ))}
        <span style={{ marginLeft:"auto", fontSize:9, color:"#2d3d5a", fontFamily:"monospace" }}>Click a Customer Segment entry → Story View</span>
      </div>

      {/* APP BODY */}
      <div style={{ display:"grid", gridTemplateColumns: drawerOpen ? "1fr 360px" : "1fr", transition:"grid-template-columns .3s ease", position:"relative", zIndex:1 }}>
        <main style={{ padding:"16px 16px 48px", overflow:"hidden" }}>
          {/* flow labels */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:8, marginBottom:6 }}>
            {[["① Infrastructure",""], ["② Operations",""], ["③ Value","active"], ["④ Customer Facing",""], ["⑤ Market",""]].map(([lbl,active],i)=>(
              <div key={i} style={{ textAlign:"center", fontSize:8, fontFamily:"monospace", color: active?"#ffd100":"#5a6e92", textTransform:"uppercase", letterSpacing:1, padding:"4px 6px", background:"rgba(255,255,255,.02)", border:`1px solid ${active?"rgba(255,209,0,.28)":"rgba(40,65,110,0.35)"}`, borderRadius:4 }}>{lbl}</div>
            ))}
          </div>

          {/* BMC GRID */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1.1fr 1fr 1fr", gridTemplateRows:"minmax(220px,1fr) minmax(220px,1fr) minmax(150px,auto)", gap:8 }}>
            {/* KP */}
            <div style={{ gridColumn:"1/2", gridRow:"1/3" }}>
              <SectionCard sid="kp" entries={state.kp??[]} onAdd={()=>openAdd("kp")} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            {/* KA */}
            <div style={{ gridColumn:"2/3", gridRow:"1/2" }}>
              <SectionCard sid="ka" entries={state.ka??[]} onAdd={()=>openAdd("ka")} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            {/* VP */}
            <div style={{ gridColumn:"3/4", gridRow:"1/3" }}>
              <SectionCard sid="vp" entries={state.vp??[]} onAdd={()=>openAdd("vp")} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            {/* CR */}
            <div style={{ gridColumn:"4/5", gridRow:"1/2" }}>
              <SectionCard sid="cr" entries={state.cr??[]} onAdd={()=>openAdd("cr")} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            {/* CS */}
            <div style={{ gridColumn:"5/6", gridRow:"1/3" }}>
              <SectionCard sid="cs" entries={state.cs??[]} onAdd={()=>openAdd("cs")} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            {/* KR */}
            <div style={{ gridColumn:"2/3", gridRow:"2/3" }}>
              <SectionCard sid="kr" entries={state.kr??[]} onAdd={()=>openAdd("kr")} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            {/* CH */}
            <div style={{ gridColumn:"4/5", gridRow:"2/3" }}>
              <SectionCard sid="ch" entries={state.ch??[]} onAdd={()=>openAdd("ch")} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>
            </div>
            {/* COST */}
            <div style={{ gridColumn:"1/3", gridRow:"3/4" }}>
              <SectionCard sid="cost" entries={state.cost??[]} onAdd={()=>openAdd("cost")} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory} wide/>
            </div>
            {/* REV */}
            <div style={{ gridColumn:"3/6", gridRow:"3/4" }}>
              <SectionCard sid="rev" entries={state.rev??[]} onAdd={()=>openAdd("rev")} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory} wide/>
            </div>
          </div>
        </main>

        {/* STORY DRAWER */}
        {drawerOpen && (
          <StoryDrawer
            state={state}
            activeSegId={activeSegId}
            onSelectSeg={setActiveSegId}
            onClose={()=>setDrawerOpen(false)}
          />
        )}
      </div>

      {/* MODAL */}
      <Modal
        open={modal.open}
        onClose={closeModal}
        onSave={handleSave}
        sid={modal.sid}
        editEntry={modal.editEntry}
        allSegs={state.cs??[]}
      />

      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  );
}
