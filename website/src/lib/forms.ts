import type { APIContext } from "astro";
import { createHash } from "node:crypto";
import { requestHasTrustedOrigin } from "./session";

const attempts = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 12;
const WINDOW = 60 * 60 * 1000;

function clientKey(context: APIContext): string {
  let address = "unknown";
  try { address = context.clientAddress || "unknown"; } catch { /* adapter may not expose it */ }
  return createHash("sha256").update(address).digest("hex").slice(0, 20);
}

export function allowFormRequest(context: APIContext): Response | null {
  if (!requestHasTrustedOrigin(context.request)) return Response.json({ error: "Untrusted request origin" }, { status: 403 });
  const key = clientKey(context);
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) { attempts.set(key, { count: 1, resetAt: now + WINDOW }); return null; }
  if (current.count >= LIMIT) return Response.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  current.count += 1;
  return null;
}

export async function formBody(request: Request): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 30000) throw new Error("Submission is too large");
  const raw = await request.text();
  if (raw.length > 30000) throw new Error("Submission is too large");
  return JSON.parse(raw) as Record<string, unknown>;
}

export function textField(source: Record<string, unknown>, name: string, max: number, required = false): string {
  const value = String(source[name] ?? "").trim().replace(/\0/g, "");
  if (required && !value) throw new Error(`${name} is required`);
  if (value.length > max) throw new Error(`${name} is too long`);
  return value;
}

export function emailField(source: Record<string, unknown>, name = "email"): string {
  const value = textField(source, name, 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error("Enter a valid email address");
  return value;
}

export function checked(source: Record<string, unknown>, name: string): boolean {
  return source[name] === true;
}
