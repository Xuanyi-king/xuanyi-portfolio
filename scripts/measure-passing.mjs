/** No browser recordings/builds should run concurrently with this measurement. */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { analyzeCanvasTrace } from './lib/canvas-trace.mjs';
const dir=(process.env.BROWSER_EVIDENCE_DIR??'artifacts/browser')+'/passing-curve/performance';await fs.mkdir(dir,{recursive:true});
const urls={baseline:process.env.PASSING_BASELINE_URL??'http://localhost:4191',oldA:process.env.PASSING_OLD_URL??'http://localhost:4189',cut:process.env.BROWSER_BASE_URL??'http://localhost:4187'};
const cases=['baseline','oldA','cut'],reports=[],profiles=[],director=[];
const sourceFiles=execFileSync('git',['ls-files','-z','src','scripts','tests','package.json','package-lock.json','next.config.ts']).toString().split('\0').filter(Boolean),hash=createHash('sha256');for(const name of sourceFiles){hash.update(name);hash.update(await fs.readFile(name))}const provenance={sourceTree:execFileSync('git',['rev-parse','HEAD^{tree}']).toString().trim(),workingTreeDirty:!!execFileSync('git',['status','--porcelain']).toString().trim(),sourceFingerprint:hash.digest('hex')};
const b=await chromium.launch();
async function sample(kind,width,height,{traced=false,timed=false,round=0}={}){
 const c=await b.newContext({viewport:{width,height}}),p=await c.newPage(),cdp=await c.newCDPSession(p);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Performance.enable');
 await p.addInitScript(()=>{window.metricsP={longTasks:[],lcp:0,cls:0};for(const type of ['longtask','largest-contentful-paint','layout-shift'])new PerformanceObserver(l=>{for(const e of l.getEntries()){if(type==='longtask')window.metricsP.longTasks.push({start:e.startTime,duration:e.duration});if(type==='largest-contentful-paint')window.metricsP.lcp=e.startTime;if(type==='layout-shift'&&!e.hadRecentInput)window.metricsP.cls+=e.value}}).observe({type,buffered:true})});
 await p.goto(urls[kind]+(kind==='baseline'?'/':'/lab/motion-direction/'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1800);
 if(kind!=='baseline'){
  await p.getByRole('button',{name:kind==='cut'?'Director’s Cut · The Passing Curve':'A · Continuous Thread',exact:true}).click();
  if(!timed)await p.getByRole('button',{name:'真实滚动模式',exact:true}).click();
 }
 await p.evaluate(({kind,timed})=>{const el=kind==='baseline'?document.querySelector('.hero'):document.querySelector('.direction-scroll');scrollTo({top:el.getBoundingClientRect().top+scrollY-(innerWidth<=760?72:100),behavior:'instant'})},{kind,timed});await p.waitForTimeout(250);
 if(traced){await cdp.send('Profiler.enable');await cdp.send('Profiler.setSamplingInterval',{interval:1000});await cdp.send('Profiler.start');await cdp.send('Tracing.start',{categories:'-*,toplevel,devtools.timeline,blink.user_timing,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});}
 const before=await cdp.send('Performance.getMetrics');
 await p.evaluate(()=>{performance.mark('canvas:interactive-start');window.startP=performance.now();window.framesP=[];window.collectP=true;let last;requestAnimationFrame(function tick(t){if(last)window.framesP.push(t-last);last=t;if(window.collectP)requestAnimationFrame(tick)});});
 if(timed){await p.getByRole('button',{name:'Play',exact:true}).evaluate(el=>el.click());await p.waitForTimeout(10300)}
 else{
  for(const delta of [120,120,120,120,120,120]){await p.mouse.wheel(0,delta);await p.waitForTimeout(140)}
  await p.waitForTimeout(500);await p.mouse.wheel(0,-500);await p.waitForTimeout(240);await p.mouse.wheel(0,1000);await p.waitForTimeout(400);
  await p.locator('.living-gallery .gallery-controls').scrollIntoViewIfNeeded();await p.waitForTimeout(250);
  for(const name of ['下一个作品','下一个作品','上一个作品']){await p.getByRole('button',{name,exact:true}).click();await p.waitForTimeout(550)}
  const r=await p.locator('.gallery-stage').boundingBox();await p.mouse.move(r.x+r.width*.63,r.y+90);await p.mouse.down();await p.mouse.move(r.x+r.width*.22,r.y+93,{steps:18});await p.mouse.up();await p.waitForTimeout(800);
 }
 await p.evaluate(()=>{window.collectP=false;performance.mark('canvas:interactive-end')});const after=await cdp.send('Performance.getMetrics');
 const data=await p.evaluate(()=>({frames:window.framesP,start:window.startP,...window.metricsP,progress:document.querySelector('.direction-stage')?.dataset.progress}));const frames=data.frames.sort((a,b)=>a-b);
 const result={kind,width,height,round,traced,timed,cpu:4,samples:frames.length,p50:frames[Math.floor(frames.length*.5)],p95:frames[Math.floor(frames.length*.95)],p99:frames[Math.floor(frames.length*.99)],over50:frames.filter(v=>v>50).length,longTasks:data.longTasks.filter(v=>v.start>=data.start),loadLongTasks:data.longTasks.filter(v=>v.start<data.start),lcp:data.lcp,cls:data.cls,finalProgress:data.progress};
 for(const name of ['ScriptDuration','LayoutDuration','RecalcStyleDuration','TaskDuration'])result[name+'Ms']=1000*(after.metrics.find(m=>m.name===name).value-before.metrics.find(m=>m.name===name).value);
 if(traced){await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});const profile=(await cdp.send('Profiler.stop')).profile;const done=new Promise(r=>cdp.once('Tracing.tracingComplete',r));await cdp.send('Tracing.end');const {stream}=await done;let raw='';for(;;){const v=await cdp.send('IO.read',{handle:stream});raw+=v.data;if(v.eof)break}await cdp.send('IO.close',{handle:stream});const trace=JSON.parse(raw);result.analysis=analyzeCanvasTrace(trace,profile);await fs.writeFile(`${dir}/${kind}-${width}.trace.json`,raw);await fs.writeFile(`${dir}/${kind}-${width}.cpuprofile`,JSON.stringify(profile));}
 await c.close();console.log(JSON.stringify(result));return result;
}
try{
 for(let round=1;round<=3;round++)for(const [w,h] of [[1440,900],[390,844]]){
  // Rotate order to keep the last case from always benefiting from warmth.
  const order=cases.map((_,i)=>cases[(i+round-1)%3]);for(const kind of order)reports.push(await sample(kind,w,h,{round}));
 }
 for(let round=1;round<=3;round++)for(const [w,h] of [[1440,900],[390,844]])for(const kind of round%2?['oldA','cut']:['cut','oldA'])director.push(await sample(kind,w,h,{round,timed:true}));
 await fs.writeFile(dir+'/normal.json',JSON.stringify({baselineSHA:'75a1e19fe63206c348548b3cfe969355499f7713',oldSHA:'453caa478e157bcf7e4264903c729d1d6ba8c878',...provenance,sourceCommit:execFileSync('git',['rev-parse','HEAD']).toString().trim(),protocol:'One host, same viewports/4xCPU/wheel/hold/reverse/gallery buttons/drag; rotating three-way order. Separate timed director comparison. No profiler or video in normal samples. Cold-context LCP/CLS, not field data. Shared cloud host; software renderer, not hardware GPU/physical phones.',reports,director},null,2));
 for(const [w,h] of [[1440,900],[390,844]])for(const kind of cases)profiles.push(await sample(kind,w,h,{traced:true}));
 await fs.writeFile(dir+'/profiles.json',JSON.stringify({note:'Separate profiler runs; nested categories not additive; do not pool these RAFs with normal samples.',profiles},null,2));
}finally{await b.close()}
