export interface EventItem {
  slug: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  type: string;
  description: string;
  featured?: boolean;
  registrationOpen?: boolean;
  registrationUrl?: string;
}

export const events: EventItem[] = [
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