// Personal biography remains editable, without inventing education, employment or private motivations.
export const personalContext: {
  education: string | null;
  location: string | null;
  story: string | null;
} = { education: null, location: null, story: null };
export const practice = [
  {
    number: "01",
    title: "让系统说明自己的选择。",
    project: "DSH Adaptive Router",
    href: "/work/adaptive-router/",
    source: "https://github.com/Xuanyi-king/DSH-Adaptive-Router",
    text: "模型路由不只有自动选择。候选模型、手动优先、失败回退和本地记录，都需要有清楚的边界。这个插件把这些问题放回原生设置和使用过程里。",
  },
  {
    number: "02",
    title: "让知识在画面里发生。",
    project: "Vibe Knowledge Film",
    href: "/work/knowledge-film/",
    source: "https://github.com/Xuanyi-king/vibe-knowledge-film",
    text: "从一句主题走向字幕、分镜和程序动画，再回看输出的每一帧。基于开源项目继续实践的《地图是一种选择》，用真实地图的变化解释投影的取舍。",
  },
  {
    number: "03",
    title: "让叙事留得住证据。",
    project: "知乎平行宇宙",
    href: "/work/zhihu-multiverse/",
    source: "https://github.com/Xuanyi-king/zhihu-multiverse",
    text: "把亲历者的引用和生成内容分开，标明相似与差异，找不到证据时保留未知。交互的最后，回到一个可以在现实里尝试的小问题。",
  },
];
