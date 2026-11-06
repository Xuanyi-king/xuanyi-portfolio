import Image from "next/image";
import type { Project } from "@/data/projects";
import { ProjectPreview } from "./project-preview";
import { ProjectFilmPreview } from "./project-media";
// The full visible scene participates in the transition, including preview media.
export function ProjectScene({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const real = project.slug === "zhihu-multiverse";
  return (
    <div
      className={`project-scene ${real ? "scene-observatory" : "scene-concept"}`}
      style={{ viewTransitionName: `cover-${project.slug}` }}
      data-project={project.slug}
    >
      {real && (
        <div className="scene-caption" aria-hidden="true">
          <span>知乎平行宇宙</span>
          <span>真实界面 / ARCHIVE</span>
        </div>
      )}
      <div className="scene-image">
        <Image
          src={project.cover}
          alt={`${project.title} ${real ? "公开项目首页截图" : "原创概念封面，非产品界面"}`}
          width={real ? 1440 : 1200}
          height={900}
          priority={priority}
          sizes={
            priority
              ? "(max-width: 760px) 100vw, 90vw"
              : "(max-width: 760px) 100vw, 50vw"
          }
        />
        {real && (
          <Image
            className="multiverse-reveal"
            src="/projects/multiverse-experience-reveal.jpg"
            alt="知乎平行宇宙：公开仓库中的体验揭示界面"
            width={1440}
            height={900}
            sizes="(max-width: 760px) 100vw, 50vw"
          />
        )}
        {!real && <ProjectPreview slug={project.slug} />}
      </div>
      {project.visual && (
        <div className={`real-project-media media-${project.slug}`}>
          <div className="media-topline">
            <span>
              {project.slug === "knowledge-film"
                ? "VIBE KNOWLEDGE FILM"
                : "DSH ADAPTIVE ROUTER"}
            </span>
            <span>
              {project.slug === "knowledge-film"
                ? "真实成片节选"
                : "真实设置页 · 局部"}
            </span>
          </div>
          <div className="media-window">
            <Image
              src={
                project.slug === "knowledge-film"
                  ? "/projects/atlas-preview.jpg"
                  : project.visual.src
              }
              alt={
                project.slug === "knowledge-film"
                  ? "真实节选起始帧 · 原成片第 8 秒"
                  : project.visual.title
              }
              width={project.visual.width}
              height={project.visual.height}
              sizes="(max-width: 760px) 100vw, 60vw"
            />
            {project.slug === "knowledge-film" && <ProjectFilmPreview />}
          </div>
          <p className="media-caption">
            {project.slug === "knowledge-film"
              ? "地图是一种选择。 / ATLAS"
              : "智能路由 · 模式与候选模型"}
          </p>
        </div>
      )}
      {real && <span className="observatory-line" aria-hidden="true" />}
      {!real && (
        <span className="scene-kind">
          概念封面<span> ↗ 悬停 / 聚焦查看真实作品</span>
        </span>
      )}
    </div>
  );
}
