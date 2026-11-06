"use client";
import { useState } from "react";
import { LivingX } from "./living-x";
import { XMark } from "./x-mark";
import { LivingGallery } from "./living-gallery";
import { projects } from "@/data/projects";
export function CanvasStudy() {
  const [form, setForm] = useState("rest");
  return (
    <section className="surface-study" aria-label="同状态曲面材质比较">
      <div className="study-toolbar">
        <span>同一中心线，同一预设。</span>
        <div>
          {[
            ["rest", "静止"],
            ["open", "舒展"],
            ["fold", "收束"],
          ].map(([id, name]) => (
            <button
              key={id}
              aria-pressed={form === id}
              onClick={() => setForm(id)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className="study-pair">
        {(["sculpted", "translucent"] as const).map((material, i) => (
          <div key={material} className="study-specimen">
            <p>
              0{i + 1} /{" "}
              {material === "sculpted" ? "Sculpted Silk" : "Translucent Fold"}
            </p>
            <div className="study-mark">
              <LivingX play material={material} form={form} />
            </div>
            <p>
              {i === 0
                ? "轻柔厚度、明确的前后交错。"
                : "透光薄片，交叉处保留清澈。"}
            </p>
            <div className="study-icons">
              {[16, 24, 32, 64].map((size) => (
                <span key={size}>
                  <span
                    style={{
                      width: size,
                      height: size,
                      display: "inline-flex",
                    }}
                  >
                    <XMark compact material={material} />
                  </span>
                  <small>{size}px</small>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="small-copy">
        两个均为实际
        SVG。可拖动控制点；预设同时作用于两种材质。正式网站只采用最终选定的一种。
      </p>
    </section>
  );
}

export function GalleryStudy() {
  const [count, setCount] = useState(3),
    [rail, setRail] = useState(false);
  return (
    <section className="gallery-study">
      <h2>
        The Living <em>Gallery.</em>
      </h2>
      <p>真实作品的空间研究。正式作品只有这三个。</p>
      <div className="study-toolbar">
        <div>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              aria-pressed={count === n}
              onClick={() => setCount(n)}
            >
              {n} 个项目
            </button>
          ))}
        </div>
        <button aria-pressed={rail} onClick={() => setRail((v) => !v)}>
          比较 X Rail
        </button>
      </div>
      <LivingGallery projects={projects.slice(0, count)} rail={rail} />
    </section>
  );
}
