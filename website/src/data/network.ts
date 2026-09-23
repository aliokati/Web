export interface NetworkMember {
  slug: string;
  name: string;
  type: "Professional" | "Researcher" | "Organization" | "Institution";
  specialty?: string;
  affiliation?: string;
  city?: string;
  description: string;
  website?: string;
  featured?: boolean;
}

export const networkMembers: NetworkMember[] = [
  {
    slug: "krism-research-group",
    name: "KRISM Research Group",
    type: "Researcher",
    specialty: "Sleep Medicine",
    affiliation: "KRISM",
    city: "Mashhad",
    description:
      "Placeholder research group profile for demonstrating the KRISM professional network.",
    featured: true,
  },

  {
    slug: "sleep-medicine-institution",
    name: "Example Sleep Medicine Institution",
    type: "Institution",
    specialty: "Sleep Medicine",
    city: "Mashhad",
    description:
      "Placeholder institution profile. Replace with an official participating institution.",
  },

  {
    slug: "example-medical-society",
    name: "Example Medical Society",
    type: "Organization",
    specialty: "Sleep Medicine",
    city: "Mashhad",
    description:
      "Placeholder organization profile for demonstrating the KRISM network.",
  },
];