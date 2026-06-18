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
    "Cable impact": ["cable", "accessory", "accessories", "termination", "splice", "joint", "elbow", "separable connector", "deadbreak", "loadbreak", "link box"],
    "PDF/datasheet": ["pdf", "datasheet", "data sheet", "catalog", "manual", "specification"],
}

# The four product domains that qualify an item for the Threat track.
PRODUCT_DOMAINS = {
    "Reclosers": ["recloser", "intellirupter", "pulseclos", "pulse-closing", "osm", "fault isolation", "viper", "rer", "cooper recloser"],
    "Switchgear": ["sf6", "sf6-free", "switchgear", "rmu", "ring main", "solid dielectric", "airset", "xiria", "trident", "safering", "8djh"],
    "Voltage sensors": ["voltage sensor", "current sensor", "sensor", "power quality", "grid edge", "grid-edge", "flisr", "elbowsense", "keva", "vls", "accusense", "gen2"],
    "Cables & accessories": ["cable", "termination", "splice", "joint", "elbow", "separable connector", "deadbreak", "loadbreak", "link box", "accessor"],
}

# Signals that an item is a NEW innovation / invention / study (qualifies for Threat track).
INNOVATION_SIGNALS = [
    "launch", "launches", "launched", "new product", "unveil", "unveils", "unveiled",
    "introduce", "introduces", "introduced", "patent", "patented", "invention", "invents",
    "invented", "breakthrough", "first", "next-generation", "next generation",
    "study", "studies", "research", "white paper", "whitepaper", "paper", "trial", "pilot",
    "prototype", "develops", "developed", "developing", "innovation", "innovative",
    "debut", "debuts", "release", "releases", "released", "announces", "announced", "new ",
]

# Stronger signals that earn the +1 bump on top of the recency base.
STRONG_SIGNALS = ["launch", "patent", "new product", "invention", "breakthrough", "unveil", "debut"]

# Signals that an item is PURE market information (Market Insight track, no threat score).
MARKET_SIGNALS = [
    "market size", "market growth", "market share", "cagr", "forecast", "market report",
    "market research", "market value", "revenue", "valuation", "billion", "million by",
    "compound annual", "market outlook", "industry report", "market analysis", "market trends",
    "projected to reach", "expected to grow", "market overview",
]


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
    if "Cable impact" in tags: return "Cables & accessories"
    return "Market Update"


def product_domain(text):
    """Return the matching product domain name, or None if the item isn't product-related."""
    t = text.lower()
    for domain, words in PRODUCT_DOMAINS.items():
        if any(w in t for w in words):
            return domain
    return None


def has_any(text, words):
    t = text.lower()
    return any(w in t for w in words)


def months_between(published_iso, captured_iso):
    """Whole-month gap (integer, >=0) between publish and capture date. Falls back to 0 if unknown."""
    try:
        p = datetime.datetime.fromisoformat(published_iso.replace("Z", "+00:00"))
        c = datetime.datetime.fromisoformat(captured_iso.replace("Z", "+00:00"))
        days = (c - p).days
        # Month buckets: 0-30d = month 1, 31-60d = month 2, etc.
        return max(0, (days // 30))
    except Exception:
        return 0


def classify(text, published_iso, captured_iso):
    """
    Three-bucket classifier.

    Returns a dict: {bucket, threat_score, domain}
      - bucket "Threat":        product-domain item that is a new innovation/invention/study.
                                score = 8 - 0.5*(months-1), floored at 1, +1 for strong signals, cap 10.
      - bucket "Market Insight": pure market info (growth, CAGR, size, forecast). No score.
      - bucket "Alert":         product-relevant but routine (e.g. datasheet revision, certification). No score.
    """
    domain = product_domain(text)
    is_innovation = has_any(text, INNOVATION_SIGNALS)
    is_market = has_any(text, MARKET_SIGNALS)

    # Market info that isn't a product innovation -> Market Insight, no score.
    if is_market and not (domain and is_innovation):
        return {"bucket": "Market Insight", "threat_score": None, "domain": domain}

    # Product innovation/invention/study -> Threat, recency-scored.
    if domain and is_innovation:
        months = months_between(published_iso, captured_iso) if published_iso else 0
        # months is a 0-based bucket: 0 = within 1 month (=8), each later month -0.5.
        score = 8.0 - 0.5 * months
        score = max(1.0, score)
        if has_any(text, STRONG_SIGNALS):
            score = min(10.0, score + 1.0)
        return {"bucket": "Threat", "threat_score": round(score, 1), "domain": domain}

    # Product-relevant but routine (revision, certification, generic mention) -> Alert, no score.
    if domain:
        return {"bucket": "Alert", "threat_score": None, "domain": domain}

    # Anything else with no product domain and no market signal -> treat as Alert (low-relevance watch item).
    return {"bucket": "Alert", "threat_score": None, "domain": None}


def to_iso(struct_time):
    """Convert a feedparser time.struct_time (UTC) to an ISO-8601 string, or None."""
    if not struct_time:
        return None
    try:
        ts = calendar.timegm(struct_time)
        return datetime.datetime.utcfromtimestamp(ts).replace(microsecond=0).isoformat() + "Z"
    except Exception:
        return None


def google_news(vendor, query, captured_iso):
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
        cls = classify(text, published_iso, captured_iso)
        items.append({
            "company": vendor,
            "title": title,
            "summary": summary or query,
            "url": link,
            "published": published_iso,           # real publish date (ISO) or None
            "category": category_for(tags),
            "bucket": cls["bucket"],              # Threat | Alert | Market Insight
            "threat_score": cls["threat_score"],  # number or None
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
                # A datasheet/catalog/manual is product-relevant but routine -> Alert by default,
                # unless its text signals a genuine innovation/study (then classify promotes it).
                cls = classify(text + " " + href, None, today_iso)
                if cls["bucket"] == "Market Insight":
                    cls = {"bucket": "Alert", "threat_score": None}  # a PDF is not market data
                items.append({
                    "company": vendor,
                    "title": text,
                    "summary": "Detected datasheet, catalog, manual, or specification document.",
                    "url": href,                       # the exact PDF/document URL
                    "published": None,
                    "discovered_at": today_iso,
                    "category": "Datasheet",
                    "bucket": cls["bucket"],
                    "threat_score": cls["threat_score"],
                    "tags": list(set(tags + ["PDF/datasheet"])),
                })
            else:
                page_date = fetch_page_date(href)      # real date from the article itself
                cls = classify(text + " " + href, page_date, today_iso)
                items.append({
                    "company": vendor,
                    "title": text,
                    "summary": f"{vendor} update: {text}",
                    "url": href,                       # the exact article/product URL
                    "published": page_date,
                    "discovered_at": today_iso,
                    "category": category_for(tags),
                    "bucket": cls["bucket"],
                    "threat_score": cls["threat_score"],
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
    captured_iso = datetime.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
    all_items = []
    for v in cfg.get("vendors", []):
        name = v["name"]
        print("Collecting", name)
        for q in v.get("queries", []):
            all_items.extend(google_news(name, q, captured_iso))
        for p in v.get("pages", []):
            all_items.extend(page_scan(name, p))

    data = {
        "generated_at": captured_iso,
        "window_days": 60,
        "items": dedupe(all_items),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    print(f"Wrote {len(data['items'])} items to {OUT}")


if __name__ == "__main__":
    main()
