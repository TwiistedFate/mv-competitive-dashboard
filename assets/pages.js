/* ============================================================================
 *  pages.js  —  one render function per page/view
 * ----------------------------------------------------------------------------
 *  Each function returns { title, sub, html }. The router (app.js) injects the
 *  html and updates the header. To add a brand-new page: write a function here
 *  and add a route for it in app.js.
 * ========================================================================== */

/* Sort state for the spec-comparison tables (changed by clicking headers). */
let specSort = { key: "company", dir: 1 };

/* ============================== DASHBOARD ================================= */
function dashboardPage() {
  const cats = DB.categories;
  const recentNews = DB.news.filter(n => daysAgo(n.date) <= RECENT_DAYS);
  const highThreats = DB.news.filter(n => n.threatLevel === "High");

  const kpis = [
    { label: "Competitors tracked", val: DB.competitors.filter(c => !c.isUs).length, foot: "across all product lines" },
    { label: "Product lines",       val: cats.length,                                foot: "categories monitored" },
    { label: "News (last " + RECENT_DAYS + "d)", val: recentNews.length,             foot: DB.news.length + " items total" },
    { label: "High-threat items",   val: highThreats.length,                         foot: "need attention" }
  ];
  const kpiHtml = kpis.map(k => `
    <div class="card kpi">
      <div class="k-label">${esc(k.label)}</div>
      <div class="k-val">${k.val}</div>
      <div class="k-foot">${esc(k.foot)}</div>
    </div>`).join("");

  // Category cards
  const cards = cats.map(cat => {
    const comps = competitorsInCategory(cat.id).filter(c => !c.isUs);
    const prods = productsInCategory(cat.id);
    const news  = newsInCategory(cat.id);
    const top = comps.slice().sort((a, b) => (THREAT_RANK[b.threatLevel] || 0) - (THREAT_RANK[a.threatLevel] || 0))
      .slice(0, 3).map(c => c.name).join(", ");
    return `
      <div class="card cat-card" data-route="#/category/${cat.id}">
        <div class="cc-top">
          <div class="cc-head">
            <h3>${esc(cat.name)}</h3>
          </div>
          <p class="cc-blurb">${esc(cat.blurb)}</p>
        </div>
        <div class="cc-stats">
          <div class="cc-stat"><div class="n">${comps.length}</div><div class="l">Competitors</div></div>
          <div class="cc-stat"><div class="n">${prods.length}</div><div class="l">Products</div></div>
          <div class="cc-stat"><div class="n">${news.length}</div><div class="l">News</div></div>
        </div>
        <div class="cc-foot">
          <span class="cc-top-comps">${top ? "Top: " + esc(top) : "No competitors yet"}</span>
          <span class="cc-open">Open ${icon("right")}</span>
        </div>
      </div>`;
  }).join("");

  // Top-priority updates (high/medium threat news)
  const priority = DB.news.slice()
    .filter(n => n.threatLevel === "High" || n.threatLevel === "Medium")
    .sort((a, b) => (THREAT_RANK[b.threatLevel] - THREAT_RANK[a.threatLevel]) || (new Date(b.date) - new Date(a.date)))
    .slice(0, 6);
  const priorityHtml = priority.length ? priority.map(n => `
    <div class="compact-item" data-route="#/news?focus=${n.id}">
      <div class="ci-main">
        <p class="ci-title">${esc(n.title)}</p>
        <span class="ci-sub">${esc(companyName(n.companyId))} · ${esc(categoryName(n.category))} · ${fmtDate(n.date)}</span>
      </div>
      ${threatBadge(n.threatLevel)}
    </div>`).join("") : emptyState("No priority updates.");

  // Activity bars — news per category
  const counts = cats.map(c => ({ name: c.short, n: newsInCategory(c.id).length }));
  const max = Math.max(1, ...counts.map(c => c.n));
  const barsHtml = counts.map(c => `
    <div class="bar-row">
      <span class="nm">${esc(c.name)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(c.n / max) * 100}%"></div></div>
      <span class="vv">${c.n}</span>
    </div>`).join("");

  const html = `
    <div class="home-cta">
      <div class="cta-body">
        <h3>1:1 Product Comparison</h3>
        <p>Match a single G&amp;W product to the closest competitor offerings, control both sides of the comparison, and get a plain-language read-out of where you win and where you're exposed.</p>
      </div>
      <button class="btn" data-route="#/compare">Open comparison tool ${icon("right")}</button>
    </div>

    <div class="grid kpis">${kpiHtml}</div>

    <div class="sec sec-gap"><div><h3>Product categories</h3><p>Click any category to compare specs, competitors, and news.</p></div></div>
    <div class="grid cat">${cards}</div>

    <div class="grid two sec-gap">
      <div class="card pad">
        <div class="sec"><div><h3>Priority updates</h3><p>Highest-threat developments right now.</p></div></div>
        <div class="compact">${priorityHtml}</div>
      </div>
      <div class="card pad">
        <div class="sec"><div><h3>Activity by product line</h3><p>News volume per category.</p></div></div>
        <div class="bars">${barsHtml}</div>
      </div>
    </div>`;

  return { title: "Competitive Overview", sub: "The medium-voltage landscape at a glance — competitors, products, and what's moving.", html };
}

/* ============================ CATEGORY PAGE ============================== */
function categoryPage(catId) {
  const cat = getCategory(catId);
  if (!cat) return notFoundPage("category");

  // ---- spec comparison table (filtered + sorted) ----
  let products = productsInCategory(catId).filter(p => {
    const comp = getCompetitor(p.competitorId) || {};
    return passesFilters({
      text: `${comp.name} ${p.name} ${(p.technology || []).join(" ")} ${Object.values(p.specs || {}).join(" ")}`,
      company: comp.name, region: comp.region, threatLevel: comp.threatLevel,
      voltageClass: p.voltageClass, technology: p.technology, applications: p.applications
    });
  });

  const cols = cat.specColumns;
  const valueFor = (p, key) => {
    if (key === "company")  return companyName(p.competitorId);
    if (key === "product")  return p.name;
    return (p.specs || {})[key] || "";
  };
  products.sort((a, b) => {
    const va = String(valueFor(a, specSort.key)).toLowerCase();
    const vb = String(valueFor(b, specSort.key)).toLowerCase();
    return va.localeCompare(vb, undefined, { numeric: true }) * specSort.dir;
  });

  const arrow = key => specSort.key === key ? (specSort.dir === 1 ? "▲" : "▼") : "↕";
  const th = (key, label) =>
    `<th data-sort="${key}" class="${specSort.key === key ? "sorted" : ""}">${esc(label)}<span class="arrow">${arrow(key)}</span></th>`;
  const headRow = th("company", "Company") + th("product", "Product") +
    cols.map(c => th(c.key, c.label)).join("") + `<th>Datasheet</th><th>Notes</th>`;

  const rows = products.map(p => {
    const comp = getCompetitor(p.competitorId) || {};
    const cells = cols.map(c => `<td>${esc((p.specs || {})[c.key] || "—")}</td>`).join("");
    const ds = p.datasheetUrl ? `<a class="btn sm" href="${esc(p.datasheetUrl)}" target="_blank" rel="noopener">PDF ${icon("external")}</a>` : "—";
    return `<tr class="${comp.isUs ? "is-us" : ""}">
      <td class="cell-company" data-route="#/competitor/${comp.id}">${esc(comp.name)}${comp.isUs ? ' <span class="badge us">You</span>' : ""}</td>
      <td class="cell-product">${esc(p.name)}</td>
      ${cells}
      <td>${ds}</td>
      <td><span class="muted">${esc(p.notes || "")}</span></td>
    </tr>`;
  }).join("");

  const table = products.length
    ? `<div class="table-wrap"><table class="spec"><thead><tr>${headRow}</tr></thead><tbody>${rows}</tbody></table></div>`
    : emptyState("No products match the current filters.");

  // ---- key differentiators strip ----
  const diffs = productsInCategory(catId).filter(p => (p.keyDifferentiators || []).length).map(p => {
    const comp = getCompetitor(p.competitorId) || {};
    return `<div class="diff-card">
      <div class="dc-co">${esc(comp.name)} · ${esc(p.name)}</div>
      <ul>${p.keyDifferentiators.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
    </div>`;
  }).join("");

  // ---- competitors in this category (strengths/weaknesses snapshot) ----
  const comps = competitorsInCategory(catId)
    .sort((a, b) => (b.isUs ? 1 : 0) - (a.isUs ? 1 : 0) || (THREAT_RANK[b.threatLevel] || 0) - (THREAT_RANK[a.threatLevel] || 0));
  const compCards = comps.map(c => `
    <div class="panel" style="margin:0">
      <div class="comp-head" style="margin-bottom:8px">
        ${logo(c)}
        <div style="flex:1">
          <h3 style="font-size:14px">${esc(c.name)}${c.isUs ? ' <span class="badge us">You</span>' : ""}</h3>
          <div class="hq" style="font-size:11.5px;color:var(--muted)">${esc(c.hq || "")}</div>
        </div>
        ${threatBadge(c.threatLevel)}
      </div>
      <div class="l" style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted-2);font-weight:700;margin:6px 0 4px">Strengths</div>
      ${bullets((c.strengths || []).slice(0, 3), "pro")}
      <div class="l" style="font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted-2);font-weight:700;margin:10px 0 4px">Watch-outs</div>
      ${bullets((c.weaknesses || []).slice(0, 2), "con")}
      <div style="margin-top:12px"><button class="btn sm" data-route="#/competitor/${c.id}">Full profile ${icon("right")}</button></div>
    </div>`).join("");

  // ---- recent news for this category ----
  const news = newsInCategory(catId).sort((a, b) => new Date(b.date) - new Date(a.date));
  const newsHtml = news.length ? `<div class="list">${news.map(newsCard).join("")}</div>` : emptyState("No news in this category yet.");

  const trends = `<div class="card pad"><div class="sec"><div><h3>Key trends</h3></div></div>
    ${bullets(cat.keyTrends, "neutral")}</div>`;

  const html = `
    <a class="back" data-route="#/">${icon("left")} Back to overview</a>
    ${filterBar(["company", "technology", "voltageClass", "threatLevel"], products.length)}

    ${trends}

    <div class="sec sec-gap"><div><h3>Specification comparison</h3><p>Click any column header to sort. Your products are highlighted.</p></div></div>
    ${table}

    ${diffs ? `<div class="sec sec-gap"><div><h3>Key differentiators</h3><p>What each player leads with.</p></div></div><div class="diff-strip">${diffs}</div>` : ""}

    <div class="sec sec-gap"><div><h3>Competitors &amp; SWOT</h3><p>Strengths and watch-outs in ${esc(cat.short)}.</p></div></div>
    <div class="grid three">${compCards}</div>

    <div class="sec sec-gap"><div><h3>News &amp; articles</h3><p>Recent developments in ${esc(cat.short)} — expand any item for the AI summary.</p></div></div>
    ${newsHtml}`;

  return { title: cat.name, sub: cat.blurb, html };
}

/* ============================ COMPETITORS =============================== */
function competitorsPage() {
  const list = DB.competitors.filter(c => passesFilters({
    text: `${c.name} ${c.overview} ${(c.productsOffered || []).join(" ")}`,
    company: c.name, region: c.region, threatLevel: c.threatLevel
  })).sort((a, b) => (b.isUs ? 1 : 0) - (a.isUs ? 1 : 0) || (THREAT_RANK[b.threatLevel] || 0) - (THREAT_RANK[a.threatLevel] || 0));

  const cards = list.map(c => {
    const ccats = competitorCategories(c).map(catPill).join(" ");
    return `
      <div class="comp-card" data-route="#/competitor/${c.id}">
        <div class="comp-head">
          ${logo(c)}
          <div style="flex:1">
            <h3>${esc(c.name)}${c.isUs ? ' <span class="badge us">You</span>' : ""}</h3>
            <div class="hq">${esc(c.hq || "")}</div>
          </div>
          ${threatBadge(c.threatLevel)}
        </div>
        <p class="ov">${esc(c.overview)}</p>
        <div class="foot">
          <div class="chips">${ccats}</div>
          <span class="cc-open">Profile ${icon("right")}</span>
        </div>
      </div>`;
  }).join("");

  const html = `
    ${filterBar(["company", "region", "threatLevel"], list.length)}
    <div class="grid three">${list.length ? cards : emptyState("No competitors match the current filters.")}</div>`;

  return { title: "Competitor Profiles", sub: "Every tracked company — overview, products, strengths, weaknesses, and strategy.", html };
}

/* ========================= COMPETITOR PROFILE ========================== */
function competitorProfile(id) {
  const c = getCompetitor(id);
  if (!c) return notFoundPage("competitor");

  const news = newsForCompany(id);
  const prods = productsForCompany(id);
  const aiSums = news.filter(n => n.aiSummaryId).map(n => getAiSummary(n.aiSummaryId)).filter(Boolean);

  const prodHtml = prods.length ? prods.map(p => `
    <div class="kv">
      <span class="k">${catPill(p.category)} ${esc(p.name)}</span>
      <span class="v">${p.datasheetUrl ? extLink(p.datasheetUrl, "Datasheet") : ""}</span>
    </div>`).join("") : `<p class="ov">No products recorded yet.</p>`;

  const newsHtml = news.length ? `<div class="list">${news.map(newsCard).join("")}</div>` : emptyState("No recent news recorded.");

  const newProds = (c.newProducts || []).length ? (c.newProducts || []).map(np =>
    `<div class="kv"><span class="k">${esc(np.name)}</span><span class="v">${fmtDate(np.date)}</span></div>`
    + (np.note ? `<div style="font-size:12px;color:var(--muted);margin:-2px 0 6px">${esc(np.note)}</div>` : "")).join("") : "";

  const linksHtml = (c.links || []).map(l => extLink(l.url, l.label)).join("");

  const aiHtml = aiSums.length
    ? aiSums.slice(0, 3).map(s => aiSummaryBlock(s, { startOpen: true })).join("")
    : `<p class="ov">No AI summaries linked yet. Add one in data/ai-summaries.js and reference it from this company's news.</p>`;

  const left = `
    <div class="panel">
      <h4>${icon("box")} Products offered</h4>
      ${prodHtml}
    </div>
    <div class="panel">
      <h4>${icon("check")} Strengths</h4>
      ${bullets(c.strengths, "pro") || `<p class="ov">—</p>`}
    </div>
    <div class="panel">
      <h4>${icon("alert")} Weaknesses</h4>
      ${bullets(c.weaknesses, "con") || `<p class="ov">—</p>`}
    </div>
    <div class="panel">
      <h4>${icon("news")} Recent news</h4>
      ${newsHtml}
    </div>`;

  const right = `
    <div class="panel">
      <h4>${icon("building")} Quick facts</h4>
      <div class="kv"><span class="k">Headquarters</span><span class="v">${esc(c.hq || "—")}</span></div>
      <div class="kv"><span class="k">Region</span><span class="v">${esc(c.region || "—")}</span></div>
      <div class="kv"><span class="k">Founded</span><span class="v">${esc(c.founded || "—")}</span></div>
      <div class="kv"><span class="k">Threat level</span><span class="v">${threatBadge(c.threatLevel) || "—"}</span></div>
      <div class="kv"><span class="k">Product lines</span><span class="v">${competitorCategories(c).length}</span></div>
    </div>
    <div class="panel">
      <h4>${icon("compass")} Strategic direction</h4>
      <p class="ov" style="-webkit-line-clamp:unset;display:block">${esc(c.strategicDirection || "—")}</p>
    </div>
    ${(c.partnerships || []).length ? `<div class="panel"><h4>${icon("link")} Partnerships</h4>${bullets(c.partnerships, "neutral")}</div>` : ""}
    ${newProds ? `<div class="panel"><h4>${icon("flag")} New product announcements</h4>${newProds}</div>` : ""}
    ${linksHtml ? `<div class="panel"><h4>${icon("link")} Useful links</h4><div class="link-row">${linksHtml}</div></div>` : ""}`;

  const html = `
    <a class="back" data-route="#/competitors">${icon("left")} All competitors</a>
    <div class="profile-top">
      ${logo(c)}
      <div style="flex:1;min-width:220px">
        <h2>${esc(c.name)}${c.isUs ? ' <span class="badge us">Your company</span>' : ""}</h2>
        <div class="profile-meta">
          ${threatBadge(c.threatLevel)}
          <span class="badge">${icon("building")} ${esc(c.region || "")}</span>
          ${c.founded ? `<span class="badge">Est. ${esc(c.founded)}</span>` : ""}
          ${competitorCategories(c).map(catPill).join(" ")}
        </div>
        <p class="ov" style="-webkit-line-clamp:unset;display:block;max-width:760px">${esc(c.overview)}</p>
        <div class="link-row" style="margin-top:12px">${c.website ? extLink(c.website, "Website") : ""}</div>
      </div>
    </div>

    <div class="panel" style="border:1px dashed #c7d2fe;background:#f8faff">
      <h4 style="color:var(--primary)">${icon("ai")} AI summary — key developments</h4>
      ${aiHtml}
    </div>

    <div class="profile-cols">
      <div>${left}</div>
      <div>${right}</div>
    </div>`;

  return { title: c.name, sub: c.overview.slice(0, 110) + (c.overview.length > 110 ? "…" : ""), html };
}

/* =============================== NEWS ================================== */
function newsCard(n) {
  const sum = n.aiSummaryId ? getAiSummary(n.aiSummaryId) : null;
  return `
    <div class="news" id="news-${esc(n.id)}">
      <div>
        <div class="meta">
          <strong data-route="#/competitor/${n.companyId}" style="cursor:pointer">${esc(companyName(n.companyId))}</strong>
          <span class="sep">•</span>${catPill(n.category)}
          <span class="sep">•</span>${fmtDate(n.date)}
          ${n.type ? `<span class="sep">•</span>${esc(n.type)}` : ""}
          ${n.region ? `<span class="sep">•</span>${esc(n.region)}` : ""}
        </div>
        <h4>${esc(n.title)}</h4>
        <p class="desc">${esc(n.summary)}</p>
        <div class="tags">${tagList(n.tags)}</div>
      </div>
      <div class="side">
        ${threatBadge(n.threatLevel)}
        ${n.source ? `<a class="btn sm" href="${esc(n.source)}" target="_blank" rel="noopener">Source ${icon("external")}</a>` : ""}
        ${sum ? `<button class="ai-toggle" data-action="toggle-ai">${icon("ai")} AI summary</button>` : ""}
      </div>
      ${sum ? aiSummaryBlock(sum) : ""}
    </div>`;
}

function newsPage() {
  const list = DB.news.filter(n => {
    const comp = getCompetitor(n.companyId) || {};
    return passesFilters({
      text: `${companyName(n.companyId)} ${n.title} ${n.summary} ${(n.tags || []).join(" ")}`,
      company: comp.name, region: n.region, threatLevel: n.threatLevel, date: n.date
    });
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const html = `
    ${filterBar(["company", "region", "threatLevel", "date"], list.length)}
    <div class="list">${list.length ? list.map(newsCard).join("") : emptyState("No news matches the current filters.")}</div>`;

  return { title: "News & Articles", sub: "Press releases, launches, partnerships, and market developments across competitors.", html };
}

/* ============================ AI SUMMARIES ============================= */
function aiPage() {
  // Each AI summary shown with the news item it explains.
  const newsByAi = {};
  DB.news.forEach(n => { if (n.aiSummaryId) newsByAi[n.aiSummaryId] = n; });

  let entries = DB.aiSummaries.map(s => ({ sum: s, news: newsByAi[s.id] }))
    .filter(e => !filters.threatLevel || e.sum.threatLevel === filters.threatLevel)
    .filter(e => {
      const q = filters.search.trim().toLowerCase();
      if (!q) return true;
      const blob = `${e.sum.whatHappened} ${e.sum.whyItMatters} ${e.sum.recommendedAction} ${e.news ? e.news.title : ""}`.toLowerCase();
      return blob.includes(q);
    })
    .sort((a, b) => (THREAT_RANK[b.sum.threatLevel] || 0) - (THREAT_RANK[a.sum.threatLevel] || 0));

  const cards = entries.map(({ sum, news }) => `
    <div class="card pad">
      ${news ? `<div class="meta" style="display:flex;gap:8px;align-items:center;font-size:11.5px;color:var(--muted);margin-bottom:6px">
        <strong data-route="#/competitor/${news.companyId}" style="cursor:pointer">${esc(companyName(news.companyId))}</strong>
        <span class="sep">•</span>${catPill(news.category)}<span class="sep">•</span>${fmtDate(news.date)}</div>
        <h4 style="font-size:14.5px;margin-bottom:4px">${esc(news.title)}</h4>` : ""}
      ${aiSummaryBlock(sum, { startOpen: true })}
    </div>`).join("");

  const html = `
    ${filterBar(["threatLevel"], entries.length)}
    <div class="list">${entries.length ? cards : emptyState("No AI summaries match the current filters.")}</div>`;

  return { title: "AI Summaries", sub: "Structured analyst read-outs: what happened, why it matters, impact, and recommended action.", html };
}

/* ============================= NOT FOUND ============================== */
function notFoundPage(what) {
  return { title: "Not found", sub: "", html: emptyState(`That ${what || "page"} doesn't exist. Use the navigation to get back on track.`) };
}
