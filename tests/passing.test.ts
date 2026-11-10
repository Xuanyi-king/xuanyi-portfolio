import test from 'node:test';
import assert from 'node:assert/strict';
import { passingFrame, passingScrollProgress } from '../src/motion/passing';
// Removing the overlap would recreate the empty middle; these checks pin the handoff contract.
test('a real project takes focus before X leaves and every stopped state reverses deterministically',()=>{
 for(const mobile of [false,true]){
  for(let i=0;i<=100;i++){
   const f=passingFrame(i/100,mobile);
   assert.ok(Object.values(f).every(Number.isFinite));
   assert.ok(f.mark>.35||f.reveal>.65,'no interval with neither mark nor work');
   assert.deepEqual(f,passingFrame(i/100,mobile));
  }
  assert.ok(passingFrame(.5,mobile).reveal>.5);
  assert.ok(passingFrame(.5,mobile).mark>.5);
  assert.equal(passingFrame(.8,mobile).interactive,1);
  assert.equal(passingFrame(.9,mobile).guide,0);
  assert.deepEqual(passingFrame(.9,mobile),passingFrame(1,mobile),'final viewing pause');
  assert.deepEqual(passingFrame(NaN,mobile),passingFrame(0,mobile));
 }
});
test('scroll maps position, clamps fast jumps, and reverses without depending on elapsed time',()=>{
 assert.equal(passingScrollProgress(100,900,700,false),0);
 assert.equal(passingScrollProgress(-260,900,700,false),.5);
 assert.equal(passingScrollProgress(-10000,900,700,false),1);
 assert.equal(passingScrollProgress(10000,844,1100,true),0);
 assert.equal(passingScrollProgress(-144,844,1100,true),.5);
 assert.equal(passingScrollProgress(-144,844,1100,true),passingScrollProgress(-144,844,1100,true));
});
