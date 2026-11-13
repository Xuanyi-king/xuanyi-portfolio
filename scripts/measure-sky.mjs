import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch(),results=[];
for(let round=1;round<=2;round++)for(const width of [1440,390])for(const cpu of [1,4])for(const variant of (round===1?['baseline','sky']:['sky','baseline'])){
 const context=await browser.newContext({viewport:{width,height:width===1440?900:844}}),page=await context.newPage();
 const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:cpu});
 await page.goto(variant==='baseline'?'http://localhost:4188/':'http://localhost:4187/lab/sky-edition/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1100);
 await page.evaluate(()=>{
  const values=[],tasks=[],start=performance.now();let previous=start;
  const observer=new PerformanceObserver(list=>list.getEntries().forEach(e=>tasks.push({start:e.startTime,duration:e.duration})));observer.observe({type:'longtask',buffered:false});
  window.skySample=new Promise(resolve=>{const tick=now=>{values.push(now-previous);previous=now;if(now-start<3000)requestAnimationFrame(tick);else{observer.disconnect();resolve({frames:values,longTasks:tasks,duration:now-start})}};requestAnimationFrame(tick)});
 });
 for(let i=0;i<12;i++){await page.mouse.move(width*(.45+(i%4)*.12),240+(i%3)*100);await page.waitForTimeout(45)}
 for(let i=0;i<12;i++){await page.mouse.wheel(0,45);await page.waitForTimeout(60)}
 const sample=await page.evaluate(()=>window.skySample),sorted=sample.frames.slice(2).sort((a,b)=>a-b),q=p=>sorted[Math.floor((sorted.length-1)*p)];
 const result={round,width,cpu,variant,p50:q(.5),p95:q(.95),p99:q(.99),over50:sorted.filter(x=>x>50).length,...sample};
 results.push(result);console.log(JSON.stringify({round,width,cpu,variant,p95:result.p95,p99:result.p99,over50:result.over50,longTasks:sample.longTasks.length}));
 await context.close();
}
await fs.mkdir('docs/evidence/sky-edition/performance',{recursive:true});await fs.writeFile('docs/evidence/sky-edition/performance/samples.json',JSON.stringify({protocol:'Two alternating-order rounds; original 2.2 homepage vs selected Lab; 3s native pointer/wheel; headless Chromium, no video or tracing; CPU rate is synthetic, not physical-device equivalence.',results},null,2));await browser.close();
