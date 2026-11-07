import test from "node:test";
import assert from "node:assert/strict";
import { analyzeCanvasTrace } from "../scripts/lib/canvas-trace.mjs";
test("trace analysis clips the interaction window and does not double count nested task aliases", () => {
  const events = [
    { name: "thread_name", pid: 1, tid: 2, args: { name: "CrRendererMain" } },
    { name: "canvas:interactive-start", ts: 100000 },
    { name: "canvas:interactive-end", ts: 400000 },
    { name: "RunTask", pid: 1, tid: 2, ph: "X", ts: 90000, dur: 30000 },
    { name: "RunTask", pid: 1, tid: 2, ph: "X", ts: 150000, dur: 70000 },
    {
      name: "ThreadControllerImpl::RunTask",
      pid: 1,
      tid: 2,
      ph: "X",
      ts: 150000,
      dur: 70000,
    },
    {
      name: "ProxyMain::BeginMainFrame",
      pid: 1,
      tid: 2,
      ph: "X",
      ts: 140000,
      dur: 10000,
    },
    {
      name: "ProxyMain::BeginMainFrame",
      pid: 1,
      tid: 2,
      ph: "X",
      ts: 200000,
      dur: 10000,
    },
    { name: "Layerize", pid: 1, tid: 2, ph: "X", ts: 145000, dur: 4000 },
    { name: "Paint", pid: 9, tid: 3, ph: "X", ts: 145000, dur: 9000 },
  ];
  const r = analyzeCanvasTrace({ traceEvents: events });
  assert.equal(r.interactiveMs, 300);
  assert.equal(r.mainTaskMs, 90);
  assert.equal(r.frames, 2);
  assert.equal(r.layerizeMs, 4);
  assert.equal(r.layerizePerFrameMs, 2);
  assert.equal(r.paintMs, 0);
  assert.equal(r.longTasks.length, 1);
  assert.equal(r.longTasks[0].durationMs, 70);
});
test("a trace without marked product phases cannot be claimed as a comparable measurement", () => {
  assert.throws(
    () => analyzeCanvasTrace({ traceEvents: [] }),
    /interaction markers/,
  );
});
