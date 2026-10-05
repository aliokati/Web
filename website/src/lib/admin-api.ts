import type { APIContext } from "astro";
import { canDelete, canWrite } from "./auth";
import { requestHasTrustedOrigin } from "./session";
import { ContentConflictError, ContentValidationError } from "../content-manager/store";
import { getSection } from "../content-manager/registry";

export async function bodyData(request: Request): Promise<Record<string, unknown>> {
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) return await request.json();
  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

export function requireMutation(context: APIContext, action: "write" | "delete"): Response | null {
  if (!requestHasTrustedOrigin(context.request)) return Response.json({ error: "Untrusted request origin" }, { status: 403 });
  const user = context.locals.user;
  if (!user) return Response.json({ error: "Authentication required" }, { status: 401 });
  const allowed = action === "delete" ? canDelete(user.role) : canWrite(user.role);
  return allowed ? null : Response.json({ error: "Your role does not allow this action" }, { status: 403 });
}

export function allowedSection(context: APIContext, sectionId: string) {
  const section = getSection(sectionId);
  if (!context.locals.user || !section.roles.includes(context.locals.user.role)) throw new Error("Forbidden section");
  return section;
}

export function mutationError(error: unknown): Response {
  if (error instanceof ContentValidationError) return Response.json({ error: error.message, fields: error.errors }, { status: 422 });
  if (error instanceof ContentConflictError) return Response.json({ error: error.message }, { status: 409 });
  console.error(error);
  return Response.json({ error: "The content operation could not be completed" }, { status: 500 });
}
