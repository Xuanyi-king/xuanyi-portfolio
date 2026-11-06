"use client";
import { useEffect, useRef } from "react";
import { XMark } from "./x-mark";
import { ribbonPaths, clamp } from "@/motion/geometry";
import { reducedQuery } from "@/motion/tokens";
import { createLivingSpring } from "@/motion/living-spring";
export function LivingX({
  play = false,
  strength = 1,
  form = "rest",
  resetToken = 0,
}: {
  play?: boolean;
  strength?: number;
  form?: string;
  resetToken?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof createLivingSpring> | null>(null);
  useEffect(() => {
    const el = root.current!;
    const media = matchMedia(reducedQuery);
    const paths = [
      el.querySelectorAll<SVGPathElement>('[data-ribbon="a"]'),
      el.querySelectorAll<SVGPathElement>('[data-ribbon="b"]'),
    ];
    const engine = createLivingSpring(
      (values) => {
        const d = ribbonPaths(
          { x: values[0], y: values[1] },
          { x: values[2], y: values[3] },
        );
        paths.forEach((group, i) =>
          group.forEach((p) => p.setAttribute("d", d[i])),
        );
      },
      {
        request: (fn) => requestAnimationFrame(fn),
        cancel: (id) => cancelAnimationFrame(id),
      },
    );
    controller.current = engine;
    const reset = () => engine.release();
    const preference = () => engine.setReduced(media.matches);
    preference();
    const surface = play ? el : (el.closest(".hero") ?? el);
    const hover = (e: Event) => {
      const event = e as PointerEvent;
      if (play || media.matches || event.pointerType === "touch") return;
      const r = surface.getBoundingClientRect();
      const x = clamp((event.clientX - r.left) / r.width - 0.5, -0.5, 0.5) * 70;
      const y = clamp((event.clientY - r.top) / r.height - 0.5, -0.5, 0.5) * 55;
      engine.pull(0, x, y);
      engine.pull(1, -x * 0.8, y * 0.7);
    };
    const cleanups: (() => void)[] = [];
    el.querySelectorAll<HTMLButtonElement>(".x-handle").forEach(
      (button, index) => {
        let pointer: number | null = null,
          startX = 0,
          startY = 0;
        const down = (e: PointerEvent) => {
          pointer = e.pointerId;
          startX = e.clientX;
          startY = e.clientY;
          button.setPointerCapture(pointer);
          button.dataset.dragging = "true";
        };
        const move = (e: PointerEvent) => {
          if (pointer !== e.pointerId) return;
          const r = el.getBoundingClientRect();
          engine.pull(
            index,
            ((e.clientX - startX) / Math.max(r.width, 1)) * 500,
            ((e.clientY - startY) / Math.max(r.height, 1)) * 500,
          );
        };
        const end = () => {
          pointer = null;
          delete button.dataset.dragging;
          engine.release(index);
        };
        const key = (e: KeyboardEvent) => {
          const direction: Record<string, number[]> = {
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
            ArrowUp: [0, -1],
            ArrowDown: [0, 1],
          };
          if (!direction[e.key]) return;
          e.preventDefault();
          engine.pull(
            index,
            direction[e.key][0] * 45,
            direction[e.key][1] * 45,
          );
        };
        button.addEventListener("pointerdown", down);
        button.addEventListener("pointermove", move);
        button.addEventListener("pointerup", end);
        button.addEventListener("pointercancel", end);
        button.addEventListener("lostpointercapture", end);
        button.addEventListener("keydown", key);
        button.addEventListener("keyup", end);
        button.addEventListener("blur", end);
        cleanups.push(() => {
          button.removeEventListener("pointerdown", down);
          button.removeEventListener("pointermove", move);
          button.removeEventListener("pointerup", end);
          button.removeEventListener("pointercancel", end);
          button.removeEventListener("lostpointercapture", end);
          button.removeEventListener("keydown", key);
          button.removeEventListener("keyup", end);
          button.removeEventListener("blur", end);
        });
      },
    );
    surface.addEventListener("pointermove", hover);
    if (!play) surface.addEventListener("pointerleave", reset);
    media.addEventListener("change", preference);
    reset();
    return () => {
      controller.current = null;
      engine.dispose();
      cleanups.forEach((fn) => fn());
      surface.removeEventListener("pointermove", hover);
      surface.removeEventListener("pointerleave", reset);
      media.removeEventListener("change", preference);
    };
  }, [play]);
  useEffect(() => {
    controller.current?.configure({ form, strength });
  }, [form, strength, play]);
  useEffect(() => {
    controller.current?.configure({ form, strength }, true);
  }, [resetToken]);
  return (
    <div ref={root} className={`living-x ${play ? "is-playable" : ""}`}>
      <XMark decorative={!play} />
      {play &&
        [0, 1].map((i) => (
          <button
            key={i}
            className={`x-handle handle-${i}`}
            aria-label={`拖动第${i + 1}条曲线，或使用方向键；松开恢复`}
          >
            <span />
          </button>
        ))}
    </div>
  );
}
