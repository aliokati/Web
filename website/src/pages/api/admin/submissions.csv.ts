import type { APIRoute } from "astro";
import { listSubmissions } from "../../../lib/submission-store";

function cell(value: unknown): string {
  let text = String(value ?? "").replace(/\r?\n/g, " ");
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export const GET: APIRoute = async (context) => {
  if (context.locals.user?.role !== "admin") return new Response("Administrator access required", { status: 403 });
  const items = await listSubmissions();
  const keys = [...new Set(items.flatMap((item) => Object.keys(item.data)))];
  const rows = [["id","kind","eventSlug","locale","createdAt",...keys], ...items.map((item) => [item.id,item.kind,item.eventSlug ?? "",item.locale,item.createdAt,...keys.map((key) => item.data[key] ?? "")])];
  const csv = rows.map((row) => row.map(cell).join(",")).join("\r\n");
  return new Response(csv, { headers: { "Content-Type":"text/csv; charset=utf-8", "Content-Disposition":`attachment; filename="krism-submissions-${new Date().toISOString().slice(0,10)}.csv"` } });
};
