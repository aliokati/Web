export interface TrackQuestion {
  id: string;
  textEn: string;
  textFa: string;
  type: "scale-4" | "boolean"; // Scale (0-4) for ISI, Yes/No (1/0) for STOP-BANG
}

export interface TrackScoreInterpretation {
  minScore: number;
  maxScore: number;
  severityEn: string;
  severityFa: string;
  actionEn: string;
  actionFa: string;
}
