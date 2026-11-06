import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroMode } from "./hero-policy";
import { animateSections } from "./reveals";
export async function preparePageMotion(started: number) {
  const [hero, intro] = await Promise.all([
    document.querySelector(".hero") ? import("./hero") : undefined,
    document.querySelector(".intro-statement") ? import("./intro") : undefined,
  ]);
  return () => {
    // Preserve the browser's restored page and scroll position on history traversal.
    const navigation = performance.getEntriesByType("navigation")[0] as
      PerformanceNavigationTiming | undefined;
    if (navigation?.type === "back_forward") return () => {};
    gsap.registerPlugin(ScrollTrigger);
    let active = true;
    let restoreIntro: (() => void) | undefined;
    const context = gsap.context(() => {
      const firstPaint =
        performance.getEntriesByName("first-contentful-paint")[0]?.startTime ??
        started;
      const mode = heroMode({
        sincePaint: performance.now() - firstPaint,
        scrollY: window.scrollY,
        visible: document.visibilityState === "visible",
        restored: false,
      });
      if (mode !== "none") hero?.animateHero(mode);
      restoreIntro = intro?.animateIntro();
      animateSections();
    });
    void document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
      restoreIntro?.();
      context.revert();
    };
  };
}
