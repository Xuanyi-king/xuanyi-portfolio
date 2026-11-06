"use client";
import { useEffect, useRef } from "react";
import { XMark } from "./x-mark";
import { ribbonPaths, springStep, clamp } from "@/motion/geometry";
import { reducedQuery, motionTokens } from "@/motion/tokens";
export function LivingX({
  play = false,
  strength = 1,
  form = "rest",
}: {
  play?: boolean;
  strength?: number;
  form?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!;
    const media = matchMedia(reducedQuery);
    const values = [0, 0, 0, 0],
      velocity = [0, 0, 0, 0];
    let target = [0, 0, 0, 0];
    let frame = 0,
      last = 0,
      active = true;
    const paths = [
      el.querySelectorAll<SVGPathElement>('[data-ribbon="a"]'),
      el.querySelectorAll<SVGPathElement>('[data-ribbon="b"]'),
    ];
    const base = () =>
      form === "open"
        ? [30, -35, -30, 35]
        : form === "fold"
          ? [-30, 25, 30, -25]
          : [0, 0, 0, 0];
    const paint = () => {
      const d = ribbonPaths(
        { x: values[0], y: values[1] },
        { x: values[2], y: values[3] },
      );
      paths.forEach((group, i) =>
        group.forEach((p) => p.setAttribute("d", d[i])),
      );
    };
    const tick = (now: number) => {
      frame = 0;
      if (!active) return;
      const dt = last ? (now - last) / 1000 : 1 / 60;
      last = now;
      let moving = false;
      values.forEach((p, i) => {
        const next = springStep(p, velocity[i], target[i], dt);
        values[i] = next.position;
        velocity[i] = next.velocity;
        if (
          Math.abs(values[i] - target[i]) > 0.04 ||
          Math.abs(velocity[i]) > 0.04
        )
          moving = true;
      });
      paint();
      if (moving) frame = requestAnimationFrame(tick);
      else {
        target.forEach((v, i) => (values[i] = v));
        paint();
        last = 0;
      }
    };
    const aim = (next: number[]) => {
      target = next;
      if (media.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        target.forEach((v, i) => {
          values[i] = v;
          velocity[i] = 0;
        });
        paint();
      } else if (!frame) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const reset = () => aim(base());
    const surface = play ? el : (el.closest(".hero") ?? el);
    const hover = (e: Event) => {
      const event = e as PointerEvent;
      if (play || media.matches || event.pointerType === "touch") return;
      const r = surface.getBoundingClientRect();
      const x = clamp((event.clientX - r.left) / r.width - 0.5, -0.5, 0.5) * 70;
      const y = clamp((event.clientY - r.top) / r.height - 0.5, -0.5, 0.5) * 55;
      aim([x, y, -x * 0.8, y * 0.7]);
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
          const next = base();
          next[index * 2] += clamp(
            ((e.clientX - startX) / r.width) * 500 * strength,
            -motionTokens.maxDeformation,
            motionTokens.maxDeformation,
          );
          next[index * 2 + 1] += clamp(
            ((e.clientY - startY) / r.height) * 500 * strength,
            -64,
            64,
          );
          aim(next);
        };
        const end = () => {
          pointer = null;
          delete button.dataset.dragging;
          reset();
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
          const next = base();
          next[index * 2] += direction[e.key][0] * 45 * strength;
          next[index * 2 + 1] += direction[e.key][1] * 45 * strength;
          aim(next);
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
    surface.addEventListener("pointerleave", reset);
    media.addEventListener("change", reset);
    reset();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      cleanups.forEach((fn) => fn());
      surface.removeEventListener("pointermove", hover);
      surface.removeEventListener("pointerleave", reset);
      media.removeEventListener("change", reset);
    };
  }, [play, strength, form]);
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
