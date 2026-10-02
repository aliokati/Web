import type { APIRoute } from "astro";
import { getAdminCredentials, setSessionCookie } from "../../../admin/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const expected = getAdminCredentials();

  if (!expected.username || !expected.password) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/admin/login?error=Admin+credentials+not+configured" },
    });
  }

  if (username !== expected.username || password !== expected.password) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/admin/login?error=Invalid+username+or+password" },
    });
  }

  setSessionCookie(cookies, {
    username,
    role: "admin",
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return new Response(null, {
    status: 302,
    headers: { Location: "/admin/content-manager" },
  });
};
