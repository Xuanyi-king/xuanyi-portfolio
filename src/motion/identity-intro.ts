import type { SpringScheduler } from "./living-spring";

const duration = 1540;
export function introPose(elapsed: number) {
  const pulse = (delay: number) => {
    const t = Math.max(0, Math.min(1, (elapsed - delay) / 1320));
    return Math.sin(Math.PI * t) ** 2;
  };
  const done = elapsed >= duration;
  const a = done ? 0 : pulse(0),
    b = done ? 0 : pulse(160);
  return {
    values: [32 * a, -16 * a, -32 * b, 18 * b].map((value) =>
      value === 0 ? 0 : value,
    ),
    done,
  };
}

/** Intro and spring share the same renderer, gated by curve-owner. No CSS d
 * interpolation or second animation library can write these surfaces. */
export function playIdentityIntro(
  render: (values: readonly number[]) => void,
  complete: () => void,
  scheduler: SpringScheduler,
  allowed: () => boolean = () => true,
) {
  let frame: number | null = null,
    start: number | undefined,
    stopped = false;
  const finish = () => {
    if (stopped) return;
    stopped = true;
    if (frame !== null) scheduler.cancel(frame);
    frame = null;
    render([0, 0, 0, 0]);
    complete();
  };
  const tick = (now: number) => {
    frame = null;
    if (stopped) return;
    if (!allowed()) {
      finish();
      return;
    }
    start ??= now;
    const pose = introPose(now - start);
    if (pose.done) {
      finish();
      return;
    }
    render(pose.values);
    frame = scheduler.request(tick);
  };
  frame = scheduler.request(tick);
  return {
    cancel(settle = false) {
      if (settle) {
        finish();
        return;
      }
      stopped = true;
      if (frame !== null) scheduler.cancel(frame);
      frame = null;
    },
  };
}
