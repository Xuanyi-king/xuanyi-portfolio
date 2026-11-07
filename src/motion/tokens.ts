export const motionTokens = {
  ease: "power3.out",
  hero: 1.1,
  stagger: 0.055,
  reveal: 0.75,
  pointer: 0.5,
  transition: 0.55,
  spring: { stiffness: 170, damping: 20, precision: 0.04 },
  maxDeformation: 64,
  galleryResponse: { force: 28, gain: 24, staleMs: 120, minimumStepMs: 8 },
} as const;
export const reducedQuery = "(prefers-reduced-motion: reduce)";
