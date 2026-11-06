import { clamp, springStep } from "./geometry";
import { motionTokens } from "./tokens";
export type SpringScheduler = {
  request: (fn: (now: number) => void) => number;
  cancel: (id: number) => void;
};
export function createLivingSpring(
  paint: (values: readonly number[]) => void,
  scheduler: SpringScheduler,
) {
  const values = [0, 0, 0, 0],
    velocity = [0, 0, 0, 0],
    input = [0, 0, 0, 0];
  let form = "rest",
    strength = 1,
    reduced = false,
    target = [0, 0, 0, 0],
    frame: number | null = null,
    last: number | null = null,
    disposed = false;
  const cancel = () => {
    if (frame !== null) scheduler.cancel(frame);
    frame = null;
    last = null;
  };
  const settle = () => {
    cancel();
    target.forEach((n, i) => {
      values[i] = n;
      velocity[i] = 0;
    });
    paint([...values]);
  };
  const tick = (now: number) => {
    frame = null;
    if (disposed) return;
    const dt = last === null ? 1 / 60 : (now - last) / 1000;
    last = now;
    let moving = false;
    values.forEach((v, i) => {
      const next = springStep(v, velocity[i], target[i], dt);
      values[i] = next.position;
      velocity[i] = next.velocity;
      moving ||=
        Math.abs(values[i] - target[i]) > motionTokens.spring.precision ||
        Math.abs(velocity[i]) > motionTokens.spring.precision;
    });
    if (moving) {
      paint([...values]);
      frame = scheduler.request(tick);
    } else settle();
  };
  const aim = () => {
    if (disposed) return;
    const base =
      form === "open"
        ? [30, -35, -30, 35]
        : form === "fold"
          ? [-30, 25, 30, -25]
          : [0, 0, 0, 0];
    target = base.map((n, i) => clamp(n + input[i] * strength, -64, 64));
    if (reduced) settle();
    else if (frame === null) {
      last = null;
      frame = scheduler.request(tick);
    }
  };
  return {
    configure(next: { form: string; strength: number }, reset = false) {
      form = next.form;
      strength = clamp(next.strength, 0.3, 1.5);
      if (reset) input.fill(0);
      aim();
    },
    setReduced(value: boolean) {
      reduced = value;
      aim();
    },
    pull(index: number, x: number, y: number) {
      if (index !== 0 && index !== 1) return;
      input[index * 2] = clamp(x, -128, 128);
      input[index * 2 + 1] = clamp(y, -128, 128);
      aim();
    },
    release(index?: number) {
      if (index === 0 || index === 1) {
        input[index * 2] = 0;
        input[index * 2 + 1] = 0;
      } else input.fill(0);
      aim();
    },
    dispose() {
      disposed = true;
      cancel();
    },
  };
}
