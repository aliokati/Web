export const collectionNames = ['resources', 'awareness', 'board', 'research', 'publications', 'events', 'network', 'organizations'] as const;
export type CollectionName = typeof collectionNames[number];
export interface RecordData {
  slug: string; title?: string; name?: string; category?: string; description?: string;
  excerpt?: string; content?: string[]; takeaways?: string[]; practicalSteps?: string[];
  warningSigns?: string[]; relatedSlugs?: string[]; readTime?: string; reviewedAt?: string;
  url?: string; source?: string; downloadUrl?: string; graphic?: string; role?: string;
  specialty?: string; institution?: string; biography?: string; photo?: string;
  education?: string[]; appointments?: string[]; researchInterests?: string[];
  selectedPublications?: string[]; googleScholar?: string; orcid?: string; pubmed?: string;
  status?: string; publishedAt?: string; updatedAt?: string; audience?: string;
  internalPage?: boolean; profileConsent?: boolean; displayOrder?: number; featured?: boolean;
  translationStatus?: string; translations?: {fa?: Partial<RecordData>};
}
export const sectionLabels: Record<CollectionName, [string, string]> = {
  resources: ['Learning resources', 'منابع آموزشی'], awareness: ['Sleep health', 'سلامت خواب'],
  board: ['Research board', 'شورای پژوهشی'], research: ['Research', 'پژوهش'],
  publications: ['Publications', 'انتشارات'], events: ['Events', 'رویدادها'],
  network: ['Professional network', 'شبکه حرفه‌ای'], organizations: ['Organizations', 'سازمان‌ها'],
};
export const isCollection = (name: unknown): name is CollectionName => typeof name === 'string' && (collectionNames as readonly string[]).includes(name);
export const localize = (record: RecordData, locale: string): RecordData => locale === 'fa' && record.translationStatus === 'published' ? {...record, ...record.translations?.fa, slug: record.slug} : record;
export const normalizeSearch = (value: string) => value.toLowerCase().replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\u200c\u200d]/g, ' ').trim();
export const graphicOptions = ['deprivation', 'health-effects', 'habits', 'healthy-need', 'body-clock', 'duration', 'diary'];
export interface HistoryEntry {id: string; at: string; action: 'publish' | 'delete' | 'restore'; collection: CollectionName; slug: string; title: string; before: RecordData | null; after: RecordData | null}
export interface ContentSnapshot {schema: 1; revision: number; updatedAt: string | null; collections: Record<CollectionName, RecordData[]>; history: HistoryEntry[]}
