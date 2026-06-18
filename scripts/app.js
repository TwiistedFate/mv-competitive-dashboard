/* ============================================================
   GridIntel app.js
   - renamed sections (Reclosers / Sensors / Switchgear)
   - "current news only" window filter
   - displays the real publish date, not crawl date
   ============================================================ */

// How recent counts as "current". Anything older is hidden.
const NEWS_WINDOW_DAYS = 60;

let tracker = { generated_at: null, items: [] };
let currentView = "executive";

const productKeywords = {
  reclosers: ["recloser", "intellirupter", "pulseclosing", "pulse-closing", "osm", "fault isolation", "viper", "rer", "cooper recloser", "protection relay"],
  sensors: ["sensor", "voltage sensor", "current sensor", "power quality", "grid edge", "grid-edge", "flisr", "elbowsense", "keva", "vls", "accusense", "gen2"],
  switchgear: ["sf6", "sf6-free", "switchgear", "rmu", "ring main", "solid dielectric", "airset", "xiria", "trident", "safering", "8djh"],
  datasheets: ["pdf", "datasheet", "data sheet", "catalog", "manual", "specification", "spec sheet"]
};

const titleMap = {
  executive: ["Executive Dashboard", "What competitors shipped, said, and filed — at a glance."],
  threats: ["High Priority Updates", "Items most likely to matter to G&W strategy or positioning."],
  reclosers: ["Reclosers", "Recloser, automation, and protection developments vs. Viper."],
  sensors: ["Sensors", "Voltage/current sensing and grid-edge developments vs. AccuSense."],
  switchgear: ["Switchgear", "SF6-free and solid-dielectric developments vs. Trident."],
  datasheets: ["Datasheets & PDFs", "Detected datasheets, catalogs, manuals, and product-page changes."],
  all: ["All Intelligence", "Complete current tracker output with filters applied."],
  specs: ["Spec Comparison", "Side-by-side electrical ratings vs. the G&W reference line."]
};

async function loadData() {
  try {
    const res = await fetch("data/tracker_data.json?cache=" + Date.now());
    tracker = await res.json();
    if (Array.isArray(tracker)) tracker = { generated_at: null, items: tracker };
  } catch (e) {
    tracker = { generated_at: null, items: [] };
  }
  normalizeItems();
  setupFilters();
  renderAll();
}

/* ---------- date handling ---------- */
// Parse whatever date string the crawler captured into a real Date (or null).
function parseDate(raw) {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}
// Human-friendly "when it was published" — never today's crawl date.
function formatDate(d) {
  if (!d) return "Date unknown";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function daysAgo(d) {
  if (!d) return Infinity;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

function normalizeItems() {
  tracker.items = (tracker.items || []).map(item => {
    const rawDate = item.published || item.date || item.pubDate || null;
    const dateObj = parseDate(rawDate);
    return {
      company: item.company || item.vendor || "Unknown",
      title: item.title || "Untitled update",
      summary: item.summary || item.description || "No summary available.",
      url: item.url || item.link || "#",
      dateObj,                                   // real publish date
      dateLabel: formatDate(dateObj),            // what we show
      ageDays: daysAgo(dateObj),
      category: item.category || inferCategory(item),
      threat_score: Number(item.threat_score || item.score || scoreItem(item)),
      tags: item.tags || inferTags(item)
    };
  })
  .sort((a, b) => {
    // newest first; undated items sink to the bottom
    if (a.dateObj && b.dateObj) return b.dateObj - a.dateObj;
    if (a.dateObj) return -1;
    if (b.dateObj) return 1;
    return b.threat_score - a.threat_score;
  });
}

function textOf(item) {
  return `${item.company} ${item.title} ${item.summary} ${item.category} ${(item.tags || []).join(" ")}`.toLowerCase();
}
function matchesProduct(item, key) {
  const text = textOf(item);
  return productKeywords[key].some(k => text.includes(k.toLowerCase()));
}
function inferCategory(item) {
  if (matchesProduct(item, "datasheets")) return "Datasheet";
  if (matchesProduct(item, "sensors")) return "Sensors";
  if (matchesProduct(item, "reclosers")) return "Reclosers";
  if (matchesProduct(item, "switchgear")) return "Switchgear";
  return "Market Update";
}
function inferTags(item) {
  const tags = [];
  if (matchesProduct(item, "reclosers")) tags.push("Viper impact");
  if (matchesProduct(item, "sensors")) tags.push("AccuSense impact");
  if (matchesProduct(item, "switchgear")) tags.push("Trident impact");
  if (matchesProduct(item, "datasheets")) tags.push("PDF/datasheet");
  return tags.length ? tags : ["Watch item"];
}
function scoreItem(item) {
  let s = 3;
  const t = textOf(item);
  if (matchesProduct(item, "datasheets")) s += 1;
  if (t.includes("launch") || t.includes("new product")) s += 2;
  if (t.includes("sf6") || t.includes("sensor") || t.includes("recloser")) s += 2;
  if (t.includes("contract") || t.includes("utility") || t.includes("pilot")) s += 1;
  return Math.min(10, s);
}

/* ---------- "current" window ---------- */
function currentItems() {
  return tracker.items.filter(i => i.ageDays <= NEWS_WINDOW_DAYS);
}

function setupFilters() {
  const lu = document.getElementById("lastUpdated");
  lu.textContent = tracker.generated_at ? new Date(tracker.generated_at).toLocaleString() : "Not available";
  document.getElementById("crawlCadence").textContent = `Showing last ${NEWS_WINDOW_DAYS} days`;
  document.getElementById("kpiWindow").textContent = `last ${NEWS_WINDOW_DAYS} days`;

  const companies = [...new Set(currentItems().map(i => i.company))].sort();
  const select = document.getElementById("companyFilter");
  select.innerHTML = '<option value="">All companies</option>' +
    companies.map(c => `<option>${escapeHtml(c)}</option>`).join("");
}

function filteredItems() {
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  const company = document.getElementById("companyFilter").value;
  const minScore = Number(document.getElementById("scoreFilter").value || 0);
  return currentItems().filter(item =>
    (!q || textOf(item).includes(q)) &&
    (!company || item.company === company) &&
    item.threat_score >= minScore
  );
}

function renderAll() {
  const items = filteredItems();
  renderKpis(items);
  renderExecutive(items);
  renderList("threatList", items.filter(i => i.threat_score >= 7));
  renderList("reclosersList", items.filter(i => matchesProduct(i, "reclosers")));
  renderList("sensorsList", items.filter(i => matchesProduct(i, "sensors")));
  renderList("switchgearList", items.filter(i => matchesProduct(i, "switchgear")));
  renderList("datasheetList", items.filter(i => matchesProduct(i, "datasheets")));
  renderList("allList", items);
}

function tier(score) { return score >= 7 ? "t-hi" : score >= 5 ? "t-mid" : "t-lo"; }

function renderKpis(items) {
  document.getElementById("kpiTotal").textContent = items.length;
  document.getElementById("kpiHigh").textContent = items.filter(i => i.threat_score >= 7).length;
  document.getElementById("kpiPdf").textContent = items.filter(i => matchesProduct(i, "datasheets")).length;
  document.getElementById("kpiCompanies").textContent = new Set(items.map(i => i.company)).size;
}

function renderExecutive(items) {
  const box = document.getElementById("executiveThreats");
  const top = items.filter(i => i.threat_score >= 6).slice(0, 6);
  box.innerHTML = top.length
    ? top.map(i => `
        <div class="compact-item">
          <div class="ci-main">
            <strong>${escapeHtml(i.title)}</strong>
            <span>${escapeHtml(i.company)} · ${escapeHtml(i.category)} · ${escapeHtml(i.dateLabel)}</span>
          </div>
          <div class="ci-score ${tier(i.threat_score)}">${i.threat_score}</div>
        </div>`).join("")
    : emptyHtml("No high-priority updates in the current window.");

  const impacts = {
    Reclosers: items.filter(i => matchesProduct(i, "reclosers")).length,
    Sensors: items.filter(i => matchesProduct(i, "sensors")).length,
    Switchgear: items.filter(i => matchesProduct(i, "switchgear")).length,
    Datasheets: items.filter(i => matchesProduct(i, "datasheets")).length
  };
  const max = Math.max(1, ...Object.values(impacts));
  document.getElementById("impactBars").innerHTML = Object.entries(impacts).map(([k, v]) => `
    <div class="bar-row">
      <span class="bar-name">${k}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(v / max) * 100}%"></div></div>
      <span class="bar-val">${v}</span>
    </div>`).join("");
}

function renderList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  if (!items.length) {
    el.innerHTML = emptyHtml("No current items here. Try a wider priority filter, or wait for the next daily crawl.");
    return;
  }
  el.innerHTML = "";
  const tpl = document.getElementById("itemTemplate");
  items.forEach(item => {
    const node = tpl.content.cloneNode(true);
    node.querySelector(".company").textContent = item.company;
    node.querySelector(".category").textContent = item.category;
    node.querySelector(".date").textContent = item.dateLabel;
    node.querySelector(".title").textContent = item.title;
    node.querySelector(".summary").textContent = item.summary;

    const gauge = node.querySelector(".gauge-num");
    gauge.textContent = item.threat_score;
    gauge.classList.add(tier(item.threat_score));

    // threat bus bar fills by score
    node.querySelector(".bus-fill").style.height = `${item.threat_score * 10}%`;

    const src = node.querySelector(".source");
    src.href = item.url;
    if (!item.url || item.url === "#") src.style.display = "none";

    node.querySelector(".tags").innerHTML = (item.tags || [])
      .map(t => `<span class="tag${/pdf|datasheet/i.test(t) ? " pdf" : ""}">${escapeHtml(t)}</span>`).join("");

    el.appendChild(node);
  });
}

function emptyHtml(msg) { return `<div class="empty">${escapeHtml(msg)}</div>`; }
function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[m]));
}

function showView(view) {
  currentView = view;
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active-view"));
  document.getElementById(view).classList.add("active-view");
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  const [title, sub] = titleMap[view] || ["Dashboard", ""];
  document.getElementById("pageTitle").textContent = title;
  document.getElementById("pageSub").textContent = sub;
  window.scrollTo({ top: 0 });
}

document.addEventListener("click", e => {
  const nav = e.target.closest(".nav-btn");
  if (nav) showView(nav.dataset.view);
  const jump = e.target.closest("[data-jump]");
  if (jump) showView(jump.dataset.jump);
});
document.getElementById("searchInput").addEventListener("input", renderAll);
document.getElementById("companyFilter").addEventListener("change", renderAll);
document.getElementById("scoreFilter").addEventListener("change", renderAll);
loadData();
