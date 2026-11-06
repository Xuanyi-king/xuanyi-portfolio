import gsap from "gsap";
export function cardPointer(card: HTMLElement) {
  const plane = card.querySelector<HTMLElement>(".cover-depth");
  if (!plane) return () => {};
  const mm = gsap.matchMedia();
  mm.add(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      const x = gsap.quickTo(plane, "rotationY", {
          duration: 0.55,
          ease: "power3.out",
        }),
        y = gsap.quickTo(plane, "rotationX", {
          duration: 0.55,
          ease: "power3.out",
        });
      const move = (e: PointerEvent) => {
        const r = plane.getBoundingClientRect();
        x(((e.clientX - r.left) / r.width - 0.5) * 5);
        y(-((e.clientY - r.top) / r.height - 0.5) * 5);
      };
      const reset = () => {
        x(0);
        y(0);
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", reset);
      return () => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", reset);
        x.tween.kill();
        y.tween.kill();
      };
    },
  );
  return () => mm.revert();
}
