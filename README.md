# MV Competitive Intelligence Dashboard

This is a long-term GitHub Pages-compatible competitive intelligence system for tracking medium-voltage equipment competitors against G&W Electric product lines.

## What it does

The system monitors public sources and produces a dashboard for:

- Viper recloser competitive moves
- AccuSense sensor competitive moves
- Trident / SF6-free switchgear competitive moves
- CLiP / fault-current limiting competitive moves
- Grid-edge software and automation moves
- Datasheets, product pages, PDFs, press releases, and news

## Architecture

```text
config/sources.yml
      ↓
scripts/update_tracker.py
      ↓
data/tracker_data.json
      ↓
index.html + scripts/app.js
      ↓
GitHub Pages dashboard
```

## How to deploy on GitHub Pages

1. Upload the **contents** of this folder to the root of your GitHub repo.
2. Go to **Settings → Pages**.
3. Set:
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / root
4. Save.
5. Your site will be at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

## How to run the crawler manually

In GitHub:

1. Go to the **Actions** tab.
2. Click **Update MV Competitive Tracker**.
3. Click **Run workflow**.
4. Wait for it to finish.
5. Refresh the dashboard.

## How to run locally

```bash
pip install -r scripts/requirements.txt
python scripts/update_tracker.py
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How to add sources

Edit:

```text
config/sources.yml
```

Add vendors, official pages, RSS feeds, sitemap URLs, and search queries.

## Important limitations

This system uses public web sources and RSS-style monitoring. It does not bypass paywalls, log into private systems, or scrape restricted websites. Some vendors block automated fetching. That is normal.

For enterprise use, add:

- SerpAPI / Bing Search API / Google Programmable Search
- OpenAI API summarization and threat classification
- PostgreSQL or Supabase database
- PDF text extraction
- deduplication history
- human review workflow
- email/Slack alerts

This starter system is intentionally open, maintainable, and easy to run for years.
