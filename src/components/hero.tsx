"use client";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { LivingX } from "./living-x";
import { threadPath } from "@/motion/thread";
import type { SilkVariant } from "@/motion/surface";
let mountedBefore = false;
export function Hero({ variant = "cloud" }: { variant?: SilkVariant } = {}) {
  const root = useRef<HTMLElement>(null);
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (mountedBefore) root.current?.setAttribute("data-returning", "true");
    mountedBefore = true;
    try {
      sessionStorage.setItem("xuanyi-2-1-seen", "true");
    } catch {}
  }, []);
  return (
    <section
      ref={root}
      className="hero"
      aria-label="XUANYI 玄屹，Curiosity Takes Shape"
    >
      <div className="hero-kicker">
        <p className="hero-identity">
          <span className="hero-name">XUANYI</span>
          <span className="hero-han">玄屹</span>
        </p>
        <p className="hero-note">代码里的理性，创作里的好奇。</p>
      </div>
      <div className="hero-composition">
        <h1 className="hero-title">
          <span className="hero-line">Curiosity</span>
          <span className="hero-line second-line">
            takes <em>shape.</em>
            <span className="sr-only"> — XUANYI 玄屹</span>
          </span>
        </h1>
        {[false, true].map((mobile) => (
          <svg
            key={String(mobile)}
            className={`hero-thread thread-${mobile ? "mobile" : "desktop"}`}
            viewBox={mobile ? "0 0 360 420" : "0 0 1280 560"}
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              className="thread-base"
              data-thread={mobile ? "mobile" : "desktop"}
              d={threadPath(mobile)}
            />
            <path
              className="thread-chase"
              data-thread={mobile ? "mobile" : "desktop"}
              pathLength="1"
              d={threadPath(mobile)}
            />
            <path
              className="thread-extension"
              pathLength="1"
              d={
                mobile
                  ? "M136 324 C115 325 112 338 101 343"
                  : "M815 472 C745 476 723 515 704 542"
              }
            />
          </svg>
        ))}
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-artwork">
            <div className="hero-pointer">
              <LivingX variant={variant} />
            </div>
          </div>
          <div className="hero-art-caption">
            <span>好奇的形状</span>
            <span>探索 × 创造</span>
          </div>
        </div>
        <div className="hero-copy">
          <p>把好奇心，做成看得见的作品。</p>
          <p className="hero-description">
            你好，我是玄屹。
            <br />在 AI 工具与知识影像之间，
            <br />
            用代码构建，用设计表达。
          </p>
          <div className="hero-actions">
            <Link href="/work/" className="pill-button">
              探索作品 <ArrowUpRight size={19} />
            </Link>
            <Link href="/notes/" className="hero-note-link">
              沿途的手记 <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#selected-work">
          <ArrowDown size={17} />
          <span>向下，看看好奇心的去向</span>
        </a>
        <p>A practice in thinking & making.</p>
        <span className="hero-edition">好奇，在流动。 / 2026</span>
      </div>
    </section>
  );
}
