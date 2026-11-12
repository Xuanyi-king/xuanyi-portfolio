import type { Point } from './geometry';

export type SkyProfile = 'cloud' | 'sky';
type Vector = { x: number; y: number; z: number };
const n = (v: number) => +v.toFixed(2);
const xy = (p: Point) => `${n(p.x)} ${n(p.y)}`;
const unit = (v: Vector): Vector => {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return { x: v.x / length, y: v.y / length, z: v.z / length };
};
function line(points: Point[], move = true) {
  let d = move ? `M${xy(points[0])}` : '';
  for (let i = 0; i < points.length - 1; i++) {
    const a=points[Math.max(0,i-1)], b=points[i], c=points[i+1], e=points[Math.min(points.length-1,i+2)];
    d += `C${xy({x:b.x+(c.x-a.x)/6,y:b.y+(c.y-a.y)/6})} ${xy({x:c.x-(e.x-b.x)/6,y:c.y-(e.y-b.y)/6})} ${xy(c)}`;
  }
  return d;
}
const polygon = (a: Point[], b: Point[]) => `${line(a)}L${xy(b.at(-1)!)}${line([...b].reverse(),false)}Z`;

/** A sampled 3D ruled surface, orthographic camera and rough diffuse light.
 * SVG is the display medium. Geometry, normals and thickness exist in 3D;
 * we deliberately do not ship a scene engine or claim volumetric transmission.
 */
export function skySurface(curve: Point[], index: number, profile: SkyProfile, compact = false) {
  const steps=compact?14:36, count=compact?6:22;
  const [a,b,c,d]=curve;
  const at=(t:number,u:number):Vector=>{
    const v=1-t;
    const x=v*v*v*a.x+3*v*v*t*b.x+3*v*t*t*c.x+t*t*t*d.x;
    const y=v*v*v*a.y+3*v*v*t*b.y+3*v*t*t*c.y+t*t*t*d.y;
    const dx=3*v*v*(b.x-a.x)+6*v*t*(c.x-b.x)+3*t*t*(d.x-c.x);
    const dy=3*v*v*(b.y-a.y)+6*v*t*(c.y-b.y)+3*t*t*(d.y-c.y);
    const length=Math.hypot(dx,dy)||1;
    const width=profile==='cloud'?34+10*Math.sin(Math.PI*t):29+8*Math.sin(Math.PI*t)**2;
    const twist=(index===0?1:-1)*(profile==='cloud'?.48:.92)*Math.sin(Math.PI*(t*1.65-.3));
    const across=width*u*Math.cos(twist);
    const z=(index===0?-11:14)+Math.sin(Math.PI*t)*(profile==='cloud'?21:36)+width*u*Math.sin(twist)+width*(profile==='cloud'?.4:.2)*(1-u*u);
    return {x:x-dy/length*across,y:y+dx/length*across,z};
  };
  const project=(p:Vector):Point=>({x:250+(p.x-250)*.976+p.z*.218,y:250+(p.y-250)*.984-p.z*.178});
  const samples=(u:number)=>Array.from({length:steps+1},(_,i)=>project(at(i/steps,u)));
  const strip=(u:number,v:number)=>polygon(samples(u),samples(v));
  const light=unit({x:-.35,y:-.5,z:.85});
  const shade=(t:number,u:number)=>{
    const p=at(t,u),dt=at(Math.min(1,t+.002),u),du=at(t,u+.002);
    const tangent={x:dt.x-p.x,y:dt.y-p.y,z:dt.z-p.z};
    const across={x:du.x-p.x,y:du.y-p.y,z:du.z-p.z};
    let normal=unit({x:tangent.y*across.z-tangent.z*across.y,y:tangent.z*across.x-tangent.x*across.z,z:tangent.x*across.y-tangent.y*across.x});
    if(normal.z<0)normal={x:-normal.x,y:-normal.y,z:-normal.z};
    const diffuse=Math.max(0,normal.x*light.x+normal.y*light.y+normal.z*light.z);
    const amount=Math.max(0,Math.min(1,(diffuse-.15)/.85));
    const blue=index===0;
    const dark=blue?(profile==='cloud'?[112,160,194]:[82,137,180]):[170,199,219];
    const bright=blue?[204,230,247]:[251,253,249];
    const rgb=dark.map((v,i)=>Math.round(v+(bright[i]-v)*amount));
    return '#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('');
  };
  const bands=Array.from({length:count},(_,i)=>{
    const u=-1+i*2/count, v=u+2/count;
    return {d:strip(u,Math.min(1,v+.0015)),stops:Array.from({length:9},(_,j)=>shade(.012+j*.122,(u+v)/2))};
  });
  const edge=samples(1), thickness=profile==='cloud'?2.4:4;
  const bottom=edge.map(p=>({x:p.x+.7,y:p.y+thickness}));
  const z=Array.from({length:steps+1},(_,i)=>at(i/steps,1).z);
  return {outline:strip(-1,1),rim:polygon(edge,bottom),bands,depthRange:Math.max(...z)-Math.min(...z)};
}
