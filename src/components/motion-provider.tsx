"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { watchMotionPreference } from "@/motion/preference";
export function MotionProvider() {
  const path = usePathname();
  useEffect(
    () =>
      watchMotionPreference(
        matchMedia("(prefers-reduced-motion: no-preference)"),
        async () => {
          const started = performance.now();
          const { preparePageMotion } = await import("@/motion/page");
          return preparePageMotion(started);
        },
      ),
    [path],
  );
  return null;
}
