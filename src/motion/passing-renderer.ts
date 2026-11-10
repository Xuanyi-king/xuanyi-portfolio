import { passingFrame } from './passing';
/** Scope animated properties to their actual surfaces, never inherited stage variables. */
export function createPassingRenderer(stage:HTMLElement){
 const node=(s:string)=>stage.querySelector<HTMLElement>(s)!;
 const mark=node('.direction-mark'),form=node('.direction-form'),intro=node('.direction-intro');
 const portal=node('.direction-portal'),guide=node('.passing-guide');
 const paths=[...guide.querySelectorAll<SVGPathElement>('path')];
 const covers=[...portal.querySelectorAll<HTMLElement>('.project-cover')];
 const metas=[...portal.querySelectorAll<HTMLElement>('.project-meta')];
 const cards=[...portal.querySelectorAll<HTMLElement>('.gallery-card')];
 const label=node('.direction-gallery-label'),controls=node('.gallery-controls');
 const write=(el:HTMLElement|SVGElement,key:string,value:string)=>{if(el.style.getPropertyValue(key)!==value)el.style.setProperty(key,value)};
 const visible=(el:HTMLElement|SVGElement,v:number)=>{write(el,'visibility',v>.001?'visible':'hidden');write(el,'opacity',v.toFixed(3))};
 let width=stage.clientWidth,mobile=innerWidth<=760,coverWidth=covers[0].clientWidth;const scrolling=!!stage.closest('.mode-scroll');
 return {
  resize(){width=stage.clientWidth;mobile=innerWidth<=760;coverWidth=covers[0].clientWidth},
  paint(p:number){
   const f=passingFrame(p,mobile);
   visible(form,f.title);if(form.inert!==(f.title<.15))form.inert=f.title<.15;
   visible(intro,!mobile&&width<1000?f.tabletIntro:f.intro);
   visible(mark,f.mark);
   write(mark,'transform',`translate(${(width*(mobile?.18:width<900?-.62:-.55)*f.withdrawal).toFixed(2)}px,${(-f.turn*(mobile?180:72)).toFixed(2)}px) rotate(${(-f.turn*12).toFixed(2)}deg) scale(${f.scale.toFixed(4)})`);
   visible(guide,f.guide);
   write(guide,'transform',`translateX(${((1-f.arrival)*width*(mobile?.12:.2)+width*(.5-(mobile?145:390)/1200)-coverWidth/2).toFixed(2)}px)`);
   for(const path of paths)write(path,'stroke-dashoffset',(1-f.stroke).toFixed(4));
   visible(portal,f.reveal>0?1:0);
   write(portal,'transform',`translate(${((1-f.arrival)*width*(mobile?.12:.2)).toFixed(2)}px,${mobile&&!scrolling?(-84*f.settle).toFixed(2):0}px)`);
   // Cropping opens the real cover from the receiving edge. The controller owns card transforms.
   for(const cover of covers)write(cover,'clip-path',f.reveal>=1?'none':`inset(0 ${(100*(1-f.reveal)).toFixed(2)}% 0 0 round 12px)`);
   for(const meta of metas)visible(meta,f.meta);
   for(const card of cards)write(card.querySelector<HTMLElement>('.gallery-link')!,'opacity',f.sides.toFixed(3));
   visible(label,f.sides);visible(controls,f.sides);
   if(portal.inert!==!f.interactive)portal.inert=!f.interactive;
   write(portal,'pointer-events',f.interactive?'auto':'none');
   // A very slight paper-temperature shift, no full-screen animated gradient.
   write(stage,'background-color',`rgb(${Math.round(241+f.paper*5)} ${Math.round(247-f.paper)} ${Math.round(248-f.paper*7)})`);
   return f;
  }
 };
}
