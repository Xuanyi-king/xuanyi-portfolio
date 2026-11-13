'use client';
import {useEffect,useRef} from 'react';
import type {SculptureVariant} from './sculpture-renderer';
/** Shared rendering primitive, not a shared layout: each direction authors the object's job. */
export function Sculpture({variant,className=''}:{variant:SculptureVariant;className?:string}){
 const root=useRef<HTMLButtonElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const button=root.current!,surface=canvas.current!,media=matchMedia('(prefers-reduced-motion: reduce)');
  let renderer:ReturnType<typeof import('./sculpture-renderer')['createSculptureRenderer']>=null;
  let disposed=false,raf=0,visible=true,x=0,y=0,targetX=0,targetY=0,morph=0,targetMorph=0,start=performance.now(),active=false;
  const draw=(now:number)=>{
   raf=0;if(disposed||!renderer||!visible||document.hidden)return;
   const intro=media.matches?1:Math.min(1,(now-start)/1300),ease=1-(1-intro)**3;
   x+=(targetX-x)*.14;y+=(targetY-y)*.14;morph+=(targetMorph-morph)*.12;
   renderer.draw(media.matches?0:x,media.matches?0:y,media.matches?0:morph,ease);
   button.dataset.pose=`${x.toFixed(3)},${y.toFixed(3)}`;button.dataset.morph=morph.toFixed(3);
   if(!media.matches&&(intro<1||Math.abs(x-targetX)+Math.abs(y-targetY)+Math.abs(morph-targetMorph)>.001))schedule();
  };
  const schedule=()=>{if(!raf&&!disposed&&visible&&!document.hidden)raf=requestAnimationFrame(draw)};
  const move=(e:PointerEvent)=>{if(media.matches||e.pointerType==='touch')return;const r=button.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*.75;targetY=((e.clientY-r.top)/r.height-.5)*.5;schedule()};
  const leave=()=>{targetX=active?.72:0;targetY=0;schedule()};
  const click=()=>{active=!active;button.setAttribute('aria-pressed',String(active));targetX=active?.72:0;targetY=active?-.15:0;schedule()};
  const change=(e:Event)=>{const detail=(e as CustomEvent<{progress:number}>).detail;if(!detail)return;targetMorph=Math.max(0,Math.min(1,detail.progress||0));schedule()};
  const preference=()=>{targetX=targetY=0;x=y=0;morph=targetMorph=0;schedule()};
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else schedule()};
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)schedule();else{cancelAnimationFrame(raf);raf=0}},{rootMargin:'80px'});observer.observe(button);
  let size={width:button.clientWidth,height:button.clientHeight};
  const resize=new ResizeObserver(([entry])=>{size={width:entry.contentRect.width,height:entry.contentRect.height};renderer?.resize(size.width,size.height);schedule()});resize.observe(button);
  const section=button.closest('section')||button.parentElement!;
  button.addEventListener('pointermove',move);button.addEventListener('pointerleave',leave);button.addEventListener('click',click);section.addEventListener('cd-sculpture-change',change);media.addEventListener('change',preference);document.addEventListener('visibilitychange',visibility);
  void import('./sculpture-renderer').then(({createSculptureRenderer})=>{if(disposed)return;try{renderer=createSculptureRenderer(surface,variant);if(renderer){renderer.resize(size.width,size.height);start=performance.now();button.dataset.webglReady='true';button.dataset.triangles=String(renderer.triangles);schedule()}else button.dataset.webglReady='fallback'}catch{button.dataset.webglReady='fallback'}});
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();button.removeEventListener('pointermove',move);button.removeEventListener('pointerleave',leave);button.removeEventListener('click',click);section.removeEventListener('cd-sculpture-change',change);media.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);renderer?.dispose()};
 },[variant]);
 return <button ref={root} className={`cd-sculpture ${className}`} type="button" aria-label="转动玄屹的交叉雕塑" aria-pressed="false" data-direction-interaction="sculpture"><span className="cd-sculpture-fallback" aria-hidden="true">✕</span><canvas ref={canvas} aria-hidden="true"/></button>;
}
