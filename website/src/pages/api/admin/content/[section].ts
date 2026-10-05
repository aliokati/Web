import type { APIRoute } from "astro";
import { allowedSection, bodyData, mutationError, requireMutation } from "../../../../lib/admin-api";
import { contentStore } from "../../../../content-manager/store";

export const GET: APIRoute = async (context) => {
  try {
    const sectionId = String(context.params.section);
    allowedSection(context, sectionId);
    const result = await contentStore.list(sectionId);
    return Response.json(result, { headers: { ETag: result.revision } });
  } catch { return Response.json({ error: "Content section not found" }, { status: 404 }); }
};

export const POST: APIRoute = async (context) => {
  const denied = requireMutation(context, "write");
  if (denied) return denied;
  try {
    const sectionId = String(context.params.section);
    allowedSection(context, sectionId);
    const body = await bodyData(context.request);
    const result = await contentStore.add(sectionId, body.data ?? body, typeof body.revision === "string" ? body.revision : undefined);
    return Response.json(result, { status: 201, headers: { ETag: result.revision } });
  } catch (error) { return mutationError(error); }
};
