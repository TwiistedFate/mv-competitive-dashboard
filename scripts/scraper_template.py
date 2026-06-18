"""
Starter scraper template for the MV Competitive Intelligence Dashboard.
Use this for official pages, vendor press pages, and datasheet discovery.

Important: respect robots.txt, site terms, and copyright. Prefer official RSS feeds,
press-release pages, datasheet URLs, and manual review over aggressive scraping.
"""
from __future__ import annotations
import json, re, time
from dataclasses import dataclass, asdict
from pathlib import Path
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup

HEADERS = {"User-Agent": "MV-Competitive-Research-Dashboard/0.1"}

WATCH_URLS = [
    "https://www.gwelectric.com/",
    "https://www.sandc.com/",
    "https://new.abb.com/medium-voltage",
    "https://www.eaton.com/",
    "https://www.siemens.com/",
    "https://www.se.com/",
    "https://www.nojapower.com/",
    "https://www.hubbell.com/",
    "https://lindsey-usa.com/",
]

KEYWORDS = ["recloser", "switchgear", "sensor", "voltage sensor", "current sensor", "SF6-free", "datasheet", "specification", "medium voltage"]

@dataclass
class Finding:
    source_url: str
    title: str
    url: str
    matched_keyword: str
    kind: str


def fetch(url: str) -> str:
    r = requests.get(url, headers=HEADERS, timeout=20)
    r.raise_for_status()
    return r.text


def scan_page(url: str) -> list[Finding]:
    html = fetch(url)
    soup = BeautifulSoup(html, "html.parser")
    findings: list[Finding] = []
    for a in soup.find_all("a", href=True):
        text = " ".join(a.get_text(" ").split())
        href = urljoin(url, a["href"])
        blob = f"{text} {href}".lower()
        for kw in KEYWORDS:
            if kw.lower() in blob:
                kind = "PDF / datasheet" if href.lower().endswith(".pdf") or "datasheet" in blob else "web page"
                findings.append(Finding(url, text or href, href, kw, kind))
                break
    return findings


def main() -> None:
    all_findings: list[Finding] = []
    for url in WATCH_URLS:
        try:
            print(f"Scanning {url}")
            all_findings.extend(scan_page(url))
            time.sleep(1)
        except Exception as exc:
            print(f"Failed {url}: {exc}")
    out = Path("scraper_findings.json")
    out.write_text(json.dumps([asdict(f) for f in all_findings], indent=2), encoding="utf-8")
    print(f"Wrote {out} with {len(all_findings)} findings")

if __name__ == "__main__":
    main()
