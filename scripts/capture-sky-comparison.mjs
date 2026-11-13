import {chromium} from 'playwright';
const b=await chromium.launch();
for(const [width,height] of [[1440,900],[390,844]]){
 const c=await b.newContext({viewport:{width,height},hasTouch:width<760}),p=await c.newPage();
 await p.goto('http://localhost:4188/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1600);
 if(width>760){await p.mouse.move(width*.85,320);await p.waitForTimeout(600)}
 await p.screenshot({path:`docs/evidence/sky-edition/final/baseline-${width}-interaction.png`});
 await p.locator('#selected-work').screenshot({path:`docs/evidence/sky-edition/final/baseline-${width}-gallery.png`});
 if(width<760){
  await p.goto('http://localhost:4187/lab/sky-edition/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
  const cdp=await c.newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:260,y:450}]});await p.waitForTimeout(350);
  await p.screenshot({path:`docs/evidence/sky-edition/final/chromium-${width}-touch.png`});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 }
 await c.close();
}
await b.close();
