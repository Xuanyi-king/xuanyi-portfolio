'use client';
import { XMark } from './x-mark';
import { LivingGallery } from './living-gallery';
import { projects } from '@/data/projects';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import type { SkyProfile } from '@/motion/sky-surface';
import type { Note } from '@/lib/notes';
import { useEffect, useMemo, useRef } from 'react';
import { LivingX } from './living-x';
import { bindSkyHero } from '@/motion/sky-hero';

export function SkyEdition({variant='sky',study=false,note}:{variant?:SkyProfile;study?:boolean;note?:Pick<Note,'slug'|'title'|'date'|'category'>}) {
  const root=useRef<HTMLDivElement>(null);
  const bridge=useMemo(()=>{
    const listeners=new Set<(force:number)=>void>();let last=0;
    return {subscribe(fn:(force:number)=>void){listeners.add(fn);fn(last);return()=>{listeners.delete(fn)}},emit(force:number){if(force===last)return;last=force;listeners.forEach(fn=>fn(force))}};
  },[]);
  useEffect(()=>{if(!study)return bindSkyHero(root.current!,bridge.emit)},[study,bridge]);
  return <div ref={root} className={`sky-page sky-${variant}`} data-sky-static={String(study)}>
    <div className="sky-lab-bar"><span>DESIGN STUDY / 03 — SKYLIGHT</span><span>{study?`${variant==='cloud'?'A · Cloud Silk':'B · Sky Ribbon'} · 静态视觉原型`:'3D Sky Edition · 视觉预览'}</span><a href="/">现有版本 ↗</a></div>
    <section className="sky-hero" aria-labelledby="sky-title">
      <div className="sky-atmosphere" aria-hidden="true"/>
      <div className="sky-hero-inner">
        <div className="sky-byline"><span>XUANYI <i>/</i> 玄屹</span><span>A PRACTICE IN THINKING & MAKING</span></div>
        <div className="sky-title-wrap"><p className="sky-eyebrow">代码里的理性，创作里的好奇。</p><h1 id="sky-title">Curiosity<br className="sky-title-break"/> takes <em>shape.</em></h1></div>
        <div className="sky-sculpture" aria-hidden="true"><div className="sky-pose"><div className="sky-fold">{study?<XMark profile={variant}/>:<LivingX profile={variant} drive={bridge}/>}</div></div><div className="sky-shadow"/></div>
        <div className="sky-hero-copy"><p>把好奇心，做成看得见的作品。</p><p>你好，我是玄屹。<br/>在 AI 工具与知识影像之间，<br className="sky-desktop-break"/>用代码构建，用设计表达。</p><div className="sky-actions"><a className="sky-primary" href="#sky-work">探索作品 <ArrowUpRight size={17}/></a><a href="/lab/sky-edition/notes/">沿途的手记 <span>↗</span></a></div></div>
        <div className="sky-object-label"><span>01 / THE SHAPE OF CURIOSITY</span><span>{variant==='cloud'?'Cloud Silk':'Sky Ribbon'}<i>晴空里的好奇心</i></span></div>
        <div className="sky-hero-foot"><a href="#sky-work"><ArrowDown size={15}/> 向下，让想法轻轻展开</a><span>好奇，自有形状。</span><span>SKYLIGHT / 2026</span></div>
      </div>
    </section>
    <section className="sky-work" id="sky-work" aria-labelledby="sky-work-title">
      <div className="sky-section-heading"><div><p className="sky-eyebrow">01 / SELECTED WORK</p><h2 id="sky-work-title">Ideas, out<br/>in the <em>open.</em></h2></div><p>一些想法的落地，<br/>也是下一次探索的开始。</p></div>
      <LivingGallery projects={projects} spatial="sky"/>
      <div className="sky-work-end"><span>从工具到影像，每一个项目都是一种提问。</span><a href="/lab/sky-edition/work/">所有作品 <sup>03</sup> ↗</a></div>
    </section>
    <section className="sky-about"><p className="sky-eyebrow">02 / A LITTLE INTRODUCTION</p><div><h2>A little logic.<br/><em>A little wonder.</em></h2><p>好奇，是一切的起点。我喜欢把「如果可以呢」，<br className="sky-desktop-break"/>慢慢变成「原来真的可以」。</p><p>我把对模型选择的疑问做成插件，用程序动画解释地图的取舍，<br className="sky-desktop-break"/>也尝试让真实经历成为可探索的故事。</p><a href="/lab/sky-edition/about/">认识一下 <ArrowUpRight size={16}/></a></div><div className="sky-about-mark" aria-hidden="true"><XMark profile={variant} compact/></div></section>
    <section className="sky-notes"><div><p className="sky-eyebrow">03 / NOTES ALONG THE WAY</p><h2>Room for <em>thought.</em></h2></div>{note&&<a href={`/notes/${note.slug}/`}><span>{note.category} · {note.date}</span><h3>{note.title}</h3><span>读这篇手记 ↗</span></a>}</section>
  </div>;
}
