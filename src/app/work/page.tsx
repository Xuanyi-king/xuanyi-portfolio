import type { Metadata } from "next";
import { PageIntro } from "@/components/ui";
import { WorkExplorer } from "@/components/work-explorer";
export const metadata: Metadata = {
  title: "Work 作品",
  description: "从工具到影像，玄屹公开的项目与实践。",
  alternates: { canonical: "/work/" },
};
export default function Work() {
  return (
    <div className="container work-page">
      <PageIntro
        label="SELECTED PROJECTS / 2026 — ONWARDS"
        title="Ideas, made"
        italic="real"
        description="把想法放到现实里，看看它会长成什么样子。这里是一些已经成形、也还在继续生长的探索。"
      />
      <WorkExplorer />
    </div>
  );
}
