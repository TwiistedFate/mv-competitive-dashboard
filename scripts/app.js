let trackerData = { generated_at: null, items: [], sources: [] };
let filtered = [];

async function loadData(){
  try{
    const res = await fetch('data/tracker_data.json?ts=' + Date.now());
    trackerData = await res.json();
  }catch(err){
    console.error('Could not load tracker_data.json', err);
    trackerData = { generated_at: 'Not generated yet', items: [], sources: [] };
  }
  filtered = trackerData.items || [];
  initFilters();
  render();
}

function initFilters(){
  const cats = [...new Set((trackerData.items||[]).map(x => x.category).filter(Boolean))].sort();
  const select = document.getElementById('categoryFilter');
  cats.forEach(c => { const o=document.createElement('option'); o.value=c; o.textContent=c; select.appendChild(o); });
  document.getElementById('searchInput').addEventListener('input', applyFilters);
  document.getElementById('categoryFilter').addEventListener('change', applyFilters);
  document.getElementById('threatFilter').addEventListener('change', applyFilters);
  document.getElementById('exportBtn').addEventListener('click', exportCSV);
}

function applyFilters(){
  const q = document.getElementById('searchInput').value.toLowerCase();
  const cat = document.getElementById('categoryFilter').value;
  const threat = document.getElementById('threatFilter').value;
  filtered = (trackerData.items||[]).filter(item => {
    const blob = JSON.stringify(item).toLowerCase();
    return (!q || blob.includes(q)) && (cat==='all'||item.category===cat) && (threat==='all'||item.threat===threat);
  });
  render();
}

function render(){
  document.getElementById('lastUpdated').textContent = trackerData.generated_at || 'Not generated yet';
  renderKpis(); renderTracker(); renderThemes(); renderMatrix(); renderSources();
}

function renderKpis(){
  const items = trackerData.items || [];
  const high = items.filter(x=>x.threat==='High').length;
  const competitors = new Set(items.map(x=>x.competitor).filter(Boolean)).size;
  const datasheets = items.filter(x=>(x.url||'').toLowerCase().includes('.pdf') || /datasheet|data sheet|spec/i.test(x.title||'')).length;
  const kpis = [
    ['Tracked items', items.length], ['High threats', high], ['Competitors', competitors], ['Datasheets/specs', datasheets]
  ];
  document.getElementById('kpis').innerHTML = kpis.map(([l,n])=>`<div class="kpi"><div class="num">${n}</div><div class="label">${l}</div></div>`).join('');
}

function renderTracker(){
  const el = document.getElementById('trackerList');
  if(!filtered.length){ el.innerHTML='<p class="muted">No tracker items found yet. Run the GitHub Action crawler.</p>'; return; }
  el.innerHTML = filtered.slice(0,120).map(item => `
    <article class="item">
      <div class="date">${escapeHtml(item.date || '')}</div>
      <div>
        <h3><a href="${escapeAttr(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.title || 'Untitled')}</a></h3>
        <p>${escapeHtml(item.summary || '')}</p>
        <div class="meta">
          <span class="tag">${escapeHtml(item.competitor || 'Unknown')}</span>
          <span class="tag">${escapeHtml(item.category || 'General')}</span>
          <span class="tag">${escapeHtml(item.gw_product_line || 'G&W relevance')}</span>
          <span class="tag">Score ${escapeHtml(String(item.relevance_score ?? ''))}</span>
        </div>
      </div>
      <span class="threat ${escapeAttr(item.threat || 'Low')}">${escapeHtml(item.threat || 'Low')}</span>
    </article>`).join('');
}

function renderThemes(){
  const counts = {};
  (trackerData.items||[]).forEach(x => { const k=x.category||'General'; counts[k]=(counts[k]||0)+1; });
  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8);
  document.getElementById('themeList').innerHTML = sorted.map(([k,v])=>`<div class="theme"><strong>${escapeHtml(k)}</strong><span>${v} matching items</span></div>`).join('') || '<p class="muted">No themes yet.</p>';
}

function renderMatrix(){
  const tbody = document.querySelector('#matrixTable tbody');
  tbody.innerHTML = filtered.slice(0,80).map(x=>`<tr><td>${escapeHtml(x.gw_product_line||'')}</td><td>${escapeHtml(x.competitor||'')}</td><td>${escapeHtml(x.category||'')}</td><td><a href="${escapeAttr(x.url)}" target="_blank" rel="noopener">Source</a></td><td>${escapeHtml(x.threat||'')}</td></tr>`).join('');
}

function renderSources(){
  const sources = trackerData.sources || [];
  document.getElementById('sourceList').innerHTML = sources.map(s=>`<span class="chip">${escapeHtml(s)}</span>`).join('');
}

function exportCSV(){
  const cols = ['date','competitor','category','gw_product_line','threat','relevance_score','title','summary','url'];
  const rows = [cols.join(',')].concat(filtered.map(x=>cols.map(c=>'"'+String(x[c]??'').replaceAll('"','""')+'"').join(',')));
  const blob = new Blob([rows.join('\n')], {type:'text/csv'});
  const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='mv_competitive_tracker.csv'; a.click(); URL.revokeObjectURL(url);
}
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function escapeAttr(s){return escapeHtml(s);}
loadData();
