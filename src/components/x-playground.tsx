"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { LivingX } from "./living-x";
export function XPlayground() {
  const [palette, setPalette] = useState("sky");
  const [form, setForm] = useState("rest");
  const [strength, setStrength] = useState(1);
  const [generation, setGeneration] = useState(0);
  return (
    <div className="playground">
      <div className={`playground-stage ${palette}`}>
        <span className="stage-coordinate">
          EXPERIMENT 002 / CURIOSITY IN MOTION
        </span>
        <div className="playground-x">
          <LivingX key={generation} play strength={strength} form={form} />
        </div>
        <p className="stage-help">
          拖动两个小圆点，松开让曲线回到原位。
          <br />
          键盘：聚焦圆点，用方向键轻推。
        </p>
      </div>
      <div className="playground-controls">
        <h2>Shape a little.</h2>
        <p>
          拉近，舒展，再放手。
          <br />
          让好奇心拥有自己的形状。
        </p>
        <div>
          <span className="control-label">给好奇心一种颜色</span>
          <div className="swatches" role="group" aria-label="选择颜色">
            {[
              ["sky", "天空蓝"],
              ["mint", "薄荷绿"],
              ["apricot", "杏子橙"],
            ].map(([v, label]) => (
              <button
                key={v}
                className={v}
                aria-label={label}
                aria-pressed={palette === v}
                onClick={() => setPalette(v)}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="range-label" htmlFor="x-strength">
            轻一点，还是大胆一点？
          </label>
          <input
            id="x-strength"
            type="range"
            min=".3"
            max="1.5"
            step=".1"
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
          />
        </div>
        <div className="shape-presets" role="group" aria-label="选择形态">
          {[
            ["rest", "相遇"],
            ["open", "舒展"],
            ["fold", "回环"],
          ].map(([v, label]) => (
            <button
              key={v}
              aria-pressed={form === v}
              onClick={() => setForm(v)}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className="pill-button"
          onClick={() => {
            setPalette("sky");
            setForm("rest");
            setStrength(1);
            setGeneration((v) => v + 1);
          }}
        >
          重新开始
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
