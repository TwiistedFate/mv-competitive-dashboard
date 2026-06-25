/* ============================================================================
 *  app.js  —  router, navigation, event wiring, boot
 * ----------------------------------------------------------------------------
 *  Hash-based routing (works on GitHub Pages with no server config and even by
 *  double-clicking index.html). Loaded LAST, after the data files and the other
 *  scripts.
 * ========================================================================== */

/* ------------------------- build the sidebar nav ------------------------- */
function buildNav() {
  const cats = DB.categories.map(c =>
    `<button class="nav-btn" data-route="#/category/${c.id}"><span>${esc(c.short)}</span></button>`
  ).join("");

  document.getElementById("nav").innerHTML = `
    <span class="nav-label">Overview</span>
    <button class="nav-btn" data-route="#/"><span>Dashboard</span></button>

    <span class="nav-label">Product lines</span>
    ${cats}

    <span class="nav-label">Intelligence</span>
    <button class="nav-btn" data-route="#/compare"><span>1:1 Comparison</span></button>
    <button class="nav-btn" data-route="#/competitors"><span>Competitors</span><span class="nav-badge">${DB.competitors.filter(c => !c.isUs).length}</span></button>
    <button class="nav-btn" data-route="#/news"><span>News &amp; Articles</span><span class="nav-badge">${DB.news.length}</span></button>
    <button class="nav-btn" data-route="#/ai"><span>AI Summaries</span><span class="nav-badge">${DB.aiSummaries.length}</span></button>`;
}

/* ------------------------------ routing --------------------------------- */
function parseHash() {
  const raw = location.hash || "#/";
  const [path, qs] = raw.split("?");
  const parts = path.replace(/^#\/?/, "").split("/").filter(Boolean);
  return { parts, query: new URLSearchParams(qs || ""), path };
}

function routeKey() {
  // top-level key used to highlight the matching nav button
  const { parts } = parseHash();
  if (!parts.length) return "#/";
  if (parts[0] === "category")   return "#/category/" + (parts[1] || "");
  if (parts[0] === "competitor") return "#/competitors";   // profile lives under Competitors
  return "#/" + parts[0];
}

function setActiveNav() {
  const key = routeKey();
  document.querySelectorAll(".nav-btn").forEach(b =>
    b.classList.toggle("active", b.getAttribute("data-route") === key));
}

function render() {
  const { parts, query } = parseHash();
  let view;
  switch (parts[0]) {
    case undefined:      view = dashboardPage(); break;
    case "category":     view = categoryPage(parts[1]); break;
    case "compare":      view = comparePage(); break;
    case "competitors":  view = competitorsPage(); break;
    case "competitor":   view = competitorProfile(parts[1]); break;
    case "news":         view = newsPage(); break;
    case "ai":           view = aiPage(); break;
    default:             view = notFoundPage();
  }

  document.getElementById("pageTitle").textContent = view.title;
  document.getElementById("pageSub").textContent = view.sub || "";
  document.getElementById("app-main").innerHTML = view.html;
  setActiveNav();

  // Optional: focus a specific news item (from "priority updates" on the homepage)
  const focus = query.get("focus");
  if (focus) {
    const card = document.getElementById("news-" + focus);
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      const box = card.querySelector("[data-ai-box]");
      if (box) box.classList.remove("hidden");
      card.style.outline = "2px solid var(--primary)";
      card.style.outlineOffset = "2px";
    }
  } else {
    window.scrollTo({ top: 0 });
  }
}

/* Navigate, resetting the dropdown filters (search text is kept). */
function navigate(hash) {
  Object.keys(filters).forEach(k => { if (k !== "search") filters[k] = ""; });
  specSort = { key: "company", dir: 1 };
  if (location.hash === hash) render();      // same route → re-render manually
  else location.hash = hash;                 // different route → hashchange fires render
}

/* --------------------------- event wiring ------------------------------- */
function wireEvents() {
  // Delegated clicks
  document.addEventListener("click", e => {
    // interactive equipment model — select a hotspot
    const hot = e.target.closest("[data-hotspot]");
    if (hot) { explorerState.hotspotId = hot.getAttribute("data-hotspot"); refreshExplorer(); return; }
    // interactive equipment model — filter hotspots by theme
    const exTab = e.target.closest("[data-explorer-group]");
    if (exTab) { explorerState.group = exTab.getAttribute("data-explorer-group"); refreshExplorer(); return; }
    // sort a spec table
    const th = e.target.closest("th[data-sort]");
    if (th) {
      const key = th.getAttribute("data-sort");
      specSort = (specSort.key === key) ? { key, dir: -specSort.dir } : { key, dir: 1 };
      render();
      return;
    }
    // toggle an AI summary on a news card
    if (e.target.closest('[data-action="toggle-ai"]')) {
      const box = e.target.closest(".news").querySelector("[data-ai-box]");
      if (box) box.classList.toggle("hidden");
      return;
    }
    // clear filters
    if (e.target.closest('[data-action="clear-filters"]')) {
      resetFilters();
      render();
      return;
    }
    // navigation
    const r = e.target.closest("[data-route]");
    if (r) { navigate(r.getAttribute("data-route")); }
  });

  // Delegated filter dropdown changes
  document.addEventListener("change", e => {
    // 1:1 comparison — pick the G&W anchor product
    const gw = e.target.closest("[data-compare-gw]");
    if (gw) { setCompareAnchor(gw.value); refreshComparePage(); return; }
    // 1:1 comparison — pick the single competitor product
    const comp = e.target.closest("[data-compare-comp]");
    if (comp) { setCompareCompetitor(comp.value); refreshComparePage(); return; }

    const sel = e.target.closest("[data-filter]");
    if (sel) { filters[sel.getAttribute("data-filter")] = sel.value; render(); }
  });

  // Global search (debounced)
  const search = document.getElementById("globalSearch");
  search.addEventListener("input", debounce(() => { filters.search = search.value; render(); }, 140));

  // Brand → home
  document.querySelector(".brand").addEventListener("click", () => navigate("#/"));

  // Keyboard activation for SVG hotspots (role="button" on <g> isn't natively keyable)
  document.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const hot = e.target.closest && e.target.closest("g[data-hotspot]");
    if (hot) { e.preventDefault(); explorerState.hotspotId = hot.getAttribute("data-hotspot"); refreshExplorer(); }
  });

  window.addEventListener("hashchange", render);
}

/* ------------------------------- boot ----------------------------------- */
(function init() {
  // last-updated stamp in the sidebar
  const stamp = document.getElementById("lastUpdated");
  if (stamp) stamp.textContent = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  buildNav();
  wireEvents();
  render();
})();
