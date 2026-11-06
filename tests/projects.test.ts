import test from "node:test";
import assert from "node:assert/strict";
import { projects, filterProjects } from "../src/data/projects";
test("category and text filters combine and empty searches recover all projects", () => {
  assert.equal(filterProjects("创意编程").length, 1);
  assert.equal(filterProjects("全部", " canvas ")[0]?.slug, "knowledge-film");
  assert.equal(filterProjects("工具与系统", "canvas").length, 0);
  assert.equal(filterProjects("全部", "   ").length, projects.length);
  assert.equal(filterProjects("全部", "unknown1234").length, 0);
});
test("project slugs and public source links are unique", () => {
  assert.equal(new Set(projects.map((p) => p.slug)).size, projects.length);
  assert.ok(
    projects.every((p) =>
      p.github.startsWith("https://github.com/Xuanyi-king/"),
    ),
  );
});
