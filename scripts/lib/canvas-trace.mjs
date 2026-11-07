/** Complete main-thread durations overlap, so categories are reported separately. */
export function analyzeCanvasTrace(trace, profile) {
  const events = trace.traceEvents;
  const markers = new Map(
    events
      .filter((e) => e.name.startsWith("canvas:"))
      .map((e) => [e.name, e.ts]),
  );
  const start = markers.get("canvas:interactive-start"),
    end = markers.get("canvas:interactive-end");
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
    throw new Error("Missing comparable interaction markers");
  const main = new Set(
    events
      .filter(
        (e) => e.name === "thread_name" && e.args?.name === "CrRendererMain",
      )
      .map((e) => `${e.pid}/${e.tid}`),
  );
  const selected = events.filter(
    (e) =>
      e.ph === "X" &&
      main.has(`${e.pid}/${e.tid}`) &&
      e.ts < end &&
      e.ts + (e.dur ?? 0) > start,
  );
  const duration = (e) =>
    Math.max(0, Math.min(e.ts + e.dur, end) - Math.max(e.ts, start)) / 1000;
  const total = (name) =>
    selected
      .filter((e) => e.name === name)
      .reduce((n, e) => n + duration(e), 0);
  const frames = selected.filter(
    (e) => e.name === "ProxyMain::BeginMainFrame",
  ).length;
  const tasks = selected.filter((e) => e.name === "RunTask");
  const cpu = new Map();
  if (profile) {
    const nodes = new Map(profile.nodes.map((n) => [n.id, n.callFrame]));
    let time = profile.startTime;
    profile.samples.forEach((sample, i) => {
      const dt = profile.timeDeltas[i],
        previous = time;
      time += dt;
      const ms =
        Math.max(0, Math.min(time, end) - Math.max(previous, start)) / 1000;
      if (!ms) return;
      const frame = nodes.get(sample),
        key = JSON.stringify(frame);
      const row = cpu.get(key) ?? { ...frame, selfMs: 0 };
      row.selfMs += ms;
      cpu.set(key, row);
    });
  }
  return {
    interactiveMs: (end - start) / 1000,
    frames,
    mainTaskMs: total("RunTask"),
    layerizeMs: total("Layerize"),
    layerizePerFrameMs: frames ? total("Layerize") / frames : null,
    styleMs: total("UpdateLayoutTree"),
    layoutMs: total("Layout"),
    paintMs: total("Paint"),
    longTasks: tasks
      .filter((e) => duration(e) > 50)
      .map((e) => ({ atMs: (e.ts - start) / 1000, durationMs: duration(e) })),
    hotCpuSamples: [...cpu.values()]
      .sort((a, b) => b.selfMs - a.selfMs)
      .slice(0, 20),
    note: "Nested category durations are not additive. Tracing/CPU profiling add overhead; compare normal runs separately. This is not field INP or physical-device FPS.",
  };
}
