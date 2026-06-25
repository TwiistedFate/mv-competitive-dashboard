/* ============================================================================
 *  equipment.js  —  PER-PRODUCT COMPONENT PORTFOLIOS (+ optional photo)
 * ----------------------------------------------------------------------------
 *  Powers the Interactive equipment model on the 1:1 Comparison page. For each
 *  product (G&W and competitors) and each component area it lists ALL the
 *  equipment that company offers for that area on this class of product — e.g.
 *  press "Sensing" on the ABB SafeRing AirPlus and you see ABB's full voltage /
 *  current sensor range (KEVA, KECA, KEVCD, VLS). The point is to see, at a
 *  glance, everything a competitor brings to their switchgear / recloser.
 *
 *  STRUCTURE:
 *    DB.equipment["<productId>"] = {
 *      image:    "assets/equipment/<file>.jpg",   // OPTIONAL product photo (URL or path)
 *      imageAlt: "…",
 *      components: {
 *        components | switching | environmental | sensing | automation |
 *        safety | install : {
 *          items: [ { name: "Named product / tech", detail: "what it is" }, … ]
 *        }
 *      }
 *    }
 *
 *  • `productId` matches data/products.js; component keys match data/explorers.js.
 *  • If `image` is set the model shows the photo, else a 2D schematic.
 *  • Products with no entry here get a basic list derived from their specs.
 *
 *  ⚠  Portfolios are illustrative competitive-intelligence summaries of each
 *     vendor's range; verify against published datasheets before relying on them.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.equipment = {
  /* ============================ SWITCHGEAR ============================== */
  "p-gw-trident": {
    image: "https://www.gwelectric.com/wp-content/uploads/2019/10/gw-electric-trident-st-padmount.jpg",
    imageAlt: "G&W Trident solid-dielectric switchgear",
    components: {
      components:    { items: [
        { name: "Trident-S", detail: "Load-break switching ways." },
        { name: "Trident-SR", detail: "Resettable electronic fault-interrupting ways." },
        { name: "Trident-SP", detail: "Vacuum-fault-interrupter (VFI) ways." } ] },
      switching:     { items: [
        { name: "Vacuum fault interrupters (VFI)", detail: "Three-phase or single-phase vacuum interruption, up to 38 kV / 25 kA." },
        { name: "Load-break switches", detail: "SF6-free load-break switching ways." },
        { name: "Resettable fault interrupters", detail: "Electronically controlled, resettable overcurrent protection." } ] },
      environmental: { items: [
        { name: "Solid-dielectric insulation", detail: "Epoxy-encapsulated live parts — no gas of any kind." },
        { name: "SF6-free by design", detail: "Zero fluorinated gas; nothing to monitor, refill or report." } ] },
      sensing:       { items: [
        { name: "AccuSense combined V/I sensors", detail: "Integrated voltage + current sensing, IEC 61850-9-2 ready." },
        { name: "AccuSense VS-27 voltage sensor", detail: "Factory-fitted, fully integrated voltage sensing." },
        { name: "Integrated current sensors", detail: "Built-in CTs for protection and metering." } ] },
      automation:    { items: [
        { name: "Open DNP3 / IEC 61850", detail: "Vendor-neutral SCADA and FLISR integration." },
        { name: "Sensor-ready interfaces", detail: "Plug-in for AccuSense and third-party controls." } ] },
      safety:        { items: [
        { name: "Dead-front interfaces", detail: "No exposed live metal on the operating front." },
        { name: "Visible-break viewing window", detail: "Confirm switch position by eye." },
        { name: "Integral grounding", detail: "Built-in earthing for safe work." },
        { name: "Submersible (NEMA 6P)", detail: "Survives flooded vaults." } ] },
      install:       { items: [
        { name: "IEEE 386 separable connectors", detail: "200 / 600 A loadbreak elbows matched to G&W bushings." },
        { name: "Padmount & submersible options", detail: "Underground, vault, or pad-mount installation." } ] }
    }
  },
  "p-abb-safering": {
    image: "", imageAlt: "ABB SafeRing AirPlus switchgear",
    components: {
      components:    { items: [
        { name: "SafeRing (RMU)", detail: "Non-extensible ring-main unit." },
        { name: "SafePlus", detail: "Extensible, modular switchgear." } ] },
      switching:     { items: [
        { name: "Vacuum circuit breakers", detail: "Vacuum interruption for protection ways." },
        { name: "SF6-free load-break switches", detail: "AirPlus switch-disconnectors." },
        { name: "Vacuum contactors", detail: "For motor / frequent-switching duty." } ] },
      environmental: { items: [
        { name: "AirPlus insulation", detail: "Fluoroketone + dry-air mixture, ~99.99% lower GWP than SF6." },
        { name: "SF6-free portfolio", detail: "Eco-efficient alternative to SF6 GIS." } ] },
      sensing:       { items: [
        { name: "KEVA voltage sensors", detail: "Low-power resistive voltage sensing." },
        { name: "KECA current sensors", detail: "Rogowski-coil low-power current sensing." },
        { name: "KEVCD combined sensors", detail: "Combined voltage + current in one unit." },
        { name: "VLS sensors", detail: "Live-tank low-power sensor range." } ] },
      automation:    { items: [
        { name: "Relion protection relays", detail: "REF615 / REF620 feeder protection, IEC 61850." },
        { name: "ABB Ability", detail: "Edge / cloud monitoring and analytics." } ] },
      safety:        { items: [
        { name: "IAC AFLR classification", detail: "Internal-arc-classified secondary GIS." },
        { name: "Dead-front, capacitive VPIS", detail: "Touch-safe with voltage indication." } ] },
      install:       { items: [
        { name: "Cable-connected RMU", detail: "Compact indoor footprint." },
        { name: "Extensible bays", detail: "Add ways as the network grows." } ] }
    }
  },
  "p-siemens-bluegis": {
    image: "", imageAlt: "Siemens NXPLUS C blue GIS switchgear",
    components: {
      components:    { items: [
        { name: "NXPLUS C blue GIS", detail: "Compact primary distribution GIS." },
        { name: "8DJH blue", detail: "Secondary distribution GIS." } ] },
      switching:     { items: [
        { name: "Vacuum circuit breakers", detail: "3AH-series vacuum interruption." },
        { name: "Vacuum switch-disconnectors", detail: "Load-break and isolation." } ] },
      environmental: { items: [
        { name: "Clean Air insulation", detail: "Vacuum + dry air — no fluorinated gas, no PFAS, GWP < 1." } ] },
      sensing:       { items: [
        { name: "Low-power instrument transformers (LPIT)", detail: "Integrated low-power CT/VT." },
        { name: "SICAM sensors", detail: "Feed SICAM automation and IEC 61850 process bus." } ] },
      automation:    { items: [
        { name: "SIPROTEC protection", detail: "Numerical protection relays." },
        { name: "SICAM automation", detail: "RTUs / gateways for distribution automation." },
        { name: "Siemens Grid Software", detail: "ADMS / monitoring integration." } ] },
      safety:        { items: [
        { name: "IAC-classified GIS", detail: "Internal-arc-classified sealed GIS." },
        { name: "Capacitive voltage detection", detail: "Dead-front voltage indication." } ] },
      install:       { items: [
        { name: "Compact GIS footprint", detail: "Smallest footprint for tight urban rooms." } ] }
    }
  },
  "p-schneider-airset": {
    image: "", imageAlt: "Schneider RM AirSeT switchgear",
    components: {
      components:    { items: [
        { name: "RM AirSeT", detail: "Secondary distribution RMU." },
        { name: "GM AirSeT", detail: "Primary distribution switchgear." } ] },
      switching:     { items: [
        { name: "Shunt Vacuum Interruption (SVI)", detail: "Pure-air with vacuum interruption circuit breakers." },
        { name: "Load-break switches", detail: "Pure-air switch-disconnectors." } ] },
      environmental: { items: [
        { name: "Pure Air insulation", detail: "Dry / pure air — SF6-free, no fluorinated gas." } ] },
      sensing:       { items: [
        { name: "LPVT low-power voltage transformers", detail: "Built-in digital voltage sensing." },
        { name: "LPCT low-power current transformers", detail: "Built-in digital current sensing." },
        { name: "VPIS / voltage indication", detail: "Voltage-presence indication system." } ] },
      automation:    { items: [
        { name: "Easergy P3 / P5 relays", detail: "Feeder protection, IEC 61850." },
        { name: "EcoStruxure", detail: "ADMS, monitoring and DERMS software." },
        { name: "PowerLogic metering", detail: "Power-quality and energy metering." } ] },
      safety:        { items: [
        { name: "IAC AFLR classification", detail: "Internal-arc-classified, dead-front." },
        { name: "Digital voltage presence", detail: "Built-in voltage-presence check." } ] },
      install:       { items: [
        { name: "Compact digital-ready RMU", detail: "Indoor, sensors built in ('digital by design')." } ] }
    }
  },
  "p-nuventura-nu1": {
    image: "", imageAlt: "Nuventura nu1 dry-air GIS switchgear",
    components: {
      components:    { items: [
        { name: "nu1 dry-air GIS", detail: "Modular, licensable SF6-free GIS up to 36 kV." } ] },
      switching:     { items: [
        { name: "Vacuum circuit breakers", detail: "Vacuum interruption in a dry-air GIS." },
        { name: "Vacuum switch-disconnectors", detail: "Load-break and isolation." } ] },
      environmental: { items: [
        { name: "Technical dry air", detail: "Near-atmospheric dry air — SF6-free with a strong sustainability story." } ] },
      sensing:       { items: [
        { name: "Low-power sensor-ready", detail: "Provisions for low-power V/I sensing." },
        { name: "Partner sensors", detail: "Relies on partner sensor / relay ecosystems." } ] },
      automation:    { items: [
        { name: "Open protocol (IEC 61850 / DNP3)", detail: "Integrates third-party protection and control." } ] },
      safety:        { items: [
        { name: "IAC-classified GIS", detail: "Internal-arc-classified dry-air GIS." } ] },
      install:       { items: [
        { name: "Compact indoor GIS", detail: "Modular; backed by Lucy Group for scale." } ] }
    }
  },

  /* ============================ RECLOSERS ============================== */
  "p-gw-viper": {
    image: "https://www.gwelectric.com/wp-content/uploads/2025/05/Viper-ST_300.jpg",
    imageAlt: "G&W Viper-ST recloser",
    components: {
      components:    { items: [
        { name: "Viper-ST", detail: "Three-phase / triple-single recloser." },
        { name: "Viper-LT", detail: "Compact lightweight recloser." } ] },
      switching:     { items: [
        { name: "Solid-dielectric vacuum interrupters", detail: "Magnetic-actuator vacuum reclosing, up to 38 kV / 16 kA." },
        { name: "Triple-single operation", detail: "Independent single-phase tripping where required." } ] },
      environmental: { items: [
        { name: "Solid-dielectric insulation", detail: "Epoxy-encapsulated poles — no gas." },
        { name: "SF6-free", detail: "Nothing to leak, refill, or report." } ] },
      sensing:       { items: [
        { name: "Integrated current sensors (CTs)", detail: "Built-in three-phase current sensing." },
        { name: "AccuSense voltage sensors", detail: "Up to six external voltage sensors for full V/I visibility." },
        { name: "External CT inputs", detail: "Support for additional current sensing." } ] },
      automation:    { items: [
        { name: "Viper control", detail: "Recloser control with protection and logic." },
        { name: "Open DNP3 / IEC 61850", detail: "Vendor-neutral, FLISR-ready integration." } ] },
      safety:        { items: [
        { name: "Fully insulated dead-tank", detail: "No exposed live parts." },
        { name: "Wildlife guards", detail: "Reduce animal-caused faults." } ] },
      install:       { items: [
        { name: "Lightweight pole mount", detail: "Fast install with standard crews." },
        { name: "Substation mount", detail: "Frame-mount option." } ] }
    }
  },
  "p-sandc-intellirupter": {
    image: "https://www.sandc.com/globalassets/sac-electric/images/intellirupter-overhead.jpg",
    imageAlt: "S&C IntelliRupter PulseCloser",
    components: {
      components:    { items: [
        { name: "IntelliRupter PulseCloser", detail: "Three-phase fault interrupter." } ] },
      switching:     { items: [
        { name: "PulseClosing vacuum interruption", detail: "Tests the line at ~95% less fault energy before closing." },
        { name: "Point-on-wave closing", detail: "Precise closing to reduce stress." } ] },
      environmental: { items: [
        { name: "Solid-dielectric construction", detail: "SF6-free — no gas." } ] },
      sensing:       { items: [
        { name: "Integrated 3-phase voltage sensing", detail: "Voltage sensing on both sides of the interrupters." },
        { name: "Integrated 3-phase current sensing", detail: "Built-in current measurement." },
        { name: "Integrated power module", detail: "On one or both sides for measurement and supply." } ] },
      automation:    { items: [
        { name: "IntelliTeam SG", detail: "Distributed self-healing / FLISR restoration." },
        { name: "IntelliLink setup", detail: "Configuration and commissioning software." },
        { name: "SEL-651RD control option", detail: "Interoperable third-party control over fiber." } ] },
      safety:        { items: [
        { name: "Insulated, shielded terminals", detail: "Dead-front terminal design." } ] },
      install:       { items: [
        { name: "Pole or substation mount", detail: "Modular mounting options." } ] }
    }
  },
  "p-sandc-tripsaver": {
    image: "", imageAlt: "S&C TripSaver II cutout-mounted recloser",
    components: {
      components:    { items: [
        { name: "TripSaver II", detail: "Single-phase cutout-mounted recloser." } ] },
      switching:     { items: [
        { name: "Single-phase vacuum interruption", detail: "Lateral protection in a cutout form factor." } ] },
      environmental: { items: [
        { name: "Self-contained, SF6-free", detail: "Compact module, no gas." } ] },
      sensing:       { items: [
        { name: "Integrated current sensing", detail: "Self-contained current measurement." },
        { name: "Selectable TCC curves", detail: "Programmable time-current characteristics." } ] },
      automation:    { items: [
        { name: "Standalone electronic control", detail: "Self-contained; no separate cabinet." },
        { name: "Optional wireless link", detail: "For status / event reporting." } ] },
      safety:        { items: [
        { name: "Visible drop-out", detail: "Familiar cutout isolation behaviour." } ] },
      install:       { items: [
        { name: "Drops into existing cutout", detail: "Replaces a fuse with minimal new hardware." } ] }
    }
  },
  "p-schneider-recloser": {
    image: "", imageAlt: "Schneider Easergy U-Series recloser",
    components: {
      components:    { items: [
        { name: "Easergy U-Series", detail: "Three-phase recloser." },
        { name: "ADVC controller", detail: "Recloser control cubicle." } ] },
      switching:     { items: [
        { name: "Solid-dielectric vacuum interrupters", detail: "Vacuum reclosing up to 38 kV / 12.5 kA." } ] },
      environmental: { items: [
        { name: "Solid-dielectric, SF6-free", detail: "Encapsulated poles — no gas." } ] },
      sensing:       { items: [
        { name: "Integrated current transformers", detail: "Built-in current sensing." },
        { name: "Integrated voltage sensors", detail: "Three-phase voltage measurement." } ] },
      automation:    { items: [
        { name: "ADVC control", detail: "Flexible recloser controller." },
        { name: "EcoStruxure / ADMS", detail: "Grid-software and FLISR integration." } ] },
      safety:        { items: [
        { name: "Insulated dead-tank", detail: "Fully insulated body." } ] },
      install:       { items: [
        { name: "Pole / substation mount", detail: "Compact pole-mount." } ] }
    }
  },
  "p-noja-osm": {
    image: "", imageAlt: "NOJA Power OSM recloser",
    components: {
      components:    { items: [
        { name: "OSM15 / OSM27 / OSM38", detail: "Recloser range by voltage class." },
        { name: "RC-10 / RC-20 control", detail: "Recloser controllers." } ] },
      switching:     { items: [
        { name: "Vacuum interrupters", detail: "Magnetic-actuator vacuum reclosing up to 38 kV / 12.5 kA." } ] },
      environmental: { items: [
        { name: "Solid-dielectric (epoxy/silicone)", detail: "SF6-free encapsulated tank." } ] },
      sensing:       { items: [
        { name: "Integrated current transformers", detail: "Built-in three-phase current sensing." },
        { name: "Capacitive voltage sensors", detail: "Six integrated voltage sensors (both sides)." },
        { name: "RC-20 synchrophasor measurement", detail: "Distribution-grade synchrophasors." } ] },
      automation:    { items: [
        { name: "RC-10 / RC-20 control", detail: "DNP3 / IEC 60870 / IEC 61850." },
        { name: "CMS cyber-security module", detail: "Secure connectivity gateway." } ] },
      safety:        { items: [
        { name: "Fully insulated tank", detail: "Insulated bushings with wildlife protection." } ] },
      install:       { items: [
        { name: "Lightweight pole mount", detail: "Simple, well-documented installation." } ] }
    }
  },
  "p-eaton-nova": {
    image: "", imageAlt: "Eaton NOVA (Cooper) recloser",
    components: {
      components:    { items: [
        { name: "NOVA recloser", detail: "Three-phase vacuum recloser." },
        { name: "NOVA STS", detail: "Single-tank single-phase variant." },
        { name: "Form 6 / Form 7 control", detail: "Recloser controls." } ] },
      switching:     { items: [
        { name: "Vacuum interrupters", detail: "Solid-dielectric vacuum reclosing up to 38 kV / 16 kA." } ] },
      environmental: { items: [
        { name: "Solid-dielectric (cycloaliphatic epoxy)", detail: "SF6-free encapsulated poles." } ] },
      sensing:       { items: [
        { name: "Integrated current transformers", detail: "Built-in current sensing." },
        { name: "Integrated voltage sensing", detail: "Metering-accuracy voltage measurement." } ] },
      automation:    { items: [
        { name: "Form 6 / Form 7 control", detail: "Familiar Cooper controls." },
        { name: "ProView software", detail: "Setup and analysis; SCADA integration." } ] },
      safety:        { items: [
        { name: "Dead-tank insulated design", detail: "Insulated bushings; wildlife guards." } ] },
      install:       { items: [
        { name: "Pole mount (Cooper-compatible)", detail: "Familiar to crews with an existing Cooper fleet." } ] }
    }
  }
};
