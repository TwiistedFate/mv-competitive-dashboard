import json, re, datetime, urllib.parse, calendar
from pathlib import Path
import requests, yaml, feedparser
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config" / "sources.yml"
OUT = ROOT / "data" / "tracker_data.json"

KEYWORDS = {
    "Viper impact": ["recloser", "intellirupter", "tripsaver", "pulseclos", "fault isolation", "protection", "osm recloser", "nova recloser"],
    "AccuSense impact": ["sensor", "voltage sensor", "current sensor", "grid edge", "power quality", "keva", "vls", "elbowsense", "gen2", "instrument transformer"],
    "Trident impact": ["sf6", "sf6-free", "switchgear", "rmu", "ring main", "solid dielectric", "airset", "xiria", "blue gis", "clean air", "safering", "dry air"],
    "Cable impact": ["cable", "accessory", "accessories", "termination", "splice", "joint", "elbow", "separable connector", "deadbreak", "loadbreak", "link box"],
    "FCL impact": ["fault current limiter", "is-limiter", "current limiter", "current-limiting", "clip", "let-through", "limiting reactor"],
    "Software impact": ["adms", "derms", "flisr", "self-healing", "grid software", "distribution management", "ecostruxure", "intelliteam", "ability", "outage management", "scada"],
    "PDF/datasheet": ["pdf", "datasheet", "data sheet", "catalog", "manual", "specification"],
}

# The product domains that qualify an item for the Threat track.
PRODUCT_DOMAINS = {
    "Reclosers": ["recloser", "intellirupter", "tripsaver", "pulseclos", "pulse-closing", "osm", "fault isolation", "viper", "rer", "cooper recloser", "nova recloser", "easergy"],
    "Switchgear": ["sf6", "sf6-free", "switchgear", "rmu", "ring main", "solid dielectric", "airset", "xiria", "trident", "safering", "8djh", "nxplus", "blue gis", "clean air", "dry air"],
    "Voltage sensors": ["voltage sensor", "current sensor", "sensor", "power quality", "grid edge", "grid-edge", "elbowsense", "keva", "vls", "accusense", "gen2", "instrument transformer"],
    "Cables & accessories": ["cable", "termination", "splice", "joint", "elbow", "separable connector", "deadbreak", "loadbreak", "link box", "accessor"],
    "Fault current limiters": ["fault current limiter", "is-limiter", "current limiter", "current-limiting", "clip", "let-through", "limiting reactor"],
    "Grid software": ["adms", "derms", "flisr", "self-healing", "grid software", "distribution management", "ecostruxure", "intelliteam", "ability grid", "outage management"],
}

# Innovation VERBS — these signal a new development, but only count when paired with a product noun.
INNOVATION_VERBS = [
    "launch", "launches", "launched", "unveil", "unveils", "unveiled",
    "introduce", "introduces", "introduced", "patent", "patented", "invents",
    "invented", "develops", "developed", "developing", "debut", "debuts",
    "release", "releases", "released", "new", "next-generation", "next generation",
    "breakthrough", "prototype", "innovation", "innovative", "first",
]

# Concrete PRODUCT NOUNS — a real piece of MV equipment. Innovation only counts with one of these.
PRODUCT_NOUNS = [
    "recloser", "reclosers", "intellirupter", "tripsaver", "switchgear", "rmu", "ring main unit",
    "sensor", "sensors", "voltage sensor", "current sensor", "cable", "termination",
    "splice", "joint", "elbow", "separable connector", "circuit breaker", "breaker",
    "fault current limiter", "is-limiter", "current limiter", "limiter", "panel", "viper",
    "trident", "accusense", "clip", "airset", "xiria", "safering", "pulsecloser", "8djh",
    "nxplus", "blue gis", "vls", "keva", "elbowsense", "easergy", "ecostruxure", "intelliteam",
]

# Words that signal a STUDY/RESEARCH PAPER (counts as innovation only if a product noun is also present).
STUDY_SIGNALS = ["study", "studies", "research paper", "white paper", "whitepaper",
                 "journal", "peer-reviewed", "findings", "test results", "trial", "pilot"]

# DISQUALIFYING NOUNS — if any appears, the item is NOT a product innovation (blocks the Threat track),
# even if an innovation verb and a product noun are present. These are corporate/marketing artifacts.
DISQUALIFYING_NOUNS = [
    "community", "research community", "award", "awards", "anniversary", "campaign",
    "portal", "website", "web site", "survey", "blog", "podcast", "webinar", "newsletter",
    "initiative", "program", "programme", "partnership", "collaboration", "framework",
    "agreement", "conference", "tradeshow", "trade show", "booth", "exhibition",
    "celebrates", "celebrating", "years of", "milestone", "appoints", "appointment",
    "hires", "names", "scholarship", "grant program", "foundation", "sponsorship",
]

# Stronger verbs that earn the +1 bump (only applied once an item already qualifies as a Threat).
STRONG_SIGNALS = ["launch", "patent", "unveil", "invents", "invented", "breakthrough", "debut"]

# HARD market signals — explicit market reports/forecasts AND unambiguous corporate news.
# These ALWAYS mean Market Insight, even if innovation-ish words also appear.
HARD_MARKET_SIGNALS = [
    "market size", "market growth", "market share", "cagr", "market report",
    "market research", "market value", "market forecast", "market outlook",
    "compound annual", "industry report", "market analysis", "market trends",
    "projected to reach", "expected to grow", "market overview", "billion by",
    "to hit around", "market to witness", "industry share",
    # unambiguous corporate/business events (never a product innovation)
    "framework agreement", "renew", "acquires", "acquisition", "celebrates",
    "anniversary", "years of", "auction", "stock", "earnings",
]

# SOFT signals — business news. Market Insight ONLY if the item isn't a product innovation.
SOFT_MARKET_SIGNALS = [
    "invests", "investment", "expands manufacturing", "expand manufacturing",
    "manufacturing operations", "partnership", "partner ", "community", "initiative",
    "collaboration", "award", "appoints", "hires",
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
    if "FCL impact" in tags: return "Fault current limiters"
    if "Software impact" in tags: return "Grid software"
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


def is_product_innovation(text):
    """
    A REAL product innovation requires an innovation verb (or study signal) paired with a
    concrete product noun — and NO disqualifying noun present. This is the combination rule:
    a single word like 'launches' is not enough; it must be 'launches [a recloser]', not
    'launches [a community]'.
    """
    t = text.lower()

    # Disqualifier wins: community / award / partnership / anniversary etc. -> never a product innovation.
    if any(n in t for n in DISQUALIFYING_NOUNS):
        return False

    has_product_noun = any(n in t for n in PRODUCT_NOUNS)
    if not has_product_noun:
        return False  # no real equipment mentioned -> not a product innovation

    has_verb = any(v in t for v in INNOVATION_VERBS)
    has_study = any(s in t for s in STUDY_SIGNALS)

    # Innovation verb + product noun, OR study signal + product noun.
    return has_verb or has_study


def classify(text, published_iso, captured_iso):
    """
    Three-bucket classifier.

    Returns a dict: {bucket, threat_score, domain}
      - "Threat":         innovation VERB + real PRODUCT NOUN, with no disqualifying noun (recency-scored).
      - "Market Insight": market reports/forecasts, or corporate/business news (community, award, M&A, etc.).
      - "Alert":          product-relevant but routine (datasheet, certification, generic page), or low-relevance.
    """
    domain = product_domain(text)
    is_innovation = is_product_innovation(text)           # NEW: requires the verb+noun combination
    is_hard_market = has_any(text, HARD_MARKET_SIGNALS)   # "market size", "CAGR", "forecast" -> always market
    is_soft_market = has_any(text, SOFT_MARKET_SIGNALS)   # "invests", "partnership", "community" -> market if not innovation

    # 1. Hard market language ALWAYS wins — these are market reports/corporate events, period.
    if is_hard_market:
        return {"bucket": "Market Insight", "threat_score": None, "domain": domain}

    # 2. Genuine product innovation (verb + product noun, no disqualifier) -> Threat, recency-scored.
    if domain and is_innovation:
        months = months_between(published_iso, captured_iso) if published_iso else 0
        score = 8.0 - 0.5 * months           # month bucket 0 = within 1 month = 8
        score = max(1.0, score)
        if has_any(text, STRONG_SIGNALS):
            score = min(10.0, score + 1.0)
        return {"bucket": "Threat", "threat_score": round(score, 1), "domain": domain}

    # 3. Soft business/corporate news that's NOT a product innovation -> Market Insight.
    if is_soft_market:
        return {"bucket": "Market Insight", "threat_score": None, "domain": domain}

    # 4. Product-relevant but routine -> Alert.
    if domain:
        return {"bucket": "Alert", "threat_score": None, "domain": domain}

    # 5. Everything else -> Alert (low-relevance watch item).
    return {"bucket": "Alert", "threat_score": None, "domain": None}


def relevance_score(text, published_iso, captured_iso, bucket, url=""):
    """
    Composite relevance for the Competitor Deep-Dive (relevance first, date as tiebreak).
    Higher = more relevant. Combines: product-domain match, bucket weight, recency, source quality.
    """
    t = (text + " " + url).lower()
    score = 0.0

    # Product-domain match — is this actually about MV equipment we care about?
    if product_domain(text):
        score += 4.0
    if any(n in t for n in PRODUCT_NOUNS):
        score += 2.0

    # Bucket weight — a real product threat outranks routine/market noise.
    score += {"Threat": 4.0, "Market Insight": 1.5, "Alert": 0.5}.get(bucket, 0.0)

    # Recency bonus — newer is more relevant, scaled gently so it stays a tiebreaker, not the driver.
    if published_iso:
        try:
            p = datetime.datetime.fromisoformat(published_iso.replace("Z", "+00:00"))
            c = datetime.datetime.fromisoformat(captured_iso.replace("Z", "+00:00"))
            days = max(0, (c - p).days)
            score += max(0.0, 3.0 - (days / 180.0))   # ~3 pts when fresh, fading over ~18 months
        except Exception:
            pass

    # Source quality — real publisher article/press release beats a scraped nav fragment.
    if "news.google.com" not in url and url.startswith("http"):
        score += 1.0
    if any(s in t for s in ["press", "news", "newsroom", "release", "announce"]):
        score += 1.0
    # Penalize obvious nav/listing fragments.
    if any(j in t for j in ["learn more", "read more", "products/?c=", "all-products", "/cl/"]):
        score -= 3.0

    return round(score, 2)


def to_iso(struct_time):
    """Convert a feedparser time.struct_time (UTC) to an ISO-8601 string, or None."""
    if not struct_time:
        return None
    try:
        ts = calendar.timegm(struct_time)
        return datetime.datetime.utcfromtimestamp(ts).replace(microsecond=0).isoformat() + "Z"
    except Exception:
        return None


def google_news(vendor, query, captured_iso, deep=False):
    """
    RSS items carry their REAL publish date — kept as ISO, never the crawl date.
    When deep=True, also issue date-bounded queries to reach ~2 years back, since a single
    Google News RSS pull only returns recent items. Google News supports an 'after:'/'before:'
    operator we can append to widen historical coverage.
    """
    queries = [query]
    if deep:
        # Add half-year windows going back 2 years for historical depth.
        today = datetime.datetime.utcnow().date()
        for back in range(1, 5):  # 4 windows of ~6 months = ~2 years
            end = today - datetime.timedelta(days=180 * (back - 1))
            start = today - datetime.timedelta(days=180 * back)
            queries.append(f"{query} after:{start.isoformat()} before:{end.isoformat()}")

    items = []
    seen_titles = set()
    for qstr in queries:
        q = urllib.parse.quote_plus(qstr)
        url = f"https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en"
        try:
            feed = feedparser.parse(url)
        except Exception as e:
            print(f"  RSS error for '{qstr}': {e}")
            continue
        cap = 12 if deep else 8
        for e in feed.entries[:cap]:
            title = clean(e.get("title"))
            if title in seen_titles:
                continue
            seen_titles.add(title)
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
                "source": source_name(link),
                "published": published_iso,
                "category": category_for(tags),
                "bucket": cls["bucket"],
                "threat_score": cls["threat_score"],
                "relevance": relevance_score(text, published_iso, captured_iso, cls["bucket"], link),
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


def extract_description(soup):
    """
    Pull a real one- or two-sentence description for the item, in priority order:
    og:description -> twitter:description -> <meta name=description> -> first
    substantial <p>. Gives the dashboard a meaningful summary instead of just the
    link text. Returns a trimmed string (<=300 chars) or None.
    """
    for sel, attr in [
        ({"property": "og:description"}, "content"),
        ({"name": "twitter:description"}, "content"),
        ({"name": "description"}, "content"),
    ]:
        tag = soup.find("meta", attrs=sel)
        if tag and tag.get(attr):
            txt = clean(tag.get(attr))
            if len(txt) >= 40:
                return txt[:300]
    # Fall back to the first paragraph that reads like prose, not navigation.
    for p in soup.find_all("p"):
        txt = clean(p.get_text(" "))
        if len(txt) >= 80 and " " in txt:
            return txt[:300]
    return None


def source_name(url):
    """Human-readable publisher/source from a URL host, e.g. 'sandc.com'."""
    try:
        host = urllib.parse.urlparse(url).netloc.lower()
        return host[4:] if host.startswith("www.") else host
    except Exception:
        return ""


def fetch_page_meta(href):
    """
    Best-effort single fetch of a linked page returning BOTH its real publish date
    and a description, so 'Open source' lands on the exact page and the dashboard
    shows a useful summary. Returns {"date": ..., "description": ...}.
    """
    try:
        r = requests.get(href, timeout=10,
                         headers={"User-Agent": "Mozilla/5.0 competitive-intel-research"})
        soup = BeautifulSoup(r.text, "html.parser")
        return {"date": extract_date(soup), "description": extract_description(soup)}
    except Exception:
        return {"date": None, "description": None}


# Link text/href hints that a link is a real article/product/news page worth its own item.
LINK_HINTS = ["news", "press", "release", "product", "recloser", "sensor", "switchgear",
              "article", "story", "announce", "launch", "datasheet", "catalog", "/20"]


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
            # A non-PDF link qualifies only if it's clearly MV-relevant: it must hit a real
            # product domain (recloser/switchgear/sensor/cable) OR sit on a news/press path.
            is_news_path = any(h in href.lower() for h in ["/news", "/press", "/media", "/article", "/resources"])
            is_mv_relevant = product_domain(label + " " + href) is not None
            is_article = is_news_path or is_mv_relevant

            if not (is_pdf or is_article):
                continue
            # Drop obvious navigation/marketing fragments and generic CTAs.
            JUNK = ["start free trial", "learn more", "read more", "read the story",
                    "explore", "go to", "discover", "sign in", "log in", "contact",
                    "subscribe", "newsletter", "cookie", "privacy", "terms", "menu"]
            label_l = label.lower().strip()
            if label_l in JUNK or len(label) < 8:
                continue
            # Require the LABEL itself (not just the URL) to carry MV meaning, unless it's a PDF.
            if not is_pdf and product_domain(label) is None and not is_news_path:
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
                    "source": source_name(href),
                    "published": None,
                    "discovered_at": today_iso,
                    "category": "Datasheet",
                    "bucket": cls["bucket"],
                    "threat_score": cls["threat_score"],
                    "relevance": relevance_score(text + " " + href, None, today_iso, cls["bucket"], href),
                    "tags": list(set(tags + ["PDF/datasheet"])),
                })
            else:
                meta = fetch_page_meta(href)           # real date + description from the article itself
                page_date = meta["date"]
                summary = meta["description"] or f"{vendor} update: {text}"
                cls = classify(f"{text} {summary} {href}", page_date, today_iso)
                items.append({
                    "company": vendor,
                    "title": text,
                    "summary": summary,
                    "url": href,                       # the exact article/product URL
                    "source": source_name(href),
                    "published": page_date,
                    "discovered_at": today_iso,
                    "category": category_for(tags),
                    "bucket": cls["bucket"],
                    "threat_score": cls["threat_score"],
                    "relevance": relevance_score(f"{text} {summary} {href}", page_date, today_iso, cls["bucket"], href),
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
            # deep=True pulls ~2 years of history per query for the Competitor Deep-Dive view.
            all_items.extend(google_news(name, q, captured_iso, deep=True))
        for p in v.get("pages", []):
            all_items.extend(page_scan(name, p))

    data = {
        "generated_at": captured_iso,
        "window_days": 60,         # default dashboard "current" window
        "deep_window_days": 730,   # Competitor Deep-Dive window (~2 years)
        "items": dedupe(all_items),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False))
    print(f"Wrote {len(data['items'])} items to {OUT}")


if __name__ == "__main__":
    main()
