import { clamp } from "./geometry";

// A fixed point beside the title leads into the same spring as the ribbons.
// Only controls near the X move (at most 8 SVG units); type and copy stay still.
export function threadPath(
  mobile: boolean,
  values: readonly number[] = [0, 0, 0, 0],
) {
  const x = clamp(values[0] * 0.12, -8, 8);
  const y = clamp(values[1] * 0.12, -8, 8);
  return mobile
    ? `M250 140 C330 140 ${348 + x} ${185 + y} 326 239 C${302 + x} ${305 + y} 200 335 136 324`
    : `M555 282 C680 282 ${725 + x} ${176 + y} 865 176 C${1030 + x} ${176 + y} 1135 255 1095 355 C1058 450 930 475 815 472`;
}
