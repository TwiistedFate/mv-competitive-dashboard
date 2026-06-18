let tracker = { generated_at: null, items: [] };
let currentView = "executive";

const productKeywords = {
  viper: ["recloser", "intellirupter", "pulseclosing", "osM", "protection", "fault isolation", "viper"],
  accusense: ["sensor", "voltage sensor", "current sensor", "power quality", "grid edge", "flisr", "elbowsense", "keva", "vls", "accusense"],
  trident: ["sf6", "sf6-free", "switchgear", "rmu", "solid dielectric", "airset", "xiria", "trident"],
  datasheets: ["pdf", "datasheet", "data sheet", "catalog", "manual", "specification", "spec sheet"]
};

const titleMap = {
  executive: "Executive Dashboard", threats: "High Threat Updates", viper: "Viper Competitors",
  accusense: "AccuSense Competitors", trident: "Trident / SF6-Free Switchgear",
  datasheets: "Datasheets & PDFs", all: "All Intelligence"
};

async function loadData(){
  try{
    const res = await fetch("data/tracker_data.json?cache=" + Date.now());
    tracker = await res.json();
    if(Array.isArray(tracker)) tracker = { generated_at: null, items: tracker };
  }catch(e){
    tracker = { generated_at: null, items: [] };
  }
  normalizeItems();
  setupFilters();
  renderAll();
}

function normalizeItems(){
  tracker.items = (tracker.items || []).map(item => ({
    company: item.company || item.vendor || "Unknown",
    title: item.title || "Untitled update",
    summary: item.summary || item.description || "No summary available.",
    url: item.url || item.link || "#",
    date: item.date || item.published || item.discovered_at || "Unknown date",
    category: item.category || inferCategory(item),
    threat_score: Number(item.threat_score || item.score || scoreItem(item)),
    tags: item.tags || inferTags(item)
  })).sort((a,b)=>b.threat_score-a.threat_score);
}

function textOf(item){return `${item.company} ${item.title} ${item.summary} ${item.category} ${(item.tags||[]).join(" ")}`.toLowerCase();}
function matchesProduct(item, key){const text=textOf(item); return productKeywords[key].some(k=>text.includes(k.toLowerCase()));}
function inferCategory(item){ if(matchesProduct(item,"datasheets")) return "Datasheet"; if(matchesProduct(item,"accusense")) return "Sensors"; if(matchesProduct(item,"viper")) return "Reclosers"; if(matchesProduct(item,"trident")) return "Switchgear"; return "Market Update";}
function inferTags(item){ const tags=[]; if(matchesProduct(item,"viper")) tags.push("Viper impact"); if(matchesProduct(item,"accusense")) tags.push("AccuSense impact"); if(matchesProduct(item,"trident")) tags.push("Trident impact"); if(matchesProduct(item,"datasheets")) tags.push("PDF/datasheet"); return tags.length?tags:["Watch item"];}
function scoreItem(item){ let s=3, t=textOf(item); if(matchesProduct(item,"datasheets")) s+=1; if(t.includes("launch")||t.includes("new product")) s+=2; if(t.includes("sf6")||t.includes("sensor")||t.includes("recloser")) s+=2; if(t.includes("contract")||t.includes("utility")||t.includes("pilot")) s+=1; return Math.min(10,s); }

function setupFilters(){
  document.getElementById("lastUpdated").textContent = tracker.generated_at ? new Date(tracker.generated_at).toLocaleString() : "Not available";
  const companies = [...new Set(tracker.items.map(i=>i.company))].sort();
  const select = document.getElementById("companyFilter");
  select.innerHTML = '<option value="">All companies</option>' + companies.map(c=>`<option>${escapeHtml(c)}</option>`).join("");
}

function filteredItems(){
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  const company = document.getElementById("companyFilter").value;
  const minScore = Number(document.getElementById("scoreFilter").value || 0);
  return tracker.items.filter(item => (!q || textOf(item).includes(q)) && (!company || item.company===company) && item.threat_score >= minScore);
}

function renderAll(){
  const items = filteredItems();
  renderKpis(items); renderExecutive(items);
  renderList("threatList", items.filter(i=>i.threat_score>=7));
  renderList("viperList", items.filter(i=>matchesProduct(i,"viper")));
  renderList("accusenseList", items.filter(i=>matchesProduct(i,"accusense")));
  renderList("tridentList", items.filter(i=>matchesProduct(i,"trident")));
  renderList("datasheetList", items.filter(i=>matchesProduct(i,"datasheets")));
  renderList("allList", items);
}

function renderKpis(items){
  document.getElementById("kpiTotal").textContent = items.length;
  document.getElementById("kpiHigh").textContent = items.filter(i=>i.threat_score>=7).length;
  document.getElementById("kpiPdf").textContent = items.filter(i=>matchesProduct(i,"datasheets")).length;
  document.getElementById("kpiCompanies").textContent = new Set(items.map(i=>i.company)).size;
}
function renderExecutive(items){
  const box=document.getElementById("executiveThreats");
  const top=items.filter(i=>i.threat_score>=6).slice(0,6);
  box.innerHTML = top.length ? top.map(i=>`<div class="compact-item"><strong>${escapeHtml(i.title)}</strong><span>${escapeHtml(i.company)} • Threat ${i.threat_score} • ${escapeHtml(i.category)}</span></div>`).join("") : emptyHtml("No high-priority updates found yet.");
  const impacts = {Viper:items.filter(i=>matchesProduct(i,"viper")).length, AccuSense:items.filter(i=>matchesProduct(i,"accusense")).length, Trident:items.filter(i=>matchesProduct(i,"trident")).length, Datasheets:items.filter(i=>matchesProduct(i,"datasheets")).length};
  const max=Math.max(1,...Object.values(impacts));
  document.getElementById("impactBars").innerHTML = Object.entries(impacts).map(([k,v])=>`<div class="bar-row"><strong>${k}</strong><div class="bar-track"><div class="bar-fill" style="width:${(v/max)*100}%"></div></div><span>${v}</span></div>`).join("");
}
function renderList(id, items){
  const el=document.getElementById(id);
  if(!items.length){el.innerHTML=emptyHtml("No matching items found. Try running the tracker or changing filters."); return;}
  el.innerHTML="";
  const tpl=document.getElementById("itemTemplate");
  items.forEach(item=>{
    const node=tpl.content.cloneNode(true);
    node.querySelector(".company").textContent=item.company;
    node.querySelector(".category").textContent=item.category;
    node.querySelector(".date").textContent=item.date;
    node.querySelector(".title").textContent=item.title;
    node.querySelector(".summary").textContent=item.summary;
    node.querySelector(".score strong").textContent=item.threat_score;
    node.querySelector(".source").href=item.url;
    node.querySelector(".tags").innerHTML=(item.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join("");
    el.appendChild(node);
  });
}
function emptyHtml(msg){return `<div class="empty">${escapeHtml(msg)}</div>`;}
function escapeHtml(str){return String(str).replace(/[&<>'"]/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[m]));}

function showView(view){
  currentView=view; document.querySelectorAll(".view").forEach(v=>v.classList.remove("active-view")); document.getElementById(view).classList.add("active-view");
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active", b.dataset.view===view));
  document.getElementById("pageTitle").textContent=titleMap[view] || "Dashboard";
}

document.addEventListener("click", e=>{ if(e.target.matches(".nav-btn")) showView(e.target.dataset.view); if(e.target.matches("[data-jump]")) showView(e.target.dataset.jump); });
document.getElementById("searchInput").addEventListener("input", renderAll);
document.getElementById("companyFilter").addEventListener("change", renderAll);
document.getElementById("scoreFilter").addEventListener("change", renderAll);
loadData();
