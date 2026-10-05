import { createHash, timingSafeEqual } from "node:crypto";
import type { Role } from "../content-manager/types";
import { serverEnv } from "./env";

interface Credential { username: string; password: string; role: Role }

function safeEqual(left: string, right: string): boolean {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

function credential(prefix: "ADMIN" | "EDITOR" | "VIEWER", role: Role): Credential | null {
  const username = serverEnv(`${prefix}_USERNAME`)?.trim();
  const password = serverEnv(`${prefix}_PASSWORD`);
  return username && password ? { username, password, role } : null;
}

export function authenticate(username: string, password: string): { username: string; role: Role } | null {
  const credentials = [credential("ADMIN", "admin"), credential("EDITOR", "editor"), credential("VIEWER", "viewer")].filter(Boolean) as Credential[];
  for (const item of credentials) {
    if (safeEqual(username, item.username) && safeEqual(password, item.password)) return { username: item.username, role: item.role };
  }
  return null;
}

export function canWrite(role: Role): boolean { return role === "admin" || role === "editor"; }
export function canDelete(role: Role): boolean { return role === "admin"; }
export function isRole(value: unknown): value is Role { return value === "admin" || value === "editor" || value === "viewer"; }

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export function loginAttemptAllowed(key: string): boolean {
  const now = Date.now();
  if (attempts.size > 500) for (const [entry, value] of attempts) if (value.resetAt <= now) attempts.delete(entry);
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) { attempts.set(key, { count: 0, resetAt: now + WINDOW_MS }); return true; }
  return current.count < MAX_ATTEMPTS;
}

export function recordFailedLogin(key: string): void {
  const now = Date.now();
  const current = attempts.get(key);
  attempts.set(key, !current || current.resetAt <= now ? { count: 1, resetAt: now + WINDOW_MS } : { ...current, count: current.count + 1 });
}

export function clearLoginAttempts(key: string): void { attempts.delete(key); }
