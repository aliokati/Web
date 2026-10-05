import { createLiveCollection, createLocalizedCollection } from "../content-manager/live-data";
import type { PublishingMetadata } from "../content-manager/types";

export type ResourceGraphic = "deprivation" | "body-clock" | "health-effects" | "duration" | "habits" | "diary" | "healthy-need";

export interface ResourceItem extends PublishingMetadata {
  slug: string;
  title: string;
  category: "Sleep deprivation" | "Sleep health" | "Guideline" | "Educational" | "Clinical" | "Research" | "Public" | "External" | string;
  description: string;
  audience?: string;
  source?: string;
  url: string;
  featured?: boolean;
  internalPage?: boolean;
  graphic?: ResourceGraphic;
  readTime?: string;
  content?: string[];
  takeaways?: string[];
  practicalSteps?: string[];
  warningSigns?: string[];
  relatedSlugs?: string[];
  downloadUrl?: string;
  translations?: {
    fa?: Partial<Pick<ResourceItem, "title" | "category" | "description" | "source" | "readTime" | "content" | "takeaways" | "practicalSteps" | "warningSigns">>;
  };
}
export const resources = createLiveCollection<ResourceItem>("resources");
export const resourcesFa = createLocalizedCollection<ResourceItem>("resources", "fa");
