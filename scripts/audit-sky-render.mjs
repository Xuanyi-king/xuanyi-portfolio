import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const b=await chromium.launch();const report=[];
for(const frozen of [false,true]){
 const c=await b.newContext({viewport:{width:1440,height:900}}),p=await c.newPage(),cdp=await c.newCDPSession(p);
 await p.goto('http://localhost:4187/lab/sky-edition/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1000);
 if(frozen)await p.evaluate(()=>{const original=Element.prototype.setAttribute;Element.prototype.setAttribute=function(k,v){if((k==='d'||k==='stop-color')&&this.closest('.sky-sculpture'))return;return original.call(this,k,v)}});
 await cdp.send('Performance.enable');await cdp.send('Profiler.enable');await cdp.send('Profiler.start');const before=await cdp.send('Performance.getMetrics');
 await p.evaluate(()=>{window.auditIntervals=[];let last=performance.now(),start=last;window.auditDone=new Promise(resolve=>{const tick=t=>{auditIntervals.push(t-last);last=t;if(t-start<2500)requestAnimationFrame(tick);else resolve(auditIntervals)};requestAnimationFrame(tick)})});
 for(let i=0;i<16;i++){await p.mouse.move(650+(i%5)*125,220+(i%3)*120);await p.waitForTimeout(60)}
 const intervals=await p.evaluate(()=>auditDone);const after=await cdp.send('Performance.getMetrics'),profile=await cdp.send('Profiler.stop');
 const m=Object.fromEntries(before.metrics.map(x=>[x.name,x.value]));const delta=Object.fromEntries(after.metrics.filter(x=>/Duration/.test(x.name)).map(x=>[x.name,x.value-(m[x.name]||0)]));
 const sorted=intervals.slice(2).sort((a,b)=>a-b),top=profile.profile.nodes.filter(n=>n.hitCount).sort((a,b)=>b.hitCount-a.hitCount).slice(0,20).map(n=>({function:n.callFrame.functionName,url:n.callFrame.url.slice(-80),hits:n.hitCount}));
 report.push({frozen,p95:sorted[Math.floor(sorted.length*.95)],delta,top});await c.close();
}
await fs.mkdir('docs/evidence/sky-edition/performance',{recursive:true});await fs.writeFile('docs/evidence/sky-edition/performance/ablation.json',JSON.stringify(report,null,2));console.log(report);await b.close();
