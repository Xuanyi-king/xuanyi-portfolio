import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch();
for(const width of [390,320]){
 const p=await b.newPage({viewport:{width,height:844}});
 await p.goto('http://localhost:4187/lab/sky-edition/');await p.evaluate(()=>document.fonts.ready);
 const m=await p.evaluate(()=>{const h=document.querySelector('.sky-hero');return{start:h.offsetTop-document.querySelector('.site-header').offsetHeight,distance:Math.min(660,h.offsetHeight*.86)}});
 for(const progress of [.5,.6,.65,.7,.75,.8,.85,.9]){
  await p.evaluate(y=>scrollTo({top:y,behavior:'instant'}),m.start+m.distance*progress);await p.waitForTimeout(140);
  const collisions=await p.evaluate(()=>{
   const svg=document.querySelector('.sky-sculpture svg'),box=svg.getBBox(),matrix=svg.getScreenCTM();
   const points=[[box.x,box.y],[box.x+box.width,box.y],[box.x,box.y+box.height],[box.x+box.width,box.y+box.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(matrix));
   const mark={left:Math.min(...points.map(p=>p.x)),right:Math.max(...points.map(p=>p.x)),top:Math.min(...points.map(p=>p.y)),bottom:Math.max(...points.map(p=>p.y))};
   const visible=+getComputedStyle(document.querySelector('.sky-sculpture')).opacity>.1;
   const walker=document.createTreeWalker(document.querySelector('.sky-hero-copy'),NodeFilter.SHOW_TEXT),rects=[];
   while(walker.nextNode()){if(!walker.currentNode.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(walker.currentNode);for(const rect of range.getClientRects())rects.push(rect)}
   return visible?rects.filter(r=>r.bottom>document.querySelector('.site-header').offsetHeight && mark.left<r.right+2&&mark.right>r.left-2&&mark.top<r.bottom+2&&mark.bottom>r.top-2).map(r=>({textTop:r.top,textRight:r.right,mark})):[];
  });
  assert.deepEqual(collisions,[],`${width}px at ${progress}: moving X crosses copy`);
 }
 await p.close();
}
await b.close();console.log('Phone moving X stays clear of actual rendered text lines at 320/390');
