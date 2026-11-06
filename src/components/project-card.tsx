import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <article className={`project-card reveal ${project.color}`}>
      <Link
        href={`/work/${project.slug}`}
        className="project-cover"
        aria-label={`查看 ${project.title} 项目详情`}
      >
        <div className="cover-inner">
          <Image
            src={project.cover}
            alt={`${project.title} 原创概念封面`}
            width={1200}
            height={900}
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        </div>
        <span className="cover-index">0{index + 1} / SELECTED PROJECT</span>
        <span className="peek-label">
          Explore project
          <ArrowUpRight size={19} />
        </span>
        <span className="cover-corner">
          <ArrowUpRight strokeWidth={1.2} />
        </span>
      </Link>
      <div className="project-meta">
        <p>
          {project.category}
          <span>{project.year}</span>
        </p>
        <Link href={`/work/${project.slug}`}>
          <h3>{project.title}</h3>
          <ArrowUpRight size={22} />
        </Link>
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
