/* ============================================================================
 *  equipment.js  —  PER-PRODUCT COMPONENT OFFERINGS (+ optional photo)
 * ----------------------------------------------------------------------------
 *  Powers the Interactive equipment model on the 1:1 Comparison page. For each
 *  product (G&W and competitors) it records the SPECIFIC equipment that company
 *  offers for each component area — their actual named switching, sensing,
 *  automation, etc. — so a buyer can explore "what does ABB use for sensing on
 *  the SafeRing AirPlus?" and compare it directly with G&W.
 *
 *  STRUCTURE:
 *    DB.equipment["<productId>"] = {
 *      image:    "assets/equipment/<file>.jpg",   // OPTIONAL product photo
 *      imageAlt: "…",                              // OPTIONAL alt text
 *      components: {
 *        components | switching | environmental | sensing | automation |
 *        safety | install : { offering: "named equipment", detail: "specifics" }
 *      }
 *    }
 *
 *  • `productId` matches an id in data/products.js.
 *  • Component keys match the hotspot groups in data/explorers.js.
 *  • If `image` is set, the model shows the photo; otherwise it falls back to
 *    the 2D schematic. Drop product photos into assets/equipment/ and set the
 *    `image` path — nothing else changes.
 *  • Any product without an entry here still gets a basic component view derived
 *    automatically from its specs (see assets/explorer.js → deriveComponents).
 *
 *  ⚠  Offerings are illustrative competitive-intelligence summaries; verify
 *     against each vendor's published datasheets before relying on them.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.equipment = {
  /* ============================ SWITCHGEAR ============================== */
  "p-gw-trident": {
    image: "https://www.gwelectric.com/wp-content/uploads/2019/10/gw-electric-trident-st-padmount.jpg", imageAlt: "G&W Trident solid-dielectric switchgear",
    components: {
      components:    { offering: "Sealed submersible enclosure", detail: "Compact, dead-front cabinet rated to NEMA 6P — installs underground, in vaults, or pad-mount." },
      switching:     { offering: "Vacuum interrupters", detail: "Vacuum make/break in a solid-dielectric assembly, up to 38 kV and 25 kA short-circuit." },
      environmental: { offering: "Solid-dielectric (SF6-free)", detail: "Epoxy-encapsulated live parts — zero fluorinated gas, no pressure to monitor or refill." },
      sensing:       { offering: "AccuSense integrated V/I sensors", detail: "Factory-fitted combined voltage + current sensing, IEC 61850-9-2 sampled-values ready." },
      automation:    { offering: "Open DNP3 / IEC 61850 control", detail: "Vendor-neutral SCADA / FLISR integration; sensor-ready, no software lock-in." },
      safety:        { offering: "Dead-front, visible break, grounding", detail: "Touch-safe interfaces, viewing window, integral grounding and submersible rating." },
      install:       { offering: "IEEE 386 separable connectors", detail: "200 / 600 A loadbreak elbows matched to the unit's own bushings for fast, safe cable work." }
    }
  },
  "p-abb-safering": {
    image: "", imageAlt: "ABB SafeRing AirPlus switchgear",
    components: {
      components:    { offering: "Indoor secondary GIS (RMU)", detail: "Compact, extensible SafeRing / SafePlus ring-main-unit enclosure for indoor rooms." },
      switching:     { offering: "Vacuum interrupters", detail: "Vacuum switch / circuit-breaker functions, up to 24 kV and 21 kA." },
      environmental: { offering: "AirPlus dry-air (SF6-free)", detail: "ABB's eco-efficient AirPlus insulation — SF6-free with very low global-warming potential." },
      sensing:       { offering: "KEVA & VLS sensors", detail: "ABB KEVA voltage sensors and VLS combined V/I sensors, IEC 61850-9-2 low-power output." },
      automation:    { offering: "Relion relays + ABB Ability", detail: "Relion protection (REF/RED series) with ABB Ability edge / cloud monitoring and analytics." },
      safety:        { offering: "IAC AFLR, dead-front", detail: "Internal-arc-classified secondary GIS with touch-safe, dead-front interfaces." },
      install:       { offering: "Indoor cable-connected RMU", detail: "Compact indoor footprint; cable-connected and extensible for network growth." }
    }
  },
  "p-siemens-bluegis": {
    image: "", imageAlt: "Siemens NXPLUS C blue GIS switchgear",
    components: {
      components:    { offering: "Compact sealed GIS", detail: "Very small-footprint NXPLUS C / 8DJH gas-insulated cabinet." },
      switching:     { offering: "Vacuum interrupters", detail: "Vacuum switching, up to 24 kV and 25 kA." },
      environmental: { offering: "Clean Air (vacuum + dry air)", detail: "Natural-origin gases, GWP < 1, and free of fluorinated gases and PFAS." },
      sensing:       { offering: "SICAM / low-power sensors", detail: "Integrated low-power CT/VT sensors feeding SICAM and an IEC 61850 process bus." },
      automation:    { offering: "SIPROTEC / SICAM + Grid Software", detail: "SIPROTEC protection and SICAM automation with Siemens Grid Software / ADMS." },
      safety:        { offering: "IAC-classified GIS, dead-front", detail: "Internal-arc-classified, fully sealed compact GIS." },
      install:       { offering: "Compact indoor GIS", detail: "Smallest-footprint option for space-constrained urban substations." }
    }
  },
  "p-schneider-airset": {
    image: "", imageAlt: "Schneider RM AirSeT switchgear",
    components: {
      components:    { offering: "Compact RMU (RM / GM AirSeT)", detail: "Indoor ring-main-unit enclosure, 'digital by design'." },
      switching:     { offering: "Shunt Vacuum Interruption (SVI)", detail: "Pure-air insulation with shunt vacuum interruption, up to 24 kV and 21 kA." },
      environmental: { offering: "Pure Air (SF6-free)", detail: "Dry / pure-air insulation with no fluorinated gas." },
      sensing:       { offering: "Built-in LPVT / LPCT sensors", detail: "Embedded low-power voltage and current sensors — sensing comes standard ('digital by design')." },
      automation:    { offering: "EcoStruxure + Easergy / PowerLogic", detail: "Easergy protection relays with EcoStruxure ADMS, monitoring and DERMS." },
      safety:        { offering: "IAC AFLR, dead-front", detail: "Internal-arc-classified, touch-safe interfaces." },
      install:       { offering: "Compact indoor RMU", detail: "RM AirSeT (secondary) and GM AirSeT (primary) for indoor distribution." }
    }
  },
  "p-nuventura-nu1": {
    image: "", imageAlt: "Nuventura nu1 dry-air GIS switchgear",
    components: {
      components:    { offering: "Modular dry-air GIS", detail: "Sealed gas-insulated cabinet on a licensable platform." },
      switching:     { offering: "Vacuum interrupters", detail: "Vacuum switching in a dry-air GIS, up to 24 kV." },
      environmental: { offering: "Technical dry air (SF6-free)", detail: "Dry air at near-atmospheric pressure — SF6-free with a strong sustainability story." },
      sensing:       { offering: "Sensor-ready / low-power sensors", detail: "Prepared for low-power V/I sensing; relies on partner sensor/relay ecosystems." },
      automation:    { offering: "Open protocols, partner relays", detail: "IEC 61850 / DNP3-capable; integrates third-party protection and control." },
      safety:        { offering: "IAC-classified GIS", detail: "Internal-arc-classified, sealed dry-air GIS." },
      install:       { offering: "Compact indoor GIS", detail: "Modular indoor GIS; backed by Lucy Group for scale." }
    }
  },

  /* ============================ RECLOSERS ============================== */
  "p-gw-viper": {
    image: "https://www.gwelectric.com/wp-content/uploads/2025/05/Viper-ST_300.jpg", imageAlt: "G&W Viper-ST recloser",
    components: {
      components:    { offering: "Lightweight dead-tank body", detail: "Compact, light solid-dielectric recloser for simple pole or substation mounting." },
      switching:     { offering: "Solid-dielectric vacuum interrupters", detail: "Magnetic-actuator vacuum reclosing, up to 38 kV and 16 kA interrupting." },
      environmental: { offering: "Solid-dielectric (SF6-free)", detail: "Epoxy-encapsulated poles — no gas to leak, refill, or report." },
      sensing:       { offering: "Integrated CTs + AccuSense voltage", detail: "Built-in current sensing plus optional AccuSense voltage sensors for grid-edge visibility." },
      automation:    { offering: "Open DNP3 / IEC 61850 (Viper control)", detail: "Vendor-neutral, FLISR-ready control with open protocol integration." },
      safety:        { offering: "Insulated bushings, wildlife guards", detail: "Fully insulated dead-tank design reduces animal-caused faults." },
      install:       { offering: "Lightweight pole mount", detail: "Light, compact package for fast installation with standard line crews." }
    }
  },
  "p-sandc-intellirupter": {
    image: "https://www.sandc.com/globalassets/sac-electric/images/intellirupter-overhead.jpg", imageAlt: "S&C IntelliRupter PulseCloser",
    components: {
      components:    { offering: "Three-phase modular body", detail: "Modular fault-interrupter construction for pole or substation mounting." },
      switching:     { offering: "PulseClosing vacuum interruption", detail: "Patented PulseClosing tests the line at reduced energy (~95% less fault stress), up to 38 kV / 16 kA." },
      environmental: { offering: "Solid-dielectric (SF6-free)", detail: "Solid-dielectric construction — no gas." },
      sensing:       { offering: "Integrated current & voltage sensing", detail: "Built-in line sensing supporting protection, metering and automation." },
      automation:    { offering: "IntelliTeam SG + open control", detail: "IntelliTeam self-healing / FLISR software; SEL-651RD interoperable control option over fiber." },
      safety:        { offering: "Insulated, shielded terminals", detail: "Dead-front, insulated terminal design." },
      install:       { offering: "Pole or substation mount", detail: "Modular mounting; deep integration with S&C automation." }
    }
  },
  "p-sandc-tripsaver": {
    image: "", imageAlt: "S&C TripSaver II cutout-mounted recloser",
    components: {
      components:    { offering: "Cutout-mounted module", detail: "Self-contained single-phase device that drops into an existing cutout position." },
      switching:     { offering: "Single-phase vacuum interruption", detail: "Vacuum reclosing for lateral protection, up to 38 kV." },
      environmental: { offering: "Self-contained (SF6-free)", detail: "Compact self-contained module with no gas." },
      sensing:       { offering: "Integrated current sensing & TCC", detail: "Self-contained current sensing with selectable time-current curves." },
      automation:    { offering: "Standalone electronic control", detail: "Self-contained control with an optional wireless link; no separate cabinet." },
      safety:        { offering: "Visible drop-out, dead-front", detail: "Familiar cutout form factor with visible drop-out for isolation." },
      install:       { offering: "Drops into existing cutout", detail: "Replaces a fuse in the existing cutout — minimal new hardware." }
    }
  },
  "p-schneider-recloser": {
    image: "", imageAlt: "Schneider Easergy U-Series recloser",
    components: {
      components:    { offering: "Dead-tank recloser body", detail: "Compact solid-dielectric tank for pole or substation mounting." },
      switching:     { offering: "Solid-dielectric vacuum interrupters", detail: "Vacuum reclosing, up to 38 kV and 12.5 kA." },
      environmental: { offering: "Solid-dielectric (SF6-free)", detail: "Encapsulated poles — no gas." },
      sensing:       { offering: "Integrated CTs / voltage sensing", detail: "Built-in current and voltage sensing." },
      automation:    { offering: "ADVC control + EcoStruxure", detail: "Flexible ADVC controller with EcoStruxure / ADMS integration." },
      safety:        { offering: "Insulated bushings", detail: "Fully insulated dead-tank design." },
      install:       { offering: "Pole / substation mount", detail: "Compact pole-mount; fits the Schneider/EcoStruxure ecosystem." }
    }
  },
  "p-noja-osm": {
    image: "", imageAlt: "NOJA Power OSM recloser",
    components: {
      components:    { offering: "Lightweight dead-tank body", detail: "Compact, well-documented OSM recloser tank." },
      switching:     { offering: "Vacuum + magnetic actuator", detail: "Vacuum reclosing with magnetic actuator, up to 38 kV and 12.5 kA." },
      environmental: { offering: "Solid-dielectric (SF6-free)", detail: "Epoxy-insulated tank — no gas." },
      sensing:       { offering: "Integrated CTs + synchrophasor (RC-20)", detail: "Built-in current/voltage sensing; the RC-20 control adds distribution synchrophasor measurement." },
      automation:    { offering: "RC-10 / RC-20 control, open protocols", detail: "DNP3 / IEC 60870 / IEC 61850 with the CMS cyber-security module." },
      safety:        { offering: "Fully insulated dead-tank", detail: "Insulated bushings with wildlife protection." },
      install:       { offering: "Lightweight pole mount", detail: "Simple, well-documented installation deployed in 100+ countries." }
    }
  },
  "p-eaton-nova": {
    image: "", imageAlt: "Eaton NOVA (Cooper) recloser",
    components: {
      components:    { offering: "Dead-tank recloser body", detail: "Compact NOVA tank with a large Cooper installed base." },
      switching:     { offering: "Vacuum, solid-dielectric", detail: "Vacuum reclosing, up to 38 kV and 16 kA." },
      environmental: { offering: "Solid-dielectric (SF6-free)", detail: "Encapsulated poles — no gas." },
      sensing:       { offering: "Integrated CTs / voltage sensing", detail: "Built-in line sensing." },
      automation:    { offering: "Form 6 / Form 7 control", detail: "Familiar Cooper Form 6/7 controls with SCADA integration." },
      safety:        { offering: "Insulated bushings", detail: "Dead-tank insulated design." },
      install:       { offering: "Pole mount (Cooper-compatible)", detail: "Mounting familiar to crews with an existing Cooper fleet." }
    }
  }
};
