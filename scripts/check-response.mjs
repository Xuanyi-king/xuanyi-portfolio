import { watchPageErrors } from './page-errors.mjs';
import { chromium, firefox, webkit } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
const base = process.env.BROWSER_BASE_URL ?? "http://127.0.0.1:4179";
const dir = path.resolve(
  process.env.BROWSER_EVIDENCE_DIR ?? "artifacts/browser",
  "response-review",
);
await fs.mkdir(dir, { recursive: true });
let server;
const reports = [];
async function depthStudy(browser) {
  const folder = path.join(dir, "depth-study");
  await fs.mkdir(folder, { recursive: true });
  for (const [label, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    const c = await browser.newContext({
        viewport: { width, height },
        recordVideo: {
          dir: path.join(folder, ".recordings"),
          size: { width, height },
        },
      }),
      p = await c.newPage();
    try {
      await p.goto(base + "/lab/canvas-study/");
      await p.evaluate(() => document.fonts.ready);
      const study = p.locator("[data-depth-study]");
      await study.scrollIntoViewIfNeeded();
      for (const [name, expected] of [
        ["静止", [0, 0, 0, 0]],
        ["舒展", [30, -35, -30, 35]],
        ["收束", [-30, 25, 30, -25]],
      ]) {
        await study.getByRole("button", { name, exact: true }).click();
        await p.waitForFunction(
          (values) =>
            [
              ...document.querySelectorAll("[data-depth-study] .living-x"),
            ].every((el) => {
              const paths = el.querySelectorAll("[data-ribbon]");
              return [...paths].every((path, index) => {
                const n = path
                  .getAttribute("d")
                  .match(/-?\d+(?:\.\d+)?/g)
                  .map(Number);
                return (
                  Math.abs(n[2] - (index ? 246 : 258) - values[index * 2]) <
                    0.01 &&
                  Math.abs(n[3] - (index ? 112 : 102) - values[index * 2 + 1]) <
                    0.01
                );
              });
            }),
          expected,
        );
        for (let i = 0; i < 2; i++)
          await study
            .locator(".study-specimen")
            .nth(i)
            .screenshot({
              path: path.join(folder, `${label}-${i}-${name}.png`),
            });
      }
    } finally {
      const video = p.video();
      await c.close();
      await video.saveAs(path.join(folder, `${label}-candidate.webm`));
    }
  }
}
try {
  if (!process.env.BROWSER_BASE_URL) {
    server = spawn(
      process.execPath,
      ["node_modules/serve/build/main.js", "out", "-l", "4179"],
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
    const b = await engine.launch();
    try {
      for (const [width, height] of [
        [1440, 900],
        [390, 844],
        [320, 740],
      ]) {
        const record = name === "chromium" && width !== 320;
        // Firefox's hasTouch emulation suppresses mouse PointerEvents even on an
        // empty page. These are mouse tests at different widths; touch is tested by
        // the separate Chromium CDP suite, never claimed as a physical device.
        const c = await b.newContext({
          viewport: { width, height },
          ...(record
            ? {
                recordVideo: {
                  dir: path.join(dir, ".recordings"),
                  size: { width, height },
                },
              }
            : {}),
        });
        const p = await c.newPage(),
          errors = [];
        p.setDefaultTimeout(15000);
        const fetchDiagnostics = await watchPageErrors(p, name, errors, base);
        try {
          await p.goto(base);
          await p.evaluate(() => document.fonts.ready);
          await p.waitForSelector(".living-gallery[data-enhanced=true]");
          const stage = p.locator(".gallery-stage");
          assert.equal(
            await stage.evaluate((e) => getComputedStyle(e).transformStyle),
            "preserve-3d",
          );
          for (const selector of [
            ".gallery-card",
            ".gallery-card .cover-depth",
          ])
            assert.equal(
              await p
                .locator(selector)
                .first()
                .evaluate((e) => getComputedStyle(e).transformStyle),
              "flat",
              "Planar contents do not create nested 3D layers",
            );
          assert.ok(
            await p
              .locator(".gallery-card")
              .evaluateAll((a) =>
                a.some((e) =>
                  getComputedStyle(e).transform.includes("matrix3d"),
                ),
              ),
            "Card perspective remains genuine CSS 3D",
          );
          await stage.evaluate((e) =>
            scrollTo({
              top:
                e.getBoundingClientRect().top +
                scrollY -
                document.querySelector("header").getBoundingClientRect()
                  .height -
                20,
              behavior: "instant",
            }),
          );
          await p.waitForTimeout(1000);
          const curve = p.locator('.gallery-response [data-ribbon="a"]'),
            rest = await curve.getAttribute("d"),
            nav = await p.locator(".wordmark > svg").innerHTML();
          const position = () => stage.getAttribute("data-position");
          await p.screenshot({
            path: path.join(dir, `${name}-${width}-rest.png`),
          });
          const r = await stage.boundingBox(),
            x = r.x + r.width * 0.55,
            y = r.y + 110;
          await p.mouse.move(x, y);
          await p.mouse.down();
          for (let i = 1; i <= 16; i++) {
            await p.mouse.move(x - i * 12, y);
            await p.waitForTimeout(30);
          }
          assert.notEqual(
            await curve.getAttribute("d"),
            rest,
            "Genuine drag changes local X geometry",
          );
          const offsets = await curve.evaluate((e) => {
            const n = e
              .getAttribute("d")
              .match(/-?\d+(?:\.\d+)?/g)
              .map(Number);
            return [n[2] - 258, n[3] - 102];
          });
          assert.ok(
            offsets.every((n) => Number.isFinite(n) && Math.abs(n) < 36),
            "Spring response remains bounded",
          );
          assert.equal(
            await p.locator(".wordmark > svg").innerHTML(),
            nav,
            "Gallery never writes navigation geometry",
          );
          await p.screenshot({
            path: path.join(dir, `${name}-${width}-drag.png`),
          });
          await p.mouse.up();
          // At 320px the drag deliberately leaves the viewport. Firefox can
          // miss that outside release; a button-free re-entry must recover.
          await p.mouse.move(Math.max(12, x - 180), y);
          assert.equal(
            await stage.getAttribute("data-holding"),
            null,
            "A released mouse re-entering the viewport ends the old capture",
          );
          await p.waitForFunction(
            () =>
              !document
                .querySelector(".gallery-stage")
                .hasAttribute("data-moving"),
          );
          await p.waitForFunction(
            (expected) =>
              document
                .querySelector('.gallery-response [data-ribbon="a"]')
                .getAttribute("d") === expected,
            rest,
          );
          const selected = await stage.getAttribute("data-active");
          await p.locator(".gallery-card[data-gallery-active=true] a").click();
          await p.waitForURL("**/work/*/");
          await p.goBack();
          await p.waitForSelector(".living-gallery[data-enhanced=true]");
          assert.equal(await stage.getAttribute("data-active"), selected);
          await stage.scrollIntoViewIfNeeded();
          await stage.focus();
          await p.emulateMedia({ reducedMotion: "reduce" });
          await p.waitForTimeout(150);
          const before = Number(await position()),
            reduced = await curve.getAttribute("d");
          await p.keyboard.press("ArrowRight");
          await p.waitForTimeout(150);
          assert.equal(Number(await position()), before + 1);
          assert.equal(await curve.getAttribute("d"), reduced);
          assert.ok(
            await p.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          );
          assert.deepEqual(errors, []);
          reports.push({
            browser: name,
            viewport: `${width}x${height}`,
            dragResponse: true,
            navUnchanged: true,
            recovery: true,
            history: true,
            reduced: true,
            errors,
            fetchDiagnostics,
          });
        } finally {
          const video = p.video();
          await c.close();
          if (record)
            await video.saveAs(
              path.join(dir, `${name}-${width}-gallery-response.webm`),
            );
        }
      }
      if (name === "chromium") await depthStudy(b);
    } finally {
      await b.close();
    }
  }
  await fs.writeFile(
    path.join(dir, "results.json"),
    JSON.stringify(
      {
        reports,
        nativeTouch:
          "Existing canvas suite uses Chromium CDP emulation; no physical Android device was attached.",
      },
      null,
      2,
    ),
  );
  console.log(
    `Gallery X response: ${reports.length} browser/viewport cases passed`,
  );
} finally {
  server?.kill();
}
