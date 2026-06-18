# GridIntel — MV Competitive Intelligence Dashboard

A competitive-intelligence dashboard for G&W Electric's medium-voltage product lines. It crawls competitor news and product pages daily and presents current developments by product line, benchmarked against G&W.

## What changed in this version

- **Redesigned UI** — control-room / instrument-panel aesthetic (Space Grotesk + JetBrains Mono), threat "bus bar" on each card, gauge-style priority scores.
- **Sections renamed** to product lines: Reclosers, Sensors, Switchgear, Datasheets.
- **Current news only** — items older than 60 days are hidden (`NEWS_WINDOW_DAYS` in `scripts/app.js`).
- **Real publish dates** — cards show when an item was published, not the crawl date. The crawler now parses RSS publish dates into ISO format and tries to read real dates from page metadata. Pages with no real date show "Date unknown" rather than being mislabeled with today's date.
- **Daily crawl** — GitHub Actions runs at 12:00 UTC every day.
- **Specs section** — wired and ready, intentionally empty until spec fields/values are supplied.

## Folder structure (upload exactly like this)

```
repo-root/
├── index.html
├── assets/
│   └── styles.css
├── scripts/
│   ├── app.js
│   ├── update_tracker.py
│   └── requirements.txt
├── config/
│   └── sources.yml
├── data/
│   └── tracker_data.json
└── .github/
    └── workflows/
        └── update-tracker.yml
```

`index.html` must be at the repo root for GitHub Pages. Everything else lives in the folders the code already expects — the previous flat layout was why the live site showed zeros.

## Running the crawler

Automatic: runs daily via GitHub Actions.
Manual: **Actions → Update MV Competitive Tracker → Run workflow**.

## Tuning

- News window: change `NEWS_WINDOW_DAYS` in `scripts/app.js`.
- Vendors/queries/pages: edit `config/sources.yml`.
- Crawl time: edit the `cron` line in `.github/workflows/update-tracker.yml`.
