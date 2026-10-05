import { createLiveCollection, createLocalizedCollection } from "../content-manager/live-data";
import type { PublishingMetadata } from "../content-manager/types";
export interface Organization extends PublishingMetadata { slug: string; name: string; type: string; relationship: string; description: string; website: string; translations?: { fa?: Partial<Pick<Organization, "name" | "type" | "description">> } }
export const organizations = createLiveCollection<Organization>("organizations");
export const organizationsFa = createLocalizedCollection<Organization>("organizations", "fa");
