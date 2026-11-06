import Image from "next/image";
import type { Project } from "@/data/projects";
import { ProjectPreview } from "./project-preview";

// The complete, visible scene is shared by list and detail. Never name a hidden backing image.
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
    >
      {real && (
        <div className="scene-caption" aria-hidden="true">
          <span>THE SILVER OBSERVATORY</span>
          <span>项目实录 / 01</span>
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
        {!real && <ProjectPreview slug={project.slug} />}
      </div>
      {real && <span className="observatory-line" aria-hidden="true" />}
    </div>
  );
}
