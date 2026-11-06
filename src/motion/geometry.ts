import { motionTokens } from "./tokens";
export type Point = { x: number; y: number };
export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));
export const anchorTimes = [0.35, 0.65] as const;
export const anchorInfluence = (index: number) =>
  3 * anchorTimes[index] * (1 - anchorTimes[index]);
function cubic(points: Point[], t: number): Point {
  const weights = [
    (1 - t) ** 3,
    3 * (1 - t) ** 2 * t,
    3 * (1 - t) * t * t,
    t ** 3,
  ];
  return {
    x: points.reduce((n, p, i) => n + p.x * weights[i], 0),
    y: points.reduce((n, p, i) => n + p.y * weights[i], 0),
  };
}
export function ribbonGeometry(a: Point, b: Point) {
  const offsets = [a, b].map((p) => ({
    x: clamp(p.x, -64, 64),
    y: clamp(p.y, -64, 64),
  }));
  const curves = [
    [
      { x: 112, y: 110 },
      { x: 258, y: 102 },
      { x: 244, y: 366 },
      { x: 390, y: 378 },
    ],
    [
      { x: 390, y: 103 },
      { x: 246, y: 112 },
      { x: 254, y: 367 },
      { x: 110, y: 382 },
    ],
  ].map((points, i) =>
    points.map((p, j) =>
      j === 1 || j === 2 ? { x: p.x + offsets[i].x, y: p.y + offsets[i].y } : p,
    ),
  );
  return {
    curves,
    paths: curves.map(
      (p) =>
        `M${p[0].x} ${p[0].y} C${p[1].x} ${p[1].y} ${p[2].x} ${p[2].y} ${p[3].x} ${p[3].y}`,
    ),
    anchors: curves.map((p, i) => cubic(p, anchorTimes[i])),
  };
}
export function ribbonPaths(a: Point, b: Point) {
  return ribbonGeometry(a, b).paths;
}
export function springStep(
  position: number,
  velocity: number,
  target: number,
  dt: number,
  response = 1,
) {
  const step = clamp(dt, 0, 1 / 30);
  const v =
    velocity +
    ((target - position) * motionTokens.spring.stiffness * response -
      velocity * motionTokens.spring.damping * Math.sqrt(response)) *
      step;
  return { position: position + v * step, velocity: v };
}
