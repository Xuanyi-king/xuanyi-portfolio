import { ProjectCaseStudy } from "@/components/project-case-study";
import type { Metadata } from "next";
import { ProjectScene } from "@/components/project-scene";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { BackLink, SectionLabel, TextLink } from "@/components/ui";
export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/work/${slug}/` },
    openGraph: {
      title: p.title,
      description: p.description,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "XUANYI · " + p.title,
        },
      ],
    },
  };
}
export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  return (
    <article className="container project-detail">
      <BackLink href="/work/">回到所有作品</BackLink>
      <header className="project-detail-heading">
        <p className="eyebrow reveal">
          {project.category} / {project.year}
        </p>
        <h1 className="reveal">{project.title}</h1>
        <p className="reveal">{project.subtitle}</p>
        <div className="project-detail-meta">
          <ul className="tags" aria-label="技术栈">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <TextLink href={project.github} external>
            在 GitHub 查看源码
          </TextLink>
        </div>
      </header>
      <div className="detail-cover reveal">
        <ProjectScene project={project} priority />
      </div>
      <p className="cover-caption">
        {project.slug === "zhihu-multiverse"
          ? "项目真实截图 · 来源：Xuanyi-king/zhihu-multiverse/public/screenshots/home.jpg"
          : "项目真实材料预览 · 列表保留原创概念封面，悬停或聚焦可查看真实作品"}
      </p>
      <ProjectCaseStudy project={project} />
      <div className="project-body">
        <aside className="project-sidebar">
          <SectionLabel number={(index + 1).toString().padStart(2, "0")}>
            Behind the project
          </SectionLabel>
          <p>{project.status}</p>
          <TextLink href={project.github} external>
            探索项目源码
          </TextLink>
        </aside>
        <div className="project-copy">
          <section>
            <h2>一个什么样的项目？</h2>
            <p>{project.intro}</p>
          </section>
          <section>
            <h2>从一个问题出发。</h2>
            <p>{project.why}</p>
          </section>
          <section>
            <h2>把想法，慢慢做具体。</h2>
            <ol>
              {project.approach.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>
          <section>
            <h2>现在，走到了这里。</h2>
            <p>{project.outcome}</p>
            {project.credit && <p className="credit">{project.credit}</p>}
            <TextLink href={project.github} external>
              查看源码与项目说明
            </TextLink>
          </section>
        </div>
      </div>
      <a className="next-project" href={`/work/${next.slug}/`}>
        <p>NEXT EXPLORATION</p>
        <h2>{next.title}</h2>
        <ArrowUpRight />
      </a>
    </article>
  );
}
