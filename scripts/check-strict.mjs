import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
const base = process.env.STRICT_BASE_URL ?? "http://localhost:4178";
const destination = path.resolve(
  process.env.BROWSER_EVIDENCE_DIR ?? "artifacts/browser",
  "living-canvas",
);
fs.mkdirSync(destination, { recursive: true });
let server;
const originalNextEnv = fs.readFileSync("next-env.d.ts", "utf8");
try {
  if (!process.env.STRICT_BASE_URL) {
    const log = fs.openSync(path.join(destination, "strict-server.log"), "w");
    server = spawn(
      process.execPath,
      ["node_modules/next/dist/bin/next", "dev", "--port", "4178"],
      { stdio: ["ignore", log, log] },
    );
    for (let i = 0; i < 150; i++) {
      try {
        if ((await fetch(base)).ok) break;
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  const b = await chromium.launch();
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } }),
      errors = [],
      hydration = [];
    p.setDefaultTimeout(20000);
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (m) => {
      if (
        m.type() === "error" &&
        /hydration|hydrated|didn't match/i.test(m.text())
      )
        hydration.push(m.text());
    });
    await p.goto(base);
    await p.waitForSelector(".living-gallery[data-enhanced=true]");
    for (let i = 0; i < 3; i++) {
      await p.locator('.desktop-nav a[href="/notes/"]').click();
      await p.waitForURL("**/notes/");
      await p.locator(".wordmark").click();
      await p.waitForSelector(".living-gallery[data-enhanced=true]");
    }
    const s = p.locator(".gallery-stage");
    await s.scrollIntoViewIfNeeded();
    await s.focus();
    const before = Number(await s.getAttribute("data-position"));
    await p.keyboard.press("ArrowRight");
    await p.waitForFunction(
      () =>
        !document.querySelector(".gallery-stage").hasAttribute("data-moving"),
    );
    assert.equal(Number(await s.getAttribute("data-position")), before + 1);
    await p.locator(".gallery-card[data-gallery-active=true]").hover();
    await p.waitForFunction(() => {
      const v = document.querySelector(".film-preview-video");
      return v && !v.paused && v.currentTime > 0.1;
    });
    const r = await p
      .locator(".gallery-card[data-gallery-active=true]")
      .boundingBox();
    await p.mouse.move(r.x + r.width / 2, r.y + 120);
    await p.mouse.down();
    await p.waitForFunction(
      () => document.querySelector(".film-preview-video").paused,
    );
    await p.mouse.move(r.x + r.width / 2 - 24, r.y + 120, { steps: 4 });
    await p.mouse.up();
    await p.waitForFunction(
      () =>
        !document.querySelector(".gallery-stage").hasAttribute("data-moving"),
    );
    await p.reload();
    await p.waitForSelector(".living-gallery[data-enhanced=true]");
    assert.equal(
      await p.locator(".gallery-stage").getAttribute("data-active"),
      "1",
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(hydration, []);
    fs.writeFileSync(
      path.join(destination, "strict-mode.json"),
      JSON.stringify(
        {
          mode: "next dev; reactStrictMode:true",
          visits: 3,
          stepDelta: 1,
          holdingPausesFilm: true,
          errors,
          hydration,
        },
        null,
        2,
      ),
    );
    console.log(
      "StrictMode development: three remount visits, one key -> one step, held video paused, no runtime/hydration errors",
    );
  } finally {
    await b.close();
  }
} finally {
  if (server) {
    const closed = new Promise((resolve) => server.once("close", resolve));
    server.kill();
    await Promise.race([
      closed,
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
    fs.writeFileSync("next-env.d.ts", originalNextEnv);
  }
}
