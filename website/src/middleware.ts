import { defineMiddleware } from "astro:middleware";
import { sessionFromCookies } from "./lib/session";

const publicPaths = new Set(["/admin/login", "/api/admin/login"]);

function applySecurityHeaders(response: Response, admin: boolean): Response {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", admin ? "same-origin" : "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  if (import.meta.env.PROD) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests");
  }
  if (admin) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname.replace(/\/$/, "") || "/";
  const isAdminPage = path.startsWith("/admin");
  const isAdminApi = path.startsWith("/api/admin");
  const isFormApi = path.startsWith("/api/forms/");

  if ((isAdminPage || isAdminApi) && !publicPaths.has(path)) {
    const user = sessionFromCookies(context.cookies);
    if (!user) {
      if (isAdminApi) return applySecurityHeaders(Response.json({ error: "Authentication required" }, { status: 401 }), true);
      return applySecurityHeaders(context.redirect(`/admin/login?next=${encodeURIComponent(path)}`, 303), true);
    }
    context.locals.user = user;
  }

  const response = await next();
  if (isFormApi) response.headers.set("Cache-Control", "no-store, max-age=0");
  return applySecurityHeaders(response, isAdminPage || isAdminApi);
});
