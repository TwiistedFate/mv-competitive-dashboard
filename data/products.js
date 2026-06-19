/* ============================================================================
 *  products.js  —  PRODUCTS & SPECIFICATIONS
 * ----------------------------------------------------------------------------
 *  One object per product. Products power BOTH the category spec-comparison
 *  tables and the "products offered" view on competitor profiles.
 *
 *  HOW TO ADD A PRODUCT:
 *    1. Copy a block below.
 *    2. `competitorId` must match an id in competitors.js.
 *    3. `category`     must match an id in categories.js.
 *    4. Put rating values inside `specs`. The KEYS inside `specs` must match
 *       the `specColumns` keys defined for that category in categories.js —
 *       that is how the columns line up in the comparison table.
 *    5. `technology`, `voltageClass`, and `applications` are used by the
 *       global filters (technology type / voltage class / application).
 *
 *  ⚠  The spec values below are ILLUSTRATIVE SAMPLES to demonstrate the
 *     layout. Verify against each vendor's published datasheet before using
 *     them for real decisions.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.products = [
  /* ---------------------------- SWITCHGEAR ------------------------------- */
  {
    id: "p-gw-trident",
    competitorId: "gw",
    category: "switchgear",
    name: "Trident",
    voltageClass: "15–38 kV",
    technology: ["Solid dielectric", "SF6-free"],
    applications: ["Distribution", "Underground"],
    datasheetUrl: "https://www.gwelectric.com/products/trident/",
    keyDifferentiators: ["Solid-dielectric, SF6-free by design", "Compact submersible-capable design"],
    strengths: ["No SF6", "Deadfront safety", "Submersible options"],
    weaknesses: ["Smaller brand reach than global OEMs"],
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
    voltageClass: "≤24 kV",
    technology: ["SF6-free", "Dry air"],
    applications: ["Distribution", "Secondary network"],
    datasheetUrl: "https://new.abb.com/medium-voltage",
    keyDifferentiators: ["Eco-efficient AirPlus insulation", "Global availability"],
    strengths: ["Established SF6-free range", "Global support"],
    weaknesses: ["Premium pricing"],
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
    voltageClass: "≤24 kV",
    technology: ["SF6-free", "Clean air", "Vacuum"],
    applications: ["Distribution", "Secondary network"],
    datasheetUrl: "https://www.siemens.com/blue-gis",
    keyDifferentiators: ["Clean-air (vacuum + dry air) SF6-free", "Compact GIS footprint"],
    strengths: ["No fluorinated gases", "Digital-ready"],
    weaknesses: ["Premium positioning"],
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
    voltageClass: "≤24 kV",
    technology: ["SF6-free", "Pure air", "Vacuum"],
    applications: ["Distribution", "Secondary network"],
    datasheetUrl: "https://www.se.com/airset",
    keyDifferentiators: ["Pure-air + shunt vacuum interruption", "Digital by design (sensors built in)"],
    strengths: ["SF6-free + digital", "EcoStruxure integration"],
    weaknesses: ["Software ecosystem lock-in concerns"],
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
    voltageClass: "≤24 kV",
    technology: ["SF6-free", "Dry air", "GIS"],
    applications: ["Distribution", "Secondary network"],
    datasheetUrl: "https://nuventura.com",
    keyDifferentiators: ["Dry-air GIS, licensable platform", "Pure-play SF6-free challenger"],
    strengths: ["Modern SF6-free design", "Licensing-based scaling"],
    weaknesses: ["Limited installed base"],
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
    voltageClass: "15–38 kV",
    technology: ["Solid dielectric", "Vacuum"],
    applications: ["Distribution automation", "Overhead"],
    datasheetUrl: "https://www.gwelectric.com/products/viper-st/",
    keyDifferentiators: ["Solid-dielectric recloser", "Compact, integrated sensors"],
    strengths: ["No SF6", "Integrated current & voltage sensing"],
    weaknesses: ["Controller ecosystem smaller than S&C"],
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
    voltageClass: "15–38 kV",
    technology: ["Pulse-closing", "Vacuum"],
    applications: ["Distribution automation", "FLISR", "Overhead"],
    datasheetUrl: "https://www.sandc.com/en/products--services/products/intellirupter-fault-interrupter/",
    keyDifferentiators: ["PulseClosing testing reduces fault stress", "Tight IntelliTeam FLISR integration"],
    strengths: ["Pulse-closing", "Best-in-class self-healing software"],
    weaknesses: ["Premium price"],
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
    id: "p-noja-osm",
    competitorId: "noja",
    category: "reclosers",
    name: "OSM Recloser",
    voltageClass: "15–38 kV",
    technology: ["Vacuum", "Magnetic actuator"],
    applications: ["Distribution automation", "Overhead"],
    datasheetUrl: "https://www.nojapower.com/product/osm-recloser",
    keyDifferentiators: ["Well-documented, globally deployed", "RC controller flexibility"],
    strengths: ["Strong global support", "Competitive pricing"],
    weaknesses: ["Single-category focus"],
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
    voltageClass: "15–38 kV",
    technology: ["Vacuum", "Solid dielectric"],
    applications: ["Distribution automation", "Overhead"],
    datasheetUrl: "https://www.eaton.com/recloser",
    keyDifferentiators: ["Large Cooper installed base", "Form 6 control familiarity"],
    strengths: ["Installed base", "Channel reach"],
    weaknesses: ["Less differentiated tech vs. pulse-closing"],
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
    voltageClass: "15–38 kV",
    technology: ["Combined V/I", "Low-power sensor"],
    applications: ["Grid-edge monitoring", "Protection"],
    datasheetUrl: "https://www.gwelectric.com/products/accusense/",
    keyDifferentiators: ["Integrated with G&W switchgear & reclosers", "Combined voltage + current"],
    strengths: ["Integrated portfolio fit", "Compact"],
    weaknesses: ["Less standalone brand recognition vs. sensor specialists"],
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
    voltageClass: "≤40.5 kV",
    technology: ["Combined V/I", "Low-power sensor"],
    applications: ["Metering", "Protection", "Grid-edge monitoring"],
    datasheetUrl: "https://new.abb.com/medium-voltage/sensors",
    keyDifferentiators: ["Broad sensor range", "Tight Relion protection integration"],
    strengths: ["Accuracy options", "Global support"],
    weaknesses: ["Best value inside ABB ecosystem"],
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
    voltageClass: "15–35 kV",
    technology: ["Cable-mounted sensor", "Combined V/I"],
    applications: ["Underground monitoring", "Fault location"],
    datasheetUrl: "https://www.lindsey-usa.com",
    keyDifferentiators: ["Retrofits onto separable connectors", "Underground visibility"],
    strengths: ["Retrofittable", "Underground focus"],
    weaknesses: ["Narrow scope"],
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
    voltageClass: "15–35 kV",
    technology: ["Voltage sensor", "Current sensor"],
    applications: ["Metering", "Monitoring"],
    datasheetUrl: "https://www.hubbellpowersystems.com",
    keyDifferentiators: ["Broad utility catalog availability"],
    strengths: ["Channel availability"],
    weaknesses: ["Less integrated digital story"],
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
    voltageClass: "15–38 kV",
    technology: ["Separable connector", "Deadbreak / loadbreak"],
    applications: ["Underground", "Switchgear interface"],
    datasheetUrl: "https://www.gwelectric.com/products/",
    keyDifferentiators: ["Matched to G&W switchgear bushings"],
    strengths: ["System fit"],
    weaknesses: ["Catalog breadth vs. accessory specialists"],
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
    voltageClass: "15–35 kV",
    technology: ["Separable connector", "Cold shrink"],
    applications: ["Underground"],
    datasheetUrl: "https://www.hubbellpowersystems.com",
    keyDifferentiators: ["Very broad accessory catalog", "Strong stocking channel"],
    strengths: ["Availability", "Breadth"],
    weaknesses: ["Less sensored-accessory focus"],
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
    id: "p-abb-islimiter",
    competitorId: "abb",
    category: "fault-current-limiters",
    name: "Is-limiter",
    voltageClass: "≤40.5 kV",
    technology: ["Pyrotechnic", "Is-limiter"],
    applications: ["Bus coupling", "Fault level management"],
    datasheetUrl: "https://new.abb.com/medium-voltage/is-limiter",
    keyDifferentiators: ["Sub-millisecond fault current limiting", "Mature, widely deployed"],
    strengths: ["Very fast", "Protects existing switchgear"],
    weaknesses: ["Single-shot insert replacement after operation"],
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
    voltageClass: "≤40.5 kV",
    technology: ["Is-limiter", "Reactor-based"],
    applications: ["Fault level management", "Bus coupling"],
    datasheetUrl: "https://www.siemens.com/medium-voltage",
    keyDifferentiators: ["Part of broader MV protection portfolio"],
    strengths: ["Portfolio integration"],
    weaknesses: ["Application-specific engineering needed"],
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
    voltageClass: "n/a",
    technology: ["FLISR", "Distribution automation"],
    applications: ["Self-healing grid", "Outage restoration"],
    datasheetUrl: "https://www.sandc.com/en/products--services/products/intelliteam-sg-automatic-restoration-system/",
    keyDifferentiators: ["Distributed, peer-to-peer self-healing", "Tightly bound to S&C devices"],
    strengths: ["Proven FLISR", "Distributed intelligence"],
    weaknesses: ["Best within S&C device ecosystem"],
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
    voltageClass: "n/a",
    technology: ["ADMS", "DERMS", "Monitoring"],
    applications: ["Grid monitoring", "DER management", "Outage management"],
    datasheetUrl: "https://www.se.com/ww/en/product-range/61750-ecostruxure-adms/",
    keyDifferentiators: ["Full ADMS + DERMS suite", "Vendor-agnostic data integration"],
    strengths: ["Breadth", "DER tools"],
    weaknesses: ["Large platform; implementation effort"],
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
    voltageClass: "n/a",
    technology: ["Monitoring", "Digital substation", "Analytics"],
    applications: ["Asset monitoring", "Grid-edge analytics"],
    datasheetUrl: "https://new.abb.com/ability",
    keyDifferentiators: ["Connects ABB devices + sensors to analytics"],
    strengths: ["Device-to-cloud ecosystem"],
    weaknesses: ["Strongest inside ABB hardware base"],
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
