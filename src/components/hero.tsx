"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import gsap from "gsap";
import { XMark } from "./x-mark";
import { motion } from "@/lib/motion";
export function Hero() {
  const art = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const target = art.current;
    return () => {
      if (target) gsap.killTweensOf(target);
    };
  }, []);
  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (
      e.pointerType === "touch" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const rect = e.currentTarget.getBoundingClientRect();
    gsap.to(art.current, {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 24,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 18,
      rotation: ((e.clientX - rect.left) / rect.width - 0.5) * 7,
      duration: motion.pointer,
      overwrite: "auto",
      ease: motion.ease,
    });
  };
  const reset = () => {
    gsap.to(art.current, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 1,
      overwrite: "auto",
      ease: motion.ease,
    });
  };
  return (
    <section
      className="hero"
      aria-label="玄屹，Curiosity Takes Shape"
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <div className="hero-kicker">
        <p className="eyebrow">
          <span className="status-dot" />A CURIOUS MIND. AN OPEN CANVAS.
        </p>
        <span className="edition">PERSONAL SPACE — VOL. 01</span>
      </div>
      <h1 className="hero-title">
        <span>
          XUANYI<span className="name-dot">.</span>
        </span>
      </h1>
      <div className="hero-story">
        <p className="hero-tagline">
          <span>Curiosity</span>
          <span>
            takes <em>shape.</em>
          </span>
        </p>
        <div className="hero-copy">
          <p>把好奇心，做成看得见的作品。</p>
          <span>
            你好，我是玄屹。
            <br />
            在代码、设计与生活之间，探索新的可能。
          </span>
          <Link href="/work" className="pill-button">
            看看我的作品
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="visual-orbit" />
        <span className="orbit-label">EXPLORATION × CREATION</span>
        <div className="hero-artwork">
          <div className="hero-pointer" ref={art}>
            <XMark />
          </div>
        </div>
        <svg className="hero-spark" viewBox="0 0 100 100">
          <path
            d="M50 5c0 32-13 45-45 45 32 0 45 13 45 45 0-32 13-45 45-45-32 0-45-13-45-45Z"
            fill="currentColor"
          />
        </svg>
        <span className="floating-dot" />
        <svg className="pencil-line" viewBox="0 0 170 100">
          <path
            d="M5 70C70 93 153 75 125 33c-15-23-56-15-49 10 6 22 55 26 79-6m-18 4 19-7-3 19"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="hero-aside">
        <span>
          玄<br />屹
        </span>
        <span className="aside-line" />
        <small>IDEAS INTO LITTLE REALITIES.</small>
      </div>
      <div className="hero-bottom">
        <a href="#selected-work">
          <ArrowDown size={16} />
          SCROLL TO EXPLORE
        </a>
        <p>
          A small corner of the internet,
          <br />
          <em>with room for possibilities.</em>
        </p>
        <span>
          向下，发现一点不同 <MoveUpRight size={15} />
        </span>
      </div>
    </section>
  );
}
