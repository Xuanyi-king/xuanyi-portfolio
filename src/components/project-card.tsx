"use client";
import { useEffect, useRef } from "react";
import { cardPointer } from "@/motion/pointer";
import { ProjectPreview } from "./project-preview";
import Image from "next/image";

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
    if (ref.current) return cardPointer(ref.current);
  }, []);
  return (
    <article ref={ref} className={`project-card reveal ${project.color}`}>
      <a
        href={`/work/${project.slug}`}
        className="project-cover"
        aria-label={`查看 ${project.title} 项目详情`}
      >
        <div className="cover-depth">
          <div className="cover-inner">
            <Image
              style={{ viewTransitionName: `cover-${project.slug}` }}
              src={project.cover}
              alt={`${project.title} ${project.slug === "zhihu-multiverse" ? "公开项目首页截图" : "原创概念封面"}`}
              width={1200}
              height={900}
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          </div>
          {project.slug !== "zhihu-multiverse" && (
            <ProjectPreview slug={project.slug} />
          )}
        </div>
        <span className="cover-index">0{index + 1} / SELECTED PROJECT</span>
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
          {project.category}
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
