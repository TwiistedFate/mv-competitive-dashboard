/* ============================================================================
 *  news.js  —  NEWS, ARTICLES & ANNOUNCEMENTS
 * ----------------------------------------------------------------------------
 *  One object per news item. Drives the News page, the per-category "recent
 *  news" lists, the homepage recent-news counts, and competitor profiles.
 *
 *  HOW TO ADD A NEWS ITEM:
 *    1. Copy a block and give it a unique `id`.
 *    2. `companyId`  must match an id in competitors.js.
 *    3. `category`   must match an id in categories.js.
 *    4. `date` is ISO format "YYYY-MM-DD".
 *    5. `aiSummaryId` (optional) links to a structured summary in
 *       ai-summaries.js. Leave it out if there's no AI summary yet.
 *    6. `threatLevel`, `region`, and `tags` feed the filters.
 *
 *  TIP: the existing Python crawler (scripts/update_tracker.py) can be adapted
 *  to append objects in this shape so news updates itself daily.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.news = [
  {
    id: "n-2026-0405-schneider-airset",
    title: "Schneider extends AirSeT SF6-free range with wider MV ratings and built-in sensors",
    companyId: "schneider",
    category: "switchgear",
    date: "2026-04-05",
    region: "Europe",
    threatLevel: "High",
    type: "Product launch",
    source: "https://www.se.com/ww/en/about-us/newsroom/news/",
    summary: "Schneider broadened its AirSeT pure-air switchgear line and emphasized integrated digital sensing with EcoStruxure connectivity.",
    aiSummaryId: "ai-schneider-airset",
    tags: ["SF6-free", "Digital", "Sensors", "Launch"]
  },
  {
    id: "n-2026-0305-abb-airplus",
    title: "ABB expands AirPlus eco-efficient switchgear portfolio",
    companyId: "abb",
    category: "switchgear",
    date: "2026-03-05",
    region: "Global",
    threatLevel: "High",
    type: "Product launch",
    source: "https://new.abb.com/news",
    summary: "ABB added ratings to its SF6-free AirPlus range, deepening eco-efficient coverage across distribution applications.",
    aiSummaryId: "ai-abb-airplus",
    tags: ["SF6-free", "Switchgear", "Launch"]
  },
  {
    id: "n-2026-0318-nuventura-license",
    title: "Nuventura signs new licensing partner for nu1 SF6-free GIS",
    companyId: "nuventura",
    category: "switchgear",
    date: "2026-03-18",
    region: "Europe",
    threatLevel: "Medium",
    type: "Partnership",
    source: "https://nuventura.com",
    summary: "Berlin-based Nuventura expanded its licensing model for dry-air SF6-free GIS switchgear with a new manufacturing partner.",
    aiSummaryId: "ai-nuventura-license",
    tags: ["SF6-free", "Partnership", "Disruptor"]
  },
  {
    id: "n-2026-0120-siemens-bluegis",
    title: "Siemens grows blue GIS clean-air switchgear lineup",
    companyId: "siemens",
    category: "switchgear",
    date: "2026-01-20",
    region: "Europe",
    threatLevel: "Medium",
    type: "Product update",
    source: "https://press.siemens.com/global/en/pressreleases",
    summary: "Siemens added ratings and form factors to its clean-air (vacuum + dry air) blue GIS switchgear family.",
    aiSummaryId: "ai-siemens-bluegis",
    tags: ["SF6-free", "Clean air", "Switchgear"]
  },
  {
    id: "n-2026-0210-sandc-intellirupter",
    title: "S&C enhances IntelliRupter PulseCloser controller and communications",
    companyId: "sandc",
    category: "reclosers",
    date: "2026-02-10",
    region: "North America",
    threatLevel: "High",
    type: "Product update",
    source: "https://www.sandc.com/en/company/newsroom/",
    summary: "S&C released controller and communications updates strengthening IntelliRupter integration with IntelliTeam self-healing.",
    aiSummaryId: "ai-sandc-intellirupter",
    tags: ["Recloser", "Automation", "FLISR"]
  },
  {
    id: "n-2026-0225-noja-osm",
    title: "NOJA Power updates OSM recloser controller and cyber-security module",
    companyId: "noja",
    category: "reclosers",
    date: "2026-02-25",
    region: "Asia-Pacific",
    threatLevel: "Medium",
    type: "Product update",
    source: "https://www.nojapower.com/news",
    summary: "NOJA shipped RC controller updates plus connectivity and cyber-security enhancements for the globally deployed OSM recloser.",
    aiSummaryId: "ai-noja-osm",
    tags: ["Recloser", "Cyber security", "Connectivity"]
  },
  {
    id: "n-2025-1208-eaton-xiria",
    title: "Eaton expands Xiria SF6-free secondary switchgear",
    companyId: "eaton",
    category: "switchgear",
    date: "2025-12-08",
    region: "North America",
    threatLevel: "Medium",
    type: "Product update",
    source: "https://www.eaton.com/us/en-us/company/news-insights/news-releases.html",
    summary: "Eaton broadened its Xiria SF6-free secondary switchgear, leveraging its Cooper heritage and North American channel.",
    aiSummaryId: "ai-eaton-xiria",
    tags: ["SF6-free", "Switchgear", "Channel"]
  },
  {
    id: "n-2026-0301-lindsey-dlr",
    title: "Lindsey reports growth in dynamic line rating and grid-edge sensing",
    companyId: "lindsey",
    category: "sensors",
    date: "2026-03-01",
    region: "North America",
    threatLevel: "Low",
    type: "Market development",
    source: "https://www.lindsey-usa.com",
    summary: "Lindsey highlighted expanding deployments of GEN2 line sensors and dynamic line rating as utilities seek more capacity from existing assets.",
    aiSummaryId: "ai-lindsey-dlr",
    tags: ["Sensors", "DLR", "Grid edge"]
  },
  {
    id: "n-2026-0115-market-sf6",
    title: "Regulatory timelines tighten for SF6 phase-out in MV switchgear",
    companyId: "abb",
    category: "switchgear",
    date: "2026-01-15",
    region: "Global",
    threatLevel: "Low",
    type: "Market / regulatory",
    source: "https://new.abb.com/news",
    summary: "Updated EU F-Gas rules, US EPA actions, and state-level regulations continue to compress timelines for eliminating SF6 in new MV equipment.",
    aiSummaryId: "ai-market-sf6ban",
    tags: ["Regulatory", "SF6-free", "Market"]
  },
  {
    id: "n-2025-1101-gw-accusense",
    title: "G&W Electric expands AccuSense sensor options",
    companyId: "gw",
    category: "sensors",
    date: "2025-11-01",
    region: "North America",
    threatLevel: "Low",
    type: "Product launch",
    source: "https://www.gwelectric.com/news/",
    summary: "G&W broadened combined voltage/current sensing options in the AccuSense line for grid-edge monitoring and protection.",
    tags: ["Sensors", "Combined V/I", "Launch"]
  },
  {
    id: "n-2026-0402-schneider-ecostruxure",
    title: "Schneider adds hosting-capacity and DER tools to EcoStruxure ADMS",
    companyId: "schneider",
    category: "software",
    date: "2026-04-02",
    region: "Global",
    threatLevel: "Medium",
    type: "Product update",
    source: "https://www.se.com/ww/en/about-us/newsroom/news/",
    summary: "Schneider enhanced EcoStruxure ADMS with additional DER management and hosting-capacity analytics for high-DER networks.",
    tags: ["Software", "ADMS", "DERMS"]
  },
  {
    id: "n-2026-0228-abb-islimiter",
    title: "ABB highlights Is-limiter for managing rising distribution fault levels",
    companyId: "abb",
    category: "fault-current-limiters",
    date: "2026-02-28",
    region: "Global",
    threatLevel: "Low",
    type: "Market development",
    source: "https://new.abb.com/news",
    summary: "ABB promoted its Is-limiter as a retrofit solution as distributed generation pushes fault levels beyond existing switchgear ratings.",
    tags: ["Fault current limiter", "DER", "Retrofit"]
  }
];
