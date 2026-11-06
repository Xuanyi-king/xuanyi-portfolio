type Preference = Pick<
  MediaQueryList,
  "matches" | "addEventListener" | "removeEventListener"
>;
// Async modules may arrive after unmount or a preference change. Stale work must never animate.
export function watchMotionPreference(
  media: Preference,
  load: () => Promise<() => () => void>,
) {
  let active = true,
    generation = 0,
    dispose: (() => void) | undefined;
  const update = () => {
    const ticket = ++generation;
    dispose?.();
    dispose = undefined;
    if (!media.matches) return;
    void load()
      .then((setup) => {
        if (active && ticket === generation) dispose = setup();
      })
      .catch(() => {}); // Motion is optional; server-rendered content remains usable.
  };
  media.addEventListener("change", update);
  update();
  return () => {
    active = false;
    generation++;
    dispose?.();
    media.removeEventListener("change", update);
  };
}
