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


def resolve_article_url(google_url):
    """
    Google News RSS links are redirect wrappers on news.google.com. Resolve them to
    the real publisher article URL so 'Open source' lands on the actual article.
    Falls back to the original link if resolution fails.
    """
    if not google_url or "news.google.com" not in google_url:
        return google_url
    try:
        # Some wrappers carry the destination in a ?url= param.
        parsed = urllib.parse.urlparse(google_url)
        qs = urllib.parse.parse_qs(parsed.query)
        if "url" in qs and qs["url"]:
            return qs["url"][0]
        # Otherwise follow the redirect chain to the publisher.
        r = requests.get(google_url, timeout=12, allow_redirects=True,
                         headers={"User-Agent": "Mozilla/5.0 competitive-intel-research"})
        if r.url and "news.google.com" not in r.url:
            return r.url
    except Exception as e:
        print(f"Could not resolve article URL ({e}); keeping original.")
    return google_url


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
        link = resolve_article_url(e.get("link", ""))
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


def extract_date(soup):
    """Pull a genuine publish/modified date from common meta tags, or None."""
    for sel, attr in [
        ({"property": "article:published_time"}, "content"),
        ({"property": "article:modified_time"}, "content"),
        ({"name": "date"}, "content"),
        ({"name": "publish-date"}, "content"),
        ({"itemprop": "datePublished"}, "content"),
    ]:
        tag = soup.find("meta", attrs=sel)
        if tag and tag.get(attr):
            return clean(tag.get(attr))
    t = soup.find("time")
    if t and (t.get("datetime") or t.get_text(strip=True)):
        return clean(t.get("datetime") or t.get_text())
    return None


# Link text/href hints that a link is a real article/product/news page worth its own item.
LINK_HINTS = ["news", "press", "release", "product", "recloser", "sensor", "switchgear",
              "article", "story", "announce", "launch", "datasheet", "catalog", "/20"]


def fetch_page_date(href):
    """Best-effort: fetch a linked page just to read its real publish date. Returns ISO-ish string or None."""
    try:
        r = requests.get(href, timeout=10,
                         headers={"User-Agent": "Mozilla/5.0 competitive-intel-research"})
        return extract_date(BeautifulSoup(r.text, "html.parser"))
    except Exception:
        return None


def page_scan(vendor, url):
    """
    Follow the LINKS on a vendor page and emit one item per real article/product/PDF,
    each with its OWN specific URL — so 'Open source' lands on the exact page the
    information came from, not the vendor homepage. The landing/index page itself is
    NOT emitted as an item.
    """
    items = []
    today_iso = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    base_host = urllib.parse.urlparse(url).netloc
    try:
        r = requests.get(url, timeout=15,
                         headers={"User-Agent": "Mozilla/5.0 competitive-intel-research"})
        soup = BeautifulSoup(r.text, "html.parser")

        seen_links = set()
        for a in soup.find_all("a", href=True):
            href = urllib.parse.urljoin(url, a["href"])
            label = clean(a.get_text(" "))
            lower = (href + " " + label).lower()

            # Skip the homepage itself, anchors, mailto, and off-site noise.
            if not href.startswith("http"):
                continue
            if href.rstrip("/") == url.rstrip("/"):
                continue
            if urllib.parse.urlparse(href).netloc and base_host not in urllib.parse.urlparse(href).netloc:
                # allow same-domain only, to stay on the vendor's own content
                continue
            if href in seen_links:
                continue

            is_pdf = href.lower().endswith(".pdf") or any(
                w in lower for w in ["datasheet", "data-sheet", "catalog", "manual", "specification"]
            )
            is_article = any(h in lower for h in LINK_HINTS)

            if not (is_pdf or is_article):
                continue
            if len(label) < 6 and not is_pdf:   # skip bare "Menu"/"More" style links
                continue

            seen_links.add(href)
            text = label or href.split("/")[-1]
            tags = tags_for(text + " " + href)

            if is_pdf:
                items.append({
                    "company": vendor,
                    "title": text,
                    "summary": "Detected datasheet, catalog, manual, or specification document.",
                    "url": href,                       # the exact PDF/document URL
                    "published": None,
                    "discovered_at": today_iso,
                    "category": "Datasheet",
                    "threat_score": score_for(text, tags),
                    "tags": list(set(tags + ["PDF/datasheet"])),
                })
            else:
                items.append({
                    "company": vendor,
                    "title": text,
                    "summary": f"{vendor} update: {text}",
                    "url": href,                       # the exact article/product URL
                    "published": fetch_page_date(href),  # real date from the article itself
                    "discovered_at": today_iso,
                    "category": category_for(tags),
                    "threat_score": score_for(text + " " + href, tags),
                    "tags": tags,
                })

            if len(items) >= 15:                       # cap per vendor page
                break
    except Exception as e:
        print(f"Page scan failed for {vendor} {url}: {e}")
    return items


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