import {chromium} from 'playwright';
const b=await chromium.launch();
for(const width of [1440,390]){
 const p=await b.newPage({viewport:{width,height:width===1440?900:844}});
 for(const name of ['work','about','notes']){
  await p.goto('http://localhost:4187/lab/sky-edition/'+name+'/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(700);
  await p.screenshot({path:`docs/evidence/sky-edition/final/${name}-${width}.png`});
  if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error(name+' overflow');
 }
 await p.close();
}
await b.close();
