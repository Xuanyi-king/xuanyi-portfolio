/** Real browser evidence for the throwaway Lab. No production mutation. */
import {chromium,firefox,webkit} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.CREATIVE_BASE_URL||'http://localhost:3000';
const output=path.resolve(process.env.CREATIVE_EVIDENCE_DIR||'docs/creative-direction/phase-2/evidence');
await fs.mkdir(path.join(output,'films'),{recursive:true});
const selectedKeys=process.env.CREATIVE_VARIANTS?.split(',')||['A','B','C'];
assert.ok(selectedKeys.length&&selectedKeys.every(k=>['A','B','C'].includes(k)));
const results={selectedKeys,base,recordedAt:new Date().toISOString(),cases:[],limitations:[]};
const screenshot=async(page,name)=>page.screenshot({path:path.join(output,name+'.png')});
async function scroll(page,y,duration=1500){
 await page.evaluate(async({y,duration})=>{const start=scrollY,time=performance.now();await new Promise(resolve=>{const draw=now=>{const t=Math.min(1,(now-time)/duration),e=t*t*(3-2*t);window.scrollTo({top:start+(y-start)*e,behavior:'instant'});if(t<1)requestAnimationFrame(draw);else resolve()};requestAnimationFrame(draw)})},{y,duration});
}
async function capture(key,width,engineName,browser){
 const mobile=width===390,height=mobile?844:900,record=engineName==='chromium';
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:mobile,...(engineName==='chromium'?{isMobile:mobile}:{}),...(record?{recordVideo:{dir:path.resolve('artifacts/creative-direction-video'),size:{width,height}}}:{})});
 await context.addInitScript(()=>{
  const stats={cls:0,longTasks:[],lcp:0,frames:[],started:performance.now()};window.__creativeMetrics=stats;
  for(const type of ['layout-shift','longtask','largest-contentful-paint'])if(PerformanceObserver.supportedEntryTypes.includes(type))new PerformanceObserver(list=>{for(const e of list.getEntries()){if(type==='layout-shift'&&!e.hadRecentInput)stats.cls+=e.value;if(type==='longtask')stats.longTasks.push(e.duration);if(type==='largest-contentful-paint')stats.lcp=e.startTime}}).observe({type,buffered:true});
  let previous=0;const sample=now=>{if(previous)stats.frames.push(now-previous);previous=now;if(now-stats.started<30000)requestAnimationFrame(sample)};requestAnimationFrame(sample);
 });
 context.setDefaultTimeout(15000);
 const page=await context.newPage(),video=page.video(),errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
 const row={engine:engineName,viewport:{width,height},variant:key,errors,failed};results.cases.push(row);
 try{
  await page.goto(base+'/lab/creative-direction/?variant='+key,{waitUntil:'networkidle',timeout:60000});
  await page.locator(`.cd-root[data-variant=${key}] .cd-sculpture[data-webgl-ready]`).waitFor();
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1600);
  row.renderer=await page.locator('.cd-sculpture').getAttribute('data-webgl-ready');
  if(engineName==='chromium')assert.equal(row.renderer,'true','Primary browser must render the real mesh');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'No horizontal overflow');
  assert.equal(await page.locator('main').count(),1,'One main landmark');
  await screenshot(page,`${key}-${width}-${engineName}-hero`);
  const sculpture=page.locator('.cd-sculpture');const rect=await sculpture.boundingBox();assert.ok(rect&&rect.height>30);
  const point=await sculpture.evaluate(el=>{const r=el.getBoundingClientRect();for(const [x,y] of [[.75,.25],[.5,.35],[.25,.25],[.75,.55]]){const target=document.elementFromPoint(r.left+r.width*x,r.top+r.height*y);if(target&&el.contains(target))return{x:r.width*x,y:r.height*y}}return null});
  assert.ok(point,'A visible part of the mesh control must accept input');
  if(mobile)await sculpture.tap({position:point});
  else {await page.mouse.move(rect.x+point.x,rect.y+point.y,{steps:24});await sculpture.click({position:point})}
  await page.waitForTimeout(650);row.interactivePose=await sculpture.getAttribute('data-pose');if(row.renderer==='true'){assert.ok(row.interactivePose);assert.notEqual(row.interactivePose,'0.000,0.000','Input changes mesh pose')}else row.rendererLimitation='Static fallback; mesh response not verified';
  await screenshot(page,`${key}-${width}-${engineName}-interaction`);
  await sculpture.click({position:point});await page.mouse.move(2,2);await page.waitForTimeout(450);
  if(key==='A'){
   await page.getByRole('button',{name:'查看 ATLAS 成片帧'}).click();assert.match(await page.locator('.cd-a-evidence').innerText(),/成片第 10 秒/);
   const y=await page.locator('.gallery-viewport').evaluate(e=>e.getBoundingClientRect().top+scrollY-100);await scroll(page,y);await page.waitForTimeout(500);
   await page.getByRole('button',{name:'下一个作品',exact:true}).click();await page.waitForTimeout(700);assert.match(await page.locator('.gallery-counter').innerText(),/02/);row.workInteraction='ATLAS proof selected; LivingGallery advanced to02/03';
  }else if(key==='B'){
   const y=await page.locator('.cd-b-journey').evaluate(e=>(e.getBoundingClientRect().top+scrollY)+(e.offsetHeight-innerHeight)*.76);await scroll(page,y);await page.waitForTimeout(500);
   await page.locator('.cd-b-project-tabs button').nth(1).click();await page.waitForTimeout(750);assert.match(await page.locator('.cd-b-project-name').innerText(),/Vibe Knowledge Film/);row.workInteraction='Frontal canvas selects ATLAS';
  }else{
   await page.getByRole('tab').nth(0).click();assert.match(await page.locator('.cd-c-case h2').innerText(),/DSH Adaptive Router/);
   await page.getByRole('tab').nth(1).click();await page.getByRole('button',{name:'播放成片节选',exact:true}).click();await page.waitForFunction(()=>{const v=document.querySelector('.cd-c-primary video');return v&&!v.paused&&v.currentTime>.1});await page.waitForTimeout(700);await page.getByRole('button',{name:'暂停成片节选',exact:true}).click();
   const y=await page.locator('.cd-c-detail').evaluate(e=>e.getBoundingClientRect().top+scrollY-100);await scroll(page,y);row.workInteraction='Router/Film selection and explicit real muted film playback';
  }
  await screenshot(page,`${key}-${width}-${engineName}-work`);await page.waitForTimeout(650);
  await scroll(page,0,1700);await page.waitForTimeout(700);assert.ok(await page.evaluate(()=>scrollY<2),'Native reverse returns to opening');
  await screenshot(page,`${key}-${width}-${engineName}-restored`);row.reversed=true;
  row.metrics=await page.evaluate(()=>{const s=window.__creativeMetrics;const a=s.frames.slice().sort((a,b)=>a-b);const resources=performance.getEntriesByType('resource');return{cls:s.cls,lcpMs:s.lcp,longTasksMs:s.longTasks,rafP50:a[Math.floor(a.length*.5)],rafP95:a[Math.floor(a.length*.95)],rafSamples:a.length,transferBytes:resources.reduce((a,e)=>a+e.transferSize,0),scriptDecodedBytes:resources.filter(e=>e.initiatorType==='script').reduce((a,e)=>a+e.decodedBodySize,0),resourceCount:resources.length,domNodes:document.querySelectorAll('*').length}});
  assert.deepEqual(errors,[],'No uncaught runtime errors');row.passed=true;
 }catch(e){row.passed=false;row.failure=String(e);await screenshot(page,`${key}-${width}-${engineName}-FAIL`).catch(()=>{});console.error('FAIL',engineName,key,width,String(e));}
 await context.close();if(record&&video)await video.saveAs(path.join(output,'films',`${key}-${width}.webm`));
 console.log(JSON.stringify({variant:key,width,engine:engineName,passed:row.passed,renderer:row.renderer}));
 await fs.writeFile(path.join(output,'browser-results.json'),JSON.stringify(results,null,2));
}
for(const [engineName,type] of [['chromium',chromium],['firefox',firefox],['webkit',webkit]]){
 if(process.env.CREATIVE_ENGINES&&!process.env.CREATIVE_ENGINES.split(',').includes(engineName))continue;
 let browser;
 try{browser=await type.launch({headless:true,...(engineName==='chromium'?{executablePath:process.env.CHROME_PATH||'/usr/bin/chromium'}:{})});}
 catch(e){results.limitations.push({engine:engineName,error:String(e)});await fs.writeFile(path.join(output,'browser-results.json'),JSON.stringify(results,null,2));continue}
 results[engineName+'Version']=browser.version();
 for(const width of [1440,390])for(const key of selectedKeys)await capture(key,width,engineName,browser);
 await browser.close();
}
const primary=results.cases.filter(r=>r.engine==='chromium');
if(primary.length!==selectedKeys.length*2||primary.some(r=>!r.passed)||results.cases.some(r=>!r.passed))process.exitCode=1;
