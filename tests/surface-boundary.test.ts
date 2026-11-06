import test from "node:test";
import assert from "node:assert/strict";
import { ribbonGeometry } from "../src/motion/geometry";
import { silkSurface } from "../src/motion/surface";
type P = { x: number; y: number };
function flatten(d: string) {
  const tokens = d.match(/[MCLZ]|-?\d+(?:\.\d+)?/g)!;
  let at = 0,
    p: P = { x: 0, y: 0 };
  const points: P[] = [];
  const point = () => ({ x: Number(tokens[at++]), y: Number(tokens[at++]) });
  while (at < tokens.length) {
    const command = tokens[at++];
    if (command === "M" || command === "L") {
      p = point();
      points.push(p);
    } else if (command === "C") {
      const a = p,
        b = point(),
        c = point(),
        e = point();
      for (let i = 1; i <= 8; i++) {
        const t = i / 8,
          u = 1 - t;
        points.push({
          x:
            u * u * u * a.x +
            3 * u * u * t * b.x +
            3 * u * t * t * c.x +
            t * t * t * e.x,
          y:
            u * u * u * a.y +
            3 * u * u * t * b.y +
            3 * u * t * t * c.y +
            t * t * t * e.y,
        });
      }
      p = e;
    }
  }
  return points;
}
const cross = (a: P, b: P, c: P) =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
function intersects(a: P, b: P, c: P, d: P) {
  return (
    cross(a, b, c) * cross(a, b, d) < -1e-8 &&
    cross(c, d, a) * cross(c, d, b) < -1e-8
  );
}
test("sampled ribbon outlines remain simple through bounded Lab deformations", () => {
  for (const x of [-64, 0, 64])
    for (const y of [-64, 0, 64])
      ribbonGeometry({ x, y }, { x: -x, y: -y }).curves.forEach(
        (curve, index) => {
          const p = flatten(silkSurface(curve, index).outline);
          for (let i = 0; i < p.length; i++)
            for (let j = i + 2; j < p.length; j++) {
              if (i === 0 && j === p.length - 1) continue;
              assert.ok(
                !intersects(
                  p[i],
                  p[(i + 1) % p.length],
                  p[j],
                  p[(j + 1) % p.length],
                ),
                `self-crossing for ${index}/${x}/${y}`,
              );
            }
        },
      );
});
