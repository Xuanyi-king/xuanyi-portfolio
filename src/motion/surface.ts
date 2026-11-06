import { clamp, type Point } from "./geometry";
const steps = 28;
const n = (value: number) => Number(value.toFixed(2));
const xy = (p: Point) => `${n(p.x)} ${n(p.y)}`;
function smooth(points: Point[], move = true) {
  let d = move ? `M${xy(points[0])}` : "";
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[Math.max(0, i - 1)],
      b = points[i],
      c = points[i + 1],
      e = points[Math.min(points.length - 1, i + 2)];
    d += ` C${xy({ x: b.x + (c.x - a.x) / 6, y: b.y + (c.y - a.y) / 6 })} ${xy({ x: c.x - (e.x - b.x) / 6, y: c.y - (e.y - b.y) / 6 })} ${xy(c)}`;
  }
  return d;
}
export function silkSurface(curve: Point[], index: number, compact = false) {
  const [a, b, c, d] = curve;
  const samples = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps,
      u = 1 - t;
    const p = {
      x:
        u * u * u * a.x +
        3 * u * u * t * b.x +
        3 * u * t * t * c.x +
        t * t * t * d.x,
      y:
        u * u * u * a.y +
        3 * u * u * t * b.y +
        3 * u * t * t * c.y +
        t * t * t * d.y,
    };
    const dx =
        3 * u * u * (b.x - a.x) +
        6 * u * t * (c.x - b.x) +
        3 * t * t * (d.x - c.x),
      dy =
        3 * u * u * (b.y - a.y) +
        6 * u * t * (c.y - b.y) +
        3 * t * t * (d.y - c.y),
      length = Math.max(0.001, Math.hypot(dx, dy));
    const ddx = 6 * u * (c.x - 2 * b.x + a.x) + 6 * t * (d.x - 2 * c.x + b.x),
      ddy = 6 * u * (c.y - 2 * b.y + a.y) + 6 * t * (d.y - 2 * c.y + b.y),
      curvature = Math.abs(dx * ddy - dy * ddx) / length ** 3;
    let half =
      index === 0
        ? 25 +
          8 * Math.sin(Math.PI * t) -
          18 * Math.exp(-(((t - 0.49) / 0.17) ** 2))
        : 22 + 12 * Math.sin(Math.PI * t) ** 2 + 3 * Math.sin(2 * Math.PI * t);
    // Wide offsets around tight bends can cusp: retain a safe positive radius.
    half = Math.min(half, curvature > 0 ? 0.72 / curvature : half);
    half = clamp(half, 6, 38);
    if (compact) half = Math.max(half, 25) * 1.16;
    const tilt =
      (index === 0 ? -0.22 : 0.25) +
      Math.sin(Math.PI * t) * (index === 0 ? 0.65 : -0.75);
    return { t, p, normal: { x: -dy / length, y: dx / length }, half, tilt };
  });
  const side = (s: number) =>
    samples.map(({ p, normal, half, tilt }) => {
      // Project a shallow curved cross-section. The editable center stays on
      // the cubic, while its edges turn in space rather than staying parallel.
      const across = half * s * Math.cos(tilt),
        z = half * s * Math.sin(tilt) - half * 0.16 * s * s;
      return {
        x: p.x + normal.x * across + z * 0.1,
        y: p.y + normal.y * across - z * 0.28,
      };
    });
  const strip = (from: number, to: number) => {
    const left = side(from),
      right = side(to).reverse();
    return `${smooth(left)} L${xy(right[0])}${smooth(right, false)} Z`;
  };
  return {
    outline: strip(-1, 1),
    face: strip(-0.98, 0.99),
    edge: strip(-1, -0.96),
    sheen: strip(-0.98, 0.99),
    highlight: smooth(side(0.96).slice(1, -1)),
    widths: samples.map((s) => s.half * 2),
  };
}
