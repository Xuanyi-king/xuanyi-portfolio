import type { Metadata } from "next";
import { AboutArt } from "@/components/about-art";
import { PageIntro, SectionLabel, TextLink } from "@/components/ui";
export const metadata: Metadata = {
  title: "About 关于玄屹",
  description: "你好，我是玄屹。在代码、设计与创作之间保持好奇。",
  alternates: { canonical: "/about/" },
};
export default function About() {
  return (
    <div className="container about-page">
      <div className="about-intro">
        <PageIntro
          label="THE PERSON BEHIND / 你好，很高兴认识你"
          title="A curious"
          italic="human"
          description="我是玄屹，也可以叫我 Xuanyi。喜欢问一句「为什么」，也喜欢接着试一试「如果这样呢」。"
        />
        <AboutArt />
      </div>
      <section className="about-editorial">
        <SectionLabel number="01">A little about me</SectionLabel>
        <div>
          <h2 className="reveal">
            比起给自己一个定义，
            <br />
            更想留住探索的可能。
          </h2>
          <p>
            我对代码、设计与它们交会的地方充满兴趣。一个想法如何变成工具，一段知识如何被画面讲清楚，一次交互如何让复杂的事情变得自然——这些都是值得认真琢磨的问题。
          </p>
          <p style={{ marginTop: 20 }}>
            喜欢从具体的问题出发，先做出一点东西，再观察、修改，慢慢靠近心里的样子。这里展示的作品，也是这些实践留下的痕迹。
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
            理性一点。感性一点。
            <br />
            对细节，再耐心一点。
          </h2>
          <div className="interests">
            {[
              {
                n: "01",
                title: "让工具顺手",
                text: "关注真实的使用过程，让系统的规则与边界更清晰。",
              },
              {
                n: "02",
                title: "让想法可见",
                text: "用图形、代码与运动，把抽象的东西变得直观。",
              },
              {
                n: "03",
                title: "让作品生长",
                text: "保留过程，持续迭代，也给未完成的想法一点时间。",
              },
            ].map((i) => (
              <div className="reveal" key={i.n}>
                <small>{i.n} /</small>
                <h3>{i.title}</h3>
                <p>{i.text}</p>
              </div>
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
