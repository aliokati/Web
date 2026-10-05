import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const site = "https://krism-society.com";
const contentDirectory = process.env.KRISM_CONTENT_DIR || path.join(process.cwd(), "content");
const publishedSlugs = (section, locale = "en", include = () => true) => {
  const file = path.join(contentDirectory, `${section}.json`);
  if (!existsSync(file)) return [];
  try { return JSON.parse(readFileSync(file, "utf8")).filter((item) => item.status === "published" && (locale === "en" || item.translationStatus === "published") && include(item)).map((item) => item.slug); }
  catch { return []; }
};

const detailPages = ["board", "events", "research", "awareness"].flatMap((section) => [
  ...publishedSlugs(section, "en").map((slug) => `${site}/${section}/${slug}/`),
  ...publishedSlugs(section, "fa").map((slug) => `${site}/fa/${section}/${slug}/`),
]).concat([
  ...publishedSlugs("resources", "en", (item) => item.internalPage).map((slug) => `${site}/resources/${slug}/`),
  ...publishedSlugs("resources", "fa", (item) => item.internalPage).map((slug) => `${site}/fa/resources/${slug}/`),
]);

export default defineConfig({
  site,
  output: "server",
  adapter: node({ mode: "standalone" }),

  vite: {
    cacheDir: ".cache/vite",
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes("/admin/") && !page.includes("/api/"),
      customPages: detailPages,
    }),
  ],
});
