import { chromium, firefox, webkit } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const destination = path.resolve(
  process.env.BROWSER_EVIDENCE_DIR ?? "artifacts/browser",
  "living-identity",
);
const base = process.env.BROWSER_BASE_URL ?? "http://127.0.0.1:4175";
let server;
const results = [];
const delay = (p, ms = 180) => p.waitForTimeout(ms);
async function ready(p) {
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(
    () => document.querySelector(".hero")?.dataset.foldEnd,
  );
  await delay(p, 1800);
}
async function position(p, progress) {
  await p.evaluate((f) => {
    const h = document.querySelector(".hero");
    scrollTo({
      top:
        f === 0
          ? 0
          : Number(h.dataset.foldStart) +
            (Number(h.dataset.foldEnd) - Number(h.dataset.foldStart)) * f,
      behavior: "instant",
    });
  }, progress);
  await delay(p);
  await p.waitForFunction((f) => f !== 0 || scrollY < 1, progress);
}
async function snapshot(p) {
  return p.evaluate(() => {
    const h = document.querySelector(".hero"),
      a = h.querySelector(".hero-artwork");
    const r = a.getBoundingClientRect(),
      n = document.querySelector(".wordmark > svg").getBoundingClientRect();
    const ink = h.querySelector(".x-material").getBoundingClientRect(),
      cta = h
        .querySelector(".hero-actions .pill-button")
        .getBoundingClientRect(),
      headerBottom = document
        .querySelector("header")
        .getBoundingClientRect().bottom;
    const ctaOverlap =
      Math.min(ink.right, cta.right) > Math.max(ink.left, cta.left) &&
      Math.min(ink.bottom, cta.bottom) >
        Math.max(ink.top, cta.top, headerBottom);
    return {
      ctaOverlap,
      transform: getComputedStyle(a).transform,
      center: [r.x + r.width / 2, r.y + r.height / 2],
      target: [n.x + n.width / 2, n.y + n.height / 2],
      headerTop: document.querySelector("header").getBoundingClientRect().top,
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      progress: h.dataset.foldProgress,
      pinned: !!document.querySelector(".pin-spacer"),
    };
  });
}
// Curated evidence uses continuous physical wheel events, not jumps between
// the assertion frames above. This is the real running page, including reverse.
async function recordStories(browser) {
  for (const [label, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    const dir = path.join(destination, "chromium");
    const c = await browser.newContext({
      viewport: { width, height },
      hasTouch: width < 500,
      recordVideo: {
        dir: path.join(dir, ".recordings"),
        size: { width, height },
      },
    });
    const p = await c.newPage();
    await p.goto(base);
    await ready(p);
    if (width === 1440) {
      await p.mouse.move(1260, 520, { steps: 24 });
      await delay(p, 600);
      await p.mouse.move(700, 30, { steps: 20 });
    }
    for (let i = 0; i < 30; i++) {
      await p.mouse.wheel(0, 70);
      await delay(p, 85);
    }
    await delay(p, 600);
    for (let i = 0; i < 30; i++) {
      await p.mouse.wheel(0, -70);
      await delay(p, 85);
    }
    await delay(p, 900);
    const video = p.video();
    await c.close();
    await video.saveAs(path.join(dir, `${label}-folding-canvas.webm`));
    await fs.rm(await video.path(), { force: true });
  }
}
try {
  if (!process.env.BROWSER_BASE_URL) {
    server = spawn(
      process.execPath,
      ["node_modules/serve/build/main.js", "out", "-l", "4175"],
      { stdio: "ignore" },
    );
    for (let i = 0; i < 100; i++) {
      try {
        if ((await fetch(base)).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    if (
      process.env.BROWSER_ENGINES &&
      !process.env.BROWSER_ENGINES.split(",").includes(name)
    )
      continue;
    const browser = await engine.launch();
    try {
      for (const [label, width, height] of [
        ["desktop", 1440, 900],
        ["tablet", 768, 1024],
        ["mobile", 390, 844],
        ["narrow", 320, 740],
      ]) {
        const dir = path.join(destination, name);
        await fs.mkdir(dir, { recursive: true });
        const c = await browser.newContext({
          viewport: { width, height },
          hasTouch: width < 500,
        });
        const errors = [];
        const p = await c.newPage();
        p.setDefaultTimeout(15000);
        p.on("pageerror", (e) => errors.push(e.message));
        try {
          await p.goto(base);
          await ready(p);
          const initial = await snapshot(p);
          await p.screenshot({ path: path.join(dir, `${label}-expanded.png`) });
          // Gentle native wheel motion, then reverse it. No scripted scroll lock.
          if (width === 1440) {
            await p.mouse.move(1230, 520, { steps: 20 });
            await delay(p, 700);
            await p.screenshot({ path: path.join(dir, "pointer-surface.png") });
            await p.mouse.move(700, 30, { steps: 15 });
            await delay(p, 1400);
          }
          for (const f of [0.25, 0.5, 0.65, 0.7, 0.75, 0.78, 0.8, 0.9, 1]) {
            await position(p, f);
            const state = await snapshot(p);
            assert.ok(
              Math.abs(state.headerTop) < 1,
              "Brand navigation remains stationary and usable",
            );
            assert.ok(
              state.scrollWidth <= width,
              "Fold must not create horizontal scrolling",
            );
            assert.equal(
              state.pinned,
              false,
              "Normal document flow, no pin spacer",
            );
            assert.equal(
              state.ctaOverlap,
              false,
              "The folding X keeps clear of the visible primary CTA",
            );
            assert.notEqual(
              state.transform,
              initial.transform,
              "The canvas must respond to scrolling",
            );
            if (width <= 760 && f < 0.95) {
              const visible = await p
                .locator(".hero .x-material")
                .evaluate(
                  (el) =>
                    el.getBoundingClientRect().bottom >
                    document.querySelector("header").getBoundingClientRect()
                      .bottom +
                      8,
                );
              assert.ok(
                visible,
                "Mobile X remains visible until its lateral approach to navigation",
              );
            }
            if (f === 1) {
              assert.ok(
                Math.abs(state.center[0] - state.target[0]) < 2,
                "X aligns with the nav brand in x",
              );
              assert.ok(
                Math.abs(state.center[1] - state.target[1]) < 2,
                "X aligns with the nav brand in y",
              );
            }
            if ([0.25, 0.5, 0.75, 1].includes(f))
              await p.screenshot({
                path: path.join(dir, `${label}-fold-${f}.png`),
              });
          }
          for (let i = 0; i < 8; i++) {
            await p.mouse.wheel(0, 140);
            await delay(p, 70);
          }
          await p.locator("#selected-work").scrollIntoViewIfNeeded();
          await delay(p, 850);
          await p.screenshot({ path: path.join(dir, `${label}-work.png`) });
          for (let i = 0; i < 10; i++) {
            await p.mouse.wheel(0, -220);
            await delay(p, 70);
          }
          // Stress a fast reversal, then require exact restoration.
          await p.evaluate(() => {
            scrollTo({ top: 1400, behavior: "instant" });
          });
          await delay(p, 100);
          await position(p, 0);
          const restored = await snapshot(p);
          assert.equal(
            restored.transform,
            initial.transform,
            "Reverse scroll restores the original composition exactly",
          );
          await p.screenshot({ path: path.join(dir, `${label}-restored.png`) });
          // A deep restored location must still install the reversible scroll composition.
          await position(p, 0.6);
          const beforeNavigation = await snapshot(p);
          if (width < 500) {
            const button = await p
              .getByRole("button", { name: "打开导航" })
              .boundingBox();
            await p.touchscreen.tap(
              button.x + button.width / 2,
              button.y + button.height / 2,
            );
            await delay(p, 450);
          }
          const link = p.locator(
            width < 500
              ? ".mobile-menu a[href='/work/']"
              : ".desktop-nav a[href='/work/']",
          );
          // A sticky nav is already visible. Playwright's locator auto-scroll
          // would itself change the history position before clicking it.
          const bounds = await link.boundingBox();
          if (width < 500)
            await p.touchscreen.tap(
              bounds.x + bounds.width / 2,
              bounds.y + bounds.height / 2,
            );
          else
            await p.mouse.click(
              bounds.x + bounds.width / 2,
              bounds.y + bounds.height / 2,
            );
          await p.waitForURL("**/work/");
          await p.locator(".project-card").first().waitFor();
          await p.goBack();
          await ready(p);
          await p.waitForFunction(
            (expected) => {
              const progress =
                document.querySelector(".hero")?.dataset.foldProgress;
              return (
                progress !== undefined &&
                Math.abs(Number(progress) - expected) < 0.08
              );
            },
            Number(beforeNavigation.progress),
            { timeout: 5000 },
          );
          const afterNavigation = await snapshot(p);
          assert.ok(
            Math.abs(
              Number(afterNavigation.progress) -
                Number(beforeNavigation.progress),
            ) < 0.08,
            `History restores scroll-derived state: before=${JSON.stringify(beforeNavigation)}, after=${JSON.stringify(afterNavigation)}`,
          );
          await position(p, 0);
          assert.equal((await snapshot(p)).transform, initial.transform);
          // Reflow between device widths must refresh anchors, not use old bounds.
          await p.setViewportSize({
            width: width === 1440 ? 1280 : width === 390 ? 375 : 390,
            height,
          });
          await delay(p, 400);
          await position(p, 1);
          const resized = await snapshot(p);
          assert.ok(
            Math.abs(resized.center[0] - resized.target[0]) < 2 &&
              Math.abs(resized.center[1] - resized.target[1]) < 2,
            "Resizing recalculates the handoff destination",
          );
          await p.setViewportSize({ width, height });
          await delay(p, 400);
          await position(p, 0);
          assert.equal((await snapshot(p)).transform, initial.transform);
          // A dynamic preference change reverts all scroll-owned transforms.
          await position(p, 0.4);
          await p.emulateMedia({ reducedMotion: "reduce" });
          await delay(p, 250);
          assert.equal(
            await p
              .locator(".hero-artwork")
              .evaluate((el) => getComputedStyle(el).transform),
            "none",
            "Reduced motion removes folding transforms",
          );
          await p.evaluate(() => scrollTo(0, 0));
          await p.screenshot({ path: path.join(dir, `${label}-reduced.png`) });
          assert.deepEqual(errors, []);
          results.push({
            browser: name,
            viewport: `${width}x${height}`,
            restored: true,
            navAligned: true,
            reducedMotion: true,
            resize: true,
            ctaClear: true,
            errors,
          });
        } catch (error) {
          await p.screenshot({ path: path.join(dir, `${label}-failure.png`) });
          throw error;
        } finally {
          await c.close();
        }
      }
      if (name === "chromium") await recordStories(browser);
    } finally {
      await browser.close();
    }
  }
  await fs.writeFile(
    path.join(destination, "results.json"),
    JSON.stringify(results, null, 2),
  );
  console.log(
    `Living Identity: ${results.length} browser/viewport combinations passed, forward/reverse, brand alignment, history, reduced motion.`,
  );
} finally {
  server?.kill();
}
