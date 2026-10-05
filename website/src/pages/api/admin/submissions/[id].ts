import type { APIRoute } from "astro";
import { deleteSubmission } from "../../../../lib/submission-store";
import { requestHasTrustedOrigin } from "../../../../lib/session";

export const DELETE: APIRoute = async (context) => {
  if (!requestHasTrustedOrigin(context.request)) return Response.json({ error: "Untrusted request origin" }, { status: 403 });
  if (context.locals.user?.role !== "admin") return Response.json({ error: "Administrator access required" }, { status: 403 });
  try { await deleteSubmission(String(context.params.id)); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "Could not delete submission" }, { status: 400 }); }
};
