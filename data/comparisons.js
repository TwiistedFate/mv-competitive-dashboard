/* ============================================================================
 *  comparisons.js  —  1:1 PRODUCT-PAIR INTELLIGENCE
 * ----------------------------------------------------------------------------
 *  Optional, curated "AI-style" read-outs for a specific G&W-product ↔
 *  competitor-product pair. These power the highlighted summary and the
 *  "gaps / risks" line on the 1:1 Product Comparison page.
 *
 *  This file is OPTIONAL. If a pair is not listed here, the page auto-generates
 *  a solid business-language summary from the product data (see
 *  assets/comparison.js → buildAutoSummary). Add an entry here only when you
 *  want to override that with a sharper, hand-written take.
 *
 *  HOW TO ADD A CURATED COMPARISON:
 *    DB.comparisons["<gwProductId>"]["<competitorProductId>"] = {
 *      edge: "G&W" | "Competitor" | "Even",   // who leads, used for the badge
 *      summary: "Two or three sentences in plain business language.",
 *      gaps: ["Gap or risk for G&W vs. this competitor", ...]
 *    };
 *
 *  Ids must match the `id` fields in data/products.js.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.comparisons = {
  /* ----------------------------- VIPER ---------------------------------- */
  "p-gw-viper": {
    "p-sandc-intellirupter": {
      edge: "Competitor",
      summary:
        "Both are 38 kV, 16 kA distribution reclosers, so the hardware is a close match. The real difference is the system around the device: S&C pairs the IntelliRupter with PulseClosing and the IntelliTeam self-healing suite, which is the strongest automation story in the segment. Viper competes on a simpler, lower-cost, SF6-free package with integrated sensing and open controls — a better fit when the utility does not want to be locked into one vendor's automation stack.",
      gaps: [
        "S&C's IntelliTeam FLISR / self-healing software is more mature than anything G&W offers natively",
        "PulseClosing is a marketable fault-stress-reduction claim Viper does not directly counter",
        "S&C's incumbency in large US IOUs makes displacement a relationship sale, not just a spec sale"
      ]
    },
    "p-sandc-tripsaver": {
      edge: "G&W",
      summary:
        "These solve different problems. TripSaver II is a single-phase, cutout-mounted recloser aimed at lateral protection and replacing fuses; Viper is a full three-phase feeder recloser with integrated sensing. Where the requirement is real feeder automation, Viper is the right class of device. TripSaver only wins when the scope is genuinely single-phase lateral protection on a budget.",
      gaps: [
        "On low-cost single-phase laterals, a Viper is over-specified and more expensive than a TripSaver",
        "S&C can lead with TripSaver to get a foot in the door, then expand to IntelliRupter"
      ]
    },
    "p-schneider-recloser": {
      edge: "Even",
      summary:
        "Technically very comparable: both are SF6-free, solid-dielectric reclosers in the same voltage and current band. Schneider's advantage is pulling the recloser into the EcoStruxure ADMS/DERMS ecosystem; Viper's advantage is open, vendor-neutral controls and built-in V/I sensing without software lock-in. The decision usually follows whichever software platform the utility has already chosen.",
      gaps: [
        "Schneider can bundle the recloser into a larger EcoStruxure software deal Viper cannot match alone",
        "Schneider's global brand and sustainability marketing outrun G&W's in Europe"
      ]
    },
    "p-noja-osm": {
      edge: "Even",
      summary:
        "A close head-to-head on price and capability. NOJA is a focused recloser specialist with excellent documentation and a presence in 100+ countries, which makes it strong on international tenders. Viper counters with solid-dielectric construction, integrated sensing, and the ability to be sold as part of a broader G&W system rather than a standalone box.",
      gaps: [
        "NOJA's global distribution and documentation set a high bar on international bids",
        "NOJA's single-minded recloser focus can out-execute on pure recloser RFQs"
      ]
    },
    "p-eaton-nova": {
      edge: "G&W",
      summary:
        "Both are credible North American reclosers, but they compete on different ground. Eaton leans on the very large Cooper/NOVA installed base and familiar Form 6/7 controls. Viper's edge is a more modern, integrated sensing package and open communications — the stronger story for utilities modernizing rather than replacing like-for-like.",
      gaps: [
        "Eaton's Cooper installed base and channel make like-for-like replacements easy for them to win",
        "Crews already trained on Form 6/7 controls represent switching-cost inertia"
      ]
    }
  },

  /* ----------------------------- TRIDENT -------------------------------- */
  "p-gw-trident": {
    "p-schneider-airset": {
      edge: "Even",
      summary:
        "Both are SF6-free MV switchgear, but the philosophy differs. AirSeT combines pure-air interruption with built-in digital sensing inside the EcoStruxure ecosystem. Trident is solid-dielectric and submersible-capable with no gas system to manage at all, and it stays open rather than tying the buyer to one software platform. Trident wins on underground/submersible duty and simplicity; AirSeT wins on integrated digital and brand reach.",
      gaps: [
        "Schneider's 'SF6-free + digital by design' bundle is a stronger marketing package",
        "EcoStruxure account control makes Schneider hard to displace downstream",
        "Larger European reference base for SF6-free at scale"
      ]
    },
    "p-abb-safering": {
      edge: "Even",
      summary:
        "AirPlus is one of the most widely deployed SF6-free ranges, which makes it a low-risk default for utilities standardizing on a global OEM. Trident differentiates with solid-dielectric (no dry-air gas system to maintain) and submersible ratings, plus single-vendor fit with G&W reclosers and accessories. The choice often comes down to OEM-standardization vs. solid-dielectric simplicity.",
      gaps: [
        "ABB's installed base and global support make it the safe procurement choice",
        "AirPlus brand recognition in Europe exceeds Trident's"
      ]
    },
    "p-siemens-bluegis": {
      edge: "Competitor",
      summary:
        "blue GIS uses clean air with zero fluorinated gas and no PFAS exposure in a very compact GIS footprint — the strongest regulatory and space story in the segment. Trident answers with solid-dielectric construction (also no fluorinated gas) and submersible capability, at a simpler, more service-led commercial profile. For tight urban GIS rooms with strict PFAS scrutiny, Siemens leads; for underground/submersible distribution, Trident is the better fit.",
      gaps: [
        "Siemens' clean-air + compact GIS story is hard to beat on urban space and PFAS messaging",
        "Siemens' digital substation stack (SICAM) outweighs G&W's software depth"
      ]
    },
    "p-nuventura-nu1": {
      edge: "G&W",
      summary:
        "Nuventura is a credible pure-play SF6-free challenger, now backed by the Lucy Group for scale. Its strength is a modern dry-air GIS and a sharp sustainability narrative. Trident counters with a proven installed base, solid-dielectric simplicity, submersible ratings, and a full surrounding portfolio — advantages a young, narrow-portfolio competitor cannot yet match.",
      gaps: [
        "Watch Lucy/Nuventura's North American go-to-market and aggressive challenger pricing",
        "Strong sustainability storytelling can resonate with DSOs despite the thin track record"
      ]
    }
  },

  /* ---------------------------- ACCUSENSE ------------------------------- */
  "p-gw-accusense": {
    "p-abb-keva": {
      edge: "Even",
      summary:
        "Both are low-power combined V/I sensors aimed at metering, protection, and grid-edge visibility. ABB's KEVA/VLS range is broader and offers metering-grade accuracy classes with tight Relion integration. AccuSense's advantage is being pre-integrated with G&W switchgear and reclosers, which removes integration risk when the primary gear is also G&W.",
      gaps: [
        "ABB offers higher metering-grade accuracy classes (0.2) than AccuSense's published range",
        "KEVA benefits from ABB's brand and protection-relay pull-through"
      ]
    },
    "p-lindsey-elbowsense": {
      edge: "G&W",
      summary:
        "ElbowSense is a specialist retrofit sensor that clips onto existing separable connectors — ideal for adding visibility to assets already in the ground. AccuSense targets new-build and integrated applications where sensing ships with the switchgear or recloser. They overlap on underground monitoring but win in different scenarios: retrofit vs. integrated new install.",
      gaps: [
        "For pure retrofit-onto-existing-elbows jobs, Lindsey is purpose-built and hard to beat",
        "Lindsey's DLR/monitoring ecosystem adds pull beyond the sensor itself"
      ]
    },
    "p-hubbell-sensor": {
      edge: "G&W",
      summary:
        "Hubbell's MV sensors are easy to source through a broad utility channel but carry a thinner digital and integration story. AccuSense leads on combined V/I in a single device, IEC 61850 sampled-values readiness, and native fit with G&W primary gear — a stronger position wherever sensing is part of a larger system rather than a commodity purchase.",
      gaps: [
        "Hubbell's broad stocking channel makes its sensors easy to specify and source",
        "Buyers already standardized on Hubbell hardware may default to it"
      ]
    }
  },

  /* -------------------------- CABLE ACCESSORIES ------------------------- */
  "p-gw-terminations": {
    "p-hubbell-accessories": {
      edge: "Even",
      summary:
        "Hubbell's strength is catalog breadth and a deep stocking channel — if you need almost any accessory quickly, they have it. G&W's separable connectors and terminations are engineered to match G&W switchgear bushings, giving single-vendor accountability when the gear is also G&W. Breadth vs. system-fit is the core trade-off.",
      gaps: [
        "Hubbell's catalog breadth and availability exceed G&W's accessory range",
        "On mixed-vendor jobs, Hubbell's channel reach is an advantage"
      ]
    }
  },

  /* ------------------------------- CLiP --------------------------------- */
  "p-gw-clip": {
    "p-abb-islimiter": {
      edge: "Even",
      summary:
        "Both deliver sub-cycle fault-current limiting that protects existing switchgear from rising fault levels without a full upgrade. ABB's Is-limiter has the larger global installed base and reference list. CLiP competes on a field-proven design backed by G&W application engineering, and is a natural cross-sell into accounts already buying G&W primary equipment.",
      gaps: [
        "ABB's Is-limiter installed base and global references set the benchmark",
        "Both require element replacement after an operation — not a differentiator either way"
      ]
    },
    "p-siemens-fcl": {
      edge: "G&W",
      summary:
        "Siemens offers fault-current limiting as part of a broader MV project rather than as a flagship product, with application-specific engineering each time. CLiP is a focused, field-proven current-limiting protector with a clear product story and G&W engineering support — an advantage when the utility wants a known device rather than a bespoke solution bundled into a larger order.",
      gaps: [
        "Siemens can bundle limiting into a larger MV system sale CLiP cannot match alone",
        "Siemens' multi-technology portfolio covers reactor-based options too"
      ]
    }
  }
};
