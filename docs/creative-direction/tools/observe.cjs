// Captures public preview evidence only; requires environment Playwright.
const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/chromium',headless:true,args:['--disable-dev-shm-usage']});
 const out=require('node:path').resolve(__dirname,'../evidence');
 const report={capturedAt:new Date().toISOString(),browser:await browser.version(),views:[]};
 for(const [label,url,width,height] of [['live-desktop','https://xuanyi-king.github.io/xuanyi-portfolio/',1440,1000],['live-mobile','https://xuanyi-king.github.io/xuanyi-portfolio/',390,844],['reference-desktop','https://haoqi.design/',1440,1000]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,recordVideo: label==='live-desktop'?{dir:out+'/video',size:{width:1440,height:1000}}:undefined});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'networkidle',timeout:60000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1500);
  const meta=await page.evaluate(()=>({title:document.title,text:document.body.innerText,scrollHeight:document.documentElement.scrollHeight,sections:[...document.querySelectorAll('section')].map(e=>({id:e.id,class:e.className,y:e.getBoundingClientRect().top+scrollY,h:e.offsetHeight})),headings:[...document.querySelectorAll('h1,h2')].map(e=>({text:e.textContent,font:getComputedStyle(e).fontFamily,size:getComputedStyle(e).fontSize})),links:[...document.querySelectorAll('a')].map(e=>({text:e.innerText,href:e.getAttribute('href')}))}));
  fs.writeFileSync(out+'/'+label+'.json',JSON.stringify(meta,null,2));await page.screenshot({path:out+'/'+label+'-hero.png'});
  if(label.startsWith('live')){
   await page.mouse.move(width*.73,height*.38,{steps:25});await page.waitForTimeout(600);await page.screenshot({path:out+'/'+label+'-pointer.png'});
   const max=meta.scrollHeight-height;
   for(const [i,y] of [Math.min(800,max),Math.min(1500,max),Math.min(2300,max),Math.min(3400,max),max].entries()){
    await page.mouse.wheel(0,y-(await page.evaluate(()=>scrollY)));await page.waitForTimeout(900);await page.screenshot({path:out+'/'+label+'-scroll-'+i+'.png'});
   }
   await page.screenshot({path:out+'/'+label+'-full.png',fullPage:true});
   for(let y=max;y>0;y-=250){await page.mouse.wheel(0,-250);await page.waitForTimeout(45);}
  }else{await page.mouse.wheel(0,850);await page.waitForTimeout(900);await page.screenshot({path:out+'/'+label+'-work.png'});}
  report.views.push({label,url,width,height,errors});await context.close();
 }
 fs.writeFileSync(out+'/observations.json',JSON.stringify(report,null,2));await browser.close();
})();
