import gsap from "gsap";
export function animateHero(_mode: "enhance" = "enhance") {
  // Initial line choreography is CSS-only and starts with the HTML. GSAP never hides type.
  return gsap.to(".hero-thread", {
    y: 35,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 0.7,
    },
  });
}
