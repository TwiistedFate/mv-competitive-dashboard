/* ============================================================================
 *  explorers.js  —  INTERACTIVE EQUIPMENT MODELS (hotspot data)
 * ----------------------------------------------------------------------------
 *  Drives the "Interactive equipment model" on the 1:1 Comparison page. Each
 *  entry is keyed by a PRODUCT LINE id (matches data/categories.js) and lists
 *  the clickable hotspots on a clean 2D schematic of that equipment.
 *
 *  The schematic line-art is drawn in assets/explorer.js (one layout per
 *  `type`). Here you only describe the hotspots — so adding/clarifying callouts
 *  is a content edit, not a code change.
 *
 *  HOTSPOT FIELDS:
 *    id        — unique within the explorer.
 *    x, y      — position on the schematic's viewBox (see `type` in explorer.js).
 *    group     — components | switching | sensing | automation | safety |
 *                environmental | install  (drives the filter tabs).
 *    label     — short hotspot title.
 *    simple    — plain-language explanation for a non-expert buyer.
 *    technical — precise explanation for a utility / consulting engineer.
 *    benefit   — the customer outcome (value, not features).
 *    vs        — the competitive angle (how G&W compares on this point).
 *
 *  ⚠  Explanations are written for the G&W reference products and are
 *     illustrative; verify wording against published datasheets before use.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.explorers = {
  /* ====================== MEDIUM-VOLTAGE SWITCHGEAR ====================== */
  switchgear: {
    type: "switchgear",
    product: "Trident",
    title: "Inside the switchgear",
    intro: "Click any numbered point to see what the component does, why it matters technically, and how it compares.",
    hotspots: [
      {
        id: "enclosure", x: 78, y: 70, group: "components",
        label: "Sealed, submersible enclosure",
        simple: "The rugged outer cabinet that protects everything inside — even underground or in a flooded vault.",
        technical: "Stainless / coated enclosure with a sealed, dead-front design; submersible (NEMA 6P-class) and compact for tight vaults and pad-mount sites.",
        benefit: "Install almost anywhere — underground, coastal, or space-constrained — with confidence it will survive the environment.",
        vs: "Many air-insulated and gas designs need conditioned indoor rooms; a sealed submersible unit removes that site constraint."
      },
      {
        id: "interrupter", x: 140, y: 205, group: "switching",
        label: "Vacuum interrupter",
        simple: "The part that switches power on and off and snaps open in a fault to protect the circuit.",
        technical: "Vacuum interrupters provide the make/break duty (typ. ≤38 kV, 25 kA short-circuit) with long mechanical/electrical life and no arc by-products.",
        benefit: "Fast, reliable switching with very low maintenance over the equipment's life.",
        vs: "Vacuum is the modern standard; the differentiator is pairing it with solid-dielectric insulation rather than gas."
      },
      {
        id: "insulation", x: 420, y: 205, group: "environmental",
        label: "Solid-dielectric, SF6-free insulation",
        simple: "Instead of using SF6 gas, the live parts are encased in solid epoxy — nothing to leak or refill.",
        technical: "Solid-dielectric (epoxy-encapsulated) insulation system; zero fluorinated gas, no gas pressure to monitor, inherently aligned with EU F-gas / EPA SF6 rules.",
        benefit: "No greenhouse-gas handling, no leak/pressure management, and a future-proof compliance story.",
        vs: "Versus SF6 and 'alternative-gas' designs, solid dielectric has no gas system at all — simpler and lower lifetime risk."
      },
      {
        id: "sensors", x: 452, y: 150, group: "sensing",
        label: "Integrated voltage & current sensors",
        simple: "Built-in sensors that show what the circuit is doing — voltage, current, and power flow — in real time.",
        technical: "Factory-fitted low-power V/I sensors (IEC 61850-9-2 sampled-values ready) feeding protection, metering and grid-edge analytics without separate instrument transformers.",
        benefit: "Real grid visibility out of the box, supporting predictive maintenance and faster outage response.",
        vs: "Sensors are integrated and factory-tested rather than bolted on later, reducing integration risk and panel space."
      },
      {
        id: "control", x: 150, y: 85, group: "automation",
        label: "Control & automation module",
        simple: "The 'brain' that lets the equipment talk to the utility's control room and act automatically.",
        technical: "Open DNP3 / IEC 61850 control and communications supporting SCADA, FLISR/self-healing schemes and remote operation; vendor-neutral integration.",
        benefit: "Remote operation and automation that fit the systems you already run — no single-vendor lock-in.",
        vs: "Open protocols avoid being trapped in one OEM's software ecosystem, unlike tightly-bound proprietary stacks."
      },
      {
        id: "deadfront", x: 280, y: 134, group: "safety",
        label: "Dead-front design & viewing window",
        simple: "No exposed live metal on the front, plus a window to visually confirm the switch position.",
        technical: "Fully dead-front, touch-safe interfaces with a visible position indicator; reduces arc-flash exposure during operation and switching.",
        benefit: "Safer for crews to operate and inspect, lowering arc-flash risk and PPE burden.",
        vs: "A genuinely dead-front, visible-break design is safer than units that require opening to confirm state."
      },
      {
        id: "terminations", x: 140, y: 332, group: "install",
        label: "Separable cable connectors",
        simple: "Plug-in cable connections at the bottom that make installation and future work quick and clean.",
        technical: "IEEE 386 separable connectors / loadbreak elbows (200 A / 600 A) matched to the unit's bushings for submersible cable terminations.",
        benefit: "Faster, safer installation and easy future reconfiguration without disturbing the whole assembly.",
        vs: "Connectors engineered to match the gear's own bushings reduce field-fit issues versus mixed-vendor accessories."
      },
      {
        id: "ground", x: 280, y: 250, group: "safety",
        label: "Visible break & integral grounding",
        simple: "A clear open gap and built-in grounding so crews know the circuit is truly safe before working.",
        technical: "Visible isolating break and integral grounding/earthing position, providing verifiable isolation for safe work permits.",
        benefit: "Confidence and compliance during lockout/tagout — crews can see the circuit is open and grounded.",
        vs: "A visible, verifiable break beats relying solely on indicators in sealed gas tanks."
      }
    ]
  },

  /* ========================= RECLOSERS & AUTOMATION ====================== */
  reclosers: {
    type: "recloser",
    product: "Viper",
    title: "Inside the recloser",
    intro: "Click any numbered point to see what the component does, why it matters technically, and how it compares.",
    hotspots: [
      {
        id: "interrupter", x: 250, y: 168, group: "switching",
        label: "Vacuum interrupter pole",
        simple: "Switches the line and clears faults, then re-closes to restore power if the fault was temporary.",
        technical: "Solid-dielectric vacuum interrupter poles (typ. ≤38 kV, 16 kA interrupting) with magnetic-actuator operation for fast, repeatable reclosing.",
        benefit: "Clears temporary faults and restores service automatically, cutting customer outage minutes.",
        vs: "Solid-dielectric poles are SF6-free; the edge is integrated sensing rather than a bolt-on retrofit."
      },
      {
        id: "insulation", x: 330, y: 168, group: "environmental",
        label: "Solid-dielectric, SF6-free body",
        simple: "Insulated with solid material instead of SF6 gas — nothing to leak, refill, or report.",
        technical: "Solid-dielectric encapsulation; no fluorinated gas, no pressure monitoring, inherently compliant with SF6 phase-out rules.",
        benefit: "No gas handling and a clean compliance story for the life of the asset.",
        vs: "Removes the gas system entirely versus SF6 or alternative-gas reclosers."
      },
      {
        id: "sensors", x: 322, y: 112, group: "sensing",
        label: "Integrated current & voltage sensing",
        simple: "Built-in sensors that measure the line so the recloser can protect it and report what's happening.",
        technical: "Integrated CTs and low-power voltage sensors feeding the control for protection, metering and DER-aware grid-edge data.",
        benefit: "Protection plus grid-edge visibility in one device — fewer separate instruments to buy and wire.",
        vs: "Built-in V/I sensing supports DER hosting-capacity use cases without add-on hardware."
      },
      {
        id: "control", x: 86, y: 286, group: "automation",
        label: "Recloser control cabinet",
        simple: "The ground-level box where the protection settings live and where it connects to the control room.",
        technical: "Microprocessor control with DNP3 / IEC 61850, FLISR-ready logic and remote configuration; open integration with SCADA/ADMS.",
        benefit: "Flexible protection and automation that drop into the systems you already operate.",
        vs: "Open controls avoid lock-in to a single automation ecosystem."
      },
      {
        id: "guards", x: 205, y: 110, group: "safety",
        label: "Insulated bushings & wildlife guards",
        simple: "Covered terminals that keep animals and debris from causing faults and outages.",
        technical: "Fully insulated bushing interfaces with optional wildlife/contamination guarding to reduce nuisance faults.",
        benefit: "Fewer animal-caused outages and safer, more reliable operation.",
        vs: "Integrated guarding reduces a common rural-feeder outage cause out of the box."
      },
      {
        id: "mount", x: 96, y: 182, group: "install",
        label: "Compact, lightweight pole mount",
        simple: "Light and compact enough for a simple pole installation by a standard line crew.",
        technical: "Low-weight, compact form factor for pole or substation mounting; reduces structural and crane requirements.",
        benefit: "Lower installed cost and faster deployment with standard crews and equipment.",
        vs: "A lighter, integrated package can be quicker to deploy than heavier modular alternatives."
      }
    ]
  }
};
