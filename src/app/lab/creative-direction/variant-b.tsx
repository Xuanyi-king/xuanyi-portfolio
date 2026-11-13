'use client';

// Throwaway B: does a continuous folded page make the path from identity to work legible?
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { projects } from '@/data/projects';
import { Sculpture } from './sculpture';
import './variant-b.css';

const surfaces = [
  { image: '/projects/router-settings.png', name: 'Router', note: '原生设置页 · 真实仓库截图', line: '让复杂的选择，\n找到清楚的路径。', short: '代码构建', word: 'ROUTER' },
  { image: '/projects/atlas-frame.jpg', name: 'ATLAS', note: '《地图是一种选择》· 真实成片帧', line: '让抽象的道理，\n在画面里发生。', short: '视觉解释', word: 'ATLAS' },
  { image: '/projects/multiverse-experience-reveal.jpg', name: '平行宇宙', note: '真实经历 · 项目交互界面', line: '从别人的经历，\n走回自己的现实。', short: '交互叙事', word: 'STORIES' },
];

export function VariantB() {
  const section = useRef<HTMLElement>(null);
  const readout = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState('交叉');
  const [reduced, setReduced] = useState(false);
  const phaseRef = useRef('交叉');
  const project = projects[active];
  const readable = phase === '观看' || phase === '静态展开';

  useEffect(() => {
    const host = section.current;
    if (!host) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const render = () => {
      frame = 0;
      const box = host.getBoundingClientRect();
      const raw = Math.max(0, Math.min(1, -box.top / Math.max(1, box.height - window.innerHeight)));
      const t = Math.max(0, Math.min(1, (raw - 0.025) / 0.65));
      const opening = t * t * (3 - 2 * t);
      host.style.setProperty('--open', String(motion.matches ? 1 : opening));
      host.style.setProperty('--journey', String(raw));
      if (readout.current) readout.current.textContent = `${String(Math.round(raw * 100)).padStart(2, '0')}%`;
      const next = motion.matches ? '静态展开' : raw < 0.16 ? '交叉' : raw < 0.66 ? '展开' : '观看';
      if (next !== phaseRef.current) {
        phaseRef.current = next;
        setPhase(next);
      }
      host.dispatchEvent(new CustomEvent('cd-sculpture-change', { detail: { progress: motion.matches ? 1 : opening } }));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(render); };
    const changeMotion = () => { setReduced(motion.matches); schedule(); };
    setReduced(motion.matches);
    render();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', changeMotion);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', changeMotion);
    };
  }, []);

  const openWork = useCallback((index?: number) => {
    if (typeof index === 'number') setActive((index + surfaces.length) % surfaces.length);
    const host = section.current;
    if (!host || reduced) return;
    const rect = host.getBoundingClientRect();
    const distance = Math.max(0, rect.height - window.innerHeight);
    window.scrollTo({ top: window.scrollY + rect.top + distance * 0.76, behavior: 'smooth' });
  }, [reduced]);

  return (
    <div className="cd-b">
      <section className="cd-b-journey" ref={section} data-phase={phase} aria-label="想法的折面：从交叉到作品">
        <div className="cd-b-stage">
          <header className="cd-b-masthead">
            <Link href="/" className="cd-b-wordmark" aria-label="XUANYI 玄屹首页">XUANYI<span>玄屹</span></Link>
            <span className="cd-b-masthead-note">A CONTINUOUS PRACTICE</span>
            <a href="#b-afterword" className="cd-b-about">关于这里 <span>↗</span></a>
          </header>

          <div className="cd-b-space" aria-hidden="true">
            <div className="cd-b-sky" />
            <div className="cd-b-fold-back" />
            <div className="cd-b-fold-floor" />
            <div className="cd-b-fold-edge" />
            <span className="cd-b-space-word">OPEN</span>
          </div>

          <div className="cd-b-reading-lane">
            <p className="cd-b-eyebrow"><span className="cd-b-dot" /> 想法的折面 / LIVING SPATIAL CANVAS</p>
            <div className="cd-b-intro" aria-hidden={phase === '观看' || reduced}>
              <p className="cd-b-intro-cn">设计表达。<br />代码构建。<br /><span>在好奇的交叉处相遇。</span></p>
              <p className="cd-b-intro-small">我是玄屹。把想法展开，<br />做成可以使用、观看与探索的东西。</p>
              <button className="cd-b-unfold" onClick={() => openWork()} tabIndex={phase === '交叉' ? 0 : -1} data-direction-interaction>展开这张画布 <span>↓</span></button>
            </div>
            <div className="cd-b-project-copy" aria-hidden={!readable} inert={!readable}>
              <span className="cd-b-work-number">SELECTED / 0{active + 1}</span>
              <h2>{surfaces[active].line}</h2>
              <p className="cd-b-project-name">{project.title}</p>
              <p className="cd-b-project-description">{project.description}</p>
              <Link className="cd-b-project-link" href={`/work/${project.slug}/`} data-direction-interaction tabIndex={readable ? 0 : -1}>走进这个项目 <span>↗</span></Link>
            </div>
          </div>

          <h1 className="cd-b-declaration"><span>Curiosity</span><span>takes shape<span className="cd-b-period">.</span></span></h1>
          <div className="cd-b-hinge"><Sculpture variant="B" className="cd-b-sculpture" /><span className="cd-b-hinge-label">交叉，是一个开始。<br /><small>轻触 X，换一个视角 ↗</small></span></div>

          <div className="cd-b-gallery-space" data-direction-interaction>
            <div className="cd-b-gallery-plane">
              <div className="cd-b-media-window">
                <div className="cd-b-media-track" style={{ transform: `translateX(-${active * 100}%)` }}>
                  {surfaces.map((surface, i) => (
                    <figure key={surface.name} className={`cd-b-project-surface cd-b-project-surface-${i}`} aria-hidden={active !== i}>
                      {/* Existing project evidence, deliberately displayed without invented application chrome. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={surface.image} alt={`${projects[i].title}：${surface.note}`} loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />
                      <figcaption><span>{surface.note}</span><span>0{i + 1} / 03</span></figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <div className="cd-b-plane-footer"><span>{surfaces[active].word}</span><span>{project.category}<br />{project.year} — {project.status.split(' · ')[0]}</span></div>
            </div>
            <div className="cd-b-plane-spine" aria-hidden="true"><span>代码构建 ↗ 设计表达</span></div>
          </div>

          <nav className="cd-b-project-nav" aria-label="选择画布上的项目" data-direction-interaction>
            <div className="cd-b-nav-label"><span>同一张画布，三种实践</span><span className="cd-b-nav-arrows"><button onClick={() => openWork(active - 1)} aria-label="上一个项目">←</button><button onClick={() => openWork(active + 1)} aria-label="下一个项目">→</button></span></div>
            <div className="cd-b-project-tabs">
              {surfaces.map((surface, i) => <button key={surface.name} aria-pressed={active === i} className={active === i ? 'is-active' : ''} onClick={() => openWork(i)}><span className="cd-b-tab-index">0{i + 1}</span><span>{surface.name}</span><span className="cd-b-tab-type">{surface.short}</span></button>)}
            </div>
          </nav>

          <div className="cd-b-route-state" aria-live="polite"><span>B / {phase}</span><span ref={readout} aria-hidden="true">00%</span><span>{reduced ? 'REDUCED MOTION' : 'SCROLL TO UNFOLD'} <b>↓</b></span></div>
          <div className="cd-b-progress" aria-hidden="true" />
        </div>
      </section>
      <section className="cd-b-afterword" id="b-afterword">
        <p className="cd-b-eyebrow">保持好奇，继续展开。</p>
        <h2>想法没有固定的形状。<br /><span>实践让它清晰。</span></h2>
        <div className="cd-b-afterword-bottom"><p>从工具，到影像，再到故事。<br />我在代码与设计之间，寻找值得继续做的事。</p><Link href="/notes/">沿途的思考 <span>↗</span></Link><a href="#" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' }); }}>回到交叉处 ↑</a></div>
      </section>
    </div>
  );
}
