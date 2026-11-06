"use client";
import { useEffect, useRef } from "react";
import { watchMotionPreference } from "@/motion/preference";
import { ProjectScene } from "./project-scene";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const card = ref.current;
    const media = matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    return watchMotionPreference(media, async () => {
      const { cardPointer } = await import("@/motion/pointer");
      return () => (card ? cardPointer(card) : () => {});
    });
  }, []);
  return (
    <article ref={ref} className={`project-card reveal ${project.color}`}>
      <a
        href={`/work/${project.slug}/`}
        className="project-cover"
        aria-label={`查看 ${project.title} 项目详情`}
      >
        <div className="cover-depth">
          <div className="cover-inner">
            <ProjectScene project={project} />
          </div>
        </div>
        <span className="peek-label">
          Explore project
          <ArrowUpRight size={19} />
        </span>
        <span className="cover-corner">
          <ArrowUpRight strokeWidth={1.2} />
        </span>
      </a>
      <div className="project-meta">
        <p>
          <span className="project-category">
            <span className="project-number">0{index + 1} /</span>{" "}
            {project.category}
          </span>
          <span>{project.year}</span>
        </p>
        <a href={`/work/${project.slug}/`}>
          <h3>{project.title}</h3>
          <ArrowUpRight size={22} />
        </a>
        <p className="project-description">{project.description}</p>
        <ul className="tags" aria-label="技术栈">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}
