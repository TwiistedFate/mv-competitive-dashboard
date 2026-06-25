/* ============================================================================
 *  explorer.js  —  INTERACTIVE EQUIPMENT MODEL (product-specific)
 * ----------------------------------------------------------------------------
 *  On the 1:1 Comparison page this lets a buyer explore EITHER product component
 *  by component. A toggle switches between the G&W product and the selected
 *  competitor; for each one it shows a product photo (if provided) or a clean 2D
 *  schematic, plus the SPECIFIC equipment that company offers for each component
 *  (their switching, sensing, automation, insulation, safety, install).
 *
 *  Content comes from data/equipment.js (per-product offerings + optional photo)
 *  and data/explorers.js (the schematic + hotspot positions). Any product
 *  without authored offerings falls back to a view derived from its specs.
 *
 *  Loaded after lib.js, before comparison.js.
 * ========================================================================== */

/* Component themes — label, accent, and a plain-language "what it is". */
const EXPLORER_GROUPS = [
  { id: "components",    label: "Components",             color: "#475569", what: "The physical build and enclosure." },
  { id: "switching",     label: "Switching & protection", color: "#1e4f9c", what: "How it makes, breaks and clears faults." },
  { id: "environmental", label: "Insulation / SF6-free",  color: "#157a40", what: "The insulation system and environmental footprint." },
  { id: "sensing",       label: "Sensing & monitoring",   color: "#7c3aed", what: "How it measures voltage, current and grid conditions." },
  { id: "automation",    label: "Automation & control",   color: "#0e7490", what: "How it's operated, automated and integrated." },
  { id: "safety",        label: "Safety",                 color: "#c0341d", what: "Features that protect crews and the public." },
  { id: "install",       label: "Install & maintain",     color: "#b8730a", what: "How it's installed, connected and maintained." }
];
const GROUP_BY_ID = Object.fromEntries(EXPLORER_GROUPS.map(g => [g.id, g]));
const GROUP_ORDER = EXPLORER_GROUPS.map(g => g.id);

/* state: which comparison, which product is shown, which component is open */
const explorerState = { catId: null, gwId: null, compId: null, productId: null, group: null };
function resetExplorerSelection() { explorerState.productId = null; explorerState.group = null; }

/* ------------------------------ data access ------------------------------ */
function exProduct(id) { return DB.products.find(p => p.id === id); }
function exEquip(id) { return (window.DB.equipment || {})[id] || null; }

/* The product's per-component offerings (authored, else derived from specs). */
function exComponents(product) {
  const e = exEquip(product.id);
  if (e && e.components) return e.components;
  return deriveComponents(product);
}
function deriveComponents(p) {
  const s = p.specs || {};
  const tech = (p.technology || []).join(", ");
  const out = {};
  out.switching = { items: [{ name: tech || "Switching", detail: [s.voltageRating, s.interruptingRating || s.shortCircuit].filter(Boolean).join(" · ") || "—" }] };
  if (s.insulationType || /sf6-free/i.test(tech)) out.environmental = { items: [{ name: s.insulationType || "SF6-free", detail: tech || "—" }] };
  if (s.sensorType) out.sensing = { items: [{ name: s.sensorType, detail: [s.accuracyClass, s.output].filter(Boolean).join(" · ") || "—" }] };
  if (s.communication || s.controlPlatform) out.automation = { items: [{ name: s.controlPlatform || "Control & comms", detail: s.communication || "—" }] };
  if (s.environmental) out.install = { items: [{ name: "Installation & rating", detail: s.environmental }] };
  return out;
}
function componentKeys(product) {
  const comps = exComponents(product);
  return GROUP_ORDER.filter(k => comps[k] && comps[k].items && comps[k].items.length);
}
function hasComponents(id) { const p = exProduct(id); return !!(p && componentKeys(p).length); }
/* Default to the competitor (the new product to explore), else the G&W anchor. */
function defaultExplorerProduct(gwId, compId) { return hasComponents(compId) ? compId : gwId; }

/* ----------------------------- schematics -------------------------------- */
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

function schematicArt(type) { return type === "recloser" ? RECLOSER_ART : SWITCHGEAR_ART; }
function schematicViewBox(type) { return type === "recloser" ? "0 0 520 360" : "0 0 560 380"; }

/* Numbered hotspot markers — only for components this product actually has. */
function hotspotMarkers(spots, keys, activeGroup) {
  return (spots || []).filter(h => keys.indexOf(h.group) >= 0).map(h => {
    const num = keys.indexOf(h.group) + 1;
    const active = h.group === activeGroup ? " is-active" : "";
    const g = GROUP_BY_ID[h.group];
    return `<g class="ex-hot${active}" data-component="${esc(h.group)}" role="button" tabindex="0"
              aria-label="${esc(g ? g.label : h.group)}">
        <circle cx="${h.x}" cy="${h.y}" r="14"/><text x="${h.x}" y="${h.y}">${num}</text>
      </g>`;
  }).join("");
}

/* ----------------------------- UI builders ------------------------------- */
function exToggle(gwId, compId, activeId) {
  const btn = (id) => {
    const p = exProduct(id); if (!p) return "";
    const c = getCompetitor(p.competitorId) || {};
    return `<button class="ex-toggle-btn${id === activeId ? " is-active" : ""}" data-explorer-product="${esc(id)}">
        <span class="ex-tg-co">${esc(c.name)}</span><span class="ex-tg-prod">${esc(p.name)}</span>
      </button>`;
  };
  return `<div class="ex-toggle">${btn(gwId)}${btn(compId)}</div>`;
}

function exVisual(product, ex, keys, activeGroup) {
  const e = exEquip(product.id);
  const photo = e && e.image
    ? `<img class="ex-photo" src="${esc(e.image)}" alt="${esc(e.imageAlt || product.name)}"
         onerror="this.closest('.ex-stage').classList.add('img-failed')">`
    : "";
  const schematic = ex
    ? `<div class="ex-schematic"><svg viewBox="${schematicViewBox(ex.type)}" class="ex-svg" role="img"
         aria-label="${esc(product.name)} schematic">${schematicArt(ex.type)}${hotspotMarkers(ex.hotspots, keys, activeGroup)}</svg></div>`
    : `<div class="ex-schematic ex-noschematic">${esc(product.name)}</div>`;
  const hint = (e && e.image)
    ? `Use the components below to explore ${esc(product.name)}`
    : (ex ? "Tap a numbered point or a component below" : "Pick a component below");
  return `<div class="ex-stage${(e && e.image) ? " has-photo" : ""}">${photo}${schematic}<div class="ex-hint">${hint}</div></div>`;
}

function exCallout(product, group) {
  const comps = exComponents(product);
  const data = comps[group];
  const g = GROUP_BY_ID[group] || { label: group, color: "var(--muted)", what: "" };
  const co = getCompetitor(product.competitorId) || {};
  const items = (data && data.items) || [];
  if (!items.length) {
    return `<div class="ex-callout"><p class="cmp-usecase">No ${esc(g.label)} detail recorded for ${esc(product.name)} yet.</p></div>`;
  }
  const num = componentKeys(product).indexOf(group) + 1;
  const list = items.map(it => `
    <li class="ex-item">
      <span class="ex-item-n">${esc(it.name)}</span>
      ${it.detail ? `<span class="ex-item-d">${esc(it.detail)}</span>` : ""}
    </li>`).join("");
  return `
    <div class="ex-callout">
      <div class="ex-callout-head">
        <span class="ex-num">${num}</span>
        <div>
          <span class="ex-chip" style="--g:${g.color}">${esc(g.label)}</span>
          <h4>${esc(co.name || product.name)} — ${esc(g.label)}</h4>
        </div>
      </div>
      <div class="ex-row"><div class="ex-row-l">What this component does</div><p>${esc(g.what)}</p></div>
      <div class="ex-row-l ex-items-head">${esc(co.name || "This company")}'s ${esc(g.label.toLowerCase())} on ${esc(product.name)}
        <span class="ex-count">${items.length}</span></div>
      <ul class="ex-items" style="--g:${g.color}">${list}</ul>
    </div>`;
}

/* The full interactive block for the current comparison. */
function explorerInner() {
  const { gwId, compId, catId } = explorerState;
  const ex = (window.DB.explorers || {})[catId];

  if (explorerState.productId !== gwId && explorerState.productId !== compId) {
    explorerState.productId = defaultExplorerProduct(gwId, compId);
  }
  const product = exProduct(explorerState.productId);
  if (!product) return "";

  const keys = componentKeys(product);
  if (!keys.length) return "";
  if (keys.indexOf(explorerState.group) < 0) explorerState.group = keys[0];

  const legend = keys.map((k, i) => {
    const g = GROUP_BY_ID[k];
    return `<button class="ex-leg${k === explorerState.group ? " is-active" : ""}" data-component="${k}">
        <span class="ex-leg-n">${i + 1}</span><span>${esc(g ? g.label : k)}</span>
      </button>`;
  }).join("");

  return `
    <div class="explorer">
      ${exToggle(gwId, compId, explorerState.productId)}
      <div class="ex-body">
        <div>
          ${exVisual(product, ex, keys, explorerState.group)}
          <div class="ex-legend">${legend}</div>
        </div>
        ${exCallout(product, explorerState.group)}
      </div>
    </div>`;
}

/* Section wrapper embedded by the comparison page (anchor = G&W, comp = rival). */
function equipmentExplorerSection(anchor, comp) {
  if (!anchor || !comp) return "";
  // Show whenever either side has something to explain (authored or derived).
  const anyContent = componentKeys(anchor).length || componentKeys(comp).length
    || (window.DB.explorers || {})[anchor.category];
  if (!anyContent) return "";

  explorerState.catId = anchor.category;
  explorerState.gwId = anchor.id;
  explorerState.compId = comp.id;
  if (explorerState.productId !== anchor.id && explorerState.productId !== comp.id) {
    explorerState.productId = defaultExplorerProduct(anchor.id, comp.id);
  }

  return `
    <div class="sec sec-gap"><div><h3>Interactive equipment model</h3>
      <p>Explore each product component by component — switch between ${esc(anchor.name)} and ${esc(comp.name)} to see the specific equipment each company offers.</p></div></div>
    <div id="equipment-explorer">${explorerInner()}</div>`;
}

/* Re-render just the explorer (keeps the rest of the comparison page intact). */
function refreshExplorer() {
  const el = document.getElementById("equipment-explorer");
  if (!el || !explorerState.catId) return;
  el.innerHTML = explorerInner();
}
