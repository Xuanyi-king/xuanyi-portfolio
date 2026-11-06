export type ProjectCategory = "工具与系统" | "创意编程" | "交互体验";
export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProjectCategory;
  tags: string[];
  cover: string;
  color: string;
  github: string;
  year: string;
  intro: string;
  why: string;
  approach: string[];
  outcome: string;
  status: string;
  credit?: string;
};
export const projects: Project[] = [
  {
    slug: "adaptive-router",
    title: "DSH Adaptive Router",
    subtitle: "让每一次思考，找到合适的路径。",
    description:
      "为 DeepSeek Harness 构建的轻量原生插件，让任务、模型与推理档位形成更清楚的连接。",
    category: "工具与系统",
    tags: ["TypeScript", "DSH Plugin", "Zod"],
    cover: "/covers/router.svg",
    color: "mint",
    github: "https://github.com/Xuanyi-king/DSH-Adaptive-Router",
    year: "2026",
    intro:
      "在多个模型之间选择，不应该成为每一次创作的额外负担。Adaptive Router 把任务复杂度、能力需求与会话上下文转化为模型和合法推理档位的选择。",
    why: "自动化需要有边界。比起一味地自动切换，更值得解决的是：如何尊重手动选择、理解延续中的任务，并在信息不足时保留原调用。",
    approach: [
      "使用 DSH 原生模型目录与会话日志，依据用户启用的候选模型进行选择。",
      "把任务分类、上下文检查与实际请求投影分开处理，降低自动决策的不透明感。",
      "在原生设置页提供候选模型配置，并以 Router Lab 支持可选的本地使用记录与导出。",
    ],
    outcome:
      "公开源码包含原生插件、配置界面、测试与验证记录。当前仍是开发版本；线上模型的质量与不同平台的表现，请以仓库记录的实测边界为准。",
    status: "公开源码 · 开发中",
  },
  {
    slug: "knowledge-film",
    title: "Vibe Knowledge Film",
    subtitle: "让抽象的道理，在画面里发生。",
    description:
      "以字幕、程序动画和视觉类比组织知识，把解释变成可以观看的过程。",
    category: "创意编程",
    tags: ["Python", "Canvas", "FFmpeg"],
    cover: "/covers/film.svg",
    color: "apricot",
    github: "https://github.com/Xuanyi-king/vibe-knowledge-film",
    year: "2026",
    intro:
      "知识可以被读到，也可以在运动、对照与因果关系里被看懂。这个项目围绕无旁白知识短片，连接研究、字幕、分镜、程序动画与实际画面验收。",
    why: "抽象概念需要一个合适的形象。工作的重点不是给文字加上装饰，而是找到能把原理演出来的视觉关系，并不断回看画面。",
    approach: [
      "通过可追溯的知识来源组织字幕与分镜，再用程序动画呈现解释。",
      "以 Canvas 确定性动画、FFmpeg 与可选的三维组件完成镜头和声音的制作。",
      "保留可编辑源码、制作过程与验收边界，让输出可以继续修改和复现。",
    ],
    outcome:
      "仓库公开了《地图是一种选择》《先换来速度》等制作实例与源码。作品与引擎的许可各有边界，具体以仓库声明为准。",
    status: "公开源码 · 持续探索",
    credit:
      "基于 HeyChengC/vibe-knowledge-film 优化；原项目与涉及的第三方内容在仓库中保留署名及许可说明。",
  },
  {
    slug: "zhihu-multiverse",
    title: "知乎平行宇宙",
    subtitle: "把别人的经历，变成自己的现实提问。",
    description: "从可核验的真实经历出发，探索另一种知识与交互叙事的连接方式。",
    category: "交互体验",
    tags: ["TypeScript", "React", "AI Workflow"],
    cover: "/covers/zhihu-real.jpg",
    color: "sky",
    github: "https://github.com/Xuanyi-king/zhihu-multiverse",
    year: "2026",
    intro:
      "一个围绕真实人生经历展开的交互作品：从用户正在面对的问题出发，寻找完整、可核验的同路经历，再把它们组织成可以探索的一局。",
    why: "一段泛泛的建议，很难替代真实经历中的细节。这里更关心相似发生在哪里、差异又在哪里，以及哪些问题只能回到现实中验证。",
    approach: [
      "将真实引用与生成内容区分，引用必须能回到原始来源。",
      "在找不到证据时保留空白，让未知保持可见。",
      "把交互结尾导向一个现实中可尝试的小实验，而不是虚构成功率。",
    ],
    outcome:
      "公网体验已下线，完整代码、测试、设计文档与部署脚本保留在公开仓库中，可按仓库说明本地复现。",
    status: "公开源码 · 线上体验已下线",
  },
];
export function filterProjects(category: string, query = "") {
  const q = query.trim().toLocaleLowerCase();
  return projects.filter(
    (p) =>
      (category === "全部" || p.category === category) &&
      (!q ||
        `${p.title} ${p.description} ${p.tags.join(" ")}`
          .toLocaleLowerCase()
          .includes(q)),
  );
}
