import type { MetadataRoute } from "next";
import { site, now } from "@/data/site";
import { projects } from "@/data/projects";
import { getNotes } from "@/lib/notes";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...["", "/work", "/notes", "/about", "/lab", "/now"].map((p) => ({
      url: `${site.url}${p}/`,
      lastModified: now.updated,
    })),
    ...projects.map((p) => ({
      url: `${site.url}/work/${p.slug}/`,
      lastModified: now.updated,
    })),
    ...getNotes().map((n) => ({
      url: `${site.url}/notes/${n.slug}/`,
      lastModified: n.date,
    })),
  ];
}
