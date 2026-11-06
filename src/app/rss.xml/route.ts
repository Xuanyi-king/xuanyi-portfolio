import { getNotes } from "@/lib/notes";
import { site } from "@/data/site";
export const dynamic = "force-static";
const escape = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
export function GET() {
  const notes = getNotes();
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>XUANYI · 创作手记</title><link>${site.url}</link><description>${escape(site.description)}</description><language>zh-CN</language><atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>${notes.map((n) => `<item><title>${escape(n.title)}</title><link>${site.url}/notes/${n.slug}/</link><guid>${site.url}/notes/${n.slug}/</guid><pubDate>${new Date(n.date).toUTCString()}</pubDate><description>${escape(n.description)}</description><category>${escape(n.category)}</category></item>`).join("")}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  );
}
