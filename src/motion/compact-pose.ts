import { clamp } from "./geometry";

/** Spatial precision gate only: no clock, animation state or extra SVG writer.
 * Half an SVG unit is under 0.064px at a 64px icon, before cubic influence.
 * Full-size Hero/Lab curves never use this gate. */
export function createCompactPoseGate() {
  let previous: string | undefined;
  return (values: readonly number[]) => {
    const pose = values.map((value) => Math.round(clamp(value, -64, 64)) || 0);
    const key = pose.join(",");
    if (key === previous) return null;
    previous = key;
    return pose;
  };
}
