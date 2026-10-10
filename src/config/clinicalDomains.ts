export interface DiagnosticDomain {
  id: string;
  nameEn: string;
  nameFa: string;
  goldStandardInstrument: string;
  thresholdScore: number; // Score out of 4 where specific warning flags trigger
  detailedTrackRoute: string;
}

export const CLINICAL_DOMAINS: Record<string, DiagnosticDomain> = {
  insomnia: {
    id: "insomnia",
    nameEn: "Insomnia & Sleep Continuity",
    nameFa: "بی‌خوابی و تداوم خواب",
    goldStandardInstrument: "ISI (Insomnia Severity Index)",
    thresholdScore: 2.5,
    detailedTrackRoute: "/sleep-check/tracks/isi"
  },
  apnea: {
    id: "apnea",
    nameEn: "Sleep-Related Breathing Disorders",
    nameFa: "اختلالات تنفسی وابسته به خواب",
    goldStandardInstrument: "STOP-BANG Assessment",
    thresholdScore: 2.0,
    detailedTrackRoute: "/sleep-check/tracks/stop-bang"
  },
  circadian: {
    id: "circadian",
    nameEn: "Circadian Rhythm Sleep-Wake Disorders",
    nameFa: "اختلالات ریتم شبانه‌روزی خواب و بیداری",
    goldStandardInstrument: "MEQ (Morningness-Eveningness Questionnaire)",
    thresholdScore: 2.5,
    detailedTrackRoute: "/sleep-check/tracks/meq"
  },
  parasomnia: {
    id: "parasomnia",
    nameEn: "Parasomnias & Disruptive Sleep Behaviors",
    nameFa: "پاراسومنیا و رفتارهای مخرب حین خواب",
    goldStandardInstrument: "GAPS (Global Parasomnia Scale)",
    thresholdScore: 1.5,
    detailedTrackRoute: "/sleep-check/tracks/gaps"
  },
  movement: {
    id: "movement",
    nameEn: "Sleep-Related Movement Disorders",
    nameFa: "اختلالات حرکتی وابسته به خواب",
    goldStandardInstrument: "IRLS (International Restless Legs Scale)",
    thresholdScore: 2.0,
    detailedTrackRoute: "/sleep-check/tracks/irls"
  },
  hypersomnia: {
    id: "hypersomnia",
    nameEn: "Central Disorders of Hypersomnolence",
    nameFa: "اختلالات مرکزی پرخوابی",
    goldStandardInstrument: "ESS (Epworth Sleepiness Scale)",
    thresholdScore: 2.5,
    detailedTrackRoute: "/sleep-check/tracks/ess"
  }
};
