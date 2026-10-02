import type { APIRoute } from "astro";
import { getCurrentUser } from "../../../../admin/auth";
import { listSection } from "../../../../admin/store";

export const GET: APIRoute = async ({ cookies, url }) => {
  const user = getCurrentUser(cookies);
  if (!user) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const sectionId = url.searchParams.get("section") ?? "events";
  const result = await listSection(sectionId);

  return new Response(JSON.stringify(result), {
    status: result.success ? 200 : 400,
    headers: { "content-type": "application/json" },
  });
};
