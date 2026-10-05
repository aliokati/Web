import type { APIRoute } from "astro";
import { allowFormRequest, checked, emailField, formBody, textField } from "../../../../lib/forms";
import { saveSubmission } from "../../../../lib/submission-store";
import { events } from "../../../../data/events";

export const POST: APIRoute = async (context) => {
  const denied = allowFormRequest(context); if (denied) return denied;
  try {
    const eventSlug = String(context.params.event || "");
    const event = events.find((item) => item.slug === eventSlug);
    if (!event || !event.registrationOpen || (event.registrationMode ?? "internal") !== "internal") return Response.json({ error: "Registration is not available" }, { status: 404 });
    if (event.registrationDeadline && event.registrationDeadline < new Date().toISOString().slice(0,10)) return Response.json({ error: "Registration has closed" }, { status: 410 });
    const body = await formBody(context.request);
    if (textField(body, "website", 200)) return Response.json({ ok: true });
    if (!checked(body, "consent")) return Response.json({ error: "Consent is required" }, { status: 422 });
    const locale = body.locale === "fa" ? "fa" : "en";
    const data = {
      fullName: textField(body, "fullName", 120, true), email: emailField(body), phone: textField(body, "phone", 50),
      institution: textField(body, "institution", 180, true), profession: textField(body, "profession", 120, true), city: textField(body, "city", 120),
      attendanceMode: textField(body, "attendanceMode", 40, true), accessibility: textField(body, "accessibility", 1000), dietary: textField(body, "dietary", 500), consent: true,
    };
    const saved = await saveSubmission({ kind: "event-registration", eventSlug, locale, data });
    return Response.json({ ok: true, reference: saved.id.slice(0, 8) }, { status: 201 });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Could not submit the registration" }, { status: 422 }); }
};
