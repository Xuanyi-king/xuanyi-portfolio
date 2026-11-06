"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { filterProjects } from "@/data/projects";
import { ProjectCard } from "./project-card";
const categories = ["全部", "工具与系统", "创意编程", "交互体验"];
export function WorkExplorer() {
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const visible = filterProjects(category, query);
  return (
    <>
      <div className="work-toolbar">
        <div
          className="filter-buttons"
          role="group"
          aria-label="按作品类型筛选"
        >
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={c === category}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="project-search">
          <Search size={15} />
          <span className="sr-only">搜索项目标题、介绍和技术栈</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="寻找一个项目…"
          />
        </label>
      </div>
      <p className="results-count" role="status" aria-live="polite">
        {visible.length.toString().padStart(2, "0")} PROJECTS ·{" "}
        {category === "全部" ? "保持开放，继续探索。" : category}
      </p>
      {visible.length ? (
        <div className="project-grid all-projects">
          {visible.map((p, i) => (
            <ProjectCard project={p} index={i} key={p.slug} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>这里还没有对应的作品。</h2>
          <p>换个关键词，或者重新看看全部。</p>
          <button
            className="pill-button"
            onClick={() => {
              setQuery("");
              setCategory("全部");
            }}
          >
            查看全部作品 ↗
          </button>
        </div>
      )}
    </>
  );
}
