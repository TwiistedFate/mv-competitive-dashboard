# GridIntel — MV Competitive Intelligence Dashboard

A competitive intelligence platform for medium-voltage grid equipment, built for
marketing, sales, product management, and strategy teams. Track competitors
across switchgear, reclosers, sensors, cable accessories, fault current limiters,
and grid software — run **1:1 product comparisons**, read competitor profiles,
browse news, and see structured AI summaries.

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
│   ├── comparison.js       ← the 1:1 Product Comparison engine + components
│   ├── pages.js            ← one function per page/view
│   └── app.js              ← routing + navigation + wiring
├── data/                   ← 👉 THIS is what you edit
│   ├── categories.js       ← product categories + spec-table columns
│   ├── competitors.js      ← competitor profiles
│   ├── products.js         ← products + specifications + 1:1 matching fields
│   ├── comparisons.js      ← optional curated read-outs for product pairs
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
- **Category pages (Product Line Comparison)** — key trends, a **sortable /
  searchable / filterable spec comparison table** (your products highlighted),
  key differentiators, a competitor SWOT snapshot, and recent news.
- **1:1 Product Comparison** — pick **one G&W product**, then choose **which
  competitors** to compare against (multi-select pills + “All competitors”). The
  page shows only comparable competitor products, with match cards, a
  side-by-side spec table, strengths/gaps/best-use-case for each side, source
  links, and a plain-language competitive read-out. Matching is **specific**:
  competitor products are linked to G&W products via a `comparableTo` field, not
  matched blindly by category.
- **Competitor profiles** — overview, products offered, strengths, weaknesses,
  partnerships, new-product announcements, strategic direction, useful links,
  and an AI-summary section.
- **News & articles** — the full feed of everything competitors are doing.
  Product-specific items also appear under their product line; company-level
  news (M&A, financials, expansion — `category: "corporate"`) shows here only,
  so product tabs stay focused. Filter by product line, company, region, threat,
  or date.
- **Competitor logos** — real brand logos are pulled automatically from each
  company's web domain (with a text-initials fallback), shown on profiles,
  competitor cards, and 1:1 comparisons.
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
empty sections just hide themselves. The logo is fetched automatically from the
`website` host; add an explicit `domain` (e.g. `"abb.com"`) only if the brand
domain differs from the website URL.

### Add a product / specs → `data/products.js`
Set `competitorId` and `category`. Put rating values in the `specs` object — the
**keys inside `specs` must match the `specColumns` keys** for that category (see
`categories.js`). That's how columns line up in the comparison table.
`technology`, `voltageClass`, and `applications` power the filters.

### Add news → `data/news.js`
Set `companyId`, `category`, an ISO `date` (`"YYYY-MM-DD"`), `threatLevel`,
`region`, and `tags`. Optionally link a structured summary with `aiSummaryId`.
Use a product `category` (e.g. `"reclosers"`) to make the item appear both on
the News page **and** in that product tab; use `category: "corporate"` for
company-level news that should appear on the **News page only**.

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

## 5. Adding 1:1 product comparisons

The **1:1 Product Comparison** page is driven entirely by `data/products.js`
(plus optional narratives in `data/comparisons.js`). To make a new competitor
product show up as a match for one of your G&W products:

1. **Make sure the G&W product exists** in `data/products.js` with
   `competitorId: "gw"` and a `productFamily` (e.g. `"Viper"`). G&W products are
   the *anchors* the user selects on the left side — their `comparableTo` is `[]`.

2. **Add (or edit) the competitor product** in the same file and link it to the
   G&W product with `comparableTo`:

   ```js
   {
     id: "p-acme-superloser",
     competitorId: "acme",                 // must match a company in competitors.js
     category: "reclosers",                // must match the G&W product's category
     name: "SuperCloser 9000",
     productFamily: "SuperCloser",
     comparableTo: ["p-gw-viper"],         // 👈 makes it a match for the Viper
     voltageClass: "15–38 kV",
     technology: ["Vacuum"],
     strengths: ["...", "..."],            // shown on the match card
     weaknesses: ["...", "..."],
     bestUseCase: "One line: where this product wins.",
     sourceLinks: [{ label: "Datasheet", url: "https://..." }],
     specs: { /* keys match the category's specColumns */ },
     notes: ""
   }
   ```

   The match logic is **category match AND `comparableTo` match**: the product
   only appears when its `category` equals the selected G&W product's category
   **and** its `comparableTo` array contains that G&W product's `id`. That keeps
   comparisons specific instead of dumping every product in the category.

3. **(Optional) Add a curated read-out** in `data/comparisons.js` to override the
   auto-generated summary for a specific pair:

   ```js
   DB.comparisons["p-gw-viper"] = DB.comparisons["p-gw-viper"] || {};
   DB.comparisons["p-gw-viper"]["p-acme-superloser"] = {
     edge: "G&W",                          // "G&W" | "Competitor" | "Even" → badge
     summary: "Two or three sentences in plain business language.",
     gaps: ["A gap or risk for G&W vs. this product", "..."]
   };
   ```

   If you don't add an entry, the page **auto-generates** a solid business-language
   summary and gaps list from the product's `strengths`, `voltageClass`, and
   `bestUseCase` — so the page is always functional.

4. Save and refresh. The new competitor automatically appears as a selectable
   pill (and a match card) whenever the user selects the linked G&W product.

To add a **whole new comparison line** (a new G&W product line plus competitors),
just add the G&W anchor product and one or more competitor products that point to
it via `comparableTo`. No page code changes are needed.

---

## 6. Connecting real AI summaries later

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

> A Python news crawler lives in `scripts/update_tracker.py` with its watch list
> in `config/sources.yml`. It searches Google News and scans vendor newsrooms,
> then classifies each hit (Threat / Market Insight / Alert) and writes
> `data/tracker_data.json`. It covers **all six product lines** — including fault
> current limiters and grid software — uses **product-level queries** (named
> products like IntelliRupter, AirSeT, Is-limiter), and captures a real
> **summary** (`og:description`) and **source** publisher per item. Each item is
> tagged with a **`scope`** (`"product"` vs `"corporate"`) and an
> **`app_category`** (the dashboard category id, or `"corporate"`) — mirroring
> the News-page split — and de-duplicated on a **normalized URL** (tracking
> params / case / trailing slash ignored). HTTP uses a shared session with
> retry/backoff. Edit `config/sources.yml` to add vendors, products, or newsroom
> URLs. It can be adapted to emit items in the `data/news.js` shape so the feed
> updates itself; it is **not** wired into the live build by default.

---

## 7. Deploy to GitHub Pages

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

## 8. Re-skinning

All colors and sizing live in the `:root` block at the top of
`assets/styles.css`. Change `--primary`, the threat colors, fonts, or radius
there to restyle the whole dashboard at once.
