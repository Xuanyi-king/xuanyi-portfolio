import { watchPageErrors } from './page-errors.mjs';
import {chromium,firefox,webkit} from 'playwright';
import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
const dir=process.env.BROWSER_EVIDENCE_DIR??'artifacts/browser';
const base=process.env.BROWSER_BASE_URL??'http://localhost:4188';
let server;if(!process.env.BROWSER_BASE_URL){server=spawn(process.execPath,['node_modules/serve/build/main.js','out','-l','4188'],{stdio:'ignore'});for(let i=0;i<100;i++){try{if((await fetch(base)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}}
try{
const folder=dir+'/motion-direction';await fs.mkdir(folder,{recursive:true});const reports=[];
for(const [engine,browser] of Object.entries({chromium,firefox,webkit})){
 if(process.env.BROWSER_ENGINES&&!process.env.BROWSER_ENGINES.split(',').includes(engine))continue;
 const b=await browser.launch();
 for(const [w,h] of [[1440,900],[768,1024],[390,844],[320,740]]){
  const c=await b.newContext({viewport:{width:w,height:h},...(engine==='chromium'?{recordVideo:{dir:folder+'/video',size:{width:w,height:h}}}:{})});const p=await c.newPage();const errors=[];const fetchDiagnostics=await watchPageErrors(p,engine,errors,base);
  await p.goto(base+'/lab/motion-direction/');await p.evaluate(()=>document.fonts.ready);
  for(const v of ['A · Continuous Thread','B · Spatial Unfolding']){
   await p.getByRole('button',{name:v,exact:true}).click();
   for(const n of [0,200,250,500,750,900,1000]){
    await p.locator('#direction-progress').evaluate((el,n)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,String(n));el.dispatchEvent(new Event('input',{bubbles:true}))},n);await p.waitForTimeout(120);
    assert.equal(await p.locator('.direction-stage').getAttribute('data-progress'),String(n/1000));
    if(n===1000){const bounds=await p.locator('.direction-stage').evaluate(el=>{const tags=el.querySelector('[data-gallery-active=true] .tags').getBoundingClientRect(),controls=el.querySelector('.gallery-controls').getBoundingClientRect(),canvas=el.getBoundingClientRect();return {clear:tags.bottom+4<=controls.top,inside:controls.bottom<=canvas.bottom}});assert.ok(bounds.clear&&bounds.inside,JSON.stringify(bounds))}if(engine==='chromium')await p.locator('.direction-stage').screenshot({path:`${folder}/${v[0]}-${w}-${n}.png`});
   }
   await p.locator('.direction-stage .gallery-stage').focus();await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowLeft');await p.waitForTimeout(600);
   await p.getByRole('button',{name:'Restart',exact:true}).click();
   await p.getByRole('button',{name:'Play',exact:true}).click();await p.waitForTimeout(350);await p.getByRole('button',{name:'Pause',exact:true}).click();
   const geometry=await p.locator('.direction-mark [data-ribbon]').first().getAttribute('d');await p.emulateMedia({reducedMotion:'reduce'});await p.emulateMedia({reducedMotion:'no-preference'});const at=await p.locator('.direction-stage').getAttribute('data-progress');await p.waitForTimeout(180);assert.equal(await p.locator('.direction-stage').getAttribute('data-progress'),at);assert.equal(await p.locator('.direction-mark [data-ribbon]').first().getAttribute('d'),geometry);
  }
  await p.getByRole('button',{name:'真实滚动模式',exact:true}).click();await p.mouse.wheel(0,600);await p.waitForTimeout(250);await p.mouse.wheel(0,-600);await p.waitForTimeout(250);
  await p.emulateMedia({reducedMotion:'reduce'});await p.getByRole('button',{name:'切回导演预演',exact:true}).click();await p.getByRole('button',{name:'Restart',exact:true}).click();await p.getByRole('button',{name:'Play',exact:true}).click();await p.waitForTimeout(200);assert.equal(await p.locator('.direction-stage').getAttribute('data-progress'),'0');
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);reports.push({engine,w,h,pause:true,reduced:true,errors,fetchDiagnostics});
  const video=p.video();await c.close();if(video)await video.saveAs(`${folder}/${engine}-${w}-interaction.webm`);
 }
 await b.close();
}
await fs.writeFile(folder+'/results.json',JSON.stringify(reports,null,2));console.log('Direction studies:',reports.length,'engine/viewport cases passed');

}finally{server?.kill()}
