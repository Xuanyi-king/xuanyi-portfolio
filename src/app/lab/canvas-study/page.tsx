import type { Metadata } from "next";
import { CanvasStudy, GalleryStudy } from "@/components/canvas-study";
import { PageIntro } from "@/components/ui";
export const metadata: Metadata = {
  title: "Living Canvas 研究室",
  robots: { index: false, follow: true },
  description: "XUANYI 的曲面材质与空间作品展廊，实际运行的设计研究。",
  alternates: { canonical: "/lab/canvas-study/" },
};
export default function Study() {
  return (
    <div className="container canvas-study-page">
      <PageIntro
        label="LIVING CANVAS / MATERIAL STUDIES"
        title="A form,"
        italic="in motion."
        description="同一条曲线，两种材料。保留静止时的美感，再让它产生生命力。"
      />
      <CanvasStudy />
      <CanvasStudy depth />
      <GalleryStudy />
    </div>
  );
}
