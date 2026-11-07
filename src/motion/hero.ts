import gsap from "gsap";
import { foldFrame, type FoldMetrics } from "./folding";
export function animateHero() {
  const hero = document.querySelector<HTMLElement>(".hero"),
    visual = hero?.querySelector<HTMLElement>(".hero-visual"),
    art = hero?.querySelector<HTMLElement>(".hero-artwork"),
    icon = document.querySelector<SVGSVGElement>(".wordmark > svg");
  if (!hero || !visual || !art || !icon) return;
  let metrics: FoldMetrics;
  const measure = () => {
    const a = visual.getBoundingClientRect(),
      b = icon.getBoundingClientRect();
    metrics = {
      centerX: a.left + a.width / 2,
      centerY: a.top + scrollY + a.height / 2,
      start: hero.getBoundingClientRect().top + scrollY,
      distance: Math.min(660, hero.offsetHeight * 0.82),
      navX: b.left + b.width / 2,
      navY: b.top + b.height / 2,
      scale: b.width / a.width,
      width: innerWidth,
      headerBottom:
        icon.closest("header")?.getBoundingClientRect().bottom ?? b.bottom,
      navSize: b.width,
    };
  };
  const paint = (progress: number) => {
    const f = foldFrame(progress, metrics);
    art.style.transform = `translate3d(${f.x.toFixed(3)}px,${f.y.toFixed(3)}px,0) rotate(${f.rotation.toFixed(4)}deg) scale(${f.scale.toFixed(6)})`;
    hero.dataset.foldProgress = progress.toFixed(3);
  };
  measure();
  paint(0);
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: () => `+=${metrics.distance}`,
      scrub: true,
      invalidateOnRefresh: true,
      onRefreshInit: measure,
      onUpdate: (self) => paint(self.progress),
      onRefresh: (self) => {
        hero.dataset.foldStart = String(self.start);
        hero.dataset.foldEnd = String(self.end);
        paint(self.progress);
      },
    },
  });
  // Scroll alone owns this outer transform; SVG geometry remains with curve-owner.
  timeline
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
export function resetHero() {
  const hero = document.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  gsap.set(
    hero.querySelectorAll(
      ".hero-artwork, .hero-title, .hero-copy, .hero-art-caption, .hero-thread",
    ),
    { clearProps: "transform,transformOrigin,opacity" },
  );
  hero.style.removeProperty("--canvas-opacity");
  delete hero.dataset.foldProgress;
  delete hero.dataset.foldStart;
  delete hero.dataset.foldEnd;
}
