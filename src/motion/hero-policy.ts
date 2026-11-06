// Load timing never decides whether the brand gets its visual narrative: CSS owns that.
export function heroMode({
  scrollY,
  visible,
  restored,
}: {
  sincePaint?: number;
  scrollY: number;
  visible: boolean;
  restored: boolean;
}) {
  return visible && !restored && scrollY <= 40 ? "enhance" : "none";
}
