import test from 'node:test';
import assert from 'node:assert/strict';
import { skyFrame, skyTransport } from '../src/motion/sky-transition';
import { frameFor } from '../src/motion/gallery-model';

test('sky handoff is reversible, bounded and unfolds content before the X disappears',()=>{
 for(const width of [320,390,768,1440]){
  const samples=[0,.25,.5,.75,1].map(p=>skyFrame(p,width));
  for(const f of samples)for(const value of Object.values(f))assert.ok(Number.isFinite(value));
  assert.equal(samples[0].mark,1);assert.equal(samples[4].mark,0);
  assert.equal(samples[4].open,1);
  const middle=skyFrame(.6,width);
  assert.ok(middle.open>.5 && middle.mark>.5);
  assert.deepEqual(samples,[1,.75,.5,.25,0].map(p=>skyFrame(p,width)).reverse());
 }
 assert.deepEqual(skyFrame(NaN,390),skyFrame(0,390));
});
test('sky gallery keeps a readable central cover and gentler adjacent views',()=>{
 const center=frameFor(0,0,3,1440,false,'sky');
 assert.equal(Math.abs(center.yaw),0);assert.equal(center.opacity,1);assert.equal(center.scale,1);
 const side=frameFor(1,0,3,1440,false,'sky');
 assert.ok(Math.abs(side.yaw)<=21);assert.ok(side.z<0);assert.ok(side.opacity>.5);
 assert.ok(Math.abs(side.yaw)<Math.abs(frameFor(1,0,3,1440).yaw));
});

test('Sky mobile transport stays in the reading margin while copy is on screen',()=>{
 const m={centerX:234,centerY:480,start:33,distance:635,navX:40,navY:42,scale:.1,width:390,headerBottom:83,navSize:28};
 for(const p of [.5,.6,.7,.75,.8,.9]){
  const f=skyTransport(p,m);
  assert.ok(m.centerX+f.x>350,`X center ${m.centerX+f.x} must stay out of the full-width Chinese copy`);
  assert.ok(f.scale<.2);
 }
 assert.deepEqual(skyTransport(0,m),{x:0,y:0,scale:1,rotation:0});
});
