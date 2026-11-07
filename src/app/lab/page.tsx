import type { Metadata } from "next";
import { PageIntro, SectionLabel, TextLink } from "@/components/ui";
import { XPlayground } from "@/components/x-playground";
export const metadata: Metadata = {
  title: "Lab 创意实验室",
  description: "在 X Playground，给好奇心换一个颜色与角度。",
  alternates: { canonical: "/lab/" },
};
export default function Lab() {
  return (
    <div className="container lab-page">
      <PageIntro
        label="A PLACE TO PLAY / 创意实验室"
        title="What"
        italic="if?"
        description="有些想法，值得先玩一玩。这个小实验，让代表探索与创造的 X，回应你的一点点好奇。"
      />
      <XPlayground />
      <div className="lab-explanation">
        <SectionLabel number="001">Two curves, one idea</SectionLabel>
        <div>
          <p>
            两条曲线相互穿过，保留各自的方向，也形成新的形状。这是 XUANYI 的 X
            Mark：探索 × 创造，理性 ×
            感性。这个实验从它的形态出发，试着给平静的符号一点回应。
          </p>
          <TextLink href="/notes/making-xuanyi">读读它的制作手记</TextLink>
          <TextLink href="/lab/canvas-study/">
            Living Canvas：曲面与空间展廊研究
          </TextLink>
          <TextLink href="/brand/x-mark.svg" className="download-mark">
            查看 X Mark SVG
          </TextLink>
        </div>
      </div>
    </div>
  );
}
