import { motionTokens } from "./tokens";
export type Point = { x: number; y: number };
export const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));
export function ribbonPaths(a: Point, b: Point) {
  const ax = clamp(a.x, -64, 64),
    ay = clamp(a.y, -64, 64),
    bx = clamp(b.x, -64, 64),
    by = clamp(b.y, -64, 64);
  return [
    `M112 110 C${258 + ax} ${102 + ay} ${244 - ax * 0.55} ${366 + ay * 0.45} 390 378`,
    `M390 103 C${246 + bx} ${112 + by} ${254 - bx * 0.55} ${367 + by * 0.45} 110 382`,
  ];
}
export function springStep(
  position: number,
  velocity: number,
  target: number,
  dt: number,
) {
  const step = clamp(dt, 0, 1 / 30);
  const v =
    velocity +
    ((target - position) * motionTokens.spring.stiffness -
      velocity * motionTokens.spring.damping) *
      step;
  return { position: position + v * step, velocity: v };
}
