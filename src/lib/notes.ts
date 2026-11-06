import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { extractHeadings, readingMinutes, validSlug } from "./content-utils";
const directory = path.join(process.cwd(), "src/content/notes");
export type Note = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  body: string;
  minutes: number;
  headings: ReturnType<typeof extractHeadings>;
};
export function getNote(slug: string): Note | undefined {
  if (!validSlug(slug)) return;
  const file = path.join(directory, `${slug}.mdx`);
  if (!fs.existsSync(file)) return;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  for (const key of ["title", "description", "date", "category"])
    if (typeof data[key] !== "string")
      throw new Error(`Missing ${key} in ${slug}`);
  if (Number.isNaN(Date.parse(data.date)))
    throw new Error(`Invalid date in ${slug}`);
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    category: data.category,
    body: content,
    minutes: readingMinutes(content),
    headings: extractHeadings(content),
  };
}
export function getNotes(): Note[] {
  return fs
    .readdirSync(directory)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => getNote(f.slice(0, -4))!)
    .sort((a, b) => b.date.localeCompare(a.date));
}
export function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
