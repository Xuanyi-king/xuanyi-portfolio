import { watchPageErrors } from './page-errors.mjs';
import { chromium, firefox, webkit } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
const base = process.env.BROWSER_BASE_URL ?? "http://127.0.0.1:4176",
  destination = path.resolve(
    process.env.BROWSER_EVIDENCE_DIR ?? "artifacts/browser",
    "living-canvas",
  );
let server;
const reports = [];
async function ready(p) {
  await p.evaluate(() => document.fonts.ready);
  await p.waitForSelector(".living-gallery[data-enhanced=true]");
  await settle(p);
}
async function settle(p) {
  await p.waitForFunction(
    () => {
      const s = document.querySelector(".gallery-stage");
      return (
        s?.dataset.position !== undefined && !s.hasAttribute("data-moving")
      );
    },
    {},
    { timeout: 15000 },
  );
}
async function value(p) {
  return Number(
    await p.locator(".gallery-stage").getAttribute("data-position"),
  );
}
async function active(p) {
  return Number(await p.locator(".gallery-stage").getAttribute("data-active"));
}
async function button(p, d) {
  await p
    .locator(".living-gallery")
    .getByRole("button", { name: d > 0 ? "下一个作品" : "上一个作品" })
    .click();
  await settle(p);
}
async function layout(p) {
  assert.ok(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    "No horizontal page scroll",
  );
  assert.equal(await p.locator(".gallery-card").count(), 3);
  assert.equal(await p.locator(".gallery-link").count(), 3);
  const names = await p
    .locator(".gallery-card .project-scene")
    .evaluateAll((a) => a.map((e) => getComputedStyle(e).viewTransitionName));
  if (!names.includes("")) assert.equal(new Set(names).size, 3);
  if (p.viewportSize().width <= 1100) {
    assert.deepEqual(
      await p
        .locator(
          '.gallery-card:not([data-gallery-active="true"]) .project-meta',
        )
        .evaluateAll((a) => a.map((e) => getComputedStyle(e).visibility)),
      ["hidden", "hidden"],
      "Tablet and mobile keep side covers without crowding central copy",
    );
    assert.equal(
      await p
        .locator('.gallery-card[data-gallery-active="true"] .project-meta')
        .evaluate((e) => getComputedStyle(e).visibility),
      "visible",
    );
  }
}
async function drag(p, dx, duration = 600) {
  const box = await p.locator(".gallery-stage").boundingBox(),
    x = box.x + box.width * 0.58,
    y = box.y + 130;
  await p.mouse.move(x, y);
  await p.mouse.down();
  for (let i = 1; i <= 20; i++) {
    await p.mouse.move(x + (dx * i) / 20, y + Math.sin(i) * 0.3);
    await p.waitForTimeout(duration / 20);
  }
  await p.mouse.up();
}
async function touchSwipe(p, c, dx, dy) {
  const s = p.locator(".gallery-stage");
  await s.scrollIntoViewIfNeeded();
  const r = await s.boundingBox(),
    session = await c.newCDPSession(p),
    x = dx < 0 ? 310 : 90,
    y = Math.max(170, r.y + 125);
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let i = 1; i <= 14; i++) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x + (dx * i) / 14, y: y + (dy * i) / 14 }],
    });
    await p.waitForTimeout(20);
  }
  if (Math.abs(dx) > Math.abs(dy) * 1.2) {
    await p.waitForFunction(() => {
      const d = document
        .querySelector('.gallery-response [data-ribbon="a"]')
        ?.getAttribute("d");
      if (!d) return false;
      const values = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
      return Math.abs(values[2] - 258) > 0.05;
    });
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await session.detach();
}
async function record(browser, name, width, height, fn) {
  const dir = path.join(destination, "chromium");
  const c = await browser.newContext({
    viewport: { width, height },
    hasTouch: width < 500,
    isMobile: width < 500,
    recordVideo: {
      dir: path.join(dir, ".recordings"),
      size: { width, height },
    },
  });
  const p = await c.newPage();
  await p.goto(base);
  await ready(p);
  try {
    await fn(p, c);
  } finally {
    const v = p.video();
    await c.close();
    await v.saveAs(path.join(dir, name + ".webm"));
    await fs.rm(await v.path(), { force: true });
  }
}
async function recordings(browser) {
  await record(browser, "gallery-drag-wrap", 1440, 900, async (p) => {
    await p.locator(".living-gallery").scrollIntoViewIfNeeded();
    await p.waitForTimeout(600);
    await drag(p, -460, 900);
    await settle(p);
    await p.waitForTimeout(300);
    await drag(p, -620, 100);
    await p.waitForTimeout(70);
    const s = p.locator(".gallery-stage"),
      r = await s.boundingBox();
    await p.mouse.move(r.x + r.width * 0.5, r.y + 130);
    await p.mouse.down();
    const frozen = await value(p);
    await p.waitForTimeout(200);
    assert.ok(
      Math.abs((await value(p)) - frozen) < 0.001,
      "New press interrupts inertia",
    );
    await p.mouse.move(r.x + r.width * 0.5 + 100, r.y + 132, { steps: 12 });
    await p.mouse.up();
    await settle(p);
    await p.emulateMedia({ reducedMotion: "reduce" });
    while ((await active(p)) !== 2) await button(p, 1);
    await p.emulateMedia({ reducedMotion: "no-preference" });
    await button(p, 1);
    assert.equal(await active(p), 0);
    await button(p, -1);
    assert.equal(await active(p), 2);
    await p.waitForTimeout(400);
  });
  await record(browser, "gallery-detail-return", 1440, 900, async (p) => {
    await p.locator(".living-gallery").scrollIntoViewIfNeeded();
    await button(p, 1);
    const selected = await active(p);
    await p.locator(".gallery-card[data-gallery-active=true]").hover();
    await p.waitForTimeout(800);
    const href = await p
      .locator(".gallery-card[data-gallery-active=true] .gallery-link")
      .getAttribute("href");
    await p
      .locator(".gallery-card[data-gallery-active=true] .gallery-link")
      .click();
    await p.waitForURL("**" + href);
    await p.waitForTimeout(600);
    await p.goBack();
    await ready(p);
    assert.equal(await active(p), selected);
    await p.waitForTimeout(700);
  });
  await record(
    browser,
    "gallery-touch-and-page-scroll",
    390,
    844,
    async (p, c) => {
      await p.locator(".living-gallery").scrollIntoViewIfNeeded();
      const initial = await active(p),
        beforeScroll = await p.evaluate(() => scrollY);
      await touchSwipe(p, c, 2, -150);
      await settle(p);
      assert.equal(await active(p), initial);
      assert.ok(
        await p.evaluate((y) => Math.abs(scrollY - y) > 30, beforeScroll),
      );
      await touchSwipe(p, c, -210, 2);
      await settle(p);
      assert.ok((await value(p)) > 0);
      await p.waitForTimeout(500);
      await touchSwipe(p, c, 210, 2);
      await settle(p);
      await p.waitForTimeout(700);
    },
  );
  const dir = path.join(destination, "materials");
  await fs.mkdir(dir, { recursive: true });
  for (const [name, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    const c = await browser.newContext({
        viewport: { width, height },
        recordVideo: {
          dir: path.join(dir, ".recordings"),
          size: { width, height },
        },
      }),
      p = await c.newPage();
    await p.goto(base + "/lab/canvas-study/");
    await p.evaluate(() => document.fonts.ready);
    for (const state of ["静止", "舒展", "收束"]) {
      await p
        .locator(".surface-study:not([data-depth-study])")
        .getByRole("button", { name: state, exact: true })
        .click();
      await p.waitForTimeout(1300);
      await p.mouse.move(0, 0);
      for (let i = 0; i < 2; i++)
        await p
          .locator(".study-specimen")
          .nth(i)
          .screenshot({ path: path.join(dir, `${name}-${i}-${state}.png`) });
    }
    for (const count of [1, 2, 3]) {
      await p
        .getByRole("button", { name: `${count} 个项目`, exact: true })
        .click();
      await settle(p);
      assert.equal(await p.locator(".gallery-card").count(), count);
      await p
        .locator(".living-gallery")
        .screenshot({ path: path.join(dir, `${name}-count-${count}.png`) });
    }
    await p.getByRole("button", { name: "比较 X Rail" }).click();
    await p
      .locator(".x-rail-study")
      .screenshot({ path: path.join(dir, `${name}-x-rail-study.png`) });
    const video = p.video();
    await c.close();
    await video.saveAs(path.join(dir, `${name}-materials.webm`));
    await fs.rm(await video.path(), { force: true });
  }
}
try {
  await fs.mkdir(destination, { recursive: true });
  if (!process.env.BROWSER_BASE_URL) {
    server = spawn(
      process.execPath,
      ["node_modules/serve/build/main.js", "out", "-l", "4176"],
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
    const browser = await engine.launch(),
      dir = path.join(destination, name);
    await fs.mkdir(dir, { recursive: true });
    try {
      for (const [width, height] of [
        [1440, 900],
        [768, 1024],
        [390, 844],
        [320, 740],
      ]) {
        const c = await browser.newContext({
            viewport: { width, height },
            hasTouch: width < 800,
          }),
          p = await c.newPage(),
          errors = [];
        p.setDefaultTimeout(15000);
        const fetchDiagnostics = await watchPageErrors(p, name, errors, base);
        try {
          await p.goto(base);
          await ready(p);
          await p.waitForTimeout(1700);
          await p.screenshot({ path: path.join(dir, `hero-${width}.png`) });
          await p.locator(".living-gallery").scrollIntoViewIfNeeded();
          await layout(p);
          assert.equal(
            await p.locator(".film-preview-video[src]").count(),
            0,
            "No film source without intent",
          );
          await p.screenshot({ path: path.join(dir, `gallery-${width}.png`) });
          const s = p.locator(".gallery-stage");
          await s.focus();
          const original = await value(p);
          await p.evaluate(() => {
            window.__movingWrites = 0;
            window.__movingObserver = new MutationObserver(
              (entries) => (window.__movingWrites += entries.length),
            );
            window.__movingObserver.observe(
              document.querySelector(".gallery-stage"),
              { attributes: true, attributeFilter: ["data-moving"] },
            );
          });
          await p.keyboard.press("ArrowRight");
          await settle(p);
          assert.equal(await value(p), original + 1);
          await p.keyboard.press("ArrowLeft");
          await settle(p);
          assert.equal(await value(p), original);
          const movingWrites = await p.evaluate(() => {
            window.__movingObserver.disconnect();
            return window.__movingWrites;
          });
          assert.ok(movingWrites <= 4, "Motion flags change at start/end only");
          if (width === 1440) {
            const resizeBox = await s.boundingBox();
            const resizeStart = await value(p);
            await p.mouse.move(
              resizeBox.x + resizeBox.width / 2,
              resizeBox.y + 120,
            );
            await p.mouse.down();
            await p.mouse.move(
              resizeBox.x + resizeBox.width / 2 - 200,
              resizeBox.y + 120,
              { steps: 12 },
            );
            await p.setViewportSize({ width: 768, height: 1024 });
            await p.waitForFunction(
              () =>
                !document
                  .querySelector(".gallery-stage")
                  .hasAttribute("data-holding"),
            );
            await p.mouse.move(
              resizeBox.x + resizeBox.width / 2 - 201,
              resizeBox.y + 120,
            );
            await p.mouse.up();
            await settle(p);
            assert.equal(
              await value(p),
              resizeStart,
              "Resize cancels the gesture without selecting a neighbor",
            );
            assert.equal(
              p.url(),
              base + "/",
              "Cancelling a held gesture must suppress its release click",
            );
            await p.setViewportSize({ width, height });
            await p.waitForTimeout(400);
            await s.scrollIntoViewIfNeeded();
            await s.focus();
            for (let i = 0; i < 100; i++) await p.keyboard.press("ArrowRight");
            await settle(p);
            assert.equal(await value(p), original + 100);
            for (let i = 0; i < 100; i++) await p.keyboard.press("ArrowLeft");
            await settle(p);
            assert.equal(await value(p), original);
            const captureBox = await s.boundingBox();
            await s.evaluate((el) =>
              el.addEventListener(
                "gotpointercapture",
                (event) => (window.__captureId = event.pointerId),
                { once: true },
              ),
            );
            await p.mouse.move(
              captureBox.x + captureBox.width / 2,
              captureBox.y + 130,
            );
            await p.mouse.down();
            await p.mouse.move(
              captureBox.x + captureBox.width / 2 - 40,
              captureBox.y + 131,
              { steps: 8 },
            );
            await s.evaluate((el) =>
              el.releasePointerCapture(window.__captureId),
            );
            await p.mouse.move(
              captureBox.x + captureBox.width / 2 - 42,
              captureBox.y + 132,
            );
            await p.waitForFunction(
              () =>
                !document
                  .querySelector(".gallery-stage")
                  .hasAttribute("data-holding"),
            );
            await p.mouse.up();
            await settle(p);
            await button(p, 1);
            await p.locator(".gallery-card[data-gallery-active=true]").hover();
            await p.waitForFunction(() => {
              const v = document.querySelector(".film-preview-video");
              return v && !v.paused && v.currentTime > 0.1;
            });
            const filmBox = await p
              .locator(".gallery-card[data-gallery-active=true]")
              .boundingBox();
            await p.mouse.move(filmBox.x + filmBox.width / 2, filmBox.y + 120);
            await p.mouse.down();
            await p.waitForFunction(
              () => document.querySelector(".film-preview-video").paused,
            );
            await p.mouse.move(
              filmBox.x + filmBox.width / 2 - 24,
              filmBox.y + 120,
              { steps: 4 },
            );
            await p.mouse.up();
            await settle(p);
            await p.mouse.move(10, 10);
            const r = await s.boundingBox(),
              x = r.x + r.width * 0.5,
              y = r.y + 130;
            await p.mouse.move(x, y);
            await p.mouse.down();
            await p.waitForTimeout(550);
            await p.mouse.up();
            await p.waitForTimeout(100);
            assert.equal(
              p.url(),
              base + "/",
              "Long press never opens a project",
            );
            await drag(p, -450, 450);
            await settle(p);
            const current = await active(p);
            const href = await p
              .locator(".gallery-card[data-gallery-active=true] .gallery-link")
              .getAttribute("href");
            await p
              .locator(".gallery-card[data-gallery-active=true] .gallery-link")
              .click();
            await p.waitForURL("**" + href);
            await p.locator(".back-link").waitFor();
            await p.goBack();
            await ready(p);
            assert.equal(
              await active(p),
              current,
              "Native back restores selected project",
            );
            for (let i = 0; i < 3; i++) {
              await p.locator('.desktop-nav a[href="/notes/"]').click();
              await p.waitForURL("**/notes/");
              await p.locator(".wordmark").click();
              await ready(p);
            }
            const restored = await value(p);
            await s.scrollIntoViewIfNeeded();
            await s.focus();
            await p.keyboard.press("ArrowRight");
            await settle(p);
            assert.equal(
              await value(p),
              restored + 1,
              "One step after remount, no duplicate listeners",
            );
          }
          const beforeResize = await active(p);
          await p.setViewportSize({
            width: width === 1440 ? 1280 : 375,
            height,
          });
          await p.waitForTimeout(350);
          assert.equal(await active(p), beforeResize);
          await layout(p);
          await p.setViewportSize({ width, height });
          await p.waitForTimeout(300);
          await p.emulateMedia({ reducedMotion: "reduce" });
          await settle(p);
          await s.scrollIntoViewIfNeeded();
          await s.focus();
          const start = await value(p);
          await p.keyboard.press("ArrowRight");
          await settle(p);
          assert.equal(await value(p), start + 1);
          assert.equal(
            await p
              .locator(".gallery-card[data-gallery-active=true]")
              .evaluate((e) =>
                getComputedStyle(e).transform.includes("matrix3d"),
              ),
            false,
            "Reduced gallery uses a flat immediate layout",
          );
          await p.screenshot({ path: path.join(dir, `reduced-${width}.png`) });
          assert.deepEqual(errors, []);
          reports.push({
            browser: name,
            version: browser.version(),
            viewport: `${width}x${height}`,
            links: 3,
            resize: true,
            reduced: true,
            history:
              width === 1440
                ? "selected state + 3 remount cycles"
                : "covered desktop",
            hundredCycles: width === 1440,
            errors,
            fetchDiagnostics,
          });
        } catch (e) {
          await p.screenshot({ path: path.join(dir, `failure-${width}.png`) });
          await fs.writeFile(path.join(dir, "failure.txt"), String(e.stack));
          throw e;
        } finally {
          await c.close();
        }
      }
      for (const reducedMotion of ["no-preference", "reduce"]) {
        const nojs = await browser.newContext({
            viewport: { width: 390, height: 844 },
            javaScriptEnabled: false,
            reducedMotion,
          }),
          n = await nojs.newPage();
        await n.goto(base);
        await n.locator(".living-gallery").scrollIntoViewIfNeeded();
        for (let i = 0; i < 3; i++) {
          const card = n.locator(".gallery-card").nth(i);
          assert.equal(
            await card.evaluate((e) => getComputedStyle(e).position),
            "static",
          );
          assert.equal(
            await card.evaluate((e) => getComputedStyle(e).opacity),
            "1",
            "All projects stay visible without JS even with reduced motion",
          );
          assert.equal(
            await card
              .locator(".project-meta")
              .evaluate((e) => getComputedStyle(e).visibility),
            "visible",
          );
        }
        await n.screenshot({
          path: path.join(dir, `no-js-${reducedMotion}.png`),
        });
        await n.locator(".gallery-link").nth(1).click();
        await n.waitForURL("**/work/knowledge-film/");
        await nojs.close();
      }
      if (name === "chromium" && process.env.CANVAS_RECORDINGS !== "0")
        await recordings(browser);
      console.log(
        `${name}: Living Canvas four viewports, 100 cycles, gestures/longpress, restoration, resize, reduced and no-JS passed`,
      );
    } finally {
      await browser.close();
    }
  }
  await fs.writeFile(
    path.join(destination, "results.json"),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        reports,
        nativeTouch:
          "Chromium CDP emulation only; Firefox/WebKit use mouse, keyboard and touch-capable viewports, not a claimed native swipe or physical device test.",
      },
      null,
      2,
    ),
  );
} finally {
  server?.kill();
}
