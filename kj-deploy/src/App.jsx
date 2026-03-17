import { useState, useEffect, useCallback, useRef } from "react";
import { loadS, saveS } from "./storage";

// ── URL Map from Retailer Dashboard ──
const URL_MAP = {
  "w1": "https://www.pureformulas.com/search?q=pure+encapsulations+b12+sublingual",
  "w2": "https://www.pureformulas.com/product/gi-revive-by-designs-for-health/1000000702",
  "w3": "https://thechange.co",
  "w4": "https://www.pureformulas.com/search?q=seeking+health+saccharomyces+boulardii",
  "w5": "https://www.pureformulas.com/search?q=jarrow+lactoferrin",
  "pw1": "https://nutridyn.com/dynamic-multi-collagen-renew",
  "po1": "https://www.transparentlabs.com/products/proteinseries-100-grass-fed-whey-protein-isolate",
  "po2": "https://www.transparentlabs.com/products/creatine-hmb",
  "po3": "https://www.pureformulas.com/search?q=pure+encapsulations+l-glutamine+powder",
  "po4": "https://www.pureformulas.com/search?q=pure+encapsulations+taurine",
  "po5": "https://www.pureformulas.com/search?q=thorne+myo-inositol",
  "po6": "https://www.pureformulas.com/search?q=thorne+fibermend",
  "b1": "https://www.visbiome.com/products/visbiome-unflavored",
  "b2": "https://www.pureformulas.com/product/osteo-k-minis/1000035962",
  "b3": "https://www.pureformulas.com/search?q=bodybio+phosphatidylcholine",
  "b4": "https://www.pureformulas.com/search?q=integrative+therapeutics+active+b+complex",
  "b5": "https://www.pureformulas.com/search?q=designs+for+health+digestzymes",
  "l2": "https://www.pureformulas.com/search?q=designs+for+health+d-evail+supreme",
  "l3": "https://www.pureformulas.com/search?q=pure+encapsulations+selenium+200",
  "l4": "https://www.algaecal.com/algaecal-plus/",
  "l5": "https://www.pureformulas.com/search?q=designs+for+health+coqnol",
  "l6": "https://www.macuhealth.com/products/macuhealth-plus",
  "l7": "https://www.saffron2020.com",
  "l8": "https://www.pureformulas.com/search?q=bodybio+butyrate+calcium+magnesium",
  "l9": "https://www.pureformulas.com/search?q=designs+for+health+annatto",
  "l10": "https://www.pureformulas.com/search?q=pure+encapsulations+zinc+picolinate",
  "l11": "https://www.pureformulas.com/search?q=seeking+health+molybdenum",
  "l12": "https://www.pureformulas.com/search?q=pure+encapsulations+calcium+d-glucarate",
  "l13": "https://www.pureformulas.com/search?q=bodybio+phosphatidylcholine",
  "l14": "https://www.pureformulas.com/search?q=designs+for+health+digestzymes",
  "pi1": "https://www.pureformulas.com/product/gi-revive-by-designs-for-health/1000000702",
  "pi2": "https://www.pureformulas.com/search?q=seeking+health+saccharomyces+boulardii",
  "ir1": "https://www.pureformulas.com/search?q=designs+for+health+ferrochel",
  "ir2": "https://www.pureformulas.com/search?q=livon+liposomal+vitamin+c",
  "d2": "https://www.pureformulas.com/search?q=nordic+naturals+ultimate+omega+d3+minis",
  "d3": "https://www.pureformulas.com/search?q=bodybio+butyrate+calcium+magnesium",
  "d4": "https://www.pureformulas.com/search?q=pure+encapsulations+nac+600",
  "d5": "https://www.pureformulas.com/search?q=designs+for+health+annatto",
  "d6": "https://bioptimizers.com/products/magnesium-breakthrough",
  "d7": "https://www.pureformulas.com/search?q=thorne+pharmagaba",
  "d8": "https://thechange.co",
  "d9": "https://www.pureformulas.com/search?q=designs+for+health+digestzymes",
  "bt1": "https://www.lemmelive.com/products/sleep",
  "bt3": "https://donotage.org/products/pure-tmg",
  "prn1": "https://drinklmnt.com",
  "prn2": "https://www.pureformulas.com/search?q=integrative+therapeutics+heartburn+advantage",
  "prn3": "https://www.pureformulas.com/search?q=cranberry+extract+500mg",
};

const DEFAULT_PROTOCOL = [
  { id: "wake", name: "WAKE — Empty Stomach", time: "6:00 AM", sortOrder: 0, items: [
    { id: "w1", name: "Sublingual B12 (methyl + adenosyl)", brand: "Pure Encapsulations", notes: "Hold 60–90 sec under tongue", checked: false, url: URL_MAP["w1"], isRx: false },
    { id: "w2", name: "GI Revive Powder — Dose 1/2", brand: "Designs for Health", notes: "1 scoop in room-temp water", checked: false, url: URL_MAP["w2"], isRx: false },
    { id: "w3", name: "Colostrum Gold Standard — AM", brand: "The Change", notes: "2 caps", checked: false, url: URL_MAP["w3"], isRx: false },
    { id: "w4", name: "S. boulardii — Dose 1/2", brand: "Seeking Health", notes: "1 cap (5B CFU)", checked: false, url: URL_MAP["w4"], isRx: false },
    { id: "w5", name: "Lactoferrin 250mg", brand: "Jarrow Formulas", notes: "1 cap", checked: false, url: URL_MAP["w5"], isRx: false },
  ]},
  { id: "preworkout", name: "PRE-WORKOUT — Coffee", time: "6:30 AM", sortOrder: 1, items: [
    { id: "pw1", name: "Collagen (GELITA 4-Type)", brand: "NutriDyn / Momentous", notes: "1 scoop (17.5g) in iced coffee", checked: false, url: URL_MAP["pw1"], isRx: false },
  ]},
  { id: "postworkout", name: "POST-WORKOUT SMOOTHIE", time: "7:30 AM", sortOrder: 2, items: [
    { id: "po1", name: "Whey Protein Isolate", brand: "Transparent Labs", notes: "1 scoop (~28g protein)", checked: false, url: URL_MAP["po1"], isRx: false },
    { id: "po2", name: "Creatine HMB", brand: "Transparent Labs", notes: "1 scoop (5g creatine + 1.5g HMB)", checked: false, url: URL_MAP["po2"], isRx: false },
    { id: "po3", name: "L-Glutamine 5g", brand: "Pure Encapsulations", notes: "5g in smoothie", checked: false, url: URL_MAP["po3"], isRx: false },
    { id: "po4", name: "Taurine 1–3g", brand: "Pure Encapsulations", notes: "1–3g in smoothie", checked: false, url: URL_MAP["po4"], isRx: false },
    { id: "po5", name: "Myo-Inositol (Ovarian Care)", brand: "Thorne", notes: "1 scoop in smoothie", checked: false, url: URL_MAP["po5"], isRx: false },
    { id: "po6", name: "FiberMend (PHGG Sunfiber)", brand: "Thorne", notes: "1 scoop (start ½ scoop wk 1)", checked: false, url: URL_MAP["po6"], isRx: false },
  ]},
  { id: "breakfast", name: "BREAKFAST — With Food", time: "8:30 AM", sortOrder: 3, items: [
    { id: "b1", name: "Visbiome 450B CFU", brand: "Visbiome", notes: "½–1 pkt in yogurt", checked: false, url: URL_MAP["b1"], isRx: false, alert: "Cold-chain required. Keep refrigerated. Separate from smoothie." },
    { id: "b2", name: "Osteo-K Minis — AM", brand: "NBI Health", notes: "2 caps (MK-4 45mg + Ca 400mg + D3 2000IU)", checked: false, url: URL_MAP["b2"], isRx: false },
    { id: "b3", name: "Phosphatidylcholine — Dose 1", brand: "BodyBio", notes: "~650mg with breakfast", checked: false, url: URL_MAP["b3"], isRx: false },
    { id: "b4", name: "Active B-Complex", brand: "Integrative Therapeutics", notes: "2 caps", checked: false, url: URL_MAP["b4"], isRx: false },
    { id: "b5", name: "Digestzymes + Bitters", brand: "DFH / Urban Moonshine", notes: "With protein/fat meal", checked: false, url: URL_MAP["b5"], isRx: false },
  ]},
  { id: "lunch", name: "LUNCH — With Food", time: "12:00 PM", sortOrder: 4, items: [
    { id: "l1", name: "Bone Broth (TCM recipe)", brand: "Homemade", notes: "1 cup with lunch", checked: false, url: "", isRx: false },
    { id: "l2", name: "D-Evail Supreme", brand: "Designs for Health", notes: "1 softgel (D3 5000IU + K1 + K2 + GG)", checked: false, url: URL_MAP["l2"], isRx: false },
    { id: "l3", name: "Selenium 200mcg", brand: "Pure Encapsulations", notes: "1 cap", checked: false, url: URL_MAP["l3"], isRx: false },
    { id: "l4", name: "AlgaeCal Plus", brand: "AlgaeCal", notes: "4 caps (~400mg Ca + Mg + boron)", checked: false, url: URL_MAP["l4"], isRx: false },
    { id: "l5", name: "CoQnol 200mg + PQQ 20mg", brand: "Designs for Health", notes: "1 softgel + 1 lozenge", checked: false, url: URL_MAP["l5"], isRx: false },
    { id: "l6", name: "MacuHealth Plus+", brand: "MacuHealth", notes: "1 softgel", checked: false, url: URL_MAP["l6"], isRx: false },
    { id: "l7", name: "Saffron 2020 Pro", brand: "Saffron 2020", notes: "1 cap (saffron 20mg + resveratrol 10mg)", checked: false, url: URL_MAP["l7"], isRx: false },
    { id: "l8", name: "BodyBio Butyrate — Dose 1", brand: "BodyBio", notes: "2 caps", checked: false, url: URL_MAP["l8"], isRx: false },
    { id: "l9", name: "Annatto-E GG (DeltaGold) — Dose 1", brand: "Designs for Health", notes: "1 cap (tocotrienols + GG 150mg)", checked: false, url: URL_MAP["l9"], isRx: false },
    { id: "l10", name: "Zinc Picolinate 25–30mg", brand: "Pure Encapsulations", notes: "1 cap (4+ hrs from iron)", checked: false, url: URL_MAP["l10"], isRx: false },
    { id: "l11", name: "Molybdenum 500mcg", brand: "Seeking Health", notes: "1 cap — H₂S detox", checked: false, url: URL_MAP["l11"], isRx: false },
    { id: "l12", name: "Calcium D-Glucarate 1,000mg", brand: "Pure Encapsulations", notes: "1 cap — β-glucuronidase inhibitor, pre-HRT", checked: false, url: URL_MAP["l12"], isRx: false },
    { id: "l13", name: "Phosphatidylcholine — Dose 2", brand: "BodyBio", notes: "~650mg with lunch", checked: false, url: URL_MAP["l13"], isRx: false },
    { id: "l14", name: "Digestzymes + Bitters", brand: "DFH / Urban Moonshine", notes: "With protein/fat meal", checked: false, url: URL_MAP["l14"], isRx: false },
  ]},
  { id: "afternoon", name: "3:00 PM — LAST CAFFEINE", time: "3:00 PM", sortOrder: 5, items: [
    { id: "a1", name: "Green Tea / Matcha", brand: "—", notes: "Last caffeinated drink of day", checked: false, url: "", isRx: false },
  ]},
  { id: "preiron", name: "4:15 PM — Empty Stomach", time: "4:15 PM", sortOrder: 6, items: [
    { id: "pi1", name: "GI Revive Powder — Dose 2/2", brand: "Designs for Health", notes: "1 scoop in room-temp water", checked: false, url: URL_MAP["pi1"], isRx: false },
    { id: "pi2", name: "S. boulardii — Dose 2/2", brand: "Seeking Health", notes: "1 cap (5B CFU)", checked: false, url: URL_MAP["pi2"], isRx: false },
  ]},
  { id: "iron", name: "4:45 PM — IRON WINDOW", time: "4:45 PM", sortOrder: 7, items: [
    { id: "ir1", name: "Ferrochel Iron 27mg", brand: "Designs for Health", notes: "1 cap WITH Liposomal C + small OJ", checked: false, url: URL_MAP["ir1"], isRx: false, alert: "5+ hrs before Tirosint. 4+ hrs from zinc/calcium." },
    { id: "ir2", name: "Liposomal Vitamin C 1,000mg", brand: "LivOn Labs", notes: "1 packet WITH Ferrochel", checked: false, url: URL_MAP["ir2"], isRx: false },
  ]},
  { id: "dinner", name: "DINNER — With Food", time: "5:30 PM", sortOrder: 8, items: [
    { id: "d1", name: "Bone Broth (TCM recipe)", brand: "Homemade", notes: "1 cup with dinner", checked: false, url: "", isRx: false },
    { id: "d2", name: "Nordic Naturals Omega D3 Minis", brand: "Nordic Naturals", notes: "4 softgels", checked: false, url: URL_MAP["d2"], isRx: false },
    { id: "d3", name: "BodyBio Butyrate — Dose 2", brand: "BodyBio", notes: "2 caps", checked: false, url: URL_MAP["d3"], isRx: false },
    { id: "d4", name: "NAC 600mg", brand: "Pure Encapsulations", notes: "1 cap", checked: false, url: URL_MAP["d4"], isRx: false },
    { id: "d5", name: "Annatto-E GG (DeltaGold) — Dose 2", brand: "Designs for Health", notes: "1 cap", checked: false, url: URL_MAP["d5"], isRx: false },
    { id: "d6", name: "Magnesium Breakthrough", brand: "BiOptimizers", notes: "Per label (7-form Mg)", checked: false, url: URL_MAP["d6"], isRx: false },
    { id: "d7", name: "PharmaGABA 100mg", brand: "Thorne", notes: "1 cap — Sleep/MMC/HRV", checked: false, url: URL_MAP["d7"], isRx: false },
    { id: "d8", name: "Colostrum Gold Standard — PM", brand: "The Change", notes: "2 caps", checked: false, url: URL_MAP["d8"], isRx: false },
    { id: "d9", name: "Digestzymes + Bitters", brand: "DFH / Urban Moonshine", notes: "With protein/fat meal", checked: false, url: URL_MAP["d9"], isRx: false },
  ]},
  { id: "bedtime", name: "BEFORE BED", time: "9:45 PM", sortOrder: 9, items: [
    { id: "bt1", name: "Lemme Sleep", brand: "Lemme", notes: "1 gummy at 8:30–9:00 PM", checked: false, url: URL_MAP["bt1"], isRx: false },
    { id: "bt2", name: "Tirosint", brand: "PRESCRIPTION", notes: "Levothyroxine at 10:00–10:30 PM (TBD dose)", checked: false, url: "", isRx: true, alert: "Empty stomach. 4+ hrs after calcium, iron, magnesium. 3+ hrs after last meal." },
    { id: "bt3", name: "DoNotAge Pure TMG", brand: "DoNotAge", notes: "2 caps (1,000mg) with Tirosint", checked: false, url: URL_MAP["bt3"], isRx: false },
    { id: "rx2", name: "Progesterone (Micronized)", brand: "PRESCRIPTION", notes: "Dose TBD — pending HRT initiation", checked: false, url: "", isRx: true, alert: "Take at bedtime. Causes drowsiness." },
  ]},
  { id: "prn", name: "AS NEEDED (PRN)", time: "Any", sortOrder: 10, items: [
    { id: "prn1", name: "Electrolytes (LMNT / Catalyte)", brand: "LMNT / Thorne", notes: "Throughout day, away from iron", checked: false, url: URL_MAP["prn1"], isRx: false },
    { id: "prn2", name: "Heartburn Advantage", brand: "Integrative Therapeutics", notes: "As needed (zinc carnosine + DGL + ginger)", checked: false, url: URL_MAP["prn2"], isRx: false },
    { id: "prn3", name: "Cranberry Extract 500mg", brand: "—", notes: "Smoothie or caps — suppress R. gnavus", checked: false, url: URL_MAP["prn3"], isRx: false },
    { id: "prn4", name: "Ground Flaxseed 2–3 tbsp", brand: "—", notes: "Fiber diversity + lignan prebiotics", checked: false, url: "", isRx: false },
  ]},
  { id: "weekly", name: "WEEKLY — Hormones & GLP-1", time: "Per Schedule", sortOrder: 12, items: [
    { id: "rx1", name: "Estrogen (Estradiol Patch)", brand: "PRESCRIPTION", notes: "2x/week — change days TBD per provider", checked: false, url: "", isRx: true, startDate: "", retestDate: "" },
    { id: "rx3", name: "Testosterone", brand: "PRESCRIPTION", notes: "Dose TBD — pending labs", checked: false, url: "", isRx: true, alert: "Apply to inner arm/thigh. Wash hands after.", startDate: "", retestDate: "" },
    { id: "rx4", name: "GLP-1 Agonist (Tirzepatide)", brand: "PRESCRIPTION", notes: "1x/week — injection day TBD", checked: false, url: "", isRx: true, startDate: "2026-08-01", retestDate: "" },
  ]},
];

const DEFAULT_LIFESTYLE = [
  { id: "lf1", name: "Morning Workout", notes: "", checked: false },
  { id: "lf2", name: "Meal 1 — Breakfast", notes: "≥40g protein, 10g+ fat", checked: false },
  { id: "lf3", name: "Meal 2 — Lunch", notes: "Bone broth + fat-soluble supps", checked: false },
  { id: "lf4", name: "Meal 3 — Dinner", notes: "No calcium at dinner", checked: false },
];

const DEFAULT_MACRO_TARGETS = [
  { id: "mt1", key: "kcals", label: "Kcals", target: 1650, unit: "" },
  { id: "mt2", key: "protein", label: "Protein", target: 140, unit: "g" },
  { id: "mt3", key: "carbs", label: "Carbs", target: null, unit: "g" },
  { id: "mt4", key: "fat", label: "Fat", target: null, unit: "g" },
  { id: "mt5", key: "fiber", label: "Fiber", target: 40, unit: "g" },
  { id: "mt6", key: "water", label: "Water", target: 2.75, unit: "L" },
];

const todayStr = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 8);
const fmtDisp = (iso) => { if (!iso) return ""; const [y, m, d] = iso.split("-"); return `${m}/${d}/${y.slice(2)}`; };
const UNDO_MS = 8000;

const SK = { protocol: "kj-p10", lifestyle: "kj-lf10", dayPrefix: "kj-d10:", archiveIndex: "kj-i10", macroTargets: "kj-mt10", dietNotes: "kj-dn10" };
const CALS_PER = { protein: 4, carbs: 4, fat: 9 };
function getDIM(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFDOW(y, m) { return new Date(y, m, 1).getDay(); }
function fmtD(y, m, d) { return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }

export default function App() {
  const [view, setView] = useState("today");
  const [protocol, setProtocol] = useState(null);
  const [lifestyle, setLifestyle] = useState(null);
  const [macroTargets, setMacroTargets] = useState(null);
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [dayData, setDayData] = useState(null);
  const [activeDate, setActiveDate] = useState(todayStr());
  const [archiveIndex, setArchiveIndex] = useState([]);
  const [archiveComp, setArchiveComp] = useState({});
  const [collapsed, setCollapsed] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showCal, setShowCal] = useState(false);
  const [calMonth, setCalMonth] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [editItem, setEditItem] = useState(null);
  const [editBlockId, setEditBlockId] = useState(null);
  const [editLfItem, setEditLfItem] = useState(null);
  const [ouraData, setOuraData] = useState(null);
  const [undoAction, setUndoAction] = useState(null);
  const [orderSearch, setOrderSearch] = useState("");
  const undoRef = useRef(null);
  const fileRef = useRef(null);

  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2000); };
  const showUndo = (label, fn) => { if (undoRef.current) clearTimeout(undoRef.current); setUndoAction({ label, restore: fn }); undoRef.current = setTimeout(() => setUndoAction(null), UNDO_MS); };
  const doUndo = async () => { if (!undoAction) return; if (undoRef.current) clearTimeout(undoRef.current); await undoAction.restore(); setUndoAction(null); flash("Restored"); };
  const killUndo = () => { if (undoRef.current) clearTimeout(undoRef.current); setUndoAction(null); };

  const calcComp = (d) => { if (!d) return 0; let t = 0, n = 0; const td = todayStr(); d.blocks?.forEach(b => { const ai = b.items.filter(i => !i.startDate || i.startDate <= td); t += ai.length; n += ai.filter(i => i.checked).length; }); d.lifestyle?.forEach(i => { t++; if (i.checked) n++; }); return t === 0 ? 0 : Math.round((n / t) * 100); };
  const suppCt = (d) => { if (!d) return { done: 0, total: 0 }; let t = 0, n = 0; const td = todayStr(); d.blocks?.forEach(b => { const ai = b.items.filter(i => !i.startDate || i.startDate <= td); t += ai.length; n += ai.filter(i => i.checked).length; }); return { done: n, total: t }; };

  function buildDay(date, proto, life, mt) {
    const macros = {}; (mt || DEFAULT_MACRO_TARGETS).forEach(m => { macros[m.key] = ""; });
    return { date, blocks: proto.map(b => ({ ...b, items: b.items.map(it => ({ ...it, checked: false })) })), lifestyle: life.map(it => ({ ...it, checked: false })), macros, workout: { type: "", duration: "", notes: "" }, oura: { sleepScore: "", hrv: "", readiness: "", bodyTemp: "" }, notes: "" };
  }

  useEffect(() => {
    (async () => {
      let proto = await loadS(SK.protocol, DEFAULT_PROTOCOL);
      if (!proto.find(b => b.id === "wake")) { proto = [DEFAULT_PROTOCOL[0], ...proto]; await saveS(SK.protocol, proto); }
      if (!proto.find(b => b.id === "weekly")) { const wk = DEFAULT_PROTOCOL.find(b => b.id === "weekly"); if (wk) { proto = [...proto, wk]; await saveS(SK.protocol, proto); } }
      // Remove old standalone rx/am_rx blocks if present
      const removeIds = ["rx", "am_rx"]; if (proto.some(b => removeIds.includes(b.id))) { proto = proto.filter(b => !removeIds.includes(b.id)); await saveS(SK.protocol, proto); }
      let ns = false;
      proto = proto.map(b => ({ ...b, items: b.items.map(it => { if (it.url === undefined) { ns = true; return { ...it, url: URL_MAP[it.id] || "" }; } if (it.isRx === undefined) { ns = true; return { ...it, isRx: it.brand === "PRESCRIPTION" }; } return it; }) }));
      if (ns) await saveS(SK.protocol, proto);
      const life = await loadS(SK.lifestyle, DEFAULT_LIFESTYLE);
      const mt = await loadS(SK.macroTargets, DEFAULT_MACRO_TARGETS);
      const dn = await loadS(SK.dietNotes, "No gluten, no alcohol during gut heal phase.\nNo gluten reintroduction until zonulin <175.");
      const idx = await loadS(SK.archiveIndex, []);
      setProtocol(proto); setLifestyle(life); setMacroTargets(mt); setDietaryNotes(dn); setArchiveIndex(idx);
      const comps = {}; for (const dt of idx) { const dd = await loadS(SK.dayPrefix + dt, null); if (dd) comps[dt] = calcComp(dd); }
      setArchiveComp(comps);
      const today = todayStr();
      let ex = await loadS(SK.dayPrefix + today, null);
      if (!ex) { ex = buildDay(today, proto, life, mt); await saveS(SK.dayPrefix + today, ex); if (!idx.includes(today)) { const ni = [today, ...idx].sort().reverse(); setArchiveIndex(ni); await saveS(SK.archiveIndex, ni); } }
      else if (!ex.blocks.find(b => b.id === "wake")) { const wb = DEFAULT_PROTOCOL[0]; ex = { ...ex, blocks: [{ ...wb, items: wb.items.map(it => ({ ...it, checked: false })) }, ...ex.blocks] }; await saveS(SK.dayPrefix + today, ex); }
      setDayData(ex); setActiveDate(today); setLoading(false);
    })();
  }, []);

  const goToDate = useCallback(async (date) => {
    let dd = await loadS(SK.dayPrefix + date, null);
    if (!dd) { dd = buildDay(date, protocol, lifestyle, macroTargets); await saveS(SK.dayPrefix + date, dd); if (!archiveIndex.includes(date)) { const ni = [date, ...archiveIndex].sort().reverse(); setArchiveIndex(ni); await saveS(SK.archiveIndex, ni); } }
    // Ensure macros has all keys from current targets
    const mc = { ...dd.macros }; macroTargets.forEach(m => { if (mc[m.key] === undefined) mc[m.key] = ""; }); dd = { ...dd, macros: mc };
    setDayData(dd); setActiveDate(date); setShowCal(false); setView("today");
  }, [protocol, lifestyle, archiveIndex, macroTargets]);

  const persistDay = useCallback(async (d) => {
    setDayData(d); await saveS(SK.dayPrefix + d.date, d); setArchiveComp(p => ({ ...p, [d.date]: calcComp(d) }));
    if (!archiveIndex.includes(d.date)) { const ni = [d.date, ...archiveIndex].sort().reverse(); setArchiveIndex(ni); await saveS(SK.archiveIndex, ni); }
  }, [archiveIndex]);

  const toggleItem = (bid, iid) => { persistDay({ ...dayData, blocks: dayData.blocks.map(b => b.id === bid ? { ...b, items: b.items.map(it => it.id === iid ? { ...it, checked: !it.checked } : it) } : b) }); };
  const toggleLf = (iid) => { persistDay({ ...dayData, lifestyle: dayData.lifestyle.map(it => it.id === iid ? { ...it, checked: !it.checked } : it) }); };
  const updateMacro = (k, v) => persistDay({ ...dayData, macros: { ...dayData.macros, [k]: v } });
  const updateOura = (f, v) => persistDay({ ...dayData, oura: { ...dayData.oura, [f]: v } });
  const updateWorkout = (f, v) => persistDay({ ...dayData, workout: { ...dayData.workout, [f]: v } });
  const updateNotes = (v) => persistDay({ ...dayData, notes: v });
  const toggleBlock = (id) => setCollapsed(p => ({ ...p, [id]: !p[id] }));

  // ── Supplement CRUD ──
  const saveItem = async (bid, item, isNew) => {
    const up = protocol.map(b => { if (b.id !== bid) return b; if (isNew) return { ...b, items: [...b.items, { ...item, id: uid(), checked: false }] }; return { ...b, items: b.items.map(it => it.id === item.id ? item : it) }; });
    setProtocol(up); await saveS(SK.protocol, up);
    persistDay({ ...dayData, blocks: up.map(b => { const ex = dayData.blocks.find(db => db.id === b.id); return { ...b, items: b.items.map(it => { const e = ex?.items.find(ei => ei.id === it.id); return e ? { ...it, checked: e.checked } : { ...it, checked: false }; }) }; }) });
    flash(isNew ? "Item added" : "Item updated");
  };
  const deleteItem = async (bid, iid) => {
    const prev = protocol.map(b => ({ ...b, items: [...b.items] })); const prevD = dayData.blocks.map(b => ({ ...b, items: [...b.items] })); const del = protocol.find(b => b.id === bid)?.items.find(it => it.id === iid);
    const up = protocol.map(b => b.id !== bid ? b : { ...b, items: b.items.filter(it => it.id !== iid) }); setProtocol(up); await saveS(SK.protocol, up);
    persistDay({ ...dayData, blocks: dayData.blocks.map(b => b.id !== bid ? b : { ...b, items: b.items.filter(it => it.id !== iid) }) });
    showUndo(`"${del?.name || "Item"}" deleted`, async () => { setProtocol(prev); await saveS(SK.protocol, prev); persistDay({ ...dayData, blocks: prevD }); });
  };
  const addBlock = async (name, time) => { const nb = { id: uid(), name, time, sortOrder: protocol.length, items: [] }; const up = [...protocol, nb]; setProtocol(up); await saveS(SK.protocol, up); persistDay({ ...dayData, blocks: [...dayData.blocks, { ...nb, items: [] }] }); flash("Block added"); };
  const updateBlockTime = async (bid, t) => { const up = protocol.map(b => b.id === bid ? { ...b, time: t } : b); setProtocol(up); await saveS(SK.protocol, up); persistDay({ ...dayData, blocks: dayData.blocks.map(b => b.id === bid ? { ...b, time: t } : b) }); flash("Time updated"); };
  const updateBlockName = async (bid, n) => { const up = protocol.map(b => b.id === bid ? { ...b, name: n } : b); setProtocol(up); await saveS(SK.protocol, up); persistDay({ ...dayData, blocks: dayData.blocks.map(b => b.id === bid ? { ...b, name: n } : b) }); flash("Name updated"); };
  const deleteBlock = async (bid) => {
    const prev = protocol.map(b => ({ ...b, items: [...b.items] })); const prevD = dayData.blocks.map(b => ({ ...b, items: [...b.items] })); const del = protocol.find(b => b.id === bid);
    setProtocol(protocol.filter(b => b.id !== bid)); await saveS(SK.protocol, protocol.filter(b => b.id !== bid));
    persistDay({ ...dayData, blocks: dayData.blocks.filter(b => b.id !== bid) });
    showUndo(`"${del?.name || "Block"}" deleted`, async () => { setProtocol(prev); await saveS(SK.protocol, prev); persistDay({ ...dayData, blocks: prevD }); });
  };

  // ── Lifestyle CRUD ──
  const saveLfItem = async (item, isNew) => {
    const up = isNew ? [...lifestyle, { ...item, id: uid(), checked: false }] : lifestyle.map(it => it.id === item.id ? item : it);
    setLifestyle(up); await saveS(SK.lifestyle, up);
    persistDay({ ...dayData, lifestyle: up.map(it => { const ex = dayData.lifestyle.find(e => e.id === it.id); return ex ? { ...it, checked: ex.checked } : { ...it, checked: false }; }) });
    flash(isNew ? "Lifestyle item added" : "Updated");
  };
  const deleteLfItem = async (iid) => {
    const prev = [...lifestyle]; const prevD = [...dayData.lifestyle]; const del = lifestyle.find(it => it.id === iid);
    const up = lifestyle.filter(it => it.id !== iid); setLifestyle(up); await saveS(SK.lifestyle, up);
    persistDay({ ...dayData, lifestyle: dayData.lifestyle.filter(it => it.id !== iid) });
    showUndo(`"${del?.name || "Item"}" deleted`, async () => { setLifestyle(prev); await saveS(SK.lifestyle, prev); persistDay({ ...dayData, lifestyle: prevD }); });
  };

  // ── Macro Targets CRUD ──
  const saveMacroTarget = async (item, isNew) => {
    const up = isNew ? [...macroTargets, { ...item, id: uid() }] : macroTargets.map(m => m.id === item.id ? item : m);
    setMacroTargets(up); await saveS(SK.macroTargets, up);
    // Ensure dayData macros has the new key
    if (isNew && dayData.macros[item.key] === undefined) { persistDay({ ...dayData, macros: { ...dayData.macros, [item.key]: "" } }); }
    flash(isNew ? "Macro added" : "Macro updated");
  };
  const deleteMacroTarget = async (mid) => {
    const up = macroTargets.filter(m => m.id !== mid); setMacroTargets(up); await saveS(SK.macroTargets, up); flash("Macro removed");
  };

  // ── Oura / Export ──
  const handleOura = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => { try { const lines = ev.target.result.split("\n"); const hdrs = lines[0].split(",").map(h => h.trim().toLowerCase()); const data = []; for (let i = 1; i < lines.length; i++) { if (!lines[i].trim()) continue; const vals = lines[i].split(","); const row = {}; hdrs.forEach((h, idx) => { row[h] = vals[idx]?.trim(); }); data.push(row); } setOuraData(data); const tr = data.find(r => r.date === activeDate || r.day === activeDate || r.summary_date === activeDate); if (tr) { persistDay({ ...dayData, oura: { sleepScore: tr.sleep_score || tr["total sleep score"] || dayData.oura.sleepScore, hrv: tr.average_hrv || tr.hrv || dayData.oura.hrv, readiness: tr.readiness_score || tr.readiness || dayData.oura.readiness, bodyTemp: tr.temperature_deviation || tr["body temperature"] || dayData.oura.bodyTemp } }); } flash(`Loaded ${data.length} days`); } catch { flash("CSV error"); } }; reader.readAsText(file); };
  const exportCSV = async () => { const mtKeys = macroTargets.map(m => m.key); let csv = "Date,Supp %,Lifestyle," + mtKeys.map(k => macroTargets.find(m => m.key === k)?.label || k).join(",") + ",Workout,Sleep,HRV,Readiness\n"; for (const date of archiveIndex) { const d = await loadS(SK.dayPrefix + date, null); if (!d) continue; const s = suppCt(d); const lc = d.lifestyle?.filter(i => i.checked).length || 0; const lt = d.lifestyle?.length || 0; csv += `${date},${s.total > 0 ? Math.round((s.done / s.total) * 100) : 0}%,${lc}/${lt},${mtKeys.map(k => d.macros?.[k] || "").join(",")},${d.workout?.type || ""},${d.oura?.sleepScore || ""},${d.oura?.hrv || ""},${d.oura?.readiness || ""}\n`; } const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `KJ_Protocol_${todayStr()}.csv`; a.click(); URL.revokeObjectURL(url); flash("Exported"); };

  if (loading || !dayData || !macroTargets) return <div style={S.loadScreen}><div style={{ fontSize: 15, opacity: 0.7 }}>Loading Protocol...</div></div>;

  const comp = calcComp(dayData); const sc = suppCt(dayData); const isToday = activeDate === todayStr();
  const UndoToast = undoAction ? <div style={S.undoBar}><span style={S.undoText}>{undoAction.label}</span><button style={S.undoBtn} onClick={doUndo}>UNDO</button><button style={S.undoDismiss} onClick={killUndo}>✕</button><div style={S.undoProgress}><div style={S.undoFill} /></div></div> : null;

  // ── EDIT SUPPLEMENT ──
  if (view === "editItem") return (<><EditItemView item={editItem} blockId={editBlockId} blocks={protocol} onSave={(bid, it, n) => { saveItem(bid, it, n); setView("settings"); }} onDelete={(bid, iid) => { deleteItem(bid, iid); setView("settings"); }} onCancel={() => setView("settings")} />{UndoToast}</>);

  // ── EDIT LIFESTYLE ──
  if (view === "editLf") return (<><EditLfView item={editLfItem} onSave={(it, n) => { saveLfItem(it, n); setView("settings"); }} onDelete={(iid) => { deleteLfItem(iid); setView("settings"); }} onCancel={() => setView("settings")} />{UndoToast}</>);

  // ── ORDER VIEW ──
  if (view === "order") {
    const today = todayStr();
    const seen = new Map(); const rxActive = []; const rxPending = []; const pendingSupps = [];
    protocol.forEach(block => { block.items.forEach(item => {
      const norm = item.name.replace(/\s*—\s*(Dose\s*\d+\/?\d*|AM|PM|Dose\s*\d+\s*of\s*\d+)$/i, "").trim();
      const isFuture = item.startDate && item.startDate > today;
      if (item.isRx) {
        const entry = { name: item.name, brand: item.brand, notes: item.notes, url: item.url || "", block: block.name, time: block.time, startDate: item.startDate || "", retestDate: item.retestDate || "" };
        if (isFuture) { if (!rxPending.find(r => r.name === norm)) rxPending.push(entry); }
        else { if (!rxActive.find(r => r.name === norm)) rxActive.push(entry); }
        return;
      }
      if (isFuture) { if (!pendingSupps.find(r => r.name === norm)) pendingSupps.push({ name: item.name, brand: item.brand, url: item.url || "", block: block.name, time: block.time, startDate: item.startDate }); return; }
      if (!seen.has(norm)) { seen.set(norm, { name: item.name, brand: item.brand, url: item.url || "", block: block.name, time: block.time }); }
      else { const ex = seen.get(norm); if (!ex.url && item.url) seen.set(norm, { ...ex, url: item.url }); }
    }); });
    let suppList = Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    rxActive.sort((a, b) => a.name.localeCompare(b.name));
    rxPending.sort((a, b) => a.name.localeCompare(b.name));
    pendingSupps.sort((a, b) => a.name.localeCompare(b.name));
    const allPending = [...pendingSupps.map(p => ({ ...p, isRx: false })), ...rxPending.map(p => ({ ...p, isRx: true }))];
    const q = orderSearch.toLowerCase();
    if (q) { suppList = suppList.filter(it => it.name.toLowerCase().includes(q) || it.brand.toLowerCase().includes(q)); }
    const filteredRx = q ? rxActive.filter(it => it.name.toLowerCase().includes(q) || it.brand.toLowerCase().includes(q)) : rxActive;
    const filteredPending = q ? allPending.filter(it => it.name.toLowerCase().includes(q) || it.brand.toLowerCase().includes(q)) : allPending;

    return (
      <div style={S.container}>
        <div style={S.hdr}><h1 style={S.hdrTitle}>Order & Prescriptions</h1><p style={S.hdrDate}>{suppList.length} supplements · {rxActive.length} active Rx · {allPending.length} pending</p><input style={{ ...S.inp, marginTop: 8 }} placeholder="Search..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} /></div>
        <div style={S.scroll}>
          <div style={S.orderSectionHdr}>Supplements</div>
          {suppList.map((item, i) => { const hl = !!item.url; const isPF = item.url?.includes("pureformulas"); const sc2 = isPF ? "#22c55e" : hl ? "#f59e0b" : "#475569"; const sl = isPF ? "PureFormulas" : hl ? "Direct" : ""; return (
            <div key={i} style={S.orderRow} onClick={() => { if (hl) window.open(item.url, "_blank"); }}>
              <div style={S.orderInfo}><span style={S.orderName}>{item.name}</span><span style={S.orderBrand}>{item.brand} · {item.time}</span></div>
              {hl ? <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ ...S.orderSrc, color: sc2 }}>{sl}</span><span style={{ ...S.orderIcon, background: sc2 }}>→</span></div> : <span style={S.orderNo}>No link</span>}
            </div>
          ); })}
          {suppList.length === 0 && <p style={S.empty}>No matches</p>}

          <div style={{ ...S.orderSectionHdr, color: "#a78bfa", borderTopColor: "rgba(167,139,250,0.15)" }}>Prescriptions — Active</div>
          {filteredRx.map((item, i) => (
            <div key={i} style={{ ...S.orderRow, borderColor: "rgba(167,139,250,0.15)" }}>
              <div style={S.orderInfo}><span style={S.orderName}>{item.name}</span><span style={S.orderBrand}>{item.notes}{item.retestDate ? ` · Retest: ${fmtDisp(item.retestDate)}` : ""}</span></div>
              <span style={{ fontSize: 10, color: "#a78bfa", fontWeight: 600 }}>℞</span>
            </div>
          ))}
          {filteredRx.length === 0 && <p style={S.empty}>No active prescriptions</p>}

          {(filteredPending.length > 0 || !q) && <>
            <div style={{ ...S.orderSectionHdr, color: "#f59e0b", borderTopColor: "rgba(245,158,11,0.15)" }}>Pending — Starts in Future</div>
            {filteredPending.map((item, i) => (
              <div key={i} style={{ ...S.orderRow, borderColor: "rgba(245,158,11,0.15)", opacity: 0.75 }}>
                <div style={S.orderInfo}>
                  <span style={S.orderName}>{item.name}{item.isRx && <span style={S.rxBadge}> ℞</span>}</span>
                  <span style={S.orderBrand}>{item.notes || item.brand} · Starts: {fmtDisp(item.startDate)}{item.retestDate ? ` · Retest: ${fmtDisp(item.retestDate)}` : ""}</span>
                </div>
                <span style={{ fontSize: 10, color: "#f59e0b", fontWeight: 600 }}>⏳</span>
              </div>
            ))}
            {filteredPending.length === 0 && <p style={S.empty}>No pending items</p>}
          </>}
          <div style={{ height: 80 }} />
        </div>
        <Nav view={view} setView={setView} />
      </div>
    );
  }

  // ── SETTINGS VIEW ──
  if (view === "settings") {
    return (
      <div style={S.container}>
        <div style={S.hdr}><h1 style={S.hdrTitle}>Settings</h1></div>
        <div style={S.scroll}>
          {/* Time Blocks */}
          <div style={S.card}><h3 style={S.cardTitle}>Time Blocks & Supplements</h3><p style={S.hint}>Tap time/name to edit. Tap item to edit/delete/set URL.</p>
            {protocol.map(block => (<SettingsBlock key={block.id} block={block} onTimeChange={t => updateBlockTime(block.id, t)} onNameChange={n => updateBlockName(block.id, n)} onDeleteBlock={() => deleteBlock(block.id)} onEditItem={item => { setEditItem(item); setEditBlockId(block.id); setView("editItem"); }} onAddItem={() => { setEditItem(null); setEditBlockId(block.id); setView("editItem"); }} />))}
            <AddBlockForm onAdd={addBlock} />
          </div>
          {/* Lifestyle */}
          <div style={S.card}><h3 style={S.cardTitle}>Lifestyle Checklist</h3><p style={S.hint}>Tap item to edit. These appear as daily checkboxes.</p>
            {lifestyle.map(item => (<div key={item.id} style={S.sItem} onClick={() => { setEditLfItem(item); setView("editLf"); }}><div style={{ flex: 1 }}><span style={S.itemName}>{item.name}</span>{item.notes && <span style={S.itemMeta}> · {item.notes}</span>}</div><span style={S.arrow}>›</span></div>))}
            <button style={S.addBtn} onClick={() => { setEditLfItem(null); setView("editLf"); }}>+ Add Lifestyle Item</button>
          </div>
          {/* Macro Targets */}
          <div style={S.card}><h3 style={S.cardTitle}>Macro Targets</h3><p style={S.hint}>Edit targets or add custom fields. Protein/carbs/fat validated against calorie target.</p>
            {macroTargets.map(m => (<MacroTargetRow key={m.id} item={m} onSave={it => saveMacroTarget(it, false)} onDelete={() => deleteMacroTarget(m.id)} />))}
            <AddMacroForm onAdd={it => saveMacroTarget(it, true)} existingKeys={macroTargets.map(m => m.key)} />
            <label style={{ ...S.lbl, marginTop: 14 }}>Dietary Notes</label>
            <textarea style={{ ...S.ta, minHeight: 60 }} value={dietaryNotes} onChange={e => { setDietaryNotes(e.target.value); saveS(SK.dietNotes, e.target.value); }} rows={3} placeholder="Protocol restrictions, reminders..." />
          </div>
          {/* Oura & Export */}
          <div style={S.card}><h3 style={S.cardTitle}>Oura Ring</h3><button style={S.btn} onClick={() => fileRef.current?.click()}>Upload Oura CSV</button><input ref={fileRef} type="file" accept=".csv" onChange={handleOura} style={{ display: "none" }} />{ouraData && <p style={S.hint}>{ouraData.length} days loaded</p>}</div>
          <div style={S.card}><h3 style={S.cardTitle}>Export</h3><button style={S.btn} onClick={exportCSV}>Download Full CSV</button></div>
          <div style={{ height: 80 }} />
        </div>
        <Nav view={view} setView={setView} />{UndoToast}{toast && !undoAction && <div style={S.toast}>{toast}</div>}
      </div>
    );
  }

  // ── ARCHIVE VIEW ──
  if (view === "archive") {
    return (<div style={S.container}><div style={S.hdr}><h1 style={S.hdrTitle}>Archive</h1></div><div style={S.scroll}>
      {archiveIndex.length === 0 && <p style={S.empty}>No archived days yet.</p>}
      {archiveIndex.map(date => { const c = archiveComp[date] ?? 0; const rc = c >= 90 ? "#34d399" : c >= 50 ? "#f59e0b" : "#ef4444"; return (<div key={date} style={S.archRow} onClick={() => goToDate(date)}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><MiniRing pct={c} color={rc} size={32} /><div><span style={S.archDate}>{new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>{date === todayStr() && <span style={S.todayBadge}>Today</span>}</div></div><span style={{ ...S.archPct, color: rc }}>{c}%</span></div>); })}
      <div style={{ height: 80 }} /></div><Nav view={view} setView={setView} /></div>);
  }

  // ── TODAY VIEW ──
  const dateLabel = new Date(activeDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return (
    <div style={S.container}>
      <div style={S.hdr}>
        <div style={S.hdrTop}><div style={{ flex: 1 }}><h1 style={S.hdrTitle}>Daily Protocol</h1><p style={S.hdrDate}>{dateLabel}{!isToday && <span style={{ color: "#f59e0b", marginLeft: 6, fontSize: 11 }}>● Past</span>}</p></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ProgressRing pct={comp} /><button style={S.calBtn} onClick={() => setShowCal(!showCal)}><span style={{ fontSize: 20 }}>📅</span></button></div></div>
        {showCal && <CalendarPicker year={calMonth.y} month={calMonth.m} activeDate={activeDate} completions={archiveComp} onSelect={goToDate} onPrev={() => setCalMonth(p => p.m === 0 ? { y: p.y - 1, m: 11 } : { y: p.y, m: p.m - 1 })} onNext={() => setCalMonth(p => p.m === 11 ? { y: p.y + 1, m: 0 } : { y: p.y, m: p.m + 1 })} onToday={() => { setCalMonth({ y: new Date().getFullYear(), m: new Date().getMonth() }); goToDate(todayStr()); }} />}
        <div style={S.statsRow}>
          <Pill label="Supps" value={`${sc.done}/${sc.total}`} accent={sc.done === sc.total && sc.total > 0} />
          {(() => {
            const kcalTgt = macroTargets.find(m => m.key === "kcals")?.target || 0;
            const kcalVal = Number(dayData.macros.kcals) || 0;
            const refCal = kcalVal || kcalTgt;
            const totalMC = (Number(dayData.macros.protein) || 0) * 4 + (Number(dayData.macros.carbs) || 0) * 4 + (Number(dayData.macros.fat) || 0) * 9;
            const over = refCal > 0 && totalMC > refCal;
            return macroTargets.slice(0, 3).map(m => {
              const v = dayData.macros[m.key]; const n = Number(v) || 0;
              let warn = (m.key === "kcals" && m.target && n > m.target) || (CALS_PER[m.key] && over);
              return <Pill key={m.id} label={m.label} value={v ? `${v}${m.unit}` : "—"} accent={m.target && n >= m.target && !warn} warn={warn} />;
            });
          })()}
        </div>
      </div>
      <div style={S.scroll}>
        {dayData.blocks.map(block => {
          const today = todayStr();
          const activeItems = block.items.filter(it => !it.startDate || it.startDate <= today);
          const bd = activeItems.filter(i => i.checked).length; const bt = activeItems.length;
          if (bt === 0) return null;
          const allDone = bd === bt && bt > 0; const col = collapsed[block.id]; return (
          <div key={block.id} style={{ ...S.card, ...(allDone ? S.cardDone : {}), padding: 0 }}>
            <div style={S.blockHdr} onClick={() => toggleBlock(block.id)}><div style={S.blockLeft}><span style={S.blockTime}>{block.time}</span><span style={S.blockName}>{block.name}</span></div><div style={S.blockRight}><span style={{ ...S.blockCt, ...(allDone ? { color: "#34d399" } : {}) }}>{bd}/{bt}</span><span style={S.chevron}>{col ? "▸" : "▾"}</span></div></div>
            {!col && <div style={{ padding: "0 14px 10px" }}>{activeItems.map(item => (<div key={item.id} style={{ ...S.itemRow, opacity: item.checked ? 0.5 : 1 }} onClick={() => toggleItem(block.id, item.id)} onContextMenu={e => { e.preventDefault(); setEditItem(item); setEditBlockId(block.id); setView("editItem"); }}>
              <span style={{ ...S.chk, ...(item.checked ? S.chkDone : {}), ...(item.isRx ? { borderColor: "rgba(167,139,250,0.3)" } : {}), ...(item.checked && item.isRx ? { background: "#a78bfa", borderColor: "#a78bfa" } : {}) }}>{item.checked ? "✓" : ""}</span>
              <div style={S.itemInfo}>
                <span style={{ ...S.itemName, ...(item.checked ? S.itemDone : {}) }}>{item.name}{item.isRx && <span style={S.rxBadge}> ℞</span>}{item.alert && <span style={S.alertIcon}> !</span>}</span>
                <span style={S.itemMeta}>{item.brand}{item.notes ? ` · ${item.notes}` : ""}</span>
                {item.alert && !item.checked && <span style={S.alertText}>{item.alert}</span>}
              </div>
            </div>))}</div>}
          </div>
        ); }).filter(Boolean)}

        <Collapsible id="lifestyle" title="Lifestyle" icon="All Day" collapsed={collapsed} toggle={toggleBlock} iconColor="#60a5fa">
          {dayData.lifestyle.map(item => (<div key={item.id} style={{ ...S.itemRow, opacity: item.checked ? 0.5 : 1 }} onClick={() => toggleLf(item.id)}><span style={{ ...S.chk, ...(item.checked ? S.chkDone : {}) }}>{item.checked ? "✓" : ""}</span><div style={S.itemInfo}><span style={{ ...S.itemName, ...(item.checked ? S.itemDone : {}) }}>{item.name}</span><span style={S.itemMeta}>{item.notes}</span></div></div>))}
        </Collapsible>

        <Collapsible id="workout" title="Workout" icon="◆" collapsed={collapsed} toggle={toggleBlock} iconColor="#f472b6"><div style={S.inputGrid}><div style={S.ig}><label style={S.lbl}>Type</label><input style={S.inp} placeholder="Strength, HIIT..." value={dayData.workout.type} onChange={e => updateWorkout("type", e.target.value)} /></div><div style={S.ig}><label style={S.lbl}>Duration</label><input style={S.inp} placeholder="45 min" value={dayData.workout.duration} onChange={e => updateWorkout("duration", e.target.value)} /></div></div><div style={S.ig}><label style={S.lbl}>Notes</label><input style={S.inp} placeholder="Workout notes..." value={dayData.workout.notes} onChange={e => updateWorkout("notes", e.target.value)} /></div></Collapsible>

        <Collapsible id="macros" title="Macros — Welling AI" icon="◆" collapsed={collapsed} toggle={toggleBlock} iconColor="#fbbf24">
          {(() => {
            const kcalTgt = macroTargets.find(m => m.key === "kcals")?.target || 0;
            const pG = Number(dayData.macros.protein) || 0, cG = Number(dayData.macros.carbs) || 0, fG = Number(dayData.macros.fat) || 0;
            const pCal = pG * 4, cCal = cG * 4, fCal = fG * 9, totalMC = pCal + cCal + fCal;
            const kcalVal = Number(dayData.macros.kcals) || 0;
            const refCal = kcalVal || kcalTgt;
            const overBudget = refCal > 0 && totalMC > refCal;
            const hasMacro = pG > 0 || cG > 0 || fG > 0;
            const pPct = refCal > 0 ? Math.round((pCal / refCal) * 100) : 0;
            const cPct = refCal > 0 ? Math.round((cCal / refCal) * 100) : 0;
            const fPct = refCal > 0 ? Math.round((fCal / refCal) * 100) : 0;
            return (<>
              <div style={S.macroGrid}>{macroTargets.map(m => {
                const val = Number(dayData.macros[m.key]) || 0;
                const cellWarn = (m.key === "kcals" && m.target && val > m.target) || (CALS_PER[m.key] && overBudget);
                return (<div key={m.id} style={S.macroCell}><label style={S.macroLbl}>{m.label}</label><input style={{ ...S.macroInp, ...(cellWarn ? { borderColor: "#ef4444", color: "#f87171" } : {}) }} type="number" inputMode="decimal" placeholder="—" value={dayData.macros[m.key] || ""} onChange={e => updateMacro(m.key, e.target.value)} />{m.target && <span style={{ ...S.macroTgt, ...(cellWarn ? { color: "#ef4444" } : {}) }}>/{m.target}{m.unit}</span>}</div>);
              })}</div>
              {hasMacro && refCal > 0 && (<div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#64748b" }}>CALORIE BREAKDOWN</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: overBudget ? "#ef4444" : "#64748b" }}>{totalMC} / {refCal} kcal{overBudget ? " ⚠ OVER" : ""}</span>
                </div>
                <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: "rgba(255,255,255,0.06)" }}>
                  <div style={{ width: `${Math.min(pPct, 100)}%`, background: "#60a5fa", transition: "width 0.3s" }} />
                  <div style={{ width: `${Math.min(cPct, Math.max(0, 100 - pPct))}%`, background: "#fbbf24", transition: "width 0.3s" }} />
                  <div style={{ width: `${Math.min(fPct, Math.max(0, 100 - pPct - cPct))}%`, background: "#f472b6", transition: "width 0.3s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 9, color: "#60a5fa" }}>P {pCal}cal ({pPct}%)</span>
                  <span style={{ fontSize: 9, color: "#fbbf24" }}>C {cCal}cal ({cPct}%)</span>
                  <span style={{ fontSize: 9, color: "#f472b6" }}>F {fCal}cal ({fPct}%)</span>
                </div>
                {overBudget && <div style={{ fontSize: 10, color: "#ef4444", marginTop: 4, fontWeight: 600 }}>Macros exceed {kcalVal ? "entered" : "target"} calories by {totalMC - refCal} kcal</div>}
              </div>)}
              {dietaryNotes && <div style={{ marginTop: 8, padding: "6px 8px", borderRadius: 6, background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.12)" }}><span style={{ fontSize: 10, color: "#fbbf24", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{dietaryNotes}</span></div>}
            </>);
          })()}
        </Collapsible>

        <Collapsible id="oura" title="Oura Ring" icon="◆" collapsed={collapsed} toggle={toggleBlock} iconColor="#a78bfa" rightAction={<button style={S.smBtn} onClick={() => fileRef.current?.click()}>Upload CSV</button>}><input ref={fileRef} type="file" accept=".csv" onChange={handleOura} style={{ display: "none" }} /><div style={S.macroGrid}>{[{ k: "sleepScore", l: "Sleep" }, { k: "hrv", l: "HRV" }, { k: "readiness", l: "Ready" }, { k: "bodyTemp", l: "Temp Δ" }].map(({ k, l }) => (<div key={k} style={S.macroCell}><label style={S.macroLbl}>{l}</label><input style={S.macroInp} type="text" inputMode="decimal" placeholder="—" value={dayData.oura[k]} onChange={e => updateOura(k, e.target.value)} /></div>))}</div></Collapsible>

        <Collapsible id="notes" title="Daily Notes" icon="" collapsed={collapsed} toggle={toggleBlock} iconColor="transparent"><textarea style={S.ta} placeholder="How are you feeling?..." value={dayData.notes} onChange={e => updateNotes(e.target.value)} rows={3} /></Collapsible>
        <div style={{ height: 90 }} />
      </div>
      <Nav view={view} setView={setView} />{UndoToast}{toast && !undoAction && <div style={S.toast}>{toast}</div>}
    </div>
  );
}

// ── Sub-Components ──
function CalendarPicker({ year, month, activeDate, completions, onSelect, onPrev, onNext, onToday }) {
  const days = getDIM(year, month); const fd = getFDOW(year, month); const today = todayStr(); const mn = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells = []; for (let i = 0; i < fd; i++) cells.push(null); for (let d = 1; d <= days; d++) cells.push(d);
  return (<div style={S.calWrap}><div style={S.calNav}><button style={S.calNavBtn} onClick={onPrev}>‹</button><span style={S.calMonth}>{mn}</span><button style={S.calNavBtn} onClick={onNext}>›</button></div><button style={S.calTodayBtn} onClick={onToday}>Today</button><div style={S.calDow}>{["S","M","T","W","T","F","S"].map((d, i) => <span key={i} style={S.calDowTxt}>{d}</span>)}</div><div style={S.calGrid}>{cells.map((d, i) => { if (!d) return <div key={i} style={S.calEmpty} />; const ds = fmtD(year, month, d); const isA = ds === activeDate; const isT = ds === today; const c = completions[ds]; const rc = c != null ? (c >= 90 ? "#34d399" : c >= 50 ? "#f59e0b" : "#ef4444") : null; return (<div key={i} style={{ ...S.calCell, ...(isA ? S.calCellActive : {}) }} onClick={() => onSelect(ds)}>{rc ? (<MiniRing pct={c} color={rc} size={30}><span style={{ ...S.calDay, ...(isT ? S.calDayToday : {}), ...(isA ? { color: "#fff" } : {}) }}>{d}</span></MiniRing>) : (<span style={{ ...S.calDay, ...(isT ? S.calDayToday : {}), ...(isA ? { color: "#fff" } : {}) }}>{d}</span>)}</div>); })}</div></div>);
}
function MiniRing({ pct, color, size, children }) { const r = (size / 2) - 3; const c = 2 * Math.PI * r; const o = c - (pct / 100) * c; return (<div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", top: 0, left: 0 }}><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" /><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`} /></svg>{children}</div>); }
function ProgressRing({ pct }) { const color = pct >= 90 ? "#34d399" : pct >= 50 ? "#f59e0b" : "#ef4444"; const r = 26, c = 2 * Math.PI * r, o = c - (pct / 100) * c; return (<div style={{ position: "relative", width: 62, height: 62 }}><svg width="62" height="62" viewBox="0 0 62 62"><circle cx="31" cy="31" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4.5" /><circle cx="31" cy="31" r={r} fill="none" stroke={color} strokeWidth="4.5" strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" transform="rotate(-90 31 31)" style={{ transition: "stroke-dashoffset 0.5s ease" }} /></svg><div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color }}>{pct}%</div></div>); }
function Pill({ label, value, accent, warn }) { return (<div style={{ ...S.pill, ...(accent ? { borderColor: "#34d399" } : {}), ...(warn ? { borderColor: "#ef4444" } : {}) }}><span style={S.pillLbl}>{label}</span><span style={{ ...S.pillVal, ...(accent ? { color: "#34d399" } : {}), ...(warn ? { color: "#ef4444" } : {}) }}>{value}</span></div>); }
function Collapsible({ id, title, icon, collapsed, toggle, iconColor, children, rightAction }) { const col = collapsed[id]; return (<div style={{ ...S.card, padding: 0 }}><div style={S.blockHdr} onClick={() => toggle(id)}><div style={S.blockLeft}>{icon && <span style={{ ...S.blockTime, color: iconColor }}>{icon}</span>}<span style={S.blockName}>{title}</span></div><div style={S.blockRight}>{rightAction}<span style={S.chevron}>{col ? "▸" : "▾"}</span></div></div>{!col && <div style={{ padding: "0 14px 12px" }}>{children}</div>}</div>); }
function Nav({ view, setView }) { return (<div style={S.nav}>{[{ id: "today", l: "Today", ic: "◉" }, { id: "order", l: "Order", ic: "🛒" }, { id: "archive", l: "Archive", ic: "▤" }, { id: "settings", l: "Settings", ic: "⚙" }].map(i => (<button key={i.id} style={{ ...S.navItem, ...(view === i.id ? S.navActive : {}) }} onClick={() => setView(i.id)}><span style={{ fontSize: 16 }}>{i.ic}</span><span style={S.navLbl}>{i.l}</span></button>))}</div>); }

function EditItemView({ item, blockId, blocks, onSave, onDelete, onCancel }) {
  const [name, setName] = useState(item?.name || ""); const [brand, setBrand] = useState(item?.brand || ""); const [notes, setNotes] = useState(item?.notes || ""); const [url, setUrl] = useState(item?.url || ""); const [isRx, setIsRx] = useState(item?.isRx || false); const [alert, setAlert] = useState(item?.alert || ""); const [startDate, setStartDate] = useState(item?.startDate || ""); const [retestDate, setRetestDate] = useState(item?.retestDate || ""); const [selBlock, setSelBlock] = useState(blockId); const isNew = !item;
  const isFuture = startDate && startDate > todayStr();
  return (<div style={S.container}><div style={S.hdr}><button style={S.back} onClick={onCancel}>← Cancel</button><h1 style={S.hdrTitle}>{isNew ? "Add Item" : "Edit Item"}</h1></div><div style={S.scroll}><div style={{ ...S.card, padding: 16 }}>
    <label style={S.lbl}>Name</label><input style={S.inp} value={name} onChange={e => setName(e.target.value)} placeholder="Supplement name" />
    <label style={S.lbl}>Brand</label><input style={S.inp} value={brand} onChange={e => setBrand(e.target.value)} placeholder="Brand" />
    <label style={S.lbl}>Notes / Dose</label><input style={S.inp} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Dosage or instructions" />
    <label style={S.lbl}>Buy URL</label><input style={S.inp} value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />{url && <a href={url} target="_blank" rel="noopener noreferrer" style={S.urlPreview}>Test link →</a>}
    <label style={{ ...S.lbl, color: "#ef4444" }}>⚠ Special Alert Note</label><input style={{ ...S.inp, borderColor: alert ? "rgba(239,68,68,0.3)" : undefined }} value={alert} onChange={e => setAlert(e.target.value)} placeholder="e.g., Take on empty stomach, 4hrs from calcium..." />
    <p style={{ fontSize: 9, color: "#64748b", margin: "2px 0 0" }}>Shows red ! flag on checklist when set</p>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}><input type="checkbox" checked={isRx} onChange={e => setIsRx(e.target.checked)} /><span style={{ fontSize: 12, color: "#a78bfa" }}>Prescription (℞)</span></div>
    <div style={S.inputGrid}>
      <div style={S.ig}><label style={S.lbl}>Start Date</label><input style={S.inp} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />{isFuture && <span style={{ fontSize: 9, color: "#f59e0b", marginTop: 2 }}>⏳ Won't show on Today until {fmtDisp(startDate)}</span>}</div>
      <div style={S.ig}><label style={S.lbl}>Retest Date</label><input style={S.inp} type="date" value={retestDate} onChange={e => setRetestDate(e.target.value)} />{retestDate && <span style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>Lab recheck: {fmtDisp(retestDate)}</span>}</div>
    </div>
    <label style={S.lbl}>Time Block</label><select style={S.inp} value={selBlock} onChange={e => setSelBlock(e.target.value)}>{blocks.map(b => <option key={b.id} value={b.id}>{b.time} — {b.name}</option>)}</select>
    <button style={{ ...S.btn, marginTop: 16 }} onClick={() => { if (name.trim()) onSave(selBlock, { ...(item || {}), name, brand, notes, url, isRx, alert, startDate, retestDate }, isNew); }}>{isNew ? "Add" : "Save"}</button>
    {!isNew && <button style={{ ...S.btn, background: "#7f1d1d", marginTop: 8 }} onClick={() => onDelete(blockId, item.id)}>Delete</button>}
  </div></div></div>);
}

function EditLfView({ item, onSave, onDelete, onCancel }) {
  const [name, setName] = useState(item?.name || ""); const [notes, setNotes] = useState(item?.notes || ""); const isNew = !item;
  return (<div style={S.container}><div style={S.hdr}><button style={S.back} onClick={onCancel}>← Cancel</button><h1 style={S.hdrTitle}>{isNew ? "Add Lifestyle Item" : "Edit Lifestyle Item"}</h1></div><div style={S.scroll}><div style={{ ...S.card, padding: 16 }}>
    <label style={S.lbl}>Name</label><input style={S.inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Evening Walk, Meditation" />
    <label style={S.lbl}>Notes</label><input style={S.inp} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional details" />
    <button style={{ ...S.btn, marginTop: 16 }} onClick={() => { if (name.trim()) onSave({ ...(item || {}), name, notes }, isNew); }}>{isNew ? "Add" : "Save"}</button>
    {!isNew && <button style={{ ...S.btn, background: "#7f1d1d", marginTop: 8 }} onClick={() => onDelete(item.id)}>Delete</button>}
  </div></div></div>);
}

function MacroTargetRow({ item, onSave, onDelete }) {
  const [editing, setEditing] = useState(false); const [label, setLabel] = useState(item.label); const [target, setTarget] = useState(item.target ?? ""); const [unit, setUnit] = useState(item.unit);
  if (!editing) return (<div style={{ ...S.sItem, padding: "8px 4px" }} onClick={() => setEditing(true)}><div style={{ flex: 1 }}><span style={S.itemName}>{item.label}</span><span style={S.itemMeta}>{item.target ? ` Target: ${item.target}${item.unit}` : " No target"} · Key: {item.key}</span></div><span style={S.arrow}>✎</span></div>);
  return (<div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: 10, marginBottom: 6, border: "1px solid rgba(255,255,255,0.06)" }}>
    <div style={S.inputGrid}><div style={S.ig}><label style={S.lbl}>Label</label><input style={S.inp} value={label} onChange={e => setLabel(e.target.value)} /></div><div style={S.ig}><label style={S.lbl}>Unit</label><input style={{ ...S.inp, width: 60 }} value={unit} onChange={e => setUnit(e.target.value)} placeholder="g, L, mg" /></div></div>
    <div style={S.ig}><label style={S.lbl}>Target (blank = no target)</label><input style={S.inp} type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g., 140" /></div>
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
      <button style={{ ...S.btn, flex: 1, padding: 8, fontSize: 12 }} onClick={() => { onSave({ ...item, label, target: target === "" ? null : Number(target), unit }); setEditing(false); }}>Save</button>
      <button style={{ ...S.smBtn, padding: "6px 10px" }} onClick={() => setEditing(false)}>Cancel</button>
      <button style={{ ...S.smBtn, padding: "6px 10px", color: "#ef4444" }} onClick={() => { onDelete(); setEditing(false); }}>Delete</button>
    </div>
  </div>);
}

function AddMacroForm({ onAdd, existingKeys }) {
  const [show, setShow] = useState(false); const [label, setLabel] = useState(""); const [unit, setUnit] = useState(""); const [target, setTarget] = useState("");
  if (!show) return <button style={{ ...S.addBtn, marginTop: 6 }} onClick={() => setShow(true)}>+ Add Tracking Field</button>;
  const key = label.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const conflict = existingKeys.includes(key);
  return (<div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: 10, marginTop: 6, border: "1px solid rgba(255,255,255,0.06)" }}>
    <div style={S.inputGrid}><div style={S.ig}><label style={S.lbl}>Label</label><input style={S.inp} value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g., Sodium" /></div><div style={S.ig}><label style={S.lbl}>Unit</label><input style={{ ...S.inp }} value={unit} onChange={e => setUnit(e.target.value)} placeholder="mg, g, L" /></div></div>
    <div style={S.ig}><label style={S.lbl}>Target (optional)</label><input style={S.inp} type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g., 2300" /></div>
    {conflict && <p style={{ fontSize: 10, color: "#f87171", marginTop: 4 }}>Key "{key}" already exists</p>}
    <div style={{ display: "flex", gap: 6, marginTop: 8 }}><button style={{ ...S.btn, flex: 1, padding: 8, fontSize: 12 }} onClick={() => { if (label.trim() && !conflict) { onAdd({ key, label, unit, target: target === "" ? null : Number(target) }); setLabel(""); setUnit(""); setTarget(""); setShow(false); } }}>Add</button><button style={{ ...S.smBtn, padding: "6px 10px" }} onClick={() => setShow(false)}>Cancel</button></div>
  </div>);
}

function SettingsBlock({ block, onTimeChange, onNameChange, onDeleteBlock, onEditItem, onAddItem }) {
  const [et, setEt] = useState(false); const [en, setEn] = useState(false); const [nt, setNt] = useState(block.time); const [nn, setNn] = useState(block.name); const [cd, setCd] = useState(false);
  return (<div style={S.sBlock}><div style={S.sBlockHdr}><div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, flexWrap: "wrap" }}>
    {et ? (<div style={{ display: "flex", gap: 4, alignItems: "center" }}><input style={{ ...S.inp, width: 80, fontSize: 12, padding: "3px 6px" }} value={nt} onChange={e => setNt(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { onTimeChange(nt); setEt(false); } }} autoFocus /><button style={S.smBtn} onClick={() => { onTimeChange(nt); setEt(false); }}>✓</button><button style={{ ...S.smBtn, color: "#64748b" }} onClick={() => setEt(false)}>✕</button></div>) : (<span style={{ ...S.blockTime, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }} onClick={() => setEt(true)}>{block.time}</span>)}
    {en ? (<div style={{ display: "flex", gap: 4, alignItems: "center", flex: 1 }}><input style={{ ...S.inp, fontSize: 12, padding: "3px 6px" }} value={nn} onChange={e => setNn(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { onNameChange(nn); setEn(false); } }} autoFocus /><button style={S.smBtn} onClick={() => { onNameChange(nn); setEn(false); }}>✓</button><button style={{ ...S.smBtn, color: "#64748b" }} onClick={() => setEn(false)}>✕</button></div>) : (<span style={{ ...S.sBlockName, cursor: "pointer" }} onClick={() => setEn(true)}>{block.name} ({block.items.length}) ✎</span>)}
  </div>
    {cd ? (<div style={{ display: "flex", gap: 4, alignItems: "center" }}><span style={{ fontSize: 10, color: "#f87171" }}>Sure?</span><button style={{ ...S.smBtn, color: "#ef4444", borderColor: "#ef4444" }} onClick={() => { onDeleteBlock(); setCd(false); }}>Yes</button><button style={S.smBtn} onClick={() => setCd(false)}>No</button></div>) : (<button style={{ ...S.smBtn, color: "#ef4444", fontSize: 11 }} onClick={() => setCd(true)}>Delete</button>)}
  </div>
    {block.items.map(item => (<div key={item.id} style={S.sItem} onClick={() => onEditItem(item)}><div style={{ flex: 1, minWidth: 0 }}><span style={S.itemName}>{item.name}</span>{item.isRx && <span style={{ fontSize: 10, color: "#a78bfa", marginLeft: 4 }}>℞</span>}{item.alert && <span style={{ fontSize: 10, color: "#ef4444", marginLeft: 4 }}>!</span>}{item.url && <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.4 }}>🔗</span>}{item.startDate && item.startDate > todayStr() && <span style={{ fontSize: 9, color: "#f59e0b", marginLeft: 4 }}>⏳{fmtDisp(item.startDate)}</span>}{item.retestDate && <span style={{ fontSize: 9, color: "#64748b", marginLeft: 4 }}>🔬{fmtDisp(item.retestDate)}</span>}</div><span style={S.arrow}>›</span></div>))}
    <button style={S.addBtn} onClick={onAddItem}>+ Add Item</button>
  </div>);
}

function AddBlockForm({ onAdd }) {
  const [show, setShow] = useState(false); const [name, setName] = useState(""); const [time, setTime] = useState("");
  if (!show) return <button style={{ ...S.addBtn, marginTop: 12 }} onClick={() => setShow(true)}>+ Add New Time Block</button>;
  return (<div style={{ ...S.card, padding: 14, marginTop: 10 }}><label style={S.lbl}>Block Name</label><input style={S.inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Mid-Morning" /><label style={S.lbl}>Time</label><input style={S.inp} value={time} onChange={e => setTime(e.target.value)} placeholder="e.g., 10:00 AM" /><div style={{ display: "flex", gap: 8, marginTop: 8 }}><button style={{ ...S.btn, flex: 1 }} onClick={() => { if (name.trim()) { onAdd(name, time); setName(""); setTime(""); setShow(false); } }}>Create</button><button style={{ ...S.smBtn, padding: "8px 14px" }} onClick={() => setShow(false)}>Cancel</button></div></div>);
}

const S = {
  container: { display: "flex", flexDirection: "column", height: "100vh", background: "#0c0f14", color: "#e2e8f0", fontFamily: "'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif", maxWidth: 480, margin: "0 auto", position: "relative", overflow: "hidden" },
  loadScreen: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0c0f14", color: "#64748b" },
  hdr: { padding: "14px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 },
  hdrTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  hdrTitle: { fontSize: 21, fontWeight: 700, margin: 0, letterSpacing: "-0.02em", color: "#f1f5f9" },
  hdrDate: { fontSize: 12, color: "#64748b", marginTop: 2 },
  statsRow: { display: "flex", gap: 6, marginTop: 10, overflowX: "auto" },
  pill: { display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 11px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", minWidth: 56 },
  pillLbl: { fontSize: 9, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 },
  pillVal: { fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginTop: 1 },
  scroll: { flex: 1, overflowY: "auto", padding: "10px 14px", WebkitOverflowScrolling: "touch" },
  card: { background: "rgba(255,255,255,0.03)", borderRadius: 13, padding: "12px 14px", marginBottom: 8, border: "1px solid rgba(255,255,255,0.06)" },
  cardDone: { border: "1px solid rgba(52,211,153,0.25)", background: "rgba(52,211,153,0.04)" },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px" },
  blockHdr: { display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "11px 14px 8px" },
  blockLeft: { display: "flex", alignItems: "center", gap: 8, flex: 1 },
  blockRight: { display: "flex", alignItems: "center", gap: 8 },
  blockTime: { fontSize: 11, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.03em", minWidth: 50 },
  blockName: { fontSize: 13, fontWeight: 600, color: "#cbd5e1" },
  blockCt: { fontSize: 12, fontWeight: 700, color: "#64748b" },
  chevron: { fontSize: 12, color: "#475569" },
  itemRow: { display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0", cursor: "pointer", borderTop: "1px solid rgba(255,255,255,0.03)", transition: "opacity 0.2s" },
  chk: { width: 21, height: 21, borderRadius: 6, border: "2px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "transparent", flexShrink: 0, marginTop: 1, transition: "all 0.15s" },
  chkDone: { background: "#34d399", borderColor: "#34d399", color: "#0c0f14" },
  itemInfo: { display: "flex", flexDirection: "column", flex: 1, minWidth: 0 },
  itemName: { fontSize: 13.5, fontWeight: 500, color: "#e2e8f0", lineHeight: 1.3 },
  itemDone: { textDecoration: "line-through", color: "#64748b" },
  itemMeta: { fontSize: 11, color: "#475569", marginTop: 1, lineHeight: 1.3 },
  inputGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  ig: { display: "flex", flexDirection: "column", gap: 3, marginTop: 6 },
  lbl: { fontSize: 10, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 10 },
  inp: { fontSize: 14, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#e2e8f0", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" },
  macroGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 6 },
  macroCell: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  macroLbl: { fontSize: 9, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em" },
  macroInp: { fontSize: 17, fontWeight: 700, width: 66, textAlign: "center", padding: "5px 4px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#e2e8f0", outline: "none", fontFamily: "inherit" },
  macroTgt: { fontSize: 9, color: "#475569" },
  ta: { fontSize: 14, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#e2e8f0", outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box", resize: "vertical" },
  btn: { display: "block", width: "100%", padding: "11px", borderRadius: 10, background: "#1e3a5f", border: "none", color: "#e2e8f0", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textAlign: "center" },
  smBtn: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit" },
  addBtn: { background: "none", border: "1px dashed rgba(255,255,255,0.12)", color: "#64748b", fontSize: 12, padding: "7px", borderRadius: 8, cursor: "pointer", width: "100%", marginTop: 4, fontFamily: "inherit" },
  nav: { display: "flex", justifyContent: "space-around", padding: "6px 0 16px", background: "#0c0f14", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 },
  navItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 1, background: "none", border: "none", color: "#475569", cursor: "pointer", padding: "4px 10px", fontFamily: "inherit" },
  navActive: { color: "#60a5fa" },
  navLbl: { fontSize: 9, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" },
  back: { background: "none", border: "none", color: "#60a5fa", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" },
  hint: { fontSize: 11, color: "#64748b", margin: "4px 0 6px", lineHeight: 1.4 },
  empty: { fontSize: 14, color: "#475569", textAlign: "center", marginTop: 20 },
  calBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "6px 8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  calWrap: { background: "rgba(15,20,30,0.98)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", padding: "12px 12px 10px", marginTop: 8, boxShadow: "0 10px 40px rgba(0,0,0,0.5)" },
  calNav: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  calNavBtn: { background: "none", border: "none", color: "#60a5fa", fontSize: 20, cursor: "pointer", padding: "2px 10px", fontFamily: "inherit" },
  calMonth: { fontSize: 14, fontWeight: 700, color: "#e2e8f0" },
  calTodayBtn: { background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.25)", color: "#60a5fa", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", marginBottom: 8, display: "block", marginLeft: "auto", marginRight: "auto" },
  calDow: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 2 },
  calDowTxt: { fontSize: 10, fontWeight: 600, color: "#475569", textAlign: "center", padding: "2px 0" },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 },
  calEmpty: { padding: 4 },
  calCell: { display: "flex", alignItems: "center", justifyContent: "center", padding: 3, borderRadius: 8, cursor: "pointer", minHeight: 34 },
  calCellActive: { background: "rgba(96,165,250,0.2)" },
  calDay: { fontSize: 12, fontWeight: 600, color: "#94a3b8", textAlign: "center", lineHeight: 1 },
  calDayToday: { color: "#60a5fa", fontWeight: 800 },
  archRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, marginBottom: 6, cursor: "pointer", border: "1px solid rgba(255,255,255,0.06)" },
  archDate: { fontSize: 14, fontWeight: 600, color: "#e2e8f0" },
  archPct: { fontSize: 14, fontWeight: 700 },
  todayBadge: { fontSize: 10, fontWeight: 700, color: "#60a5fa", marginLeft: 8, textTransform: "uppercase" },
  sBlock: { marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 },
  sBlockHdr: { display: "flex", gap: 6, alignItems: "center", marginBottom: 4, flexWrap: "wrap" },
  sBlockName: { fontSize: 13, fontWeight: 600, color: "#cbd5e1", flex: 1 },
  sItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 4px", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.03)" },
  arrow: { fontSize: 17, color: "#475569", fontWeight: 300 },
  toast: { position: "fixed", bottom: 76, left: "50%", transform: "translateX(-50%)", background: "#1e293b", color: "#e2e8f0", padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.5)", zIndex: 999, border: "1px solid rgba(255,255,255,0.1)" },
  undoBar: { position: "fixed", bottom: 66, left: "50%", transform: "translateX(-50%)", background: "#1e293b", color: "#e2e8f0", padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 500, boxShadow: "0 6px 30px rgba(0,0,0,0.6)", zIndex: 1000, border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", gap: 10, minWidth: 260, maxWidth: 380, overflow: "hidden" },
  undoText: { flex: 1, fontSize: 12, color: "#cbd5e1", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  undoBtn: { background: "rgba(96,165,250,0.2)", border: "1px solid rgba(96,165,250,0.4)", color: "#60a5fa", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 7, cursor: "pointer", fontFamily: "inherit" },
  undoDismiss: { background: "none", border: "none", color: "#475569", fontSize: 14, cursor: "pointer", padding: "2px 4px", fontFamily: "inherit" },
  undoProgress: { position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.05)", borderRadius: "0 0 12px 12px", overflow: "hidden" },
  undoFill: { height: "100%", background: "#60a5fa", borderRadius: 3, animation: "undoShrink 8s linear forwards" },
  urlPreview: { display: "inline-block", fontSize: 11, color: "#60a5fa", marginTop: 4, textDecoration: "none", fontWeight: 600 },
  orderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, marginBottom: 5, cursor: "pointer", border: "1px solid rgba(255,255,255,0.06)" },
  orderInfo: { flex: 1, minWidth: 0, marginRight: 10 },
  orderName: { fontSize: 13.5, fontWeight: 600, color: "#f1f5f9", display: "block", lineHeight: 1.3 },
  orderBrand: { fontSize: 11, color: "#64748b", marginTop: 1, display: "block" },
  orderSrc: { fontSize: 10, fontWeight: 700, letterSpacing: "0.03em" },
  orderIcon: { width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 },
  orderNo: { fontSize: 10, color: "#475569", fontStyle: "italic" },
  orderSectionHdr: { fontSize: 11, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 0 6px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 10 },
  rxBadge: { fontSize: 10, fontWeight: 700, color: "#a78bfa", letterSpacing: "0.02em" },
  alertIcon: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 14, height: 14, borderRadius: 7, background: "#ef4444", color: "#fff", fontSize: 9, fontWeight: 800, marginLeft: 4, verticalAlign: "middle", lineHeight: 1 },
  alertText: { fontSize: 10, color: "#ef4444", lineHeight: 1.4, marginTop: 2, display: "block", fontWeight: 500 },
};

if (typeof document !== "undefined" && !document.getElementById("kj-kf6")) { const s = document.createElement("style"); s.id = "kj-kf6"; s.textContent = `@keyframes undoShrink { from { width: 100%; } to { width: 0%; } }`; document.head.appendChild(s); }
