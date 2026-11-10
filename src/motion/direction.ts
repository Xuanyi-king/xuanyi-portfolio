export type Direction = 'thread' | 'space';
const smooth=(x:number)=>{const t=Math.max(0,Math.min(1,x));return t*t*(3-2*t)};
export function directionFrame(input:number, variant:Direction){
 const p=Number.isFinite(input)?Math.max(0,Math.min(1,input)):0;
 const turn=smooth((p-.23)/.43),gallery=smooth((p-.53)/.26);
 return {turn,gallery,intro:smooth((p-.3)/.12)*(1-smooth((p-.48)/.12)),title:1-smooth((p-.25)/.25),
  scale:1-turn*(variant==='thread'?.82:.7),
  x:turn*(variant==='thread'?-38:34),y:turn*(variant==='thread'?18:-28),
  rotate:turn*(variant==='thread'?9:-23),
  thread:variant==='thread'?smooth((p-.1)/.54):1-turn,
  force:p<.23?Math.sin(Math.PI*p/.23)**2*18:0,
  spread:variant==='space'?smooth((p-.43)/.35):0,
  mark:1-smooth((p-.56)/.16)};
}
