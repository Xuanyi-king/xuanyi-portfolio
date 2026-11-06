"use client";
import { useEffect, useRef } from "react";
// No src is emitted on the home page. Only an intentional preview requests the real excerpt.
export function ProjectFilmPreview() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current!,
      card = video.closest<HTMLElement>(".project-card");
    if (!card) return;
    const media = matchMedia("(prefers-reduced-motion: no-preference)");
    let hovered = false,
      focused = false;
    const stop = () => {
      video.pause();
      if (video.readyState) video.currentTime = 0;
    };
    const sync = () => {
      if (!(hovered || focused) || !media.matches || document.hidden || (card.closest(".living-gallery") && card.dataset.galleryActive !== "true")) {
        stop();
        return;
      }
      if (!video.getAttribute("src"))
        video.src = "/projects/atlas-excerpt.webm";
      // pause() aborts pending play promises. An older promise must never pause a newer request.
      if (video.paused) void video.play().catch(() => {});
    };
    const enter = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      hovered = true;
      sync();
    };
    const leave = () => {
      hovered = false;
      sync();
    };
    const focus = () => {
      focused = !!card.querySelector(":focus-visible");
      sync();
    };
    const blur = (e: FocusEvent) => {
      if (!card.contains(e.relatedTarget as Node)) {
        focused = false;
        sync();
      }
    };
    const observer = new MutationObserver(sync);
    observer.observe(card, {attributes:true, attributeFilter:["data-gallery-active"]});
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focusin", focus);
    card.addEventListener("focusout", blur);
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      hovered = false;
      focused = false;
      stop();
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("focusin", focus);
      card.removeEventListener("focusout", blur);
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return (
    <video
      ref={ref}
      className="film-preview-video"
      poster="/projects/atlas-preview.jpg"
      preload="none"
      muted
      loop
      playsInline
      tabIndex={-1}
      aria-hidden="true"
    />
  );
}
