import {chromium} from 'playwright';import fs from 'node:fs/promises';
const dir=(process.env.BROWSER_EVIDENCE_DIR??'artifacts/browser')+'/passing-curve/stills';await fs.mkdir(dir,{recursive:true});const b=await chromium.launch();
try{for(const [width,height] of [[1440,900],[768,1024],[390,844],[320,740]]){
 const c=await b.newContext({viewport:{width,height}}),p=await c.newPage();
 await p.goto((process.env.PASSING_OLD_URL??'http://localhost:4189')+'/lab/motion-direction/');await p.evaluate(()=>document.fonts.ready);for(const n of [0,250,400,500,600,750,900,1000]){await p.locator('#direction-progress').fill(String(n));await p.waitForTimeout(80);await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));const clip=await p.locator('.direction-stage').boundingBox();await p.screenshot({fullPage:true,clip,path:`${dir}/oldA-${width}-${n}.png`})}
 await p.goto((process.env.PASSING_BASELINE_URL??'http://localhost:4191')+'/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1800);await p.screenshot({path:`${dir}/baseline-${width}-hero.png`});await p.locator('.living-gallery').scrollIntoViewIfNeeded();await p.waitForTimeout(200);await p.screenshot({path:`${dir}/baseline-${width}-gallery.png`});await c.close();
}}finally{await b.close()}
