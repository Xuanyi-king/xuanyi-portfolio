import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateSections } from "./reveals";
export async function preparePageMotion(_started: number) {
  const [hero, intro] = await Promise.all([
    document.querySelector(".hero") ? import("./hero") : undefined,
    document.querySelector(".intro-statement") ? import("./intro") : undefined,
  ]);
  return () => {
    // Preserve the browser's restored page and scroll position on history traversal.
    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const restored = navigation?.type === "back_forward";
    gsap.registerPlugin(ScrollTrigger);
    let active = true;
    let restoreIntro: (() => void) | undefined;
    hero?.resetHero();
    const context = gsap.context(() => {
      // Scroll choreography derives from the current scroll position, including
      // native history restoration. It never replays the separate X intro.
      hero?.animateHero();
      if (restored) return;
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
      hero?.resetHero();
    };
  };
}
