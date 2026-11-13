"use client";

// Throwaway C: real work is the first composition; selection opens a material on the practice table.
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { projects } from "@/data/projects";
import { Sculpture } from "./sculpture";
import "./variant-c.css";

const materials = [
  { key: "ROUTER", noun: "让选择有依据", src: "/projects/router-settings.png", alt: "DSH Adaptive Router 的真实原生设置页：候选模型与路由配置", label: "原生设置页 / 真实界面", thought: "任务、模型、推理档位。把自动选择的边界写进工具里。", media: "TypeScript · 原生插件" },
  { key: "FILM", noun: "让原理被看见", src: "/projects/atlas-frame.jpg", alt: "ATLAS 成片画面：同一个地球从球面变成平面地图", label: "ATLAS / 成片第 10 秒", thought: "从球面到一张纸。让地图投影的取舍，在画面里发生。", media: "Canvas · 程序动画" },
  { key: "STORY", noun: "让经历成为提问", src: "/projects/multiverse-play-act1.jpg", alt: "知乎平行宇宙真实叙事界面，呈现一段黑客松报名的经历", label: "知乎平行宇宙 / 第一幕", thought: "从可核验的真实经历出发，把阅读带向一次现实中的尝试。", media: "React · 交互叙事" },
];

export function VariantC() {
  const [selected, setSelected] = useState(1);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const runway = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = materials[selected];
  const project = projects[selected];
  const others = materials.map((_, i) => i).filter(i => i !== selected);

  useEffect(() => {
    const el = root.current;
    const track = runway.current;
    if (!el || !track) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
      el.style.setProperty("--c-scroll", preference.matches ? "0" : progress.toFixed(4));
      el.dataset.reduced = String(preference.matches);
      const mobile = innerWidth <= 760;
      for (const node of el.querySelectorAll<HTMLElement>(".cd-c-joint,.cd-c-satellite")) {
        const hidden = !preference.matches && progress > (node.classList.contains("cd-c-joint") ? .79 : mobile ? .90 : .98);
        node.inert = hidden;
        node.style.visibility = hidden ? "hidden" : "";
      }
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    const reduced = () => { video.current?.pause(); setPlaying(false); request(); };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    preference.addEventListener("change", reduced);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      preference.removeEventListener("change", reduced);
    };
  }, []);

  useEffect(() => {
    const media = video.current;
    if (!media) return;
    const stop = () => { media.pause(); setPlaying(false); };
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) stop();
    }, { threshold: 0.25 });
    observer.observe(media);
    const visibility = () => { if (document.hidden) stop(); };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      media.pause();
    };
  }, [selected]);

  const select = (index: number) => {
    video.current?.pause();
    setPlaying(false);
    setSelected(index);
    root.current?.querySelector(".cd-c-table")?.dispatchEvent(new CustomEvent("cd-sculpture-change", {
      detail: { progress: index / 2, energy: 0.72 }, bubbles: true,
    }));
  };
  const tabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % 3;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + 2) % 3;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 2;
    else return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  };
  const toggleFilm = async () => {
    const media = video.current;
    if (!media) return;
    if (!media.paused) { media.pause(); setPlaying(false); return; }
    if (!media.getAttribute("src")) media.src = "/projects/atlas-excerpt.webm";
    try { await media.play(); setPlaying(!media.paused); } catch { setPlaying(false); }
  };

  return (
    <div className="cd-c" ref={root} data-selected={current.key}>
      <nav className="cd-c-masthead" aria-label="玄屹站点导航">
        <a href="/" className="cd-c-home">玄屹 <span>— PERSONAL PRACTICE</span></a>
        <div><a href="#cd-c-work">作品</a><a href="/notes/making-xuanyi/">手记 ↗</a><a href="/about/">关于</a></div>
      </nav>

      <section ref={runway} className="cd-c-runway" aria-label="好奇实践台">
        <div className="cd-c-sticky">
          <div className="cd-c-wordmark"><h1>XUANYI<span>玄屹</span></h1><p>Curiosity Takes Shape.</p></div>
          <section className="cd-c-table" aria-label="三件真实作品的材料台">
            <div className="cd-c-table-intro"><span>好奇，正在发生。</span><p>代码构建。设计表达。<br />把想法，做成看得见的东西。</p></div>
            <button type="button" data-direction-interaction className={`cd-c-satellite cd-c-satellite-left cd-c-kind-${others[0]}`} onClick={() => select(others[0])} aria-label={`选择 ${projects[others[0]].title}`}>
              <span className="cd-c-material-label"><b>0{others[0] + 1}</b> {materials[others[0]].key}<span>↗</span></span>
              <img src={materials[others[0]].src} alt={materials[others[0]].alt} width={others[0] === 0 ? 1440 : 1920} height={others[0] === 0 ? 1800 : 1080} />
              <span className="cd-c-artifact-note">{materials[others[0]].label}</span>
            </button>

            <figure className={`cd-c-primary cd-c-primary-${selected}`} id="cd-c-material" aria-label={project.title}>
              <figcaption><span><b>0{selected + 1}</b> {current.label}</span><a href={`/work/${project.slug}/`} aria-label={`查看 ${project.title} 项目详情`}>进入项目 ↗</a></figcaption>
              <div className="cd-c-primary-window" key={selected}>
                <img src={current.src} alt={current.alt} width={selected === 0 ? 1440 : 1920} height={selected === 0 ? 1800 : 1080} fetchPriority="high" />
                {selected === 1 && <><video ref={video} poster={current.src} preload="none" muted playsInline onEnded={() => setPlaying(false)} aria-label="地图是一种选择，真实成片节选" /><button type="button" data-direction-interaction className="cd-c-play" onClick={toggleFilm} aria-label={playing ? "暂停成片节选" : "播放成片节选"}>{playing ? "Ⅱ 暂停" : "▶ 播放节选"}<span>无声 · 真实成片</span></button></>}
              </div>
              <div className="cd-c-primary-caption"><span>{current.media}</span><span>{project.year} / {project.category}</span></div>
            </figure>

            <div className="cd-c-joint"><Sculpture variant="C" className="cd-c-ceramic" /><span>不同的好奇，在这里相交。</span></div>

            <button type="button" data-direction-interaction className={`cd-c-satellite cd-c-satellite-right cd-c-kind-${others[1]}`} onClick={() => select(others[1])} aria-label={`选择 ${projects[others[1]].title}`}>
              <span className="cd-c-material-label"><b>0{others[1] + 1}</b> {materials[others[1]].key}<span>↗</span></span>
              <img src={materials[others[1]].src} alt={materials[others[1]].alt} width={1920} height={1080} />
              <span className="cd-c-artifact-note">{materials[others[1]].label}</span>
            </button>
            <div className="cd-c-table-edge" aria-hidden="true" />
          </section>
          <div className="cd-c-selection" id="cd-c-work" data-direction-interaction>
            <span className="cd-c-selection-label">SELECTED PRACTICE <span>2026</span></span>
            <div className="cd-c-tabs" role="tablist" aria-label="选择一件实践">
              {materials.map((material, index) => <button ref={node => { tabs.current[index] = node; }} id={`cd-c-tab-${index}`} type="button" key={material.key} role="tab" aria-selected={selected === index} aria-controls="cd-c-detail" tabIndex={selected === index ? 0 : -1} onKeyDown={event => tabKey(event, index)} onClick={() => select(index)}><span>0{index + 1}</span><b>{material.noun}</b><small>{material.key}</small><span className="cd-c-tab-arrow">↗</span></button>)}
            </div>
            <p className="cd-c-live-state" aria-live="polite">正在观看：{project.title}<a href="#cd-c-detail">向下，展开这件作品 ↓</a></p>
          </div>
        </div>
      </section>

      <section className="cd-c-detail" id="cd-c-detail" role="tabpanel" aria-labelledby={`cd-c-tab-${selected}`} tabIndex={0} data-direction-interaction>
        <div className="cd-c-detail-heading"><span>0{selected + 1} / THE PRACTICE</span><p>{current.thought}</p></div>
        <div className="cd-c-case">
          <div><p className="cd-c-eyebrow">{project.category} · {project.year}</p><h2>{project.title}</h2><p className="cd-c-subtitle">{project.subtitle}</p><a className="cd-c-case-link" href={`/work/${project.slug}/`}>完整项目与制作过程 <span>↗</span></a></div>
          <div className="cd-c-case-copy"><p>{project.intro}</p><p>{project.why}</p><div className="cd-c-status"><span>当前状态</span>{project.status}</div>{project.credit && <small>{project.credit}</small>}</div>
        </div>
        <div className="cd-c-proof"><span>材料来源</span><p>{selected === 2 ? "公开项目仓库中的真实交互界面；公网体验已下线，可在项目详情中查看复现方式。" : project.visual?.caption}</p><a href={`/work/${project.slug}/`}>查看作品与来源 ↗</a></div>
      </section>

      <section className="cd-c-notebook"><div><span>从实践，到下一次好奇。</span><h2>形状背后，<br />还有过程。</h2></div><a href="/notes/making-xuanyi/"><span>制作手记 / 001</span><h3>好奇的形状：这个网站的第一笔</h3><p>从两条曲线开始，记录 XUANYI 的视觉与交互设计。</p><b>读手记 ↗</b></a></section>
      <footer className="cd-c-footer"><strong>玄屹 / XUANYI</strong><span>Curiosity Takes Shape.</span><a href="/work/">继续看作品 ↗</a></footer>
    </div>
  );
}
