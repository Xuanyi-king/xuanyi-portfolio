import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const base=process.env.BROWSER_BASE_URL||'http://localhost:4187',dir=process.env.SKY_FILM_DIR||'docs/evidence/sky-edition/films';
await fs.mkdir(dir+'/raw',{recursive:true});
const b=await chromium.launch();const report=[];
for(const [width,height] of [[1440,900],[390,844]]){
 const errors=[],events=[];
 const c=await b.newContext({viewport:{width,height},hasTouch:width<760,recordVideo:{dir:dir+'/raw',size:{width,height}}});
 const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/lab/sky-edition/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1000);
 events.push('static hero hold');
 if(width>760){
  for(const [x,y]of [[1000,330],[1250,520],[870,580],[1160,250]]){await p.mouse.move(x,y,{steps:24});await p.waitForTimeout(500)}
  await p.mouse.move(0,0);await p.waitForTimeout(650);events.push('pointer pose and release');
 }else{await p.touchscreen.tap(260,440);await p.waitForTimeout(600);events.push('touch sculpture, no capture');}
 for(let i=0;i<23;i++){await p.mouse.wheel(0,28);await p.waitForTimeout(130)}
 await p.waitForTimeout(900);events.push('native scroll handoff and hold');
 for(let i=0;i<9;i++){await p.mouse.wheel(0,-32);await p.waitForTimeout(110)}
 await p.waitForTimeout(650);events.push('reverse handoff');
 for(let i=0;i<20;i++){await p.mouse.wheel(0,38);await p.waitForTimeout(100)}
 await p.locator('.gallery-stage').scrollIntoViewIfNeeded();await p.waitForTimeout(700);
 const r=await p.locator('.gallery-stage').boundingBox();
 if(width>760){await p.mouse.move(r.x+r.width*.65,r.y+100);await p.mouse.down();await p.mouse.move(r.x+r.width*.35,r.y+104,{steps:32});await p.mouse.up();}
 else{
  const cdp=await c.newCDPSession(p),x=width*.72,y=Math.min(height-100,r.y+130);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  for(let i=1;i<=18;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-i*9,y:y+2}]});await p.waitForTimeout(25)}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 }
 await p.waitForTimeout(900);events.push('actual gallery drag');
 await p.getByRole('button',{name:'下一个作品',exact:true}).click();await p.waitForTimeout(950);events.push('gallery next control');
 await p.locator('.gallery-card[data-gallery-active="true"] a').click();await p.waitForURL('**/work/*/');await p.waitForTimeout(1200);events.push('native detail');
 await p.goBack();await p.waitForURL('**/lab/sky-edition/');await p.waitForSelector('.living-gallery[data-enhanced="true"]');await p.waitForTimeout(900);events.push('native back restores gallery');
 await p.evaluate(()=>scrollTo({top:0,behavior:'smooth'}));await p.waitForTimeout(1500);events.push('return to quiet hero');
 const video=p.video();await c.close();const file=`${dir}/skylight-${width}.webm`;await video.saveAs(file);
 report.push({width,height,file,events,errors});console.log('recorded',width);
}
await fs.writeFile(dir+'/recordings.json',JSON.stringify(report,null,2));await b.close();
