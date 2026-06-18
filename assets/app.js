let DATA = {products:[], companies:[], news:[], sources:[]};
let state = {query:'', category:'all'};

async function loadData(){
  try{
    const res = await fetch('data/seed_data.json');
    DATA = await res.json();
  }catch(e){
    document.body.insertAdjacentHTML('afterbegin','<div class="error">Could not load data/seed_data.json. If opened directly, Chrome may block fetch. Run: python -m http.server</div>');
  }
  render();
}
function filteredProducts(){
  const q = state.query.toLowerCase();
  return DATA.products.filter(p=>{
    const matchesCategory = state.category==='all' || p.category===state.category;
    const blob = `${p.company} ${p.product} ${p.category} ${p.differentiator} ${p.watch}`.toLowerCase();
    return matchesCategory && (!q || blob.includes(q));
  });
}
function render(){
  const products = filteredProducts();
  document.getElementById('statCompanies').textContent = DATA.companies.length;
  document.getElementById('statProducts').textContent = DATA.products.length;
  document.getElementById('statSources').textContent = DATA.sources.length;
  document.getElementById('productCount').textContent = `${products.length} shown`;
  renderCategories(); renderProducts(products); renderTable(products); renderNews(); renderSources();
}
function renderCategories(){
  const counts = {};
  DATA.products.forEach(p=> counts[p.category]=(counts[p.category]||0)+1);
  document.getElementById('categoryCards').innerHTML = Object.entries(counts).map(([cat,count])=>`
    <button class="category-card" onclick="setCategory('${cat}')"><strong>${count}</strong><span>${cat}</span></button>
  `).join('');
}
function setCategory(cat){ document.getElementById('categoryFilter').value=cat; state.category=cat; render(); }
function linkHtml(links){ return (links||[]).map(l=>`<a href="${l.url}" target="_blank" rel="noreferrer">${l.label}</a>`).join(''); }
function renderProducts(products){
  document.getElementById('productCards').innerHTML = products.map(p=>`
    <article class="product-card">
      <span class="tag">${p.category}</span><span class="tag green">${p.company}</span>
      <h4>${p.product}</h4>
      <p><strong>Compared to:</strong> ${p.baseline}</p>
      <p><strong>Differentiator:</strong> ${p.differentiator}</p>
      <p><strong>Watch:</strong> ${p.watch}</p>
      <div class="links">${linkHtml(p.links)}</div>
    </article>`).join('');
}
function renderTable(products){
  document.querySelector('#comparisonTable tbody').innerHTML = products.map(p=>`
    <tr><td>${p.company}</td><td>${p.product}</td><td>${p.category}</td><td>${p.baseline}</td><td>${p.differentiator}</td><td>${p.watch}</td><td class="links">${linkHtml(p.links)}</td></tr>`).join('');
}
function renderNews(){
  document.getElementById('newsList').innerHTML = DATA.news.map(n=>`
    <article class="news-item"><time>${n.date}</time><div><strong>${n.company}: ${n.title}</strong><p>${n.summary}</p></div><span class="tag">${n.priority}</span></article>`).join('');
}
function renderSources(){
  document.getElementById('sourceList').innerHTML = DATA.sources.map(s=>`
    <article class="source-item"><div><strong>${s.name}</strong><p>${s.type}</p></div><a href="${s.url}" target="_blank" rel="noreferrer">Open</a></article>`).join('');
}
function exportCsv(){
  const rows = [['Company','Product','Category','Compared to G&W','Core differentiator','Watch items','Links'], ...filteredProducts().map(p=>[p.company,p.product,p.category,p.baseline,p.differentiator,p.watch,(p.links||[]).map(l=>l.url).join(' | ')])];
  const csv = rows.map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv'}); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='mv_competitive_comparison.csv'; a.click(); URL.revokeObjectURL(url);
}
document.querySelectorAll('.nav-link').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.nav-link').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active')); document.getElementById(btn.dataset.view).classList.add('active');
  document.getElementById('pageTitle').textContent = btn.textContent;
}));
document.getElementById('globalSearch').addEventListener('input', e=>{state.query=e.target.value; render();});
document.getElementById('categoryFilter').addEventListener('change', e=>{state.category=e.target.value; render();});
document.getElementById('exportCsv').addEventListener('click', exportCsv);
loadData();
