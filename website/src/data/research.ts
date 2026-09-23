export interface ResearchItem {
  slug: string;
  title: string;
  description: string;
  location: string;
  date: string;
  type: string;
  collaborators?: string[];
  featured?: boolean;
  registrationOpen?: boolean
}

export const researchProjects: ResearchItem[] = [
  {
    slug: "sleep-medicine-scientific-meeting",
    title: "Sleep Medicine Scientific Meeting",
    date: "2026-11-20",
    location: "Mashhad, Iran",
    type: "Scientific Meeting",
    description:
      "Placeholder event demonstrating the KRISM scientific meeting structure. Replace with the official event information.",
    featured: true,
    registrationOpen: true,
  },

  {
    slug: "sleep-medicine-education-workshop",
    title: "Sleep Medicine Education Workshop",
    date: "2026-12-12",
    location: "Mashhad, Iran",
    type: "Educational Workshop",
    description:
      "Placeholder educational event demonstrating the KRISM event architecture.",
    registrationOpen: false,
  },
];