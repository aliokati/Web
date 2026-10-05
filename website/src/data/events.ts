import { createLiveCollection, createLocalizedCollection } from "../content-manager/live-data";
import type { PublishingMetadata } from "../content-manager/types";
export interface EventItem extends PublishingMetadata { slug: string; title: string; date: string; endDate?: string; location: string; type: string; description: string; featured?: boolean; registrationOpen?: boolean; registrationMode?: "internal" | "external" | "closed"; registrationUrl?: string; registrationDeadline?: string; capacity?: number; translations?: { fa?: Partial<Pick<EventItem, "title" | "location" | "type" | "description">> } }
export const events = createLiveCollection<EventItem>("events");
export const eventsFa = createLocalizedCollection<EventItem>("events", "fa");
