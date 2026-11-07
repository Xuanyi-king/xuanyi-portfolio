export type GalleryIntent = "pending" | "horizontal" | "vertical" | "longpress";
export function gestureIntent(
  dx: number,
  dy: number,
  elapsed: number,
): GalleryIntent {
  const x = Math.abs(dx),
    y = Math.abs(dy);
  if (Math.max(x, y) < 8) return elapsed > 500 ? "longpress" : "pending";
  if (x > y * 1.2) return "horizontal";
  if (y > x * 1.2 || Math.hypot(x, y) > 18) return "vertical";
  return "pending";
}
