import type { APIRoute } from "astro";
import { allowFormRequest, checked, emailField, formBody, textField } from "../../../lib/forms";
import { saveSubmission } from "../../../lib/submission-store";

export const POST: APIRoute = async (context) => {
  const denied = allowFormRequest(context); if (denied) return denied;
  try {
    const body = await formBody(context.request);
    if (textField(body, "website", 200)) return Response.json({ ok: true });
    if (!checked(body, "consent")) return Response.json({ error: "Consent is required" }, { status: 422 });
    const locale = body.locale === "fa" ? "fa" : "en";
    const data = {
      name: textField(body, "name", 120, true), email: emailField(body), organization: textField(body, "organization", 160),
      role: textField(body, "role", 120), subject: textField(body, "subject", 160, true), message: textField(body, "message", 5000, true), consent: true,
    };
    const saved = await saveSubmission({ kind: "contact", locale, data });
    return Response.json({ ok: true, reference: saved.id.slice(0, 8) }, { status: 201 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Could not submit the form" }, { status: 422 }); }
};
