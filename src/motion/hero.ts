import gsap from "gsap";
import { motionTokens as m } from "./tokens";
export function animateHero(mode: "entrance" | "settle" = "entrance") {
  if (mode === "settle") {
    return gsap.fromTo(
      ".hero-artwork",
      { scale: 0.985 },
      { scale: 1, duration: 0.65, ease: m.ease, clearProps: "transform" },
    );
  }
  let repeat = false;
  try {
    repeat = !!sessionStorage.getItem("xuanyi-motion-2");
    sessionStorage.setItem("xuanyi-motion-2", "1");
  } catch {}
  const tl = gsap.timeline({ defaults: { ease: m.ease } });
  tl.from(".hero", { "--sky-presence": 0, duration: 1.4 }, 0)
    .from(".hero-kicker", { opacity: 0, y: 8, duration: 0.45 }, 0)
    .from(
      ".hero-letter",
      {
        yPercent: 110,
        rotation: 6,
        duration: repeat ? 0.65 : m.hero,
        stagger: { each: m.stagger, from: "start" },
      },
      0.1,
    )
    .from(".hero-artwork", { opacity: 0, scale: 0.94, duration: 0.6 }, 0.12)
    .fromTo(
      '.hero-artwork [data-ribbon="a"]',
      { attr: { "stroke-dasharray": "600 600", "stroke-dashoffset": 600 } },
      { attr: { "stroke-dashoffset": 0 }, duration: 1.25 },
      0.2,
    )
    .fromTo(
      '.hero-artwork [data-ribbon="b"]',
      { attr: { "stroke-dasharray": "600 600", "stroke-dashoffset": -600 } },
      { attr: { "stroke-dashoffset": 0 }, duration: 1.25 },
      0.36,
    )
    .from(
      ".hero-tagline > span",
      { clipPath: "inset(0 0 100% 0)", y: 12, duration: 0.8, stagger: 0.13 },
      0.45,
    )
    .from(
      ".hero-copy, .hero-bottom, .hero-aside",
      { opacity: 0, y: 8, stagger: 0.07, duration: 0.6 },
      0.72,
    )
    .from(
      ".hero-spark, .orbit-label",
      { opacity: 0, rotation: -15, scale: 0.8, duration: 0.7 },
      0.95,
    );
  return tl;
}
