import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {seedCollections} from './content-seed';
import {type ContentSnapshot, type CollectionName, type RecordData, isCollection} from './content-model';
import {CmsError, validateRecord, validSlug} from './cms-validation';

export const dataDirectory = () => path.resolve(process.env.KRISM_CMS_DATA_DIR || path.join(process.cwd(), 'data', 'cms'));
const filePath = () => path.join(dataDirectory(), 'content.json');
export function readSnapshot(): ContentSnapshot {
  try {
    const data = JSON.parse(fs.readFileSync(filePath(), 'utf8')) as ContentSnapshot;
    if (data.schema !== 1 || !Number.isSafeInteger(data.revision) || !data.collections || !Array.isArray(data.history)) throw new Error('Invalid content store');
    return data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw new CmsError('storage_unavailable', 503);
    return {schema: 1, revision: 0, updatedAt: null, collections: structuredClone(seedCollections), history: []};
  }
}
export async function atomicWrite(filename: string, data: unknown) {
  await fs.promises.mkdir(path.dirname(filename), {recursive: true, mode: 0o700});
  const temporary = filename + '.' + randomUUID() + '.tmp';
  try {
    const handle = await fs.promises.open(temporary, 'wx', 0o600);
    try {await handle.writeFile(JSON.stringify(data, null, 2) + '\n'); await handle.sync();} finally {await handle.close();}
    await fs.promises.rename(temporary, filename);
  } finally {await fs.promises.unlink(temporary).catch(() => {});}
}
export async function withStoreLock<T>(action: () => Promise<T>): Promise<T> {
  await fs.promises.mkdir(dataDirectory(), {recursive: true, mode: 0o700});
  const lock = path.join(dataDirectory(), 'write.lock');
  let handle;
  try {handle = await fs.promises.open(lock, 'wx', 0o600);} catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EEXIST') throw new CmsError('busy', 409);
    throw error;
  }
  try {return await action();} finally {await handle.close(); await fs.promises.unlink(lock);}
}
export async function mutateContent(input: Record<string, unknown>): Promise<ContentSnapshot> {
  return withStoreLock(async () => {
    const snapshot = readSnapshot();
    if (!Number.isSafeInteger(input.revision) || input.revision !== snapshot.revision) throw new CmsError('conflict', 409);
    if (!isCollection(input.collection)) throw new CmsError('invalid_collection');
    const collection: CollectionName = input.collection;
    const items = snapshot.collections[collection];
    let slug: string, before: RecordData | null, after: RecordData | null;
    if (input.action === 'publish') {
      after = validateRecord(input.record);
      slug = after.slug;
      if (input.originalSlug !== null && !validSlug(input.originalSlug)) throw new CmsError('invalid_slug');
      if (input.originalSlug && input.originalSlug !== slug) throw new CmsError('slug_locked');
      const index = items.findIndex(item => item.slug === slug);
      if (input.originalSlug === null && index >= 0) throw new CmsError('duplicate_slug', 409);
      if (input.originalSlug && index < 0) throw new CmsError('not_found', 404);
      before = index >= 0 ? items[index] : null;
      after.publishedAt = before?.publishedAt || new Date().toISOString().slice(0, 10);
      after.updatedAt = new Date().toISOString();
      if (index >= 0) items[index] = after; else items.push(after);
    } else if (input.action === 'delete') {
      if (!validSlug(input.slug)) throw new CmsError('invalid_slug');
      slug = input.slug;
      const index = items.findIndex(item => item.slug === slug);
      if (index < 0) throw new CmsError('not_found', 404);
      before = items[index]; after = null; items.splice(index, 1);
    } else if (input.action === 'restore') {
      const entry = snapshot.history.find(item => item.id === input.historyId && item.collection === collection);
      if (!entry) throw new CmsError('not_found', 404);
      slug = entry.slug;
      const index = items.findIndex(item => item.slug === slug);
      before = index >= 0 ? items[index] : null;
      // Restore the version before the selected change. This can also undo a new publication.
      after = entry.before ? {...entry.before, updatedAt: new Date().toISOString()} : null;
      if (index >= 0) {if (after) items[index] = after; else items.splice(index, 1);} else if (after) items.push(after);
    } else throw new CmsError('invalid_action');
    snapshot.revision += 1;
    snapshot.updatedAt = new Date().toISOString();
    snapshot.history.unshift({id: randomUUID(), at: snapshot.updatedAt, action: input.action as 'publish' | 'delete' | 'restore', collection, slug, title: after?.title || after?.name || before?.title || before?.name || slug, before, after});
    snapshot.history = snapshot.history.slice(0, 100);
    // The previous snapshot is retained independently of the current file.
    await atomicWrite(path.join(dataDirectory(), 'content.previous.json'), readSnapshot());
    await atomicWrite(filePath(), snapshot);
    return snapshot;
  });
}
