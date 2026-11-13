'use client';
import {useEffect,useCallback} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import dynamic from 'next/dynamic';
const VariantA=dynamic(()=>import('./variant-a').then(m=>m.VariantA));
const VariantB=dynamic(()=>import('./variant-b').then(m=>m.VariantB));
const VariantC=dynamic(()=>import('./variant-c').then(m=>m.VariantC));
const keys=['A','B','C'] as const;
const names={A:'Sky Editorial Sculpture',B:'Living Spatial Canvas',C:'Creative Playground'};
export function CreativePrototype(){
 const search=useSearchParams(),router=useRouter();
 const key=search.get('variant')?.toUpperCase();
 const variant=key==='B'||key==='C'?key:'A';
 const enabled=process.env.NODE_ENV!=='production'||process.env.NEXT_PUBLIC_CREATIVE_LAB==='1';
 const change=useCallback((next:string)=>{const params=new URLSearchParams(search.toString());params.set('variant',next);router.replace(`?${params}`,{scroll:false});window.scrollTo({top:0,behavior:'instant'})},[search,router]);
 useEffect(()=>{
  const keyboard=(e:KeyboardEvent)=>{const target=e.target as Element;if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||target.closest('input,textarea,select,[contenteditable],.living-gallery,[data-direction-interaction],a,button,[role="tablist"]'))return;if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();change(keys[(keys.indexOf(variant)+(e.key==='ArrowRight'?1:2))%3])}};
  document.addEventListener('keydown',keyboard);return()=>document.removeEventListener('keydown',keyboard);
 },[change,variant]);
 if(!enabled)return <div className="cd-root cd-loading"><h1>创意方向实验</h1><p>该实验仅在独立实验构建中启用。</p><a href="/">返回 XUANYI ↗</a></div>;
 return <div className="cd-root" data-variant={variant} data-prototype="creative-direction">
  <div key={variant}>{variant==='A'?<VariantA/>:variant==='B'?<VariantB/>:<VariantC/>}</div>
  <nav className="cd-switcher" aria-label="创意方向原型比较">
   <button aria-label="上一个方案" onClick={()=>change(keys[(keys.indexOf(variant)+2)%3])}>←</button>
   <div className="cd-switcher-keys">{keys.map(k=><button key={k} aria-current={variant===k?'page':undefined} onClick={()=>change(k)}>{k}</button>)}</div>
   <output data-prototype-state={variant}><b>{variant}</b><span>{names[variant]}</span><small>交互原型 · 本地实验</small></output>
   <button aria-label="下一个方案" onClick={()=>change(keys[(keys.indexOf(variant)+1)%3])}>→</button>
  </nav>
  <noscript><h1>XUANYI / 玄屹</h1><p>交互实验需要 JavaScript；真实项目可直接阅读。</p><a href="/work/adaptive-router/">Adaptive Router</a><a href="/work/knowledge-film/">知识影像</a><a href="/work/zhihu-multiverse/">知乎平行宇宙</a></noscript>
 </div>;
}
