import type { APIRoute } from "astro";
import { SECTIONS } from "../../../content-manager/registry";

export const GET: APIRoute = ({ locals }) => {
  const role = locals.user?.role;
  const sections = Object.values(SECTIONS).filter((section) => role && section.roles.includes(role));
  return Response.json({ sections, user: locals.user && { username: locals.user.username, role: locals.user.role } });
};
