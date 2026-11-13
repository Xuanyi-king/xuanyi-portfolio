import {chromium,firefox,webkit} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { watchPageErrors } from './page-errors.mjs';
const base=process.env.BROWSER_BASE_URL||'http://localhost:4187';
const engines=(process.env.SKY_ENGINES||'chromium').split(',');
const dir=process.env.SKY_EVIDENCE_DIR||'docs/evidence/sky-edition/final';
await fs.mkdir(dir,{recursive:true});
const report=[];
for(const engineName of engines){
 const browser=await ({chromium,firefox,webkit})[engineName].launch({headless:true,...(engineName==='webkit'&&process.env.SKY_WEBKIT_EXECUTABLE_PATH?{executablePath:process.env.SKY_WEBKIT_EXECUTABLE_PATH}:{})});
 for(const [width,height] of [[1440,900],[768,1024],[390,844],[320,740]]){
  const errors=[];
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:width<=760});
  const page=await context.newPage();
  const nativeDiagnostics=await watchPageErrors(page,engineName,errors,base);
  await page.goto(base+'/lab/sky-edition/');await page.evaluate(()=>document.fonts.ready);
  await page.waitForSelector('.living-gallery[data-enhanced="true"]');
  await page.waitForTimeout(300);
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const geometry=await page.evaluate(()=>{
   const h=document.querySelector('.sky-hero'),header=document.querySelector('.site-header');
   return {start:Math.max(0,h.getBoundingClientRect().top+scrollY-header.getBoundingClientRect().bottom),distance:Math.min(660,h.offsetHeight*.86)};
  });
  await page.screenshot({path:`${dir}/${engineName}-${width}-hero.png`});
  const rest=await page.locator('[data-sky-band="0-10"]').first().getAttribute('d');
  if(width>760){
   await page.evaluate(()=>{
    globalThis.skyPointerLog=[];
    for(const type of ['pointermove','pointerleave','pointerenter'])document.addEventListener(type,event=>{
     if(globalThis.skyPointerLog.length<20)globalThis.skyPointerLog.push({type,target:event.target.className,pointerType:event.pointerType,x:event.clientX,y:event.clientY});
    },true);
   });
   const poseRest=await page.locator('.sky-pose').evaluate(el=>getComputedStyle(el).transform);
   await page.mouse.move(width*.85,320);await page.waitForTimeout(600);
   assert.equal(await page.locator('[data-sky-band="0-10"]').first().getAttribute('d'),rest,'accepted mesh stays cached');
   const pointerPose=await page.locator('.sky-pose').evaluate(el=>getComputedStyle(el).transform);
   if(pointerPose===poseRest)console.error('POINTER_DIAGNOSTICS',JSON.stringify(await page.evaluate(()=>({events:globalThis.skyPointerLog,hit:document.elementFromPoint(innerWidth*.85,320)?.className,hidden:document.hidden,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,progress:document.querySelector('.sky-page').dataset.skyProgress,inline:document.querySelector('.sky-pose').style.cssText,rx:document.querySelector('.sky-pose')._gsap?.rotationX,ry:document.querySelector('.sky-pose')._gsap?.rotationY}))));
   assert.notEqual(pointerPose,poseRest,'pointer changes spatial pose');
   await page.screenshot({path:`${dir}/${engineName}-${width}-pointer.png`});
   await page.mouse.move(0,0);
  }else{
   await page.touchscreen.tap(width*.6,450);await page.waitForTimeout(300);
  }
  const poses=[];
  for(const p of [0,.25,.5,.75,1,.75,.5,.25,0]){
   await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),geometry.start+geometry.distance*p);
   await page.waitForTimeout(220);
   const actual=+(await page.locator('.sky-page').getAttribute('data-sky-progress'));
   assert.ok(Math.abs(actual-p)<.005,`progress ${width} ${p} ${actual}`);
   const transform=await page.locator('.sky-sculpture').evaluate(el=>el.style.transform);
   if(poses.length<5)await page.screenshot({path:`${dir}/${engineName}-${width}-scroll-${Math.round(p*100)}.png`});
   poses.push({p,transform});
  }
  assert.equal(poses[2].transform,poses[6].transform,'deterministic reverse pose');
  await page.locator('#sky-work').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-112,behavior:'instant'}));
  await page.waitForTimeout(350);
  await page.locator('.sky-work').screenshot({path:`${dir}/${engineName}-${width}-gallery.png`});
  await page.getByRole('button',{name:'下一个作品',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.gallery-stage').dataset.active==='1');
  await page.waitForFunction(()=>!document.querySelector('.gallery-stage').hasAttribute('data-moving'));
  await page.locator('.gallery-stage').focus();await page.keyboard.press('ArrowLeft');
  await page.waitForFunction(()=>document.querySelector('.gallery-stage').dataset.active==='0');
  await page.waitForFunction(()=>!document.querySelector('.gallery-stage').hasAttribute('data-moving'));
  await page.locator('.gallery-card[data-gallery-active="true"] a').click();
  await page.waitForURL('**/work/adaptive-router/');
  await page.goBack();await page.waitForURL('**/lab/sky-edition/');
  await page.waitForSelector('.living-gallery[data-enhanced="true"]');
  await page.waitForTimeout(250);
  assert.equal(await page.locator('.gallery-stage').getAttribute('data-active'),'0');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.setViewportSize({width:width===320?390:width,height});await page.waitForTimeout(200);
  assert.equal(await page.locator('.sky-page').getAttribute('data-sky-progress'),'0.0000');
  if(width<=760){await page.getByRole('button',{name:'打开导航'}).click();assert.equal(await page.locator('#mobile-menu').getAttribute('aria-hidden'),'false');await page.keyboard.press('Escape');}
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);
  assert.equal(await page.locator('.sky-sculpture').evaluate(el=>el.style.transform),'');
  assert.equal(await page.locator('.gallery-viewport').evaluate(el=>el.style.clipPath),'');
  await page.screenshot({path:`${dir}/${engineName}-${width}-reduced.png`});
  assert.deepEqual(errors,[]);
  report.push({engineName,width,height,overflow:false,runtimeErrors:errors,nativeDiagnostics,reverse:true,detailsBack:true,reduced:true});
  console.log('PASS',engineName,width);
  await fs.writeFile(`${dir}/verification.json`,JSON.stringify({base,report},null,2));
  await context.close();
 }
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},javaScriptEnabled:false});
  const page=await context.newPage();await page.goto(base+'/lab/sky-edition/');
  assert.equal(await page.locator('.gallery-card').count(),3);
  assert.ok(await page.locator('.sky-primary').isVisible());
  const boxes=await page.locator('.gallery-card').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().toJSON()));
  assert.ok(boxes.every(b=>b.width>100&&b.height>100));
  await page.screenshot({path:`${dir}/${engineName}-${width}-nojs.png`,fullPage:true});
  await context.close();
 }
 await browser.close();
}
await fs.writeFile(`${dir}/verification.json`,JSON.stringify({base,report},null,2));
console.log(JSON.stringify(report,null,2));
