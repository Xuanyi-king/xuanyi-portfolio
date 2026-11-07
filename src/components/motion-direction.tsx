'use client';
import { useEffect,useMemo,useRef,useState } from 'react';
import { LivingX } from './living-x';
import { LivingGallery } from './living-gallery';
import { projects } from '@/data/projects';
import { directionFrame,type Direction } from '@/motion/direction';
import { reducedQuery } from '@/motion/tokens';
export function MotionDirection(){
 const root=useRef<HTMLDivElement>(null),position=useRef(0),paint=useRef<(p:number)=>void>(()=>{});
 const [variant,setVariant]=useState<Direction>('thread'),[playing,setPlaying]=useState(false),[mode,setMode]=useState('score');
 const bridge=useMemo(()=>{const listeners=new Set<(v:number)=>void>();let last=NaN;return {direct:true,invalidate(){last=NaN},subscribe(fn:(v:number)=>void){listeners.add(fn);fn(0);return()=>{listeners.delete(fn)}},emit(v:number){if(v===last)return;last=v;listeners.forEach(fn=>fn(v))}}},[]);
 useEffect(()=>{
  const el=root.current!,stage=el.querySelector<HTMLElement>('.direction-stage')!,slider=el.querySelector<HTMLInputElement>('#direction-progress')!,output=el.querySelector<HTMLOutputElement>('output')!;
  const media=matchMedia(reducedQuery);let raf:number|null=null,previous:number|undefined;
  const draw=(p:number)=>{
   position.current=Math.max(0,Math.min(1,p));const f=directionFrame(media.matches&&mode==='scroll'?(position.current<.33?0:position.current<.67?.5:1):position.current,variant);
   for(const [k,v] of Object.entries(f))stage.style.setProperty('--'+k,String(v));
   stage.dataset.progress=String(position.current);stage.dataset.interactive=String(f.gallery>.98);slider.value=String(position.current*1000);output.value=(position.current*10).toFixed(1)+' / 10s';
   (el.querySelector('.direction-portal') as HTMLElement).inert=f.gallery<.98;(el.querySelector('.direction-form') as HTMLElement).inert=f.title<.1;bridge.emit(media.matches?0:f.force);
  };
  paint.current=draw;
  const scroll=()=>{if(raf===null)raf=requestAnimationFrame(()=>{raf=null;const rect=el.querySelector('.direction-scroll')!.getBoundingClientRect();draw(-rect.top/Math.max(1,rect.height-innerHeight+180))})};
  const tick=(now:number)=>{raf=null;if(document.hidden||media.matches){setPlaying(false);return}const dt=previous===undefined?0:Math.min(100,now-previous);previous=now;draw(position.current+dt/10000);if(position.current<1)raf=requestAnimationFrame(tick);else setPlaying(false)};
  const stop=()=>{if(raf!==null)cancelAnimationFrame(raf);raf=null;previous=undefined;setPlaying(false);}
  const preference=()=>{stop();bridge.invalidate();draw(position.current)};
  if(mode==='scroll'){addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);scroll()}
  else {draw(position.current);if(playing&&!media.matches)raf=requestAnimationFrame(tick);else if(playing)setPlaying(false)}
  media.addEventListener('change',preference);document.addEventListener('visibilitychange',stop);
  return()=>{if(raf!==null)cancelAnimationFrame(raf);removeEventListener('scroll',scroll);removeEventListener('resize',scroll);media.removeEventListener('change',preference);document.removeEventListener('visibilitychange',stop);paint.current=()=>{}};
 },[variant,playing,mode,bridge]);
 return <div ref={root} className={'direction-page direction-'+variant+' mode-'+mode}>
  <div className='direction-heading'><p>EXPERIMENT / 2.3 · 非正式首页</p><a href='/'>返回现有 2.2 ↗</a></div>
  <div className='direction-controls' aria-label='导演样片控制'>
   <div className='direction-options'>{(['thread','space'] as const).map((v,i)=><button key={v} aria-pressed={variant===v} onClick={()=>{setPlaying(false);paint.current(0);setVariant(v)}}>{i?'B · Spatial Unfolding':'A · Continuous Thread'}</button>)}</div>
   <div className='direction-transport'><button disabled={mode==='scroll'} onClick={()=>{if(position.current>=1)paint.current(0);setPlaying(true)}}>Play</button><button disabled={mode==='scroll'} onClick={()=>setPlaying(false)}>Pause</button><button disabled={mode==='scroll'} onClick={()=>{setPlaying(false);paint.current(0)}}>Restart</button><button aria-pressed={mode==='scroll'} onClick={()=>{setPlaying(false);setMode(mode==='score'?'scroll':'score')}}>{mode==='scroll'?'切回导演预演':'真实滚动模式'}</button></div>
   <label htmlFor='direction-progress'>进度 <input id='direction-progress' type='range' min='0' max='1000' defaultValue='0' disabled={mode==='scroll'} onChange={e=>{setPlaying(false);paint.current(Number(e.target.value)/1000)}}/></label><output aria-live="off">0.0 / 10s</output>
  </div>
  <p className='direction-instruction'>{mode==='scroll'?'原生滚动推进，向上恢复；底部可直接操作真实展廊。':'10 秒实时网页编排。按 Play，或拖动进度逐帧比较；减少动态效果时使用进度查看静态构图。'}</p>
  <div className='direction-scroll'><section className='direction-stage' aria-label='A Shape Becomes a World 实验画布'>
   <div className='direction-brand'>XUANYI <span>玄屹</span><small>A SHAPE BECOMES A WORLD</small></div>
   <div className='direction-form'><h1>Curiosity<br/>takes <em>shape.</em></h1><p>一个形状，<br/>慢慢生长成一个世界。</p><a className='pill-button' href='/work/'>探索作品 ↗</a></div>
   <svg className='direction-guide' viewBox='0 0 1200 700' preserveAspectRatio='none' fill='none' aria-hidden='true'><path pathLength='1' d={variant==='thread'?'M140 350 C300 350 540 60 840 160 C1100 240 940 450 730 490 C510 530 300 540 140 540 L1070 540':'M720 190 C1000 140 1080 400 890 470'}/></svg>
   <div className='direction-mark' aria-hidden='true'><LivingX drive={bridge}/></div>
   <div className='direction-intro'><p>好奇，是一切的起点。</p><span>从形状，到想法的落点。</span></div>
   <div className='direction-portal'><p className='direction-gallery-label'>好奇，无限延展。<span>EXPLORE / 03 REAL PROJECTS</span></p><LivingGallery projects={projects}/></div>
  </section></div>
  <p className='direction-end'>这是导演实验，不是正式首页。真实项目及素材来源沿用原站；概念封面和真实界面标注保持不变。</p>
  <noscript><p>预演需 JavaScript；<a href='/work/'>全部真实作品可直接浏览 ↗</a></p></noscript>
 </div>
}
