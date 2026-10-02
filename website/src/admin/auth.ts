export type AdminRole = "admin" | "editor" | "viewer";

export interface AdminSession {
  username: string;
  role: AdminRole;
  expiresAt: number;
}

const COOKIE_NAME = "krism_admin_session";

export function getAdminCredentials(): { username?: string; password?: string } {
  return {
    username: import.meta.env.ADMIN_USERNAME,
    password: import.meta.env.ADMIN_PASSWORD,
  };
}

export function loginUser(username: string, password: string): AdminSession | null {
  const { username: expectedUser, password: expectedPassword } = getAdminCredentials();

  if (!expectedUser || !expectedPassword) {
    return null;
  }

  if (username === expectedUser && password === expectedPassword) {
    return {
      username,
      role: "admin",
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
  }

  return null;
}

function encodeSession(session: AdminSession): string {
  return Buffer.from(JSON.stringify(session)).toString("base64");
}

function decodeSession(value: string): AdminSession | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64").toString("utf8"));

    if (!parsed || typeof parsed.username !== "string" || typeof parsed.role !== "string") {
      return null;
    }

    if (parsed.expiresAt && Number(parsed.expiresAt) > Date.now()) {
      return parsed as AdminSession;
    }
  } catch {
    return null;
  }

  return null;
}

export function setSessionCookie(
  cookies: { set: (name: string, value: string, options?: Record<string, unknown>) => void },
  session: AdminSession,
) {
  cookies.set(COOKIE_NAME, encodeSession(session), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(cookies: { delete: (name: string, options?: Record<string, unknown>) => void }) {
  cookies.delete(COOKIE_NAME, { path: "/" });
}

export function getCurrentUser(
  cookies: { get: (name: string) => { value?: string } | undefined },
): AdminSession | null {
  const value = cookies.get(COOKIE_NAME)?.value;

  if (!value) {
    return null;
  }

  return decodeSession(value);
}

export function hasPermission(role: AdminRole, action: "read" | "write" | "delete"): boolean {
  const permissions: Record<AdminRole, Array<"read" | "write" | "delete">> = {
    admin: ["read", "write", "delete"],
    editor: ["read", "write"],
    viewer: ["read"],
  };

  return (permissions[role] ?? []).includes(action);
}
