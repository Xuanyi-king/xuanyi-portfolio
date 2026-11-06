import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { NoteList } from "@/components/note-list";
import { getNotes } from "@/lib/notes";
export const metadata: Metadata = {
  title: "Notes 手记",
  description: "关于代码、设计与创作过程的真实记录。",
  alternates: { canonical: "/notes/" },
};
export default function Notes() {
  return (
    <div className="container notes-page">
      <PageIntro
        label="NOTES / A FEW THOUGHTS, LEFT HERE"
        title="A space to"
        italic="think"
        description="一些制作过程，一些还在生长的想法。写下来，给思考留下一点形状。"
      />
      <NoteList notes={getNotes()} />
      <p className="notes-footnote">
        从第一篇制作手记开始。更多内容，慢慢来。
        <br />
        也可以通过{" "}
        <a
          href="/rss.xml"
          style={{ textDecoration: "underline", textUnderlineOffset: 4 }}
        >
          RSS 订阅
        </a>{" "}
        之后的更新。
      </p>
    </div>
  );
}
