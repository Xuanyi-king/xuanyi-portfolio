"use client";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { LivingX } from "./living-x";
let mountedBefore = false;
export function Hero() {
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
          <span className="status-dot" /> XUANYI <span>/ 玄屹</span>
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
        <svg
          className="hero-thread"
          viewBox="0 0 1280 560"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="thread-base"
            d="M120 351C310 446 720 263 818 179C949 67 1180 70 1181 249C1183 465 827 503 648 480"
          />
          <path
            className="thread-chase"
            pathLength="1"
            d="M120 351C310 446 720 263 818 179C949 67 1180 70 1181 249C1183 465 827 503 648 480"
          />
        </svg>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-artwork">
            <div className="hero-pointer">
              <LivingX />
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
