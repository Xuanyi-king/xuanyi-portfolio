import Image from "next/image";
import type { Project } from "@/data/projects";
const filmSource =
  "https://github.com/Xuanyi-king/vibe-knowledge-film/blob/fa4749548d868a43bd22c9b24ff7a8ae89fdbb5d/evidence/atlas/final.mp4";
const multiverseSource =
  "https://github.com/Xuanyi-king/zhihu-multiverse/blob/290134821dceb9a41d41925f0b8c0f469d95b211/public/screenshots/";
export function ProjectCaseStudy({ project }: { project: Project }) {
  if (project.slug === "adaptive-router" && project.visual)
    return (
      <section
        className="project-evidence case-router"
        aria-label="可核验的项目视觉材料"
      >
        <div className="case-intro">
          <p className="eyebrow">INSIDE THE SYSTEM / 真实设置页</p>
          <h2>
            选择，解释，
            <br />
            <em>保留余地。</em>
          </h2>
          <p>
            界面把路由规则放回使用过程里。候选模型能被看见，手动选择有优先级，信息不足时保留原调用。
          </p>
          <ol className="case-principles">
            <li>
              <span>01</span>只在启用的候选模型之间选择
            </li>
            <li>
              <span>02</span>把配置、状态与原因分开表达
            </li>
            <li>
              <span>03</span>记录本地元数据，保留验证边界
            </li>
          </ol>
        </div>
        <figure>
          <a href={project.visual.src} target="_blank" rel="noreferrer">
            <Image
              src={project.visual.src}
              alt={project.visual.title}
              width={1440}
              height={1800}
              sizes="(max-width:760px) 100vw, 65vw"
            />
          </a>
          <figcaption>
            <span>原仓库 s43 离线验证截图，非线上效果证明。</span>
            <a href={project.visual.source} target="_blank" rel="noreferrer">
              核对来源 ↗
            </a>
          </figcaption>
        </figure>
      </section>
    );
  if (project.slug === "knowledge-film")
    return (
      <section
        className="project-evidence case-film"
        aria-label="可核验的项目视觉材料"
      >
        <div className="case-intro">
          <p className="eyebrow">A FILM MADE WITH CODE / 真实成片</p>
          <h2>
            从球面，
            <br />
            <em>到一张纸。</em>
          </h2>
          <p>
            《地图是一种选择》让投影的取舍发生在画面里。下面是同一部成片的真实节选与三个时刻；素材与上游署名保留在公开仓库。
          </p>
        </div>
        <figure className="case-film-player">
          <video
            controls
            playsInline
            preload="none"
            poster="/projects/atlas-frame.jpg"
            aria-label="地图是一种选择，成片第8至16秒节选"
          >
            <source src="/projects/atlas-excerpt.webm" type="video/webm" />
          </video>
          <figcaption>
            <span>成片节选 · 00:08—00:16 · 静音预览</span>
            <a href={filmSource} target="_blank" rel="noreferrer">
              完整成片与来源 ↗
            </a>
          </figcaption>
        </figure>
        <div className="film-sequence">
          {[
            ["atlas-sphere.jpg", "00:03", "先从真实球面出发。"],
            ["atlas-scale.jpg", "00:26", "把局部尺度摆在眼前。"],
            ["atlas-area.jpg", "00:49", "换一种投影，也换一种取舍。"],
          ].map(([src, time, caption]) => (
            <figure key={src}>
              <a href={`/projects/${src}`} target="_blank" rel="noreferrer">
                <Image
                  src={`/projects/${src}`}
                  alt={caption}
                  width={1920}
                  height={1080}
                  sizes="(max-width:760px) 100vw, 33vw"
                />
              </a>
              <figcaption>
                <span>{time}</span>
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  if (project.slug !== "zhihu-multiverse") return null;
  return (
    <section
      className="project-evidence case-story"
      aria-label="可核验的项目视觉材料"
    >
      <div className="case-intro">
        <p className="eyebrow">AN INTERACTION ARCHIVE / 真实界面记录</p>
        <h2>
          先留下来源，
          <br />
          <em>再让故事发生。</em>
        </h2>
        <p>
          公开体验已经下线，作品的界面与实现仍可回看。这两张原仓库截图分别记录经历揭示与推演第一幕，不冒充完整终局或当前在线运行。
        </p>
      </div>
      <div className="story-sequence">
        {[
          ["experience-reveal", "经历揭示 · 逐段读真实经历"],
          ["play-act1", "推演第一幕 · 走进具体处境"],
        ].map(([src, caption], i) => (
          <figure key={src}>
            <a
              href={`/projects/multiverse-${src}.jpg`}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={`/projects/multiverse-${src}.jpg`}
                alt={caption}
                width={1440}
                height={900}
                sizes="(max-width:760px) 100vw, 50vw"
              />
            </a>
            <figcaption>
              <span>
                0{i + 1} / {caption}
              </span>
              <a
                href={`${multiverseSource}${src}.jpg`}
                target="_blank"
                rel="noreferrer"
              >
                核对原图 ↗
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
