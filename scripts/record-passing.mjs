import {chromium} from 'playwright';import fs from 'node:fs/promises';
const base=process.env.BROWSER_BASE_URL??'http://localhost:4187',dir=(process.env.BROWSER_EVIDENCE_DIR??'artifacts/browser')+'/passing-curve/films';await fs.mkdir(dir,{recursive:true});const b=await chromium.launch();
for(const [width,height] of [[1440,900],[390,844],[320,740]])for(const mode of ['director','scroll']){
 const c=await b.newContext({viewport:{width,height},recordVideo:{dir:dir+'/raw',size:{width,height}}}),p=await c.newPage();await p.goto(base+'/lab/motion-direction/');await p.evaluate(()=>document.fonts.ready);
 if(mode==='director'){
  await p.locator('.direction-stage').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-(innerWidth<=760?78:110),behavior:'instant'}));await p.getByRole('button',{name:'Play',exact:true}).evaluate(el=>el.click());await p.waitForTimeout(10300);
 }else{
  await p.getByRole('button',{name:'真实滚动模式',exact:true}).click();const y=await p.locator('.direction-scroll').evaluate(el=>el.getBoundingClientRect().top+scrollY);await p.evaluate(y=>scrollTo({top:y-(innerWidth<=760?72:100),behavior:'instant'}),y);await p.waitForTimeout(400);
  for(const delta of [100,100,100]){await p.mouse.wheel(0,delta);await p.waitForTimeout(400)}await p.waitForTimeout(1000); // a genuine middle hold
  for(const delta of [180,300,-480,420,-650,1000]){await p.mouse.wheel(0,delta);await p.waitForTimeout(330)}
  await p.locator('.direction-portal .gallery-controls').scrollIntoViewIfNeeded();await p.waitForTimeout(500);
 }
 await p.locator('#direction-progress').evaluate(el=>{if(!el.disabled){el.value='1000';el.dispatchEvent(new Event('input',{bubbles:true}))}});await p.waitForTimeout(150);
 const stage=p.locator('.direction-portal .gallery-stage');await stage.scrollIntoViewIfNeeded();const r=await stage.boundingBox();if(width<=760){const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true});const x=r.x+r.width*.65,y=r.y+100;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=18;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*8,y:y+2}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}else{await p.mouse.move(r.x+r.width*.65,r.y+100);await p.mouse.down();await p.mouse.move(r.x+r.width*.2,r.y+105,{steps:24});await p.mouse.up();}await p.waitForTimeout(800);
 const video=p.video();await c.close();await video.saveAs(`${dir}/${mode}-${width}.webm`);console.log(mode,width,'recorded');
}
await b.close();
