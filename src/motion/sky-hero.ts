import gsap from 'gsap';
import type { FoldMetrics } from './folding';
import { skyFrame, skyTransport } from './sky-transition';
import { pointerTilt } from './pointer-geometry';

/** Native scrolling only. Each transform has one owner and no idle RAF. */
export function bindSkyHero(root:HTMLElement) {
  const hero=root.querySelector<HTMLElement>('.sky-hero')!;
  const sculpture=root.querySelector<HTMLElement>('.sky-sculpture')!;
  const pose=root.querySelector<HTMLElement>('.sky-pose')!;
  const fold=root.querySelector<HTMLElement>('.sky-fold')!;
  const shadow=root.querySelector<HTMLElement>('.sky-shadow')!;
  const atmosphere=root.querySelector<HTMLElement>('.sky-atmosphere')!;
  const heading=root.querySelector<HTMLElement>('.sky-section-heading')!;
  const viewport=root.querySelector<HTMLElement>('.gallery-viewport')!;
  const caption=root.querySelector<HTMLElement>('.sky-object-label')!;
  const icon=document.querySelector<SVGSVGElement>('.wordmark>svg')!;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let raf:number|null=null,metrics:FoldMetrics,disposed=false,progress=0;
  const context=gsap.context(()=>{},root);
  let rx:ReturnType<typeof gsap.quickTo>|undefined,ry:ReturnType<typeof gsap.quickTo>|undefined;
  const clear=()=>{
    for(const el of [sculpture,fold,shadow,atmosphere,heading,viewport,caption])el.removeAttribute('style');
    gsap.set(pose,{clearProps:'transform'});root.dataset.skyProgress='0';
  };
  const measure=()=>{
    sculpture.style.transform='none';
    const a=sculpture.getBoundingClientRect(),b=icon.getBoundingClientRect();
    const header=icon.closest('header')!.getBoundingClientRect();
    const heroTop=hero.getBoundingClientRect().top+scrollY;
    metrics={centerX:a.left+a.width/2,centerY:a.top+scrollY+a.height/2,start:Math.max(0,heroTop-header.bottom),distance:Math.min(660,hero.offsetHeight*.86),navX:b.left+b.width/2,navY:b.top+b.height/2,scale:b.width/a.width,width:innerWidth,headerBottom:header.bottom,navSize:b.width};
  };
  const draw=()=>{
    raf=null;if(disposed||!metrics||media.matches)return;
    progress=Math.max(0,Math.min(1,(scrollY-metrics.start)/metrics.distance));
    const f=skyFrame(progress,innerWidth),transport=skyTransport(progress,metrics);
    sculpture.style.transform=`translate3d(${transport.x.toFixed(2)}px,${transport.y.toFixed(2)}px,0) rotate(${transport.rotation.toFixed(2)}deg) scale(${transport.scale.toFixed(5)})`;
    sculpture.style.opacity=f.mark.toFixed(3);
    fold.style.transform=`perspective(1100px) rotateX(${f.pitch.toFixed(2)}deg) rotateY(${f.yaw.toFixed(2)}deg) rotate(${f.turn.toFixed(2)}deg)`;
    shadow.style.opacity=(1-progress).toFixed(3);
    atmosphere.style.opacity=f.atmosphere.toFixed(3);
    caption.style.opacity=(1-Math.min(1,progress*4)).toFixed(3);
    // The actual project space opens in document flow, never pinned or intercepted.
    heading.style.transform=`translateY(${(16*(1-f.open)).toFixed(2)}px)`;
    viewport.style.clipPath=f.open>=.999?'none':`inset(${(5*(1-f.open)).toFixed(2)}% 0 0 0 round ${(9*(1-f.open)).toFixed(2)}px)`;
    root.dataset.skyProgress=progress.toFixed(4);
  };
  const schedule=()=>{if(raf===null&&!media.matches&&!document.hidden)raf=requestAnimationFrame(draw)};
  const resize=()=>{if(media.matches)return;measure();schedule()};
  const resetPointer=()=>{rx?.(0);ry?.(0);schedule()};
  const pointer=(event:PointerEvent)=>{
    if(media.matches||progress>.55||event.pointerType==='touch')return;
    const t=pointerTilt(event.clientX,event.clientY,hero.getBoundingClientRect());
    rx?.(t.y*.6);ry?.(t.x*.8);
  };
  const touch=(event:PointerEvent)=>{
    if(event.pointerType!=='touch'||media.matches||progress>.2||(event.target as Element).closest('a,button'))return;
    rx?.(-1);
  };
  const setup=()=>{
    rx?.tween.kill();ry?.tween.kill();context.revert();
    if(raf!==null)cancelAnimationFrame(raf);raf=null;clear();
    if(media.matches)return;
    context.add(()=>{
      gsap.set(pose,{rotationX:0,rotationY:0,transformPerspective:1100});
      rx=gsap.quickTo(pose,'rotationX',{duration:.85,ease:'power2.out'});
      ry=gsap.quickTo(pose,'rotationY',{duration:.85,ease:'power2.out'});
    });
    measure();draw();
  };
  const visibility=()=>{if(document.hidden){if(raf!==null)cancelAnimationFrame(raf);raf=null;resetPointer()}else resize()};
  setup();
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize,{passive:true});
  hero.addEventListener('pointermove',pointer);hero.addEventListener('pointerleave',resetPointer);hero.addEventListener('pointercancel',resetPointer);
  hero.addEventListener('pointerdown',touch,{passive:true});hero.addEventListener('pointerup',resetPointer);
  media.addEventListener('change',setup);document.addEventListener('visibilitychange',visibility);
  void document.fonts.ready.then(()=>{if(!disposed)resize()});
  return()=>{
    disposed=true;if(raf!==null)cancelAnimationFrame(raf);
    removeEventListener('scroll',schedule);removeEventListener('resize',resize);
    hero.removeEventListener('pointermove',pointer);hero.removeEventListener('pointerleave',resetPointer);hero.removeEventListener('pointercancel',resetPointer);
    hero.removeEventListener('pointerdown',touch);hero.removeEventListener('pointerup',resetPointer);
    media.removeEventListener('change',setup);document.removeEventListener('visibilitychange',visibility);
    rx?.tween.kill();ry?.tween.kill();context.revert();clear();
  };
}
