import type { APIRoute } from "astro";
import { clearSessionCookie, requestHasTrustedOrigin } from "../../../lib/session";

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!requestHasTrustedOrigin(request)) return Response.json({ error: "Untrusted request origin" }, { status: 403 });
  clearSessionCookie(cookies);
  return Response.json({ ok: true });
};
