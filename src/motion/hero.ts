import gsap from "gsap";

export function animateHero(_mode: "enhance" = "enhance") {
  const hero = document.querySelector<HTMLElement>(".hero"),
    visual = hero?.querySelector<HTMLElement>(".hero-visual"),
    art = hero?.querySelector<HTMLElement>(".hero-artwork"),
    icon = document.querySelector<SVGSVGElement>(".wordmark > svg");
  if (!hero || !visual || !art || !icon) return;
  // Measure stationary layout anchors, never the transformed artwork.
  const distance = () => Math.min(660, hero.offsetHeight * 0.82);
  const target = () => {
    const a = visual.getBoundingClientRect(),
      b = icon.getBoundingClientRect();
    const start = hero.getBoundingClientRect().top + scrollY;
    return {
      x: b.left + b.width / 2 - a.left - a.width / 2,
      y:
        b.top +
        b.height / 2 -
        (a.top + scrollY + a.height / 2) +
        start +
        distance(),
      scale: b.width / a.width,
    };
  };
  const middleY = () => target().y * 0.5 + (innerWidth <= 760 ? -155 : 30);
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: () => `+=${distance()}`,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        hero.dataset.foldProgress = self.progress.toFixed(3);
      },
      onRefresh: (self) => {
        hero.dataset.foldStart = String(self.start);
        hero.dataset.foldEnd = String(self.end);
      },
    },
  });
  timeline
    .fromTo(
      art,
      { scale: 1 },
      { scale: () => target().scale, duration: 1, ease: "power1.inOut" },
      0,
    )
    .fromTo(
      art,
      { x: 0, rotation: 0 },
      {
        x: () => target().x,
        rotation: 9,
        duration: 1,
        // A late, smooth lateral crossing keeps the mark away from the CTA.
        ease: (t: number) => {
          const p = Math.max(0, (t - 0.2) / 0.8);
          return p * p * (3 - 2 * p);
        },
        force3D: true,
      },
      0,
    )
    .fromTo(art, { y: 0 }, { y: middleY, duration: 0.5 }, 0)
    .fromTo(
      art,
      { y: middleY },
      { y: () => target().y, duration: 0.5, immediateRender: false },
      0.5,
    )
    .fromTo(
      hero.querySelector(".hero-title"),
      { y: 0, scale: 1, opacity: 1 },
      {
        y: -24,
        scale: 0.94,
        opacity: 0.68,
        transformOrigin: "left center",
        duration: 0.75,
      },
      0,
    )
    .fromTo(
      hero.querySelector(".hero-copy"),
      { y: 0 },
      { y: () => (innerWidth <= 760 ? -60 : -48), duration: 0.75 },
      0,
    )
    .fromTo(
      hero.querySelector(".hero-art-caption"),
      { opacity: 1 },
      { opacity: 0, duration: 0.22 },
      0.05,
    )
    .fromTo(
      hero.querySelectorAll(".hero-thread"),
      { opacity: 1 },
      { opacity: 0, duration: 0.4 },
      0,
    )
    .fromTo(
      hero,
      { "--canvas-opacity": 1 },
      { "--canvas-opacity": 0.35, duration: 1 },
      0,
    );
  return timeline;
}

/** Cached App Router pages can retain transformed DOM. Restore only properties
 * owned by folding, so preference changes and remounts start from CSS again. */
export function resetHero() {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  gsap.set(
    hero.querySelectorAll(
      ".hero-artwork, .hero-title, .hero-copy, .hero-art-caption, .hero-thread",
    ),
    {
      clearProps: "transform,transformOrigin,opacity",
    },
  );
  hero.style.removeProperty("--canvas-opacity");
  delete hero.dataset.foldProgress;
  delete hero.dataset.foldStart;
  delete hero.dataset.foldEnd;
}
