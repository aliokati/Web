import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, readdir, stat, writeFile, copyFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { getSection } from "./registry";
import { validateItem } from "./validation";
import { serverEnv } from "../lib/env";

export class ContentConflictError extends Error {}
export class ContentValidationError extends Error {
  constructor(public errors: Record<string, string>) { super("Content validation failed"); }
}

const queues = new Map<string, Promise<void>>();
const readCache = new Map<string, { expiresAt: number; items: Record<string, unknown>[] }>();

function contentDirectory(): string {
  return path.resolve(serverEnv("KRISM_CONTENT_DIR") || path.join(process.cwd(), "content"));
}

function sectionPath(sectionId: string): string {
  return path.join(contentDirectory(), getSection(sectionId).fileName);
}

function revisionOf(raw: string): string {
  return `"${createHash("sha256").update(raw).digest("hex").slice(0, 20)}"`;
}

function parseItems(raw: string): Record<string, unknown>[] {
  const value = JSON.parse(raw);
  if (!Array.isArray(value)) throw new Error("Content file must contain an array");
  return value;
}

async function withLock<T>(sectionId: string, operation: () => Promise<T>): Promise<T> {
  const previous = queues.get(sectionId) ?? Promise.resolve();
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  const queued = previous.then(() => gate);
  queues.set(sectionId, queued);
  await previous;
  try { return await operation(); }
  finally { release(); if (queues.get(sectionId) === queued) queues.delete(sectionId); }
}

async function saveAtomic(sectionId: string, items: Record<string, unknown>[]): Promise<string> {
  const file = sectionPath(sectionId);
  const directory = path.dirname(file);
  const history = path.join(directory, ".history");
  await mkdir(directory, { recursive: true });
  await mkdir(history, { recursive: true });
  const raw = `${JSON.stringify(items, null, 2)}\n`;
  const temporary = `${file}.${randomUUID()}.tmp`;
  const previous = `${file}.previous`;
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = path.join(history, `${sectionId}-${timestamp}.json`);
  if (await stat(file).then(() => true).catch(() => false)) await copyFile(file, backup);
  await writeFile(temporary, raw, { encoding: "utf8", mode: 0o600 });

  try {
    await rename(temporary, file);
  } catch {
    await rm(previous, { force: true });
    await rename(file, previous);
    try { await rename(temporary, file); }
    catch (error) { await rename(previous, file); throw error; }
  }

  try {
    await rm(previous, { force: true });
    const backups = (await readdir(history)).filter((name) => name.startsWith(`${sectionId}-`)).sort().reverse();
    await Promise.all(backups.slice(20).map((name) => rm(path.join(history, name), { force: true })));
  } catch {
    // A failed backup cleanup must never invalidate a successful content write.
  }
  readCache.delete(sectionId);
  return revisionOf(raw);
}

export function readSectionSync<T>(sectionId: string): T[] {
  const cached = readCache.get(sectionId);
  if (cached && cached.expiresAt > Date.now()) return cached.items as T[];
  const items = parseItems(readFileSync(sectionPath(sectionId), "utf8"));
  readCache.set(sectionId, { expiresAt: Date.now() + 250, items });
  return items as T[];
}

export class ContentStore {
  getSection = getSection;

  async list(sectionId: string) {
    const raw = await readFile(sectionPath(sectionId), "utf8");
    return { items: parseItems(raw), revision: revisionOf(raw) };
  }

  async get(sectionId: string, itemId: string) {
    const section = getSection(sectionId);
    const { items, revision } = await this.list(sectionId);
    const item = items.find((entry) => String(entry[section.primaryKey]) === itemId);
    return { item, revision };
  }

  async add(sectionId: string, input: unknown, expectedRevision?: string) {
    return withLock(sectionId, async () => {
      const section = getSection(sectionId);
      const current = await this.list(sectionId);
      if (expectedRevision && expectedRevision !== current.revision) throw new ContentConflictError("Content changed since it was loaded");
      const result = validateItem(sectionId, input);
      if (!result.valid) throw new ContentValidationError(result.errors);
      const id = String(result.data[section.primaryKey]);
      if (current.items.some((item) => String(item[section.primaryKey]) === id)) throw new ContentValidationError({ [section.primaryKey]: "This identifier is already in use." });
      const items = [...current.items, result.data];
      const revision = await saveAtomic(sectionId, items);
      return { item: result.data, revision };
    });
  }

  async update(sectionId: string, itemId: string, input: unknown, expectedRevision?: string) {
    return withLock(sectionId, async () => {
      const section = getSection(sectionId);
      const current = await this.list(sectionId);
      if (expectedRevision && expectedRevision !== current.revision) throw new ContentConflictError("Content changed since it was loaded");
      const index = current.items.findIndex((item) => String(item[section.primaryKey]) === itemId);
      if (index < 0) return null;
      const result = validateItem(sectionId, input);
      if (!result.valid) throw new ContentValidationError(result.errors);
      const nextId = String(result.data[section.primaryKey]);
      if (current.items.some((item, itemIndex) => itemIndex !== index && String(item[section.primaryKey]) === nextId)) throw new ContentValidationError({ [section.primaryKey]: "This identifier is already in use." });
      const items = [...current.items];
      items[index] = result.data;
      const revision = await saveAtomic(sectionId, items);
      return { item: result.data, revision };
    });
  }

  async delete(sectionId: string, itemId: string, expectedRevision?: string) {
    return withLock(sectionId, async () => {
      const section = getSection(sectionId);
      const current = await this.list(sectionId);
      if (expectedRevision && expectedRevision !== current.revision) throw new ContentConflictError("Content changed since it was loaded");
      const items = current.items.filter((item) => String(item[section.primaryKey]) !== itemId);
      if (items.length === current.items.length) return null;
      const revision = await saveAtomic(sectionId, items);
      return { revision };
    });
  }
}

export const contentStore = new ContentStore();
