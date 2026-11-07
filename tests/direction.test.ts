import test from 'node:test';
import assert from 'node:assert/strict';
import { directionFrame } from '../src/motion/direction';
test('director mapping is bounded, reversible and settles without hiding links',()=>{
 for(const v of ['thread','space'] as const){
  for(let i=0;i<=1000;i++){
   const p=i/1000,a=directionFrame(p,v),b=directionFrame(p,v);
   assert.deepEqual(a,b);assert.ok(Object.values(a).every(Number.isFinite));
   assert.ok(a.gallery>=0&&a.gallery<=1);assert.ok(Math.abs(a.force)<=20);
  }
  assert.equal(directionFrame(1,v).gallery,1);assert.equal(directionFrame(1,v).force,0);
 }
 assert.notDeepEqual(directionFrame(.5,'thread'),directionFrame(.5,'space'));
});
