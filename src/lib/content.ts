import {unstable_noStore as noStore} from 'next/cache';
import {readSnapshot} from './cms-store';
import {seedCollections} from './content-seed';
import {isCollection, localize} from './content-model';
export type {RecordData} from './content-model';
export {localize} from './content-model';
import {sectionLabels as labels} from './content-model';
export const sectionLabels: Record<string, [string, string]> = labels;
// Kept for collection routing; public records are always read from persistent storage.
export const collections = seedCollections;
export function getRecords(collection: string, locale: string) {
  noStore();
  if (!isCollection(collection)) return [];
  return readSnapshot().collections[collection].filter(record => !record.status || record.status === 'published')
    .map(record => localize(record, locale));
}
