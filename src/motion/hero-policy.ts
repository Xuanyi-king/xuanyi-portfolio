export function heroMode({
  sincePaint,
  scrollY,
  visible,
  restored,
}: {
  sincePaint: number;
  scrollY: number;
  visible: boolean;
  restored: boolean;
}) {
  if (!visible || restored || scrollY > 40) return "none";
  // Fast hydration may reveal text. Late hydration only settles the already-visible artwork.
  return sincePaint < 200 ? "entrance" : "settle";
}
