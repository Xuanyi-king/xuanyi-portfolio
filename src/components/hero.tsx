"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";

import { LivingX } from "./living-x";

export function Hero() {
  return (
    <section className="hero" aria-label="玄屹，Curiosity Takes Shape">
      <div className="hero-kicker">
        <p className="eyebrow">
          <span className="status-dot" />A CURIOUS MIND. AN OPEN CANVAS.
        </p>
        <span className="edition">CURIOSITY IN MOTION — VOL. 02</span>
      </div>
      <h1 className="hero-title">
        <span>
          <span className="sr-only">XUANYI.</span>
          <span aria-hidden="true" className="hero-letters">
            {Array.from("XUANYI.").map((letter, i) => (
              <span
                className={`letter-mask ${i === 6 ? "name-dot" : ""}`}
                key={i}
              >
                <span className="hero-letter">{letter}</span>
              </span>
            ))}
          </span>
        </span>
      </h1>
      <div className="hero-story">
        <p className="hero-tagline">
          <span>Curiosity</span>
          <span>
            takes <em>shape.</em>
          </span>
        </p>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-orbit" />
          <span className="orbit-label">EXPLORATION × CREATION</span>
          <div className="hero-artwork">
            <div className="hero-pointer">
              <LivingX />
            </div>
          </div>
          <svg className="hero-spark" viewBox="0 0 100 100">
            <path
              d="M50 5c0 32-13 45-45 45 32 0 45 13 45 45 0-32 13-45 45-45-32 0-45-13-45-45Z"
              fill="currentColor"
            />
          </svg>
        </div>
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
