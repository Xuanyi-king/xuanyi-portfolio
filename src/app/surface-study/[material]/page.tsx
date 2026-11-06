import { Hero } from "@/components/hero";
import { XMark } from "@/components/x-mark";
import { LivingX } from "@/components/living-x";
import type { SilkVariant } from "@/motion/surface";
export function generateStaticParams() {
  return [{ material: "cloud" }, { material: "bias" }];
}
export default async function Study({
  params,
}: {
  params: Promise<{ material: SilkVariant }>;
}) {
  const { material } = await params;
  return (
    <>
      <Hero variant={material} />
      <section className="container surface-study">
        <div className="study-board">
          <h2>
            {material === "cloud" ? "Cloud Silk / 云绸" : "Bias Weave / 斜织"}
          </h2>
          <p>真实 SVG 原型：静态、形变、实色小图标；拖动下方控制点查看曲面。</p>
          <div className="study-marks">
            <XMark variant={material} />
            <XMark
              variant={material}
              pose={[
                { x: 42, y: -25 },
                { x: -30, y: 35 },
              ]}
            />
          </div>
          <div className="study-icons">
            {[16, 24, 32, 64].map((size) => (
              <span key={size}>
                <XMark variant={material} compact className="study-icon" />
                <small>{size}px</small>
                <style>{`.study-icons>span:nth-child(${[16, 24, 32, 64].indexOf(size) + 1}) svg{width:${size}px;height:${size}px}`}</style>
              </span>
            ))}
          </div>
        </div>
        <div
          className="study-play"
          style={{
            width: "min(420px,100%)",
            aspectRatio: "1",
            margin: "40px auto",
          }}
        >
          <LivingX play variant={material} />
        </div>
      </section>
    </>
  );
}
