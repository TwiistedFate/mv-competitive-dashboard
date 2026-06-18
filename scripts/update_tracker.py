import json, re, datetime, urllib.parse
from pathlib import Path
import requests, yaml, feedparser
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config" / "sources.yml"
OUT = ROOT / "data" / "tracker_data.json"
KEYWORDS = {
    "Viper impact": ["recloser","intellirupter","pulseclos","fault isolation","protection"],
    "AccuSense impact": ["sensor","voltage sensor","current sensor","grid edge","power quality","flisr","keva","vls","elbowsense"],
    "Trident impact": ["sf6","sf6-free","switchgear","rmu","solid dielectric","airset","xiria"],
    "PDF/datasheet": ["pdf","datasheet","data sheet","catalog","manual","specification"]
}

def clean(s): return re.sub(r"\s+", " ", (s or "")).strip()
def tags_for(text):
    t=text.lower(); tags=[]
    for tag, words in KEYWORDS.items():
        if any(w in t for w in words): tags.append(tag)
    return tags or ["Watch item"]
def category_for(tags):
    if "PDF/datasheet" in tags: return "Datasheet"
    if "AccuSense impact" in tags: return "Sensors"
    if "Viper impact" in tags: return "Reclosers"
    if "Trident impact" in tags: return "Switchgear"
    return "Market Update"
def score_for(text,tags):
    t=text.lower(); s=3+len(tags)
    for word in ["launch","new product","contract","pilot","utility","partnership","patent","sf6-free","sensor","recloser"]:
        if word in t: s+=1
    return min(10,s)

def google_news(vendor, query):
    q=urllib.parse.quote_plus(query)
    url=f"https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en"
    feed=feedparser.parse(url)
    items=[]
    for e in feed.entries[:8]:
        title=clean(e.get("title"))
        link=e.get("link", "")
        summary=clean(BeautifulSoup(e.get("summary", ""), "html.parser").get_text(" "))[:260]
        text=f"{title} {summary} {query}"
        tags=tags_for(text)
        items.append({"company":vendor,"title":title,"summary":summary or query,"url":link,"date":clean(e.get("published", ""))[:16],"category":category_for(tags),"threat_score":score_for(text,tags),"tags":tags})
    return items

def page_scan(vendor, url):
    items=[]
    try:
        r=requests.get(url,timeout=15,headers={"User-Agent":"Mozilla/5.0 competitive-intel-research"})
        soup=BeautifulSoup(r.text,"html.parser")
        title=clean((soup.title.string if soup.title else url))
        text=clean(soup.get_text(" "))[:350]
        tags=tags_for(title+" "+text+" "+url)
        items.append({"company":vendor,"title":title,"summary":text,"url":url,"date":datetime.date.today().isoformat(),"category":category_for(tags),"threat_score":score_for(title+text,tags),"tags":tags})
        for a in soup.find_all("a", href=True):
            href=urllib.parse.urljoin(url,a["href"])
            label=clean(a.get_text(" "))
            if href.lower().endswith(".pdf") or any(w in (href+label).lower() for w in ["datasheet","data-sheet","catalog","manual","specification"]):
                text=label or href.split("/")[-1]
                tags=tags_for(text+" "+href)
                items.append({"company":vendor,"title":text,"summary":"Detected possible datasheet, catalog, manual, or specification document.","url":href,"date":datetime.date.today().isoformat(),"category":"Datasheet","threat_score":score_for(text,tags),"tags":list(set(tags+["PDF/datasheet"]))})
    except Exception as e:
        print(f"Page scan failed for {vendor} {url}: {e}")
    return items[:20]

def dedupe(items):
    seen=set(); out=[]
    for i in items:
        key=(i.get("url") or i.get("title",""))[:220]
        if key and key not in seen:
            seen.add(key); out.append(i)
    return out

def main():
    cfg=yaml.safe_load(CONFIG.read_text())
    all_items=[]
    for v in cfg.get("vendors",[]):
        name=v["name"]; print("Collecting", name)
        for q in v.get("queries",[]): all_items.extend(google_news(name,q))
        for p in v.get("pages",[]): all_items.extend(page_scan(name,p))
    data={"generated_at":datetime.datetime.utcnow().replace(microsecond=0).isoformat()+"Z","items":dedupe(all_items)}
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(json.dumps(data,indent=2,ensure_ascii=False))
    print(f"Wrote {len(data['items'])} items to {OUT}")

if __name__=="__main__": main()
