const clamp=(v:number)=>Math.max(0,Math.min(1,Number.isFinite(v)?v:0));
const smooth=(v:number)=>{const t=clamp(v);return t*t*(3-2*t)};
/** The silhouette, depth turn and receiving content have separate phrases. */
export function skyFrame(input:number,width:number){
  const p=clamp(input),turn=smooth((p-.16)/.65);
  return {
    open:smooth((p-.18)/.62),
    mark:1-smooth((p-.87)/.13),
    pitch:Math.sin(Math.PI*turn)*(width<=760?8:16),
    yaw:Math.sin(Math.PI*turn)*(width<=760?-9:-24),
    turn:turn*8,
    atmosphere:1-smooth((p-.12)/.8)*.6,
  };
}
import { foldFrame, type FoldMetrics } from './folding';

/** On a phone, the full-width reading lane takes priority over nav docking. */
export function skyTransport(input:number,metrics:FoldMetrics){
  const p=clamp(input),base=foldFrame(p,metrics);
  if(metrics.width>760)return base;
  const margin=smooth((p-.28)/.2);
  const narrow=metrics.width<=370;
  return {...base,
    x:base.x*(1-margin)+(metrics.width-(narrow?13:20)-metrics.centerX)*margin,
    scale:base.scale+(Math.min(base.scale,narrow?.1:.15)-base.scale)*margin,
  };
}
