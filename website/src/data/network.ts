import { createLiveCollection, createLocalizedCollection } from "../content-manager/live-data";
import type { PublishingMetadata } from "../content-manager/types";
export interface NetworkMember extends PublishingMetadata { slug: string; name: string; type: "Professional" | "Researcher" | "Organization" | "Institution" | string; credentials?: string; specialty?: string; affiliation?: string; city?: string; languages?: string[]; description: string; website?: string; publicConsent?: boolean; featured?: boolean; translations?: { fa?: Partial<Pick<NetworkMember, "name" | "type" | "credentials" | "specialty" | "affiliation" | "city" | "languages" | "description">> } }
export const networkMembers = createLiveCollection<NetworkMember>("network");
export const networkMembersFa = createLocalizedCollection<NetworkMember>("network", "fa");
