/** Same local export, cold contexts, no recording. CPU emulation is not a real phone/GPU test. */
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.CREATIVE_BASE_URL||'http://localhost:3000';
const output=path.resolve(process.env.CREATIVE_EVIDENCE_DIR||'docs/creative-direction/phase-2/evidence');
const report={recordedAt:new Date().toISOString(),method:'3 cold-context loads per case, 2.2s entry + identical 1.5viewport scroll down/up; no recording; rAF interval != rendered FPS; 4x CDP CPU is not mobile GPU',samples:[]};
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true});
report.browser=browser.version();
for(const width of [1440,390])for(const rate of [1,4])for(const key of ['baseline','A','B','C'])for(let run=0;run<3;run++){
 const context=await browser.newContext({viewport:{width,height:width===1440?900:844},deviceScaleFactor:1});
 await context.addInitScript(()=>{const s=window.__measure={cls:0,longTasks:[],lcp:0,frames:[]};for(const type of ['layout-shift','longtask','largest-contentful-paint'])new PerformanceObserver(list=>{for(const e of list.getEntries()){if(type==='layout-shift'&&!e.hadRecentInput)s.cls+=e.value;if(type==='longtask')s.longTasks.push(e.duration);if(type==='largest-contentful-paint')s.lcp=e.startTime}}).observe({type,buffered:true})});
 const page=await context.newPage(),cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate});await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await page.goto(base+(key==='baseline'?'/':'/lab/creative-direction/?variant='+key),{waitUntil:'networkidle'});if(key!=='baseline')await page.locator('.cd-sculpture[data-webgl-ready=true]').waitFor();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2200);
 await page.evaluate(async()=>{const start=performance.now(),height=innerHeight;let last=start;await new Promise(resolve=>{const draw=now=>{window.__measure.frames.push(now-last);last=now;const t=Math.min(1,(now-start)/1600),y=t<.5?t*2*height*1.5:(1-t)*2*height*1.5;scrollTo({top:y,behavior:'instant'});if(t<1)requestAnimationFrame(draw);else resolve()};requestAnimationFrame(draw)})});
 const stats=await page.evaluate(()=>{const s=window.__measure,a=s.frames.slice().sort((a,b)=>a-b),resources=performance.getEntriesByType('resource');return{cls:s.cls,lcpMs:s.lcp,longTasks:s.longTasks.length,blockingMs:s.longTasks.reduce((a,d)=>a+Math.max(0,d-50),0),rafP50:a[Math.floor(a.length*.5)],rafP95:a[Math.floor(a.length*.95)],rafSamples:a.length,transferBytes:resources.reduce((a,e)=>a+e.transferSize,0),scriptDecodedBytes:resources.filter(e=>e.initiatorType==='script').reduce((a,e)=>a+e.decodedBodySize,0),imagesBytes:resources.filter(e=>e.initiatorType==='img').reduce((a,e)=>a+e.transferSize,0),resourceCount:resources.length,meshTriangles:document.querySelector('.cd-sculpture')?.dataset.triangles||null}});
 report.samples.push({variant:key,width,cpuRate:rate,run:run+1,...stats});await context.close();await fs.writeFile(path.join(output,'performance.json'),JSON.stringify(report,null,2));console.log(key,width,rate,run+1,Math.round(stats.rafP95));
}
await browser.close();
