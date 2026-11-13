'use client';

// Throwaway direction A: typography, sculpture and real evidence share one editorial space.
import { useEffect, useRef, useState } from 'react';
import { LivingGallery } from '@/components/living-gallery';
import { projects } from '@/data/projects';
import { Sculpture } from './sculpture';
import './variant-a.css';

export function VariantA() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const [sample, setSample] = useState(0);
  const selected = projects[sample];

  useEffect(() => {
    const el = root.current!;
    const section = hero.current!;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = Math.max(0, -section.getBoundingClientRect().top);
      // A short transition followed by a stable reading interval; native scroll reverses it.
      const progress = Math.min(1, distance / Math.max(420, section.offsetHeight * .72));
      const eased = progress * progress * (3 - 2 * progress);
      el.style.setProperty('--a-scroll', String(preference.matches ? 0 : eased));
      el.dataset.chapter = progress > .8 ? 'works' : 'opening';
      section.dispatchEvent(new CustomEvent('cd-sculpture-change', {
        bubbles: true, detail: { progress: preference.matches ? 0 : eased },
      }));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    preference.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
    };
  }, []);

  return <div className="cd-a" ref={root}>
    <section className="cd-a-opening" ref={hero} aria-labelledby="cd-a-title">
      <div className="cd-a-lightwell" aria-hidden="true" />
      <header className="cd-a-masthead">
        <a className="cd-a-wordmark" href="/">XUANYI<span>玄屹</span></a>
        <p>INDEPENDENT PRACTICE<br /><span>代码构建 · 设计表达</span></p>
        <nav aria-label="本页导航"><a href="#cd-a-work">作品 <sup>03</sup></a><a href="#cd-a-practice">关于实践 ↗</a></nav>
      </header>

      <p className="cd-a-edition">A PERSONAL JOURNAL OF THINKING & MAKING <span>2026 — ONGOING</span></p>
      <h1 id="cd-a-title" className="cd-a-title" aria-label="Curiosity takes shape."><span className="cd-a-curiosity">Curiosity</span><span className="cd-a-takes">takes</span><em className="cd-a-shape">shape.</em></h1>
      <div className="cd-a-object"><Sculpture variant="A" className="cd-a-sculpture" /><span className="cd-a-object-shadow" aria-hidden="true" /></div>
      <div className="cd-a-author">
        <p className="cd-a-name">玄屹<span>思考，然后动手。</span></p>
        <p>把好奇心，做成看得见的作品。<br />在 AI 工具、知识影像与交互叙事之间，<br />寻找想法落地的方式。</p>
        <a className="cd-a-work-link" href="#cd-a-work">进入作品 <span>↓</span></a>
      </div>

      <aside className="cd-a-evidence" aria-label="作品切片">
        <div className="cd-a-evidence-top"><span>FROM THE WORKBENCH</span><div data-direction-interaction="true" role="group" aria-label="选择作品切片">{[0, 1].map(index => <button key={index} type="button" aria-pressed={sample === index} onClick={() => setSample(index)} aria-label={index === 0 ? '查看 Router 真实设置页' : '查看 ATLAS 成片帧'}>0{index + 1}</button>)}</div></div>
        <a className={`cd-a-sample cd-a-sample-${sample}`} href={`/work/${selected.slug}/`} aria-label={`查看 ${selected.title} 项目详情`}>
          {/* Deliberate editorial crops of unaltered public project artifacts. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={sample} src={sample === 0 ? '/projects/router-settings.png' : '/projects/atlas-frame.jpg'} alt={selected.visual?.title ?? selected.title} width={sample === 0 ? 1440 : 1920} height={sample === 0 ? 1800 : 1080} />
          <span aria-hidden="true">↗</span>
        </a>
        <p aria-live="polite"><span>{sample === 0 ? '原生设置页 · 真实局部' : '《地图是一种选择》 · 成片第 10 秒'}</span><span>{sample === 0 ? 'SYSTEM / 01' : 'FILM / 02'}</span></p>
      </aside>
      <div className="cd-a-opening-foot"><span>好奇，自有形状。</span><p>SCROLL TO EXPLORE <span>↓</span></p><span>DESIGN & DEVELOPMENT BY XUANYI</span></div>
    </section>

    <section className="cd-a-works" id="cd-a-work" aria-labelledby="cd-a-works-title">
      <div className="cd-a-section-index"><span>01 / SELECTED WORKS</span><span>三个问题，三种做法。</span></div>
      <div className="cd-a-works-heading"><h2 id="cd-a-works-title">Ideas, with<br /><em>something to show.</em></h2><p>让选择变清楚，让原理被看见，<br />让经历成为新的提问。<br /><span>以下，都是已经动手做过的事。</span></p></div>
      <LivingGallery projects={projects} spatial="sky" />
      <div className="cd-a-work-end"><p>工具与系统 / 创意编程 / 交互体验</p><a href="/work/">完整作品索引 ↗</a></div>
    </section>

    <section className="cd-a-practice" id="cd-a-practice" aria-labelledby="cd-a-practice-title">
      <div className="cd-a-section-index"><span>02 / HOW I WORK</span><span>从疑问到作品</span></div>
      <div className="cd-a-practice-body"><div><p className="cd-a-practice-cn">理性负责构建。<br />好奇负责出发。</p><h2 id="cd-a-practice-title">A little logic.<br /><em>A little wonder.</em></h2></div><div className="cd-a-method"><p>你好，我是玄屹。我喜欢把「如果可以呢」，慢慢变成「原来真的可以」。</p><ol><li><span>01</span><div><h3>找到具体的问题</h3><p>从模型怎么选，到地图为何变形，先找到值得弄明白的一个细节。</p></div></li><li><span>02</span><div><h3>让想法可以被验证</h3><p>写代码、做画面、回看结果。保留过程，也诚实地保留边界。</p></div></li><li><span>03</span><div><h3>把过程留给下一次好奇</h3><p>作品公开，手记继续。让每一次完成，都成为下一次出发的材料。</p></div></li></ol></div></div>
    </section>

    <section className="cd-a-notes" aria-labelledby="cd-a-note-title"><p>03 / FIELD NOTES<br /><span>沿途的手记</span></p><a href="/notes/making-xuanyi/"><span>制作手记 · 2026.11.05</span><h2 id="cd-a-note-title">好奇的形状：<br />这个网站的第一笔</h2><span>从两条相遇的曲线开始。<i>↗</i></span></a></section>
    <footer className="cd-a-footer"><a href="#cd-a-title">XUANYI / 玄屹</a><span>Curiosity Takes Shape.</span><a href="https://github.com/Xuanyi-king">GITHUB ↗</a></footer>
  </div>;
}
