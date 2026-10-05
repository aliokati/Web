import { createLiveCollection, createLocalizedCollection } from "../content-manager/live-data";
import type { PublishingMetadata } from "../content-manager/types";

export interface BoardMember extends PublishingMetadata {
  slug: string;
  name: string;
  role: string;
  credentials?: string;
  specialty: string;
  institution: string;
  city?: string;
  biography: string;
  education?: string[];
  appointments?: string[];
  researchInterests?: string[];
  selectedPublications?: string[];
  googleScholar?: string;
  orcid?: string;
  pubmed?: string;
  website?: string;
  email?: string;
  phone?: string;
  photo?: string;
  profileConsent?: boolean;
  displayOrder?: number;
  featured?: boolean;
  translations?: { fa?: Partial<Pick<BoardMember, "name" | "role" | "credentials" | "specialty" | "institution" | "city" | "biography" | "education" | "appointments" | "researchInterests" | "selectedPublications">> };
}

export const boardMembers = createLiveCollection<BoardMember>("board");
export const boardMembersFa = createLocalizedCollection<BoardMember>("board", "fa");
