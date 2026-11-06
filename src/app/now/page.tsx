import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { now } from "@/data/site";
export const metadata: Metadata = {
  title: "Now 近况",
  description: "玄屹这个小角落近期的制作与探索。",
  alternates: { canonical: "/now/" },
};
export default function Now() {
  return (
    <div className="container now-page">
      <PageIntro
        label="A QUIET UPDATE / 此时此刻"
        title="Right"
        italic="now"
        description="不必是大事。只是给正在进行的小事，留下一点记录。"
      />
      <p className="now-updated">
        <span className="status-dot" />
        最近整理于{" "}
        <time dateTime={now.updated}>{now.updated.replaceAll("-", ".")}</time>
      </p>
      {now.items.map((item) => (
        <section key={item.label} className="now-item reveal">
          <p className="eyebrow">{item.label}</p>
          <div>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </div>
        </section>
      ))}
      <p className="now-colophon">
        这里记录当前网站能确认的制作近况。
        <br />
        生活与学习的新章节，会在有真实内容时再补上。
      </p>
    </div>
  );
}
