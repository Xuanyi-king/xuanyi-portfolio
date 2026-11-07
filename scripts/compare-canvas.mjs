import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { analyzeCanvasTrace } from "./lib/canvas-trace.mjs";

const exec = promisify(execFile),
  baseline = process.env.CANVAS_BASELINE_SHA ?? "811a2d4656bae7c80885211d3e55bec0d9d8f790";
const directory = path.resolve(
  process.env.BROWSER_EVIDENCE_DIR ?? "artifacts/browser",
  "response-review",
  "comparison",
);
const runs = Number(process.env.CANVAS_COMPARE_RUNS ?? 3);
if (!Number.isInteger(runs) || runs < 1 || runs > 5)
  throw new Error("CANVAS_COMPARE_RUNS must be 1..5");
await fs.mkdir(directory, { recursive: true });
const servers = [];
let temporary;
async function serve(out, port) {
  const child = spawn(
    process.execPath,
    ["node_modules/serve/build/main.js", out, "-l", String(port)],
    { stdio: "ignore" },
  );
  servers.push(child);
  const url = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(url)).ok) return url;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`Static baseline server unavailable on ${port}`);
}
async function measure(label, url, name, traced) {
  const output = path.join(directory, label, name);
  console.log(
    `${label} ${name}: ${traced ? "trace + CPU profile" : "normal measurement"}`,
  );
  const env = {
    ...process.env,
    BROWSER_BASE_URL: url,
    BROWSER_EVIDENCE_DIR: output,
    CANVAS_CPU_RATE: process.env.CANVAS_CPU_RATE ?? "4",
    CANVAS_TRACE: traced ? "1" : "0",
  };
  const result = await exec(process.execPath, ["scripts/measure-canvas.mjs"], {
    env,
    maxBuffer: 8 * 1024 * 1024,
  });
  await fs.writeFile(
    path.join(output, "measurement.log"),
    result.stdout + result.stderr,
  );
  const folder = path.join(output, "living-canvas");
  if (traced) {
    for (const width of [1440, 390]) {
      const trace = JSON.parse(
        await fs.readFile(path.join(folder, `trace-${width}.json`), "utf8"),
      );
      const profile = JSON.parse(
        await fs.readFile(path.join(folder, `cpu-${width}.cpuprofile`), "utf8"),
      );
      await fs.writeFile(
        path.join(folder, `analysis-${width}.json`),
        JSON.stringify(analyzeCanvasTrace(trace, profile), null, 2),
      );
    }
  }
  return JSON.parse(
    await fs.readFile(
      path.join(
        folder,
        traced ? "performance-traced.json" : "performance.json",
      ),
      "utf8",
    ),
  );
}
try {
  let before = process.env.CANVAS_BASELINE_URL;
  if (!before) {
    try {
      await exec("git", ["cat-file", "-e", baseline]);
    } catch {
      await exec("git", [
        "fetch",
        "--no-tags",
        "--depth=1",
        "origin",
        baseline,
      ]);
    }
    temporary = await fs.mkdtemp(
      path.join(os.tmpdir(), "xuanyi-response-baseline-"),
    );
    const archive = path.join(temporary, "source.tar");
    await exec("git", [
      "archive",
      "--format=tar",
      `--output=${archive}`,
      baseline,
    ]);
    await exec("tar", ["-xf", archive, "-C", temporary]);
    await fs.unlink(archive);
    console.log(
      `Build verified baseline ${baseline.slice(0, 7)} in an isolated temporary directory`,
    );
    let log = await exec("npm", ["ci"], {
      cwd: temporary,
      maxBuffer: 8 * 1024 * 1024,
    });
    await fs.writeFile(
      path.join(directory, "baseline-install.log"),
      log.stdout + log.stderr,
    );
    log = await exec("npm", ["run", "build"], {
      cwd: temporary,
      maxBuffer: 8 * 1024 * 1024,
    });
    await fs.writeFile(
      path.join(directory, "baseline-build.log"),
      log.stdout + log.stderr,
    );
    before = await serve(path.join(temporary, "out"), 4180);
  }
  const after =
    process.env.BROWSER_BASE_URL ?? (await serve(path.resolve("out"), 4181));
  const reports = { before: [], after: [] };
  for (let round = 1; round <= runs; round++) {
    for (const [label, url] of [
      ["before", before],
      ["after", after],
    ]) {
      const result = await measure(label, url, `round-${round}`, false);
      reports[label].push(...result.reports.map((r) => ({ round, ...r })));
    }
  }
  for (const [label, url] of [
    ["before", before],
    ["after", after],
  ])
    await measure(label, url, "profile", true);
  const { stdout } = await exec("git", ["rev-parse", "HEAD"]);
  await fs.writeFile(
    path.join(directory, "comparison.json"),
    JSON.stringify(
      {
        baseline,
        baselineSource: process.env.CANVAS_BASELINE_URL
          ? "Caller-provided baseline URL; caller must verify its revision"
          : "Exact git archive built in isolation",
        sourceCommit: stdout.trim(),
        cpuThrottle: Number(process.env.CANVAS_CPU_RATE ?? 4),
        runs,
        reports,
        note: "Alternating normal runs on one host. Trace overhead excluded. Short local samples, not physical-device results or field INP.",
      },
      null,
      2,
    ),
  );
} finally {
  for (const child of servers) {
    const closed = new Promise((resolve) => child.once("close", resolve));
    child.kill();
    await Promise.race([
      closed,
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
  }
  if (temporary) await fs.rm(temporary, { recursive: true });
}
