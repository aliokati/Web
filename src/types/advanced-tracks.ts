export interface AdvancedTrackQuestion {
  id: string;
  textEn: string;
  textFa: string;
  options: {
    score: number;
    textEn: string;
    textFa: string;
  }[];
}
