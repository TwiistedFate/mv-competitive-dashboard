/* ============================================================================
 *  explorer.js  —  INTERACTIVE EQUIPMENT MODEL (2D clickable schematic)
 * ----------------------------------------------------------------------------
 *  Renders a clean 2D SVG schematic of a piece of equipment with numbered,
 *  clickable hotspots. Clicking a hotspot (on the diagram or in the legend)
 *  opens a callout explaining the component in plain terms, in engineering
 *  terms, its customer benefit, and the competitive angle. Tabs filter the
 *  hotspots by theme (switching, sensing, automation, safety, etc.).
 *
 *  Data lives in data/explorers.js (one entry per product line). The line-art
 *  is drawn here, one layout per `type`. Loaded after lib.js, before
 *  comparison.js (which embeds the section on the 1:1 Comparison page).
 * ========================================================================== */

/* Hotspot themes — label + accent used on tabs, chips and markers. */
const EXPLORER_GROUPS = [
  { id: "components",    label: "Components",    color: "#475569" },
  { id: "switching",     label: "Switching",     color: "#1e4f9c" },
  { id: "sensing",       label: "Sensing",       color: "#7c3aed" },
  { id: "automation",    label: "Automation",    color: "#0e7490" },
  { id: "safety",        label: "Safety",        color: "#c0341d" },
  { id: "environmental", label: "Environmental", color: "#157a40" },
  { id: "install",       label: "Install & maintain", color: "#b8730a" }
];
const GROUP_BY_ID = Object.fromEntries(EXPLORER_GROUPS.map(g => [g.id, g]));

/* Shared state for the explorer on the current page. */
const explorerState = { catId: null, hotspotId: null, group: "all" };
function resetExplorerSelection() { explorerState.hotspotId = null; explorerState.group = "all"; }

/* ----------------------------- schematics -------------------------------- *
 * Abstract, professional line-art. Colours come from CSS classes so the
 * diagram matches the dashboard theme. Hotspot markers are overlaid from data. */
const SWITCHGEAR_ART = `
  <line x1="20" y1="358" x2="540" y2="358" class="ex-water"/>
  <rect x="40" y="48" width="480" height="300" rx="12" class="ex-enclosure"/>
  <rect x="62" y="62" width="176" height="46" rx="6" class="ex-part"/>
  <text x="150" y="89" class="ex-label">CONTROL</text>
  <rect x="402" y="64" width="104" height="26" rx="13" class="ex-tag"/>
  <text x="454" y="81" class="ex-tag-text">SF6-FREE</text>
  <path d="M140 150 V126 H420 V150" class="ex-line"/>
  <line x1="280" y1="116" x2="280" y2="348" class="ex-line-soft"/>
  <rect x="98" y="150" width="84" height="120" rx="16" class="ex-part"/>
  <rect x="378" y="150" width="84" height="120" rx="16" class="ex-part"/>
  <circle cx="140" cy="150" r="9" class="ex-node"/>
  <circle cx="420" cy="150" r="9" class="ex-node"/>
  <line x1="429" y1="150" x2="446" y2="150" class="ex-line"/>
  <rect x="446" y="138" width="34" height="24" rx="4" class="ex-accent"/>
  <rect x="250" y="120" width="60" height="30" rx="4" class="ex-window"/>
  <rect x="250" y="158" width="60" height="150" rx="4" class="ex-hatch"/>
  <line x1="280" y1="226" x2="280" y2="244" class="ex-line"/>
  <circle cx="280" cy="250" r="4" class="ex-node"/>
  <line x1="280" y1="256" x2="280" y2="274" class="ex-line"/>
  <path d="M140 270 V330 q0 18 18 18" class="ex-line"/>
  <path d="M420 270 V348" class="ex-line"/>`;

const RECLOSER_ART = `
  <line x1="20" y1="344" x2="500" y2="344" class="ex-water"/>
  <rect x="64" y="40" width="22" height="300" rx="3" class="ex-part"/>
  <rect x="86" y="170" width="44" height="14" rx="3" class="ex-part"/>
  <rect x="150" y="126" width="220" height="84" rx="16" class="ex-enclosure"/>
  <text x="260" y="201" class="ex-label">RECLOSER</text>
  <line x1="140" y1="92" x2="380" y2="92" class="ex-line"/>
  <rect x="192" y="96" width="16" height="32" rx="4" class="ex-part"/>
  <rect x="312" y="96" width="16" height="32" rx="4" class="ex-part"/>
  <circle cx="200" cy="92" r="8" class="ex-node"/>
  <circle cx="320" cy="92" r="8" class="ex-node"/>
  <rect x="332" y="96" width="30" height="18" rx="4" class="ex-accent"/>
  <rect x="298" y="132" width="64" height="22" rx="11" class="ex-tag"/>
  <text x="330" y="147" class="ex-tag-text">SF6-FREE</text>
  <rect x="44" y="250" width="84" height="70" rx="6" class="ex-part"/>
  <text x="86" y="289" class="ex-label">CONTROL</text>
  <path d="M150 192 q-44 8 -64 58" class="ex-line"/>`;

function schematicArt(type) {
  return type === "recloser" ? RECLOSER_ART : SWITCHGEAR_ART;
}
function schematicViewBox(type) {
  return type === "recloser" ? "0 0 520 360" : "0 0 560 380";
}

/* Numbered hotspot markers overlaid on the schematic. */
function hotspotMarkers(spots, selId, group) {
  return spots.map((h, i) => {
    const active = h.id === selId ? " is-active" : "";
    const dim = group !== "all" && h.group !== group ? " is-dim" : "";
    return `<g class="ex-hot${active}${dim}" data-hotspot="${esc(h.id)}" role="button" tabindex="0"
              aria-label="${esc(h.label)}">
        <circle cx="${h.x}" cy="${h.y}" r="14"/>
        <text x="${h.x}" y="${h.y}">${i + 1}</text>
      </g>`;
  }).join("");
}

/* The full interactive block for one product line (catId). */
function explorerInner(catId) {
  const ex = (window.DB.explorers || {})[catId];
  if (!ex) return "";
  const spots = ex.hotspots || [];
  if (!spots.length) return "";

  let sel = spots.find(h => h.id === explorerState.hotspotId);
  if (!sel) { sel = spots[0]; explorerState.hotspotId = sel.id; }
  const selNum = spots.indexOf(sel) + 1;
  const group = explorerState.group || "all";

  // Tabs: "All" + only the themes actually present.
  const present = [...new Set(spots.map(h => h.group))];
  const tabs = [{ id: "all", label: "All" }]
    .concat(EXPLORER_GROUPS.filter(g => present.includes(g.id)));
  const tabsHtml = tabs.map(t =>
    `<button class="ex-tab${(group === t.id) ? " is-active" : ""}" data-explorer-group="${t.id}">${esc(t.label)}</button>`
  ).join("");

  const svg = `<svg viewBox="${schematicViewBox(ex.type)}" class="ex-svg" role="img"
       aria-label="${esc(ex.title || "Equipment schematic")}">${schematicArt(ex.type)}${hotspotMarkers(spots, sel.id, group)}</svg>`;

  // Numbered legend (also clickable + keyboard-accessible).
  const legend = spots.map((h, i) => {
    const active = h.id === sel.id ? " is-active" : "";
    const dim = group !== "all" && h.group !== group ? " is-dim" : "";
    return `<button class="ex-leg${active}${dim}" data-hotspot="${esc(h.id)}">
        <span class="ex-leg-n">${i + 1}</span><span>${esc(h.label)}</span>
      </button>`;
  }).join("");

  const g = GROUP_BY_ID[sel.group] || { label: sel.group, color: "var(--muted)" };
  const callout = `
    <div class="ex-callout">
      <div class="ex-callout-head">
        <span class="ex-num">${selNum}</span>
        <div>
          <span class="ex-chip" style="--g:${g.color}">${esc(g.label)}</span>
          <h4>${esc(sel.label)}</h4>
        </div>
      </div>
      <div class="ex-rows">
        <div class="ex-row"><div class="ex-row-l">In plain terms</div><p>${esc(sel.simple)}</p></div>
        <div class="ex-row"><div class="ex-row-l">Engineering detail</div><p>${esc(sel.technical)}</p></div>
        <div class="ex-row ex-benefit"><div class="ex-row-l">Customer benefit</div><p>${esc(sel.benefit)}</p></div>
        <div class="ex-row ex-vs"><div class="ex-row-l">How G&amp;W compares</div><p>${esc(sel.vs)}</p></div>
      </div>
    </div>`;

  return `
    <div class="explorer">
      <div class="ex-tabs">${tabsHtml}</div>
      <div class="ex-body">
        <div class="ex-stage">${svg}<div class="ex-hint">Tap a numbered point to learn about it</div></div>
        ${callout}
      </div>
      <div class="ex-legend">${legend}</div>
    </div>`;
}

/* Section wrapper embedded by the comparison page. Returns "" when the selected
 * product line has no model yet (graceful, scalable). */
function equipmentExplorerSection(anchor) {
  const ex = (window.DB.explorers || {})[anchor.category];
  if (!ex) return "";
  explorerState.catId = anchor.category;
  return `
    <div class="sec sec-gap"><div><h3>Interactive equipment model</h3><p>${esc(ex.intro || "")}</p></div></div>
    <div id="equipment-explorer">${explorerInner(anchor.category)}</div>`;
}

/* Re-render just the explorer (keeps the rest of the comparison page intact). */
function refreshExplorer() {
  const el = document.getElementById("equipment-explorer");
  if (!el || !explorerState.catId) return;
  el.innerHTML = explorerInner(explorerState.catId);
}
