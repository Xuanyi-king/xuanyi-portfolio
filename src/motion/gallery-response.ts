import { motionTokens } from "./tokens";

export type XDrive = {
  /** Director study: deterministic force pose; renderer/curve-owner still owns d. */
  direct?: boolean;
  subscribe(listener: (force: number) => void): () => void;
};

/** An input bridge, not an animator. LivingX owns the spring and all SVG writes. */
export function createGalleryResponse() {
  const settings = motionTokens.galleryResponse;
  const listeners = new Set<(force: number) => void>();
  let previous: { position: number; time: number } | undefined;
  let force = 0;
  const emit = (next: number) => {
    if (next === force) return;
    force = next;
    listeners.forEach((listener) => listener(force));
  };
  const reset = () => {
    previous = undefined;
    emit(0);
  };
  return {
    sample(position: number, time: number) {
      if (!Number.isFinite(position) || !Number.isFinite(time)) return reset();
      const last = previous;
      previous = { position, time };
      if (!last) return;
      const elapsed = time - last.time;
      if (elapsed <= 0 || elapsed > settings.staleMs) return emit(0);
      // Match the direction of the dragged canvas, using unwrapped travel.
      const velocity =
        ((position - last.position) * 1000) /
        Math.max(settings.minimumStepMs, elapsed);
      emit(
        Math.max(
          -settings.force,
          Math.min(settings.force, -velocity * settings.gain),
        ),
      );
    },
    reset,
    subscribe(listener: (force: number) => void) {
      listeners.add(listener);
      listener(force);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
