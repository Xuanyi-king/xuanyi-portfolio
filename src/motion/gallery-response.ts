export type XDrive = {
  subscribe(listener: (force: number) => void): () => void;
};

/** An input bridge, not an animator. LivingX owns the spring and all SVG writes. */
export function createGalleryResponse() {
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
      if (elapsed <= 0 || elapsed > 120) return emit(0);
      // Match the direction of the dragged canvas, using unwrapped travel.
      const velocity = ((position - last.position) * 1000) / Math.max(8, elapsed);
      emit(Math.max(-28, Math.min(28, -velocity * 12)));
    },
    reset,
    subscribe(listener: (force: number) => void) {
      listeners.add(listener);
      listener(force);
      return () => { listeners.delete(listener); };
    },
  };
}
