import { createLiveCollection, createLocalizedCollection } from "../content-manager/live-data";
import type { PublishingMetadata } from "../content-manager/types";
export interface AwarenessArticle extends PublishingMetadata { slug: string; title: string; excerpt: string; content: string[]; category: "Sleep Health" | "Sleep Disorders" | "Healthy Sleep" | string; author?: string; references?: string[]; featured?: boolean; translations?: { fa?: Partial<Pick<AwarenessArticle, "title" | "excerpt" | "content" | "category" | "author">> } }
export const awarenessArticles = createLiveCollection<AwarenessArticle>("awareness");
export const awarenessArticlesFa = createLocalizedCollection<AwarenessArticle>("awareness", "fa");
