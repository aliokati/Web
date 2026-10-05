export interface ExternalReference {
  id: string;
  name: string;
  nameFa: string;
  short: string;
  url: string;
  region: string;
  regionFa: string;
  category: "society" | "academy" | "public education" | "journal";
  description: string;
  descriptionFa: string;
  sourceLabel: string;
  featured?: boolean;
  logo?: string;
  logoLicense?: string;
}

export const organizations: ExternalReference[] = [
  {
    id: "isms",
    name: "Iranian Sleep Medicine Society",
    nameFa: "انجمن پزشکی خواب ایران",
    short: "ISMS",
    url: "https://ism-society.ir/",
    region: "Iran",
    regionFa: "ایران",
    category: "society",
    description: "National multidisciplinary society supporting sleep-medicine education, research and public awareness in Iran.",
    descriptionFa: "انجمن ملی چندرشته‌ای برای آموزش، پژوهش و آگاهی عمومی در پزشکی خواب ایران.",
    sourceLabel: "Official website",
    featured: true,
  },
  {
    id: "wss",
    name: "World Sleep Society",
    nameFa: "انجمن جهانی خواب",
    short: "WSS",
    url: "https://worldsleepsociety.org/",
    region: "Global",
    regionFa: "جهانی",
    category: "society",
    description: "International network convening sleep-medicine science, clinical practice, education and advocacy.",
    descriptionFa: "شبکه بین‌المللی علم، طب بالینی، آموزش و حمایت‌گری در حوزه خواب.",
    sourceLabel: "Official website",
    featured: true,
  },
  {
    id: "aasm",
    name: "American Academy of Sleep Medicine",
    nameFa: "آکادمی پزشکی خواب آمریکا",
    short: "AASM",
    url: "https://aasm.org/",
    region: "United States",
    regionFa: "ایالات متحده",
    category: "academy",
    description: "Professional academy focused on clinical standards, accreditation, education and sleep-health advocacy.",
    descriptionFa: "آکادمی حرفه‌ای متمرکز بر استانداردهای بالینی، اعتباربخشی، آموزش و سلامت خواب.",
    sourceLabel: "Official website",
    featured: true,
  },
  {
    id: "esrs",
    name: "European Sleep Research Society",
    nameFa: "انجمن پژوهش خواب اروپا",
    short: "ESRS",
    url: "https://esrs.eu/",
    region: "Europe",
    regionFa: "اروپا",
    category: "society",
    description: "European scientific society promoting sleep research, sleep medicine, education and professional exchange.",
    descriptionFa: "انجمن علمی اروپا برای توسعه پژوهش خواب، پزشکی خواب، آموزش و تبادل حرفه‌ای.",
    sourceLabel: "Official website",
  },
  {
    id: "easm",
    name: "European Academy of Sleep Medicine",
    nameFa: "آکادمی اروپایی پزشکی خواب",
    short: "EASM",
    url: "https://www.ea-sm.org/",
    region: "Europe",
    regionFa: "اروپا",
    category: "academy",
    description: "European professional network supporting specialist education, training and sleep-science collaboration.",
    descriptionFa: "شبکه حرفه‌ای اروپا برای آموزش تخصصی، تربیت نیروی حرفه‌ای و همکاری در علم خواب.",
    sourceLabel: "Official website",
  },
  {
    id: "sleep-foundation",
    name: "Sleep Foundation",
    nameFa: "بنیاد خواب",
    short: "SF",
    url: "https://www.sleepfoundation.org/",
    region: "Public education",
    regionFa: "آموزش عمومی",
    category: "public education",
    description: "Public sleep-health information reviewed through an editorial and medical-advisory process.",
    descriptionFa: "اطلاعات عمومی سلامت خواب با فرایند بازبینی تحریریه و مشاوران پزشکی.",
    sourceLabel: "Official website",
  },
  {
    id: "srs",
    name: "Sleep Research Society",
    nameFa: "انجمن پژوهش خواب",
    short: "SRS",
    url: "https://sleepresearchsociety.org/",
    region: "International",
    regionFa: "بین‌المللی",
    category: "society",
    description: "Scientific membership organization advancing sleep and circadian research and researcher development.",
    descriptionFa: "سازمان علمی برای توسعه پژوهش خواب و ریتم شبانه‌روزی و پرورش پژوهشگران.",
    sourceLabel: "Official website",
  },
  {
    id: "ipsa",
    name: "International Pediatric Sleep Association",
    nameFa: "انجمن بین‌المللی خواب کودکان",
    short: "IPSA",
    url: "https://www.pedsleep.org/",
    region: "International",
    regionFa: "بین‌المللی",
    category: "society",
    description: "Multidisciplinary international community focused on pediatric sleep health and sleep disorders.",
    descriptionFa: "جامعه بین‌المللی چندرشته‌ای متمرکز بر سلامت و اختلالات خواب کودکان.",
    sourceLabel: "Official website",
  },
];

export const journals: ExternalReference[] = [
  {
    id: "jcsm", name: "Journal of Clinical Sleep Medicine", nameFa: "مجله پزشکی بالینی خواب", short: "JCSM",
    url: "https://link.springer.com/journal/44470", region: "Clinical sleep medicine", regionFa: "پزشکی بالینی خواب", category: "journal",
    description: "Peer-reviewed clinical sleep-medicine journal and official publication of AASM.", descriptionFa: "مجله داوری‌شده پزشکی بالینی خواب و نشریه رسمی AASM.", sourceLabel: "Publisher website", featured: true,
  },
  {
    id: "sleep", name: "SLEEP", nameFa: "مجله SLEEP", short: "SLEEP",
    url: "https://academic.oup.com/sleep", region: "Sleep & circadian science", regionFa: "علم خواب و ریتم شبانه‌روزی", category: "journal",
    description: "Peer-reviewed research across sleep, circadian biology and related clinical science.", descriptionFa: "پژوهش داوری‌شده در خواب، زیست‌شناسی شبانه‌روزی و علوم بالینی مرتبط.", sourceLabel: "Publisher website", featured: true,
  },
  {
    id: "sleep-medicine", name: "Sleep Medicine", nameFa: "مجله Sleep Medicine", short: "SM",
    url: "https://www.sciencedirect.com/journal/sleep-medicine", region: "International clinical research", regionFa: "پژوهش بالینی بین‌المللی", category: "journal",
    description: "International journal covering clinical sleep medicine and translational sleep research.", descriptionFa: "مجله بین‌المللی پزشکی بالینی خواب و پژوهش انتقالی خواب.", sourceLabel: "Publisher website", featured: true,
  },
  {
    id: "sleep-medicine-reviews", name: "Sleep Medicine Reviews", nameFa: "مجله مرورهای پزشکی خواب", short: "SMR",
    url: "https://www.sciencedirect.com/journal/sleep-medicine-reviews", region: "Evidence reviews", regionFa: "مرور شواهد", category: "journal",
    description: "Critical reviews synthesizing evidence across sleep medicine and sleep science.", descriptionFa: "مرورهای تحلیلی برای جمع‌بندی شواهد پزشکی و علم خواب.", sourceLabel: "Publisher website",
  },
  {
    id: "journal-sleep-research", name: "Journal of Sleep Research", nameFa: "مجله پژوهش خواب", short: "JSR",
    url: "https://onlinelibrary.wiley.com/journal/13652869", region: "Sleep research", regionFa: "پژوهش خواب", category: "journal",
    description: "Research journal spanning basic, translational and clinical sleep science.", descriptionFa: "مجله پژوهشی علوم پایه، انتقالی و بالینی خواب.", sourceLabel: "Publisher website",
  },
  {
    id: "sleep-health", name: "Sleep Health", nameFa: "مجله سلامت خواب", short: "SH",
    url: "https://www.sleephealthjournal.org/", region: "Population sleep health", regionFa: "سلامت خواب جمعیت", category: "journal",
    description: "Research and perspectives on population sleep health, policy and practice.", descriptionFa: "پژوهش و دیدگاه درباره سلامت خواب جمعیت، سیاست‌گذاری و عمل.", sourceLabel: "Journal website",
  },
];

export const featuredOrganizations = organizations.filter((item) => item.featured).slice(0, 3);
export const featuredJournals = journals.filter((item) => item.featured).slice(0, 3);
