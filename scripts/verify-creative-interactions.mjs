import {chromium,firefox} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.CREATIVE_BASE_URL||'http://localhost:3000';
const output=path.resolve(process.env.CREATIVE_EVIDENCE_DIR||'docs/creative-direction/phase-2/evidence');
await fs.mkdir(output,{recursive:true});
const report={recordedAt:new Date().toISOString(),checks:[]};
for(const [name,type]of [['chromium',chromium],['firefox',firefox]]){
 const browser=await type.launch({headless:true,...(name==='chromium'?{executablePath:'/usr/bin/chromium'}:{})});
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
 await context.addInitScript(()=>{window.__meshLifecycle={draws:0,created:0,lost:0};const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(...args){const gl=original.apply(this,args);if((args[0]==='webgl'||args[0]==='webgl2')&&gl&&!this.dataset.observedContext){this.dataset.observedContext='true';window.__meshLifecycle.created++;this.addEventListener('webglcontextlost',()=>window.__meshLifecycle.lost++)}return gl};if(window.WebGLRenderingContext){const draw=WebGLRenderingContext.prototype.drawArrays;WebGLRenderingContext.prototype.drawArrays=function(...args){window.__meshLifecycle.draws++;return draw.apply(this,args)}}});
 const page=await context.newPage();page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  for(const key of ['A','B','C']){
   await page.goto(base+'/lab/creative-direction/?variant='+key,{waitUntil:'networkidle'});await page.locator('.cd-sculpture[data-webgl-ready]').waitFor();await page.waitForTimeout(1800);
   const renderer=await page.locator('.cd-sculpture').getAttribute('data-webgl-ready');
   const before=await page.evaluate(()=>window.__meshLifecycle.draws);await page.waitForTimeout(700);assert.equal(await page.evaluate(()=>window.__meshLifecycle.draws),before,'Mesh sleeps at rest');
   await page.locator('.cd-sculpture').focus();await page.keyboard.press('Enter');await page.waitForTimeout(500);assert.equal(await page.locator('.cd-root').getAttribute('data-variant'),key,'X Enter does not switch direction');
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(500);
   if(key==='A')assert.equal(await page.locator('.cd-a').evaluate(e=>e.style.getPropertyValue('--a-scroll')),'0');
   if(key==='B')assert.equal(await page.locator('.cd-b-journey').getAttribute('data-phase'),'静态展开');
   if(key==='C')assert.equal(await page.locator('.cd-c').getAttribute('data-reduced'),'true');
   await page.screenshot({path:path.join(output,`${key}-390-${name}-reduced.png`)});
   await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(400);
   if(key==='C'){
    const tab=page.getByRole('tab').nth(1);await tab.focus();await page.keyboard.press('ArrowRight');assert.equal(await page.getByRole('tab').nth(2).getAttribute('aria-selected'),'true');assert.equal(await page.locator('.cd-root').getAttribute('data-variant'),'C');
    await page.evaluate(()=>window.scrollTo({top:innerHeight,behavior:'instant'}));await page.waitForTimeout(400);assert.equal(await page.locator('.cd-c-joint').evaluate(e=>e.inert),true,'Hidden sculpture removed from interaction');
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);assert.equal(await page.locator('.cd-c-joint').evaluate(e=>e.inert),false,'Restored controls interactive');
   }
   const lifecycleBefore=await page.evaluate(()=>window.__meshLifecycle.lost);
   await page.evaluate(()=>document.activeElement?.blur());await page.keyboard.press('ArrowRight');const next=key==='A'?'B':key==='B'?'C':'A';await page.locator(`.cd-root[data-variant=${next}] .cd-sculpture[data-webgl-ready]`).waitFor();assert.match(page.url(),new RegExp('variant='+next));
   await page.waitForTimeout(500);const lifecycle=await page.evaluate(()=>window.__meshLifecycle);if(name==='chromium')assert.ok(lifecycle.lost>lifecycleBefore,'Old GL context is released on this variant switch');
   await page.goto(base+'/lab/creative-direction/?variant='+key,{waitUntil:'networkidle'});await page.locator('.cd-sculpture[data-webgl-ready]').waitFor();
   const link=key==='A'?page.locator('.cd-a-sample'):key==='B'?page.locator('.cd-b-project-link'):page.locator('.cd-c-primary figcaption a');
   if(key==='B'){await page.locator('.cd-b-unfold').click();await page.waitForTimeout(1100)}
   await link.click();await page.waitForURL('**/work/**/');await page.locator('.detail-title, .project-detail, h1').first().waitFor();await page.goBack({waitUntil:'networkidle'});await page.locator('.cd-root[data-variant='+key+']').waitFor();assert.match(page.url(),new RegExp('variant='+key));
   report.checks.push({engine:name,variant:key,renderer,idleRendering:renderer==='true'?'mesh sleeps':'static fallback, mesh not verified',keyboard:true,runtimeReducedMotion:true,urlSwitch:true,detailAndBack:true,lifecycle,errors:[...errors]});assert.deepEqual(errors,[]);
  }
  await page.setViewportSize({width:320,height:740});for(const key of ['A','B','C']){await page.goto(base+'/lab/creative-direction/?variant='+key,{waitUntil:'networkidle'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'320px overflow');}
  report.checks.push({engine:name,width320:'all variants no horizontal overflow'});
 }finally{await context.close();await browser.close();await fs.writeFile(path.join(output,'interaction-results.json'),JSON.stringify(report,null,2))}
}
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true});const page=await browser.newPage({javaScriptEnabled:false});await page.goto(base+'/lab/creative-direction/');assert.ok(await page.getByRole('link',{name:'查看全部作品 ↗'}).isVisible());report.checks.push({noJavaScript:'real work index link present'});await browser.close();await fs.writeFile(path.join(output,'interaction-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
