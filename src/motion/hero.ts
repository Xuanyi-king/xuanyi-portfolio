import gsap from "gsap";
export function animateHero(_mode: "enhance" = "enhance") {
  // Initial line choreography is CSS-only and starts with the HTML. GSAP never hides type.
  return gsap.to(".thread-extension", {
    strokeDashoffset: 0,
    duration: 0.9,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".hero-bottom",
      start: "top 76%",
      once: true,
    },
  });
}
