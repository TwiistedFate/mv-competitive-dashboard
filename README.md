# GridIntel — MV Competitive Intelligence Dashboard

A clean, modern dashboard for tracking competitors across medium-voltage product
lines: switchgear, reclosers, sensors, cable accessories, fault current limiters,
and grid software. Compare specs, read competitor profiles, browse news, and see
structured AI summaries — all at a glance.

**Built to be simple:** plain HTML/CSS/JavaScript. **No build step, no Node.js,
no frameworks.** You can open it by double-clicking `index.html`, and you deploy
it by pushing files to GitHub Pages.

---

## 1. Quick start

- **To view it locally:** double-click `index.html` (or right-click → open in a
  browser). Everything runs in the browser.
- **To edit the content:** open the files in the `data/` folder in any text
  editor (Notepad, VS Code, etc.) and follow the comments at the top of each file.

> Tip: if your browser ever blocks local files, run a tiny local server instead:
> open a terminal in this folder and run `python -m http.server`, then visit
> `http://localhost:8000`.

---

## 2. What's in the box

```
mv-competitive-dashboard/
├── index.html              ← the page shell (rarely needs editing)
├── assets/
│   ├── styles.css          ← all styling / theme (colors live at the top)
│   ├── lib.js              ← shared helpers, icons, filters (plumbing)
│   ├── pages.js            ← one function per page/view
│   └── app.js              ← routing + navigation + wiring
├── data/                   ← 👉 THIS is what you edit
│   ├── categories.js       ← product categories + spec-table columns
│   ├── competitors.js      ← competitor profiles
│   ├── products.js         ← products + specifications
│   ├── news.js             ← news / articles / announcements
│   └── ai-summaries.js     ← structured AI summaries
└── README.md
```

The app is **data-driven**: the homepage cards, counts, tables, filters, and
nav are all generated from the files in `data/`. Add data, and the UI updates
itself — you don't touch the page code.

---

## 3. Features

- **Overview dashboard** — KPI tiles, a card per product category (with
  competitor/product/news counts and top competitors), priority updates, and an
  activity-by-category chart.
- **Category pages** — key trends, a **sortable / searchable / filterable spec
  comparison table** (your products highlighted), key differentiators, a
  competitor SWOT snapshot, and recent news.
- **Competitor profiles** — overview, products offered, strengths, weaknesses,
  partnerships, new-product announcements, strategic direction, useful links,
  and an AI-summary section.
- **News & articles** — every item with company, category, date, source link,
  tags, threat level, and an expandable AI summary.
- **AI summaries** — the analyst template: *what happened · why it matters ·
  product impact · threat level · recommended action.*
- **Search & filters** — global search plus per-page filters for company,
  region, technology, voltage class, application, date, and threat level.

---

## 4. How to update the data

Open the relevant file in `data/`. Each file has a header comment explaining the
fields. The golden rules:

1. Items are JavaScript objects inside an array. **Copy an existing block,**
   change the values, and keep the commas between items.
2. **IDs must be unique** within their file and are how files reference each
   other (e.g. a product's `competitorId` must match a competitor's `id`, and a
   product's `category` must match a category's `id`).
3. Save the file and refresh the browser. That's it.

### Add a competitor → `data/competitors.js`
Copy a block, give it a unique `id`, set `threatLevel` (`"High"`/`"Medium"`/
`"Low"`) and `categories` (ids from `categories.js`). Empty arrays are fine —
empty sections just hide themselves.

### Add a product / specs → `data/products.js`
Set `competitorId` and `category`. Put rating values in the `specs` object — the
**keys inside `specs` must match the `specColumns` keys** for that category (see
`categories.js`). That's how columns line up in the comparison table.
`technology`, `voltageClass`, and `applications` power the filters.

### Add news → `data/news.js`
Set `companyId`, `category`, an ISO `date` (`"YYYY-MM-DD"`), `threatLevel`,
`region`, and `tags`. Optionally link a structured summary with `aiSummaryId`.

### Add an AI summary → `data/ai-summaries.js`
Fill in `whatHappened`, `whyItMatters`, `productImpact`, `threatLevel`, and
`recommendedAction`, give it a unique `id`, then reference that id from a news
item's `aiSummaryId`.

### Add a product category → `data/categories.js`
Give it a unique `id`, pick an `icon` (keys are listed in `assets/lib.js`), and
define `specColumns` to control the comparison-table columns. New categories
appear in the nav and on the homepage automatically.

> ⚠️ The sample competitor specs are **illustrative placeholders** to show the
> layout. Verify them against each vendor's published datasheet before relying
> on them.

---

## 5. Connecting real AI summaries later

The AI-summary structure is already in place. To generate summaries
automatically with an AI API, have your script output objects in the exact
shape used in `data/ai-summaries.js`:

```js
{
  id: "ai-unique-id",
  whatHappened: "...",
  whyItMatters: "...",
  productImpact: "...",
  threatLevel: "High",        // High | Medium | Low
  recommendedAction: "..."
}
```

Append them to the `window.DB.aiSummaries` array (or regenerate the file) and
reference each one from a news item via `aiSummaryId`. Nothing else changes.

> A working Python news crawler from the previous version is still in
> `scripts/` and `config/`. It can be adapted to write items in the
> `data/news.js` shape so the news feed updates itself daily. It is **not**
> wired into this build by default.

---

## 6. Deploy to GitHub Pages

Because there's no build step, deploying is just publishing the files.

1. Create a repository on GitHub (e.g. `mv-competitive-dashboard`).
2. Push this folder to it. From this folder in a terminal:
   ```bash
   git init
   git add .
   git commit -m "GridIntel dashboard"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
   (This folder is already a git repo, so you may only need the last few steps.)
3. On GitHub: **Settings → Pages**.
4. Under **Build and deployment**, set **Source = Deploy from a branch**,
   **Branch = `main`**, **Folder = `/ (root)`**, then **Save**.
5. Wait ~1 minute. Your site is live at
   `https://<your-username>.github.io/<your-repo>/`.

`index.html` is at the repo root (required for Pages), and the app uses
hash-based routing (`#/category/...`), so deep links and refreshes work without
any server configuration.

**To update the live site later:** edit the `data/` files, then:
```bash
git add .
git commit -m "Update competitor data"
git push
```
The site refreshes automatically a minute or so after each push.

### Other simple hosting
Any static host works the same way (just upload the folder): Netlify, Cloudflare
Pages, Vercel (as a static site), or an internal web server.

---

## 7. Re-skinning

All colors and sizing live in the `:root` block at the top of
`assets/styles.css`. Change `--primary`, the threat colors, fonts, or radius
there to restyle the whole dashboard at once.
