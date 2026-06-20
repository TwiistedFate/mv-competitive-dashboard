/* ============================================================================
 *  news.js  —  NEWS, ARTICLES & ANNOUNCEMENTS
 * ----------------------------------------------------------------------------
 *  One object per news item. Drives the News page, the per-category "recent
 *  news" lists, the homepage recent-news counts, and competitor profiles.
 *
 *  HOW TO ADD A NEWS ITEM:
 *    1. Copy a block and give it a unique `id`.
 *    2. `companyId`  must match an id in competitors.js.
 *    3. `category`   must match an id in categories.js  —  OR use "corporate"
 *       for company-level news (M&A, financials, leadership, expansion, broad
 *       market moves). Product-category items appear BOTH on the News page and
 *       inside their product tab; "corporate" items appear on the News page
 *       ONLY, so product tabs stay focused and uncluttered.
 *    4. `date` is ISO format "YYYY-MM-DD".
 *    5. `source` is the DIRECT URL to the article/press release (this is what
 *       the "Source" button opens — make it the exact article, not a homepage).
 *    6. `aiSummaryId` (optional) links to a structured summary in
 *       ai-summaries.js. Leave it out if there's no AI summary yet.
 *    7. `threatLevel`, `region`, and `tags` feed the filters.
 *
 *  The items below are REAL, published articles with direct source links
 *  (gathered June 2026). A few publication dates are approximate (month-level)
 *  where the source didn't state an exact day — adjust if you have the precise
 *  date. Keep this list current as new announcements appear.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.news = [
  /* ------------------------------- G&W (you) ----------------------------- */
  {
    id: "n-gw-viper-st-2025",
    title: "G&W Electric unveils next-generation Viper-ST recloser at DISTRIBUTECH 2025",
    companyId: "gw",
    category: "reclosers",
    date: "2025-03-24",
    region: "North America",
    threatLevel: "Low",
    type: "Product launch",
    source: "https://www.gwelectric.com/news/gw-electric-unveils-next-generation-viper-st-recloser-at-distributech-2025/",
    summary: "G&W launched the latest Viper-ST recloser with expanded ratings (up to 170 kV BIL, 1000 A continuous), supporting up to six external AccuSense voltage sensors and three external CTs for grid diagnostics.",
    tags: ["Recloser", "Launch", "AccuSense", "DISTRIBUTECH"]
  },
  {
    id: "n-gw-voltage-sensing-2025",
    title: "G&W Electric unveils fully integrated voltage-sensing solution for switchgear",
    companyId: "gw",
    category: "sensors",
    date: "2025-08-19",
    region: "North America",
    threatLevel: "Low",
    type: "Product launch",
    source: "https://www.businesswire.com/news/home/20250819441664/en/CORRECTING-and-REPLACING-GW-Electric-Unveils-Fully-Integrated-Voltage-Sensing-Solution-for-Smarter-Switchgear-Operations",
    summary: "G&W introduced the AccuSense VS-27-UG voltage sensor — a fully integrated, factory-tested solution that improves grid visibility, supports predictive maintenance, and enables smarter switchgear operations.",
    tags: ["Sensors", "AccuSense", "Switchgear", "Launch"]
  },
  {
    id: "n-gw-safegrid-2025",
    title: "G&W Electric invests in Safegrid to advance smart grid monitoring",
    companyId: "gw",
    category: "software",
    date: "2025-04-23",
    region: "North America",
    threatLevel: "Low",
    type: "Investment / partnership",
    source: "https://www.businesswire.com/news/home/20250423923969/en/GW-Electric-Invests-in-Safegrid-to-Advance-Smart-Grid-Monitoring-and-Predictive-Technologies",
    summary: "G&W made a strategic investment in Safegrid to expand its grid-monitoring and predictive-analytics capabilities — a move into the software/analytics layer adjacent to its hardware.",
    tags: ["Software", "Monitoring", "Investment"]
  },

  /* --------------------------------- S&C -------------------------------- */
  {
    id: "n-sandc-sel-2026",
    title: "S&C and SEL collaborate on interoperable control for IntelliRupter PulseCloser",
    companyId: "sandc",
    category: "reclosers",
    date: "2026-02-02",
    region: "North America",
    threatLevel: "High",
    type: "Partnership",
    source: "https://www.sandc.com/en/news/sc-news/collaboration-delivers-an-interoperable-control-solution-that-expands-grid-modernization-options/",
    summary: "At DTECH 2026, S&C announced a collaboration pairing the IntelliRupter PulseCloser with SEL's upcoming SEL-651RD Advanced Digital Control over a standard fiber interface — opening IntelliRupter to a third-party control option. PulseClosing reduces fault-testing energy by ~95% vs. conventional reclosers.",
    aiSummaryId: "ai-sandc-intellirupter",
    tags: ["Recloser", "Automation", "Interoperability", "DTECH"]
  },

  /* --------------------------------- ABB -------------------------------- */
  {
    id: "n-abb-eon-2025",
    title: "ABB to supply next-generation SF6-free switchgear to E.ON in Germany",
    companyId: "abb",
    category: "switchgear",
    date: "2025-07-15",
    region: "Europe",
    threatLevel: "High",
    type: "Contract / deployment",
    source: "https://new.abb.com/news/detail/127727/abb-will-supply-its-next-generation-sf6-free-switchgear-to-eon-in-germany",
    summary: "ABB will supply SafeRing/SafePlus Air 24 kV secondary GIS to E.ON, Germany's largest DSO, as utilities move to meet the EU F-gas rules banning SF6 in new MV equipment up to 24 kV from 2026.",
    aiSummaryId: "ai-abb-airplus",
    tags: ["SF6-free", "Switchgear", "Utility win"]
  },
  {
    id: "n-abb-sf6-transition-2025",
    title: "ABB: Preparing for the 2026 SF6 transition — building resilient grids",
    companyId: "abb",
    category: "switchgear",
    date: "2025-10-01",
    region: "Global",
    threatLevel: "Medium",
    type: "Market / regulatory",
    source: "https://new.abb.com/news/detail/131007/preparing-for-the-2026-sf6-transition-building-resilient-grids",
    summary: "ABB outlines how utilities should prepare for the January 2026 EU ban on SF6 in new MV switchgear up to 24 kV, positioning its eco-efficient portfolio for the transition.",
    aiSummaryId: "ai-market-sf6ban",
    tags: ["SF6-free", "Regulatory", "Market"]
  },

  /* ------------------------------- Siemens ------------------------------ */
  {
    id: "n-siemens-bluegis-24kv",
    title: "Siemens expands sustainable, digital blue GIS switchgear to 24 kV",
    companyId: "siemens",
    category: "switchgear",
    date: "2024-11-05",
    region: "Europe",
    threatLevel: "Medium",
    type: "Product update",
    source: "https://press.siemens.com/global/en/pressrelease/siemens-expands-sustainable-and-digital-switchgear-range-primary-distribution-24kv",
    summary: "Siemens extended its blue GIS clean-air (vacuum + natural-origin gases, GWP < 1) primary switchgear up to 24 kV, including NXPLUS C 24 and 8DJH variants, free of fluorinated and PFAS gases.",
    aiSummaryId: "ai-siemens-bluegis",
    tags: ["SF6-free", "Clean air", "Switchgear"]
  },

  /* ----------------------------- Schneider ----------------------------- */
  {
    id: "n-schneider-eon-2025",
    title: "Schneider Electric and E.ON sign long-term SF6-free MV switchgear agreement",
    companyId: "schneider",
    category: "switchgear",
    date: "2025-08-04",
    region: "Europe",
    threatLevel: "High",
    type: "Partnership / contract",
    source: "https://www.se.com/ww/en/about-us/newsroom/news/press-releases/schneider-electric-and-e-on-sign-long-term-agreement-to-accelerate-the-energy-transition-with-sf%E2%82%86-free-medium-voltage-switchgear-689049af9a959c665e0dd803/",
    summary: "Schneider and E.ON signed a long-term agreement to accelerate deployment of SF6-free (AirSeT) medium-voltage switchgear across E.ON's networks — a major framework win in the SF6 phase-out.",
    aiSummaryId: "ai-schneider-airset",
    tags: ["SF6-free", "AirSeT", "Utility win"]
  },
  {
    id: "n-schneider-grid-platform-2025",
    title: "Schneider Electric debuts One Digital Grid Platform for utilities",
    companyId: "schneider",
    category: "software",
    date: "2025-11-12",
    region: "Global",
    threatLevel: "Medium",
    type: "Product launch",
    source: "https://www.se.com/ww/en/about-us/newsroom/news/press-releases/schneider-electric-debuts-one-digital-grid-platform-to-help-utilities-modernize-and-address-energy-costs-691af6851937b58c890951a3/",
    summary: "Schneider launched One Digital Grid Platform, built on EcoStruxure ADMS, DERMS and ArcFM, adding AI-powered restoration-time estimates and a Grid AI Assistant for real-time troubleshooting.",
    aiSummaryId: "ai-schneider-grid",
    tags: ["Software", "ADMS", "DERMS", "AI"]
  },

  /* ------------------------------ Nuventura ----------------------------- */
  {
    id: "n-nuventura-lucy-2026",
    title: "Lucy Group acquires Nuventura to scale SF6-free switchgear globally",
    companyId: "nuventura",
    category: "switchgear",
    date: "2026-04-06",
    region: "Europe",
    threatLevel: "Medium",
    type: "Acquisition",
    source: "https://www.einpresswire.com/article/903344129/lucy-group-acquires-nuventura-gmbh-in-germany-to-expand-into-primary-sf6-free-switchgear",
    summary: "Lucy Group acquired 100% of Berlin-based Nuventura, a leader in primary SF6-free (dry-air) GIS up to 36 kV — giving the dry-air challenger the scale and channel of an established switchgear group.",
    aiSummaryId: "ai-nuventura-lucy",
    tags: ["SF6-free", "Acquisition", "Disruptor"]
  },

  /* ------------------------------ NOJA Power ---------------------------- */
  {
    id: "n-noja-rc20-2025",
    title: "NOJA Power's RC-20 recloser control sets new grid-intelligence benchmark",
    companyId: "noja",
    category: "reclosers",
    date: "2025-09-03",
    region: "Asia-Pacific",
    threatLevel: "Medium",
    type: "Product update",
    source: "https://www.nojapower.com/press/2025/RC-20-Sets-New-Benchmark-us",
    summary: "NOJA's RC-20 control (from the ARENA Intelligent Switchgear project) was deployed across 100 units in Queensland and Victoria — described as the world's first large-scale synchrophasor measurement deployment in an MV distribution network.",
    aiSummaryId: "ai-noja-osm",
    tags: ["Recloser", "Synchrophasor", "Renewables"]
  },

  /* -------------------------------- Eaton ------------------------------- */
  {
    id: "n-eaton-eu-sf6-2024",
    title: "Eaton: navigating the shift to SF6-free switchgear in the EU",
    companyId: "eaton",
    category: "switchgear",
    date: "2024-06-10",
    region: "Europe",
    threatLevel: "Medium",
    type: "Market / insight",
    source: "https://www.eaton.com/gb/en-gb/company/news-insights/blog/2024/navigating-the-shift-to-sf6-free-switchgear-in-the-eu-a-guide-for-asset-managers.html",
    summary: "Eaton positions its long-running SF6-free Xiria line (1M+ panels shipped) as utilities navigate the EU phase-out, leaning on its vacuum + solid-insulation heritage and broad channel.",
    aiSummaryId: "ai-eaton-xiria",
    tags: ["SF6-free", "Xiria", "Switchgear"]
  },

  /* ------------------------------- Lindsey ----------------------------- */
  {
    id: "n-lindsey-smartline",
    title: "Lindsey announces SMARTLINE dynamic line rating software update",
    companyId: "lindsey",
    category: "sensors",
    date: "2024-05-15",
    region: "North America",
    threatLevel: "Low",
    type: "Product update",
    source: "https://lindsey-usa.com/lindsey-announced-smartline-software-update/",
    summary: "Lindsey updated SMARTLINE, its dynamic line rating / transmission capacity forecasting solution, pairing GEN2 line sensors (0.2% accuracy class) with real-time and forecast line ratings.",
    aiSummaryId: "ai-lindsey-dlr",
    tags: ["Sensors", "DLR", "Grid edge"]
  },

  /* ------------------------- Fault current limiters --------------------- */
  {
    id: "n-abb-islimiter",
    title: "ABB Is-limiter targets rising distribution fault levels",
    companyId: "abb",
    category: "fault-current-limiters",
    date: "2025-09-10",
    region: "Global",
    threatLevel: "Low",
    type: "Product / reference",
    source: "https://new.abb.com/medium-voltage/apparatus/fault-current-limiting/current-limiter",
    summary: "ABB's Is-limiter (up to 40.5 kV, 5000 A, 210 kA breaking) detects and interrupts short-circuit currents in under 1 ms — increasingly relevant as DER pushes fault levels beyond existing switchgear ratings.",
    tags: ["Fault current limiter", "DER", "Retrofit"]
  },

  /* ======================================================================= *
   *  CORPORATE / COMPANY-LEVEL NEWS  (category: "corporate")
   *  -----------------------------------------------------------------------
   *  Broad business moves — M&A, financials, capacity, leadership, market
   *  positioning — that aren't tied to one product line. These appear on the
   *  News & Articles page ONLY (not inside product tabs).
   *
   *  ⚠  The items in this section are ILLUSTRATIVE SAMPLES showing the kind of
   *     company-level intelligence to track. `source` points at each vendor's
   *     newsroom; replace with the exact article and verify before relying on
   *     them. (The product-category items above are real, dated articles.)
   * ======================================================================= */
  {
    id: "n-abb-electrification-results",
    title: "ABB reports record Electrification orders driven by grid demand",
    companyId: "abb",
    category: "corporate",
    date: "2026-04-23",
    region: "Global",
    threatLevel: "Medium",
    type: "Financial results",
    source: "https://new.abb.com/news",
    summary: "ABB's Electrification business posted record orders, citing grid modernization, data-center power, and electrification demand — funding continued R&D and capacity expansion across its MV portfolio.",
    tags: ["Financials", "Electrification", "Growth"]
  },
  {
    id: "n-siemens-si-expansion",
    title: "Siemens Smart Infrastructure expands US grid-equipment manufacturing",
    companyId: "siemens",
    category: "corporate",
    date: "2026-03-18",
    region: "North America",
    threatLevel: "Medium",
    type: "Capacity expansion",
    source: "https://press.siemens.com/global/en/pressreleases",
    summary: "Siemens announced added US manufacturing capacity for grid and distribution equipment to shorten lead times and serve domestic utility demand amid grid-investment tailwinds.",
    tags: ["Manufacturing", "Investment", "Supply chain"]
  },
  {
    id: "n-schneider-impact-2026",
    title: "Schneider Electric reaffirms grid-software and sustainability strategy",
    companyId: "schneider",
    category: "corporate",
    date: "2026-02-26",
    region: "Global",
    threatLevel: "Medium",
    type: "Strategy",
    source: "https://www.se.com/ww/en/about-us/newsroom/news/",
    summary: "Schneider reiterated its push toward recurring grid-software revenue and SF6-free portfolios, framing decarbonization and digitization as the core of its medium-voltage growth strategy.",
    tags: ["Strategy", "Sustainability", "Software"]
  },
  {
    id: "n-sandc-storage-invest",
    title: "S&C Electric invests in US manufacturing and energy-storage capacity",
    companyId: "sandc",
    category: "corporate",
    date: "2026-01-15",
    region: "North America",
    threatLevel: "Medium",
    type: "Investment",
    source: "https://www.sandc.com/en/company/newsroom/",
    summary: "S&C announced expanded manufacturing and energy-storage capacity to support grid-resiliency and distribution-automation demand from North American utilities.",
    tags: ["Investment", "Energy storage", "Resiliency"]
  },
  {
    id: "n-eaton-capacity-2025",
    title: "Eaton expands electrical manufacturing to meet grid and data-center demand",
    companyId: "eaton",
    category: "corporate",
    date: "2025-12-03",
    region: "North America",
    threatLevel: "Medium",
    type: "Capacity expansion",
    source: "https://www.eaton.com/us/en-us/company/news-insights/news-releases.html",
    summary: "Eaton committed further investment to expand US electrical-equipment manufacturing, citing record backlog from grid modernization, electrification, and data-center power demand.",
    tags: ["Manufacturing", "Investment", "Backlog"]
  },
  {
    id: "n-hubbell-utility-growth",
    title: "Hubbell highlights utility-solutions growth and grid-hardening demand",
    companyId: "hubbell",
    category: "corporate",
    date: "2026-02-04",
    region: "North America",
    threatLevel: "Low",
    type: "Financial results",
    source: "https://www.hubbellpowersystems.com",
    summary: "Hubbell pointed to sustained utility-solutions growth driven by grid-hardening, storm response, and aging-infrastructure replacement across North American utilities.",
    tags: ["Financials", "Grid hardening", "Utility"]
  },
  {
    id: "n-noja-global-expansion",
    title: "NOJA Power expands global distribution and manufacturing footprint",
    companyId: "noja",
    category: "corporate",
    date: "2025-11-20",
    region: "Asia-Pacific",
    threatLevel: "Low",
    type: "Expansion",
    source: "https://www.nojapower.com/news",
    summary: "NOJA Power continued expanding its distributor network and manufacturing capacity, reinforcing its position as a focused recloser specialist serving 100+ countries.",
    tags: ["Expansion", "Distribution", "Global"]
  },
  {
    id: "n-nuventura-na-entry",
    title: "Lucy/Nuventura targets North American entry for SF6-free GIS",
    companyId: "nuventura",
    category: "corporate",
    date: "2026-05-12",
    region: "North America",
    threatLevel: "Medium",
    type: "Market entry",
    source: "https://nuventura.com/news/",
    summary: "Following the Lucy Group acquisition, Nuventura signaled a North American go-to-market for its dry-air SF6-free GIS, working through regional partners to reach US/Canadian utilities.",
    tags: ["Market entry", "SF6-free", "Channel"]
  },
  {
    id: "n-gw-expansion-2026",
    title: "G&W Electric expands manufacturing and engineering capacity",
    companyId: "gw",
    category: "corporate",
    date: "2026-03-02",
    region: "North America",
    threatLevel: "Low",
    type: "Capacity expansion",
    source: "https://www.gwelectric.com/news/",
    summary: "G&W continued investing in manufacturing and application-engineering capacity to support demand for solid-dielectric switchgear, reclosers, and sensors, and to grow its international presence.",
    tags: ["Manufacturing", "Investment", "Growth"]
  }
];
