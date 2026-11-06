import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
const destination = path.resolve(
  process.env.BROWSER_EVIDENCE_DIR ?? "artifacts/browser",
  "chromium",
);
await fs.mkdir(destination, { recursive: true });
await fs.rm(path.join(destination, "failure.txt"), { force: true });
const base = process.env.BROWSER_BASE_URL ?? "http://127.0.0.1:4173";
let server;
if (!process.env.BROWSER_BASE_URL) {
  server = spawn(
    process.execPath,
    ["node_modules/serve/build/main.js", "out", "-l", "4173"],
    { stdio: "ignore" },
  );
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
}
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  headless: true,
  args: ["--no-sandbox"],
});
const checks = [],
  errors = [],
  stableFrames = [];
async function context(options = {}) {
  const c = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ...options,
  });
  c.on("page", (p) => p.on("pageerror", (e) => errors.push(e.message)));
  return c;
}
async function ready(p) {
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1900);
}
async function shot(p, name) {
  await p.screenshot({ path: path.join(destination, name + ".png") });
}
async function record(name, fn, options = {}) {
  const c = await context({
    ...options,
    recordVideo: {
      dir: path.join(destination, ".recordings"),
      size: options.viewport ?? { width: 1440, height: 900 },
    },
  });
  const p = await c.newPage();
  try {
    await fn(p, c);
  } finally {
    const v = p.video();
    await c.close();
    await v.saveAs(path.join(destination, name + ".webm"));
  }
}
// Evaluate the actual cubic path independently of the implementation's geometry helper.
async function anchor(p, index = 0) {
  // Measure the painted frame after click-triggered scrolling/layout, not a stale SVG CTM.
  await p.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  return p.locator(".living-x").evaluate((el, i) => {
    const svg = el.querySelector("svg"),
      button = el.querySelectorAll(".x-handle")[i],
      path = el.querySelectorAll(".x-ribbon")[i];
    const n = path
        .getAttribute("d")
        .match(/-?\d+(?:\.\d+)?/g)
        .map(Number),
      t = i === 0 ? 0.35 : 0.65;
    const w = [(1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3];
    const point = new DOMPoint(
      w.reduce((v, a, j) => v + a * n[j * 2], 0),
      w.reduce((v, a, j) => v + a * n[j * 2 + 1], 0),
    ).matrixTransform(svg.getScreenCTM());
    const r = button.getBoundingClientRect();
    return {
      x: r.x + r.width / 2,
      y: r.y + r.height / 2,
      error: Math.hypot(
        point.x - r.x - r.width / 2,
        point.y - r.y - r.height / 2,
      ),
      d: path.getAttribute("d"),
      drag: button.hasAttribute("data-dragging"),
    };
  }, index);
}
try {
  await record("hero-motion", async (p) => {
    await p.goto(base);
    await ready(p);
    await shot(p, "hero-desktop");
    assert.equal(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    const d = await p.locator(".hero .x-ribbon").first().getAttribute("d");
    await p.mouse.move(1180, 630, { steps: 25 });
    await p.waitForTimeout(600);
    assert.notEqual(
      await p.locator(".hero .x-ribbon").first().getAttribute("d"),
      d,
    );
    await p.mouse.move(220, 480, { steps: 25 });
    await p.waitForTimeout(600);
    await p.mouse.move(700, 50, { steps: 25 });
    await p.waitForTimeout(700);
    await p.keyboard.press("Tab");
    await p.keyboard.press("Tab");
    await shot(p, "keyboard-focus");
    await p.reload();
    await ready(p);
    assert.equal(
      await p.locator("html").getAttribute("data-xuanyi-returning"),
      "true",
    );
    assert.equal(
      await p
        .locator(".hero .x-ribbon-b")
        .evaluate((el) =>
          el.getAnimations().some((a) => a.animationName === "ribbon-unfold-b"),
        ),
      false,
    );
    checks.push("1440x900 layout, living curves, keyboard focus");
  });
  await record("home-scroll", async (p) => {
    await p.goto(base);
    await ready(p);
    assert.equal(
      await p.locator(".film-preview-video[src]").count(),
      0,
      "No film requested before interaction",
    );
    for (let i = 0; i < 4; i++) {
      await p.mouse.wheel(0, 390);
      await p.waitForTimeout(650);
    }
    await p.locator("#selected-work").scrollIntoViewIfNeeded();
    await p.waitForTimeout(1300);
    await shot(p, "selected-work");
    await p.mouse.wheel(0, 450);
    await p.waitForTimeout(1200);
    checks.push(
      "home scroll composition, readable project titles, no eager video request",
    );
  });
  await record("project-transition", async (p) => {
    await p.goto(base + "/work/");
    await ready(p);
    const card = p.locator(".project-cover").first();
    await card.hover();
    await p.waitForTimeout(800);
    await shot(p, "work-hover");
    const film = p.locator(".project-card").nth(1),
      video = film.locator("video");
    await film.locator(".project-cover").focus();
    await p.keyboard.press("Tab");
    await p.waitForTimeout(1400);
    assert.ok(await video.getAttribute("src"));
    assert.ok(await video.evaluate((v) => v.currentTime > 0.1));
    assert.equal(
      await video.evaluate((v) => v.paused),
      false,
      "Keyboard preview must remain playing",
    );
    const playingTime = await video.evaluate((v) => v.currentTime);
    await p.mouse.move(50, 80);
    await p.waitForTimeout(250);
    assert.ok(
      await video.evaluate((v, t) => v.currentTime > t + 0.05, playingTime),
      "Focused film must continue advancing",
    );
    assert.equal(
      await video.evaluate((v) => v.paused),
      false,
      "Pointer exit must preserve focused preview",
    );
    await shot(p, "film-preview");
    await card.focus();
    await card.hover();
    await p.waitForTimeout(400);
    assert.equal(await video.evaluate((v) => v.paused), true);
    await card.click();
    await p.waitForURL("**/work/adaptive-router/");
    await ready(p);
    assert.equal(await p.locator(".project-scene").count(), 1);
    await shot(p, "project-detail");
    await p.locator(".project-evidence").scrollIntoViewIfNeeded();
    await p
      .locator(".project-evidence")
      .screenshot({ path: path.join(destination, "router-evidence.png") });
    await p.goBack();
    await p.waitForURL("**/work/");
    await p.waitForTimeout(700);
    assert.equal(await p.locator(".project-card").count(), 3);
    await p.locator(".project-cover").first().click();
    await p.waitForURL("**/work/adaptive-router/");
    await p.locator(".back-link").click();
    await p.waitForURL("**/work/");
    await p.goto(base + "/work/knowledge-film/");
    await ready(p);
    await p.locator(".project-evidence").scrollIntoViewIfNeeded();
    await p
      .locator(".project-evidence")
      .screenshot({ path: path.join(destination, "film-evidence.png") });
    checks.push(
      "hover, named scene, detail, browser back, explicit return, real project media",
    );
  });
  await record("lab-interaction", async (p) => {
    await p.goto(base + "/lab/");
    await ready(p);
    await p.locator(".playground").scrollIntoViewIfNeeded();
    const initial = await anchor(p);
    assert.ok(initial.error < 1);
    await p.mouse.move(initial.x, initial.y);
    await p.mouse.down();
    await p.mouse.move(initial.x + 16, initial.y + 12, { steps: 20 });
    let pulled = await anchor(p);
    assert.ok(pulled.error < 1);
    assert.ok(Math.abs(pulled.x - initial.x - 16) < 1);
    assert.ok(Math.abs(pulled.y - initial.y - 12) < 1);
    assert.equal(pulled.drag, true);
    await shot(p, "lab-drag");
    await p.mouse.up();
    await p.waitForTimeout(1300);
    assert.ok(Math.abs((await anchor(p)).x - initial.x) < 1);
    await p.locator(".x-handle").first().focus();
    await p.keyboard.press("ArrowRight");
    await p.waitForTimeout(350);
    let first = await anchor(p);
    await p.keyboard.press("ArrowRight");
    await p.waitForTimeout(350);
    let second = await anchor(p);
    assert.ok(second.x > first.x + 1);
    await p.keyboard.press("Escape");
    await p.waitForTimeout(1200);
    assert.ok(Math.abs((await anchor(p)).x - initial.x) < 1);
    await p.getByRole("button", { name: "舒展", exact: true }).click();
    await p.waitForTimeout(700);
    assert.ok((await anchor(p)).error < 1);
    await p.getByRole("button", { name: "回环", exact: true }).click();
    await p.waitForTimeout(700);
    assert.ok((await anchor(p)).error < 1);
    await p.getByRole("button", { name: "重新开始" }).click();
    await p.waitForTimeout(1200);
    assert.ok(Math.abs((await anchor(p)).x - initial.x) < 1);
    checks.push(
      "Lab drag/anchor <1px, keyboard increments, Escape, presets, reset",
    );
  });
  for (const [name, width, height] of [
    ["tablet", 768, 1024],
    ["mobile", 390, 844],
    ["narrow", 375, 812],
    ["small", 320, 740],
  ]) {
    const c = await context({
      viewport: { width, height },
      ...(width === 390
        ? {
            recordVideo: {
              dir: path.join(destination, ".recordings"),
              size: { width, height },
            },
          }
        : {}),
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1,
    });
    const p = await c.newPage();
    await p.goto(base);
    await ready(p);
    assert.equal(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await shot(p, "hero-" + name);
    const before = await p.screenshot({ animations: "disabled" });
    await p.waitForTimeout(400);
    const after = await p.screenshot({ animations: "disabled" });
    assert.ok(before.equals(after), `Settled ${width}px hero must stop moving`);
    stableFrames.push(width);
    if (width === 390) {
      await p.goto(base + "/lab/");
      await ready(p);
      await p.locator(".playground-x").scrollIntoViewIfNeeded();
      const a = await anchor(p),
        cdp = await c.newCDPSession(p);
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: a.x, y: a.y }],
      });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: a.x + 10, y: a.y + 8 }],
      });
      const moved = await anchor(p);
      assert.equal(moved.drag, true);
      assert.ok(moved.error < 1);
      assert.ok(Math.abs(moved.x - a.x - 10) < 1);
      await shot(p, "lab-touch");
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchCancel",
        touchPoints: [],
      });
      await p.waitForTimeout(1200);
      assert.equal((await anchor(p)).drag, false);
      assert.ok(Math.abs((await anchor(p)).x - a.x) < 1);
    }
    checks.push(
      `${width}x${height} layout${width === 390 ? ", touch capture/cancel/anchor" : ""}`,
    );
    const recording = p.video();
    await c.close();
    if (recording)
      await recording.saveAs(path.join(destination, "lab-touch.webm"));
  }
  const c = await context();
  const p = await c.newPage();
  await p.goto(base);
  await ready(p);
  const original = await p.evaluate(
    async () =>
      new DOMParser()
        .parseFromString(await (await fetch("/")).text(), "text/html")
        .querySelector(".intro-statement").innerHTML,
  );
  let count;
  for (let i = 0; i < 3; i++) {
    const descendants = await p.locator(".intro-statement *").count();
    if (count !== undefined) assert.equal(descendants, count);
    count = descendants;
    await p.evaluate(
      () => (window.__oldIntro = document.querySelector(".intro-statement")),
    );
    await p.locator('.desktop-nav a[href="/notes/"]').click();
    await p.waitForURL("**/notes/");
    await p.waitForTimeout(200);
    assert.equal(await p.evaluate(() => window.__oldIntro.innerHTML), original);
    await p.locator(".wordmark").click();
    await p.waitForURL(base + "/");
    await ready(p);
  }
  checks.push(
    "SplitText 3 SPA exit/return cycles restore exact original HTML, no nested residue",
  );
  await c.close();
  const reduced = await context({ reducedMotion: "reduce" });
  const rp = await reduced.newPage();
  await rp.goto(base);
  await ready(rp);
  await shot(rp, "hero-reduced");
  assert.equal(await rp.locator(".intro-statement > div").count(), 0);
  await rp.goto(base + "/lab/");
  await ready(rp);
  await rp.getByRole("button", { name: "舒展", exact: true }).click();
  const reducedAnchor = await anchor(rp);
  assert.ok(reducedAnchor.error < 1);
  await reduced.close();
  checks.push(
    "reduced motion: static text, no SplitText wrappers, direct Lab state",
  );
  const slow = await context({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const sp = await slow.newPage();
  await sp.route("**/_next/static/chunks/*.js", async (route) => {
    await new Promise((r) => setTimeout(r, 1500));
    await route.continue();
  });
  await sp.goto(base, { waitUntil: "domcontentloaded" });
  await sp.evaluate(() => {
    window.__hiddenSamples = 0;
    const until = performance.now() + 6000;
    function sample() {
      const title = document.querySelector(".hero-title");
      if (title) {
        const style = getComputedStyle(title),
          r = title.getBoundingClientRect();
        if (
          style.visibility === "hidden" ||
          Number(style.opacity) < 0.99 ||
          r.width < 20 ||
          r.height < 20
        )
          window.__hiddenSamples++;
      }
      if (performance.now() < until) requestAnimationFrame(sample);
    }
    sample();
  });
  await sp.waitForTimeout(6500);
  assert.equal(await sp.evaluate(() => window.__hiddenSamples), 0);
  await shot(sp, "hero-slow-mobile");
  await slow.close();
  checks.push(
    "1500ms delayed JS: title never moved behind its mask after first paint",
  );
  const fallback = await context({ javaScriptEnabled: false });
  const fp = await fallback.newPage();
  await fp.goto(base);
  const firstCurve = await fp
    .locator(".hero .x-ribbon-b")
    .evaluate((el) => getComputedStyle(el).d);
  await fp.waitForTimeout(1900);
  const settledCurve = await fp
    .locator(".hero .x-ribbon-b")
    .evaluate((el) => getComputedStyle(el).d);
  if (await fp.evaluate(() => CSS.supports("d", 'path("M0 0L1 1")')))
    assert.notEqual(
      firstCurve,
      settledCurve,
      "CSS curve choreography must run without hydration",
    );
  await shot(fp, "hero-no-js");
  assert.ok((await fp.locator("h1").innerText()).includes("Curiosity"));
  await fp.goto(base + "/work/");
  await fp.locator(".project-cover").first().click();
  await fp.waitForURL("**/work/adaptive-router/");
  await shot(fp, "detail-no-js");
  await fp.locator(".back-link").click();
  await fp.waitForURL("**/work/");
  await fallback.close();
  checks.push(
    "no-JS readable brand, CSS curve narrative, native detail/return; repeat visit quiet",
  );
  assert.deepEqual(errors, [], "Browser runtime errors");
  await fs.writeFile(
    path.join(destination, "results.json"),
    JSON.stringify(
      {
        date: new Date().toISOString(),
        browser: await browser.version(),
        viewportEvidence: [
          "1440x900",
          "768x1024",
          "390x844",
          "375x812",
          "320x740",
        ],
        stableFrames,
        checks,
        errors,
      },
      null,
      2,
    ) + "\n",
  );
  await fs.rm(path.join(destination, ".recordings"), {
    recursive: true,
    force: true,
  });
  console.log(
    JSON.stringify(
      { passed: checks.length, checks, errors, evidence: destination },
      null,
      2,
    ),
  );
} catch (e) {
  await fs.writeFile(path.join(destination, "failure.txt"), e.stack);
  throw e;
} finally {
  await browser.close();
  server?.kill();
}
