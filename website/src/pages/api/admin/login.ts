import type { APIRoute } from "astro";
import { authenticate, clearLoginAttempts, loginAttemptAllowed, recordFailedLogin } from "../../../lib/auth";
import { bodyData } from "../../../lib/admin-api";
import { createSessionToken, requestHasTrustedOrigin, setSessionCookie } from "../../../lib/session";
import { serverEnv } from "../../../lib/env";

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!requestHasTrustedOrigin(request)) return Response.json({ error: "Untrusted request origin" }, { status: 403 });
  const body = await bodyData(request);
  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");
  const address = serverEnv("TRUST_PROXY_HEADERS") === "true" ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "proxy" : "direct";
  const key = `${address}:${username.toLowerCase()}`;
  if (!loginAttemptAllowed(key)) return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  const user = authenticate(username, password);
  if (!user) {
    recordFailedLogin(key);
    await new Promise((resolve) => setTimeout(resolve, 350));
    return Response.json({ error: "Invalid username or password" }, { status: 401 });
  }

  try {
    setSessionCookie(cookies, createSessionToken(user.username, user.role));
    clearLoginAttempts(key);
    return Response.json({ ok: true, user });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Admin sessions are not configured" }, { status: 503 });
  }
};
