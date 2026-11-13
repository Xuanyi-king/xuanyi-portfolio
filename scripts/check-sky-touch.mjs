import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const b=await chromium.launch(),report=[];
for(const width of [390,320]){
 const c=await b.newContext({viewport:{width,height:844},hasTouch:true}),p=await c.newPage();
 await p.goto('http://localhost:4187/lab/sky-edition/');await p.waitForSelector('.living-gallery[data-enhanced="true"]');
 await p.locator('.gallery-stage').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-260,behavior:'instant'}));await p.waitForTimeout(300);
 const cdp=await c.newCDPSession(p);
 const gesture=async(dx,dy)=>{const x=width*.72,y=450;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=18;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/18,y:y+dy*i/18}]});await p.waitForTimeout(20)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(750)};
 const beforeY=await p.evaluate(()=>scrollY),beforePosition=+(await p.locator('.gallery-stage').getAttribute('data-position'));
 await gesture(2,-150);const afterY=await p.evaluate(()=>scrollY),afterPosition=+(await p.locator('.gallery-stage').getAttribute('data-position'));
 assert.ok(afterY-beforeY>60,'vertical touch scrolls document');assert.ok(Math.abs(afterPosition-beforePosition)<.01,'vertical touch does not change project');
 await p.locator('.gallery-stage').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-260,behavior:'instant'}));await p.waitForTimeout(250);
 await gesture(-145,2);const horizontal=+(await p.locator('.gallery-stage').getAttribute('data-position'));
 assert.ok(Math.abs(horizontal-afterPosition)>.2,'horizontal touch moves gallery');
 report.push({width,verticalTravel:afterY-beforeY,verticalProjectDelta:afterPosition-beforePosition,horizontalProjectDelta:horizontal-afterPosition});await c.close();
}
await fs.writeFile((process.env.SKY_EVIDENCE_DIR||'docs/evidence/sky-edition/final')+'/touch.json',JSON.stringify(report,null,2));console.log(report);await b.close();
