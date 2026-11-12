import test from 'node:test';
import assert from 'node:assert/strict';
import { skyFrame } from '../src/motion/sky-transition';
import { frameFor } from '../src/motion/gallery-model';

test('sky handoff is reversible, bounded and unfolds content before the X disappears',()=>{
 for(const width of [320,390,768,1440]){
  const samples=[0,.25,.5,.75,1].map(p=>skyFrame(p,width));
  for(const f of samples)for(const value of Object.values(f))assert.ok(Number.isFinite(value));
  assert.equal(samples[0].force,0);assert.equal(samples[4].force,0);
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
