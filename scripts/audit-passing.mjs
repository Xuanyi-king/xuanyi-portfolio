import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import { analyzeCanvasTrace } from './lib/canvas-trace.mjs';
const base=process.env.BROWSER_BASE_URL??'http://localhost:4189';
const dir='artifacts/browser/passing-curve/audit';await fs.mkdir(dir,{recursive:true});
console.log('launch');const browser=await chromium.launch(),reports=[];console.log('launched');
for(const ablation of ['normal','profile','no-guide','no-x','no-parent-perspective','root-vars-frozen']){
 const c=await browser.newContext({viewport:{width:1440,height:900}}),p=await c.newPage(),cdp=await c.newCDPSession(p);
 console.log('context',ablation);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Performance.enable');
 console.log('goto',ablation);await p.goto(base+'/lab/motion-direction/');await p.evaluate(()=>document.fonts.ready);await p.locator('.direction-stage').scrollIntoViewIfNeeded();
 if(ablation==='no-guide')await p.addStyleTag({content:'.direction-guide{display:none!important}'});
 if(ablation==='no-x')await p.addStyleTag({content:'.direction-mark{display:none!important}'});
 if(ablation==='no-parent-perspective')await p.addStyleTag({content:'.direction-stage{perspective:none!important}'});
 if(ablation==='root-vars-frozen')await p.evaluate(()=>{const style=document.querySelector('.direction-stage').style,original=style.setProperty.bind(style);style.setProperty=(key,...values)=>{if(!key.startsWith('--'))original(key,...values)}});
 console.log('loaded',ablation);const traced=ablation==='profile';
 if(traced){console.log('profiler',ablation);await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:1000});await cdp.send('Profiler.start');console.log('tracing',ablation);await cdp.send('Tracing.start',{categories:'-*,toplevel,devtools.timeline,blink.user_timing,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});}
 await p.evaluate(()=>{performance.mark('canvas:interactive-start');window.framesA=[];window.collectA=true;let last;requestAnimationFrame(function tick(t){if(last)window.framesA.push(t-last);last=t;if(window.collectA)requestAnimationFrame(tick)});window.mutationsA={path:0,style:0};new MutationObserver(ms=>ms.forEach(m=>{if(m.attributeName==='d')window.mutationsA.path++;if(m.attributeName==='style')window.mutationsA.style++})).observe(document.querySelector('.direction-stage'),{subtree:true,attributes:true});});
 console.log('start',ablation);const before=await cdp.send('Performance.getMetrics');await p.getByRole('button',{name:'Play',exact:true}).click();await p.waitForTimeout(10400);
 await p.evaluate(()=>{window.collectA=false;performance.mark('canvas:interactive-end')});const after=await cdp.send('Performance.getMetrics');
 const data=await p.evaluate(()=>({frames:window.framesA,mutations:window.mutationsA})),values=data.frames.sort((a,b)=>a-b);
 const report={ablation,traced,p50:values[Math.floor(values.length*.5)],p95:values[Math.floor(values.length*.95)],p99:values[Math.floor(values.length*.99)],over50:values.filter(v=>v>50).length,mutations:data.mutations};
 for(const name of ['ScriptDuration','LayoutDuration','RecalcStyleDuration','TaskDuration'])report[name+'Ms']=1000*(after.metrics.find(m=>m.name===name).value-before.metrics.find(m=>m.name===name).value);
 console.log('capture-end',ablation);if(traced){await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});const profile=(await cdp.send('Profiler.stop')).profile;const done=new Promise(r=>cdp.once('Tracing.tracingComplete',r));await cdp.send('Tracing.end');const {stream}=await done;let raw='';for(;;){const v=await cdp.send('IO.read',{handle:stream});raw+=v.data;if(v.eof)break}await cdp.send('IO.close',{handle:stream});const trace=JSON.parse(raw);report.analysis=analyzeCanvasTrace(trace,profile);await fs.writeFile(`${dir}/${ablation}.trace.json`,raw);await fs.writeFile(`${dir}/${ablation}.cpuprofile`,JSON.stringify(profile));}
 reports.push(report);console.log(ablation,JSON.stringify(report));await c.close();
}
await browser.close();await fs.writeFile(dir+'/results.json',JSON.stringify({source:'453caa478e157bcf7e4264903c729d1d6ba8c878 exact untouched export',cpu:4,reports},null,2));
