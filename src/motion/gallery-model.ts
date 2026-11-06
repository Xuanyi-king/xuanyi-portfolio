export const positiveModulo = (value: number, count: number) =>
  count > 0 ? ((value % count) + count) % count : 0;
export function signedDistance(index: number, position: number, count: number) {
  return count <= 1
    ? 0
    : positiveModulo(index - position + count / 2, count) - count / 2;
}
const smooth = (t: number) => {
  const p = Math.max(0, Math.min(1, t));
  return p * p * (3 - 2 * p);
};
export function gallerySpacing(width: number) {
  return Math.min(660, Math.max(210, width * (width <= 760 ? 0.64 : 0.48)));
}
export function frameFor(
  index: number,
  position: number,
  count: number,
  width: number,
  reduced = false,
) {
  const distance = signedDistance(index, position, count),
    a = Math.abs(distance),
    window = Math.min(count / 2, 1.8);
  const opacity =
    count <= 1
      ? 1
      : reduced
        ? a < 0.01
          ? 1
          : 0
        : 1 -
          smooth(
            (a - Math.min(0.85, window * 0.6)) /
              (window - Math.min(0.85, window * 0.6)),
          );
  return {
    distance,
    x: reduced ? 0 : distance * gallerySpacing(width),
    y: reduced ? 0 : a * (width <= 760 ? 18 : 28),
    z: reduced ? 0 : -Math.pow(a, 0.9) * (width <= 760 ? 180 : 240),
    yaw: reduced
      ? 0
      : Math.max(-62, Math.min(62, -distance * (width <= 760 ? 25 : 34))),
    scale: reduced ? 1 : Math.max(0.65, 1 - a * 0.12),
    opacity,
    zIndex: 1000 - Math.round(a * 100),
  };
}
export function frameTransform(frame: ReturnType<typeof frameFor>) {
  return `translate3d(calc(-50% + ${frame.x.toFixed(3)}px),${frame.y.toFixed(3)}px,${frame.z.toFixed(3)}px) rotateY(${frame.yaw.toFixed(3)}deg) scale(${frame.scale.toFixed(4)})`;
}
