"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "@/lib/motion";
export function MotionProvider() {
  const pathname = usePathname();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      let repeated = false;
      try {
        repeated = sessionStorage.getItem("xuanyi-visited") === "yes";
        sessionStorage.setItem("xuanyi-visited", "yes");
      } catch {
        /* Motion works when browser storage is unavailable. */
      }
      const timeline = gsap.timeline({ defaults: { ease: motion.ease } });
      if (document.querySelector(".hero")) {
        timeline
          .from(".hero-kicker", { y: 12, opacity: 0, duration: 0.65 })
          .from(
            ".hero-title span",
            {
              yPercent: 105,
              rotate: 3,
              duration: repeated ? 0.7 : motion.intro,
            },
            0.08,
          )
          .from(
            ".hero-artwork",
            {
              scale: 0.86,
              rotate: -12,
              opacity: 0,
              duration: repeated ? 0.8 : 1.5,
            },
            0.22,
          )
          .from(
            ".hero-tagline > span",
            { y: 32, opacity: 0, duration: 0.9, stagger: 0.12 },
            0.35,
          )
          .from(
            ".hero-copy, .hero-aside, .hero-bottom",
            { y: 14, opacity: 0, duration: 0.7, stagger: 0.08 },
            0.65,
          )
          .from(
            ".hero-spark, .orbit-label",
            { opacity: 0, scale: 0.75, duration: 0.8, stagger: 0.1 },
            0.9,
          );
      }
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el, i) => {
        gsap.from(el, {
          y: motion.travel,
          opacity: 0,
          duration: motion.reveal,
          ease: motion.ease,
          delay: (i % 3) * 0.045,
          scrollTrigger: { trigger: el, start: "top 93%", once: true },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          y: -24,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
      const refresh = () => ScrollTrigger.refresh();
      document.fonts.ready.then(refresh);
      return () => timeline.kill();
    });
    return () => mm.revert();
  }, [pathname]);
  return null;
}
