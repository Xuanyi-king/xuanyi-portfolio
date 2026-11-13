import { useId } from 'react';
import { ribbonGeometry } from '@/motion/geometry';
import { skySurface, type SkyProfile } from '@/motion/sky-surface';

export function SkyXMark({profile,compact=false,className='',decorative=true}:{profile:SkyProfile;compact?:boolean;className?:string;decorative?:boolean}) {
  const id='sky'+useId().replace(/[^a-zA-Z0-9_-]/g,'');
  const surfaces=ribbonGeometry({x:0,y:0},{x:0,y:0}).curves.map((c,i)=>skySurface(c,i,profile,compact));
  const layer=(index:number)=><g className={`sky-surface sky-surface-${index}`}>
    <path data-sky-rim={index} d={surfaces[index].rim} fill={index===0?'#719bbc':'#a6c3d8'}/>
    <path data-sky-outline={index} d={surfaces[index].outline} fill={index===0?'#abcde5':'#e4eff6'}/>
    {surfaces[index].bands.map((b,j)=><path key={j} data-sky-band={`${index}-${j}`} d={b.d} fill={`url(#${id}-${index}-${j})`} stroke={`url(#${id}-${index}-${j})`} strokeWidth=".45" strokeLinejoin="round"/>)}
    <path data-sky-outline={index} d={surfaces[index].outline} fill="none" stroke={index===0?'#a9cfe7':'#fff'} strokeWidth=".65" opacity=".55"/>
  </g>;
  return <svg className={`x-mark sky-form ${className}`} data-profile={profile} data-compact={compact||undefined} viewBox="0 0 500 500" fill="none" aria-hidden={decorative||undefined} role={decorative?undefined:'img'} aria-label={decorative?undefined:'XUANYI · 晴空中交错的丝带雕塑'}>
    <defs>
      {surfaces.flatMap((s,i)=>s.bands.map((b,j)=><linearGradient key={`${i}-${j}`} id={`${id}-${i}-${j}`} data-sky-light={`${i}-${j}`} x1={i===0?112:390} y1="100" x2={i===0?390:110} y2="382" gradientUnits="userSpaceOnUse">{b.stops.map((color,k)=><stop key={k} offset={k/8} stopColor={color}/>)}</linearGradient>))}
      <clipPath id={`${id}-back`}><path data-sky-outline="0" d={surfaces[0].outline}/></clipPath>
      <filter id={`${id}-contact`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={compact?1:3}/></filter>
    </defs>
    {layer(0)}
    {!compact&&<g clipPath={`url(#${id}-back)`}><path data-sky-outline="1" d={surfaces[1].outline} transform="translate(1 5)" fill="#335a7a" opacity=".19" filter={`url(#${id}-contact)`}/></g>}
    {layer(1)}
  </svg>;
}
