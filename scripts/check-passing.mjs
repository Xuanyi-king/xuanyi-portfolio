import { watchPageErrors } from './page-errors.mjs';
import {chromium,firefox,webkit} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.BROWSER_BASE_URL??'http://localhost:4187',dir=(process.env.BROWSER_EVIDENCE_DIR??'artifacts/browser')+'/passing-curve';await fs.mkdir(dir+'/stills',{recursive:true});
const frames=[0,250,400,500,600,750,900,1000],reports=[];
const scrub=(p,n)=>p.locator('#direction-progress').fill(String(n));
for(const [engine,type] of Object.entries({chromium,firefox,webkit})){
 if(process.env.BROWSER_ENGINES&&!process.env.BROWSER_ENGINES.split(',').includes(engine))continue;
 const b=await type.launch();
 try{const staticContext=await b.newContext({javaScriptEnabled:false}),staticPage=await staticContext.newPage();await staticPage.goto(base+'/lab/motion-direction/');assert.equal(await staticPage.locator('.direction-portal').evaluate(el=>getComputedStyle(el).visibility),'hidden','SSR does not flash Gallery over the hero');await staticContext.close();for(const [w,h] of [[1440,900],[768,1024],[390,844],[320,740]]){
  if(process.env.PASSING_WIDTH&&Number(process.env.PASSING_WIDTH)!==w)continue;
  const c=await b.newContext({viewport:{width:w,height:h}}),p=await c.newPage(),errors=[];const fetchDiagnostics=await watchPageErrors(p,engine,errors,base);
  await p.goto(base+'/lab/motion-direction/');await p.evaluate(()=>document.fonts.ready);await p.getByRole('button',{name:'Director’s Cut · The Passing Curve',exact:true}).click();
  for(const n of frames){await scrub(p,n);await p.waitForTimeout(90);assert.equal(await p.locator('.direction-stage').getAttribute('data-progress'),String(n/1000));if(w===768&&n===600){const overlap=await p.locator('.direction-stage').evaluate(el=>{const a=el.querySelector('.direction-intro'),b=el.querySelector('[data-gallery-active=true] .project-meta'),x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return +getComputedStyle(a).opacity>.1&&+getComputedStyle(b).opacity>.1&&x.right>y.left&&x.left<y.right&&x.bottom>y.top&&x.top<y.bottom});assert.equal(overlap,false,'tablet Intro must leave the project reading plane');}if(engine==='chromium'){await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));const clip=await p.locator('.direction-stage').boundingBox();await p.screenshot({fullPage:true,clip,path:`${dir}/stills/cut-${w}-${n}.png`});}}
  const bounds=await p.locator('.direction-stage').evaluate(el=>{const active=el.querySelector('[data-gallery-active=true]'),tags=active.querySelector('.tags').getBoundingClientRect(),meta=active.querySelector('.project-meta').getBoundingClientRect(),controls=el.querySelector('.gallery-controls').getBoundingClientRect(),canvas=el.getBoundingClientRect();return {clear:tags.bottom+4<=controls.top,inside:controls.bottom<=canvas.bottom,title:meta.left>=canvas.left&&meta.right<=canvas.right,interactive:!el.querySelector('.direction-portal').inert}});assert.ok(Object.values(bounds).every(Boolean),JSON.stringify({w,bounds}));
  const edgeFailures=[];await scrub(p,700);const edgeGallery=p.locator('.direction-portal .gallery-stage');await edgeGallery.focus();await p.keyboard.press('ArrowRight');await p.waitForFunction(()=>document.querySelector('.direction-portal .gallery-stage').dataset.active==='1');await p.waitForFunction(()=>!document.querySelector('.direction-portal .gallery-stage').hasAttribute('data-moving'));
  if(Number(await p.locator('[data-gallery-active=true] .gallery-link').evaluate(el=>getComputedStyle(el).opacity))<.98)edgeFailures.push('new active project stays dim when stopped at70%');
  await p.keyboard.press('ArrowLeft');await p.waitForFunction(()=>!document.querySelector('.direction-portal .gallery-stage').hasAttribute('data-moving'));await scrub(p,1000);
  await p.getByRole('button',{name:'Restart',exact:true}).click();await p.getByRole('button',{name:'Play',exact:true}).click();await p.waitForTimeout(180);await p.setViewportSize({width:w-1,height:h});await p.waitForTimeout(150);const resizeAt=await p.locator('.direction-stage').getAttribute('data-progress');await p.waitForTimeout(160);
  if(resizeAt!==await p.locator('.direction-stage').getAttribute('data-progress'))edgeFailures.push('director clock continues after resize');
  await p.getByRole('button',{name:'Pause',exact:true}).click();await p.setViewportSize({width:w,height:h});await scrub(p,1000);assert.deepEqual(edgeFailures,[]);
  const gallery=p.locator('.direction-portal .gallery-stage');await gallery.focus();await p.keyboard.press('ArrowRight');await p.waitForFunction(()=>document.querySelector('.direction-portal .gallery-stage').dataset.active==='1');await p.waitForFunction(()=>!document.querySelector('.direction-portal .gallery-stage').hasAttribute('data-moving'));assert.equal(await gallery.getAttribute('data-active'),'1');await p.keyboard.press('ArrowLeft');await p.waitForFunction(()=>!document.querySelector('.direction-portal .gallery-stage').hasAttribute('data-moving'));
  const box=await gallery.boundingBox();await p.mouse.move(box.x+box.width*.63,box.y+90);await p.mouse.down();await p.mouse.move(box.x+box.width*.24,box.y+92,{steps:14});await p.mouse.up();await p.waitForTimeout(800);assert.ok(!await gallery.getAttribute('data-dragging'));await gallery.focus();await p.keyboard.press('ArrowRight');await p.waitForFunction(()=>!document.querySelector('.direction-portal .gallery-stage').hasAttribute('data-moving'));
  if(engine==='chromium'&&w<=760){
   await gallery.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));const r=await gallery.boundingBox(),cdp=await c.newCDPSession(p),before=Number(await gallery.getAttribute('data-position'));
   await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true});
   const x=r.x+r.width*.66,y=Math.max(110,r.y+100);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
   for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*11,y:y+2}]});await p.waitForTimeout(16)}
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(800);
   assert.ok(Math.abs(Number(await gallery.getAttribute('data-position'))-before)>.3,'touch actually moves gallery');
   assert.ok(await gallery.evaluate(el=>getComputedStyle(el).touchAction.includes('pan-y')));
   await gallery.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));const verticalBox=await gallery.boundingBox(),pageY=await p.evaluate(()=>scrollY),vx=verticalBox.x+verticalBox.width*.5,vy=Math.max(230,verticalBox.y+180);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:vx,y:vy}]});for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:vx+1,y:vy-i*11}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(350);
   assert.ok(await p.evaluate(y=>scrollY>y+20,pageY),'vertical touch over Gallery scrolls the actual page');await cdp.detach();
  }
  await p.locator('[data-gallery-active=true] .gallery-link').click();await p.waitForURL('**/work/**');await p.goBack();await p.waitForSelector('.direction-passing .direction-stage[data-interactive=true]');assert.equal(await p.locator('.direction-stage').getAttribute('data-progress'),'1');
  await p.getByRole('button',{name:'Restart',exact:true}).click();await p.getByRole('button',{name:'Play',exact:true}).click();await p.waitForTimeout(420);await p.getByRole('button',{name:'Pause',exact:true}).click();const at=await p.locator('.direction-stage').getAttribute('data-progress');await p.waitForTimeout(140);assert.equal(await p.locator('.direction-stage').getAttribute('data-progress'),at);
  await p.emulateMedia({reducedMotion:'reduce'});await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForTimeout(100);assert.equal(await p.locator('.direction-stage').getAttribute('data-progress'),at);
  await p.getByRole('button',{name:'真实滚动模式',exact:true}).click();
  const origin=await p.locator('.direction-scroll').evaluate(el=>el.getBoundingClientRect().top+scrollY);const anchor=w<=760?72:100,span=w<=760?432:h*.8;
  const settleTimes=[];const goto=async v=>{const start=Date.now();await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),origin-anchor+span*v);await p.waitForFunction(expected=>Math.abs(Number(document.querySelector('.direction-stage').dataset.progress)-expected)<.035,Math.max(0,Math.min(1,v)));settleTimes.push(Date.now()-start);return Number(await p.locator('.direction-stage').getAttribute('data-progress'))};
  assert.ok((await goto(.5))>.47);const middle=await p.locator('.direction-stage').getAttribute('data-progress');await p.waitForTimeout(240);assert.equal(await p.locator('.direction-stage').getAttribute('data-progress'),middle);
  assert.ok(await goto(1.4)>.98);assert.ok(await goto(.2)<.23);assert.ok(await goto(.7)>.67);
  if(w<=760)assert.equal(await p.locator('.direction-stage').evaluate(el=>getComputedStyle(el).position),'relative');
  await p.setViewportSize({width:w+3,height:h});await p.waitForTimeout(120);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await p.emulateMedia({reducedMotion:'reduce'});await goto(.5);assert.ok(await p.locator('.direction-mark').evaluate(el=>getComputedStyle(el).visibility==='visible'),JSON.stringify({w,progress:await p.locator('.direction-stage').getAttribute('data-progress'),mark:await p.locator('.direction-mark').getAttribute('style')}));
  await p.getByRole('button',{name:'切回导演预演',exact:true}).click();await p.getByRole('button',{name:'Restart',exact:true}).click();await p.getByRole('button',{name:'Play',exact:true}).click();await p.waitForTimeout(120);assert.equal(await p.locator('.direction-stage').getAttribute('data-progress'),'0');
  assert.deepEqual(errors,[]);reports.push({engine,w,h,frames,bounds,pause:true,reduced:true,reverse:true,stop:true,detailReturn:true,drag:true,scrollSettleMs:settleTimes,overflow:false,errors,fetchDiagnostics});console.log(engine,w,'passed');await c.close();
 }
 }finally{await b.close();}
}
await fs.writeFile(dir+'/browser-results.json',JSON.stringify(reports,null,2));
