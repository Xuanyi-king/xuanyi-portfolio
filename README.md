# XUANYI · 好奇的形状

玄屹的个人品牌网站。原创 SVG X Mark、轻盈编辑式版面、真实公开作品、MDX 手记与交互实验室。Next.js 16 / React 19 / TypeScript / GSAP，纯静态发布，无需数据库。

## 本地运行

需要 Node.js 22+（实际构建环境：24.22.1）。

```bash
npm ci
npm run dev
```

打开 http://localhost:3000 。开发服务器可热更新。

```bash
npm test             # 内容与筛选逻辑
npm run typecheck    # TypeScript
npm run build        # 生产构建，输出 out/
npm run check:export # 检查生成页面、内链、目录、SEO 与资源
npm run start        # 在 3000 端口预览生产静态文件
```

## 页面

`/` 首页 · `/work` 作品筛选与搜索 · `/work/[slug]` 项目详情 · `/notes` 手记 · `/notes/[slug]` MDX 阅读页 · `/about` 关于 · `/lab` X Playground · `/now` 近况。另有 RSS、Sitemap、Robots、真实 404 页面。

## 修改内容

- `src/data/projects.ts`：项目标题、介绍、技术栈、源码地址、详情与状态。新增项目会自动生成详情路由。
- `src/content/notes/*.mdx`：文章。Frontmatter 必须提供字符串 `title`、`description`、`date`（YYYY-MM-DD）、`category`。文章文件名使用小写英文与连字符。
- `src/data/site.ts`：站点地址、GitHub、近况。换域名时必须更新 `site.url` 并重新构建。
- `src/app/about/page.tsx`：关于页正文。不预填未经确认的履历。
- `src/app/tokens.css`：配色、字体、布局、圆角与缓动 Token。
- `src/lib/motion.ts`：主要动效参数。

MDX 自动生成文章目录、中文／英文混合阅读时间、代码高亮、SEO 与 RSS。示例：

```mdx
---
title: "一篇真实的制作记录"
description: "文章的简短介绍。"
date: "2026-11-05"
category: "制作手记"
---

## 第一个想法

从真实的过程开始记录。
```

仅编译仓库中可信的本地 MDX，不接收访客提交的 MDX。页面内容无数据库依赖，修改后重新构建即可更新。

## 设计资源与动效

- `public/brand/x-mark.svg`：独立矢量标识，可任意缩放；`src/components/x-mark.tsx` 为带高光的内联版本。
- `src/app/icon.svg`：小尺寸专用 Favicon。
- `public/covers/`：三幅原创项目概念封面，详情中已明确非真实界面截图。
- `public/og.png` 与 `public/og.svg`：社交分享图及矢量源文件。
- `public/fonts/`：自托管 Manrope 字体及 SIL OFL 许可。中文使用系统中文字体。

导航与文章内容直接输出 HTML，无强制片头。GSAP 负责时间轴、滚动揭示与轻量指针回应；实验室支持调色、双曲线拖动与方向键操作、形态预设、力度调节和弹簧恢复。支持系统减少动态效果，移动端重新排版，保留原生滚动与键盘焦点。无 WebGL、音效、跟随光圈或持续粒子系统。

## 部署

这是标准 Next.js 静态导出工程。任何支持静态文件和目录索引的主机均可发布 `out/`，包括 Cloudflare Pages、Netlify、Vercel 和普通 Nginx。

- 构建命令：`npm ci && npm run build`
- 发布目录：`out`
- 保留目录索引，`/work/` 映射到 `work/index.html`。
- 未知路径应返回 `404.html`，HTTP 状态为 404；不要把全部路径重写为首页。
- 安全响应头可设置 `X-Content-Type-Options: nosniff`、`Referrer-Policy: strict-origin-when-cross-origin`；缓存策略建议 HTML 短缓存、`/_next/static/` 长缓存。
- 本工程的 `.openai/hosting.json` 记录本次 Sites 项目身份和静态发布目录。迁移到其他主机无需该文件；不要把同一项目 ID 用于另一个新 Sites。

本站无需 API Key、环境变量或服务器运行时。默认 Sites 发布保留所有者私有访问；公开分享需要在 Sites 中设置访问权限。

## 来源与边界

仅展示已经确认公开的 DSH-Adaptive-Router、vibe-knowledge-film、zhihu-multiverse。详情文案依照仓库 README 整理，保留 Vibe Knowledge Film 的上游署名，并注明知乎项目线上体验已下线。没有公开用户未授权的私有仓库内容。

设计研究实际读取了 [haoqi.design](https://haoqi.design/) 的页面文本与样式色板；当前环境未提供浏览器控制工具，未声称观察其真实交互。Codrops 首页请求返回 403。本站未复制参考站的布局、素材或动画代码，也未引入参考仓库代码。

实际验证范围与环境限制见 [docs/verification.md](docs/verification.md)。

## 工程结构

```text
.openai/hosting.json        Sites 发布配置
public/
  brand/x-mark.svg         原创独立 X Mark
  covers/                  原创 SVG 项目封面
  fonts/                   Manrope 字体与许可
  og.svg / og.png           分享图源文件与栅格输出
scripts/check-export.mjs   生产导出完整性验证
src/
  app/
    page.tsx               首页
    layout.tsx             全局导航、页脚与 SEO
    globals.css            响应式与交互样式
    tokens.css             设计 Token
    work/[slug]/           作品与详情
    notes/[slug]/          手记与 MDX 阅读页
    about/ lab/ now/       关于、实验室、近况
    rss.xml/               RSS 构建路由
    sitemap.ts robots.ts   搜索引擎资源
    icon.svg               Favicon
    not-found.tsx          404
    error.tsx              运行异常恢复
  components/              导航、SVG、动效与页面组件
  content/notes/           可编辑 MDX 内容
  data/                    可编辑站点和作品数据
  lib/                     内容加载、阅读时间与动画参数
tests/                     内容与筛选测试
docs/                      计划和实际验证记录
```

## XUANYI 2.0 动效分支

实现与调研见 [docs/motion-2.md](docs/motion-2.md)，最新实际检查与限制见 [docs/verification.md](docs/verification.md)。真实浏览器证据保存在 [docs/evidence/pr1-review](docs/evidence/pr1-review)，项目素材来源见 [docs/project-visual-sources.md](docs/project-visual-sources.md)。

本地复现浏览器验收：

```bash
npm ci
npm run build
npx playwright install chromium
npm run check:browser
```

检查脚本自行启动静态导出服务，输出截图、WebM 和 results.json；首次安装浏览器时需满足 Playwright 系统依赖（Linux CI 使用 `npx playwright install --with-deps chromium`）。使用系统 Chromium 时设置 `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`，并运行 `npx playwright install ffmpeg` 安装录屏依赖。输出目录可用 `BROWSER_EVIDENCE_DIR` 指定，外部服务可用 `BROWSER_BASE_URL` 指定。

GitHub Actions 执行安装、测试、类型、构建、导出检查和 Chromium 浏览器验收；每次运行的截图与录像保存为 `browser-evidence` artifact。

## XUANYI 2.1 美术方向

2.1 从 PR #1 最新 2.0 提交继续开发，保留工程与内容能力。正式视觉为 Editorial Flow + Silk X；浏览器中实际比较了两套 Hero 与三种 SVG 材质，备选只保留为审查证据。

- [设计与取舍](docs/visual-2-1.md)
- [真实截图、录屏与原型对比](docs/evidence/visual-2-1/README.md)
- [项目素材来源](docs/project-visual-sources.md)
- `src/app/tokens.css`：全局色彩、字体与尺寸；`identity.css`：正式版视觉；`src/data/about.ts`：真实项目线索与待补充个人字段。
- `npm run check:browser` 默认输出到 `docs/evidence/visual-2-1/final`；CI 仍使用独立 artifact 目录。
