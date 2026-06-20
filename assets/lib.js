/* ============================================================================
 *  lib.js  —  shared helpers, icons, data access, and reusable UI builders
 * ----------------------------------------------------------------------------
 *  Everything here is generic plumbing used by pages.js. You normally won't
 *  need to edit this file to add competitors / products / news — just edit the
 *  files in /data. Edit here only to change shared behavior or add an icon.
 * ========================================================================== */

const DB = window.DB;                                    // populated by /data/*.js

/* ---- "recent" window for news counts on the homepage (in days) ---------- */
const RECENT_DAYS = 120;

/* --------------------------- small utilities ----------------------------- */
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, m =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}
function fmtDate(iso) {
  if (!iso) return "Date unknown";
  const d = new Date(iso);
  if (isNaN(d)) return esc(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function daysAgo(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return Infinity;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}
function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
const THREAT_RANK = { High: 3, Medium: 2, Low: 1 };

/* ------------------------------ icons ------------------------------------ *
 * Minimal inline SVGs (stroke = currentColor). Add new ones to this map.    */
const ICON_PATHS = {
  overview:   '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  switchgear: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 8h3M15 12h3M15 16h3"/>',
  recloser:   '<path d="M12 2v6"/><circle cx="12" cy="14" r="6"/><path d="M9 14l2 2 4-4"/>',
  sensor:     '<circle cx="12" cy="12" r="3"/><path d="M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8M8 8a5 5 0 0 0 0 8M16 8a5 5 0 0 1 0 8"/>',
  cable:      '<path d="M4 7a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v10a3 3 0 0 0 3 3h2a3 3 0 0 0 3-3"/><path d="M2 7h4M18 17h4"/>',
  limiter:    '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
  software:   '<rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 9l2 2-2 2M12 13h4"/>',
  competitors:'<path d="M3 21V8l6-4 6 4v13"/><path d="M15 21V11l6 4v6"/><path d="M7 9h0M7 13h0M7 17h0"/>',
  news:       '<rect x="3" y="4" width="14" height="16" rx="2"/><path d="M17 8h3a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H6"/><path d="M7 8h6M7 12h6M7 16h4"/>',
  ai:         '<path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M18 14l.9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9z"/>',
  search:     '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  external:   '<path d="M7 17 17 7M9 7h8v8"/>',
  right:      '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left:       '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  chart:      '<path d="M4 20V4M4 20h16"/><rect x="7" y="12" width="3" height="5"/><rect x="12" y="8" width="3" height="9"/><rect x="17" y="5" width="3" height="12"/>',
  flag:       '<path d="M4 22V4M4 4h11l-2 4 2 4H4"/>',
  target:     '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  link:       '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>',
  building:   '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 7h0M15 7h0M9 11h0M15 11h0M9 15h0M15 15h0M10 21v-3h4v3"/>',
  check:      '<path d="M20 6 9 17l-5-5"/>',
  alert:      '<path d="M12 9v4M12 17h0M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z"/>',
  bulb:       '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>',
  box:        '<path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
  layers:     '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>',
  compass:    '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2z"/>'
};
function icon(name, cls) {
  const p = ICON_PATHS[name] || "";
  return `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}

/* ----------------------- data lookups & derivations ---------------------- */
const byId = arr => Object.fromEntries(arr.map(o => [o.id, o]));
const CAT   = byId(DB.categories);
const COMP  = byId(DB.competitors);
const AISUM = byId(DB.aiSummaries);

const getCategory   = id => CAT[id];
const getCompetitor = id => COMP[id];
const getAiSummary  = id => AISUM[id];
const companyName   = id => (COMP[id] ? COMP[id].name : id);
// "corporate" is a non-product scope: company-level news that shows on the News
// page only (never inside a product tab). Give it a friendly label here.
const categoryName  = id => (CAT[id] ? CAT[id].short : (id === "corporate" ? "Corporate" : id));
const categoryAccent= id => (CAT[id] ? CAT[id].accent : "#64748b");

function productsInCategory(catId) {
  return DB.products.filter(p => p.category === catId);
}
function competitorsInCategory(catId) {
  const ids = new Set(productsInCategory(catId).map(p => p.competitorId));
  DB.competitors.forEach(c => { if ((c.categories || []).includes(catId)) ids.add(c.id); });
  return [...ids].map(id => COMP[id]).filter(Boolean);
}
function newsInCategory(catId) {
  return DB.news.filter(n => n.category === catId);
}
function newsForCompany(id) {
  return DB.news.filter(n => n.companyId === id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}
function productsForCompany(id) {
  return DB.products.filter(p => p.competitorId === id);
}
// competitor categories = explicit list + any category they have a product in
function competitorCategories(c) {
  const set = new Set(c.categories || []);
  productsForCompany(c.id).forEach(p => set.add(p.category));
  return [...set];
}

/* unique, sorted option lists used to build filter dropdowns */
function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(b));
}
const FILTER_OPTIONS = {
  region:       () => uniqueSorted(DB.competitors.map(c => c.region).concat(DB.news.map(n => n.region))),
  company:      () => DB.competitors.map(c => c.name).sort((a, b) => a.localeCompare(b)),
  technology:   () => uniqueSorted([].concat(...DB.products.map(p => p.technology || []))),
  voltageClass: () => uniqueSorted(DB.products.map(p => p.voltageClass)),
  application:  () => uniqueSorted([].concat(...DB.products.map(p => p.applications || []))),
  threatLevel:  () => ["High", "Medium", "Low"],
  // Product lines + the non-product "Corporate" scope, built from the news in use.
  category:     () => DB.categories.map(c => c.short).concat(
                        DB.news.some(n => n.category === "corporate") ? ["Corporate"] : [])
};

/* ------------------------- reusable UI builders -------------------------- */
function threatBadge(level) {
  if (!level) return "";
  const cls = level === "High" ? "threat-hi" : level === "Medium" ? "threat-mid" : "threat-lo";
  return `<span class="badge ${cls}"><span class="dot"></span>${esc(level)} threat</span>`;
}
function catPill(catId) {
  return `<span class="cat-pill">${esc(categoryName(catId))}</span>`;
}
/* Brand domain used to fetch the company logo (explicit `domain` wins, else
 * derived from the website host). */
function companyDomain(comp) {
  if (!comp) return "";
  if (comp.domain) return comp.domain;
  try { return new URL(comp.website).hostname.replace(/^www\./, ""); }
  catch (e) { return ""; }
}

/* Real company logo with graceful fallback. The brand mark is pulled from the
 * company's web domain (no API key needed): Google's favicon service first, then
 * DuckDuckGo, then the text initials (always rendered behind the image). */
function logo(comp, cls) {
  const initials = esc(comp.logoText || comp.name.slice(0, 3).toUpperCase());
  const domain = companyDomain(comp);
  const primary = `https://www.google.com/s2/favicons?domain=${esc(domain)}&sz=128`;
  const fallback = `https://icons.duckduckgo.com/ip3/${esc(domain)}.ico`;
  const img = domain
    ? `<img class="logo-img" alt="${esc(comp.name)} logo" src="${primary}"
         onerror="if(!this.dataset.fb){this.dataset.fb=1;this.src='${fallback}';}else{this.style.display='none';}">`
    : "";
  return `<div class="logo ${cls || ""}"><span class="logo-fallback">${initials}</span>${img}</div>`;
}
function tagList(tags) {
  return (tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
}
function emptyState(msg) {
  return `<div class="empty">${icon("search")}<p>${esc(msg)}</p></div>`;
}
function bullets(items, kind) {
  if (!items || !items.length) return "";
  return `<ul class="bullets ${kind || "neutral"}">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`;
}
function extLink(url, label) {
  if (!url) return "";
  return `<a class="btn sm" href="${esc(url)}" target="_blank" rel="noopener">${esc(label || "Open")} ${icon("external")}</a>`;
}

/* Render the structured AI summary (the analyst template). */
function aiSummaryBlock(sum, opts = {}) {
  if (!sum) return "";
  const hiddenCls = opts.startOpen ? "" : " hidden";
  return `
    <div class="ai-box${hiddenCls}" data-ai-box>
      <div class="ai-head">${icon("ai")} AI Summary ${threatBadge(sum.threatLevel)}</div>
      <div class="ai-grid">
        <div class="ai-field full"><div class="l">What happened</div><div class="v">${esc(sum.whatHappened)}</div></div>
        <div class="ai-field"><div class="l">Why it matters</div><div class="v">${esc(sum.whyItMatters)}</div></div>
        <div class="ai-field"><div class="l">Product impact</div><div class="v">${esc(sum.productImpact)}</div></div>
        <div class="ai-field full ai-action"><div class="l">Recommended action</div><div class="v">${esc(sum.recommendedAction)}</div></div>
      </div>
    </div>`;
}

/* ------------------------------ filters ---------------------------------- *
 * One shared filter state object. Pages read it; controls write to it.      */
const filters = {
  search: "", company: "", region: "", technology: "",
  voltageClass: "", application: "", threatLevel: "", date: "", category: ""
};
function resetFilters() {
  Object.keys(filters).forEach(k => { filters[k] = ""; });
  const box = document.getElementById("globalSearch");
  if (box) box.value = "";
}
function buildSelect(key, label, options) {
  const opts = ['<option value="">' + esc(label) + "</option>"]
    .concat(options.map(o => `<option value="${esc(o)}"${filters[key] === o ? " selected" : ""}>${esc(o)}</option>`));
  return `<select data-filter="${key}">${opts.join("")}</select>`;
}
// Date "since" filter — fixed, friendly buckets.
function buildDateSelect() {
  const buckets = [["", "Any date"], ["30", "Last 30 days"], ["90", "Last 90 days"], ["180", "Last 6 months"], ["365", "Last year"]];
  return `<select data-filter="date">${buckets.map(([v, l]) =>
    `<option value="${v}"${filters.date === v ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`;
}
// Build a filter bar from a list of which filters to show.
function filterBar(which, resultCount) {
  const parts = [];
  which.forEach(key => {
    if (key === "date") { parts.push(buildDateSelect()); return; }
    const labels = { company: "All companies", region: "All regions", technology: "All technologies",
      voltageClass: "All voltage classes", application: "All applications", threatLevel: "All threat levels",
      category: "All product lines" };
    parts.push(buildSelect(key, labels[key], FILTER_OPTIONS[key]()));
  });
  const anyActive = which.some(k => filters[k]) || filters.search;
  const clear = anyActive ? `<button class="filter-clear" data-action="clear-filters">Clear filters</button>` : "";
  const count = resultCount == null ? "" : `<span class="result-count">${resultCount} result${resultCount === 1 ? "" : "s"}</span>`;
  return `<div class="filters">${parts.join("")}${clear}${count}</div>`;
}

/* Generic matcher used across list pages. `ctx` provides the fields to test. */
function passesFilters(ctx) {
  const q = filters.search.trim().toLowerCase();
  if (q && !(ctx.text || "").toLowerCase().includes(q)) return false;
  if (filters.company     && ctx.company      !== filters.company) return false;
  if (filters.region      && ctx.region       !== filters.region) return false;
  if (filters.threatLevel && ctx.threatLevel  !== filters.threatLevel) return false;
  if (filters.voltageClass&& ctx.voltageClass !== filters.voltageClass) return false;
  if (filters.technology  && !(ctx.technology || []).includes(filters.technology)) return false;
  if (filters.application && !(ctx.applications || []).includes(filters.application)) return false;
  if (filters.category    && ctx.categoryLabel !== filters.category) return false;
  if (filters.date && ctx.date && daysAgo(ctx.date) > Number(filters.date)) return false;
  return true;
}
