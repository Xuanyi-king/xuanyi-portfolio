import gsap from "gsap";
import { pointerTilt } from "./pointer-geometry";
export function cardPointer(card: HTMLElement) {
  const plane = card.querySelector<HTMLElement>(".cover-depth");
  const surface = card.querySelector<HTMLElement>(".project-cover");
  if (!plane || !surface) return () => {};
  // Read the untransformed link, once per entry or viewport change, never the rotating plane.
  let bounds: DOMRect | undefined;
  const context = gsap.context(() => {});
  let cleanup = () => {};
  context.add(() => {
    const x = gsap.quickTo(plane, "rotationY", {
      duration: 0.55,
      ease: "power3.out",
    });
    const y = gsap.quickTo(plane, "rotationX", {
      duration: 0.55,
      ease: "power3.out",
    });
    const measure = () => {
      bounds = surface.getBoundingClientRect();
    };
    const invalidate = () => {
      bounds = undefined;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!bounds) measure();
      const tilt = pointerTilt(e.clientX, e.clientY, bounds!);
      x(tilt.x);
      y(tilt.y);
    };
    const reset = () => {
      x(0);
      y(0);
      bounds = undefined;
    };
    surface.addEventListener("pointerenter", measure);
    surface.addEventListener("pointermove", move);
    surface.addEventListener("pointerleave", reset);
    window.addEventListener("scroll", invalidate, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", invalidate);
    const resize = new ResizeObserver(invalidate);
    resize.observe(surface);
    cleanup = () => {
      surface.removeEventListener("pointerenter", measure);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", invalidate, true);
      window.removeEventListener("resize", invalidate);
      resize.disconnect();
      x.tween.kill();
      y.tween.kill();
    };
  });
  return () => {
    cleanup();
    context.revert();
  };
}
