# MV Competitive Intelligence Dashboard

This is a local Chrome-style dashboard for quickly comparing G&W Electric's MV product line against competitors.

## How to open

Best option:

```bash
cd mv_chrome_dashboard
python -m http.server 8000
```

Then open Chrome and go to:

```text
http://localhost:8000
```

You can also double-click `index.html`, but Chrome may block loading `data/seed_data.json` depending on your settings.

## What it includes

- Overview dashboard
- Product line cards
- Search and category filters
- Comparison matrix
- CSV export
- News/update tracker
- Source watchlist
- Starter scraper template

## How to add more competitors

Edit:

```text
data/seed_data.json
```

Add entries under `products`, `news`, and `sources`.

## Important note

This does not scrape the entire internet automatically. That would be unreliable and legally risky. The recommended workflow is to track official vendor pages, datasheets, press releases, regulatory updates, and trusted industry news, then review findings before adding them to the dashboard.
