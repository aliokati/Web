export interface Organization {
  name: string;
  type: string;
  description: string;
  website?: string;
}

export const organizations: Organization[] = [
  {
    name: "Example Sleep Medicine Organization",
    type: "Medical Society",
    description:
      "Organization working in sleep medicine and related healthcare activities.",
  },
];