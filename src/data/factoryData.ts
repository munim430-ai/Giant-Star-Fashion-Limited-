/**
 * Single source of truth for every company fact shown on the site: corporate
 * registrations, capacity, machinery inventory, process, products, contacts.
 * Update figures here and every section picks them up.
 */

export type IconName =
  | "badgeCheck"
  | "boxes"
  | "building"
  | "cable"
  | "droplets"
  | "flame"
  | "gauge"
  | "grid"
  | "heartPulse"
  | "landmark"
  | "layers"
  | "leaf"
  | "plane"
  | "ruler"
  | "scanLine"
  | "scissors"
  | "shieldCheck"
  | "ship"
  | "shuffle"
  | "users"
  | "warehouse"
  | "zap";

export type Gauge = "14G" | "12G" | "7G" | "5/7G";

/* -------------------------------------------------------------------------- */
/* Corporate profile                                                           */
/* -------------------------------------------------------------------------- */

export const company = {
  name: "Giant Star Fashion Limited",
  shortName: "Giant Star Fashion Ltd.",
  acronym: "GSFL",
  established: 2019,
  businessType: "100% Export-Oriented Sweater Manufacturer & Exporter",
  tagline: "Precision Knitwear Manufacturing at Global Scale",
  summary:
    "100% Export-Oriented Sweater Factory equipped with 300 automated jacquard systems, 580 certified professionals, and strict ethical compliance.",
  registrations: {
    businessRegistration: "002421025-0403",
    bgmeaMembership: "6590",
    exportPromotion: "BD06782",
  },
  certifications: ["BSCI", "OEKO-TEX Standard 100", "SEDEX (SMETA)"],
  generalEmail: "info@giantstarbd.com",
  domain: "giantstarbd.com",
} as const;

export const workforce = {
  total: 580,
  male: 348,
  female: 232,
  childLabor: 0,
} as const;

export const capacity = {
  daily: { min: 6000, max: 6500 },
  monthly: { min: 156000, max: 169000 },
  yearly: { min: 1872000, max: 2028000 },
} as const;

/* -------------------------------------------------------------------------- */
/* Locations & contacts                                                        */
/* -------------------------------------------------------------------------- */

export type Location = {
  id: "factory" | "head-office";
  label: string;
  title: string;
  lines: string[];
  note: string;
  mapQuery: string;
};

export const locations: Location[] = [
  {
    id: "factory",
    label: "Factory Plant",
    title: "Production Facility",
    lines: ["Gazirchat, Munshipara", "Ashulia, Savar", "Dhaka, Bangladesh"],
    note: "45 minutes from Hazrat Shahjalal International Airport (DAC)",
    mapQuery: "Gazirchat, Ashulia, Savar, Dhaka, Bangladesh",
  },
  {
    id: "head-office",
    label: "Head Office",
    title: "Corporate & Merchandising",
    lines: ["House #1102, Flat #2/C (1st Floor)", "Road #2/B, Sector #05", "Uttara Model Town, Dhaka-1230"],
    note: "Uttara Model Town, close to Hazrat Shahjalal International Airport",
    mapQuery: "Sector 5, Uttara Model Town, Dhaka 1230, Bangladesh",
  },
];

export const airport = {
  name: "Hazrat Shahjalal International Airport",
  code: "DAC",
  minutesFromFactory: 45,
} as const;

export type Phone = { display: string; href: string };

export type Leader = {
  name: string;
  role: string;
  roleShort: string;
  phones: Phone[];
  email: string;
};

const phone = (display: string): Phone => ({
  display,
  href: `tel:${display.replace(/[^\d+]/g, "")}`,
});

export const leadership: Leader[] = [
  {
    name: "Md. Abdus Satter",
    role: "Managing Director",
    roleShort: "Managing Director",
    phones: [phone("+88 01611 422 572")],
    email: "md@giantstarbd.com",
  },
  {
    name: "Ajit Chakraborty",
    role: "Executive Director (Operation)",
    roleShort: "E.D. Operation",
    phones: [phone("+88 01322 848491"), phone("+88 01713 069113")],
    email: "ajit@giantstarbd.com",
  },
];

export const primaryContact = {
  email: leadership[0].email,
  phone: leadership[0].phones[0],
  area: "Ashulia, Dhaka",
} as const;

export type BankAccount = {
  bank: string;
  branch: string;
  city: string;
  swift: string;
};

export const bankAccounts: BankAccount[] = [
  { bank: "Pubali Bank PLC", branch: "Uttara Branch", city: "Dhaka", swift: "PUBABDDH228" },
  { bank: "Agrani Bank PLC", branch: "Motijheel Branch", city: "Dhaka", swift: "AGBKBDDH004" },
];

/* -------------------------------------------------------------------------- */
/* Navigation                                                                  */
/* -------------------------------------------------------------------------- */

export const navLinks = [
  { id: "about", label: "About" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "capacity", label: "Capacity" },
  { id: "process", label: "Process" },
  { id: "products", label: "Products" },
  { id: "compliance", label: "Compliance" },
  { id: "clients", label: "Clients" },
  { id: "contact", label: "Contact" },
] as const;

/* -------------------------------------------------------------------------- */
/* Trust badges & headline metrics                                             */
/* -------------------------------------------------------------------------- */

export const trustBadges = [
  { label: "BGMEA Member", detail: `#${company.registrations.bgmeaMembership}`, icon: "landmark" },
  { label: "BSCI", detail: "Certified", icon: "shieldCheck" },
  { label: "OEKO-TEX", detail: "Standard 100", icon: "leaf" },
  { label: "SEDEX / SMETA", detail: "Verified", icon: "badgeCheck" },
] as const satisfies ReadonlyArray<{ label: string; detail: string; icon: IconName }>;

export type Metric = {
  id: string;
  label: string;
  /** Single animated value, or a [from, to] range. */
  value: number | readonly [number, number];
  format: "compact" | "full";
  suffix?: string;
  unit: string;
  note: string;
  icon: IconName;
};

export const metrics: Metric[] = [
  {
    id: "annual",
    label: "Annual Output",
    value: 2000000,
    format: "compact",
    suffix: "+",
    unit: "pcs / year",
    note: "1.87M – 2.03M pcs rated yearly capacity",
    icon: "boxes",
  },
  {
    id: "monthly",
    label: "Monthly Capacity",
    value: [capacity.monthly.min, capacity.monthly.max],
    format: "compact",
    unit: "pcs / month",
    note: "6,000 – 6,500 pcs daily output",
    icon: "gauge",
  },
  {
    id: "fleet",
    label: "Automated Jacquard Fleet",
    value: 300,
    format: "full",
    unit: "sets",
    note: "14G · 12G · 7G · 5/7G computerized flat knitting",
    icon: "grid",
  },
  {
    id: "workforce",
    label: "Ethical Workforce",
    value: workforce.total,
    format: "full",
    unit: "craftspeople",
    note: "100% zero child labor, BSCI & SMETA audited",
    icon: "users",
  },
  {
    id: "airport",
    label: "Airport Proximity",
    value: airport.minutesFromFactory,
    format: "full",
    unit: "min to DAC",
    note: "Hazrat Shahjalal International Airport",
    icon: "plane",
  },
];

/* -------------------------------------------------------------------------- */
/* Machinery                                                                   */
/* -------------------------------------------------------------------------- */

export type MachineItem = {
  name: string;
  spec: string;
  qty: number;
  unit: "sets" | "pcs";
  gauge?: Gauge;
};

export type MachineryCategory = {
  id: string;
  name: string;
  icon: IconName;
  summary: string;
  items: MachineItem[];
};

export const knittingBrand = "Giant Star (China)";

export const machinery: MachineryCategory[] = [
  {
    id: "knitting",
    name: "Automated Jacquard Knitting",
    icon: "grid",
    summary: `Computerized jacquard flat-knitting fleet — brand ${knittingBrand}.`,
    items: [
      { name: "Jacquard Knitting Machine", spec: "12 Gauge · Single System", qty: 159, unit: "sets", gauge: "12G" },
      { name: "Jacquard Knitting Machine", spec: "5/7 Gauge · Multi System", qty: 60, unit: "sets", gauge: "5/7G" },
      { name: "Jacquard Knitting Machine", spec: "7 Gauge · Single System", qty: 43, unit: "sets", gauge: "7G" },
      { name: "Jacquard Knitting Machine", spec: "12 Gauge · Double System", qty: 30, unit: "sets", gauge: "12G" },
      { name: "Jacquard Knitting Machine", spec: "14 Gauge · Double System", qty: 8, unit: "sets", gauge: "14G" },
    ],
  },
  {
    id: "linking",
    name: "Linking",
    icon: "cable",
    summary: "Loop-to-loop panel linking for flat, elastic seams.",
    items: [{ name: "Linking Machine", spec: "Panel assembly", qty: 163, unit: "sets" }],
  },
  {
    id: "winding",
    name: "Winding & Preparation",
    icon: "shuffle",
    summary: "Yarn conditioning and cone preparation ahead of knitting.",
    items: [
      { name: "Winding Machine", spec: "Cone winding", qty: 11, unit: "sets" },
      { name: "Auto Winding Re-coning Machine", spec: "Automatic re-coning", qty: 11, unit: "sets" },
      { name: "Part Open Machine", spec: "Panel / part opening", qty: 5, unit: "sets" },
    ],
  },
  {
    id: "finishing",
    name: "Washing, Drying & Finishing",
    icon: "droplets",
    summary: "In-house wet processing, steam generation and pressing.",
    items: [
      { name: "Washing Machine", spec: "100 kg capacity", qty: 3, unit: "sets" },
      { name: "Dryer Machine", spec: "100 kg capacity", qty: 3, unit: "sets" },
      { name: "Fulton Boiler", spec: "Gas-fired · 500 kg", qty: 1, unit: "sets" },
      { name: "Fulton Boiler", spec: "Jute-fired · 1,000 kg", qty: 1, unit: "sets" },
      { name: "Steam Iron", spec: "Pressing station", qty: 36, unit: "pcs" },
    ],
  },
  {
    id: "sewing",
    name: "Sewing & Assembly",
    icon: "scissors",
    summary: "Trims, plackets and reinforcement for finished garments.",
    items: [
      { name: "Sewing Machine", spec: "Lockstitch", qty: 20, unit: "sets" },
      { name: "Bar Tack Machine", spec: "Stress-point reinforcement", qty: 6, unit: "sets" },
      { name: "Overlock Machine", spec: "Edge finishing", qty: 4, unit: "sets" },
      { name: "Button Machine", spec: "Button attaching", qty: 3, unit: "sets" },
      { name: "Buttonhole Machine", spec: "Buttonholing", qty: 3, unit: "sets" },
    ],
  },
  {
    id: "quality",
    name: "Inspection & Quality",
    icon: "scanLine",
    summary: "Backlit inspection and needle detection before shipment.",
    items: [
      { name: "Light Check Desk", spec: "Knitted part inspection", qty: 8, unit: "sets" },
      { name: "Light Check Table", spec: "Garment inspection", qty: 8, unit: "sets" },
      { name: "Metal Detector", spec: "High-sensitivity needle detection", qty: 1, unit: "sets" },
    ],
  },
  {
    id: "power",
    name: "Power Backup",
    icon: "zap",
    summary: "Standby generation keeps knitting and finishing running.",
    items: [
      { name: "Generator", spec: "450 KVA", qty: 1, unit: "sets" },
      { name: "Generator", spec: "250 KVA", qty: 1, unit: "sets" },
    ],
  },
];

export type GaugeProfile = {
  gauge: Gauge;
  label: string;
  sets: number;
  systems: string;
  bestFor: string;
};

export const gaugeProfiles: GaugeProfile[] = [
  {
    gauge: "14G",
    label: "Fine gauge",
    sets: 8,
    systems: "Double system",
    bestFor: "Lightweight jerseys, fine V-necks and layering knits",
  },
  {
    gauge: "12G",
    label: "Mid-fine gauge",
    sets: 189,
    systems: "159 single · 30 double system",
    bestFor: "Jacquards, fair isles, everyday pullovers and cardigans",
  },
  {
    gauge: "7G",
    label: "Medium gauge",
    sets: 43,
    systems: "Single system",
    bestFor: "Cables, textured stitches and kids' outer knits",
  },
  {
    gauge: "5/7G",
    label: "Chunky multi-gauge",
    sets: 60,
    systems: "Multi system",
    bestFor: "Chunky cables, oversized cardigans and statement knits",
  },
];

export const knittingTotal = machinery[0].items.reduce((sum, m) => sum + m.qty, 0);

/* -------------------------------------------------------------------------- */
/* 17-stage process                                                            */
/* -------------------------------------------------------------------------- */

export type ProcessPhase = {
  id: string;
  name: string;
  color: "olive" | "rust" | "crimson" | "forest" | "ink";
};

export const processPhases: ProcessPhase[] = [
  { id: "yarn", name: "Yarn Preparation", color: "olive" },
  { id: "knit", name: "Knitting & Panel QC", color: "rust" },
  { id: "makeup", name: "Make-Up & Linking", color: "crimson" },
  { id: "finish", name: "Wash & Finishing", color: "forest" },
  { id: "dispatch", name: "Final QC & Dispatch", color: "ink" },
];

export type ProcessStep = {
  n: number;
  phase: ProcessPhase["id"];
  name: string;
  description: string;
  equipment?: string;
  qcGate?: boolean;
};

export const processSteps: ProcessStep[] = [
  {
    n: 1,
    phase: "yarn",
    name: "Yarn Collection",
    description:
      "Yarn lots are received into the bonded store and checked against the approved shade, count and composition before release to production.",
    equipment: "Bonded yarn warehouse",
  },
  {
    n: 2,
    phase: "yarn",
    name: "Yarn Winding",
    description:
      "Hanks and supplier cones are rewound at controlled tension onto knitting-ready cones for consistent feeding on the machine.",
    equipment: "11 winding + 11 auto re-coning sets",
  },
  {
    n: 3,
    phase: "yarn",
    name: "Yarn Distribution",
    description:
      "Yarn is issued by style, colour and size ratio against the knitting plan, with lot numbers tracked to prevent shade variation.",
  },
  {
    n: 4,
    phase: "knit",
    name: "Automated Jacquard Knitting",
    description:
      "Fully-fashioned panels are knitted to programmed patterns on computerized jacquard machines from 14G fine gauge to 5/7G chunky.",
    equipment: "300 jacquard knitting sets",
  },
  {
    n: 5,
    phase: "knit",
    name: "Online Panel Inspection",
    description:
      "In-line checkers verify panel measurement, weight and stitch structure at the machine, stopping faults at source.",
    qcGate: true,
  },
  {
    n: 6,
    phase: "knit",
    name: "Mending",
    description: "Skilled menders repair dropped stitches and minor knitting faults by hand before panels move on.",
  },
  {
    n: 7,
    phase: "knit",
    name: "Light Checking",
    description:
      "Panels are inspected over backlit desks to reveal holes, thin places and yarn faults invisible under normal light.",
    equipment: "8 knitted-part light-check desks",
    qcGate: true,
  },
  {
    n: 8,
    phase: "makeup",
    name: "Trimming",
    description: "Yarn tails and knitting waste are trimmed so every panel reaches linking with clean, even edges.",
  },
  {
    n: 9,
    phase: "makeup",
    name: "Online Linking Inspection",
    description:
      "Loop alignment, linking points and seam stretch are inspected in-line to catch defects before garments are closed.",
    qcGate: true,
  },
  {
    n: 10,
    phase: "makeup",
    name: "Panel Linking",
    description:
      "Fronts, backs, sleeves and trims are joined loop-to-loop for flat, elastic seams that move with the fabric.",
    equipment: "163 linking machines",
  },
  {
    n: 11,
    phase: "makeup",
    name: "Buttonhole & Buttoning",
    description: "Plackets receive buttonholes and buttons; bar tacks and overlock reinforce stress points.",
    equipment: "3 buttonhole · 3 button · 6 bar tack · 4 overlock",
  },
  {
    n: 12,
    phase: "finish",
    name: "Industrial Washing",
    description:
      "Garments are washed, softened and tumble-dried to the buyer's approved hand-feel and dimensional standard.",
    equipment: "3 × 100 kg washers · 3 × 100 kg dryers",
  },
  {
    n: 13,
    phase: "finish",
    name: "Brand Labeling",
    description: "Main, size, care and composition labels are attached exactly to the buyer's trim card.",
  },
  {
    n: 14,
    phase: "finish",
    name: "Steam Pressing",
    description: "Garments are steam-pressed and set to specified measurements, powered by in-house Fulton boilers.",
    equipment: "36 steam irons · 2 Fulton boilers",
  },
  {
    n: 15,
    phase: "finish",
    name: "Folding & Packaging",
    description: "Folded to packing instructions, poly-bagged, tagged and cartoned by size and colour ratio.",
  },
  {
    n: 16,
    phase: "dispatch",
    name: "Final QC Inspection",
    description:
      "Pre-shipment audit of measurements, appearance and packing, with needle detection before cartons are sealed.",
    equipment: "8 light-check tables · metal detector",
    qcGate: true,
  },
  {
    n: 17,
    phase: "dispatch",
    name: "Port Shipment",
    description:
      "Export cartons are dispatched for sea or air freight — the factory sits 45 minutes from Hazrat Shahjalal International Airport.",
  },
];

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

export type ProductCategory = "men" | "ladies" | "kids";

export const productCategories: { id: ProductCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "men", label: "Men's Collection" },
  { id: "ladies", label: "Ladies' Collection" },
  { id: "kids", label: "Kids' Collection" },
];

export type SwatchKind =
  "cable" | "chunky-cable" | "rib" | "jacquard" | "fairisle" | "pointelle" | "tipped" | "motif" | "stripe" | "argyle";

export type Product = {
  id: string;
  category: ProductCategory;
  name: string;
  style: string;
  gauge: Gauge;
  yarn: string;
  texture: string;
  features: string[];
  /** Colourway used to render the knit swatch, darkest last. */
  swatch: { kind: SwatchKind; colors: string[] };
  /** Optional photography — drop a path under /public or an allowed remote URL. */
  image?: string;
};

export const products: Product[] = [
  {
    id: "m-aran-crew",
    category: "men",
    name: "Aran Cable Crew",
    style: "Crew-neck pullover",
    gauge: "7G",
    yarn: "Wool / Acrylic blend",
    texture: "Aran cables with moss-stitch panels",
    features: ["Fully fashioned", "Rib trims"],
    swatch: { kind: "cable", colors: ["#EFE7D6", "#D9CCB2", "#B7A583"] },
  },
  {
    id: "m-rib-turtleneck",
    category: "men",
    name: "Ribbed Turtleneck",
    style: "Roll-neck pullover",
    gauge: "12G",
    yarn: "Cotton / Acrylic",
    texture: "2×2 rib throughout",
    features: ["Double-layer collar", "Garment washed"],
    swatch: { kind: "rib", colors: ["#2A3A5E", "#1B2847", "#0F1830"] },
  },
  {
    id: "m-cable-vest",
    category: "men",
    name: "Cable Sweater Vest",
    style: "V-neck vest",
    gauge: "7G",
    yarn: "100% Acrylic",
    texture: "Centre cable, rib armholes",
    features: ["Layering piece", "Tubular trims"],
    swatch: { kind: "chunky-cable", colors: ["#7A8A34", "#5F6D24", "#434E17"] },
  },
  {
    id: "m-geo-jacquard",
    category: "men",
    name: "Geometric Jacquard Crew",
    style: "Crew-neck pullover",
    gauge: "12G",
    yarn: "Acrylic / Wool / Nylon",
    texture: "Two-colour geometric jacquard",
    features: ["Birdseye back", "Engineered placement"],
    swatch: { kind: "jacquard", colors: ["#E9E1CF", "#17223F", "#0B1733"] },
  },
  {
    id: "l-chunky-cardigan",
    category: "ladies",
    name: "Chunky Cable Cardigan",
    style: "Oversized cardigan",
    gauge: "5/7G",
    yarn: "Acrylic / Nylon / Wool",
    texture: "Chunky braided cables",
    features: ["Dropped shoulder", "Horn-look buttons"],
    swatch: { kind: "chunky-cable", colors: ["#E6D5BE", "#CDB797", "#A99070"] },
  },
  {
    id: "l-fairisle-yoke",
    category: "ladies",
    name: "Fair Isle Yoke Pullover",
    style: "Raglan pullover",
    gauge: "12G",
    yarn: "Wool blend",
    texture: "Multi-colour fair isle yoke",
    features: ["Engineered yoke", "Rib cuffs"],
    swatch: { kind: "fairisle", colors: ["#F2ECE0", "#A90425", "#586719", "#0B1733"] },
  },
  {
    id: "l-pointelle",
    category: "ladies",
    name: "Pointelle Pattern Pullover",
    style: "Boat-neck pullover",
    gauge: "12G",
    yarn: "Viscose / Nylon",
    texture: "Openwork pointelle pattern",
    features: ["Lightweight", "Soft hand-feel"],
    swatch: { kind: "pointelle", colors: ["#F3D9D3", "#E2B8AF", "#B98479"] },
  },
  {
    id: "l-fine-vneck",
    category: "ladies",
    name: "Fine-Gauge V-Neck",
    style: "V-neck pullover",
    gauge: "14G",
    yarn: "Viscose / Nylon",
    texture: "Single jersey with tipped trims",
    features: ["Fully fashioned", "Contrast tipping"],
    swatch: { kind: "tipped", colors: ["#8A0A22", "#6F0C1F", "#F2ECE0"] },
  },
  {
    id: "k-bear-jacquard",
    category: "kids",
    name: "Bear Motif Jacquard",
    style: "Kids' crew-neck",
    gauge: "12G",
    yarn: "100% Cotton",
    texture: "Graphic animal jacquard",
    features: ["Soft cotton", "Shoulder buttons"],
    swatch: { kind: "motif", colors: ["#DCE7EF", "#914D14", "#5F320C", "#F2ECE0"] },
  },
  {
    id: "k-hooded-cardigan",
    category: "kids",
    name: "Hooded Cardigan",
    style: "Zip-through hoodie",
    gauge: "7G",
    yarn: "Cotton / Acrylic",
    texture: "Breton stripe jersey",
    features: ["Knitted hood", "Rib trims"],
    swatch: { kind: "stripe", colors: ["#F2ECE0", "#2D6215", "#1B3D0E"] },
  },
  {
    id: "k-holiday",
    category: "kids",
    name: "Holiday Snowflake Knit",
    style: "Festive pullover",
    gauge: "12G",
    yarn: "100% Acrylic",
    texture: "Snowflake & tree fair isle",
    features: ["Seasonal colourways", "Soft brushed finish"],
    swatch: { kind: "fairisle", colors: ["#A90425", "#F2ECE0", "#2D6215", "#6F0C1F"] },
  },
  {
    id: "k-argyle-vest",
    category: "kids",
    name: "Argyle Knit Vest",
    style: "Kids' V-neck vest",
    gauge: "12G",
    yarn: "Cotton / Acrylic",
    texture: "Intarsia-look argyle",
    features: ["School & smart wear", "Rib trims"],
    swatch: { kind: "argyle", colors: ["#283454", "#B8672A", "#F2ECE0", "#17223F"] },
  },
];

/* -------------------------------------------------------------------------- */
/* Facility tour                                                               */
/* -------------------------------------------------------------------------- */

export type FacilityArea = {
  id: string;
  name: string;
  icon: IconName;
  stat: string;
  description: string;
  highlights: string[];
  /** Optional photography — drop a path under /public or an allowed remote URL. */
  image?: string;
};

export const facilityAreas: FacilityArea[] = [
  {
    id: "sampling",
    name: "Sample Section & Pattern Development",
    icon: "ruler",
    stat: "Tech pack → proto",
    description:
      "Pattern engineering, machine programming and sample development translate buyer tech packs into proto, fit and pre-production samples.",
    highlights: ["Knit programming", "Fit & PP samples", "Measurement grading"],
  },
  {
    id: "winding",
    name: "High-Speed Winding Section",
    icon: "shuffle",
    stat: "27 sets",
    description:
      "Winding, automatic re-coning and part-open machines prepare every yarn lot for even tension on the knitting floor.",
    highlights: ["11 winding", "11 auto re-coning", "5 part open"],
  },
  {
    id: "knitting-hall",
    name: "300-Machine Automated Jacquard Hall",
    icon: "grid",
    stat: "300 sets",
    description:
      "Computerized jacquard flat-knitting across four gauge families, from 14G fine jersey to 5/7G chunky multi-system knits.",
    highlights: ["14G · 12G · 7G · 5/7G", "Single, double & multi system", "Fully-fashioned panels"],
  },
  {
    id: "linking",
    name: "Manual & Precision Linking Section",
    icon: "cable",
    stat: "163 sets",
    description: "Loop-to-loop linking joins panels with stretch-matched seams, backed by in-line linking inspection.",
    highlights: ["163 linking machines", "Online linking QC", "Collar & placket linking"],
  },
  {
    id: "inspection",
    name: "Trimming, Mending & Light Inspection",
    icon: "scanLine",
    stat: "16 light stations",
    description:
      "Backlit inspection desks, hand mending and trimming stations catch faults at panel stage — before they become garment defects.",
    highlights: ["8 knitted-part desks", "8 garment tables", "Hand mending"],
  },
  {
    id: "wash",
    name: "Heavy Industrial Wash & Hydro Finishing",
    icon: "droplets",
    stat: "300 kg wash load",
    description:
      "In-house washing and drying set hand-feel, softness and dimensional stability to the buyer's approved standard.",
    highlights: ["3 × 100 kg washers", "3 × 100 kg dryers", "Softening & finishing"],
  },
  {
    id: "pressing",
    name: "Final Steam Pressing & Packaging Lines",
    icon: "flame",
    stat: "36 irons",
    description:
      "Steam pressing on dual-fuel Fulton boiler supply, then folding, tagging, needle detection and export cartoning.",
    highlights: ["36 steam irons", "Gas + jute boilers", "Metal detection"],
  },
  {
    id: "warehouse",
    name: "Bonded Yarn Warehouse & Raw Material Store",
    icon: "warehouse",
    stat: "Lot-tracked",
    description:
      "Bonded storage for imported yarn and trims, organized by buyer, style and dye lot for traceable issue to production.",
    highlights: ["Bonded storage", "Dye-lot control", "Trims & accessories"],
  },
];

/* -------------------------------------------------------------------------- */
/* Buyers                                                                      */
/* -------------------------------------------------------------------------- */

export const buyers = [
  "mister*lady",
  "Coppel",
  "Sonae",
  "LANCTÔT",
  "TAM FASHION",
  "Whispering Smith",
  "traffic",
  "Spark Factory",
  "LUKE 1977",
  "OFFTEX",
  "VM TIVI",
  "FASHION",
] as const;

/* -------------------------------------------------------------------------- */
/* Compliance                                                                  */
/* -------------------------------------------------------------------------- */

export type Policy = {
  id: string;
  title: string;
  icon: IconName;
  body: string;
  points: string[];
};

export const policies: Policy[] = [
  {
    id: "safety",
    title: "Worker Health & Safety",
    icon: "heartPulse",
    body: "A safe floor is a productive floor. Workplace practices are reviewed through recurring BSCI and SMETA social audits.",
    points: ["BSCI & SMETA audited", "450 + 250 KVA standby power", "Metal detection before dispatch"],
  },
  {
    id: "inclusion",
    title: "Workplace Inclusion",
    icon: "users",
    body: `${workforce.total} professionals — ${workforce.male} men and ${workforce.female} women — across knitting, linking, finishing and quality.`,
    points: [
      "40% women in the workforce",
      `${workforce.male} men · ${workforce.female} women`,
      "Roles across every department",
    ],
  },
  {
    id: "child-labor",
    title: "Strict No Child Labor",
    icon: "shieldCheck",
    body: "Zero tolerance, zero exceptions. Our no-child-labor guarantee is verified through independent social audits.",
    points: ["Zero child labor", "Verified by social audits", "No exceptions"],
  },
  {
    id: "environment",
    title: "Environmental Care",
    icon: "leaf",
    body: "Dual-fuel Fulton boilers pair a 500 kg gas unit with a 1,000 kg jute-fired unit running on renewable agricultural biomass.",
    points: ["Jute biomass steam", "OEKO-TEX Standard 100", "Efficient 100 kg wet processing"],
  },
];

export const credentials = [
  { label: "BGMEA Membership", value: `Reg. #${company.registrations.bgmeaMembership}`, icon: "landmark" },
  { label: "Export Promotion", value: `#${company.registrations.exportPromotion}`, icon: "ship" },
  { label: "Business Registration", value: company.registrations.businessRegistration, icon: "building" },
  { label: "amfori BSCI", value: "Social compliance", icon: "shieldCheck" },
  { label: "SEDEX (SMETA)", value: "Ethical trade audit", icon: "badgeCheck" },
  { label: "OEKO-TEX", value: "Standard 100", icon: "leaf" },
] as const satisfies ReadonlyArray<{ label: string; value: string; icon: IconName }>;

/* -------------------------------------------------------------------------- */
/* RFQ form options                                                            */
/* -------------------------------------------------------------------------- */

export const inquiryTypes = [
  "Quotation (RFQ)",
  "Tech Pack Review",
  "Factory Tour / Audit Visit",
  "Sample Development",
  "Compliance / Audit Reports",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

export const gaugeOptions = ["14G", "12G", "7G", "5/7G", "Multiple gauges", "Not sure yet"] as const;

export const volumeOptions = [
  "Under 5,000 pcs",
  "5,000 – 20,000 pcs",
  "20,000 – 50,000 pcs",
  "50,000 – 100,000 pcs",
  "100,000+ pcs",
] as const;
