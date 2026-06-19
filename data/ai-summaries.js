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
    whatHappened: "ABB won a contract to supply its next-generation SF6-free SafeRing/SafePlus Air 24 kV secondary switchgear to E.ON, Germany's largest distribution system operator.",
    whyItMatters: "A framework win with Europe's largest DSO validates ABB's eco-efficient portfolio at scale right as the EU F-gas ban on SF6 (≤24 kV) takes effect in 2026.",
    productImpact: "Directly competes with Trident SF6-free positioning in Europe and sets a reference other DSOs will benchmark against.",
    threatLevel: "High",
    recommendedAction: "Refresh Trident vs. AirPlus comparison collateral; emphasize solid-dielectric and submersible advantages, and target North American utilities before EU momentum spills over."
  },
  {
    id: "ai-schneider-airset",
    whatHappened: "Schneider Electric and E.ON signed a long-term agreement to accelerate deployment of SF6-free (AirSeT) medium-voltage switchgear across E.ON's networks.",
    whyItMatters: "Two majors (ABB and Schneider) now hold large SF6-free framework agreements with E.ON — a strong signal that SF6-free is becoming the default procurement standard in Europe.",
    productImpact: "Bundling AirSeT hardware with EcoStruxure digital pressures both Trident (switchgear) and AccuSense (sensors) as an integrated offer.",
    threatLevel: "High",
    recommendedAction: "Position AccuSense + Trident as an equally integrated, open alternative without software lock-in; build a head-to-head spec sheet vs. AirSeT."
  },
  {
    id: "ai-siemens-bluegis",
    whatHappened: "Siemens expanded its blue GIS clean-air switchgear (vacuum + natural-origin gases, GWP < 1) up to 24 kV, including NXPLUS C 24 and 8DJH variants free of fluorinated and PFAS gases.",
    whyItMatters: "Clean-air avoids any fluorinated gas and the emerging PFAS scrutiny entirely — a powerful regulatory and sustainability story for utilities.",
    productImpact: "Raises the bar for the whole market; reinforces that any SF6 or alternative-gas solution now looks dated.",
    threatLevel: "Medium",
    recommendedAction: "Ensure Trident messaging clearly states zero fluorinated gas and zero PFAS exposure; prepare a solid-dielectric vs. clean-air technical FAQ."
  },
  {
    id: "ai-sandc-intellirupter",
    whatHappened: "At DTECH 2026, S&C announced a collaboration making SEL's upcoming SEL-651RD Advanced Digital Control an interoperable option for the IntelliRupter PulseCloser over a standard fiber interface.",
    whyItMatters: "Opening IntelliRupter to a best-in-class third-party relay/control lets S&C address utilities that standardize on SEL — widening its addressable base while keeping PulseClosing's ~95% fault-energy reduction.",
    productImpact: "Strengthens the IntelliRupter value proposition against the Viper line on both technology and ecosystem flexibility.",
    threatLevel: "High",
    recommendedAction: "Evaluate Viper interoperability with SEL and other leading controls/ADMS; quantify Viper reliability and total-cost advantages to offset S&C's automation ecosystem."
  },
  {
    id: "ai-noja-osm",
    whatHappened: "NOJA Power's RC-20 recloser control (from the ARENA Intelligent Switchgear project) was deployed across 100 units in Australia — described as the world's first large-scale synchrophasor measurement in an MV distribution network.",
    whyItMatters: "Synchrophasor-grade measurement in a distribution recloser is a genuine grid-intelligence step that supports high-renewables networks, an area utilities are prioritizing.",
    productImpact: "Pressures Viper on advanced measurement/analytics, especially in renewables-heavy and international markets where NOJA is strong.",
    threatLevel: "Medium",
    recommendedAction: "Assess AccuSense + Viper measurement capabilities vs. RC-20 synchrophasor claims; highlight integrated sensing and DER-hosting use cases."
  },
  {
    id: "ai-schneider-grid",
    whatHappened: "Schneider launched One Digital Grid Platform, unifying EcoStruxure ADMS, DERMS and ArcFM with AI-powered restoration-time estimates and an embedded Grid AI Assistant.",
    whyItMatters: "Schneider is pushing from devices into recurring grid-software/AI revenue — the highest-margin, stickiest layer and the one hardest for hardware-led competitors to match.",
    productImpact: "Indirect but strategic: deepens Schneider's account control at utilities, making it harder to displace its hardware downstream.",
    threatLevel: "Medium",
    recommendedAction: "Pursue software partnerships (ADMS/DERMS) or the Safegrid investment so G&W hardware remains first-class inside multi-vendor software, not locked out."
  },
  {
    id: "ai-nuventura-lucy",
    whatHappened: "Lucy Group acquired 100% of Berlin-based Nuventura, a leader in primary SF6-free (dry-air) GIS up to 36 kV.",
    whyItMatters: "A pure-play dry-air disruptor just gained the manufacturing scale, capital, and global channel of an established switchgear group — turning a niche technology licensor into a credible volume competitor.",
    productImpact: "Adds a better-resourced SF6-free GIS competitor that could now reach North American distribution (Nuventura already signed a Canadian/US partner).",
    threatLevel: "Medium",
    recommendedAction: "Track Lucy/Nuventura's North American go-to-market and pricing; watch for dry-air GIS entering segments adjacent to Trident."
  },
  {
    id: "ai-eaton-xiria",
    whatHappened: "Eaton positioned its long-running SF6-free Xiria line (1M+ panels shipped, vacuum + solid insulation) as utilities navigate the EU SF6 phase-out.",
    whyItMatters: "Eaton's decades of SF6-free shipments and broad North American channel make it a credible, low-risk choice for utilities wary of newer SF6-free designs.",
    productImpact: "Competes with Trident in secondary distribution, leaning on installed-base trust and channel reach rather than novel technology.",
    threatLevel: "Medium",
    recommendedAction: "Target accounts where channel access is the main differentiator; emphasize submersible and solid-dielectric strengths and application engineering."
  },
  {
    id: "ai-lindsey-dlr",
    whatHappened: "Lindsey updated SMARTLINE, its dynamic line rating / capacity-forecasting solution, paired with high-accuracy (0.2% class) GEN2 line sensors.",
    whyItMatters: "Utilities increasingly want more capacity from existing assets — driving demand for retrofittable sensing and DLR, an adjacent space to AccuSense.",
    productImpact: "Adjacent opportunity and mild competition for sensor mindshare; not a direct switchgear/recloser threat.",
    threatLevel: "Low",
    recommendedAction: "Explore whether AccuSense (plus the Safegrid investment) can address line-monitoring/DLR use cases, or partner where it cannot."
  },
  {
    id: "ai-market-sf6ban",
    whatHappened: "ABB published guidance on preparing for the January 2026 EU F-gas ban on SF6 in new MV switchgear up to 24 kV (extending to 52 kV in 2030).",
    whyItMatters: "Regulation — not just preference — is now forcing SF6-free procurement, compressing replacement cycles across the industry on a fixed timeline.",
    productImpact: "Tailwind for G&W's inherently SF6-free solid-dielectric portfolio if positioned aggressively against the deadline.",
    threatLevel: "Low",
    recommendedAction: "Lead sales conversations with the regulatory timeline; build a compliance-deadline calculator and migration guide for utility customers."
  }
];
