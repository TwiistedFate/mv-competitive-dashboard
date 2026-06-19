/* ============================================================================
 *  competitors.js  —  COMPETITOR PROFILES
 * ----------------------------------------------------------------------------
 *  One object per company. The first entry (G&W Electric) is YOUR company and
 *  is flagged with `isUs: true` so the dashboard highlights it as the
 *  reference/benchmark everywhere.
 *
 *  HOW TO ADD A COMPETITOR:
 *    1. Copy a block below and give it a unique `id`.
 *    2. `categories` must contain ids from categories.js — this controls which
 *       category pages the company shows up on.
 *    3. `threatLevel` is "High" | "Medium" | "Low" and drives the threat badge.
 *    4. Fill in as much or as little as you know — empty arrays are fine and
 *       the UI will simply hide empty sections.
 *
 *  NOTE: The text below is illustrative sample content to show the structure.
 *  Review and replace with your own verified intelligence.
 * ========================================================================== */

window.DB = window.DB || {};

window.DB.competitors = [
  {
    id: "gw",
    name: "G&W Electric",
    isUs: true,                                   // <- this is your company
    logoText: "G&W",
    hq: "Bolingbrook, Illinois, USA",
    region: "North America",
    founded: 1905,
    threatLevel: "Low",
    website: "https://www.gwelectric.com",
    overview:
      "G&W Electric designs and manufactures medium-voltage power distribution equipment, including solid-dielectric switchgear (Trident), reclosers (Viper), sensors (AccuSense), and cable accessories. Privately held with a strong North American utility base and growing international presence.",
    productsOffered: [
      "Trident solid-dielectric switchgear",
      "Viper-ST / Viper-LT reclosers",
      "AccuSense voltage & current sensors",
      "Cable terminations, splices & separable connectors"
    ],
    strengths: [
      "Solid-dielectric expertise across switchgear and reclosers",
      "Integrated portfolio: switchgear + reclosers + sensors + accessories",
      "Responsive, application-engineering-led customer relationships"
    ],
    weaknesses: [
      "Smaller scale and brand reach than ABB / Siemens / Schneider",
      "Software / ADMS offering is thinner than the global majors",
      "Less marketing presence in European SF6-free conversations"
    ],
    partnerships: ["Regional utility automation pilots", "Distribution / rep network across the Americas"],
    newProducts: [
      { name: "AccuSense sensor line expansion", date: "2025-11-01", note: "Broader combined V/I sensing options." }
    ],
    strategicDirection:
      "Defend and grow the solid-dielectric franchise, expand sensored/digital products, and push further into international markets while keeping engineering-led service as the differentiator.",
    links: [
      { label: "Products", url: "https://www.gwelectric.com/products/" },
      { label: "Newsroom", url: "https://www.gwelectric.com/news/" }
    ]
  },
  {
    id: "sandc",
    name: "S&C Electric",
    logoText: "S&C",
    hq: "Chicago, Illinois, USA",
    region: "North America",
    founded: 1911,
    threatLevel: "High",
    website: "https://www.sandc.com",
    overview:
      "S&C Electric is a privately held leader in switching, protection, and grid automation. Best known for the IntelliRupter PulseCloser recloser and a deep distribution-automation / FLISR software stack, plus energy storage.",
    productsOffered: [
      "IntelliRupter PulseCloser fault interrupter",
      "TripSaver II cutout-mounted recloser",
      "Vista / Trinetics switchgear",
      "IntelliTeam SG automatic restoration software"
    ],
    strengths: [
      "Pulse-closing technology is a genuine differentiator vs. Viper",
      "Strong FLISR / self-healing grid software (IntelliTeam)",
      "Trusted brand with deep US utility relationships"
    ],
    weaknesses: [
      "Premium pricing",
      "Narrower sensor portfolio than the sensor specialists",
      "Less global footprint than ABB / Siemens"
    ],
    partnerships: ["Numerous US IOU self-healing grid deployments"],
    newProducts: [
      { name: "IntelliRupter platform updates", date: "2026-02-10", note: "Controller and communications enhancements." }
    ],
    strategicDirection:
      "Lead distribution automation and grid resiliency by bundling devices + software, and expand energy-storage and grid-services offerings.",
    links: [
      { label: "Newsroom", url: "https://www.sandc.com/en/company/newsroom/" }
    ]
  },
  {
    id: "abb",
    name: "ABB",
    logoText: "ABB",
    hq: "Zurich, Switzerland",
    region: "Europe",
    founded: 1988,
    threatLevel: "High",
    website: "https://global.abb",
    overview:
      "ABB Electrification is a global leader in MV switchgear, sensors, and digital grid products. Aggressively pushing SF6-free / eco-efficient switchgear (AirPlus) and a broad KEVA/VLS sensor range.",
    productsOffered: [
      "UniGear / SafeRing / SafePlus switchgear",
      "AirPlus eco-efficient (SF6-free) switchgear",
      "KEVA voltage & VLS combined sensors",
      "Relion protection relays & Ability digital platform"
    ],
    strengths: [
      "Full-line global scale across switchgear, sensors, protection, software",
      "Early, broad SF6-free portfolio (AirPlus)",
      "Heavy R&D and digital (Ability) ecosystem"
    ],
    weaknesses: [
      "Large-organization responsiveness can lag niche players",
      "Complex portfolio can be hard for smaller utilities to navigate"
    ],
    partnerships: ["Global utility framework agreements", "Microgrid & DER integrators"],
    newProducts: [
      { name: "AirPlus SF6-free range extension", date: "2026-03-05", note: "More ratings in eco-efficient switchgear." }
    ],
    strategicDirection:
      "Decarbonize the grid portfolio (SF6-free everywhere) and lead on digital substations and grid-edge intelligence at global scale.",
    links: [
      { label: "News", url: "https://new.abb.com/news" }
    ]
  },
  {
    id: "siemens",
    name: "Siemens",
    logoText: "SIE",
    hq: "Munich, Germany",
    region: "Europe",
    founded: 1847,
    threatLevel: "High",
    website: "https://www.siemens.com",
    overview:
      "Siemens Smart Infrastructure offers a complete MV portfolio with a strong push on clean-air / vacuum SF6-free switchgear (blue GIS) and digital grid software through Siemens Grid Software.",
    productsOffered: [
      "8DJH / NXPLUS switchgear",
      "blue GIS clean-air SF6-free switchgear",
      "SICAM grid automation & sensors",
      "Siemens Grid Software (ADMS / monitoring)"
    ],
    strengths: [
      "Clean-air (vacuum + dry air) SF6-free leadership",
      "End-to-end digital grid software portfolio",
      "Global scale and engineering depth"
    ],
    weaknesses: [
      "Premium positioning",
      "Long lead times typical of large OEMs"
    ],
    partnerships: ["European TSO/DSO grid digitalization programs"],
    newProducts: [
      { name: "blue GIS portfolio expansion", date: "2026-01-20", note: "Additional SF6-free ratings & form factors." }
    ],
    strategicDirection:
      "Drive SF6-free 'blue' portfolio adoption and grow recurring software/grid-services revenue.",
    links: [
      { label: "Press", url: "https://press.siemens.com/global/en/pressreleases" }
    ]
  },
  {
    id: "schneider",
    name: "Schneider Electric",
    logoText: "SE",
    hq: "Rueil-Malmaison, France",
    region: "Europe",
    founded: 1836,
    threatLevel: "High",
    website: "https://www.se.com",
    overview:
      "Schneider Electric is a global electrification and automation leader. Its AirSeT range pioneered pure-air + vacuum SF6-free switchgear with digital connectivity, backed by EcoStruxure software.",
    productsOffered: [
      "RM AirSeT / GM AirSeT SF6-free switchgear",
      "PIX / SM6 switchgear",
      "Easergy sensors & protection relays",
      "EcoStruxure ADMS / grid monitoring"
    ],
    strengths: [
      "AirSeT SF6-free + 'digital by design' positioning",
      "EcoStruxure software ecosystem",
      "Strong sustainability brand and global reach"
    ],
    weaknesses: [
      "Broad portfolio complexity",
      "Software lock-in concerns for some utilities"
    ],
    partnerships: ["EcoStruxure technology partner ecosystem"],
    newProducts: [
      { name: "AirSeT range extension", date: "2026-04-02", note: "Wider SF6-free MV ratings with digital sensors." }
    ],
    strategicDirection:
      "Combine SF6-free hardware with EcoStruxure software to sell complete digital, sustainable MV systems.",
    links: [
      { label: "Newsroom", url: "https://www.se.com/ww/en/about-us/newsroom/news/" }
    ]
  },
  {
    id: "eaton",
    name: "Eaton",
    logoText: "EAT",
    hq: "Dublin, Ireland",
    region: "North America",
    founded: 1911,
    threatLevel: "Medium",
    website: "https://www.eaton.com",
    overview:
      "Eaton's electrical business carries the Cooper Power Systems heritage in MV reclosers, transformers, and switchgear, with a growing SF6-free push (Xiria) and grid-automation controls.",
    productsOffered: [
      "Cooper Power reclosers (NOVA / Form 6 control)",
      "Xiria SF6-free switchgear",
      "MV sensors & metering",
      "Yukon / grid automation software"
    ],
    strengths: [
      "Strong Cooper recloser installed base in North America",
      "Broad electrical portfolio and distribution channel",
      "Established SF6-free RMU (Xiria)"
    ],
    weaknesses: [
      "Sensor & software offerings less prominent than majors",
      "Brand attention split across very broad portfolio"
    ],
    partnerships: ["Utility & C&I distribution channel"],
    newProducts: [
      { name: "Xiria SF6-free updates", date: "2025-12-08", note: "Expanded SF6-free secondary switchgear." }
    ],
    strategicDirection:
      "Leverage Cooper recloser base, grow SF6-free switchgear, and expand electrification/grid-resilience solutions.",
    links: [
      { label: "News", url: "https://www.eaton.com/us/en-us/company/news-insights/news-releases.html" }
    ]
  },
  {
    id: "noja",
    name: "NOJA Power",
    logoText: "NOJ",
    hq: "Brisbane, Australia",
    region: "Asia-Pacific",
    founded: 2003,
    threatLevel: "Medium",
    website: "https://www.nojapower.com",
    overview:
      "NOJA Power is a focused recloser specialist. Its OSM recloser + RC controller are deployed in 100+ countries, with a reputation for a tight, well-documented, single-product focus.",
    productsOffered: [
      "OSM pole-mounted recloser",
      "RC-10 / RC controller",
      "CMS-10 connectivity & cyber security module"
    ],
    strengths: [
      "Deep recloser specialization and global distribution",
      "Strong technical documentation & application support",
      "Competitive pricing vs. global majors"
    ],
    weaknesses: [
      "Single-category focus (reclosers) — no switchgear/sensor breadth",
      "Smaller R&D budget than the majors"
    ],
    partnerships: ["Global distributor network in 100+ countries"],
    newProducts: [
      { name: "OSM recloser enhancements", date: "2026-02-25", note: "Controller & communications updates." }
    ],
    strategicDirection:
      "Stay the recloser specialist of choice globally; expand connectivity, cyber security, and automation around the OSM.",
    links: [
      { label: "News", url: "https://www.nojapower.com/news" }
    ]
  },
  {
    id: "tavrida",
    name: "Tavrida Electric",
    logoText: "TAV",
    hq: "Switzerland / global",
    region: "Europe",
    founded: 1990,
    threatLevel: "Medium",
    website: "https://www.tavrida.com",
    overview:
      "Tavrida Electric specializes in compact vacuum switching technology and reclosers, known for lightweight magnetic-actuator designs and a strong international project presence.",
    productsOffered: [
      "Rec15 / Rec25 reclosers",
      "Vacuum circuit breakers & switching modules",
      "Automation controllers"
    ],
    strengths: [
      "Compact, lightweight vacuum/magnetic-actuator designs",
      "Vertically integrated vacuum interrupter manufacturing",
      "Aggressive international project pricing"
    ],
    weaknesses: [
      "Lower brand recognition in North America",
      "Narrower software/sensor portfolio"
    ],
    partnerships: ["International EPC & utility projects"],
    newProducts: [],
    strategicDirection:
      "Grow share with compact vacuum switching and reclosers, especially in emerging and price-sensitive markets.",
    links: [
      { label: "News", url: "https://www.tavrida.com/tena/media/news/" }
    ]
  },
  {
    id: "hubbell",
    name: "Hubbell Power Systems",
    logoText: "HUB",
    hq: "Shelton, Connecticut, USA",
    region: "North America",
    founded: 1888,
    threatLevel: "Medium",
    website: "https://www.hubbellpowersystems.com",
    overview:
      "Hubbell Power Systems supplies a wide range of utility distribution products including MV sensors, cable accessories, and connectors, with a strong North American utility distribution channel.",
    productsOffered: [
      "MV voltage & current sensors",
      "Cable accessories & connectors",
      "Distribution hardware & arresters"
    ],
    strengths: [
      "Extensive utility product breadth and channel",
      "Strong cable-accessory and connector franchise",
      "Recognized North American utility brand"
    ],
    weaknesses: [
      "Less focused MV switchgear/recloser story",
      "Software/automation not a core strength"
    ],
    partnerships: ["Utility distribution & stocking network"],
    newProducts: [],
    strategicDirection:
      "Leverage broad utility catalog and channel; grow sensored accessories and grid-hardening products.",
    links: [
      { label: "Site", url: "https://www.hubbellpowersystems.com" }
    ]
  },
  {
    id: "lindsey",
    name: "Lindsey Systems",
    logoText: "LIN",
    hq: "Azusa, California, USA",
    region: "North America",
    founded: 1947,
    threatLevel: "Low",
    website: "https://www.lindsey-usa.com",
    overview:
      "Lindsey specializes in transmission & distribution sensors and monitoring — notably the GEN2 line sensors and ElbowSense — focused on real-time line monitoring and dynamic line rating.",
    productsOffered: [
      "GEN2 overhead line sensors",
      "ElbowSense cable-accessory sensors",
      "Dynamic line rating & monitoring systems"
    ],
    strengths: [
      "Sensor & line-monitoring specialization",
      "Dynamic line rating expertise",
      "Retrofittable sensing for existing assets"
    ],
    weaknesses: [
      "Niche scope (no switchgear / reclosers)",
      "Smaller scale and brand footprint"
    ],
    partnerships: ["Utility line-monitoring & DLR programs"],
    newProducts: [],
    strategicDirection:
      "Expand grid-edge sensing and dynamic line rating as utilities push for more capacity from existing assets.",
    links: [
      { label: "Site", url: "https://www.lindsey-usa.com" }
    ]
  },
  {
    id: "nuventura",
    name: "Nuventura",
    logoText: "NUV",
    hq: "Berlin, Germany",
    region: "Europe",
    founded: 2017,
    threatLevel: "Medium",
    website: "https://nuventura.com",
    overview:
      "Nuventura is a Berlin-based pure-play building SF6-free (dry-air) GIS switchgear up to 36 kV. In April 2026 it was acquired by the Lucy Group, gaining the scale, capital, and global channel to move from niche technology licensor to volume competitor.",
    productsOffered: [
      "nu1 SF6-free (dry-air) GIS switchgear",
      "Licensable SF6-free switchgear technology"
    ],
    strengths: [
      "Pure-play SF6-free focus and modern design",
      "Licensing model can scale faster than building factories",
      "Strong sustainability narrative attractive to DSOs"
    ],
    weaknesses: [
      "Young company, limited installed base/track record",
      "Narrow portfolio; depends on partners for scale"
    ],
    partnerships: ["Lucy Group (acquirer, 2026)", "CO7 Technologies (Canada/US market entry)", "Aktif Elektroteknik (manufacturing, Turkey)"],
    newProducts: [
      { name: "Acquired by Lucy Group", date: "2026-04-06", note: "Lucy Group acquires 100% of Nuventura to scale SF6-free GIS globally." }
    ],
    strategicDirection:
      "With Lucy Group's backing, scale dry-air SF6-free GIS from a niche licensor into a global volume competitor — including entry into North American distribution.",
    links: [
      { label: "Site", url: "https://www.nuventura.com" },
      { label: "Lucy Group acquisition", url: "https://www.einpresswire.com/article/903344129/lucy-group-acquires-nuventura-gmbh-in-germany-to-expand-into-primary-sf6-free-switchgear" }
    ]
  }
];
