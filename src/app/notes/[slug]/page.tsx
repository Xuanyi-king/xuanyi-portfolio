import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { getNotes, getNote, formatDate } from "@/lib/notes";
import { site } from "@/data/site";
import { BackLink } from "@/components/ui";
export const dynamicParams = false;
export function generateStaticParams() {
  return getNotes().map((n) => ({ slug: n.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.description,
    alternates: { canonical: `/notes/${slug}/` },
    openGraph: {
      type: "article",
      title: n.title,
      description: n.description,
      publishedTime: n.date,
      authors: ["XUANYI"],
      images: [{ url: "/og.png", width: 1200, height: 630, alt: n.title }],
    },
  };
}
export default async function NoteDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: note.title,
    description: note.description,
    datePublished: note.date,
    author: { "@type": "Person", name: "玄屹", url: site.url },
    mainEntityOfPage: `${site.url}/notes/${note.slug}/`,
  };
  return (
    <article className="container">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="article-header">
        <BackLink href="/notes">回到所有手记</BackLink>
        <p className="eyebrow">{note.category} / NOTES ALONG THE WAY</p>
        <h1>{note.title}</h1>
        <p className="article-description">{note.description}</p>
        <div className="article-meta">
          <time dateTime={note.date}>{formatDate(note.date)}</time>
          <span>约 {note.minutes} 分钟阅读</span>
          <span>XUANYI · 玄屹</span>
        </div>
      </header>
      <div className="article-layout">
        <div className="prose">
          <MDXRemote
            source={note.body}
            options={{
              mdxOptions: {
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypePrettyCode,
                    { theme: "github-light", keepBackground: false },
                  ],
                ],
              },
            }}
          />
          <div className="article-end">
            <span>谢谢你，读到这里。</span>
            <BackLink href="/notes">继续看看手记</BackLink>
          </div>
        </div>
        <aside aria-label="文章目录">
          <p>ON THIS PAGE / 目录</p>
          <nav>
            {note.headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={h.depth === 3 ? "nested" : ""}
              >
                {h.text}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </article>
  );
}
