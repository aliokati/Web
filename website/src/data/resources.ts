export interface ResourceItem {
  slug: string;
  title: string;
  category:
    | "Guideline"
    | "Educational"
    | "Clinical"
    | "Research"
    | "Public"
    | "External";
  description: string;
  url?: string;
  featured?: boolean;
}

export const resources: ResourceItem[] = [
  {
    slug: "sleep-medicine-guidelines",
    title: "Sleep Medicine Guidelines",
    category: "Guideline",
    description:
      "A future collection of relevant clinical guidelines and professional recommendations.",
    featured: true,
  },

  {
    slug: "sleep-medicine-education",
    title: "Sleep Medicine Educational Materials",
    category: "Educational",
    description:
      "Educational materials for healthcare professionals, students and researchers.",
    featured: true,
  },

  {
    slug: "clinical-sleep-resources",
    title: "Clinical Sleep Resources",
    category: "Clinical",
    description:
      "Clinical reference materials and resources related to sleep medicine.",
  },

  {
    slug: "research-resources",
    title: "Research Resources",
    category: "Research",
    description:
      "Research-related resources for investigators working in sleep medicine.",
  },

  {
    slug: "public-sleep-health",
    title: "Sleep Health Information",
    category: "Public",
    description:
      "Public-facing educational information about healthy sleep and sleep disorders.",
  },
];