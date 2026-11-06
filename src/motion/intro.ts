import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
export function animateIntro() {
  gsap.registerPlugin(SplitText);
  const heading = document.querySelector(".intro-statement");
  if (heading)
    SplitText.create(heading, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.lines, {
          yPercent: 105,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 88%", once: true },
        });
      },
    });
}
