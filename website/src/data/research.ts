import { createLiveCollection, createLocalizedCollection } from "../content-manager/live-data";
import type { PublishingMetadata } from "../content-manager/types";
export interface ResearchItem extends PublishingMetadata { slug: string; title: string; description: string; location?: string; date?: string; type: string; statusLabel?: string; leadInvestigators?: string[]; collaborators?: string[]; funding?: string; ethicsReference?: string; projectUrl?: string; featured?: boolean; translations?: { fa?: Partial<Pick<ResearchItem, "title" | "description" | "location" | "type" | "leadInvestigators" | "collaborators" | "funding">> } }
export const researchProjects = createLiveCollection<ResearchItem>("research");
export const researchProjectsFa = createLocalizedCollection<ResearchItem>("research", "fa");
