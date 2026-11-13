import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync } from 'node:fs';
import { SkyXMark } from '../src/components/sky-x-mark';
Object.assign(globalThis,{React});
for(const profile of ['cloud','sky'] as const){
 const svg=renderToStaticMarkup(<SkyXMark profile={profile} decorative={false}/>).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ');
 writeFileSync(`docs/evidence/sky-edition/prototypes/${profile==='cloud'?'cloud-silk':'sky-ribbon'}.svg`,svg+'\n');
}
console.log('Two standalone SVG prototypes exported from the actual page renderer.');
