"use client";
import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectScene } from "./project-scene";
import {
  createGalleryController,
  type GalleryController,
} from "@/motion/gallery-controller";
import { frameFor, frameTransform } from "@/motion/gallery-model";
import { bindGalleryInput } from "@/motion/gallery-input";
import { galleryStateKey, readGalleryState } from "@/motion/gallery-state";
import { XMark } from "./x-mark";
import { LivingX } from "./living-x";
import { createGalleryResponse } from "@/motion/gallery-response";
const fallback = `.living-gallery .gallery-stage{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:48px;height:auto!important;perspective:none!important;padding:0!important}.living-gallery .gallery-stage .gallery-card{position:static!important;width:auto!important;transform:none!important;opacity:1!important;pointer-events:auto!important;visibility:visible!important}.living-gallery .gallery-stage .gallery-card .project-meta{opacity:1!important;visibility:visible!important}.living-gallery .gallery-controls,.living-gallery .gallery-hint{display:none!important}.living-gallery .gallery-viewport{overflow:visible!important}@media(max-width:760px){.living-gallery .gallery-stage{grid-template-columns:1fr;gap:44px}}`;
export function LivingGallery({
  projects,
  rail = false,
  restoreCss = false,
}: {
  projects: Project[];
  rail?: boolean;
  restoreCss?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null),
    stage = useRef<HTMLDivElement>(null),
    controller = useRef<GalleryController | null>(null),
    input = useRef<ReturnType<typeof bindGalleryInput> | null>(null);
  const [active, setActive] = useState(0),
    [enhanced, setEnhanced] = useState(false);
  const response = useMemo(createGalleryResponse, []);
  useLayoutEffect(() => {
    if (!stage.current) return;
    const el = stage.current,
      cards = [...el.querySelectorAll<HTMLElement>(".gallery-card")],
      media = matchMedia("(prefers-reduced-motion: reduce)");
    let width = innerWidth;
    const stateKey = galleryStateKey(
      location.pathname,
      projects.map((p) => p.slug),
    );
    let initial = 0;
    try {
      initial = readGalleryState(sessionStorage.getItem(stateKey));
    } catch {}
    const save = () => {
      try {
        sessionStorage.setItem(
          stateKey,
          JSON.stringify(Math.round(engine.read().position)),
        );
      } catch {}
    };
    const engine = createGalleryController(
      projects.length,
      {
        frame(position) {
          response.sample(position, performance.now());
          el.dataset.position = position.toFixed(5);
          cards.forEach((card, i) => {
            const f = frameFor(
              i,
              position,
              projects.length,
              width,
              media.matches,
            );
            card.style.transform = frameTransform(f);
            card.style.opacity = String(f.opacity);
            card.style.zIndex = String(f.zIndex);
            card.style.pointerEvents = f.opacity < 0.05 ? "none" : "auto";
            card.dataset.distance = f.distance.toFixed(4);
          });
        },
        active(index) {
          setActive(index);
          el.dataset.active = String(index);
        },
        settled() {
          response.reset();
          delete el.dataset.moving;
          save();
        },
      },
      {
        request: (fn) => {
          if (!el.hasAttribute("data-moving")) el.dataset.moving = "true";
          return requestAnimationFrame(fn);
        },
        cancel: (id) => {
          cancelAnimationFrame(id);
          delete el.dataset.moving;
        },
      },
      initial,
    );
    controller.current = engine;
    input.current = bindGalleryInput(el, engine);
    const resize = () => {
        width = innerWidth;
        if (el.hasAttribute("data-holding")) input.current?.cancel();
        response.reset();
        engine.redraw();
      },
      preference = () => {
        input.current?.cancel();
        response.reset();
        engine.setReduced(media.matches);
        engine.redraw();
      };
    const visibility = () => {
      if (document.hidden) {
        input.current?.cancel();
        response.reset();
      }
    };
    preference();
    setEnhanced(true);
    window.addEventListener("pagehide", save);
    window.addEventListener("resize", resize, { passive: true });
    media.addEventListener("change", preference);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      save();
      window.removeEventListener("pagehide", save);
      input.current?.dispose();
      input.current = null;
      engine.dispose();
      response.reset();
      controller.current = null;
      cards.forEach((c) => {
        c.style.removeProperty("transform");
        c.style.removeProperty("opacity");
        c.style.removeProperty("pointer-events");
        c.style.removeProperty("z-index");
      });
      window.removeEventListener("resize", resize);
      media.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [projects.length, response]);
  if (!projects.length) return <p>新的作品正在酝酿。</p>;
  const current = projects[active] ?? projects[0];
  return (
    <div
      ref={root}
      className="living-gallery"
      data-enhanced={enhanced ? "true" : undefined}
      onKeyDown={(e) => {
        if ((e.target as Element).closest("input")) return;
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          if (stage.current?.hasAttribute("data-dragging"))
            input.current?.cancel();
          controller.current?.step(e.key === "ArrowRight" ? 1 : -1);
          stage.current?.focus({ preventScroll: true });
        } else if (e.key === "Escape") {
          e.preventDefault();
          input.current?.cancel();
        } else if (e.key === "Enter" && e.target === stage.current) {
          e.preventDefault();
          stage.current
            ?.querySelector<HTMLAnchorElement>(
              `[data-index="${controller.current?.read().active ?? 0}"] a`,
            )
            ?.click();
        }
      }}
    >
      <noscript>
        <style>{fallback}</style>
      </noscript>
      <p className="gallery-hint">
        <span>好奇，无限延展。</span>
        <span>
          左右拖动，或用方向键探索 <span aria-hidden="true">↔</span>
        </span>
      </p>
      <div className="gallery-viewport">
        <div
          ref={stage}
          className="gallery-stage"
          tabIndex={enhanced ? 0 : -1}
          role="region"
          aria-roledescription={enhanced ? "轮播" : undefined}
          aria-label="The Living Gallery，左右方向键切换作品"
        >
          {projects.map((project, i) => {
            const f = frameFor(i, 0, projects.length, 1440);
            const initial = {
              "--initial-distance": restoreCss
                ? `var(--gallery-d${i},${f.distance})`
                : f.distance,
              "--initial-absolute": restoreCss
                ? `var(--gallery-a${i},${Math.abs(f.distance)})`
                : Math.abs(f.distance),
              "--initial-opacity": restoreCss
                ? `var(--gallery-o${i},${f.opacity})`
                : f.opacity,
              "--initial-scale": restoreCss
                ? `var(--gallery-s${i},${f.scale})`
                : f.scale,
              "--initial-active": restoreCss
                ? `var(--gallery-selected${i},${i === 0 ? 1 : 0})`
                : i === 0
                  ? 1
                  : 0,
            } as CSSProperties;
            return (
              <article
                key={project.slug}
                style={initial}
                className={`gallery-card project-card ${project.color}`}
                data-index={i}
                data-gallery-active={active === i ? "true" : "false"}
                aria-hidden={enhanced && active !== i ? true : undefined}
              >
                <a
                  className="gallery-link"
                  href={`/work/${project.slug}/`}
                  tabIndex={enhanced && active !== i ? -1 : 0}
                  aria-label={`查看 ${project.title} 项目详情`}
                >
                  <div className="project-cover">
                    <div className="cover-depth">
                      <div className="cover-inner">
                        <ProjectScene project={project} />
                      </div>
                    </div>
                  </div>
                  <div className="project-meta">
                    <p>
                      <span className="project-category">
                        <span className="project-number">
                          {String(i + 1).padStart(2, "0")} /
                        </span>{" "}
                        {project.category}
                      </span>
                      <span>{project.year}</span>
                    </p>
                    <div className="gallery-project-title">
                      <h3>{project.title}</h3>
                      <ArrowUpRight size={22} />
                    </div>
                    <p className="project-description">{project.description}</p>
                    <ul className="tags" aria-label="技术栈">
                      {project.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </a>
              </article>
            );
          })}
        </div>
      </div>
      <div className="gallery-controls">
        <button
          type="button"
          disabled={!enhanced || projects.length < 2}
          onClick={() => controller.current?.step(-1)}
          aria-label="上一个作品"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="gallery-status">
          <div className="gallery-response" aria-hidden="true">
            <LivingX drive={response} compact />
          </div>
          <div className="gallery-counter">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <span>/ {String(projects.length).padStart(2, "0")}</span>
          </div>
        </div>
        <button
          type="button"
          disabled={!enhanced || projects.length < 2}
          onClick={() => controller.current?.step(1)}
          aria-label="下一个作品"
        >
          <ArrowRight size={20} />
        </button>
      </div>
      {rail && (
        <div className="x-rail-study">
          <XMark compact />
          <input
            aria-label="X Rail 项目选择实验"
            type="range"
            min="0"
            max={projects.length - 1}
            value={active}
            onChange={(e) => controller.current?.select(Number(e.target.value))}
          />
          <span>仅供研究：X Rail</span>
        </div>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        第 {active + 1} 个，共 {projects.length} 个作品：{current.title}
      </p>
    </div>
  );
}
