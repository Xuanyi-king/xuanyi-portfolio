"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animateHero } from "@/motion/hero";
import { animateSections } from "@/motion/reveals";
export function MotionProvider() {
  const path = usePathname();
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let active = true;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (document.querySelector(".hero")) animateHero();
      animateSections();
    });
    document.fonts.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
      mm.revert();
    };
  }, [path]);
  return null;
}
