import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const dir='docs/evidence/sky-edition/static';
const errors=[];
for(const [width,height] of [[1440,900],[390,844],[768,1024],[320,740]]) {
 const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
 const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
 for(const [name,url] of [
 ['baseline','http://localhost:4188/'],
 ['cloud','http://localhost:4187/lab/sky-edition/cloud-silk/'],
 ['ribbon','http://localhost:4187/lab/sky-edition/sky-ribbon/']]){
  await page.goto(url);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1200);
  await page.screenshot({path:`${dir}/${name}-${width}-hero.png`});
  if(name!=='baseline'){
   await page.evaluate(()=>scrollTo({top:document.querySelector('#sky-work').offsetTop-110,behavior:'instant'}));await page.waitForTimeout(600);
   await page.screenshot({path:`${dir}/${name}-${width}-gallery.png`});
  }
  console.log(name,width,await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,title:document.querySelector('h1')?.textContent})));
 }
 await ctx.close();
}
for(const [name,url] of [['old-site','https://xuanyi-curiosity.astutebook516.chatgpt.site/'],['github-preview','https://xuanyi-king.github.io/xuanyi-portfolio/']]) {
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 try{await page.goto(url,{timeout:25000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1000);await page.screenshot({path:`${dir}/${name}-1440.png`});console.log(name,await page.title());}catch(e){console.log(name,e.message)}
 await page.close();
}
await fs.writeFile(`${dir}/capture.json`,JSON.stringify({baselineSHA:'31222d9',homepageVersion:'2.2 (75a1e19)',errors},null,2));
await browser.close();
