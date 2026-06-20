/* ============================================================================
 *  comparison.js  —  1:1 PRODUCT COMPARISON ENGINE
 * ----------------------------------------------------------------------------
 *  A strict ONE-TO-ONE comparison. The user makes exactly two choices:
 *    1. One G&W product   (the anchor / left side).
 *    2. One competitor product (the right side).
 *
 *  The page then shows, in order:
 *    • a side-by-side SPECIFICATION table (the two products only);
 *    • a plain-language competitive read-out (who leads + gaps for G&W);
 *    • a detailed deep-dive on the competitor product — how they solve the
 *      problem (SF6-free / insulation, voltage, sensing/protection, comms,
 *      environmental), their angle, strengths, weaknesses, best use case,
 *      and source links.
 *
 *  Matching is SPECIFIC, not blind:
 *    a competitor product is offered for an anchor only when
 *        product.category === anchor.category
 *        AND product.comparableTo includes anchor.id
 *
 *  Loaded after the data files and lib.js, before app.js.
 * ========================================================================== */

/* ----------------------------- shared state ------------------------------ */
const compareState = {
  gwProductId: null,           // anchor (a G&W product id)
  competitorProductId: null    // the single competitor product id
};

/* ------------------------------ data access ------------------------------ */
// G&W products that can anchor a comparison, grouped/ordered by category.
function gwAnchors() {
  const order = DB.categories.map(c => c.id);
  return DB.products
    .filter(p => { const c = getCompetitor(p.competitorId); return c && c.isUs; })
    .sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
}

function getAnchor() {
  const anchors = gwAnchors();
  if (!compareState.gwProductId) compareState.gwProductId = anchors.length ? anchors[0].id : null;
  return anchors.find(p => p.id === compareState.gwProductId) || anchors[0] || null;
}

// Specific competitor matches for an anchor (category + comparableTo).
function candidatesFor(anchor) {
  if (!anchor) return [];
  return DB.products.filter(p => {
    const c = getCompetitor(p.competitorId);
    if (!c || c.isUs) return false;
    if (p.category !== anchor.category) return false;
    return (p.comparableTo || []).includes(anchor.id);
  });
}

// The single selected competitor product (defaults to the first candidate).
function getCompetitorProduct(anchor) {
  const cands = candidatesFor(anchor);
  if (!cands.length) return null;
  let sel = cands.find(p => p.id === compareState.competitorProductId);
  if (!sel) { sel = cands[0]; compareState.competitorProductId = sel.id; }
  return sel;
}

/* --------------------------- selection mutations -------------------------- */
function setCompareAnchor(id) {
  compareState.gwProductId = id;
  compareState.competitorProductId = null;   // reset → first candidate is chosen
}
function setCompareCompetitor(id) {
  compareState.competitorProductId = id;
}

/* ----------------------------- summary engine ---------------------------- */
const EDGE_LABEL = {
  "G&W":        { text: "G&W advantage", cls: "edge-us" },
  "Competitor": { text: "Competitor advantage", cls: "edge-comp" },
  "Even":       { text: "Closely matched", cls: "edge-even" }
};

function getPairSummary(anchor, comp) {
  const curated = ((window.DB.comparisons || {})[anchor.id] || {})[comp.id];
  return curated || buildAutoSummary(anchor, comp);
}

function buildAutoSummary(anchor, comp) {
  const compCo = getCompetitor(comp.competitorId);
  const anchorLabel = "G&W " + (anchor.productFamily || anchor.name);
  const compLabel = (compCo ? compCo.name + " " : "") + (comp.productFamily || comp.name);
  const cat = categoryName(anchor.category);
  const summary =
    `${anchorLabel} and ${compLabel} both compete in ${cat.toLowerCase()} ` +
    `(${anchor.voltageClass}${comp.voltageClass && comp.voltageClass !== anchor.voltageClass ? " vs. " + comp.voltageClass : ""}). ` +
    `${compLabel} leads with ${lc(comp.strengths && comp.strengths[0])}. ` +
    `${anchorLabel} counters with ${lc(anchor.strengths && anchor.strengths[0])}. ` +
    `Best fit depends on the application: ${lc(anchor.bestUseCase)}`;
  const gaps = (comp.strengths || []).slice(0, 2).map(s => `${compCo ? compCo.name : "Competitor"} leads on ${lc(s)}`);
  return { edge: "Even", summary, gaps };
}
function lc(s) { return s ? String(s).charAt(0).toLowerCase() + String(s).slice(1) : "this area"; }

/* ----- friendly "how they solve it" labels for each category's spec key --- */
const APPROACH_LABELS = {
  voltageRating:      "Voltage class & rating",
  currentRating:      "Current rating",
  shortCircuit:       "Short-circuit withstand",
  insulationType:     "Insulation & SF6-free approach",
  communication:      "Communication & automation",
  environmental:      "Environmental & enclosure",
  interruptingRating: "Fault interruption",
  controlPlatform:    "Control & protection",
  sensorType:         "Sensing approach",
  accuracyClass:      "Measurement accuracy",
  output:             "Output & interface",
  accessoryType:      "Accessory type",
  conductorRange:     "Conductor range",
  interface:          "Interface & standard",
  installation:       "Installation method",
  limitingType:       "Limiting technology",
  responseTime:       "Response time",
  letThrough:         "Let-through reduction",
  deployment:         "Deployment model",
  modules:            "Key modules",
  protocols:          "Protocols",
  integration:        "Integration",
  analytics:          "Analytics & AI"
};
function approachItems(product) {
  const cat = getCategory(product.category);
  const cols = (cat && cat.specColumns) || [];
  return cols.map(c => ({ label: APPROACH_LABELS[c.key] || c.label, value: (product.specs || {})[c.key] || "—" }));
}

/* --------------------------- reusable components -------------------------- */
// Side-by-side specification table — the two products only (anchor highlighted).
function sideBySideTable(anchor, comp) {
  const cat = getCategory(anchor.category);
  const specCols = (cat && cat.specColumns) || [];
  const products = [anchor, comp];

  const headCells = products.map((p, i) => {
    const c = getCompetitor(p.competitorId) || {};
    return `<th class="${i === 0 ? "is-us-col" : ""}">
      <div class="sbs-co">${esc(c.name)}${c.isUs ? ' <span class="badge us">You</span>' : ""}</div>
      <div class="sbs-prod">${esc(p.name)}</div>
    </th>`;
  }).join("");

  const rowDefs = [
    { label: "Product family", get: p => p.productFamily || "—" },
    { label: "Category",       get: p => categoryName(p.category) },
    { label: "Voltage class",  get: p => p.voltageClass || "—" },
    { label: "Technology",     get: p => (p.technology || []).join(", ") || "—" }
  ].concat(specCols.map(col => ({
    label: col.label,
    get: p => (p.specs || {})[col.key] || "—"
  }))).concat([
    { label: "Best use case",  get: p => p.bestUseCase || "—" }
  ]);

  const bodyRows = rowDefs.map(r => `
    <tr>
      <th class="sbs-attr">${esc(r.label)}</th>
      ${products.map((p, i) => `<td class="${i === 0 ? "is-us-col" : ""}">${esc(r.get(p))}</td>`).join("")}
    </tr>`).join("");

  const dsRow = `
    <tr>
      <th class="sbs-attr">Datasheet</th>
      ${products.map((p, i) => {
        const link = (p.sourceLinks && p.sourceLinks[0]) ? p.sourceLinks[0].url : p.datasheetUrl;
        return `<td class="${i === 0 ? "is-us-col" : ""}">${link ? `<a class="btn sm" href="${esc(link)}" target="_blank" rel="noopener">PDF ${icon("external")}</a>` : "—"}</td>`;
      }).join("")}
    </tr>`;

  return `
    <div class="table-wrap">
      <table class="spec sbs">
        <thead><tr><th class="sbs-attr">Specification</th>${headCells}</tr></thead>
        <tbody>${bodyRows}${dsRow}</tbody>
      </table>
    </div>`;
}

// Plain-language read-out: who leads, where G&W wins, gaps & risks.
function readOut(anchor, comp) {
  const s = getPairSummary(anchor, comp);
  const edge = EDGE_LABEL[s.edge] || EDGE_LABEL.Even;
  const anchorLabel = "G&W " + (anchor.productFamily || anchor.name);
  return `
    <div class="readout">
      <div class="readout-summary">
        <div class="readout-summary-head">${icon("ai")} Competitive read-out <span class="edge-badge ${edge.cls}">${esc(edge.text)}</span></div>
        <p>${esc(s.summary)}</p>
      </div>
      <div class="readout-cols">
        <div class="readout-col win">
          <div class="readout-col-head">${icon("check")} Where ${esc(anchorLabel)} wins</div>
          ${bullets((anchor.strengths || []).slice(0, 3), "pro")}
        </div>
        <div class="readout-col risk">
          <div class="readout-col-head">${icon("alert")} Gaps &amp; risks for G&amp;W</div>
          ${bullets((s.gaps && s.gaps.length ? s.gaps : (comp.strengths || []).slice(0, 3)), "con")}
        </div>
      </div>
    </div>`;
}

// The competitor product deep-dive — "how they solve it" + everything else.
function competitorDeepDive(anchor, comp) {
  const c = getCompetitor(comp.competitorId) || {};
  const approach = approachItems(comp).map(i => `
    <div class="approach">
      <div class="approach-l">${esc(i.label)}</div>
      <div class="approach-v">${esc(i.value)}</div>
    </div>`).join("");

  const tech = (comp.technology || []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
  const angle = (comp.keyDifferentiators || []).length
    ? `<div class="dd-block">
         <div class="cmp-mini-label">Their angle</div>
         ${bullets(comp.keyDifferentiators, "neutral")}
       </div>` : "";

  const sources = (comp.sourceLinks || []).map(l => extLink(l.url, l.label)).join("")
    || (comp.datasheetUrl ? extLink(comp.datasheetUrl, "Datasheet") : "");

  return `
    <div class="deepdive">
      <div class="deepdive-head">
        ${logo(c)}
        <div style="flex:1;min-width:0">
          <div class="dd-co" data-route="#/competitor/${c.id}">${esc(c.name)}</div>
          <h3>${esc(comp.name)}</h3>
          <div class="dd-meta">${esc(comp.productFamily || "")} · ${catPill(comp.category)} · ${esc(comp.voltageClass)}</div>
        </div>
        ${threatBadge(c.threatLevel)}
      </div>

      ${tech ? `<div class="dd-tech">${tech}</div>` : ""}

      <div class="cmp-mini-label" style="margin-top:6px">How they solve it</div>
      <div class="approach-grid">${approach}</div>

      ${angle}

      <div class="dd-cols">
        <div class="dd-block">
          <div class="cmp-mini-label">Strengths</div>
          ${bullets((comp.strengths || []).slice(0, 4), "pro") || `<p class="cmp-usecase">—</p>`}
        </div>
        <div class="dd-block">
          <div class="cmp-mini-label">Weaknesses</div>
          ${bullets((comp.weaknesses || []).slice(0, 4), "con") || `<p class="cmp-usecase">—</p>`}
        </div>
      </div>

      <div class="dd-usecase">
        <span class="uc-tag">${esc(c.name)} best use case</span>
        <p>${esc(comp.bestUseCase || "—")}</p>
      </div>

      <div class="dd-foot">
        ${sources}
        <button class="btn sm" data-route="#/competitor/${c.id}">Full competitor profile ${icon("right")}</button>
      </div>
    </div>`;
}

/* ------------------------------ the page --------------------------------- */
function comparePage() {
  const anchors = gwAnchors();
  if (!anchors.length) {
    return { title: "1:1 Product Comparison", sub: "", html: emptyState("No G&W products are configured yet. Add them in data/products.js.") };
  }

  const anchor = getAnchor();
  const candidates = candidatesFor(anchor);
  const comp = getCompetitorProduct(anchor);

  // G&W product selector (grouped by category).
  const groups = {};
  anchors.forEach(p => { (groups[p.category] = groups[p.category] || []).push(p); });
  const gwOptions = Object.keys(groups).map(catId => {
    const opts = groups[catId].map(p =>
      `<option value="${esc(p.id)}"${p.id === anchor.id ? " selected" : ""}>${esc(p.name)} — ${esc(p.productFamily || "")}</option>`).join("");
    return `<optgroup label="${esc(categoryName(catId))}">${opts}</optgroup>`;
  }).join("");

  // Competitor product selector (grouped by company) — single select.
  const compGroups = {};
  candidates.forEach(p => { (compGroups[p.competitorId] = compGroups[p.competitorId] || []).push(p); });
  const compOptions = Object.keys(compGroups).map(cid => {
    const opts = compGroups[cid].map(p =>
      `<option value="${esc(p.id)}"${comp && p.id === comp.id ? " selected" : ""}>${esc(p.name)}</option>`).join("");
    return `<optgroup label="${esc(companyName(cid))}">${opts}</optgroup>`;
  }).join("");

  const controls = `
    <div class="cmp-controls">
      <div class="cmp-field">
        <label class="cmp-field-label">${icon("box")} G&amp;W product</label>
        <select class="cmp-select" data-compare-gw>${gwOptions}</select>
      </div>
      <div class="cmp-vs-divider">vs</div>
      <div class="cmp-field">
        <label class="cmp-field-label">${icon("target")} Competitor product</label>
        ${candidates.length
          ? `<select class="cmp-select" data-compare-comp>${compOptions}</select>`
          : `<div class="cmp-select cmp-select-empty">No comparable competitor product yet</div>`}
      </div>
    </div>`;

  if (!candidates.length || !comp) {
    return {
      title: "1:1 Product Comparison",
      sub: "Match one G&W product to one competitor product, side by side.",
      html: controls + emptyState(`No competitor products are mapped to ${anchor.name} yet. Add competitor products with comparableTo: ["${anchor.id}"] in data/products.js.`)
    };
  }

  const compCo = getCompetitor(comp.competitorId) || {};
  const html = `
    ${controls}
    <div class="cmp-active">
      <span class="cmp-active-label">Comparing</span>
      <strong>${esc(anchor.name)}</strong>
      <span class="sep">vs</span>
      <span class="cmp-active-comp">${esc(compCo.name)} ${esc(comp.name)}</span>
    </div>

    <div class="sec sec-gap"><div><h3>Side-by-side specifications</h3><p>${esc(anchor.name)} (highlighted) against ${esc(comp.name)}.</p></div></div>
    ${sideBySideTable(anchor, comp)}

    <div class="sec sec-gap"><div><h3>Competitive read-out</h3><p>The headline difference in plain business language.</p></div></div>
    ${readOut(anchor, comp)}

    <div class="sec sec-gap"><div><h3>Inside ${esc(comp.name)}</h3><p>How ${esc(compCo.name)} approaches this product — voltage, insulation/SF6, sensing, communication and more.</p></div></div>
    ${competitorDeepDive(anchor, comp)}`;

  return {
    title: "1:1 Product Comparison",
    sub: "Match one G&W product to one competitor product, side by side.",
    html
  };
}

/* Re-render only the comparison page body (keeps the header in sync). Called by
 * app.js when the user changes either dropdown. */
function refreshComparePage() {
  const main = document.getElementById("app-main");
  if (!main) return;
  const view = comparePage();
  main.innerHTML = view.html;
  const title = document.getElementById("pageTitle");
  if (title) title.textContent = view.title;
  const sub = document.getElementById("pageSub");
  if (sub) sub.textContent = view.sub || "";
}
