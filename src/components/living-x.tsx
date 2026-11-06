"use client";
import { useEffect, useRef } from "react";
import { XMark } from "./x-mark";
import {
  ribbonGeometry,
  anchorInfluence,
  clamp,
  type Point,
} from "@/motion/geometry";
import { reducedQuery } from "@/motion/tokens";
import { createLivingSpring } from "@/motion/living-spring";
import { createCurveOwner } from "@/motion/curve-owner";
import { threadPath } from "@/motion/thread";
import { silkSurface } from "@/motion/surface";
import { playIdentityIntro } from "@/motion/identity-intro";
const rest = ribbonGeometry({ x: 0, y: 0 }, { x: 0, y: 0 });
export function LivingX({
  play = false,
  strength = 1,
  form = "rest",
  resetToken = 0,
  material = "sculpted",
}: {
  play?: boolean;
  strength?: number;
  form?: string;
  resetToken?: number;
  material?: "sculpted" | "translucent";
}) {
  const root = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof createLivingSpring> | null>(null);
  const cancelInteractions = useRef<() => void>(() => {});
  useEffect(() => {
    const el = root.current!,
      svg = el.querySelector("svg")!,
      media = matchMedia(reducedQuery);
    const buttons = [...el.querySelectorAll<HTMLButtonElement>(".x-handle")];
    const paths = ["a", "b"].map((name) =>
      el.querySelectorAll<SVGPathElement>(`[data-ribbon="${name}"]`),
    );
    const hero = play ? null : el.closest<HTMLElement>(".hero");
    const returning = () =>
      !!hero?.hasAttribute("data-returning") ||
      document.documentElement.hasAttribute("data-xuanyi-returning");
    const entering =
      !!hero &&
      !media.matches &&
      !returning() &&
      scrollY < 80 &&
      document.visibilityState === "visible";
    el.dataset.curveOwner = entering
      ? "intro"
      : media.matches
        ? "static"
        : "spring";
    const threads = play
      ? []
      : [
          ...(el
            .closest(".hero")
            ?.querySelectorAll<SVGPathElement>("[data-thread]") ?? []),
        ];
    const surfaceKeys = [
      "outline",
      "face",
      "edge",
      "sheen",
      "highlight",
    ] as const;
    const surfaceNodes = ["a", "b"].map((name) =>
      surfaceKeys.map((key) => ({
        key,
        nodes: el.querySelectorAll<SVGPathElement>(
          `[data-surface="${name}-${key}"]`,
        ),
      })),
    );
    const lights =
      svg.querySelectorAll<SVGLinearGradientElement>("[data-light]");
    const render = (values: readonly number[]) => {
      const geometry = ribbonGeometry(
        { x: values[0], y: values[1] },
        { x: values[2], y: values[3] },
      );
      paths.forEach((group, i) =>
        group.forEach((p) => p.setAttribute("d", geometry.paths[i])),
      );
      buttons.forEach((button, i) => {
        const anchor = geometry.anchors[i];
        button.style.left = `${anchor.x / 5}%`;
        button.style.top = `${anchor.y / 5}%`;
      });
      geometry.curves.forEach((curve, i) => {
        const s = silkSurface(curve, i);
        surfaceNodes[i].forEach(({ key, nodes }) =>
          nodes.forEach((path) => path.setAttribute("d", s[key])),
        );
      });
      const light = clamp((values[0] - values[2]) * 0.1, -8, 8);
      lights.forEach((gradient) =>
        gradient.setAttribute("gradientTransform", `rotate(${light} 250 250)`),
      );
      threads.forEach((path) =>
        path.setAttribute(
          "d",
          threadPath(path.dataset.thread === "mobile", values),
        ),
      );
    };
    const owner = createCurveOwner(entering, render);
    const engine = createLivingSpring(owner.paint, {
      request: (fn) => requestAnimationFrame(fn),
      cancel: (id) => cancelAnimationFrame(id),
    });
    controller.current = engine;
    let disposed = false;
    let intro: ReturnType<typeof playIdentityIntro> | undefined;
    const complete = () => {
      if (disposed) return;
      el.dataset.curveOwner = media.matches ? "static" : "spring";
      owner.complete();
    };
    const preference = () => {
      if (media.matches) {
        // Discard an early pointer before the static preference settles immediately.
        owner.input(() => engine.release());
        intro?.cancel(true);
        complete();
        engine.release();
      } else if (el.dataset.curveOwner === "static")
        el.dataset.curveOwner = "spring";
      engine.setReduced(media.matches);
    };
    if (entering)
      intro = playIdentityIntro(
        render,
        complete,
        {
          request: (fn) => requestAnimationFrame(fn),
          cancel: (id) => cancelAnimationFrame(id),
        },
        () =>
          !disposed &&
          !returning() &&
          !media.matches &&
          document.visibilityState === "visible",
      );
    preference();
    const surface = play ? el : (el.closest(".hero") ?? el);
    const hover = (event: Event) => {
      const e = event as PointerEvent;
      if (play || media.matches || e.pointerType === "touch") return;
      const r = surface.getBoundingClientRect();
      const x = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5) * 70,
        y = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5) * 55;
      owner.input(() => {
        engine.pull(0, x, y);
        engine.pull(1, -x * 0.8, y * 0.7);
      });
    };
    const reset = () => owner.input(() => engine.release());
    const cleanups: (() => void)[] = [],
      cancels: (() => void)[] = [];
    const local = (e: PointerEvent): Point | null => {
      const matrix = svg.getScreenCTM();
      if (!matrix) return null;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
        matrix.inverse(),
      );
      return { x: p.x, y: p.y };
    };
    buttons.forEach((button, index) => {
      let pointer: number | null = null,
        offset: Point = { x: 0, y: 0 };
      const end = () => {
        const id = pointer;
        pointer = null;
        delete button.dataset.dragging;
        if (id !== null && button.hasPointerCapture(id))
          button.releasePointerCapture(id);
        engine.release(index);
      };
      const down = (e: PointerEvent) => {
        if (pointer !== null || e.button !== 0) return;
        const p = local(e);
        if (!p) return;
        const values = engine.read();
        const anchor = ribbonGeometry(
          { x: values[0], y: values[1] },
          { x: values[2], y: values[3] },
        ).anchors[index];
        offset = { x: p.x - anchor.x, y: p.y - anchor.y };
        pointer = e.pointerId;
        button.setPointerCapture(pointer);
        engine.grab(index);
        button.dataset.dragging = "true";
        e.preventDefault();
        button.focus({ preventScroll: true });
      };
      const move = (e: PointerEvent) => {
        if (pointer !== e.pointerId) return;
        const p = local(e);
        if (!p) return;
        const base = rest.anchors[index],
          influence = anchorInfluence(index);
        engine.drag(
          index,
          (p.x - offset.x - base.x) / influence,
          (p.y - offset.y - base.y) / influence,
        );
      };
      const up = (e: PointerEvent) => {
        if (pointer === e.pointerId) end();
      };
      const key = (e: KeyboardEvent) => {
        const directions: Record<string, Point> = {
          ArrowLeft: { x: -1, y: 0 },
          ArrowRight: { x: 1, y: 0 },
          ArrowUp: { x: 0, y: -1 },
          ArrowDown: { x: 0, y: 1 },
        };
        if (e.key === "Escape") {
          e.preventDefault();
          end();
          return;
        }
        const d = directions[e.key];
        if (!d || pointer !== null) return;
        e.preventDefault();
        engine.nudge(
          index,
          d.x * (e.shiftKey ? 4 : 10),
          d.y * (e.shiftKey ? 4 : 10),
        );
      };
      button.addEventListener("pointerdown", down);
      button.addEventListener("pointermove", move);
      button.addEventListener("pointerup", up);
      button.addEventListener("pointercancel", up);
      button.addEventListener("lostpointercapture", up);
      button.addEventListener("keydown", key);
      button.addEventListener("blur", end);
      cancels.push(end);
      cleanups.push(() => {
        end();
        button.removeEventListener("pointerdown", down);
        button.removeEventListener("pointermove", move);
        button.removeEventListener("pointerup", up);
        button.removeEventListener("pointercancel", up);
        button.removeEventListener("lostpointercapture", up);
        button.removeEventListener("keydown", key);
        button.removeEventListener("blur", end);
      });
    });
    cancelInteractions.current = () => cancels.forEach((fn) => fn());
    surface.addEventListener("pointermove", hover);
    if (!play) surface.addEventListener("pointerleave", reset);
    media.addEventListener("change", preference);
    return () => {
      disposed = true;
      owner.dispose();
      intro?.cancel(false);
      cleanups.forEach((fn) => fn());
      engine.dispose();
      controller.current = null;
      cancelInteractions.current = () => {};
      surface.removeEventListener("pointermove", hover);
      surface.removeEventListener("pointerleave", reset);
      media.removeEventListener("change", preference);
    };
  }, [play]);
  useEffect(() => {
    controller.current?.configure({ form, strength });
  }, [form, strength, play]);
  useEffect(() => {
    cancelInteractions.current();
    controller.current?.configure({ form, strength }, true);
  }, [resetToken]);
  return (
    <div ref={root} className={`living-x ${play ? "is-playable" : ""}`}>
      <XMark decorative={!play} material={material} />
      {play &&
        rest.anchors.map((p, i) => (
          <button
            type="button"
            key={i}
            className="x-handle"
            style={{ left: `${p.x / 5}%`, top: `${p.y / 5}%` }}
            aria-label={`第${i + 1}条曲线：拖动调整，松开恢复；方向键逐步调整，Esc复原`}
          >
            <span />
          </button>
        ))}
    </div>
  );
}
