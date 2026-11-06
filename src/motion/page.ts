import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
    const context = gsap.context(() => {
      // Never hide a title that has already been read while a slow chunk was downloading.
      if (performance.now() - started < 800 && window.scrollY < 40)
        hero?.animateHero();
      intro?.animateIntro();
      animateSections();
    });
    void document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
      context.revert();
    };
  };
}
