import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { AstroCookies } from "astro";
import { isRole } from "./auth";
import type { Role, SessionUser } from "../content-manager/types";
import { serverEnv } from "./env";

export const SESSION_COOKIE = "krism_admin_session";
const MAX_AGE_SECONDS = 8 * 60 * 60;

function secret(): string {
  const value = serverEnv("SESSION_SECRET");
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters");
  return value;
}

function signature(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(username: string, role: Role): string {
  const issuedAt = Date.now();
  const session: SessionUser = { username, role, issuedAt, expiresAt: issuedAt + MAX_AGE_SECONDS * 1000, nonce: randomBytes(16).toString("base64url") };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function validateSessionToken(token: string | undefined): SessionUser | null {
  if (!token) return null;
  try {
    const [payload, supplied] = token.split(".");
    if (!payload || !supplied) return null;
    const expected = signature(payload);
    const a = Buffer.from(supplied);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<SessionUser>;
    if (!session.username || !isRole(session.role) || !session.expiresAt || session.expiresAt <= Date.now()) return null;
    return session as SessionUser;
  } catch { return null; }
}

export function sessionFromCookies(cookies: AstroCookies): SessionUser | null {
  return validateSessionToken(cookies.get(SESSION_COOKIE)?.value);
}

export function setSessionCookie(cookies: AstroCookies, token: string): void {
  cookies.set(SESSION_COOKIE, token, { httpOnly: true, secure: import.meta.env.PROD, sameSite: "strict", path: "/", maxAge: MAX_AGE_SECONDS });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE, { path: "/" });
}

export function requestHasTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; }
  catch { return false; }
}
