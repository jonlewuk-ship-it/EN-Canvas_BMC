import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/* ─────────────────────────────────────────────────────────
   LOCALISATION CONFIG — edit these blocks per deployment
   Languages: en | it | es | de | fr | pt
───────────────────────────────────────────────────────── */
const LOCALE = {
  lang: "en",          // "en"|"it"|"es"|"de"|"fr"|"pt"
  canvasTitle: "",     // pre-fill e.g. "ES - Spain"
  teamLabel: "",       // e.g. "Spanish/LATAM Team"
};
const TEAM_CONFIG = {
  langTeam: "English/International",
  // Options: "Italian (HQ)" | "Spanish/LATAM" | "English/International"
  //          "German/DACH"  | "French"        | "Portuguese/Brazil"
  focusMarkets: [],    // e.g. ["Spain","Mexico","Colombia"]
};
const UI_STRINGS = {
  en:{addEntry:"Add Entry",import:"Import",export:"Export",storyView:"Story View",generateInsights:"Generate Insights",regenerate:"Regenerate",analysing:"Analysing…",saveTo:"+ Save to Notes",completion:"Completion",execSummary:"Executive Summary",canvasHealth:"Canvas Health Score",strengths:"Strengths",gaps:"Gaps",quickWin:"30-Day Quick Win",approach:"Go-to-Market Approach",risks:"Risks",tools:"Recommended usBIM Tools",perSection:"Entries per Section",catBreakdown:"Category Breakdown",fillFirst:"Fill the 9 BMC cards first, then click Generate Insights.",clickGenerate:"Click Generate Insights to analyse your canvas.",noLinked:"No entries linked yet. Link entries to this segment when adding them.",allSegments:"← All Segments",linkedEntries:"Linked Entries",bmcSections:"BMC Sections",flowMap:"Visual Flow Map · Partners → Value → Revenue",canvasFlow:"Canvas Flow · Partners → Revenue",replace:"Replace Canvas",merge:"Merge into Canvas",importTitle:"Import from JSON",importReady:"Ready to import"},
  it:{addEntry:"Aggiungi",import:"Importa",export:"Esporta",storyView:"Story View",generateInsights:"Genera Insights",regenerate:"Rigenera",analysing:"Analisi in corso…",saveTo:"+ Salva nelle Note",completion:"Completamento",execSummary:"Sintesi Esecutiva",canvasHealth:"Salute del Canvas",strengths:"Punti di forza",gaps:"Lacune",quickWin:"Azione rapida (30 giorni)",approach:"Approccio Go-to-Market",risks:"Rischi",tools:"Strumenti usBIM consigliati",perSection:"Voci per Sezione",catBreakdown:"Distribuzione Categorie",fillFirst:"Compila le 9 schede BMC, poi clicca Genera Insights.",clickGenerate:"Clicca Genera Insights per analizzare il canvas.",noLinked:"Nessuna voce collegata.",allSegments:"← Tutti i Segmenti",linkedEntries:"Voci Collegate",bmcSections:"Sezioni BMC",flowMap:"Mappa Flusso · Partner → Valore → Ricavi",canvasFlow:"Flusso Canvas · Partner → Ricavi",replace:"Sostituisci Canvas",merge:"Unisci al Canvas",importTitle:"Importa da JSON",importReady:"Pronto per l'importazione"},
  es:{addEntry:"Agregar",import:"Importar",export:"Exportar",storyView:"Vista Historia",generateInsights:"Generar Insights",regenerate:"Regenerar",analysing:"Analizando…",saveTo:"+ Guardar en Notas",completion:"Completitud",execSummary:"Resumen Ejecutivo",canvasHealth:"Salud del Canvas",strengths:"Fortalezas",gaps:"Brechas",quickWin:"Acción rápida (30 días)",approach:"Enfoque Go-to-Market",risks:"Riesgos",tools:"Herramientas usBIM recomendadas",perSection:"Entradas por Sección",catBreakdown:"Desglose por Categoría",fillFirst:"Rellena las 9 tarjetas del BMC, luego genera Insights.",clickGenerate:"Haz clic en Generar Insights para analizar tu canvas.",noLinked:"Sin entradas vinculadas.",allSegments:"← Todos los Segmentos",linkedEntries:"Entradas Vinculadas",bmcSections:"Secciones BMC",flowMap:"Mapa de Flujo · Socios → Valor → Ingresos",canvasFlow:"Flujo Canvas · Socios → Ingresos",replace:"Reemplazar Canvas",merge:"Fusionar en Canvas",importTitle:"Importar desde JSON",importReady:"Listo para importar"},
  de:{addEntry:"Hinzufügen",import:"Importieren",export:"Exportieren",storyView:"Story Ansicht",generateInsights:"Insights generieren",regenerate:"Regenerieren",analysing:"Analysiere…",saveTo:"+ In Notizen speichern",completion:"Vollständigkeit",execSummary:"Zusammenfassung",canvasHealth:"Canvas Gesundheit",strengths:"Stärken",gaps:"Lücken",quickWin:"30-Tage-Sofortmaßnahme",approach:"Go-to-Market Ansatz",risks:"Risiken",tools:"Empfohlene usBIM-Tools",perSection:"Einträge pro Abschnitt",catBreakdown:"Kategorieübersicht",fillFirst:"Füllen Sie die 9 BMC-Karten aus.",clickGenerate:"Klicken Sie auf Insights generieren.",noLinked:"Noch keine verlinkten Einträge.",allSegments:"← Alle Segmente",linkedEntries:"Verlinkte Einträge",bmcSections:"BMC Abschnitte",flowMap:"Flussdiagramm · Partner → Wert → Umsatz",canvasFlow:"Canvas-Fluss · Partner → Umsatz",replace:"Canvas ersetzen",merge:"In Canvas zusammenführen",importTitle:"Aus JSON importieren",importReady:"Bereit zum Importieren"},
  fr:{addEntry:"Ajouter",import:"Importer",export:"Exporter",storyView:"Vue Histoire",generateInsights:"Générer des Insights",regenerate:"Régénérer",analysing:"Analyse en cours…",saveTo:"+ Enregistrer dans Notes",completion:"Complétion",execSummary:"Résumé Exécutif",canvasHealth:"Santé du Canvas",strengths:"Points forts",gaps:"Lacunes",quickWin:"Action rapide (30 jours)",approach:"Approche Go-to-Market",risks:"Risques",tools:"Outils usBIM recommandés",perSection:"Entrées par Section",catBreakdown:"Répartition par Catégorie",fillFirst:"Remplissez les 9 cartes BMC.",clickGenerate:"Cliquez sur Générer des Insights.",noLinked:"Aucune entrée liée.",allSegments:"← Tous les Segments",linkedEntries:"Entrées Liées",bmcSections:"Sections BMC",flowMap:"Carte de Flux · Partenaires → Valeur → Revenus",canvasFlow:"Flux Canvas · Partenaires → Revenus",replace:"Remplacer le Canvas",merge:"Fusionner dans le Canvas",importTitle:"Importer depuis JSON",importReady:"Prêt à importer"},
  pt:{addEntry:"Adicionar",import:"Importar",export:"Exportar",storyView:"Vista da História",generateInsights:"Gerar Insights",regenerate:"Regenerar",analysing:"Analisando…",saveTo:"+ Salvar em Notas",completion:"Conclusão",execSummary:"Resumo Executivo",canvasHealth:"Saúde do Canvas",strengths:"Pontos fortes",gaps:"Lacunas",quickWin:"Ação rápida (30 dias)",approach:"Abordagem Go-to-Market",risks:"Riscos",tools:"Ferramentas usBIM recomendadas",perSection:"Entradas por Seção",catBreakdown:"Distribuição por Categoria",fillFirst:"Preencha os 9 cartões do BMC.",clickGenerate:"Clique em Gerar Insights.",noLinked:"Nenhuma entrada vinculada.",allSegments:"← Todos os Segmentos",linkedEntries:"Entradas Vinculadas",bmcSections:"Seções BMC",flowMap:"Mapa de Fluxo · Parceiros → Valor → Receitas",canvasFlow:"Fluxo Canvas · Parceiros → Receitas",replace:"Substituir Canvas",merge:"Mesclar no Canvas",importTitle:"Importar de JSON",importReady:"Pronto para importar"},
};
const T = UI_STRINGS[LOCALE.lang] || UI_STRINGS.en;


/* ─────────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────────── */
const GCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Inter',sans-serif;background:#06090f;color:#e8eef8;overflow-x:hidden}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:#1e3050;border-radius:99px}
  ::-webkit-scrollbar-thumb:hover{background:#2d4a78}
  @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
  @keyframes drawLine{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}
  .chip-enter{animation:fadeUp 0.22s ease forwards}
  .card-hover{transition:border-color .2s,box-shadow .2s,transform .15s}
  .card-hover:hover{transform:translateY(-1px)}
  .btn-icon{transition:background .15s,border-color .15s,color .15s,transform .12s}
  .btn-icon:hover{transform:scale(1.08)}
  .seg-btn-anim{transition:background .15s,border-color .15s,transform .12s}
  .seg-btn-anim:hover{transform:translateX(3px)}
  .flow-line{stroke-dasharray:300;animation:drawLine .6s ease forwards}
`;

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const Y    = "#ffd100";
const MONO = "'JetBrains Mono',monospace";

const CATS = [
  {key:"critical",    color:"#ef4444", label:"Critical",      desc:"Blocker / must-have"   },
  {key:"high",        color:"#f97316", label:"High",          desc:"Significant importance" },
  {key:"medium",      color:Y,         label:"Medium",        desc:"Moderate priority"      },
  {key:"low",         color:"#4ade80", label:"Low / Done",    desc:"Minor or resolved"      },
  {key:"opportunity", color:"#60a5fa", label:"Opportunity",   desc:"Growth potential"       },
  {key:"risk",        color:"#c084fc", label:"Risk",          desc:"Threat to address"      },
  {key:"strength",    color:"#22d3ee", label:"Strength",      desc:"Core advantage"         },
  {key:"info",        color:"#94a3b8", label:"Info",          desc:"General reference"      },
];
const cc  = k => CATS.find(c=>c.key===k)?.color ?? Y;
const cl  = k => CATS.find(c=>c.key===k)?.label ?? k;
const mkId= () => "e"+Date.now().toString(36)+Math.random().toString(36).slice(2,5);

/* Map imported nc-colour strings → our cat keys */
const NC_TO_CAT = {
  "nc-green":"strength", "nc-yellow":"medium", "nc-blue":"opportunity",
  "nc-pink":"risk",      "nc-white":"info",    "nc-red":"critical",
  "nc-orange":"high",    "nc-purple":"risk",
};

const SECTIONS = {
  kp:   {name:"Key Partners",           num:"01",accent:"#60a5fa",icon:"🤝",hint:"Key suppliers, alliances & partners"},
  ka:   {name:"Key Activities",         num:"02",accent:"#c084fc",icon:"⚙️",hint:"Core processes to deliver value"},
  vp:   {name:"Value Propositions",     num:"03",accent:Y,        icon:"💎",hint:"What unique value do we deliver?"},
  cr:   {name:"Customer Relationships", num:"04",accent:"#22d3ee",icon:"💬",hint:"How we engage each segment"},
  cs:   {name:"Customer Segments",      num:"05",accent:"#4ade80",icon:"👥",hint:"Click a segment to trace its story →"},
  kr:   {name:"Key Resources",          num:"06",accent:"#818cf8",icon:"🏗️",hint:"Physical, IP, human & financial assets"},
  ch:   {name:"Channels",               num:"07",accent:"#38bdf8",icon:"📡",hint:"How we reach our customers"},
  cost: {name:"Cost Structure",         num:"08",accent:"#ef4444",icon:"📉",hint:"Most significant costs in the model"},
  rev:  {name:"Revenue Streams",        num:"09",accent:"#4ade80",icon:"📈",hint:"Revenue generated per segment"},
  notes:{name:"Brainstorm & Notes",     num:"💡",accent:"#fb923c",icon:"🧠",hint:"Free-form ideas, hypotheses & open questions"},
};
const LINKABLE = ["vp","cr","ch","kp","ka","kr","rev"];

/* ─────────────────────────────────────────────────────────
   DEMO DATA
───────────────────────────────────────────────────────── */
const SA=mkId(),SC=mkId(),SO=mkId(),SB=mkId(),SI=mkId(),SP=mkId();
const DEMO={
  cs:[
    {id:SA,text:"Architecture & AEC Design Firms",         cat:"strength",   segs:[]},
    {id:SC,text:"General Contractors & BIM Managers",      cat:"high",       segs:[]},
    {id:SO,text:"Building Owners & Facility Managers",     cat:"opportunity",segs:[]},
    {id:SB,text:"BIM Consultants & Digital Delivery Firms",cat:"strength",   segs:[]},
    {id:SI,text:"Infrastructure & Asset Management Cos.",  cat:"opportunity",segs:[]},
    {id:SP,text:"Public Authorities, Municipalities & Ministries",cat:"high",segs:[]},
  ],
  kp:[
    {id:mkId(),text:"Autodesk & Graphisoft reseller network",       cat:"strength",   segs:[SA,SC,SB]},
    {id:mkId(),text:"IFC / buildingSMART international standards",  cat:"info",       segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"Cloud infrastructure providers (AWS / Azure)", cat:"high",       segs:[SA,SC,SB]},
    {id:mkId(),text:"National BIM mandating bodies & regulators",   cat:"strength",   segs:[SP,SI]},
  ],
  ka:[
    {id:mkId(),text:"Continuous IFC compliance engine development",     cat:"critical",  segs:[SA,SC,SB]},
    {id:mkId(),text:"BIM model validation, clash detection & QA",       cat:"high",      segs:[SC,SB]},
    {id:mkId(),text:"Customer onboarding & BIM implementation support", cat:"strength",  segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"SDK & API integration for third-party tools",      cat:"opportunity",segs:[SA,SC,SB]},
  ],
  kr:[
    {id:mkId(),text:"Proprietary IFC parsing & geometry engine",     cat:"strength",  segs:[SA,SC,SB]},
    {id:mkId(),text:"AECO domain expert team (50+ engineers)",       cat:"high",      segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"ISO 19650 certification & compliance library",  cat:"strength",  segs:[SC,SO,SP,SI]},
    {id:mkId(),text:"GIS & infrastructure data integrations layer",  cat:"opportunity",segs:[SI,SP]},
  ],
  vp:[
    {id:mkId(),text:"Only fully openBIM-native platform — zero vendor lock-in",        cat:"strength",  segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"Real-time IFC4.3 validation reducing coordination errors by 60%", cat:"critical",  segs:[SC,SB]},
    {id:mkId(),text:"Single source of truth for entire project lifecycle",              cat:"high",      segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"AI-assisted clash detection & automated BIM audits",              cat:"opportunity",segs:[SA,SC,SB]},
    {id:mkId(),text:"Digital twin ready — seamless FM handover package",               cat:"strength",  segs:[SO,SI,SP]},
  ],
  cr:[
    {id:mkId(),text:"Dedicated BIM Success Manager per enterprise account",cat:"strength",  segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"ACCA Academy — online BIM certification programme",   cat:"high",      segs:[SA,SC,SB]},
    {id:mkId(),text:"Government & public sector engagement programme",     cat:"high",      segs:[SP,SI]},
  ],
  ch:[
    {id:mkId(),text:"Direct SaaS subscription via acca.it platform",    cat:"strength",  segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"Authorised reseller network across 40+ countries", cat:"high",      segs:[SA,SC,SB]},
    {id:mkId(),text:"Public tender & e-procurement platforms",          cat:"high",      segs:[SP,SI]},
  ],
  cost:[
    {id:mkId(),text:"R&D — IFC engine & AI feature development",  cat:"critical",segs:[]},
    {id:mkId(),text:"Cloud hosting & storage infrastructure",      cat:"high",   segs:[]},
    {id:mkId(),text:"Sales & partner channel commissions",         cat:"medium", segs:[]},
  ],
  rev:[
    {id:mkId(),text:"Enterprise SaaS licences (annual ARR)",      cat:"strength",  segs:[SA,SC,SO,SB,SI,SP]},
    {id:mkId(),text:"Professional Services — BIM implementation", cat:"high",      segs:[SC,SO,SB,SI,SP]},
    {id:mkId(),text:"API usage & white-label SDK licensing",      cat:"opportunity",segs:[SA,SC,SB]},
  ],
  notes:[
    {id:mkId(),text:"Explore AI-driven code checking for building permits in EU municipalities",cat:"opportunity",segs:[]},
    {id:mkId(),text:"BIM Consultants segment growing 30% YoY — consider dedicated onboarding track",cat:"high",segs:[]},
  ],
};

/* ─────────────────────────────────────────────────────────
   IMPORT PARSER — converts exported JSON → internal state
───────────────────────────────────────────────────────── */
function parseImport(raw){
  try{
    const parsed = typeof raw==="string" ? JSON.parse(raw) : raw;
    const notes  = parsed.notes ?? parsed.entries ?? [];

    // Validate: needs an array of note objects with section + content
    if(!Array.isArray(notes) || notes.length===0) throw new Error("No notes array found");

    const validSids = new Set(Object.keys(SECTIONS));
    const newState  = Object.fromEntries(Object.keys(SECTIONS).map(k=>[k,[]]));

    // Sort by position so order is preserved
    const sorted = [...notes].sort((a,b)=>(a.position??0)-(b.position??0));

    sorted.forEach(n=>{
      const sid = n.section;
      if(!sid || !validSids.has(sid)) return;
      const cat = NC_TO_CAT[n.color] ?? "info";
      newState[sid].push({
        id:   mkId(),
        text: (n.content ?? n.text ?? "").trim(),
        cat,
        segs: [],
        author: n.author ?? "",
        ts:   n.created_at ? new Date(n.created_at).getTime() : Date.now(),
      });
    });

    // Title from canvas metadata
    const title = parsed.canvas?.title ?? parsed.title ?? null;
    return {state: newState, title, count: sorted.length};
  } catch(err){
    throw new Error("Import failed: "+err.message);
  }
}

/* ─────────────────────────────────────────────────────────
   EXPORT BUILDER
───────────────────────────────────────────────────────── */
function buildExport(state, canvasTitle){
  const allEntries = Object.values(state).flat();
  return {
    canvas:{ title: canvasTitle||"BMC Export", exported_at: new Date().toISOString() },
    summary:{
      total_entries: allEntries.length,
      sections_used: Object.keys(SECTIONS).filter(k=>k!=="notes"&&(state[k]?.length||0)>0).length,
      by_category:   Object.fromEntries(CATS.map(c=>[c.label, allEntries.filter(e=>e.cat===c.key).length])),
    },
    notes: Object.entries(state).flatMap(([sid, entries])=>
      entries.map((e, i)=>({
        id:       e.id,
        section:  sid,
        content:  e.text,
        color:    Object.entries(NC_TO_CAT).find(([,v])=>v===e.cat)?.[0] ?? "nc-white",
        category: cl(e.cat),
        author:   e.author ?? "",
        position: i,
        linked_segments: (e.segs||[]).map(segId=>{
          const seg = (state.cs||[]).find(s=>s.id===segId);
          return seg ? seg.text : segId;
        }),
      }))
    ),
  };
}

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
        <g stroke="#18284a" strokeWidth="0.5" opacity="0.38">
          {[100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500].map(x=><line key={x} x1={x} y1="0" x2={x} y2="900"/>)}
          {[100,200,300,400,500,600,700,800].map(y=><line key={y} x1="0" y1={y} x2="1600" y2={y}/>)}
        </g>
        <g stroke="#1e3a6a" strokeWidth="1" fill="none" opacity="0.42" transform="translate(36,150)">
          <polygon points="0,320 0,70 170,0 340,70 340,320" stroke="#2a4d88" fill="#091422" fillOpacity="0.55"/>
          <polygon points="0,70 170,0 340,70 170,140" stroke="#3b6ab5" fill="#0e1e3a" fillOpacity="0.45"/>
          <polygon points="340,70 340,320 440,240 440,0 170,0 340,70" fill="#07101e" fillOpacity="0.5"/>
          {[26,138,252].map(x=>[115,198].map(y=><rect key={`${x}${y}`} x={x} y={y} width="44" height="52" stroke="#2560b8" strokeWidth="0.8" fill="#1a3a6e" fillOpacity="0.3"/>))}
        </g>
        <g stroke="#1e3a6a" strokeWidth="1" fill="none" opacity="0.3" transform="translate(1110,44)">
          <polygon points="0,460 0,50 190,0 380,50 380,460" stroke="#2a4d88" fill="#091422" fillOpacity="0.42"/>
          <polygon points="0,50 190,0 380,50 190,100" stroke="#3b6ab5" fill="#0e1e3a" fillOpacity="0.35"/>
          <polygon points="380,50 380,460 480,380 480,-38 190,0 380,50" fill="#07101e" fillOpacity="0.38"/>
          {[24,148,272].map(x=>[105,205,305].map(y=><rect key={`${x}${y}`} x={x} y={y} width="48" height="56" stroke="#2560b8" strokeWidth="0.8" fill="#1a3a6e" fillOpacity="0.2"/>))}
        </g>
        <g opacity="0.18" filter="url(#gf)">
          {[[498,762],[620,802],[700,732],[800,782],[880,722],[980,762],[1060,800]].map(([cx,cy],i)=>
            <circle key={i} cx={cx} cy={cy} r={[6,5,7,4,6,5,4][i]} fill={[Y,"#60a5fa",Y,"#4ade80",Y,"#60a5fa","#c084fc"][i]}/>)}
          {[[498,762,700,732],[700,732,800,782],[700,732,880,722],[880,722,980,762],[498,762,620,802]].map(([x1,y1,x2,y2],i)=>
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={Y} strokeWidth="1"/>)}
        </g>
        <g opacity="0.13" transform="translate(1462,792)">
          <line x1="0" y1="0" x2="70" y2="0" stroke="#ef4444" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="0" y2="-70" stroke="#4ade80" strokeWidth="1.5"/>
          <line x1="0" y1="0" x2="-45" y2="-45" stroke="#60a5fa" strokeWidth="1.5"/>
          <polygon points="70,0 60,-3.5 60,3.5" fill="#ef4444"/>
          <polygon points="0,-70 -3.5,-60 3.5,-60" fill="#4ade80"/>
          <polygon points="-45,-45 -41,-33 -33,-41" fill="#60a5fa"/>
          <text x="74" y="4" fill="#ef4444" fontSize="9" fontFamily="monospace">X</text>
          <text x="-5" y="-74" fill="#4ade80" fontSize="9" fontFamily="monospace">Z</text>
          <text x="-58" y="-49" fill="#60a5fa" fontSize="9" fontFamily="monospace">Y</text>
        </g>
        <text x="24" y="892" fill="#192d4a" fontSize="8.5" fontFamily="monospace" opacity="0.5">IFC4.3 · ISO 19650 · openBIM · buildingSMART · EU BIM Mandate</text>
        <text x="1080" y="892" fill="#192d4a" fontSize="8.5" fontFamily="monospace" opacity="0.5">AECO / BIM Industry · ACCA software S.p.A.</text>
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
   TAG BADGE — white text on coloured background, always readable
───────────────────────────────────────────────────────── */
function Tag({catKey, small=false}){
  const color = cc(catKey);
  return(
    <span style={{
      display:"inline-flex", alignItems:"center",
      fontSize: small ? 7.5 : 9,
      fontWeight:700, fontFamily:MONO,
      textTransform:"uppercase", letterSpacing:".5px",
      color:"#ffffff",                        /* always white text */
      background: color,                      /* solid colour bg   */
      padding: small ? "2px 5px" : "2px 7px",
      borderRadius:3, flexShrink:0,
      whiteSpace:"nowrap", lineHeight:1.6,
      boxShadow:`0 1px 4px ${color}60`,
    }}>
      {cl(catKey)}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   CHIP
───────────────────────────────────────────────────────── */
function Chip({entry,onEdit,onDelete,onSegClick,isSegSection,idx=0}){
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
        animationDelay:`${idx*35}ms`,
        display:"flex",flexDirection:"column",gap:5,
        background:hov?"rgba(255,255,255,0.08)":hasLinks?"rgba(255,255,255,0.055)":"rgba(255,255,255,0.03)",
        border:`1px solid ${hov?"rgba(100,150,230,0.85)":"rgba(30,52,90,0.65)"}`,
        borderLeft:`3px solid ${chipColor}`,
        borderRadius:7,padding:"7px 9px 8px",
        cursor:isSegSection?"pointer":"default",
        boxShadow:hasLinks?`0 0 0 1px ${chipColor}22`:"none",
        width:"100%",minWidth:0,flexShrink:0,
      }}
    >
      {/* Row 1: tag + seg badge + spacer + icons */}
      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"nowrap",minWidth:0}}>
        <Tag catKey={entry.cat} small/>
        {hasLinks&&(
          <span style={{
            fontSize:7,fontWeight:700,color:"#ffffff",fontFamily:MONO,
            background:"rgba(255,209,0,0.75)",
            padding:"2px 5px",borderRadius:3,whiteSpace:"nowrap",lineHeight:1.6,flexShrink:0,
          }}>⟶ {entry.segs.length}</span>
        )}
        {entry.author&&(
          <span style={{fontSize:7,color:"rgba(255,255,255,0.35)",fontFamily:MONO,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1,minWidth:0}}>
            {entry.author}
          </span>
        )}
        <div style={{flex:1,minWidth:0}}/>
        <button onClick={e=>{e.stopPropagation();onEdit();}} title="Edit" className="btn-icon"
          style={{width:22,height:22,borderRadius:5,border:`1px solid ${hov?"rgba(255,209,0,0.5)":"transparent"}`,
            background:hov?"rgba(255,209,0,0.15)":"transparent",color:hov?Y:"rgba(255,255,255,0.28)",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M7.8 1.5L9.5 3.2 3.2 9.5H1.5V7.8L7.8 1.5z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
            <path d="M6.2 3l1.8 1.8" stroke="currentColor" strokeWidth="1.25"/>
          </svg>
        </button>
        <button onClick={e=>{e.stopPropagation();onDelete();}} title="Delete" className="btn-icon"
          style={{width:22,height:22,borderRadius:5,border:`1px solid ${hov?"rgba(239,68,68,0.5)":"transparent"}`,
            background:hov?"rgba(239,68,68,0.15)":"transparent",color:hov?"#ef4444":"rgba(255,255,255,0.28)",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 3h7M4.5 3V2h2v1M3.5 3l.5 6h3l.5-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {/* Row 2: text */}
      <span style={{fontSize:11,color:"#e8eef8",lineHeight:1.52,display:"block",width:"100%",wordBreak:"break-word",overflowWrap:"break-word",whiteSpace:"normal"}}>
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
  const isNotes=sid==="notes";
  return(
    <div className="card-hover" style={{
      background:"rgba(10,15,28,0.78)",
      backdropFilter:"blur(18px) saturate(1.4)",WebkitBackdropFilter:"blur(18px) saturate(1.4)",
      border:`1px solid ${sid==="vp"?"rgba(255,209,0,0.28)":isNotes?"rgba(251,146,60,0.28)":"rgba(30,52,90,0.62)"}`,
      borderRadius:13,display:"flex",flexDirection:"column",
      position:"relative",overflow:"hidden",height:"100%",
      boxShadow:sid==="vp"?"0 0 42px rgba(255,209,0,0.07)":isNotes?"0 0 32px rgba(251,146,60,0.05)":"none",
    }}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.accent,opacity:.88,zIndex:2,boxShadow:`0 0 12px ${s.accent}60`}}/>
      <div style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none",backgroundImage:"radial-gradient(circle,rgba(255,255,255,.022) 1px,transparent 1px)",backgroundSize:"18px 18px"}}/>
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",height:"100%",padding:"13px 12px 11px",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
          <span style={{fontFamily:MONO,fontSize:9,fontWeight:700,color:"#fff",background:s.accent,padding:"1px 6px",borderRadius:3,flexShrink:0}}>{s.num}</span>
          <span style={{fontSize:10.5,fontWeight:700,color:"#f0f4ff",textTransform:"uppercase",letterSpacing:".8px",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.name}</span>
          <span style={{fontFamily:MONO,fontSize:9,color:"#fff",background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.15)",padding:"1px 7px",borderRadius:20,flexShrink:0}}>{entries.length}</span>
          <button onClick={onAdd} title="Add entry" className="btn-icon"
            style={{background:"rgba(255,209,0,0.15)",border:"1px solid rgba(255,209,0,0.35)",color:Y,width:25,height:25,borderRadius:6,cursor:"pointer",fontSize:17,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:"'Inter',sans-serif",lineHeight:1}}>+</button>
        </div>
        <div style={{height:1,background:"rgba(30,52,90,0.65)",margin:"0 -12px",flexShrink:0}}/>
        <div style={{flex:1,overflowY:"auto",overflowX:"hidden",display:"flex",flexDirection:"column",gap:5,width:"100%",minWidth:0}}>
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
   STORY FLOW MAP — SVG visual node graph
───────────────────────────────────────────────────────── */
const FLOW=[
  {sid:"kp",  color:"#60a5fa", label:"Partners",       short:"KP"},
  {sid:"ka",  color:"#c084fc", label:"Activities",     short:"KA"},
  {sid:"kr",  color:"#818cf8", label:"Resources",      short:"KR"},
  {sid:"vp",  color:Y,         label:"Value Prop",     short:"VP"},
  {sid:"cr",  color:"#22d3ee", label:"Relationships",  short:"CR"},
  {sid:"ch",  color:"#38bdf8", label:"Channels",       short:"CH"},
  {sid:"rev", color:"#4ade80", label:"Revenue",        short:"REV"},
];

function FlowMap({state, segId}){
  /* Build node + connection data */
  const nodes = useMemo(()=>{
    const W=320, H=220;
    // 7 nodes in a horizontal arc
    const positions = [
      {x:30, y:50 },{x:30, y:120},{x:30, y:190},  // left col: KP,KA,KR
      {x:160,y:110},                                // centre: VP
      {x:290,y:50 },{x:290,y:120},{x:290,y:190},   // right col: CR,CH,REV
    ];
    return FLOW.map((f,i)=>{
      const entries=(state[f.sid]||[]).filter(e=>(e.segs||[]).includes(segId));
      return{...f, n:entries.length, entries, ...positions[i]};
    });
  },[state,segId]);

  const activeNodes = nodes.filter(n=>n.n>0);
  // Connections: each left-side node connects to VP, VP connects to each right-side node
  const connections = useMemo(()=>{
    const vp = nodes.find(n=>n.sid==="vp");
    if(!vp || vp.n===0) return[];
    const lines = [];
    // Left nodes → VP
    ["kp","ka","kr"].forEach(sid=>{
      const node=nodes.find(n=>n.sid===sid);
      if(node&&node.n>0) lines.push({x1:node.x+26,y1:node.y+14,x2:vp.x,y2:vp.y+14,color:node.color});
    });
    // VP → right nodes
    ["cr","ch","rev"].forEach(sid=>{
      const node=nodes.find(n=>n.sid===sid);
      if(node&&node.n>0) lines.push({x1:vp.x+36,y1:vp.y+14,x2:node.x,y2:node.y+14,color:node.color});
    });
    return lines;
  },[nodes]);

  return(
    <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(30,52,90,0.6)",borderRadius:10,padding:"12px",animation:"fadeUp 0.35s ease"}}>
      <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
        Visual Flow Map · Partners → Value → Revenue
      </div>
      <svg viewBox="0 0 320 230" style={{width:"100%",height:"auto",overflow:"visible"}}>
        {/* Connection lines */}
        {connections.map((c,i)=>(
          <line key={i} className="flow-line" x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
            stroke={c.color} strokeWidth="1.5" strokeOpacity="0.55"
            strokeDasharray="300" style={{animationDelay:`${i*80}ms`}}/>
        ))}
        {/* Arrow markers */}
        <defs>
          {FLOW.map(f=>(
            <marker key={f.sid} id={`arr-${f.sid}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={f.color} opacity="0.7"/>
            </marker>
          ))}
        </defs>
        {/* Nodes */}
        {nodes.map((n,i)=>{
          const active=n.n>0;
          return(
            <g key={n.sid} style={{animation:`fadeIn 0.3s ease ${i*60}ms forwards`,opacity:0}}>
              {/* Node box */}
              <rect x={n.x} y={n.y} width={36} height={28} rx={5}
                fill={active?n.color+"25":"rgba(255,255,255,0.04)"}
                stroke={active?n.color:"rgba(30,52,90,0.6)"}
                strokeWidth={active?1.5:1}/>
              {/* Short label */}
              <text x={n.x+18} y={n.y+11} textAnchor="middle" dominantBaseline="middle"
                fill={active?"#ffffff":"rgba(255,255,255,0.3)"}
                fontSize="7.5" fontFamily="monospace" fontWeight="700">
                {n.short}
              </text>
              {/* Count badge */}
              {active&&(
                <g>
                  <circle cx={n.x+36} cy={n.y} r={8} fill={n.color}/>
                  <text x={n.x+36} y={n.y} textAnchor="middle" dominantBaseline="middle"
                    fill="#000" fontSize="7" fontFamily="monospace" fontWeight="800">{n.n}</text>
                </g>
              )}
              {/* Full label below */}
              <text x={n.x+18} y={n.y+33} textAnchor="middle"
                fill={active?"rgba(255,255,255,0.7)":"rgba(255,255,255,0.2)"}
                fontSize="6.5" fontFamily="monospace">
                {n.label}
              </text>
            </g>
          );
        })}
        {/* VP centre highlight ring */}
        {nodes.find(n=>n.sid==="vp")?.n>0&&(
          <rect x={155} y={105} width={46} height={34} rx={7}
            fill="none" stroke={Y} strokeWidth="2" strokeOpacity="0.4"
            strokeDasharray="4 2"/>
        )}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   STORY DRAWER
───────────────────────────────────────────────────────── */
function countLinked(state,segId){
  return LINKABLE.reduce((n,sid)=>n+(state[sid]||[]).filter(e=>(e.segs||[]).includes(segId)).length,0);
}

function SegMetrics({state,segId}){
  const bySection=FLOW.map(({sid,color,label})=>{
    const n=(state[sid]||[]).filter(e=>(e.segs||[]).includes(segId)).length;
    return{sid,color,label,n};
  });
  const total=bySection.reduce((s,x)=>s+x.n,0);
  const byCat=CATS.map(c=>({...c,n:LINKABLE.reduce((s,sid)=>s+(state[sid]||[]).filter(e=>(e.segs||[]).includes(segId)&&e.cat===c.key).length,0)})).filter(x=>x.n>0);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8,animation:"fadeUp 0.3s ease"}}>
      <div style={{display:"flex",gap:6}}>
        <div style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(30,52,90,0.7)",borderRadius:8,padding:"10px 12px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:Y}}/>
          <div style={{fontSize:28,fontWeight:900,color:"#fff",fontFamily:MONO,lineHeight:1}}>{total}</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginTop:4}}>Linked Entries</div>
        </div>
        <div style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(30,52,90,0.7)",borderRadius:8,padding:"10px 12px",textAlign:"center",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:"#4ade80"}}/>
          <div style={{fontSize:28,fontWeight:900,color:"#fff",fontFamily:MONO,lineHeight:1}}>{bySection.filter(x=>x.n>0).length}</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:1,marginTop:4}}>BMC Sections</div>
        </div>
      </div>
      {/* Visual flow map */}
      <FlowMap state={state} segId={segId}/>
      {/* Bar chart */}
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(30,52,90,0.55)",borderRadius:8,padding:"10px 12px"}}>
        <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Entries per Section</div>
        {FLOW.filter(f=>f.n>0||(state[f.sid]||[]).filter(e=>(e.segs||[]).includes(segId)).length>0).map(({sid,color,label})=>{
          const n=(state[sid]||[]).filter(e=>(e.segs||[]).includes(segId)).length;
          const pct=total>0?Math.round((n/total)*100):0;
          return(
            <div key={sid} style={{marginBottom:6}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:10,color:"#dde6f8",fontWeight:600}}>{label}</span>
                <span style={{fontSize:9,color:n>0?color:"rgba(255,255,255,0.25)",fontFamily:MONO,fontWeight:700}}>{n}</span>
              </div>
              <div style={{height:5,background:"rgba(255,255,255,0.07)",borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99,transition:"width .5s ease",boxShadow:`0 0 6px ${color}80`}}/>
              </div>
            </div>
          );
        })}
      </div>
      {byCat.length>0&&(
        <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(30,52,90,0.55)",borderRadius:8,padding:"10px 12px"}}>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.4)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Category Breakdown</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {byCat.map(c=>(
              <div key={c.key} style={{display:"flex",alignItems:"center",gap:5,background:c.color,borderRadius:6,padding:"4px 8px"}}>
                <span style={{fontSize:10,color:"#fff",fontWeight:700}}>{c.label}</span>
                <span style={{fontSize:11,color:"#fff",fontFamily:MONO,fontWeight:900}}>{c.n}</span>
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
    <div style={{background:"rgba(4,7,16,0.96)",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderLeft:"1px solid rgba(30,52,90,0.65)",display:"flex",flexDirection:"column",height:"100%",overflow:"hidden",animation:"slideIn 0.25s ease"}}>
      <div style={{padding:"15px 18px 12px",borderBottom:"1px solid rgba(30,52,90,0.6)",flexShrink:0,position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${Y},#22d3ee)`}}/>
        <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>🗺 Success Story Tracer</div>
        <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",fontFamily:MONO,marginTop:3}}>
          {seg?`→ ${seg.text.slice(0,38)}`:"Select a customer segment"}
        </div>
        <button onClick={onClose} style={{position:"absolute",top:13,right:14,background:"rgba(255,255,255,.05)",border:"1px solid rgba(30,52,90,0.6)",color:"rgba(255,255,255,0.6)",width:26,height:26,borderRadius:5,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {!activeSegId?(
          <>
            <div style={{fontSize:8,color:"rgba(255,255,255,0.35)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:.8,marginBottom:2}}>Customer Segments</div>
            {segs.length===0?(
              <div style={{textAlign:"center",opacity:.4,padding:"28px 0",fontSize:11,color:"rgba(255,255,255,0.5)"}}>Add Customer Segment entries first</div>
            ):segs.map(s=>{
              const linked=countLinked(state,s.id);
              return(
                <button key={s.id} onClick={()=>onSelectSeg(s.id)} className="seg-btn-anim"
                  style={{background:"rgba(255,255,255,0.045)",border:"1px solid rgba(30,52,90,0.65)",borderRadius:9,padding:"10px 12px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:9,width:"100%"}}>
                  <span style={{fontSize:16,flexShrink:0}}>👤</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:11.5,fontWeight:600,color:"#e8eef8",lineHeight:1.4,wordBreak:"break-word"}}>{s.text}</div>
                    <div style={{marginTop:3}}><Tag catKey={s.cat} small/></div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:20,fontWeight:900,color:linked>0?Y:"rgba(255,255,255,0.18)",fontFamily:MONO,lineHeight:1}}>{linked}</div>
                    <div style={{fontSize:7,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:.5}}>linked</div>
                  </div>
                </button>
              );
            })}
          </>
        ):(
          <>
            <button onClick={()=>onSelectSeg(null)} style={{background:"rgba(255,255,255,0.045)",border:"1px solid rgba(30,52,90,0.65)",borderRadius:6,padding:"5px 11px",cursor:"pointer",fontSize:10,color:"rgba(255,255,255,0.6)",textAlign:"left",width:"fit-content"}}>← All Segments</button>
            <div style={{background:"linear-gradient(135deg,rgba(74,222,128,0.14),rgba(74,222,128,0.05))",border:"1px solid rgba(74,222,128,0.28)",borderRadius:10,padding:"11px 14px",animation:"fadeUp 0.2s ease"}}>
              <div style={{fontSize:14,fontWeight:700,color:"#fff",lineHeight:1.35,wordBreak:"break-word",marginBottom:6}}>{seg.text}</div>
              <Tag catKey={seg.cat}/>
            </div>
            <SegMetrics state={state} segId={activeSegId}/>
            {/* Collapsible flow detail */}
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(30,52,90,0.55)",borderRadius:10,overflow:"hidden",animation:"fadeUp 0.3s ease"}}>
              <div style={{padding:"8px 12px",borderBottom:"1px solid rgba(30,52,90,0.5)",background:"rgba(255,255,255,0.02)"}}>
                <div style={{fontSize:8,color:"rgba(255,255,255,0.35)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:1}}>Canvas Flow · Partners → Revenue</div>
              </div>
              {FLOW.map(({sid,color,label})=>{
                const items=(state[sid]||[]).filter(e=>(e.segs||[]).includes(activeSegId));
                if(!items.length) return null;
                const expanded=expandedSid===sid;
                return(
                  <div key={sid} style={{borderBottom:"1px solid rgba(30,52,90,0.4)"}}>
                    <div onClick={()=>toggleSid(sid)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",cursor:"pointer",background:expanded?"rgba(255,255,255,0.05)":"transparent",transition:"background .15s"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0,boxShadow:`0 0 6px ${color}90`}}/>
                      <div style={{fontSize:10,fontWeight:700,color:"#e8eef8",textTransform:"uppercase",letterSpacing:.7,flex:1,fontFamily:MONO}}>{label}</div>
                      <div style={{fontSize:11,color:color,fontFamily:MONO,fontWeight:800,marginRight:4}}>{items.length}</div>
                      <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",transform:expanded?"rotate(90deg)":"rotate(0deg)",transition:"transform .2s"}}>▶</div>
                    </div>
                    {expanded&&(
                      <div style={{display:"flex",flexDirection:"column",gap:4,padding:"4px 12px 10px",animation:"fadeIn 0.18s ease"}}>
                        {items.map(e=>(
                          <div key={e.id} style={{display:"flex",flexDirection:"column",gap:4,padding:"6px 9px",background:"rgba(255,255,255,0.045)",borderRadius:6,borderLeft:`2px solid ${color}`}}>
                            <Tag catKey={e.cat} small/>
                            <span style={{fontSize:11,color:"#e8eef8",lineHeight:1.45,wordBreak:"break-word"}}>{e.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {countLinked(state,activeSegId)===0&&(
                <div style={{padding:"22px 16px",textAlign:"center",opacity:.45}}>
                  <div style={{fontSize:24}}>🔗</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.55)",marginTop:8,lineHeight:1.6}}>No entries linked yet.<br/>When adding entries, link them to this segment.</div>
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
   IMPORT MODAL
───────────────────────────────────────────────────────── */
function ImportModal({open,onClose,onImport}){
  const [raw,setRaw]=useState("");
  const [error,setError]=useState("");
  const [preview,setPreview]=useState(null);
  const fileRef=useRef();

  const handleFile=e=>{
    const f=e.target.files?.[0];
    if(!f) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const text=ev.target.result;
      setRaw(text);
      tryPreview(text);
    };
    reader.readAsText(f);
  };

  const tryPreview=text=>{
    try{
      const res=parseImport(text);
      setPreview(res);
      setError("");
    }catch(e){setError(e.message);setPreview(null);}
  };

  const handleTextChange=e=>{setRaw(e.target.value);tryPreview(e.target.value);};

  const doImport=mode=>{
    if(!preview) return;
    onImport(preview.state, mode);
    setRaw("");setPreview(null);setError("");
    onClose();
  };

  if(!open) return null;
  return(
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}}
      style={{position:"fixed",inset:0,background:"rgba(1,3,10,0.88)",backdropFilter:"blur(8px)",zIndex:600,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.18s ease"}}>
      <div style={{background:"rgba(8,12,24,0.99)",border:"1px solid rgba(60,100,170,0.9)",borderRadius:14,width:"100%",maxWidth:520,boxShadow:"0 40px 100px rgba(0,0,0,.8)",overflow:"hidden",animation:"fadeUp 0.22s ease"}}>
        <div style={{background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(30,52,90,0.6)",padding:"18px 22px 14px",position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${Y},#60a5fa)`}}/>
          <div style={{fontSize:8,fontFamily:MONO,color:Y,textTransform:"uppercase",letterSpacing:1.5,marginBottom:3}}>IMPORT CANVAS</div>
          <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>Import from JSON</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginTop:2}}>Supports ACCA Canvas export format</div>
          <button onClick={onClose} style={{position:"absolute",top:16,right:18,background:"rgba(255,255,255,.05)",border:"1px solid rgba(30,52,90,0.6)",color:"rgba(255,255,255,0.55)",width:26,height:26,borderRadius:5,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"16px 22px 20px",display:"flex",flexDirection:"column",gap:12}}>
          {/* File drop */}
          <div>
            <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:.8,marginBottom:7,fontFamily:MONO}}>Upload JSON file</label>
            <div onClick={()=>fileRef.current?.click()} style={{border:"1px dashed rgba(255,209,0,0.35)",borderRadius:8,padding:"14px",textAlign:"center",cursor:"pointer",background:"rgba(255,209,0,0.04)",transition:"background .15s"}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,209,0,0.08)"}
              onMouseLeave={e=>e.currentTarget.style.background="rgba(255,209,0,0.04)"}>
              <div style={{fontSize:22,marginBottom:4}}>📂</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.55)"}}>Click to browse or drop a JSON file</div>
              <input ref={fileRef} type="file" accept=".json" onChange={handleFile} style={{display:"none"}}/>
            </div>
          </div>
          {/* Paste area */}
          <div>
            <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:.8,marginBottom:7,fontFamily:MONO}}>Or paste JSON directly</label>
            <textarea value={raw} onChange={handleTextChange} placeholder='{"canvas":{...},"notes":[...]}'
              style={{width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${error?"#ef4444":raw?"rgba(255,209,0,0.45)":"rgba(30,52,90,0.7)"}`,color:"#e8eef8",padding:"9px 11px",borderRadius:8,fontSize:11,fontFamily:MONO,outline:"none",resize:"vertical",minHeight:90,lineHeight:1.5,transition:"border-color .15s"}}/>
          </div>
          {/* Error */}
          {error&&<div style={{background:"rgba(239,68,68,0.12)",border:"1px solid rgba(239,68,68,0.4)",borderRadius:6,padding:"8px 12px",fontSize:11,color:"#fca5a5"}}>⚠ {error}</div>}
          {/* Preview */}
          {preview&&(
            <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.3)",borderRadius:8,padding:"10px 14px",animation:"fadeUp 0.2s ease"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#4ade80",marginBottom:6}}>✓ Ready to import</div>
              {preview.title&&<div style={{fontSize:12,color:"#e8eef8",fontWeight:600,marginBottom:4}}>"{preview.title}"</div>}
              <div style={{fontSize:10,color:"rgba(255,255,255,0.6)"}}>
                {Object.entries(preview.state).filter(([,v])=>v.length>0).map(([k,v])=>(
                  <span key={k} style={{display:"inline-flex",alignItems:"center",gap:3,marginRight:8,marginBottom:2}}>
                    <span style={{fontSize:8,fontFamily:MONO,background:SECTIONS[k]?.accent,color:"#fff",padding:"1px 5px",borderRadius:2,fontWeight:700}}>{k.toUpperCase()}</span>
                    <span style={{color:"#e8eef8",fontWeight:600}}>{v.length}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:7,borderTop:"1px solid rgba(30,52,90,0.6)",padding:"12px 22px",background:"rgba(255,255,255,0.02)",flexWrap:"wrap"}}>
          <button onClick={onClose} style={{flex:1,background:"transparent",border:"1px solid rgba(30,52,90,0.6)",color:"rgba(255,255,255,0.55)",padding:"9px",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'Inter',sans-serif",minWidth:80}}>Cancel</button>
          <button onClick={()=>doImport("replace")} disabled={!preview}
            style={{flex:2,background:preview?"#ef4444":"rgba(255,255,255,0.08)",border:"none",color:preview?"#fff":"rgba(255,255,255,0.3)",padding:"9px",borderRadius:8,fontSize:12,fontWeight:700,cursor:preview?"pointer":"not-allowed",fontFamily:"'Inter',sans-serif",minWidth:120}}>
            Replace Canvas
          </button>
          <button onClick={()=>doImport("merge")} disabled={!preview}
            style={{flex:2,background:preview?Y:"rgba(255,255,255,0.08)",border:"none",color:preview?"#060606":"rgba(255,255,255,0.3)",padding:"9px",borderRadius:8,fontSize:12,fontWeight:800,cursor:preview?"pointer":"not-allowed",fontFamily:"'Inter',sans-serif",minWidth:120}}>
            Merge into Canvas
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ENTRY MODAL
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
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(1,3,10,0.88)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20,animation:"fadeIn 0.18s ease"}}>
      <div style={{background:"rgba(8,12,24,0.99)",border:"1px solid rgba(60,100,170,0.88)",borderRadius:14,width:"100%",maxWidth:500,boxShadow:"0 40px 100px rgba(0,0,0,.78)",overflow:"hidden",animation:"fadeUp 0.22s ease"}}>
        <div style={{background:"rgba(255,255,255,0.03)",borderBottom:"1px solid rgba(30,52,90,0.6)",padding:"18px 22px 14px",position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:Y}}/>
          <div style={{fontSize:8,fontFamily:MONO,color:Y,textTransform:"uppercase",letterSpacing:1.5,marginBottom:3}}>{isEdit?"EDIT ENTRY":"ADD ENTRY"}</div>
          <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{isEdit?"Edit Entry":"New Entry"}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",marginTop:2}}>→ {s.name}</div>
          <button onClick={onClose} style={{position:"absolute",top:16,right:18,background:"rgba(255,255,255,.05)",border:"1px solid rgba(30,52,90,0.6)",color:"rgba(255,255,255,0.55)",width:26,height:26,borderRadius:5,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{padding:"16px 22px 18px",display:"flex",flexDirection:"column",gap:14,maxHeight:"64vh",overflowY:"auto"}}>
          <div>
            <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:.8,marginBottom:7,fontFamily:MONO}}>Description</label>
            <textarea value={text} onChange={e=>setText(e.target.value)} autoFocus placeholder="Describe this element clearly…"
              onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter"){e.preventDefault();doSave();}}}
              style={{width:"100%",background:"rgba(255,255,255,0.05)",border:`1px solid ${text?"rgba(255,209,0,0.55)":"rgba(30,52,90,0.7)"}`,color:"#e8eef8",padding:"10px 12px",borderRadius:8,fontSize:12.5,fontFamily:"'Inter',sans-serif",outline:"none",resize:"vertical",minHeight:80,lineHeight:1.55,transition:"border-color .15s"}}/>
          </div>
          <div>
            <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:.8,marginBottom:7,fontFamily:MONO}}>Category / Priority</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              {CATS.map(c=>(
                <div key={c.key} onClick={()=>setCat(c.key)} style={{display:"flex",alignItems:"center",gap:8,background:cat===c.key?`${c.color}18`:"rgba(255,255,255,.03)",border:`1px solid ${cat===c.key?c.color:"rgba(30,52,90,0.6)"}`,borderRadius:8,padding:"7px 10px",cursor:"pointer",transition:"all .15s"}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:c.color,flexShrink:0,boxShadow:cat===c.key?`0 0 8px ${c.color}80`:"none"}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11.5,fontWeight:600,color:"#e8eef8"}}>{c.label}</div>
                    <div style={{fontSize:8.5,color:"rgba(255,255,255,0.45)"}}>{c.desc}</div>
                  </div>
                  {cat===c.key&&<span style={{fontSize:12,color:c.color,fontWeight:700}}>✓</span>}
                </div>
              ))}
            </div>
          </div>
          {showLink&&(
            <div>
              <label style={{display:"block",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.5)",textTransform:"uppercase",letterSpacing:.8,marginBottom:7,fontFamily:MONO}}>Link to Customer Segment(s)</label>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {allSegs.map(seg=>(
                  <div key={seg.id} onClick={()=>toggleSeg(seg.id)} style={{display:"flex",alignItems:"center",gap:7,background:segs.has(seg.id)?"rgba(74,222,128,.07)":"rgba(255,255,255,.03)",border:`1px solid ${segs.has(seg.id)?"rgba(74,222,128,0.5)":"rgba(30,52,90,0.6)"}`,borderRadius:6,padding:"7px 10px",cursor:"pointer",transition:"all .15s"}}>
                    <div style={{width:14,height:14,border:segs.has(seg.id)?"none":"1px solid rgba(30,52,90,0.6)",borderRadius:3,background:segs.has(seg.id)?"#4ade80":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#080808",flexShrink:0,transition:"all .15s"}}>{segs.has(seg.id)?"✓":""}</div>
                    <span style={{fontSize:11.5,color:"#e8eef8",flex:1,wordBreak:"break-word"}}>{seg.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{display:"flex",gap:7,borderTop:"1px solid rgba(30,52,90,0.6)",padding:"12px 22px",background:"rgba(255,255,255,0.02)"}}>
          <button onClick={onClose} style={{flex:1,background:"transparent",border:"1px solid rgba(30,52,90,0.6)",color:"rgba(255,255,255,0.55)",padding:10,borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>Cancel</button>
          <button onClick={doSave} style={{flex:2,background:Y,border:"none",color:"#060606",padding:10,borderRadius:8,fontSize:12.5,fontWeight:800,cursor:"pointer",fontFamily:"'Inter',sans-serif",boxShadow:"0 0 18px rgba(255,209,0,0.3)"}}>
            {isEdit?"Update Entry":"Save Entry"}
          </button>
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────
   usBIM PRODUCT CATALOGUE (corrected)
───────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────
   DETERMINISTIC INSIGHTS ENGINE
   No API call — analyses canvas data directly in JS
   Works everywhere: preview, Vercel, any environment
───────────────────────────────────────────────────────── */

/* Product map: segment keyword → recommended tools */
const SEGMENT_TOOLS = {
  architect:    ["Edificius","usBIM.platform","usBIM.checker","BibLus-BIM"],
  design:       ["Edificius","usBIM.platform","usBIM.checker"],
  aec:          ["Edificius","usBIM.platform","usBIM.checker","usBIM.gantt"],
  contractor:   ["usBIM.platform","usBIM.gantt","usBIM.primus","usBIM.checker"],
  construction: ["usBIM.platform","usBIM.gantt","usBIM.primus"],
  bim:          ["usBIM.platform","usBIM.checker","Edificius","BibLus-BIM"],
  consultant:   ["usBIM.platform","usBIM.checker","Edificius"],
  facility:     ["usBIM.FM","usBIM.platform","usBIM.indoorGIS","usBIM.geotwin"],
  owner:        ["usBIM.FM","usBIM.platform","usBIM.geotwin"],
  infrastructure:["usBIM.geotwin","usBIM.platform","usBIM.checker","usBIM.FM"],
  public:       ["usBIM.platform","usBIM.checker","usBIM.geotwin","usBIM.FM"],
  municipality: ["usBIM.platform","usBIM.checker","usBIM.geotwin"],
  ministry:     ["usBIM.platform","usBIM.checker","usBIM.geotwin"],
  heritage:     ["usBIM.scan2BIM","Edificius","usBIM.platform"],
  health:       ["usBIM.FM","usBIM.platform","usBIM.indoorGIS"],
  hospital:     ["usBIM.FM","usBIM.platform","usBIM.indoorGIS"],
  real:         ["usBIM.realestate","usBIM.platform","usBIM.FM"],
  university:   ["Edificius","usBIM.platform","usBIM.checker"],
};

const LANG_TOOLS = {
  "Italian (HQ)":          ["usBIM.platform","Edificius","EdiLus","usBIM.checker"],
  "Spanish/LATAM":         ["Edificius","usBIM.primus","usBIM.platform","usBIM.checker"],
  "English/International": ["usBIM.platform","usBIM.geotwin","usBIM.checker","Edificius","usBIM.scan2BIM"],
  "German/DACH":           ["usBIM.checker","usBIM.platform","EdiLus","Edificius"],
  "French":                ["usBIM.platform","usBIM.FM","Edificius"],
  "Portuguese/Brazil":     ["usBIM.platform","usBIM.primus","Edificius"],
};

const QUICK_WINS = {
  architect:    "Run a free Edificius trial workshop for 5 target architecture firms this month",
  contractor:   "Demo usBIM.primus BOQ import from IFC to one contractor — show time savings",
  facility:     "Pilot usBIM.FM digital handover package with one building owner",
  infrastructure:"Schedule usBIM.geotwin GIS+BIM demo for infrastructure team",
  public:       "Prepare ISO 19650 compliance brief tailored to local BIM mandate requirements",
  bim:          "Offer a free usBIM.checker model audit to one BIM consultant client",
  default:      "Schedule a 30-minute usBIM.platform live demo for top 3 target accounts",
};

const PRIORITY_RULES = {
  high:   ["architect","contractor","bim","public","infrastructure"],
  medium: ["facility","owner","consultant","health"],
  low:    ["heritage","university","real"],
};

function getToolsForSegment(segText) {
  const t = segText.toLowerCase();
  for (const [kw, tools] of Object.entries(SEGMENT_TOOLS)) {
    if (t.includes(kw)) return tools;
  }
  return ["usBIM.platform","Edificius","usBIM.checker"];
}

function getPriority(segText) {
  const t = segText.toLowerCase();
  for (const [pri, kws] of Object.entries(PRIORITY_RULES)) {
    if (kws.some(k => t.includes(k))) return pri;
  }
  return "medium";
}

function getQuickWin(segText) {
  const t = segText.toLowerCase();
  for (const [kw, qw] of Object.entries(QUICK_WINS)) {
    if (t.includes(kw)) return qw;
  }
  return QUICK_WINS.default;
}

function getRationale(segText, vps) {
  const t = segText.toLowerCase();
  if (t.includes("architect") || t.includes("design"))
    return "Edificius positions ACCA as a credible openBIM authoring partner — direct Revit/ArchiCAD alternative with zero vendor lock-in.";
  if (t.includes("contractor") || t.includes("construction"))
    return "usBIM.primus BOQ + usBIM.gantt 4D scheduling directly addresses cost and schedule pain points common in construction firms.";
  if (t.includes("bim consultant"))
    return "BIM consultants need robust IFC checking and CDE to deliver ISO 19650-compliant projects — usBIM.platform + usBIM.checker is the core offer.";
  if (t.includes("infrastructure"))
    return "usBIM.geotwin's GIS+BIM integration for linear infrastructure is a unique differentiator with no direct openBIM competitor.";
  if (t.includes("public") || t.includes("municipality") || t.includes("ministry"))
    return "Public authorities face mandatory BIM adoption — usBIM.checker automates compliance against national mandates, reducing procurement risk.";
  if (t.includes("facility") || t.includes("owner"))
    return "Building owners need a long-term FM solution after project handover — usBIM.FM + usBIM.platform covers the full asset lifecycle.";
  const vp = vps.slice(0,2).map(e=>e.text).join("; ");
  return vp ? "Canvas value propositions (" + vp.slice(0,120) + "...) align well with this segment's openBIM adoption needs." : "usBIM.platform CDE covers core needs across design, delivery and operations.";
}

function computeInsights(state) {
  const lt      = TEAM_CONFIG.langTeam || "English/International";
  const segments = (state.cs  || []).slice(0,8);
  const vps      = (state.vp  || []);
  const partners = (state.kp  || []);
  const channels = (state.ch  || []);
  const revenues = (state.rev || []);
  const costs    = (state.cost|| []);
  const allEntries = Object.values(state).flat().filter(e => e && e.text);
  const filled  = Object.keys({kp:1,ka:1,vp:1,cr:1,cs:1,kr:1,ch:1,cost:1,rev:1})
                    .filter(k => (state[k]||[]).length > 0).length;

  /* Canvas health */
  const score = Math.min(10, Math.round(filled * 1.1 + (segments.length > 2 ? 1 : 0) + (vps.length > 2 ? 1 : 0)));
  const strengths = [];
  const gaps      = [];
  if (vps.length   >= 2) strengths.push("Strong value proposition coverage across segments");
  if (partners.length >= 2) strengths.push("Established partner network to accelerate market entry");
  if (channels.length >= 2) strengths.push("Multiple go-to-market channels defined");
  if (segments.length >= 3) strengths.push("Diverse segment portfolio reduces concentration risk");
  if ((state.kr||[]).length >= 2) strengths.push("Key resources documented — IP and team assets identified");
  if (vps.length   < 2)  gaps.push("Value propositions need more specificity per segment");
  if (costs.length < 2)  gaps.push("Cost structure underspecified — pricing model unclear");
  if (revenues.length < 2) gaps.push("Revenue streams need diversification beyond single model");
  if (segments.length < 3) gaps.push("Customer segments too narrow — add more AECO verticals");
  if ((state.cr||[]).length < 2) gaps.push("Customer relationship model not fully defined");

  /* Executive summary */
  const segNames = segments.slice(0,3).map(s=>s.text.slice(0,40)).join(", ");
  const executive_summary =
    `This ${lt} canvas targets ${segNames || "AECO segments"} with ACCA's openBIM platform suite. ` +
    `${filled}/9 BMC sections are populated (health score ${score}/10). ` +
    (score >= 7
      ? "The canvas shows a well-rounded model with clear value propositions and revenue logic."
      : score >= 5
      ? "Core sections are in place — focus on tightening revenue streams and cost structure."
      : "Priority: complete the missing sections to build a coherent go-to-market story.");

  /* Segment strategies */
  const segment_strategies = segments.map(seg => ({
    segment:       seg.text.slice(0,80),
    priority:      getPriority(seg.text),
    rationale:     getRationale(seg.text, vps),
    usbim_tools:   getToolsForSegment(seg.text),
    approach:      `Engage ${seg.text.slice(0,50)} via ${(channels[0]||{}).text?.slice(0,60) || "direct outreach"}, leading with a ` +
                   `free usBIM.platform trial and an Edificius demo where architectural workflow applies. ` +
                   `Reference relevant ISO 19650 compliance case studies.`,
    language_team: lt,
    quick_win:     getQuickWin(seg.text),
    risks:         [
      seg.text.toLowerCase().includes("public")
        ? "Long public procurement cycles — qualify budget and decision timeline early"
        : "Incumbent tool inertia (Revit/AutoCAD) — lead with interoperability, not replacement",
    ],
  }));

  /* Cross-segment opportunities */
  const cross_segment_opportunities = [{
    title:             "openBIM Platform Standardisation",
    description:       `Deploy usBIM.platform as a shared CDE across ${segments.slice(0,3).map(s=>s.text.slice(0,30)).join(", ")} — create a reference workflow covering design → construction → FM handover.`,
    segments_involved: segments.slice(0,3).map(s=>s.text.slice(0,40)),
    usbim_tools:       ["usBIM.platform","usBIM.checker","Edificius"],
  },{
    title:             "ISO 19650 Compliance Bundle",
    description:       "Bundle usBIM.checker + usBIM.platform as an ISO 19650 compliance starter pack targeting public authorities and BIM consultants simultaneously.",
    segments_involved: segments.filter(s=>s.text.toLowerCase().match(/public|bim|consult/)).slice(0,3).map(s=>s.text.slice(0,40)),
    usbim_tools:       ["usBIM.checker","usBIM.platform"],
  },{
    title:             "Edificius Architect-to-Contractor Pipeline",
    description:       "Position Edificius + usBIM.primus as an end-to-end design-to-BOQ workflow, bridging AEC design firms and general contractors.",
    segments_involved: segments.filter(s=>s.text.toLowerCase().match(/architect|contractor/)).slice(0,2).map(s=>s.text.slice(0,40)),
    usbim_tools:       ["Edificius","usBIM.primus","usBIM.platform"],
  }].filter(op => op.segments_involved.length > 0 || op.title === "openBIM Platform Standardisation");

  /* Language team actions */
  const ltTools = LANG_TOOLS[lt] || ["usBIM.platform","Edificius"];
  const language_team_actions = [{
    team:               lt,
    priority_segments:  segments.slice(0,3).map(s=>s.text.slice(0,50)),
    recommended_tools:  ltTools,
    actions: [
      `Run ${ltTools[0]} live demo to top 3 priority accounts in the next 30 days`,
      `Prepare localised one-pager (${lt} language) on ISO 19650 compliance with ${ltTools.slice(0,2).join(" + ")}`,
      `Identify 2 reference customers for a joint case study covering the full usBIM lifecycle`,
      `Establish quarterly partner review cadence with local resellers and system integrators`,
      `Create vertical-specific pitch deck for ${segments[0]?.text.slice(0,40) || "top segment"}`,
    ],
  }];

  /* Strategic risks */
  const strategic_risks = [
    { risk:"Revit/AutoCAD incumbent lock-in in target accounts",
      mitigation:"Lead demos with IFC interoperability — show Edificius/BibLus-BIM reading their existing Revit files natively",
      severity:"high" },
    { risk:"Long sales cycles in public sector segments",
      mitigation:"Build relationships with BIM officers before tender — use buildingSMART events and ISO 19650 workshops as entry points",
      severity:"high" },
    { risk:"Low brand awareness vs Autodesk/Bentley in non-Italian markets",
      mitigation:"Leverage openBIM compliance credentials, ISO 19650 alignment and reference projects as trust builders",
      severity:"medium" },
    { risk:"Feature parity perception gap vs established CDE platforms",
      mitigation:"Emphasise openBIM-native architecture, no vendor lock-in, and total cost of ownership advantage",
      severity:"medium" },
    costs.length < 2
      ? { risk:"Cost structure undefined — risk of unprofitable deals",
          mitigation:"Define minimum deal size and partner margin thresholds before scaling outreach",
          severity:"medium" }
      : { risk:"Partner channel commission costs may erode margins",
          mitigation:"Implement deal registration and tiered partner programme to align incentives",
          severity:"low" },
  ];

  /* Innovation ideas */
  const innovation_ideas = [
    { idea:"Free Edificius → usBIM.platform onboarding flow: design in Edificius, publish IFC to usBIM.platform automatically — zero-friction adoption funnel for architects",
      impact:"high", effort:"medium" },
    { idea:"ISO 19650 readiness assessment tool: 10-minute online audit that scores a firm's BIM maturity and recommends the right usBIM product bundle",
      impact:"high", effort:"low" },
    { idea:"usBIM.geotwin + local GIS data integration demo for municipalities — show digital twin of existing public infrastructure in 30 minutes",
      impact:"high", effort:"medium" },
    { idea:"Certification-linked free tier: firms that complete ACCA Academy BIM certification get 3 months usBIM.platform free — drives qualified leads",
      impact:"medium", effort:"low" },
    { idea:"Construction company ROI calculator: input project size, output savings from usBIM.primus BOQ automation vs manual — shareable PDF",
      impact:"medium", effort:"low" },
  ];

  return {
    executive_summary,
    canvas_health: { score, strengths: strengths.slice(0,4), gaps: gaps.slice(0,4) },
    segment_strategies,
    cross_segment_opportunities,
    language_team_actions,
    strategic_risks,
    innovation_ideas,
  };
}


/* ─────────────────────────────────────────────────────────
   HERO HEADER
───────────────────────────────────────────────────────── */
function HeroHeader({kpis,pct,drawerOpen,onToggleDrawer,onAddEntry,onImport,onExport,canvasTitle}){
  const w=useWW();
  const mobile=w<640;
  return(
    <header style={{position:"sticky",top:0,zIndex:200,background:"rgba(4,7,14,0.94)",backdropFilter:"blur(20px) saturate(1.6)",WebkitBackdropFilter:"blur(20px) saturate(1.6)",borderBottom:"1px solid rgba(30,52,90,0.7)",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,transparent,${Y} 20%,#fff 50%,${Y} 80%,transparent)`,opacity:.9,pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,209,0,0.03) 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none"}}/>
      {/* ROW 1: brand + actions */}
      <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:10,padding:mobile?"10px 14px":"12px 22px 8px"}}>
        <div style={{width:mobile?36:42,height:mobile?36:42,background:Y,borderRadius:9,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 0 20px rgba(255,209,0,0.38)"}}>
          <svg viewBox="0 0 28 28" fill="none" width={mobile?20:24} height={mobile?20:24}>
            <path d="M3 24L10.2 4h3.6L21 24h-4l-1.7-4.8H8.7L7 24H3zm7-8h7l-3.5-9.4L10 16z" fill="#050505"/>
            <rect x="22" y="4" width="3" height="20" rx="1.5" fill="#050505" opacity="0.35"/>
          </svg>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"baseline",gap:6,flexWrap:"wrap"}}>
            <span style={{fontSize:mobile?17:21,fontWeight:900,color:"#fff",letterSpacing:"-0.5px",lineHeight:1}}>ACCA</span>
            <span style={{fontSize:mobile?17:21,fontWeight:900,color:Y,letterSpacing:"-0.5px",lineHeight:1}}>Strategy</span>
            {canvasTitle&&<span style={{fontSize:10,color:"rgba(255,255,255,0.55)",fontFamily:MONO,alignSelf:"center"}}>· {canvasTitle}</span>}
            {!mobile&&<span style={{fontSize:9,fontWeight:700,color:"#ffffff",background:Y,padding:"2px 7px",borderRadius:20,fontFamily:MONO,letterSpacing:"0.5px",alignSelf:"center",whiteSpace:"nowrap"}}>BIM·AECO</span>}
          </div>
          <div style={{fontSize:mobile?7.5:8,color:"rgba(255,255,255,0.35)",fontFamily:MONO,letterSpacing:"1.6px",textTransform:"uppercase",marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {mobile?"BMC · AECO / BIM":"Business Model Canvas · AECO / BIM Industry"}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
          {/* Import */}
          <button onClick={onImport} className="btn-icon" title="Import JSON"
            style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(30,52,90,0.7)",color:"rgba(255,255,255,0.65)",padding:mobile?"7px":"7px 11px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:"'Inter',sans-serif",minWidth:mobile?34:undefined,justifyContent:"center"}}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v6M3 5l3 3 3-3M2 9v1a1 1 0 001 1h6a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            {!mobile&&T.import}
          </button>
          {/* Export */}
          <button onClick={onExport} className="btn-icon" title="Export JSON"
            style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(30,52,90,0.7)",color:"rgba(255,255,255,0.65)",padding:mobile?"7px":"7px 11px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:"'Inter',sans-serif",minWidth:mobile?34:undefined,justifyContent:"center"}}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 8V2M3 4l3-3 3 3M2 9v1a1 1 0 001 1h6a1 1 0 001-1V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            {!mobile&&T.export}
          </button>
          {/* Story View */}
          <button onClick={onToggleDrawer} className="btn-icon"
            style={{background:drawerOpen?"rgba(34,211,238,0.12)":"rgba(255,255,255,0.05)",border:`1px solid ${drawerOpen?"rgba(34,211,238,0.5)":"rgba(30,52,90,0.7)"}`,color:drawerOpen?"#22d3ee":"rgba(255,255,255,0.65)",padding:mobile?"7px":"7px 13px",borderRadius:8,fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:"'Inter',sans-serif",minWidth:mobile?34:undefined,justifyContent:"center"}}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 4v2.5l1.8 1.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            {!mobile&&T.storyView}
          </button>
          {/* Add Entry */}
          <button onClick={onAddEntry} className="btn-icon"
            style={{background:Y,border:"none",color:"#060606",padding:mobile?"7px":"7px 15px",borderRadius:8,fontSize:11,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:"'Inter',sans-serif",boxShadow:"0 0 18px rgba(255,209,0,0.3)",minWidth:mobile?34:undefined,justifyContent:"center"}}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            {!mobile&&T.addEntry}
          </button>
        </div>
      </div>
      {/* ROW 2: KPIs */}
      <div style={{position:"relative",zIndex:1,display:"flex",gap:5,padding:mobile?"0 14px 8px":"0 22px 8px",overflowX:"auto",overflowY:"hidden",scrollbarWidth:"none"}}>
        {kpis.map((k,i)=>(
          <div key={i} style={{background:"rgba(255,255,255,0.055)",border:"1px solid rgba(30,52,90,0.7)",borderRadius:8,padding:mobile?"6px 10px":"7px 14px",textAlign:"center",flexShrink:0,minWidth:mobile?60:72,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"2px",background:k.c,boxShadow:`0 0 8px ${k.c}80`}}/>
            <div style={{fontSize:mobile?16:20,fontWeight:900,color:"#fff",fontFamily:MONO,letterSpacing:"-1px",lineHeight:1}}>{k.v}</div>
            <div style={{fontSize:mobile?7:7.5,color:"rgba(255,255,255,0.6)",textTransform:"uppercase",letterSpacing:"0.6px",marginTop:3,whiteSpace:"nowrap"}}>{k.l}</div>
          </div>
        ))}
      </div>
      {/* ROW 3: progress */}
      <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:10,padding:mobile?"0 14px 8px":"0 22px 8px"}}>
        {!mobile&&<span style={{fontSize:7.5,color:"rgba(255,255,255,0.35)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:"1px",flexShrink:0}}>Completion</span>}
        <div style={{flex:1,height:3,background:"rgba(255,255,255,0.08)",borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${Y},#fff176)`,borderRadius:99,transition:"width .6s ease",boxShadow:"0 0 10px rgba(255,209,0,0.5)"}}/>
        </div>
        <span style={{fontSize:9,color:Y,fontFamily:MONO,fontWeight:700,flexShrink:0}}>{pct}%</span>
      </div>
      {/* ROW 4: legend */}
      {!mobile&&(
        <div style={{position:"relative",zIndex:1,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",padding:"5px 22px 8px",borderTop:"1px solid rgba(30,52,90,0.4)",background:"rgba(0,0,0,0.15)"}}>
          <span style={{fontSize:7.5,color:"rgba(255,255,255,0.28)",fontFamily:MONO,textTransform:"uppercase",letterSpacing:"1px",flexShrink:0}}>Tags:</span>
          {CATS.map(c=>(
            <div key={c.key} style={{display:"inline-flex",alignItems:"center",gap:3,background:c.color,borderRadius:3,padding:"2px 6px"}}>
              <span style={{fontSize:8,color:"#fff",fontWeight:700,fontFamily:MONO,textTransform:"uppercase",letterSpacing:.4}}>{c.label}</span>
            </div>
          ))}
          <span style={{marginLeft:"auto",fontSize:7.5,color:"rgba(255,255,255,0.22)",fontFamily:MONO}}>Click Customer Segment → Story Tracer</span>
        </div>
      )}
    </header>
  );
}

/* ─────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────── */
function Toast({msg,show}){
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:600,background:"rgba(8,12,24,0.97)",border:"1px solid rgba(60,100,170,0.85)",color:"#e8eef8",padding:"10px 15px 10px 11px",borderRadius:9,fontSize:11.5,fontWeight:500,display:"flex",alignItems:"center",gap:9,boxShadow:"0 8px 32px rgba(0,0,0,.55)",transform:show?"translateY(0)":"translateY(10px)",opacity:show?1:0,transition:"opacity .2s,transform .2s",pointerEvents:"none"}}>
      <div style={{width:3,height:28,background:Y,borderRadius:99,flexShrink:0,boxShadow:`0 0 8px ${Y}80`}}/>
      {msg}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CANVAS LAYOUT
───────────────────────────────────────────────────────── */
function CanvasLayout({state,drawerOpen,openAdd,openEdit,handleDelete,openStory,activeSegId,setActiveSegId,setDrawerOpen,onSaveNote}){
  const w=useWW(); const mob=w<640; const tab=w<1024;
  const C=(sid)=><SectionCard sid={sid} entries={state[sid]??[]} onAdd={()=>openAdd(sid)} onEdit={openEdit} onDelete={handleDelete} onSegClick={openStory}/>;

  const DesktopGrid=()=>(
    <>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:7,marginBottom:8}}>
        {[["① Partners",""],["② Operations",""],["③ Value",Y],["④ Customers",""],["⑤ Segments",""]].map(([lbl,hi],i)=>(
          <div key={i} style={{textAlign:"center",fontSize:8,fontFamily:MONO,color:hi?Y:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:".9px",padding:"4px 0",background:"rgba(255,255,255,0.025)",border:`1px solid ${hi?"rgba(255,209,0,0.3)":"rgba(30,52,90,0.38)"}`,borderRadius:4,boxShadow:hi?"0 0 10px rgba(255,209,0,0.1)":"none"}}>{lbl}</div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1.1fr 1fr 1fr",gridTemplateRows:"minmax(210px,1fr) minmax(210px,1fr) minmax(140px,auto)",gap:8}}>
        <div style={{gridColumn:"1/2",gridRow:"1/3"}}>{C("kp")}</div>
        <div style={{gridColumn:"2/3",gridRow:"1/2"}}>{C("ka")}</div>
        <div style={{gridColumn:"3/4",gridRow:"1/3"}}>{C("vp")}</div>
        <div style={{gridColumn:"4/5",gridRow:"1/2"}}>{C("cr")}</div>
        <div style={{gridColumn:"5/6",gridRow:"1/3"}}>{C("cs")}</div>
        <div style={{gridColumn:"2/3",gridRow:"2/3"}}>{C("kr")}</div>
        <div style={{gridColumn:"4/5",gridRow:"2/3"}}>{C("ch")}</div>
        <div style={{gridColumn:"1/4",gridRow:"3/4"}}>{C("cost")}</div>
        <div style={{gridColumn:"4/6",gridRow:"3/4"}}>{C("rev")}</div>
      </div>
      <div style={{marginTop:8,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {C("notes")}
        </div>
        <AIInsightsPanel state={state} onSaveNote={onSaveNote}/>
      </div>
    </>
  );

  const TabletGrid=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {[{label:"① Partners & Operations",sids:["kp","ka","kr"],a:"#60a5fa"},{label:"③ Value Propositions",sids:["vp"],a:Y},{label:"④ Customer Facing",sids:["cr","ch","cs"],a:"#22d3ee"},{label:"Financial",sids:["cost","rev"],a:"#4ade80"}].map(g=>(
        <div key={g.label}>
          <div style={{fontSize:8,fontFamily:MONO,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"1px",borderLeft:`2px solid ${g.a}`,paddingLeft:7,marginBottom:5}}>{g.label}</div>
          <div style={{display:"grid",gridTemplateColumns:g.sids.length>1?"1fr 1fr":"1fr",gap:8}}>
            {g.sids.map(sid=><div key={sid} style={{minHeight:160}}>{C(sid)}</div>)}
          </div>
        </div>
      ))}
      <div>
        <div style={{fontSize:8,fontFamily:MONO,color:"rgba(255,255,255,0.38)",textTransform:"uppercase",letterSpacing:"1px",borderLeft:"2px solid #fb923c",paddingLeft:7,marginBottom:5}}>💡 Brainstorm & Notes</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8}}>
          <div style={{minHeight:160}}>{C("notes")}</div>
          <AIInsightsPanel state={state} onSaveNote={onSaveNote}/>
        </div>
      </div>
    </div>
  );

  const MobileStack=()=>(
    <div style={{display:"flex",flexDirection:"column",gap:7}}>
      {["kp","ka","kr","vp","cr","ch","cs","cost","rev"].map(sid=>
        <div key={sid} style={{minHeight:150}}>{C(sid)}</div>
      )}
      <div style={{minHeight:100}}>{C("notes")}</div>
      <AIInsightsPanel state={state} onSaveNote={onSaveNote}/>
    </div>
  );

  return(
    <div style={{display:"grid",gridTemplateColumns:drawerOpen&&!tab?"1fr 380px":"1fr",transition:"grid-template-columns .3s ease",position:"relative",zIndex:1,alignItems:"start"}}>
      <main style={{padding:mob?"10px 10px 48px":"14px 16px 48px",overflow:"hidden",minWidth:0}}>
        {!tab&&<DesktopGrid/>}
        {tab&&!mob&&<TabletGrid/>}
        {mob&&<MobileStack/>}
      </main>
      {drawerOpen&&(tab?(
        <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(6px)",display:"flex",flexDirection:"column",justifyContent:"flex-end"}} onClick={e=>{if(e.target===e.currentTarget)setDrawerOpen(false);}}>
          <div style={{height:"82vh",background:"rgba(4,7,16,0.98)",borderTop:"1px solid rgba(30,52,90,0.7)",borderRadius:"18px 18px 0 0",overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <StoryDrawer state={state} activeSegId={activeSegId} onSelectSeg={setActiveSegId} onClose={()=>setDrawerOpen(false)}/>
          </div>
        </div>
      ):(
        <StoryDrawer state={state} activeSegId={activeSegId} onSelectSeg={setActiveSegId} onClose={()=>setDrawerOpen(false)}/>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────── */
export default function App(){
  useEffect(()=>{
    const s=document.createElement("style");
    s.textContent=GCSS;
    document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);

  const [state,setState]=useState(DEMO);
  const [canvasTitle,setCanvasTitle]=useState(LOCALE.canvasTitle||"");
  const [modal,setModal]=useState({open:false,sid:"vp",editEntry:null});
  const [importOpen,setImportOpen]=useState(false);
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [activeSegId,setActiveSegId]=useState(null);
  const [toast,setToast]=useState({msg:"",show:false});
  const toastTimer=useRef(null);

  const showToast=useCallback(msg=>{
    setToast({msg,show:true});
    clearTimeout(toastTimer.current);
    toastTimer.current=setTimeout(()=>setToast(t=>({...t,show:false})),2500);
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

  /* IMPORT */
  const handleImport=(newState, mode)=>{
    if(mode==="replace"){
      setState(newState);
      showToast(`Canvas replaced — ${Object.values(newState).flat().length} entries imported`);
    } else {
      setState(prev=>{
        const merged={};
        Object.keys(SECTIONS).forEach(k=>{
          const existing=prev[k]??[];
          const incoming=newState[k]??[];
          merged[k]=[...existing,...incoming];
        });
        return merged;
      });
      showToast(`${Object.values(newState).flat().length} entries merged into canvas`);
    }
  };

  /* EXPORT */
  const handleExport=useCallback(()=>{
    const data=buildExport(state, canvasTitle||"ACCA BMC Export");
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=`bmc-${(canvasTitle||"export").replace(/\s+/g,"-").toLowerCase()}-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("Canvas exported as JSON");
  },[state,canvasTitle,showToast]);

  const all=Object.values(state).flat();
  const filled=Object.keys(SECTIONS).filter(k=>k!=="notes"&&(state[k]?.length||0)>0).length;
  const pct=Math.round((filled/9)*100);

  const kpis=[
    {v:all.length,                                     l:"Total Entries", c:"#60a5fa"},
    {v:`${filled}/9`,                                  l:"BMC Sections",  c:"#4ade80"},
    {v:all.filter(e=>e.cat==="critical").length,       l:"Critical",      c:"#ef4444"},
    {v:all.filter(e=>e.cat==="opportunity").length,    l:"Opps",          c:"#60a5fa"},
    {v:(state.cs??[]).length,                          l:"Segments",      c:Y        },
    {v:(state.notes??[]).length,                       l:"Ideas",         c:"#fb923c"},
  ];

  return(
    <div style={{fontFamily:"'Inter',sans-serif",background:"#06090f",color:"#e8eef8",minHeight:"100vh",position:"relative"}}>
      <BimBg/>
      <HeroHeader kpis={kpis} pct={pct} drawerOpen={drawerOpen} canvasTitle={canvasTitle}
        onToggleDrawer={()=>{setDrawerOpen(v=>!v);if(!drawerOpen)setActiveSegId(null);}}
        onAddEntry={()=>openAdd("vp")}
        onImport={()=>setImportOpen(true)}
        onExport={handleExport}/>
      <CanvasLayout state={state} drawerOpen={drawerOpen} openAdd={openAdd} openEdit={openEdit}
        handleDelete={handleDelete} openStory={openStory} activeSegId={activeSegId}
        setActiveSegId={setActiveSegId} setDrawerOpen={setDrawerOpen}
        onSaveNote={(text,cat)=>{
          setState(prev=>{
            const arr=[...(prev.notes??[])];
            arr.push({id:mkId(),text,cat:cat||"opportunity",segs:[],ts:Date.now(),author:"AI Insight"});
            return{...prev,notes:arr};
          });
          showToast("AI insight saved to Notes");
        }}/>
      <Modal open={modal.open} onClose={closeModal} onSave={handleSave} sid={modal.sid} editEntry={modal.editEntry} allSegs={state.cs??[]}/>
      <ImportModal open={importOpen} onClose={()=>setImportOpen(false)} onImport={handleImport}/>
      <Toast msg={toast.msg} show={toast.show}/>
    </div>
  );
}
