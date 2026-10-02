import type { APIRoute } from "astro";
import { clearSessionCookie, getCurrentUser } from "../../../../admin/auth";

export const POST: APIRoute = async ({ cookies }) => {
  const currentUser = getCurrentUser(cookies);

  if (currentUser) {
    clearSessionCookie(cookies);
  }

  return new Response(null, {
    status: 302,
    headers: { Location: "/admin/login" },
  });
};
