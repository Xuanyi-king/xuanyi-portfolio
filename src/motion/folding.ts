export type FoldMetrics = {
  centerX: number;
  centerY: number;
  start: number;
  distance: number;
  navX: number;
  navY: number;
  scale: number;
  width: number;
  headerBottom?: number;
  navSize?: number;
};
const smooth = (p: number) => {
  const t = Math.max(0, Math.min(1, p));
  return t * t * (3 - 2 * t);
};
function interpolate(
  p: number,
  points: readonly (readonly [number, number])[],
) {
  for (let i = 1; i < points.length; i++) {
    if (p <= points[i][0]) {
      const a = points[i - 1],
        b = points[i];
      return a[1] + (b[1] - a[1]) * smooth((p - a[0]) / (b[0] - a[0]));
    }
  }
  return points.at(-1)![1];
}
export function foldFrame(progress: number, m: FoldMetrics) {
  const p = Math.max(0, Math.min(1, progress)),
    targetX = m.navX - m.centerX,
    targetY = m.navY - m.centerY + m.start + m.distance;
  if (p === 0) return { x: 0, y: 0, scale: 1, rotation: 0 };
  if (p === 1) return { x: targetX, y: targetY, scale: m.scale, rotation: 9 };
  if (m.width <= 760) {
    const lane = m.width - (m.width <= 370 ? 34 : 50);
    const x = interpolate(p, [
      [0, m.centerX],
      [0.4, lane],
      [0.6, lane - 12],
      [0.7, lane - 70],
      [0.8, m.navX + 100],
      [0.9, m.navX + 8],
      [0.96, m.navX],
      [1, m.navX],
    ]);
    const screenY = interpolate(p, [
      [0, m.centerY - m.start],
      [0.3, 170],
      [0.5, 175],
      [0.65, 180],
      [0.7, 180],
      [0.8, 145],
      [0.9, 96],
      [0.96, 82],
      [1, m.navY],
    ]);
    const scale = interpolate(p, [
      [0, 1],
      [0.4, 0.35],
      [0.7, 0.18],
      [0.9, m.scale],
      [1, m.scale],
    ]);
    return {
      x: x - m.centerX,
      y: screenY - m.centerY + m.start + m.distance * p,
      scale,
      rotation: 9 * smooth(p),
    };
  }
  const easing = p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) ** 2,
    middle = targetY * 0.5 + 30;
  const x = targetX * smooth((p - 0.2) / 0.8);
  const y =
    p <= 0.5 ? middle * p * 2 : middle + (targetY - middle) * (p - 0.5) * 2;
  // Keep the small mark below the header until it overlaps the nav's x lane.
  // A soft maximum rounds the approach without a clamp kink or a pinned layer.
  const screenY = m.centerY + y - m.start - m.distance * p;
  const clearance = (m.headerBottom ?? m.navY * 2) + 32;
  const blend = Math.max(0, Math.min(1, 0.5 + (clearance - screenY) / 48));
  const readableY =
    screenY + (clearance - screenY) * blend + 24 * blend * (1 - blend);
  const navSize = Math.max(1, m.navSize ?? 24);
  const lateral = Math.abs(m.centerX + x - m.navX);
  const open = smooth((lateral - navSize * 0.35) / navSize);
  return {
    x,
    y: y + (readableY - screenY) * open,
    scale: 1 + (m.scale - 1) * easing,
    rotation: 9 * smooth((p - 0.2) / 0.8),
  };
}
