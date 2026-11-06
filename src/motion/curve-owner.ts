/** A single writer for SVG d. The intro completes at the canonical rest curve before
 * the spring receives the most recent input; canceled/unmounted intros are safe. */
export function createCurveOwner(
  entering: boolean,
  render: (values: readonly number[]) => void,
) {
  let active = !entering,
    disposed = false;
  let latest: readonly number[] | undefined;
  let pending: (() => void) | undefined;
  return {
    paint(values: readonly number[]) {
      if (disposed) return;
      latest = [...values];
      if (active) render(latest);
    },
    input(action: () => void) {
      if (disposed) return;
      if (active) action();
      else pending = action;
    },
    complete() {
      if (disposed || active) return;
      active = true;
      if (latest) render(latest);
      const action = pending;
      pending = undefined;
      action?.();
    },
    dispose() {
      disposed = true;
      pending = undefined;
      latest = undefined;
    },
  };
}
