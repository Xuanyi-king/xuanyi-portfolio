import { chromium, firefox, webkit } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const destination = path.resolve(
  process.env.BROWSER_EVIDENCE_DIR ?? "artifacts/browser",
);
const base = process.env.BROWSER_BASE_URL ?? "http://127.0.0.1:4174";
const rest = "M112 110 C258 102 244 366 390 378";
let server;
if (!process.env.BROWSER_BASE_URL) {
  server = spawn(
    process.execPath,
    ["node_modules/serve/build/main.js", "out", "-l", "4174"],
    { stdio: "ignore" },
  );
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
}
const reports = [];
const layoutOnly = process.env.BROWSER_LAYOUT_ONLY === "1";
const engines = Object.entries({ chromium, firefox, webkit }).filter(
  ([name]) =>
    !process.env.BROWSER_ENGINES ||
    process.env.BROWSER_ENGINES.split(",").includes(name),
);
assert.ok(engines.length, "Choose at least one known browser engine");
async function ready(p) {
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(2000);
}
async function layout(p) {
  const dimensions = await p.evaluate(() => ({
    width: innerWidth,
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
    overflow: [...document.querySelectorAll("body *")]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          class: el.getAttribute("class"),
          x: r.x,
          right: r.right,
          width: r.width,
          font: getComputedStyle(el).fontFamily,
          text: el.textContent?.slice(0, 60),
        };
      })
    .filter((r) => r.right > innerWidth || r.x < 0)
      .slice(0, 30),
  }));
  if (dimensions.scroll > dimensions.width) {
    const isolation = await p.evaluate(() => {
      const measure = () => document.documentElement.scrollWidth;
      const regions = [
        ...document.querySelectorAll(
          "body > header, body > main, body > footer, main > *, footer .container > *, .hero > *, .hero-visual, .hero-thread, .living-x, .about-caption, .lab-art",
        ),
      ];
      return {
        regions: regions.map((el) => {
          const saved = el.getAttribute("style");
          el.style.setProperty("display", "none", "important");
          const without = measure();
          if (saved === null) el.removeAttribute("style");
          else el.setAttribute("style", saved);
          return { tag: el.tagName, class: el.getAttribute("class"), without };
        }),
        scrollers: [...document.querySelectorAll("body *")]
          .filter((el) => el.scrollWidth > el.clientWidth + 1)
          .map((el) => ({
            tag: el.tagName,
            class: el.getAttribute("class"),
            scroll: el.scrollWidth,
            client: el.clientWidth,
            overflow: getComputedStyle(el).overflow,
          }))
          .slice(0, 35),
      };
    });
    console.log(
      "LAYOUT_DIAGNOSTICS",
      JSON.stringify({ ...dimensions, isolation }),
    );
  }
  assert.equal(
    await p.evaluate(() =>
      [...document.fonts].some(
        (face) =>
          face.family.replaceAll('"', "") === "Xuanyi Editorial" &&
          face.style === "italic" &&
          face.status === "loaded",
      ),
    ),
    true,
    "The editorial face must load instead of silently falling back to a different system font",
  );
  assert.equal(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    true,
    "No horizontal overflow",
  );
  assert.equal(await p.locator(".hero-name").innerText(), "XUANYI");
  assert.equal(await p.locator(".hero-han").innerText(), "玄屹");
  const cta = await p.locator(".hero-actions .pill-button").boundingBox();
  assert.ok(
    cta.y + cta.height < p.viewportSize().height,
    "Primary CTA is in the first viewport",
  );
}
try {
  for (const [name, engine] of engines) {
    const dir = path.join(destination, name, "polish");
    await fs.mkdir(dir, { recursive: true });
    await fs.rm(path.join(dir, "failure.txt"), { force: true });
    await fs.rm(path.join(dir, "failure.png"), { force: true });
    const browser = await engine.launch({ headless: true });
    if (layoutOnly) {
      try {
        for (const [width, height] of [
          [390, 844],
          [320, 740],
        ]) {
          const c = await browser.newContext({
            viewport: { width, height },
            hasTouch: true,
          });
          try {
            const p = await c.newPage();
            await p.goto(base);
            await ready(p);
            await p.screenshot({ path: path.join(dir, `layout-${width}.png`) });
            await layout(p);
          } finally {
            await c.close();
          }
        }
        reports.push({
          browser: name,
          version: browser.version(),
          checks: ["390px / 320px layout smoke only"],
        });
        console.log(`${name}: 390px / 320px layout smoke passed`);
      } finally {
        await browser.close();
      }
      continue;
    }
    const errors = [],
      checks = [],
      capabilities = {};
    const c = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: {
        dir: path.join(dir, "recordings"),
        size: { width: 1440, height: 900 },
      },
    });
    c.on("page", (p) => p.on("pageerror", (e) => errors.push(e.message)));
    await c.addInitScript(() => {
      window.__curveAudit = { writesDuringCSS: 0, hiddenTitle: 0, samples: [] };
      const original = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function (name, value) {
        if (
          name === "d" &&
          this.matches?.("[data-ribbon]") &&
          this.closest(".hero")
        ) {
          const owner = this.closest(".living-x");
          if (
            owner?.dataset.curveOwner === "css" ||
            this.getAnimations().some(
              (a) =>
                a.playState === "running" &&
                a.animationName?.startsWith("ribbon-unfold-"),
            )
          )
            window.__curveAudit.writesDuringCSS++;
        }
        return original.call(this, name, value);
      };
      const until = performance.now() + 4000;
      function sample() {
        const path = document.querySelector(".hero .x-ribbon-a");
        if (path) {
          const d = getComputedStyle(path).d || path.getAttribute("d");
          const n = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
          window.__curveAudit.samples.push({
            owner: path.closest(".living-x").dataset.curveOwner,
            time: performance.now(),
            controls: n,
          });
          const title = getComputedStyle(document.querySelector(".hero-title"));
          if (Number(title.opacity) < 0.99 || title.visibility === "hidden")
            window.__curveAudit.hiddenTitle++;
        }
        if (performance.now() < until) requestAnimationFrame(sample);
      }
      requestAnimationFrame(sample);
    });
    const p = await c.newPage();
    try {
      await p.goto(base, { waitUntil: "domcontentloaded" });
      const living = p.locator(".hero .living-x");
      await living.locator("[data-ribbon]").first().waitFor();
      await p.waitForFunction(
        () => document.querySelector(".hero .living-x")?.dataset.curveOwner,
      );
      const initialOwner = await living.getAttribute("data-curve-owner");
      // Do not send another move after the intro: the early pointer must be retained.
      await p.mouse.move(1180, 420);
      await p.waitForTimeout(350);
      await p.screenshot({ path: path.join(dir, "thread-early.png") });
      await ready(p);
      assert.notEqual(
        await p.locator(".hero .x-ribbon-a").getAttribute("d"),
        rest,
        "Early input survives CSS-to-spring handoff",
      );
      const audit = await p.evaluate(() => window.__curveAudit);
      assert.equal(
        audit.writesDuringCSS,
        0,
        "CSS and JS must never both write d",
      );
      assert.equal(
        audit.hiddenTitle,
        0,
        "Brand expression stays readable throughout",
      );
      let handoffStep = null;
      for (let i = 1; i < audit.samples.length; i++) {
        const a = audit.samples[i - 1],
          b = audit.samples[i];
        if (
          a.owner === "css" &&
          b.owner === "spring" &&
          a.controls &&
          b.controls
        ) {
          handoffStep = Math.max(
            ...a.controls.map((v, j) => Math.abs(v - b.controls[j])),
          );
          assert.ok(handoffStep < 4, "Handoff must not snap between curves");
        }
      }
      await fs.writeFile(
        path.join(dir, "curve-audit.json"),
        JSON.stringify({ initialOwner, handoffStep, ...audit }, null, 2),
      );
      await p.mouse.move(700, 50, { steps: 15 });
      await p.waitForTimeout(1600);
      assert.equal(
        await p.locator(".hero .x-ribbon-a").getAttribute("d"),
        rest,
        "Pointer exit restores the brand silhouette",
      );
      await layout(p);
      await p.screenshot({ path: path.join(dir, "hero-desktop.png") });
      capabilities.cssPath = await p.evaluate(() =>
        CSS.supports("d", 'path("M0 0L1 1")'),
      );
      capabilities.crossDocumentTransitions = await p.evaluate(
        () => typeof window.PageRevealEvent !== "undefined",
      );
      checks.push(
        "single curve owner, retained early input, continuous handoff, static title, pointer recovery",
      );

      // Preference changes cancel decoration and erase pointer offsets immediately.
      await p.emulateMedia({ reducedMotion: "reduce" });
      await p.mouse.move(1200, 500);
      await p.waitForTimeout(150);
      assert.equal(
        await p.locator(".hero .x-ribbon-a").getAttribute("d"),
        rest,
      );
      assert.equal(
        await p
          .locator(".hero [data-ribbon]")
          .evaluateAll(
            (paths) => paths.flatMap((path) => path.getAnimations()).length,
          ),
        0,
      );
      await p.emulateMedia({ reducedMotion: "no-preference" });
      await p.mouse.move(700, 50);
      checks.push(
        "reduced-motion toggle cancels CSS, spring offsets and decorative motion",
      );

      await p.goto(base + "/work/");
      await ready(p);
      const router = p.locator(".project-card").nth(0),
        film = p.locator(".project-card").nth(1),
        multi = p.locator(".project-card").nth(2);
      const video = film.locator("video");
      assert.equal(
        await video.getAttribute("src"),
        null,
        "No speculative video source",
      );
      await router.locator(".project-cover").hover();
      await p.waitForTimeout(900);
      await p.screenshot({ path: path.join(dir, "router-preview.png") });
      await film.locator(".project-cover").hover();
      await p.waitForFunction(
        () => {
          const v = document.querySelector(".film-preview-video");
          return v && v.currentTime > 0.15 && !v.paused;
        },
        null,
        { timeout: 12000 },
      );
      assert.equal(await video.evaluate((v) => v.muted), true);
      await p.screenshot({ path: path.join(dir, "film-preview.png") });
      await p.mouse.move(20, 40);
      await p.waitForTimeout(120);
      assert.equal(await video.evaluate((v) => v.paused), true);
      // Rapid hover leave/re-enter is a real play/pause race, not a mocked player.
      for (let i = 0; i < 3; i++) {
        await film.locator(".project-cover").hover();
        await p.mouse.move(20, 40);
      }
      await film.locator(".project-cover").focus();
      await p.keyboard.press("Tab");
      await p.waitForTimeout(600);
      assert.equal(await video.evaluate((v) => v.paused), false);
      await p.emulateMedia({ reducedMotion: "reduce" });
      await p.waitForFunction(
        () => document.querySelector(".film-preview-video").paused,
      );
      assert.equal(await video.evaluate((v) => v.paused), true);
      await p.emulateMedia({ reducedMotion: "no-preference" });
      await multi.locator(".project-cover").hover();
      await p.waitForTimeout(900);
      await p.screenshot({ path: path.join(dir, "multiverse-preview.png") });
      assert.equal(
        await multi
          .locator(".multiverse-reveal")
          .evaluate((el) => getComputedStyle(el).opacity),
        "1",
      );
      checks.push(
        "real UI crop, lazy muted film playback, pointer exit, rapid re-entry, keyboard preview, reduced motion, verified alternate archive",
      );
      for (const [index, slug] of [
        [0, "adaptive-router"],
        [1, "knowledge-film"],
        [2, "zhihu-multiverse"],
      ]) {
        await p
          .locator(".project-card")
          .nth(index)
          .locator(".project-cover")
          .click();
        await p.waitForURL(`**/work/${slug}/`);
        await p.waitForTimeout(600);
        assert.equal(await p.locator(".project-scene").count(), 1);
        if (
          await p.evaluate(() => CSS.supports("view-transition-name", "cover"))
        )
          assert.equal(
            await p
              .locator(".project-scene")
              .evaluate((el) => getComputedStyle(el).viewTransitionName),
            `cover-${slug}`,
          );
        await p.goBack();
        await p.waitForURL("**/work/");
      }
      await p.locator(".project-cover").first().click();
      await p.waitForURL("**/work/adaptive-router/");
      await p.locator(".back-link").click();
      await p.waitForURL("**/work/");
      checks.push(
        "all three native detail links, one named scene, browser back, explicit return; transitions optional",
      );
      await p.goto(base + "/");
      await ready(p);
      assert.equal(
        await p
          .locator(".hero .x-ribbon")
          .first()
          .evaluate((el) => el.getAnimations().length),
        0,
      );
      checks.push("return visit never replays the curve introduction");

      for (const [width, height] of [
        [390, 844],
        [320, 740],
      ]) {
        const mobile = await browser.newContext({
          viewport: { width, height },
          hasTouch: true,
        });
        const m = await mobile.newPage();
        m.on("pageerror", (e) => errors.push(e.message));
        await m.goto(base);
        await ready(m);
        await m.screenshot({ path: path.join(dir, `hero-${width}.png`) });
        await layout(m);
        await m.goto(base + "/lab/");
        await ready(m);
        const handle = m.locator(".x-handle").first();
        await handle.scrollIntoViewIfNeeded();
        await handle.focus();
        const curve = m.locator(".living-x .x-ribbon-a");
        const before = await curve.getAttribute("d");
        await m.keyboard.press("ArrowRight");
        await m.waitForTimeout(400);
        assert.notEqual(await curve.getAttribute("d"), before);
        await m.keyboard.press("Escape");
        await m.waitForTimeout(1300);
        assert.equal(await curve.getAttribute("d"), rest);
        await mobile.close();
      }
      checks.push(
        "390x844 and 320x740 readable brand/CTA, no overflow, keyboard Lab recovery (emulated viewports)",
      );

      const nojs = await browser.newContext({ javaScriptEnabled: false });
      const n = await nojs.newPage();
      await n.goto(base);
      await n.waitForTimeout(1900);
      assert.equal(await n.locator(".hero-name").innerText(), "XUANYI");
      await n.goto(base + "/work/");
      await n.locator(".project-cover").first().click();
      await n.waitForURL("**/work/adaptive-router/");
      await n.locator(".back-link").click();
      await n.waitForURL("**/work/");
      await nojs.close();
      checks.push(
        "no-JS complete brand, static fallback and native project navigation",
      );
      assert.deepEqual(errors, []);
      reports.push({
        browser: name,
        version: browser.version(),
        capabilities,
        checks,
        errors,
      });
      await fs.writeFile(
        path.join(dir, "results.json"),
        JSON.stringify(reports.at(-1), null, 2) + "\n",
      );
      console.log(
        `${name} ${browser.version()}: ${checks.length} groups passed`,
      );
    } catch (e) {
      await p
        .screenshot({ path: path.join(dir, "failure.png") })
        .catch(() => {});
      await fs.writeFile(path.join(dir, "failure.txt"), e.stack);
      throw e;
    } finally {
      const video = p.video();
      await c.close();
      await video.saveAs(path.join(dir, "interaction.webm"));
      await fs.rm(path.join(dir, "recordings"), {
        recursive: true,
        force: true,
      });
      await browser.close();
    }
  }
  await fs.writeFile(
    path.join(
      destination,
      layoutOnly ? "layout-smoke-results.json" : "cross-browser-results.json",
    ),
    JSON.stringify({ date: new Date().toISOString(), reports }, null, 2) + "\n",
  );
} finally {
  server?.kill();
}
