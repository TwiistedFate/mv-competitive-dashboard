/* ============================================================================
 *  ai-summaries.js  —  STRUCTURED AI SUMMARIES
 * ----------------------------------------------------------------------------
 *  Each summary follows the analyst template:
 *      whatHappened · whyItMatters · productImpact · threatLevel · recommendedAction
 *
 *  Summaries are referenced by id from news.js (`aiSummaryId`). They are shown
 *  on news items, on the dedicated "AI Summaries" page, and can be attached to
 *  competitors too.
 *
 *  HOW TO ADD A SUMMARY:
 *    1. Copy a block and give it a unique `id`.
 *    2. Reference it from a news item via `aiSummaryId: "<id>"`.
 *    3. `threatLevel` is "High" | "Medium" | "Low".
 *
 *  LATER: to auto-generate these from an AI API, have your script produce
 *  objects in exactly this shape and append them to this array (or replace it).
 *  Nothing else in the app needs to change.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.aiSummaries = [
  {
    id: "ai-abb-airplus",
    whatHappened: "ABB expanded its AirPlus SF6-free switchgear range with additional voltage and current ratings, broadening eco-efficient coverage across primary and secondary distribution.",
    whyItMatters: "It strengthens ABB's first-mover position in the SF6 phase-out and pressures every MV vendor to show a credible SF6-free roadmap to utilities writing it into specs.",
    productImpact: "Directly competes with Trident SF6-free positioning; narrows G&W's 'no-SF6' messaging advantage in head-to-head bids.",
    threatLevel: "High",
    recommendedAction: "Refresh Trident SF6-free comparison collateral vs. AirPlus; emphasize solid-dielectric and submersible advantages where AirPlus is weaker."
  },
  {
    id: "ai-schneider-airset",
    whatHappened: "Schneider extended the AirSeT range (pure-air + vacuum) with wider MV ratings and built-in digital sensors, marketed as 'digital by design'.",
    whyItMatters: "Bundling SF6-free hardware with integrated sensing + EcoStruxure software is the combined hardware/software play that's hardest to counter on price alone.",
    productImpact: "Pressures both Trident (switchgear) and AccuSense (sensors) by collapsing them into one integrated, digital offer.",
    threatLevel: "High",
    recommendedAction: "Position AccuSense + Trident as an equally integrated, open alternative without software lock-in; highlight interoperability."
  },
  {
    id: "ai-siemens-bluegis",
    whatHappened: "Siemens grew its blue GIS clean-air (vacuum + dry air) switchgear portfolio with new ratings and form factors.",
    whyItMatters: "Clean-air avoids any fluorinated gas entirely — a strong regulatory and sustainability story for European DSOs and increasingly North American utilities.",
    productImpact: "Reinforces the SF6-free standard utilities expect; raises the bar for any vendor still relying on SF6 or alternative gases.",
    threatLevel: "Medium",
    recommendedAction: "Ensure Trident messaging clearly states zero fluorinated gas; prepare technical FAQ comparing solid-dielectric vs. clean-air."
  },
  {
    id: "ai-sandc-intellirupter",
    whatHappened: "S&C released controller and communications enhancements for the IntelliRupter PulseCloser platform.",
    whyItMatters: "Pulse-closing plus IntelliTeam self-healing remains the strongest combined recloser + automation story in North America.",
    productImpact: "Directly pressures the Viper recloser line on advanced automation and FLISR integration.",
    threatLevel: "High",
    recommendedAction: "Quantify Viper total-cost and reliability advantages; partner or integrate Viper with leading FLISR/ADMS platforms to neutralize the software gap."
  },
  {
    id: "ai-noja-osm",
    whatHappened: "NOJA Power shipped controller and cyber-security/connectivity updates for the OSM recloser.",
    whyItMatters: "NOJA competes hard on documentation, support, and value globally — strong in price-sensitive and international tenders.",
    productImpact: "Pressures Viper primarily on price and global availability rather than core technology.",
    threatLevel: "Medium",
    recommendedAction: "Defend on integrated sensing and solid-dielectric reliability; review pricing in international bids where NOJA competes."
  },
  {
    id: "ai-nuventura-license",
    whatHappened: "Nuventura announced new licensing/manufacturing partnerships for its nu1 dry-air SF6-free GIS switchgear.",
    whyItMatters: "A licensing model lets a small disruptor scale SF6-free switchgear quickly through partners — potentially seeding many new competitors.",
    productImpact: "Adds low-cost SF6-free GIS competition that could appear under multiple partner brands.",
    threatLevel: "Medium",
    recommendedAction: "Monitor which manufacturers adopt the license; watch for nu1-based products entering North American distribution."
  },
  {
    id: "ai-eaton-xiria",
    whatHappened: "Eaton expanded its Xiria SF6-free secondary switchgear offering.",
    whyItMatters: "Leverages Eaton's large North American distribution and Cooper heritage to push SF6-free into the secondary market.",
    productImpact: "Competes with Trident in secondary distribution, especially through Eaton's existing channel.",
    threatLevel: "Medium",
    recommendedAction: "Target accounts where channel access is the main differentiator; emphasize submersible and solid-dielectric strengths."
  },
  {
    id: "ai-lindsey-dlr",
    whatHappened: "Lindsey highlighted growth in dynamic line rating and grid-edge sensing deployments.",
    whyItMatters: "Utilities increasingly want more capacity from existing assets — driving demand for retrofittable sensing, an adjacent space to AccuSense.",
    productImpact: "Adjacent opportunity and mild competition for sensor mindshare; not a direct switchgear/recloser threat.",
    threatLevel: "Low",
    recommendedAction: "Explore whether AccuSense can address line-monitoring/DLR use cases or partner where it cannot."
  },
  {
    id: "ai-market-sf6ban",
    whatHappened: "Regulatory momentum (EU F-Gas revisions, US EPA actions, state-level rules) continues to tighten timelines for phasing out SF6 in new MV switchgear.",
    whyItMatters: "Regulation, not just preference, is now forcing SF6-free procurement — accelerating replacement cycles across the industry.",
    productImpact: "Tailwind for G&W's inherently SF6-free solid-dielectric portfolio if positioned aggressively.",
    threatLevel: "Low",
    recommendedAction: "Lead sales conversations with the regulatory timeline; build a compliance-deadline calculator for utility customers."
  }
];
