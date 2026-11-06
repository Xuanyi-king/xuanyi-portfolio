import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

// Use the same HAST heading text and rehype-slug plugin as the MDX renderer.
// This preserves Markdown link text, underscores and collision handling.
export function extractHeadings(source: string) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug);
  const tree = processor.runSync(processor.parse(source));
  const headings: { depth: number; text: string; id: string }[] = [];
  visit(tree, "element", (node) => {
    if (node.tagName === "h2" || node.tagName === "h3")
      headings.push({
        depth: Number(node.tagName.slice(1)),
        text: toString(node),
        id: String(node.properties.id),
      });
  });
  return headings;
}
export function readingMinutes(source: string) {
  const chinese = (source.match(/[\p{Script=Han}]/gu) ?? []).length;
  const words = (
    source.replace(/[\p{Script=Han}]/gu, " ").match(/[\p{L}\p{N}]+/gu) ?? []
  ).length;
  return Math.max(1, Math.ceil(chinese / 400 + words / 220));
}
export function validSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
