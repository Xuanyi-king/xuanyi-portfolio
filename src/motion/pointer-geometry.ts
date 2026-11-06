import { clamp } from "./geometry";
export function pointerTilt(
  clientX: number,
  clientY: number,
  bounds: { left: number; top: number; width: number; height: number },
) {
  return {
    x:
      clamp(
        (clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5,
        -0.5,
        0.5,
      ) * 5,
    y:
      -clamp(
        (clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5,
        -0.5,
        0.5,
      ) * 5,
  };
}
