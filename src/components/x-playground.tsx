"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RotateCcw } from "lucide-react";
import { XMark } from "./x-mark";
export function XPlayground() {
  const [palette, setPalette] = useState("sky");
  const [angle, setAngle] = useState(-7);
  const [breathe, setBreathe] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pointer = useRef<HTMLDivElement>(null);
  const ambient = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (breathe && !reduced)
        gsap.to(ambient.current, {
          y: -12,
          scale: 1.025,
          duration: 2.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      else gsap.set(ambient.current, { y: 0, scale: 1 });
    });
    return () => ctx.revert();
  }, [breathe, reduced]);
  useEffect(() => {
    const tween = gsap.to(pointer.current, {
      rotation: angle,
      duration: reduced ? 0 : 0.8,
      ease: "power3.out",
    });
    return () => {
      tween.kill();
    };
  }, [angle, reduced]);
  useEffect(() => {
    const target = pointer.current;
    return () => {
      if (target) gsap.killTweensOf(target);
    };
  }, []);
  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    gsap.to(pointer.current, {
      x: ((e.clientX - r.left) / r.width - 0.5) * 35,
      y: ((e.clientY - r.top) / r.height - 0.5) * 28,
      rotationY: ((e.clientX - r.left) / r.width - 0.5) * 12,
      duration: 0.7,
      overwrite: "auto",
      ease: "power3.out",
    });
  };
  const leave = () => {
    gsap.to(pointer.current, {
      x: 0,
      y: 0,
      rotationY: 0,
      duration: reduced ? 0 : 1,
      overwrite: "auto",
      ease: "power3.out",
    });
  };
  const reset = () => {
    setPalette("sky");
    setAngle(-7);
    setBreathe(false);
    leave();
  };
  return (
    <div className="playground">
      <div
        className={`playground-stage ${palette}`}
        onPointerMove={move}
        onPointerLeave={leave}
      >
        <span className="stage-coordinate">
          EXPERIMENT 001 / EXPLORATION × CREATION
        </span>
        <div className="playground-x" ref={pointer}>
          <div ref={ambient}>
            <XMark decorative={false} />
          </div>
        </div>
        <svg className="stage-star" viewBox="0 0 100 100" aria-hidden="true">
          <path
            d="M50 0c0 35-15 50-50 50 35 0 50 15 50 50 0-35 15-50 50-50-35 0-50-15-50-50Z"
            fill="currentColor"
          />
        </svg>
        <p className="stage-help">
          两条曲线，无限可能。
          <br />
          {reduced
            ? "已遵循系统的减少动态效果设置。"
            : "移动鼠标，或用右侧控件改变它。"}
        </p>
      </div>
      <div className="playground-controls">
        <h2>
          X Playground<span className="apricot-dot">.</span>
        </h2>
        <p>
          没有标准答案。
          <br />
          换个颜色，转个角度，看看会发生什么。
        </p>
        <div>
          <span className="control-label">给好奇心一种颜色</span>
          <div className="swatches" role="group" aria-label="选择 X 的颜色">
            {[
              ["sky", "天空蓝"],
              ["mint", "薄荷绿"],
              ["apricot", "杏子橙"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={value}
                aria-label={label}
                aria-pressed={palette === value}
                onClick={() => setPalette(value)}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="range-label" htmlFor="x-angle">
            换一个角度 <output>{angle}°</output>
          </label>
          <input
            id="x-angle"
            type="range"
            min="-45"
            max="45"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
        </div>
        <div className="control-toggle">
          <span>一点呼吸感{reduced ? "（系统已关闭）" : ""}</span>
          <button
            className="toggle-button"
            type="button"
            aria-label="启用或关闭呼吸动画"
            aria-pressed={breathe && !reduced}
            disabled={reduced}
            onClick={() => setBreathe((v) => !v)}
          >
            <span />
          </button>
        </div>
        <button type="button" className="pill-button" onClick={reset}>
          重新开始
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
