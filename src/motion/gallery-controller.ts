import { positiveModulo } from "./gallery-model";
import type { SpringScheduler } from "./living-spring";
type Callbacks = {
  frame: (position: number) => void;
  active: (index: number) => void;
  settled?: () => void;
};
export function createGalleryController(
  count: number,
  callbacks: Callbacks,
  scheduler: SpringScheduler,
  initialPosition = 0,
) {
  let position =
      count > 1 && Number.isFinite(initialPosition)
        ? Math.round(initialPosition)
        : 0,
    target = position,
    velocity = 0,
    held = false,
    reduced = false,
    disposed = false,
    frame: number | null = null,
    last: number | null = null,
    active = -1;
  const stop = () => {
    if (frame !== null) scheduler.cancel(frame);
    frame = null;
    last = null;
  };
  const paint = () => {
    if (disposed) return;
    callbacks.frame(position);
    const next = positiveModulo(Math.round(position), count);
    if (next !== active) {
      active = next;
      callbacks.active(next);
    }
  };
  const settle = () => {
    stop();
    position = target;
    velocity = 0;
    paint();
    callbacks.settled?.();
  };
  const tick = (now: number) => {
    frame = null;
    if (disposed || held) return;
    const dt =
      last === null
        ? 1 / 60
        : Math.min(1 / 30, Math.max(0.001, (now - last) / 1000));
    last = now;
    velocity += ((target - position) * 150 - velocity * 25) * dt;
    velocity = Math.max(-35, Math.min(35, velocity));
    position += velocity * dt;
    if (Math.abs(target - position) < 0.0001 && Math.abs(velocity) < 0.001) {
      settle();
      return;
    }
    paint();
    frame = scheduler.request(tick);
  };
  const aim = () => {
    if (disposed) return;
    if (count <= 1) target = 0;
    if (reduced) {
      settle();
      return;
    }
    if (frame === null) {
      last = null;
      frame = scheduler.request(tick);
    }
  };
  paint();
  return {
    read: () => ({
      position,
      target,
      velocity,
      active,
      moving: frame !== null,
      held,
    }),
    press() {
      if (disposed || count <= 1) return;
      stop();
      velocity = 0;
      target = position;
      held = true;
    },
    drag(next: number) {
      if (disposed || !held || !Number.isFinite(next)) return;
      position = count <= 1 ? 0 : next;
      target = position;
      paint();
    },
    release(speed = 0) {
      if (disposed) return;
      held = false;
      velocity = Math.max(-12, Math.min(12, speed));
      target = Math.round(position + velocity * 0.18);
      aim();
    },
    step(delta: number) {
      if (disposed) return;
      held = false;
      target = Math.round(target) + Math.sign(delta);
      aim();
    },
    select(index: number) {
      if (disposed) return;
      held = false;
      const base = Math.round(target),
        current = positiveModulo(base, count);
      let delta =
        positiveModulo(index - current + count / 2, count) - count / 2;
      target = base + delta;
      aim();
    },
    cancel() {
      if (disposed) return;
      held = false;
      velocity = 0;
      target = Math.round(position);
      aim();
    },
    setReduced(value: boolean) {
      if (disposed) return;
      reduced = value;
      if (value) {
        held = false;
        target = Math.round(position);
        settle();
      }
    },
    redraw() {
      paint();
    },
    dispose() {
      disposed = true;
      stop();
      held = false;
    },
  };
}
export type GalleryController = ReturnType<typeof createGalleryController>;
