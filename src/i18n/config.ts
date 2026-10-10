export const i18n = {
  defaultLocale: "en",
  locales: ["en", "fa"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  navigation: {
    about: string;
    board: string;
    research: string;
    events: string;
    network: string;
    resources: string;
    health: string;
    sleepCheck: string;
    contact: string;
  };
  hero: {
    tagline: string;
    title: string;
    description: string;
    ctaPublic: string;
    ctaProfessional: string;
    ctaResearcher: string;
  };
  sleepCheck: {
    title: string;
    subtitle: string;
    duration: string;
    noAccount: string;
    privacy: string;
    ctaStart: string;
  };
}
