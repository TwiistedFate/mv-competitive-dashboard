/* ============================================================================
 *  products.js  —  PRODUCTS & SPECIFICATIONS
 * ----------------------------------------------------------------------------
 *  One object per product. Products power THREE views:
 *    1. The category spec-comparison tables (Product Line Comparison).
 *    2. The "products offered" view on each competitor profile.
 *    3. The 1:1 Product Comparison engine (G&W product → competitor matches).
 *
 *  HOW TO ADD A PRODUCT:
 *    1. Copy a block below and give it a unique `id`.
 *    2. `competitorId` must match an id in competitors.js.
 *    3. `category`     must match an id in categories.js.
 *    4. Put rating values inside `specs`. The KEYS inside `specs` must match the
 *       `specColumns` keys defined for that category in categories.js — that is
 *       how columns line up in the comparison tables.
 *    5. `technology`, `voltageClass`, and `applications` feed the global filters.
 *
 *  FIELDS USED BY THE 1:1 PRODUCT COMPARISON (see assets/comparison.js):
 *    • productFamily — human-readable family/brand (e.g. "Viper", "AirSeT").
 *    • comparableTo  — array of G&W product ids this competitor product competes
 *                      with. This is what makes the matching SPECIFIC rather than
 *                      "everything in the same category". G&W's own products use
 *                      an empty array (they are the anchor, not a match).
 *    • bestUseCase   — one-line "where this product wins" statement.
 *    • strengths / weaknesses — product-level (not company-level) bullets.
 *    • sourceLinks   — [{ label, url }] datasheets / articles for credibility.
 *
 *  ⚠  Spec values below are ILLUSTRATIVE SAMPLES to demonstrate the layout.
 *     Verify against each vendor's published datasheet before using them for
 *     real decisions.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.products = [
  /* ---------------------------- SWITCHGEAR ------------------------------- */
  {
    id: "p-gw-trident",
    competitorId: "gw",
    category: "switchgear",
    name: "Trident",
    productFamily: "Trident",
    comparableTo: [],
    voltageClass: "15–38 kV",
    technology: ["Solid dielectric", "SF6-free"],
    applications: ["Distribution", "Underground"],
    datasheetUrl: "https://www.gwelectric.com/products/trident/",
    keyDifferentiators: ["Solid-dielectric, SF6-free by design", "Compact submersible-capable design"],
    strengths: ["Inherently SF6-free (no alternative gas to manage)", "Dead-front, submersible-rated safety", "Tight fit with G&W reclosers, sensors and accessories"],
    weaknesses: ["Smaller brand reach than the global OEMs", "Lighter European marketing presence"],
    bestUseCase: "Underground and submersible distribution where solid-dielectric safety and a no-gas footprint matter most.",
    sourceLinks: [{ label: "Trident datasheet", url: "https://www.gwelectric.com/products/trident/" }],
    specs: {
      voltageRating: "38 kV",
      currentRating: "600–1200 A",
      shortCircuit: "25 kA",
      insulationType: "Solid dielectric (epoxy)",
      communication: "Sensor-ready",
      environmental: "Submersible / NEMA 6P options"
    },
    notes: "Reference product — your line."
  },
  {
    id: "p-abb-safering",
    competitorId: "abb",
    category: "switchgear",
    name: "SafeRing AirPlus",
    productFamily: "SafeRing / AirPlus",
    comparableTo: ["p-gw-trident"],
    voltageClass: "≤24 kV",
    technology: ["SF6-free", "Dry air"],
    applications: ["Distribution", "Secondary network"],
    datasheetUrl: "https://new.abb.com/medium-voltage",
    keyDifferentiators: ["Eco-efficient AirPlus insulation", "Global availability"],
    strengths: ["Established, large-volume SF6-free range", "Global support and stocking", "Strong Relion/Ability digital tie-in"],
    weaknesses: ["Dry-air gas system to handle vs. solid dielectric", "Premium pricing", "Best value inside the ABB ecosystem"],
    bestUseCase: "Utilities standardizing on a global OEM that want a proven, widely deployed SF6-free RMU.",
    sourceLinks: [{ label: "ABB MV switchgear", url: "https://new.abb.com/medium-voltage" }],
    specs: {
      voltageRating: "24 kV",
      currentRating: "630 A",
      shortCircuit: "21 kA",
      insulationType: "Dry air (AirPlus)",
      communication: "Relion / Ability ready",
      environmental: "IAC AFLR, indoor"
    },
    notes: ""
  },
  {
    id: "p-siemens-bluegis",
    competitorId: "siemens",
    category: "switchgear",
    name: "NXPLUS C blue GIS",
    productFamily: "blue GIS",
    comparableTo: ["p-gw-trident"],
    voltageClass: "≤24 kV",
    technology: ["SF6-free", "Clean air", "Vacuum"],
    applications: ["Distribution", "Secondary network"],
    datasheetUrl: "https://www.siemens.com/blue-gis",
    keyDifferentiators: ["Clean-air (vacuum + dry air) SF6-free", "Compact GIS footprint"],
    strengths: ["Zero fluorinated gas and no PFAS exposure", "Very compact GIS footprint", "Deep SICAM / IEC 61850 digital stack"],
    weaknesses: ["Premium positioning", "Long lead times typical of large OEMs"],
    bestUseCase: "Space-constrained urban substations that need the strongest regulatory/PFAS story in a compact GIS.",
    sourceLinks: [{ label: "Siemens blue GIS", url: "https://www.siemens.com/blue-gis" }],
    specs: {
      voltageRating: "24 kV",
      currentRating: "1250 A",
      shortCircuit: "25 kA",
      insulationType: "Clean air + vacuum",
      communication: "SICAM / IEC 61850",
      environmental: "IAC, indoor GIS"
    },
    notes: ""
  },
  {
    id: "p-schneider-airset",
    competitorId: "schneider",
    category: "switchgear",
    name: "RM AirSeT",
    productFamily: "AirSeT",
    comparableTo: ["p-gw-trident"],
    voltageClass: "≤24 kV",
    technology: ["SF6-free", "Pure air", "Vacuum"],
    applications: ["Distribution", "Secondary network"],
    datasheetUrl: "https://www.se.com/airset",
    keyDifferentiators: ["Pure-air + shunt vacuum interruption", "Digital by design (sensors built in)"],
    strengths: ["SF6-free combined with built-in digital sensing", "EcoStruxure software ecosystem", "Strong sustainability brand"],
    weaknesses: ["Software ecosystem lock-in concerns", "Pure-air interruption is newer in the field"],
    bestUseCase: "Buyers who want an integrated SF6-free + digital package and are comfortable inside EcoStruxure.",
    sourceLinks: [{ label: "Schneider AirSeT", url: "https://www.se.com/airset" }],
    specs: {
      voltageRating: "24 kV",
      currentRating: "630 A",
      shortCircuit: "21 kA",
      insulationType: "Pure air + vacuum",
      communication: "EcoStruxure / IEC 61850",
      environmental: "IAC AFLR, indoor"
    },
    notes: ""
  },
  {
    id: "p-nuventura-nu1",
    competitorId: "nuventura",
    category: "switchgear",
    name: "nu1",
    productFamily: "nu1",
    comparableTo: ["p-gw-trident"],
    voltageClass: "≤24 kV",
    technology: ["SF6-free", "Dry air", "GIS"],
    applications: ["Distribution", "Secondary network"],
    datasheetUrl: "https://nuventura.com",
    keyDifferentiators: ["Dry-air GIS, licensable platform", "Pure-play SF6-free challenger"],
    strengths: ["Modern, pure-play SF6-free design", "Lucy Group backing for scale", "Strong sustainability narrative"],
    weaknesses: ["Limited installed base and track record", "Narrow portfolio; depends on partners for scale"],
    bestUseCase: "DSOs wanting a challenger-priced dry-air GIS with a sustainability-first story.",
    sourceLinks: [{ label: "Nuventura", url: "https://nuventura.com" }],
    specs: {
      voltageRating: "24 kV",
      currentRating: "630 A",
      shortCircuit: "20 kA",
      insulationType: "Dry air (GIS)",
      communication: "Sensor-ready",
      environmental: "Indoor GIS"
    },
    notes: ""
  },

  /* ---------------------------- RECLOSERS -------------------------------- */
  {
    id: "p-gw-viper",
    competitorId: "gw",
    category: "reclosers",
    name: "Viper-ST",
    productFamily: "Viper",
    comparableTo: [],
    voltageClass: "15–38 kV",
    technology: ["Solid dielectric", "Vacuum"],
    applications: ["Distribution automation", "Overhead"],
    datasheetUrl: "https://www.gwelectric.com/products/viper-st/",
    keyDifferentiators: ["Solid-dielectric recloser", "Compact, integrated sensors"],
    strengths: ["Solid-dielectric, SF6-free interrupter", "Integrated current & voltage sensing", "Open DNP3 / IEC 61850 controls"],
    weaknesses: ["Controller / automation ecosystem smaller than S&C", "Less self-healing software of its own"],
    bestUseCase: "Utilities wanting a compact, SF6-free recloser with built-in sensing and open, vendor-neutral controls.",
    sourceLinks: [{ label: "Viper-ST datasheet", url: "https://www.gwelectric.com/products/viper-st/" }],
    specs: {
      voltageRating: "38 kV",
      currentRating: "630–800 A",
      interruptingRating: "16 kA",
      controlPlatform: "Viper control",
      communication: "DNP3 / IEC 61850",
      environmental: "Outdoor, -40…+55 °C"
    },
    notes: "Reference product — your line."
  },
  {
    id: "p-sandc-intellirupter",
    competitorId: "sandc",
    category: "reclosers",
    name: "IntelliRupter PulseCloser",
    productFamily: "IntelliRupter",
    comparableTo: ["p-gw-viper"],
    voltageClass: "15–38 kV",
    technology: ["Pulse-closing", "Vacuum"],
    applications: ["Distribution automation", "FLISR", "Overhead"],
    datasheetUrl: "https://www.sandc.com/en/products--services/products/intellirupter-fault-interrupter/",
    keyDifferentiators: ["PulseClosing testing reduces fault stress", "Tight IntelliTeam FLISR integration"],
    strengths: ["PulseClosing cuts fault energy on test-closes", "Best-in-class IntelliTeam self-healing software", "Deep US utility relationships"],
    weaknesses: ["Premium price", "Strongest value inside the S&C ecosystem"],
    bestUseCase: "Self-healing (FLISR) schemes where minimizing fault stress and tight device-software integration are the priority.",
    sourceLinks: [{ label: "IntelliRupter", url: "https://www.sandc.com/en/products--services/products/intellirupter-fault-interrupter/" }],
    specs: {
      voltageRating: "38 kV",
      currentRating: "800 A",
      interruptingRating: "16 kA",
      controlPlatform: "IntelliRupter control",
      communication: "DNP3 / IEC 61850",
      environmental: "Outdoor, -40…+55 °C"
    },
    notes: ""
  },
  {
    id: "p-sandc-tripsaver",
    competitorId: "sandc",
    category: "reclosers",
    name: "TripSaver II Cutout-Mounted Recloser",
    productFamily: "TripSaver",
    comparableTo: ["p-gw-viper"],
    voltageClass: "15–38 kV",
    technology: ["Vacuum", "Cutout-mounted"],
    applications: ["Lateral protection", "Overhead"],
    datasheetUrl: "https://www.sandc.com/en/products--services/products/tripsaver-ii-cutout-mounted-recloser/",
    keyDifferentiators: ["Drops into existing cutout positions", "Eliminates fuse coordination on laterals"],
    strengths: ["Very low-cost single-phase lateral protection", "Familiar cutout form factor for line crews", "Reduces fuse-replacement truck rolls"],
    weaknesses: ["Single-phase, lateral-only scope", "Not a three-phase feeder automation device"],
    bestUseCase: "Single-phase lateral protection where a low-cost, fuse-replacing recloser beats a full feeder device.",
    sourceLinks: [{ label: "TripSaver II", url: "https://www.sandc.com/en/products--services/products/tripsaver-ii-cutout-mounted-recloser/" }],
    specs: {
      voltageRating: "38 kV",
      currentRating: "200 A",
      interruptingRating: "10 kA",
      controlPlatform: "Self-contained electronic control",
      communication: "Optional wireless link",
      environmental: "Outdoor, -40…+55 °C"
    },
    notes: ""
  },
  {
    id: "p-schneider-recloser",
    competitorId: "schneider",
    category: "reclosers",
    name: "Easergy U-Series Recloser",
    productFamily: "Easergy",
    comparableTo: ["p-gw-viper"],
    voltageClass: "15–38 kV",
    technology: ["Vacuum", "Solid dielectric"],
    applications: ["Distribution automation", "Overhead"],
    datasheetUrl: "https://www.se.com/ww/en/product-range/63426-easergy-u-series/",
    keyDifferentiators: ["ADVC controller with broad protocol support", "EcoStruxure / ADMS integration"],
    strengths: ["Solid-dielectric, SF6-free interrupter", "Flexible ADVC control platform", "Plugs into EcoStruxure grid software"],
    weaknesses: ["Best value inside the EcoStruxure ecosystem", "Smaller North American recloser base than Cooper/S&C"],
    bestUseCase: "Utilities already standardizing on Schneider/EcoStruxure that want a matching SF6-free recloser.",
    sourceLinks: [{ label: "Easergy U-Series", url: "https://www.se.com/ww/en/product-range/63426-easergy-u-series/" }],
    specs: {
      voltageRating: "38 kV",
      currentRating: "630 A",
      interruptingRating: "12.5 kA",
      controlPlatform: "ADVC control",
      communication: "DNP3 / IEC 60870 / IEC 61850",
      environmental: "Outdoor, -40…+55 °C"
    },
    notes: ""
  },
  {
    id: "p-noja-osm",
    competitorId: "noja",
    category: "reclosers",
    name: "OSM Recloser",
    productFamily: "OSM",
    comparableTo: ["p-gw-viper"],
    voltageClass: "15–38 kV",
    technology: ["Vacuum", "Magnetic actuator"],
    applications: ["Distribution automation", "Overhead"],
    datasheetUrl: "https://www.nojapower.com/product/osm-recloser",
    keyDifferentiators: ["Well-documented, globally deployed", "RC controller flexibility"],
    strengths: ["Deployed in 100+ countries with strong support", "Excellent technical documentation", "Competitive pricing vs. the majors"],
    weaknesses: ["Single-category focus (no switchgear/sensors)", "Smaller R&D budget than the majors"],
    bestUseCase: "International and price-sensitive distribution automation needing a proven, well-supported recloser.",
    sourceLinks: [{ label: "NOJA OSM", url: "https://www.nojapower.com/product/osm-recloser" }],
    specs: {
      voltageRating: "38 kV",
      currentRating: "630–800 A",
      interruptingRating: "12.5 kA",
      controlPlatform: "RC-10 control",
      communication: "DNP3 / IEC 60870 / IEC 61850",
      environmental: "Outdoor, -40…+55 °C"
    },
    notes: ""
  },
  {
    id: "p-eaton-nova",
    competitorId: "eaton",
    category: "reclosers",
    name: "NOVA Recloser (Cooper)",
    productFamily: "NOVA",
    comparableTo: ["p-gw-viper"],
    voltageClass: "15–38 kV",
    technology: ["Vacuum", "Solid dielectric"],
    applications: ["Distribution automation", "Overhead"],
    datasheetUrl: "https://www.eaton.com/recloser",
    keyDifferentiators: ["Large Cooper installed base", "Form 6 control familiarity"],
    strengths: ["Huge Cooper installed base in North America", "Form 6/7 controls familiar to crews", "Broad distribution channel"],
    weaknesses: ["Less differentiated tech vs. pulse-closing", "Brand attention split across a very broad portfolio"],
    bestUseCase: "Utilities with an existing Cooper fleet that value installed-base continuity and channel reach.",
    sourceLinks: [{ label: "Eaton reclosers", url: "https://www.eaton.com/recloser" }],
    specs: {
      voltageRating: "38 kV",
      currentRating: "630 A",
      interruptingRating: "16 kA",
      controlPlatform: "Form 6 / Form 7 control",
      communication: "DNP3",
      environmental: "Outdoor, -40…+55 °C"
    },
    notes: ""
  },

  /* ----------------------------- SENSORS -------------------------------- */
  {
    id: "p-gw-accusense",
    competitorId: "gw",
    category: "sensors",
    name: "AccuSense Combined V/I",
    productFamily: "AccuSense",
    comparableTo: [],
    voltageClass: "15–38 kV",
    technology: ["Combined V/I", "Low-power sensor"],
    applications: ["Grid-edge monitoring", "Protection"],
    datasheetUrl: "https://www.gwelectric.com/products/accusense/",
    keyDifferentiators: ["Integrated with G&W switchgear & reclosers", "Combined voltage + current"],
    strengths: ["Combined voltage + current in one device", "Native fit with Trident and Viper", "IEC 61850-9-2 sampled-values ready"],
    weaknesses: ["Less standalone brand recognition than sensor specialists", "Newer entrant vs. established sensor catalogs"],
    bestUseCase: "Grid-edge metering and protection where buying sensing pre-integrated with G&W gear simplifies the project.",
    sourceLinks: [{ label: "AccuSense", url: "https://www.gwelectric.com/products/accusense/" }],
    specs: {
      sensorType: "Combined voltage + current",
      voltageRating: "38 kV",
      accuracyClass: "0.5 / 1.0",
      output: "Low-power analog / digital",
      communication: "IEC 61850-9-2 ready",
      environmental: "Outdoor / submersible options"
    },
    notes: "Reference product — your line."
  },
  {
    id: "p-abb-keva",
    competitorId: "abb",
    category: "sensors",
    name: "KEVA / VLS Sensors",
    productFamily: "KEVA / VLS",
    comparableTo: ["p-gw-accusense"],
    voltageClass: "≤40.5 kV",
    technology: ["Combined V/I", "Low-power sensor"],
    applications: ["Metering", "Protection", "Grid-edge monitoring"],
    datasheetUrl: "https://new.abb.com/medium-voltage/sensors",
    keyDifferentiators: ["Broad sensor range", "Tight Relion protection integration"],
    strengths: ["Wide range with metering-grade accuracy options", "Tight Relion protection integration", "Global support"],
    weaknesses: ["Best value inside the ABB ecosystem", "Less turnkey with non-ABB primary gear"],
    bestUseCase: "ABB-aligned utilities needing metering-grade accuracy classes and Relion protection integration.",
    sourceLinks: [{ label: "ABB sensors", url: "https://new.abb.com/medium-voltage/sensors" }],
    specs: {
      sensorType: "Voltage / current / combined",
      voltageRating: "40.5 kV",
      accuracyClass: "0.5 / 0.2 (metering)",
      output: "Low-power analog",
      communication: "IEC 61850-9-2",
      environmental: "Indoor / outdoor"
    },
    notes: ""
  },
  {
    id: "p-lindsey-elbowsense",
    competitorId: "lindsey",
    category: "sensors",
    name: "ElbowSense",
    productFamily: "ElbowSense",
    comparableTo: ["p-gw-accusense"],
    voltageClass: "15–35 kV",
    technology: ["Cable-mounted sensor", "Combined V/I"],
    applications: ["Underground monitoring", "Fault location"],
    datasheetUrl: "https://www.lindsey-usa.com",
    keyDifferentiators: ["Retrofits onto separable connectors", "Underground visibility"],
    strengths: ["Retrofits onto existing separable connectors", "Purpose-built for underground visibility", "Pairs with Lindsey DLR/monitoring"],
    weaknesses: ["Narrow scope (sensing only)", "Not integrated with primary switching gear"],
    bestUseCase: "Adding voltage/current visibility to existing underground assets without replacing the switchgear.",
    sourceLinks: [{ label: "Lindsey Systems", url: "https://www.lindsey-usa.com" }],
    specs: {
      sensorType: "Cable-accessory V/I sensor",
      voltageRating: "35 kV",
      accuracyClass: "1.0",
      output: "Low-power analog",
      communication: "RTU / SCADA via gateway",
      environmental: "Submersible (elbow interface)"
    },
    notes: ""
  },
  {
    id: "p-hubbell-sensor",
    competitorId: "hubbell",
    category: "sensors",
    name: "MV Voltage/Current Sensors",
    productFamily: "Hubbell MV Sensors",
    comparableTo: ["p-gw-accusense"],
    voltageClass: "15–35 kV",
    technology: ["Voltage sensor", "Current sensor"],
    applications: ["Metering", "Monitoring"],
    datasheetUrl: "https://www.hubbellpowersystems.com",
    keyDifferentiators: ["Broad utility catalog availability"],
    strengths: ["Available through a broad utility channel", "Easy to source alongside other Hubbell hardware"],
    weaknesses: ["Less integrated digital story", "Not packaged with primary switching"],
    bestUseCase: "Utilities that want sensors from a familiar, broad-line distribution hardware supplier.",
    sourceLinks: [{ label: "Hubbell Power Systems", url: "https://www.hubbellpowersystems.com" }],
    specs: {
      sensorType: "Voltage / current",
      voltageRating: "35 kV",
      accuracyClass: "1.0",
      output: "Analog",
      communication: "Via metering/RTU",
      environmental: "Outdoor"
    },
    notes: ""
  },

  /* ------------------------- CABLE ACCESSORIES -------------------------- */
  {
    id: "p-gw-terminations",
    competitorId: "gw",
    category: "cable-accessories",
    name: "Separable Connectors & Terminations",
    productFamily: "Cable Accessories",
    comparableTo: [],
    voltageClass: "15–38 kV",
    technology: ["Separable connector", "Deadbreak / loadbreak"],
    applications: ["Underground", "Switchgear interface"],
    datasheetUrl: "https://www.gwelectric.com/products/",
    keyDifferentiators: ["Matched to G&W switchgear bushings"],
    strengths: ["Engineered to match G&W switchgear bushings", "Submersible-rated interfaces", "Single-vendor accountability with the gear"],
    weaknesses: ["Catalog breadth narrower than accessory specialists"],
    bestUseCase: "Projects buying G&W switchgear that want accessories guaranteed to interface with the same bushings.",
    sourceLinks: [{ label: "G&W products", url: "https://www.gwelectric.com/products/" }],
    specs: {
      accessoryType: "Elbow / termination",
      voltageRating: "38 kV",
      conductorRange: "#2 – 1000 kcmil",
      interface: "IEEE 386 (200 A / 600 A)",
      installation: "Push-on",
      environmental: "Submersible"
    },
    notes: "Reference product — your line."
  },
  {
    id: "p-hubbell-accessories",
    competitorId: "hubbell",
    category: "cable-accessories",
    name: "Cable Accessories & Connectors",
    productFamily: "Hubbell Cable Accessories",
    comparableTo: ["p-gw-terminations"],
    voltageClass: "15–35 kV",
    technology: ["Separable connector", "Cold shrink"],
    applications: ["Underground"],
    datasheetUrl: "https://www.hubbellpowersystems.com",
    keyDifferentiators: ["Very broad accessory catalog", "Strong stocking channel"],
    strengths: ["Very broad accessory catalog", "Strong stocking and availability", "Cold-shrink and push-on options"],
    weaknesses: ["Less sensored-accessory focus", "Not tied to a single switchgear platform"],
    bestUseCase: "Crews that need broad, immediately-available accessory coverage across many cable types.",
    sourceLinks: [{ label: "Hubbell Power Systems", url: "https://www.hubbellpowersystems.com" }],
    specs: {
      accessoryType: "Elbow / splice / termination",
      voltageRating: "35 kV",
      conductorRange: "#2 – 1000 kcmil",
      interface: "IEEE 386",
      installation: "Cold shrink / push-on",
      environmental: "Submersible"
    },
    notes: ""
  },

  /* ----------------------- FAULT CURRENT LIMITERS ---------------------- */
  {
    id: "p-gw-clip",
    competitorId: "gw",
    category: "fault-current-limiters",
    name: "CLiP Current-Limiting Protector",
    productFamily: "CLiP",
    comparableTo: [],
    voltageClass: "≤38 kV",
    technology: ["Current-limiting", "Fault interruption"],
    applications: ["Fault level management", "Bus coupling", "Source protection"],
    datasheetUrl: "https://www.gwelectric.com/products/clip/",
    keyDifferentiators: ["Sub-cycle current limiting that protects downstream gear", "Field-proven on utility and industrial buses"],
    strengths: ["Sub-cycle limiting protects aging switchgear", "Mature, field-proven design", "Backed by G&W application engineering"],
    weaknesses: ["Replaceable element after an operation", "Niche awareness vs. the global OEM FCLs"],
    bestUseCase: "Rising fault levels from DER or interties where existing switchgear must be protected without a full upgrade.",
    sourceLinks: [{ label: "CLiP", url: "https://www.gwelectric.com/products/clip/" }],
    specs: {
      voltageRating: "38 kV",
      currentRating: "up to 5000 A",
      limitingType: "Current-limiting protector (CLiP)",
      responseTime: "< 1 ms",
      letThrough: "Major peak reduction",
      environmental: "Indoor / outdoor"
    },
    notes: "Reference product — your line."
  },
  {
    id: "p-abb-islimiter",
    competitorId: "abb",
    category: "fault-current-limiters",
    name: "Is-limiter",
    productFamily: "Is-limiter",
    comparableTo: ["p-gw-clip"],
    voltageClass: "≤40.5 kV",
    technology: ["Pyrotechnic", "Is-limiter"],
    applications: ["Bus coupling", "Fault level management"],
    datasheetUrl: "https://new.abb.com/medium-voltage/is-limiter",
    keyDifferentiators: ["Sub-millisecond fault current limiting", "Mature, widely deployed"],
    strengths: ["Sub-millisecond limiting", "Very large global installed base", "Protects existing switchgear in place"],
    weaknesses: ["Single-shot insert replacement after operation", "Best value inside the ABB ecosystem"],
    bestUseCase: "Bus-coupling and fault-level management where the broadest installed-base reference matters.",
    sourceLinks: [{ label: "ABB Is-limiter", url: "https://new.abb.com/medium-voltage/is-limiter" }],
    specs: {
      voltageRating: "40.5 kV",
      currentRating: "up to 5000 A",
      limitingType: "Pyrotechnic (Is-limiter)",
      responseTime: "< 1 ms",
      letThrough: "Major peak reduction",
      environmental: "Indoor"
    },
    notes: ""
  },
  {
    id: "p-siemens-fcl",
    competitorId: "siemens",
    category: "fault-current-limiters",
    name: "Fault Current Limiting Solutions",
    productFamily: "Siemens FCL",
    comparableTo: ["p-gw-clip"],
    voltageClass: "≤40.5 kV",
    technology: ["Is-limiter", "Reactor-based"],
    applications: ["Fault level management", "Bus coupling"],
    datasheetUrl: "https://www.siemens.com/medium-voltage",
    keyDifferentiators: ["Part of broader MV protection portfolio"],
    strengths: ["Part of a broad MV protection portfolio", "Multiple limiting technologies offered"],
    weaknesses: ["Application-specific engineering needed", "Less of a single flagship product story"],
    bestUseCase: "Buyers wanting fault-level management bundled into a wider Siemens MV project.",
    sourceLinks: [{ label: "Siemens MV", url: "https://www.siemens.com/medium-voltage" }],
    specs: {
      voltageRating: "40.5 kV",
      currentRating: "application-specific",
      limitingType: "Pyrotechnic / reactor",
      responseTime: "< 1 ms (pyrotechnic)",
      letThrough: "Significant",
      environmental: "Indoor"
    },
    notes: ""
  },

  /* ------------------------------ SOFTWARE ----------------------------- */
  {
    id: "p-sandc-intelliteam",
    competitorId: "sandc",
    category: "software",
    name: "IntelliTeam SG",
    productFamily: "IntelliTeam",
    comparableTo: [],
    voltageClass: "n/a",
    technology: ["FLISR", "Distribution automation"],
    applications: ["Self-healing grid", "Outage restoration"],
    datasheetUrl: "https://www.sandc.com/en/products--services/products/intelliteam-sg-automatic-restoration-system/",
    keyDifferentiators: ["Distributed, peer-to-peer self-healing", "Tightly bound to S&C devices"],
    strengths: ["Proven distributed FLISR", "Peer-to-peer restoration logic"],
    weaknesses: ["Best within the S&C device ecosystem"],
    bestUseCase: "Distributed self-healing restoration on feeders built around S&C devices.",
    sourceLinks: [{ label: "IntelliTeam SG", url: "https://www.sandc.com/en/products--services/products/intelliteam-sg-automatic-restoration-system/" }],
    specs: {
      deployment: "Distributed (device-level) + central",
      modules: "FLISR, restoration, DA",
      protocols: "DNP3, IEC 61850",
      integration: "S&C devices; ADMS interfaces",
      analytics: "Automated restoration logic"
    },
    notes: ""
  },
  {
    id: "p-schneider-ecostruxure",
    competitorId: "schneider",
    category: "software",
    name: "EcoStruxure ADMS",
    productFamily: "EcoStruxure",
    comparableTo: [],
    voltageClass: "n/a",
    technology: ["ADMS", "DERMS", "Monitoring"],
    applications: ["Grid monitoring", "DER management", "Outage management"],
    datasheetUrl: "https://www.se.com/ww/en/product-range/61750-ecostruxure-adms/",
    keyDifferentiators: ["Full ADMS + DERMS suite", "Vendor-agnostic data integration"],
    strengths: ["Full ADMS + DERMS suite", "Vendor-agnostic data integration"],
    weaknesses: ["Large platform; significant implementation effort"],
    bestUseCase: "Utilities consolidating ADMS/DERMS/OMS onto one vendor-agnostic platform.",
    sourceLinks: [{ label: "EcoStruxure ADMS", url: "https://www.se.com/ww/en/product-range/61750-ecostruxure-adms/" }],
    specs: {
      deployment: "Cloud / on-prem / hybrid",
      modules: "ADMS, OMS, DERMS, monitoring",
      protocols: "DNP3, IEC 61850, ICCP",
      integration: "Multi-vendor, GIS/SCADA",
      analytics: "Power flow, hosting capacity, AI"
    },
    notes: ""
  },
  {
    id: "p-abb-ability",
    competitorId: "abb",
    category: "software",
    name: "ABB Ability Grid Monitoring",
    productFamily: "ABB Ability",
    comparableTo: [],
    voltageClass: "n/a",
    technology: ["Monitoring", "Digital substation", "Analytics"],
    applications: ["Asset monitoring", "Grid-edge analytics"],
    datasheetUrl: "https://new.abb.com/ability",
    keyDifferentiators: ["Connects ABB devices + sensors to analytics"],
    strengths: ["Connects ABB devices and sensors to cloud analytics", "Condition-monitoring depth"],
    weaknesses: ["Strongest inside the ABB hardware base"],
    bestUseCase: "Asset and grid-edge monitoring for fleets built primarily on ABB hardware.",
    sourceLinks: [{ label: "ABB Ability", url: "https://new.abb.com/ability" }],
    specs: {
      deployment: "Cloud / edge",
      modules: "Asset monitoring, analytics",
      protocols: "IEC 61850, DNP3, MQTT",
      integration: "ABB devices + third-party",
      analytics: "Condition monitoring, AI"
    },
    notes: ""
  }
];
