/** One reversible composition for both the director clock and native scrolling. */
const clamp=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t)};
const out=(v:number)=>1-(1-clamp(v))**3;
export function passingFrame(input:number,mobile=false){
 const p=clamp(input),turn=smooth((p-.28)/.36);
 const arrival=out((p-(mobile?.31:.34))/(mobile?.31:.32));
 const reveal=out((p-(mobile?.30:.33))/.32);
 return {
  turn,arrival,reveal,withdrawal:out((p-.28)/.32),
  title:1-smooth((p-.26)/.10),
  intro:smooth((p-.37)/.08)*(1-smooth((p-.55)/.12)),
  tabletIntro:smooth((p-.37)/.08)*(1-smooth((p-.48)/.05)),
  mark:1-smooth((p-.56)/.16),
  scale:1-turn*(mobile?.70:.65),
  guide:smooth((p-.29)/.16)*(1-smooth((p-.61)/.15)),
  stroke:out((p-.30)/.25),
  meta:smooth((p-.53)/.13),settle:smooth((p-.64)/.12),
  sides:smooth((p-.64)/.12),
  paper:smooth((p-.35)/.35),
  interactive:p>=.66?1:0,
  // Anticipation ends early, then a real pose hold precedes the main handoff.
  force:p<.12?Math.sin(Math.PI*p/.12)**2*9:0,
 };
}
/** Desktop sticky span is < one viewport; phone uses normal document flow. */
export function passingScrollProgress(top:number,viewport:number,_height:number,mobile:boolean){
 const anchor=mobile?72:100,travel=mobile?432:viewport*.8;
 return clamp((anchor-top)/Math.max(1,travel));
}
