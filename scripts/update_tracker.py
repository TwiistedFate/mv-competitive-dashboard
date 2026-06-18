import json, re, datetime, urllib.parse, calendar
from pathlib import Path
import requests, yaml, feedparser
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config" / "sources.yml"
OUT = ROOT / "data" / "tracker_data.json"

KEYWORDS = {
    "Viper impact": ["recloser", "intellirupter", "pulseclos", "fault isolation", "protection"],
    "AccuSense impact": ["sensor", "voltage sensor", "current sensor", "grid edge", "power quality", "flisr", "keva", "vls", "elbowsense"],
    "Trident impact": ["sf6", "sf6-free", "switchgear", "rmu", "solid dielectric", "airset", "xiria"],
    "PDF/datasheet": ["pdf", "datasheet", "data sheet", "catalog", "manual", "specification"],
}


def clean(s):
    return re.sub(r"\s+", " ", (s or "")).strip()


def tags_for(text):
    t = text.lower()
    tags = [tag for tag, words in KEYWORDS.items() if any(w in t for w in words)]
    return tags or ["Watch item"]


def category_for(tags):
    if "PDF/datasheet" in tags: return "Datasheet"
    if "AccuSense impact" in tags: return "Sensors"
    if "Viper impact" in tags: return "Reclosers"
    if "Trident impact" in tags: return "Switchgear"
    return "Market Update"


def score_for(text, tags):
    t = text.lower()
    s = 3 + len(tags)
    for word in ["launch", "new product", "contract", "pilot", "utility",
                 "partnership", "patent", "sf6-free", "sensor", "recloser"]:
        if word in t:
            s += 1
    return min(10, s)


def to_iso(struct_time):
    """Convert a feedparser time.struct_time (UTC) to an ISO-8601 string, or None."""
    if not struct_time:
        return None
    try:
        ts = calendar.timegm(struct_time)
        return datetime.datetime.utcfromtimestamp(ts).replace(microsecond=0).isoformat() + "Z"
    except Exception:
        return None


def google_news(vendor, query):
    """RSS items carry their REAL publish date — we keep it as ISO, never the crawl date."""
    q = urllib.parse.quote_plus(query)
    url = f"https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en"
    feed = feedparser.parse(url)
    items = []
    for e in feed.entries[:8]:
        title = clean(e.get("title"))
        link = e.get("link", "")
        summary = clean(BeautifulSoup(e.get("summary", ""), "html.parser").get_text(" "))[:260]
        published_iso = to_iso(e.get("published_parsed")) or to_iso(e.get("updated_parsed"))
        text = f"{title} {summary} {query}"
        tags = tags_for(text)
        items.append({
            "company": vendor,
            "title": title,
            "summary": summary or query,
            "url": link,
            "published": published_iso,           # real publish date (ISO) or None
            "category": category_for(tags),
            "threat_score": score_for(text, tags),
            "tags": tags,
        })
    return items


def page_scan(vendor, url):
    """
    Page/datasheet discovery. A live page has no reliable publish date, so we DO NOT
    stamp today's date as if it were a publish date. We try to read a real date from
    the page metadata; if none exists, 'published' stays null and 'discovered_at'
    records when the crawler saw it (kept separate, not shown as the article date).
    """
    items = []
    today_iso = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    try:
        r = requests.get(url, timeout=15,
                         headers={"User-Agent": "Mozilla/5.0 competitive-intel-research"})
        soup = BeautifulSoup(r.text, "html.parser")
        title = clean((soup.title.string if soup.title else url))
        text = clean(soup.get_text(" "))[:350]

        # Try to extract a genuine publish/modified date from common meta tags.
        page_date = None
        for sel, attr in [
            ({"property": "article:published_time"}, "content"),
            ({"property": "article:modified_time"}, "content"),
            ({"name": "date"}, "content"),
            ({"name": "publish-date"}, "content"),
            ({"itemprop": "datePublished"}, "content"),
        ]:
            tag = soup.find("meta", attrs=sel)
            if tag and tag.get(attr):
                page_date = clean(tag.get(attr))
                break
        if not page_date:
            t = soup.find("time")
            if t and (t.get("datetime") or t.get_text(strip=True)):
                page_date = clean(t.get("datetime") or t.get_text())

        tags = tags_for(title + " " + text + " " + url)
        items.append({
            "company": vendor,
            "title": title,
            "summary": text,
            "url": url,
            "published": page_date,               # real date if the page exposed one, else None
            "discovered_at": today_iso,           # when WE saw it (kept separate)
            "category": category_for(tags),
            "threat_score": score_for(title + text, tags),
            "tags": tags,
        })

        # Datasheet/PDF links found on the page.
        for a in soup.find_all("a", href=True):
            href = urllib.parse.urljoin(url, a["href"])
            label = clean(a.get_text(" "))
            if href.lower().endswith(".pdf") or any(
                w in (href + label).lower()
                for w in ["datasheet", "data-sheet", "catalog", "manual", "specification"]
            ):
                dtxt = label or href.split("/")[-1]
                dtags = tags_for(dtxt + " " + href)
                items.append({
                    "company": vendor,
                    "title": dtxt,
                    "summary": "Detected possible datasheet, catalog, manual, or specification document.",
                    "url": href,
                    "published": None,            # PDFs rarely expose a date here
                    "discovered_at": today_iso,
                    "category": "Datasheet",
                    "threat_score": score_for(dtxt, dtags),
                    "tags": list(set(dtags + ["PDF/datasheet"])),
                })
    except Exception as e:
        print(f"Page scan failed for {vendor} {url}: {e}")
    return items[:20]


def dedupe(items):
    seen, out = set(), []
    for i in items:
        key = (i.get("url") or i.get("title", ""))[:220]
        if key and key not in seen:
            seen.add(key)
            out.append(i)
    return out


def main():
    cfg = yaml.safe_load(CONFIG.read_text())
    all_items = []
    for v in cfg.get("vendors", []):
        name = v["name"]
        print("Collecting", name)
        for q in v.get("queries", []):
            all_items.extend(google_news(name, q))
        for p in v.get("pages", []):
            all_items.extend(page_scan(name, p))

    data = {
        "generated_at": datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z",
        "window_days": 60,
        "items": dedupe(all_items),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    print(f"Wrote {len(data['items'])} items to {OUT}")


if __name__ == "__main__":
    main()
