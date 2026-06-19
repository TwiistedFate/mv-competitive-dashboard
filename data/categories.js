/* ============================================================================
 *  categories.js  —  PRODUCT CATEGORIES
 * ----------------------------------------------------------------------------
 *  Each object below defines one product line shown on the homepage and given
 *  its own category page.
 *
 *  HOW TO ADD A NEW CATEGORY:
 *    1. Copy one of the blocks below.
 *    2. Give it a unique `id` (lowercase, no spaces) — this id is what you
 *       reference from products.js, news.js, and competitors.js.
 *    3. Edit the `specColumns` array to control which columns appear in that
 *       category's specification-comparison table. The `key` of each column
 *       must match a key inside a product's `specs` object (see products.js).
 *
 *  Counts (competitors tracked, news count, top competitors) are calculated
 *  automatically from the other data files — you do NOT maintain them here.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.categories = [
  {
    id: "switchgear",
    name: "Medium-Voltage Switchgear",
    short: "Switchgear",
    icon: "switchgear",                       // icon key (see assets/lib.js ICONS)
    accent: "#2563eb",
    blurb: "Primary & secondary distribution switchgear, ring main units (RMUs), and the industry-wide shift to SF6-free / eco-efficient designs.",
    keyTrends: [
      "Accelerating regulatory pressure to eliminate SF6 (EU F-Gas, US EPA)",
      "Solid-dielectric and vacuum + dry-air becoming mainstream",
      "Digital / sensor-ready switchgear with built-in monitoring"
    ],
    // Columns rendered in this category's spec-comparison table.
    specColumns: [
      { key: "voltageRating",  label: "Voltage Rating" },
      { key: "currentRating",  label: "Main Bus Current" },
      { key: "shortCircuit",   label: "Short-Circuit Rating" },
      { key: "insulationType", label: "Insulation / Dielectric" },
      { key: "communication",  label: "Communication" },
      { key: "environmental",  label: "Environmental Rating" }
    ]
  },
  {
    id: "reclosers",
    name: "Reclosers & Automation",
    short: "Reclosers",
    icon: "recloser",
    accent: "#0891b2",
    blurb: "Pole-mounted and substation reclosers, pulse-closing technology, protection relays, and the controllers that drive distribution automation.",
    keyTrends: [
      "Pulse-closing to reduce stress on the network during reclosing",
      "Single-phase tripping & FLISR-ready controllers",
      "Reclosers as grid-edge data nodes (DER hosting capacity)"
    ],
    specColumns: [
      { key: "voltageRating",     label: "Voltage Rating" },
      { key: "currentRating",     label: "Continuous Current" },
      { key: "interruptingRating",label: "Interrupting Rating" },
      { key: "controlPlatform",   label: "Control Platform" },
      { key: "communication",     label: "Communication" },
      { key: "environmental",     label: "Environmental Rating" }
    ]
  },
  {
    id: "sensors",
    name: "Voltage & Current Sensors",
    short: "Sensors",
    icon: "sensor",
    accent: "#7c3aed",
    blurb: "Voltage sensors, current sensors, and combined V/I sensors for metering, protection, and grid-edge visibility — the data backbone of the modern grid.",
    keyTrends: [
      "Combined V/I sensors replacing traditional instrument transformers",
      "Higher accuracy classes (0.5 / 0.2) for revenue-grade metering",
      "Retrofittable elbow & bushing sensors for existing assets"
    ],
    specColumns: [
      { key: "sensorType",     label: "Sensor Type" },
      { key: "voltageRating",  label: "Voltage Rating" },
      { key: "accuracyClass",  label: "Accuracy Class" },
      { key: "output",         label: "Output / Interface" },
      { key: "communication",  label: "Communication" },
      { key: "environmental",  label: "Environmental Rating" }
    ]
  },
  {
    id: "cable-accessories",
    name: "Cable Accessories",
    short: "Cable Accessories",
    icon: "cable",
    accent: "#0d9488",
    blurb: "Terminations, separable connectors (elbows), splices, and joints for medium-voltage cable systems — including sensored accessories.",
    keyTrends: [
      "Sensored elbows & terminations adding metering to connection points",
      "Cold-shrink & push-on designs reducing installation time",
      "Higher voltage classes (up to 42 kV) for urban networks"
    ],
    specColumns: [
      { key: "accessoryType",  label: "Type" },
      { key: "voltageRating",  label: "Voltage Class" },
      { key: "conductorRange", label: "Conductor Range" },
      { key: "interface",      label: "Interface / Standard" },
      { key: "installation",   label: "Installation" },
      { key: "environmental",  label: "Environmental Rating" }
    ]
  },
  {
    id: "fault-current-limiters",
    name: "Fault Current Limiters",
    short: "FCLs",
    icon: "limiter",
    accent: "#dc2626",
    blurb: "Devices that limit prohibitive fault currents — is-limiters, superconducting (SFCL), and solid-state limiters that protect aging switchgear.",
    keyTrends: [
      "Rising fault levels from DER driving retrofit demand",
      "Superconducting FCLs maturing toward commercial deployment",
      "Solid-state limiters enabling faster, repeatable operation"
    ],
    specColumns: [
      { key: "voltageRating",   label: "Voltage Rating" },
      { key: "currentRating",   label: "Rated Current" },
      { key: "limitingType",    label: "Limiting Technology" },
      { key: "responseTime",    label: "Response Time" },
      { key: "letThrough",      label: "Let-Through Reduction" },
      { key: "environmental",   label: "Environmental Rating" }
    ]
  },
  {
    id: "software",
    name: "Grid Software & Automation",
    short: "Software",
    icon: "software",
    accent: "#ca8a04",
    blurb: "Grid monitoring platforms, ADMS, and distribution-automation software that turn sensor and device data into operational decisions.",
    keyTrends: [
      "Cloud + edge analytics for real-time situational awareness",
      "DERMS / hosting-capacity tools as DER penetration climbs",
      "Open protocols (IEC 61850, DNP3) and vendor-agnostic integration"
    ],
    specColumns: [
      { key: "deployment",   label: "Deployment" },
      { key: "modules",      label: "Key Modules" },
      { key: "protocols",    label: "Protocols" },
      { key: "integration",  label: "Integration" },
      { key: "analytics",    label: "Analytics / AI" }
    ]
  }
];
