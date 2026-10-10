export interface Publication {
  id: string;
  titleEn: string;
  titleFa: string;
  authorsEn: string;
  authorsFa: string;
  journalEn: string;
  journalFa: string;
  publishYear: number;
  doi?: string;
  category: "clinical-trial" | "epidemiology" | "review" | "abstract";
  downloadUrl?: string;
}
