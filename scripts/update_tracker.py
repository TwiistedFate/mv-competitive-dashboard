"""
MV Competitive Intelligence Crawler
-----------------------------------
Runs on GitHub Actions or locally. It collects public competitive-intelligence
signals from:
  1. Google News RSS searches based on configured queries
  2. Official vendor product/news pages
  3. Sitemaps when listed or discoverable
  4. PDF/datasheet links found on official pages

Output:
  data/tracker_data.json

This is intentionally modular. For a 10-year system, maintain config/sources.yml,
not hard-coded scraper logic.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Tuple
from urllib.parse import quote_plus, urljoin, urlparse

import feedparser
import requests
import yaml
from bs4 import BeautifulSoup
from dateutil import parser as dateparser

ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "config" / "sources.yml"
OUTPUT_PATH = ROOT / "data" / "tracker_data.json"
USER_AGENT = "MVCompetitiveIntelBot/1.0 (+https://github.com/)"
TIMEOUT = 20
MAX_ITEMS_PER_QUERY = 8
MAX_LINKS_PER_PAGE = 35

@dataclass
class TrackerItem:
    id: str
    date: str
    competitor: str
    category: str
    gw_product_line: str
    threat: str
    relevance_score: int
    title: str
    summary: str
    url: str
    source_type: str


def load_config() -> Dict[str, Any]:
    with CONFIG_PATH.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def stable_id(url: str, title: str) -> str:
    return hashlib.sha256((url + "|" + title).encode("utf-8")).hexdigest()[:16]


def clean(text: str) -> str:
    text = re.sub(r"\s+", " ", text or "").strip()
    return text[:600]


def parse_date(value: Optional[str]) -> str:
    if not value:
        return datetime.now(timezone.utc).date().isoformat()
    try:
        return dateparser.parse(value).date().isoformat()
    except Exception:
        return datetime.now(timezone.utc).date().isoformat()


def classify(text: str, config: Dict[str, Any]) -> Tuple[str, str, int, str]:
    blob = text.lower()
    best_cat = "General"
    best_line = "General Competitive Intel"
    score = 10
    for category, info in (config.get("categories") or {}).items():
        hits = sum(1 for kw in info.get("keywords", []) if kw.lower() in blob)
        if hits > 0 and hits * 20 > score:
            score = min(100, hits * 20 + 35)
            best_cat = category
            best_line = info.get("gw_line", best_line)
    threat = "Low"
    high_words = ["launch", "new", "contract", "award", "pilot", "partnership", "sf6-free", "sf6 free", "utility", "deployment", "acquisition"]
    med_words = ["datasheet", "brochure", "specification", "white paper", "report", "webinar"]
    if any(w in blob for w in high_words) and score >= 55:
        threat = "High"
        score = min(100, score + 15)
    elif any(w in blob for w in med_words) or score >= 55:
        threat = "Medium"
        score = min(100, score + 8)
    return best_cat, best_line, score, threat


def make_item(date: str, competitor: str, title: str, summary: str, url: str, source_type: str, config: Dict[str, Any]) -> TrackerItem:
    category, gw_line, score, threat = classify(" ".join([title, summary, url]), config)
    return TrackerItem(
        id=stable_id(url, title),
        date=date,
        competitor=competitor,
        category=category,
        gw_product_line=gw_line,
        threat=threat,
        relevance_score=score,
        title=clean(title),
        summary=clean(summary),
        url=url,
        source_type=source_type,
    )


def fetch_url(url: str) -> Optional[str]:
    try:
        r = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=TIMEOUT)
        if r.status_code >= 400:
            return None
        ctype = r.headers.get("content-type", "")
        if "text" not in ctype and "html" not in ctype and "xml" not in ctype:
            return None
        return r.text
    except Exception as exc:
        print(f"WARN fetch failed {url}: {exc}", file=sys.stderr)
        return None


def collect_google_news(vendor: Dict[str, Any], config: Dict[str, Any]) -> List[TrackerItem]:
    items: List[TrackerItem] = []
    for query in vendor.get("queries", []):
        rss = f"https://news.google.com/rss/search?q={quote_plus(query)}&hl=en-US&gl=US&ceid=US:en"
        feed = feedparser.parse(rss)
        for entry in feed.entries[:MAX_ITEMS_PER_QUERY]:
            title = clean(getattr(entry, "title", ""))
            url = getattr(entry, "link", "")
            summary = BeautifulSoup(getattr(entry, "summary", ""), "html.parser").get_text(" ")
            date = parse_date(getattr(entry, "published", None))
            if title and url:
                items.append(make_item(date, vendor["name"], title, summary, url, "Google News RSS", config))
        time.sleep(0.3)
    return items


def collect_official_pages(vendor: Dict[str, Any], config: Dict[str, Any]) -> List[TrackerItem]:
    items: List[TrackerItem] = []
    for page in vendor.get("official_pages", []):
        html = fetch_url(page)
        if not html:
            continue
        soup = BeautifulSoup(html, "html.parser")
        page_title = clean((soup.title.string if soup.title else "") or page)
        meta_desc = ""
        md = soup.find("meta", attrs={"name":"description"})
        if md and md.get("content"):
            meta_desc = md.get("content")
        items.append(make_item(datetime.now(timezone.utc).date().isoformat(), vendor["name"], page_title, meta_desc or f"Official monitored vendor page: {page}", page, "Official Page", config))

        # Pull important links: PDFs, news, product pages, datasheets.
        seen_links = set()
        for a in soup.find_all("a", href=True):
            href = urljoin(page, a["href"])
            text = clean(a.get_text(" "))
            blob = f"{href} {text}".lower()
            if href in seen_links:
                continue
            if any(k in blob for k in ["pdf", "datasheet", "data sheet", "brochure", "specification", "product", "news", "press", "recloser", "switchgear", "sensor", "sf6"]):
                seen_links.add(href)
                items.append(make_item(datetime.now(timezone.utc).date().isoformat(), vendor["name"], text or href.split("/")[-1], f"Link discovered from official vendor page: {page}", href, "Official Link Discovery", config))
            if len(seen_links) >= MAX_LINKS_PER_PAGE:
                break
        time.sleep(0.4)
    return items


def collect_sitemap(vendor: Dict[str, Any], config: Dict[str, Any]) -> List[TrackerItem]:
    items: List[TrackerItem] = []
    candidates = list(vendor.get("sitemaps", []) or [])
    for page in vendor.get("official_pages", [])[:1]:
        parsed = urlparse(page)
        candidates.append(f"{parsed.scheme}://{parsed.netloc}/sitemap.xml")
    for sm in candidates:
        xml = fetch_url(sm)
        if not xml:
            continue
        soup = BeautifulSoup(xml, "xml")
        locs = [loc.get_text(strip=True) for loc in soup.find_all("loc")]
        keywords = [kw.lower() for cat in (config.get("categories") or {}).values() for kw in cat.get("keywords", [])]
        count = 0
        for loc in locs:
            blob = loc.lower()
            if any(k.replace(" ", "-") in blob or k in blob for k in keywords):
                title = loc.rstrip("/").split("/")[-1].replace("-", " ").replace("_", " ").title()
                items.append(make_item(datetime.now(timezone.utc).date().isoformat(), vendor["name"], title, f"Relevant URL found in vendor sitemap: {sm}", loc, "Sitemap", config))
                count += 1
            if count >= 40:
                break
        time.sleep(0.3)
    return items


def dedupe_sort(items: Iterable[TrackerItem]) -> List[TrackerItem]:
    by_id: Dict[str, TrackerItem] = {}
    for item in items:
        if item.id not in by_id or item.relevance_score > by_id[item.id].relevance_score:
            by_id[item.id] = item
    return sorted(by_id.values(), key=lambda x: (x.date, x.relevance_score), reverse=True)


def main() -> None:
    config = load_config()
    all_items: List[TrackerItem] = []
    source_names: List[str] = []
    for vendor in config.get("vendors", []):
        print(f"Collecting: {vendor['name']}")
        source_names.append(vendor["name"])
        all_items.extend(collect_google_news(vendor, config))
        all_items.extend(collect_official_pages(vendor, config))
        all_items.extend(collect_sitemap(vendor, config))
    sorted_items = dedupe_sort(all_items)
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
        "sources": source_names,
        "items": [asdict(x) for x in sorted_items[:600]],
    }
    with OUTPUT_PATH.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(payload['items'])} items to {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
