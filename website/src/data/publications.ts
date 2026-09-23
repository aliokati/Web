export interface Publication {
  title: string;
  authors: string;
  journal: string;
  year: number;
  url?: string;
  category?: string;
}

export const publications: Publication[] = [
  {
    title: "Sleep Medicine Research Publication",
    authors: "KRISM Research Community",
    journal: "Scientific Journal",
    year: 2026,
    category: "Sleep Medicine",
  },
];