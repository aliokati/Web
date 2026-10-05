import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { serverEnv } from "./env";

export type SubmissionKind = "contact" | "event-registration";
export interface StoredSubmission {
  id: string;
  kind: SubmissionKind;
  createdAt: string;
  status: "new";
  locale: "en" | "fa";
  eventSlug?: string;
  data: Record<string, string | boolean>;
}

function submissionDirectory(): string {
  return path.resolve(serverEnv("KRISM_SUBMISSIONS_DIR") || path.join(process.cwd(), ".private", "submissions"));
}

function safeId(id: string): string {
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error("Invalid submission identifier");
  return id;
}

async function cleanExpired(): Promise<void> {
  const days = Math.max(1, Math.min(3650, Number(serverEnv("FORM_RETENTION_DAYS") || 90)));
  const cutoff = Date.now() - days * 86400000;
  const directory = submissionDirectory();
  const names = await readdir(directory).catch(() => [] as string[]);
  await Promise.all(names.filter((name) => name.endsWith(".json")).map(async (name) => {
    try {
      const raw = await readFile(path.join(directory, name), "utf8");
      const item = JSON.parse(raw) as StoredSubmission;
      if (Date.parse(item.createdAt) < cutoff) await rm(path.join(directory, name), { force: true });
    } catch { /* Ignore malformed files; an administrator can review them manually. */ }
  }));
}

export async function saveSubmission(input: Omit<StoredSubmission, "id" | "createdAt" | "status">): Promise<StoredSubmission> {
  const directory = submissionDirectory();
  await mkdir(directory, { recursive: true });
  const item: StoredSubmission = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), status: "new" };
  await writeFile(path.join(directory, `${item.id}.json`), `${JSON.stringify(item, null, 2)}\n`, { encoding: "utf8", mode: 0o600, flag: "wx" });
  cleanExpired().catch(() => undefined);
  return item;
}

export async function listSubmissions(): Promise<StoredSubmission[]> {
  const directory = submissionDirectory();
  const names = await readdir(directory).catch(() => [] as string[]);
  const records = await Promise.all(names.filter((name) => name.endsWith(".json")).map(async (name) => {
    try { return JSON.parse(await readFile(path.join(directory, name), "utf8")) as StoredSubmission; }
    catch { return null; }
  }));
  return records.filter((item): item is StoredSubmission => Boolean(item)).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteSubmission(id: string): Promise<void> {
  await rm(path.join(submissionDirectory(), `${safeId(id)}.json`), { force: true });
}
