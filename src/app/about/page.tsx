import { practice } from "@/data/about";
import Link from "next/link";
import type { Metadata } from "next";
import { AboutArt } from "@/components/about-art";
import { PageIntro, SectionLabel, TextLink } from "@/components/ui";
export const metadata: Metadata = {
  title: "About 关于玄屹",
  description:
    "我是玄屹，围绕 AI 工具、知识影像和可核验的交互叙事，探索设计与工程的连接。",
  alternates: { canonical: "/about/" },
};
export default function About() {
  return (
    <div className="container about-page">
      <div className="about-intro">
        <PageIntro
          label="THE PERSON BEHIND / 你好，很高兴认识你"
          title="Systems"
          italic="& Stories."
          description="我是玄屹，也可以叫我 Xuanyi。这里放着我对 AI 工具、知识影像和交互叙事的具体实践。"
        />
        <AboutArt />
      </div>
      <section className="about-editorial">
        <SectionLabel number="01">A little about me</SectionLabel>
        <div>
          <h2 className="reveal">
            在系统与故事之间，
            <br />
            把一个问题做具体。
          </h2>
          <p>
            我在这里留下的三个例子，看起来很不一样：一个模型路由插件，一部用代码制作的知识短片，一个围绕真实经历展开的交互作品。
          </p>
          <p style={{ marginTop: 20 }}>
            它们反复碰到同一件事：怎样让复杂的判断变得可理解。AI
            工程需要规则、依据和回退；创意编程需要画面、节奏和回看。在这些作品里，设计和工程面对的是同一个问题。
          </p>
          <TextLink href="https://github.com/xuanyi-king" external>
            在 GitHub 看看我的实践
          </TextLink>
        </div>
      </section>
      <section className="about-editorial">
        <SectionLabel number="02">Things I return to</SectionLabel>
        <div>
          <h2 className="reveal">
            从一次选择，
            <br />
            到一幅画面，再到一个问题。
          </h2>
          <div className="practice-list">
            {practice.map((item) => (
              <article key={item.number}>
                <span className="practice-number">{item.number} /</span>
                <div>
                  <p className="eyebrow">{item.project}</p>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="practice-links">
                    <Link href={item.href}>看看这个实践 ↗</Link>
                    <a href={item.source} target="_blank" rel="noreferrer">
                      核对项目记录 ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <div className="about-now">
        <p>想知道这个小角落最近在发生什么？</p>
        <TextLink href="/now">看看我的近况</TextLink>
      </div>
    </div>
  );
}
