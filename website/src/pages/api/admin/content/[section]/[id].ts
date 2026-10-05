import type { APIRoute } from "astro";
import { allowedSection, bodyData, mutationError, requireMutation } from "../../../../../lib/admin-api";
import { contentStore } from "../../../../../content-manager/store";

export const GET: APIRoute = async (context) => {
  try {
    const sectionId = String(context.params.section);
    allowedSection(context, sectionId);
    const result = await contentStore.get(sectionId, String(context.params.id));
    if (!result.item) return Response.json({ error: "Item not found" }, { status: 404 });
    return Response.json(result, { headers: { ETag: result.revision } });
  } catch { return Response.json({ error: "Content item not found" }, { status: 404 }); }
};

export const PUT: APIRoute = async (context) => {
  const denied = requireMutation(context, "write");
  if (denied) return denied;
  try {
    const sectionId = String(context.params.section);
    allowedSection(context, sectionId);
    const body = await bodyData(context.request);
    const result = await contentStore.update(sectionId, String(context.params.id), body.data ?? body, typeof body.revision === "string" ? body.revision : undefined);
    if (!result) return Response.json({ error: "Item not found" }, { status: 404 });
    return Response.json(result, { headers: { ETag: result.revision } });
  } catch (error) { return mutationError(error); }
};

export const DELETE: APIRoute = async (context) => {
  const denied = requireMutation(context, "delete");
  if (denied) return denied;
  try {
    const sectionId = String(context.params.section);
    allowedSection(context, sectionId);
    const body: Record<string, unknown> = await bodyData(context.request).catch(() => ({}));
    const result = await contentStore.delete(sectionId, String(context.params.id), typeof body.revision === "string" ? body.revision : undefined);
    if (!result) return Response.json({ error: "Item not found" }, { status: 404 });
    return Response.json({ ok: true, ...result }, { headers: { ETag: result.revision } });
  } catch (error) { return mutationError(error); }
};
