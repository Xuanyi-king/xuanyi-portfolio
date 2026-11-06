import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
const instances = new WeakMap<Element, () => void>();
export function animateIntro() {
  gsap.registerPlugin(SplitText);
  const heading = document.querySelector(".intro-statement");
  if (!heading) return;
  instances.get(heading)?.();
  let animation: gsap.core.Tween | undefined;
  let disposed = false;
  const split = SplitText.create(heading, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit(self) {
      animation?.scrollTrigger?.kill();
      animation?.kill();
      animation = gsap.from(self.lines, {
        yPercent: 105,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: heading, start: "top 88%", once: true },
      });
      return animation;
    },
  });
  const restore = () => {
    if (disposed) return;
    disposed = true;
    animation?.scrollTrigger?.kill();
    animation?.kill();
    split.revert();
    if (instances.get(heading) === restore) instances.delete(heading);
  };
  instances.set(heading, restore);
  return restore;
}
