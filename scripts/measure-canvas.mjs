import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
const base = process.env.BROWSER_BASE_URL ?? "http://127.0.0.1:4177",
  dir = path.resolve(
    process.env.BROWSER_EVIDENCE_DIR ?? "artifacts/browser",
    "living-canvas",
  );
let server;
const reports = [];
const traced = process.env.CANVAS_TRACE === "1";
await fs.mkdir(dir, { recursive: true });
try {
  if (!process.env.BROWSER_BASE_URL) {
    server = spawn(
      process.execPath,
      ["node_modules/serve/build/main.js", "out", "-l", "4177"],
      { stdio: "ignore" },
    );
    for (let i = 0; i < 100; i++) {
      try {
        if ((await fetch(base)).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  const browser = await chromium.launch();
  try {
    for (const [width, height] of [
      [1440, 900],
      [390, 844],
    ]) {
      const c = await browser.newContext({
          viewport: { width, height },
          hasTouch: width < 500,
          isMobile: width < 500,
        }),
        p = await c.newPage(),
        client = await c.newCDPSession(p),
        rate = Number(process.env.CANVAS_CPU_RATE ?? 1);
      if (rate > 1)
        await client.send("Emulation.setCPUThrottlingRate", { rate });
      if (traced) {
        await client.send("Profiler.enable");
        await client.send("Profiler.setSamplingInterval", { interval: 1000 });
        await client.send("Profiler.start");
        await client.send("Tracing.start", {
          categories: "-*,toplevel,devtools.timeline,blink.user_timing,v8,cc,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.stack",
          transferMode: "ReturnAsStream",
        });
      }
      const mark = (name) => p.evaluate((n) => performance.mark(n), `canvas:${name}`);
      await p.addInitScript(() => {
        window.__canvasMetrics = { lcp: 0, cls: 0, events: [], longTasks: [] };
        for (const type of [
          "largest-contentful-paint",
          "layout-shift",
          "event",
          "longtask",
        ]) {
          if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              const m = window.__canvasMetrics;
              if (type === "largest-contentful-paint") m.lcp = e.startTime;
              if (type === "layout-shift" && !e.hadRecentInput)
                m.cls += e.value;
              if (type === "event" && e.interactionId)
                m.events.push({ name: e.name, duration: e.duration });
              if (type === "longtask")
                m.longTasks.push({ start: e.startTime, duration: e.duration });
            }
          }).observe(
            type === "event"
              ? { type, buffered: true, durationThreshold: 16 }
              : { type, buffered: true },
          );
        }
      });
      await p.goto(base);
      await mark("loaded");
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(2000);
      await mark("interactive-start");
      const before = await p.evaluate(
        () => performance.memory?.usedJSHeapSize ?? null,
      );
      await p.evaluate(() => {
        window.__canvasFrames = [];
        window.__canvasCollect = true;
        let last;
        function sample(t) {
          if (last !== undefined) window.__canvasFrames.push(t - last);
          last = t;
          if (window.__canvasCollect) requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      });
      if (width > 760)
        for (let i = 0; i < 24; i++) {
          await p.mouse.move(800 + i * 12, 300 + Math.sin(i / 4) * 100);
          await p.waitForTimeout(20);
        }
      await mark("scroll-to-gallery");
      await p.locator(".living-gallery").scrollIntoViewIfNeeded();
      await p.waitForTimeout(300);
      await mark("buttons");
      for (const name of ["下一个作品", "下一个作品", "上一个作品"]) {
        if (width < 500) {
          const r = await p
            .getByRole("button", { name, exact: true })
            .boundingBox();
          await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2);
        } else await p.getByRole("button", { name, exact: true }).click();
        await p.waitForFunction(
          () =>
            !document
              .querySelector(".gallery-stage")
              .hasAttribute("data-moving"),
        );
      }
      if (width > 760) {
        await mark("drag");
        const r = await p.locator(".gallery-stage").boundingBox();
        await p.mouse.move(r.x + r.width * 0.6, r.y + 120);
        await p.mouse.down();
        for (let i = 0; i < 20; i++) {
          await p.mouse.move(r.x + r.width * 0.6 - i * 20, r.y + 120);
          await p.waitForTimeout(20);
        }
        await p.mouse.up();
        await p.waitForFunction(
          () =>
            !document
              .querySelector(".gallery-stage")
              .hasAttribute("data-moving"),
        );
      }
      const data = await p.evaluate(() => {
        window.__canvasCollect = false;
        const f = window.__canvasFrames.sort((a, b) => a - b);
        const m = window.__canvasMetrics;
        return {
          metrics: m,
          frames: {
            count: f.length,
            medianMs: f[Math.floor(f.length * 0.5)],
            p95Ms: f[Math.floor(f.length * 0.95)],
            p99Ms: f[Math.floor(f.length * 0.99)],
            over50ms: f.filter((x) => x > 50).length,
          },
          largestObservedInteractionMs: m.events.length
            ? Math.max(...m.events.map((e) => e.duration))
            : null,
          heapAfterActions: performance.memory?.usedJSHeapSize ?? null,
          images: performance
            .getEntriesByType("resource")
            .filter((e) => e.initiatorType === "img")
            .map((e) => ({
              name: new URL(e.name).pathname,
              bytes: e.decodedBodySize,
            })),
          videoSources: [...document.querySelectorAll("video")].filter((v) =>
            v.hasAttribute("src"),
          ).length,
        };
      });
      await mark("interactive-end");
      if (traced) {
        const complete = new Promise((resolve) => client.once("Tracing.tracingComplete", resolve));
        await client.send("Tracing.end");
        const { stream } = await complete;
        const chunks = [];
        for (;;) {
          const chunk = await client.send("IO.read", { handle: stream });
          chunks.push(Buffer.from(chunk.data, chunk.base64Encoded ? "base64" : "utf8"));
          if (chunk.eof) break;
        }
        await client.send("IO.close", { handle: stream });
        const { profile } = await client.send("Profiler.stop");
        await fs.writeFile(path.join(dir, `trace-${width}.json`), Buffer.concat(chunks));
        await fs.writeFile(path.join(dir, `cpu-${width}.cpuprofile`), JSON.stringify(profile));
      }
      for (let i = 0; i < 3; i++) {
        await p.goto(base + "/notes/");
        await p.goto(base);
        await p.waitForSelector(".living-gallery[data-enhanced=true]");
      }
      if (typeof p.requestGC === "function") await p.requestGC();
      const after = await p.evaluate(
        () => performance.memory?.usedJSHeapSize ?? null,
      );
      reports.push({
        viewport: `${width}x${height}`,
        browser: browser.version(),
        cpuThrottle: rate,
        heapBefore: before,
        heapAfterThreeVisitsAndGCRequest: after,
        ...data,
      });
      await c.close();
    }
  } finally {
    await browser.close();
  }
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(
    path.join(dir, traced ? "performance-traced.json" : "performance.json"),
    JSON.stringify(
      {
        recordedAt: new Date().toISOString(),
        traced,
        method:
          "Fresh production static context; buffered LCP/CLS/EventTiming/longtask observers, then RAF intervals after fonts and intro while pointer/scroll/three steps/drag run. Three navigations and a browser GC request for approximate JS heap. Short samples, no field INP, no sustained FPS guarantee, no physical mobile device. CANVAS_CPU_RATE=4 enables reproducible CPU throttling; BROWSER_BASE_URL selects an existing static server.",
        reports,
      },
      null,
      2,
    ),
  );
  console.log(
    JSON.stringify(
      reports.map((r) => ({
        viewport: r.viewport,
        lcp: r.metrics.lcp,
        cls: r.metrics.cls,
        frames: r.frames,
        interactionSampleMs: r.largestObservedInteractionMs,
        longTasks: r.metrics.longTasks.length,
      })),
      null,
      2,
    ),
  );
} finally {
  server?.kill();
}
