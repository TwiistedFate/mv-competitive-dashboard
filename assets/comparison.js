/* ============================================================================
 *  comparison.js  —  1:1 PRODUCT COMPARISON ENGINE
 * ----------------------------------------------------------------------------
 *  The user controls BOTH sides of the comparison:
 *    1. Pick one G&W product (the anchor).
 *    2. Pick which competitors to compare against (pills + "All Competitors").
 *
 *  Matching is SPECIFIC, not blind:
 *    candidate = competitor product where
 *        product.category === anchor.category            (category match)
 *        AND product.comparableTo includes anchor.id     (curated match)
 *    then further filtered to the competitor companies the user selected.
 *
 *  Loaded after the data files and lib.js, before app.js. app.js wires the
 *  controls (see wireEvents) and routes "#/compare" here.
 * ========================================================================== */

/* ----------------------------- shared state ------------------------------ */
const compareState = {
  gwProductId: null,        // anchor (a G&W product id)
  all: true,                // "All Competitors" selected
  competitors: new Set()    // explicitly selected competitor company ids
};

/* ------------------------------ data access ------------------------------ */
// G&W products that can anchor a comparison (its own products, grouped by line).
function gwAnchors() {
  const order = DB.categories.map(c => c.id);
  return DB.products
    .filter(p => {
      const c = getCompetitor(p.competitorId);
      return c && c.isUs;
    })
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

// Distinct competitor companies that have a candidate for this anchor.
function candidateCompanies(candidates) {
  const ids = [...new Set(candidates.map(p => p.competitorId))];
  return ids.map(getCompetitor).filter(Boolean)
    .sort((a, b) => (THREAT_RANK[b.threatLevel] || 0) - (THREAT_RANK[a.threatLevel] || 0) || a.name.localeCompare(b.name));
}

// Apply the competitor-company filter to the candidates.
function filteredMatches(candidates) {
  if (compareState.all) return candidates;
  return candidates.filter(p => compareState.competitors.has(p.competitorId));
}

/* --------------------------- selection mutations -------------------------- */
function setCompareAnchor(id) {
  compareState.gwProductId = id;
  // Reset competitor selection for predictable results on a new product line.
  compareState.all = true;
  compareState.competitors = new Set();
}
function toggleCompareCompetitor(id) {
  if (compareState.all) {                 // leaving "All" → start a fresh selection
    compareState.all = false;
    compareState.competitors = new Set([id]);
  } else if (compareState.competitors.has(id)) {
    compareState.competitors.delete(id);
  } else {
    compareState.competitors.add(id);
  }
}
function setCompareAll() {
  compareState.all = true;
  compareState.competitors = new Set();
}

/* ----------------------------- summary engine ---------------------------- */
const EDGE_LABEL = {
  "G&W":        { text: "G&W advantage", cls: "edge-us" },
  "Competitor": { text: "Competitor advantage", cls: "edge-comp" },
  "Even":       { text: "Closely matched", cls: "edge-even" }
};

// Curated read-out if present, else an auto-generated business-language one.
function getPairSummary(anchor, comp) {
  const curated = ((window.DB.comparisons || {})[anchor.id] || {})[comp.id];
  if (curated) return curated;
  return buildAutoSummary(anchor, comp);
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

/* --------------------------- reusable components -------------------------- */
// The selected G&W product, shown as the fixed reference card.
function anchorCard(anchor) {
  const cat = getCategory(anchor.category);
  return `
    <div class="cmp-anchor">
      <div class="cmp-anchor-head">
        <div class="cc-icon" style="background:${cat ? cat.accent : "var(--primary)"}">${icon(cat ? cat.icon : "box")}</div>
        <div>
          <div class="cmp-anchor-eyebrow">Your reference product <span class="badge us">G&amp;W</span></div>
          <h3>${esc(anchor.name)}</h3>
          <div class="cmp-anchor-sub">${esc(anchor.productFamily || "")} · ${catPill(anchor.category)} · ${esc(anchor.voltageClass)}</div>
        </div>
      </div>
      <div class="cmp-anchor-cols">
        <div>
          <div class="cmp-mini-label">Strengths to lead with</div>
          ${bullets((anchor.strengths || []).slice(0, 3), "pro")}
        </div>
        <div>
          <div class="cmp-mini-label">Best use case</div>
          <p class="cmp-usecase">${esc(anchor.bestUseCase || "—")}</p>
          ${(anchor.sourceLinks || []).length
            ? `<div class="link-row" style="margin-top:10px">${anchor.sourceLinks.map(l => extLink(l.url, l.label)).join("")}</div>`
            : ""}
        </div>
      </div>
    </div>`;
}

// One match card per competitor product.
function matchCard(anchor, comp) {
  const c = getCompetitor(comp.competitorId) || {};
  const s = getPairSummary(anchor, comp);
  const edge = EDGE_LABEL[s.edge] || EDGE_LABEL.Even;
  const anchorLabel = "G&W " + (anchor.productFamily || anchor.name);
  return `
    <div class="match-card">
      <div class="match-head">
        ${logo(c)}
        <div style="flex:1;min-width:0">
          <div class="match-co" data-route="#/competitor/${c.id}">${esc(c.name)}</div>
          <h4>${esc(comp.name)}</h4>
          <div class="match-meta">${esc(comp.productFamily || "")} · ${esc(comp.voltageClass)}</div>
        </div>
        <div class="match-badges">
          ${threatBadge(c.threatLevel)}
          <span class="edge-badge ${edge.cls}">${esc(edge.text)}</span>
        </div>
      </div>

      <div class="match-summary">
        <div class="match-summary-head">${icon("ai")} Competitive read-out</div>
        <p>${esc(s.summary)}</p>
      </div>

      <div class="match-cols">
        <div class="match-col">
          <div class="cmp-mini-label">${esc(anchorLabel)} strengths</div>
          ${bullets((anchor.strengths || []).slice(0, 3), "pro")}
        </div>
        <div class="match-col">
          <div class="cmp-mini-label">${esc(comp.name)} strengths</div>
          ${bullets((comp.strengths || []).slice(0, 3), "pro")}
        </div>
      </div>

      ${(s.gaps && s.gaps.length)
        ? `<div class="match-gaps">
             <div class="cmp-mini-label warn">${icon("alert")} Gaps &amp; risks for G&amp;W</div>
             ${bullets(s.gaps, "con")}
           </div>`
        : ""}

      <div class="match-usecases">
        <div class="match-uc">
          <span class="uc-tag us">G&amp;W best use case</span>
          <p>${esc(anchor.bestUseCase || "—")}</p>
        </div>
        <div class="match-uc">
          <span class="uc-tag">${esc(c.name)} best use case</span>
          <p>${esc(comp.bestUseCase || "—")}</p>
        </div>
      </div>

      <div class="match-foot">
        ${(comp.sourceLinks || []).map(l => extLink(l.url, l.label)).join("")
          || (comp.datasheetUrl ? extLink(comp.datasheetUrl, "Datasheet") : "")}
        <button class="btn sm" data-route="#/competitor/${c.id}">Full competitor profile ${icon("right")}</button>
      </div>
    </div>`;
}

// Side-by-side specification table: attributes down the side, products across.
function sideBySideTable(anchor, matches) {
  const cat = getCategory(anchor.category);
  const specCols = (cat && cat.specColumns) || [];
  const products = [anchor].concat(matches);

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

// Competitor selector pills (multi-select + "All Competitors").
function competitorPills(companies) {
  const all = `<button class="pill ${compareState.all ? "active" : ""}" data-compare-all>All competitors</button>`;
  const pills = companies.map(c =>
    `<button class="pill ${!compareState.all && compareState.competitors.has(c.id) ? "active" : ""}" data-compare-toggle="${c.id}">
       ${esc(c.name)} ${threatDot(c.threatLevel)}
     </button>`).join("");
  return all + pills;
}
function threatDot(level) {
  const cls = level === "High" ? "threat-hi" : level === "Medium" ? "threat-mid" : "threat-lo";
  return `<span class="pill-dot ${cls}"></span>`;
}

/* ------------------------------ the page --------------------------------- */
function comparePage() {
  const anchors = gwAnchors();
  if (!anchors.length) {
    return { title: "1:1 Product Comparison", sub: "", html: emptyState("No G&W products are configured yet. Add them in data/products.js.") };
  }

  const anchor = getAnchor();
  const candidates = candidatesFor(anchor);
  const companies = candidateCompanies(candidates);
  const matches = filteredMatches(candidates);

  // G&W product selector, grouped by category.
  const groups = {};
  anchors.forEach(p => { (groups[p.category] = groups[p.category] || []).push(p); });
  const options = Object.keys(groups).map(catId => {
    const opts = groups[catId].map(p =>
      `<option value="${esc(p.id)}"${p.id === anchor.id ? " selected" : ""}>${esc(p.name)} — ${esc(p.productFamily || "")}</option>`).join("");
    return `<optgroup label="${esc(categoryName(catId))}">${opts}</optgroup>`;
  }).join("");

  // Active-filter summary line.
  const activeText = compareState.all
    ? "All competitors"
    : (compareState.competitors.size
        ? [...compareState.competitors].map(companyName).join(", ")
        : "None selected");

  const controls = `
    <div class="cmp-controls">
      <div class="cmp-field">
        <label class="cmp-field-label">${icon("box")} G&amp;W product</label>
        <select class="cmp-gw-select" data-compare-gw>${options}</select>
      </div>
      <div class="cmp-field grow">
        <label class="cmp-field-label">${icon("competitors")} Compare against</label>
        <div class="cmp-pills">${competitorPills(companies)}</div>
      </div>
    </div>
    <div class="cmp-active">
      <span class="cmp-active-label">Showing matches for</span>
      <strong>${esc(anchor.name)}</strong>
      <span class="sep">→</span>
      <span class="cmp-active-comp">${esc(activeText)}</span>
      ${(!compareState.all)
        ? `<button class="filter-clear" data-compare-all>Reset to all</button>`
        : ""}
      <span class="result-count" style="margin-left:auto">${matches.length} match${matches.length === 1 ? "" : "es"}</span>
    </div>`;

  // Results.
  let results;
  if (!candidates.length) {
    results = emptyState(`No competitor products are mapped to ${anchor.name} yet. Add competitor products with comparableTo: ["${anchor.id}"] in data/products.js.`);
  } else if (!matches.length) {
    results = emptyState("None of the selected competitors offer a comparable product. Add a competitor above, or choose “All competitors.”");
  } else {
    const cards = matches.map(m => matchCard(anchor, m)).join("");
    results = `
      <div class="sec sec-gap"><div><h3>Competitor matches</h3><p>Each card pairs ${esc(anchor.name)} against one comparable competitor product, with a plain-language read-out.</p></div></div>
      <div class="cmp-matches">${cards}</div>

      <div class="sec sec-gap"><div><h3>Side-by-side specifications</h3><p>${esc(anchor.name)} (highlighted) against the selected competitor products.</p></div></div>
      ${sideBySideTable(anchor, matches)}`;
  }

  const html = `
    ${controls}
    ${anchorCard(anchor)}
    ${results}`;

  return {
    title: "1:1 Product Comparison",
    sub: "Match a single G&W product to the closest competitor products — you control both sides of the comparison.",
    html
  };
}

/* Re-render only the comparison page body (keeps scroll position when the user
 * toggles competitors). Called by app.js event handlers. */
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
