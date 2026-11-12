const clamp=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t)};
/** The silhouette, depth turn and receiving content have separate phrases. */
export function skyFrame(input:number,width:number){
  const p=clamp(input),turn=smooth((p-.16)/.65);
  return {
    open:smooth((p-.18)/.62),
    mark:1-smooth((p-.87)/.13),
    force:p===0||p===1?0:Math.sin(Math.PI*p)**2*(width<=760?12:23),
    pitch:Math.sin(Math.PI*turn)*(width<=760?8:16),
    yaw:Math.sin(Math.PI*turn)*(width<=760?-9:-24),
    turn:turn*8,
    atmosphere:1-smooth((p-.12)/.8)*.6,
  };
}
