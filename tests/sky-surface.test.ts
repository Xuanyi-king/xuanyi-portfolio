import test from 'node:test';
import assert from 'node:assert/strict';
import { ribbonGeometry } from '../src/motion/geometry';
import { skySurface } from '../src/motion/sky-surface';

test('sky projection stays finite, closed and inside its drawing frame under spring extremes', () => {
  for (const profile of ['cloud', 'sky'] as const) for (const x of [-64, 0, 64]) for (const y of [-64, 0, 64]) {
    const curves = ribbonGeometry({x,y}, {x:-x,y:-y}).curves;
    curves.forEach((curve, i) => {
      const s = skySurface(curve, i, profile);
      for (const path of [s.outline,s.rim,...s.bands.map(b=>b.d)]) {
        assert.ok(path.startsWith('M') && path.endsWith('Z'));
        assert.ok(!/NaN|Infinity/.test(path));
        for (const number of path.match(/-?\d+(?:\.\d+)?/g) ?? []) assert.ok(+number > -50 && +number < 550);
      }
      assert.ok(s.bands.every(b => b.stops.every(c => /^#[0-9a-f]{6}$/i.test(c))));
      assert.ok(s.depthRange > 15, 'actual out-of-plane curvature');
    });
  }
});
test('cloud and ribbon prototypes differ in geometry and diffuse material', () => {
  const curve=ribbonGeometry({x:0,y:0},{x:0,y:0}).curves[0];
  const a=skySurface(curve,0,'cloud'),b=skySurface(curve,0,'sky');
  assert.notEqual(a.outline,b.outline);
  assert.notDeepEqual(a.bands.map(b=>b.stops),b.bands.map(b=>b.stops));
});
test('small sky identities keep the same family with a bounded rendering budget', () => {
  const curve=ribbonGeometry({x:0,y:0},{x:0,y:0}).curves[1];
  const small=skySurface(curve,1,'sky',true);
  assert.ok(small.bands.length<=6);
  assert.ok(small.outline.length<6000);
});
