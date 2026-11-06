import gsap from "gsap";
export function animateSections() {
  const heading = document.querySelector(".intro-statement");
  gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
    if (
      el === heading ||
      el.closest(".project-card") ||
      el.classList.contains("detail-cover")
    )
      return;
    const quiet = !!el.closest(".notes-section, .note-list");
    gsap.from(el, {
      opacity: 0,
      y: quiet ? 0 : 15,
      duration: quiet ? 0.55 : 0.8,
      scrollTrigger: { trigger: el, start: "top 93%", once: true },
    });
  });
  gsap.utils
    .toArray<HTMLElement>(".home-projects .project-card")
    .forEach((el) => {
      gsap.from(el.querySelector(".cover-inner"), {
        clipPath: "inset(10% 0 10% 0 round 18px)",
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 91%", once: true },
      });
      gsap.from(el.querySelector(".project-meta"), {
        y: 18,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) =>
    gsap.fromTo(
      el,
      { y: 16, rotation: -12 },
      {
        y: -16,
        rotation: -6,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    ),
  );
  // Keep the Lab link's hit/focus frame stationary. Its SVG already owns the
  // hover rotation; rotating this outer frame can widen narrow WebKit pages.
}
