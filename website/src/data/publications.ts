import { createLiveCollection, createLocalizedCollection } from "../content-manager/live-data";
import type { PublishingMetadata } from "../content-manager/types";
export interface Publication extends PublishingMetadata { slug: string; title: string; authors: string; journal: string; year: number; doi?: string; pmid?: string; abstract?: string; url: string; category?: string; translations?: { fa?: Partial<Pick<Publication, "title" | "authors" | "journal" | "category" | "abstract">> } }
export const publications = createLiveCollection<Publication>("publications");
export const publicationsFa = createLocalizedCollection<Publication>("publications", "fa");
