import Link from "next/link";
import { Hero } from "@/components/hero";
import { SectionLabel, TextLink } from "@/components/ui";
import { ProjectCard } from "@/components/project-card";
import { AboutArt } from "@/components/about-art";
import { NoteList } from "@/components/note-list";
import { XMark } from "@/components/x-mark";
import { projects } from "@/data/projects";
import { getNotes } from "@/lib/notes";
export default function Home() {
  const notes = getNotes();
  return (
    <>
      <Hero />
      <section className="container intro-section">
        <SectionLabel number="01">A little introduction</SectionLabel>
        <div>
          <h2 className="intro-statement reveal">
            好奇，是一切的起点。
            <br />
            我喜欢把「<span className="serif">如果可以呢</span>」，
            <br className="desktop-only" />
            慢慢变成<span className="accent">「原来真的可以」</span>。
          </h2>
          <div className="intro-description reveal">
            <p>
              在理性与感性之间，在想法与实践之间。
              <br />
              用代码构建，用设计表达，让每一个小小的念头有机会成形。
            </p>
            <TextLink href="/about">认识一下</TextLink>
          </div>
        </div>
      </section>
      <section className="container work-section" id="selected-work">
        <div className="section-heading">
          <div>
            <SectionLabel number="02">Selected work</SectionLabel>
            <h2 className="reveal">
              Made with
              <br />
              <em>curiosity.</em>
            </h2>
          </div>
          <p className="small-copy">
            一些想法的落地，
            <br />
            也是下一次探索的开始。
          </p>
        </div>
        <div className="project-grid home-projects">
          {projects.map((p, i) => (
            <ProjectCard project={p} index={i} key={p.slug} />
          ))}
        </div>
        <div className="work-end">
          <p>从工具到影像，每一个项目都是一种提问。</p>
          <TextLink href="/work">
            所有作品 <sup>({projects.length.toString().padStart(2, "0")})</sup>
          </TextLink>
        </div>
      </section>
      <section className="about-preview">
        <div className="container">
          <AboutArt />
          <div className="about-text">
            <SectionLabel number="03">The person behind</SectionLabel>
            <h2 className="reveal">
              A little logic.
              <br />
              <em>A little wonder.</em>
            </h2>
            <p className="reveal">
              你好，我是玄屹。我把对模型选择的疑问做成插件，用程序动画解释地图的取舍，也尝试让真实经历成为可探索的故事。设计和工程，在这些具体的问题里相遇。
            </p>
            <TextLink href="/about">关于我，和我的好奇心</TextLink>
          </div>
        </div>
      </section>
      <section className="container notes-section">
        <div className="section-heading">
          <div>
            <SectionLabel number="04">Notes along the way</SectionLabel>
            <h2 className="reveal">
              Thinking <em>out loud.</em>
            </h2>
          </div>
          <TextLink href="/notes">所有手记</TextLink>
        </div>
        <NoteList notes={notes.slice(0, 2)} />
      </section>
      <section className="container lab-preview">
        <div>
          <SectionLabel number="05">A place to play</SectionLabel>
          <h2 className="reveal">
            Small experiments.
            <br />
            <em>Open possibilities.</em>
          </h2>
          <p>
            暂时放下「有什么用」。
            <br />
            这里留给那些好玩的、还没被定义的小实验。
          </p>
          <TextLink href="/lab">推开实验室的门</TextLink>
        </div>
        <Link
          className="lab-art"
          href="/lab"
          aria-label="进入 X Playground 互动实验"
        >
          <XMark />
          <span className="lab-tiny">EXPERIMENT NO. 001 / X PLAYGROUND</span>
        </Link>
      </section>
    </>
  );
}
