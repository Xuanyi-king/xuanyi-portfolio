# 实际验证记录

日期：2026-11-05。工程：`/workspace/sites/xuanyi`。

## 已执行

- Node.js 24.22.1 / npm 11.9.0。
- `npm test`：6 项通过，0 失败。覆盖中文／英文阅读时间、路径穿越拒绝、目录忽略代码块、Markdown 标题与 slug 碰撞、项目分类与文本组合筛选。
- 目录回归先复现了下划线、链接标题与重复锚点错误，再改用正文相同的 HAST / rehype-slug 流程，通过回归。
- `npm run typecheck`：通过。
- `npm run build`：Next.js 16.4.5 生产静态构建通过，所有要求的页面均生成。
- `npm run check:export`：10 个内容路由、所有内部链接与资源、目录目标、代码高亮、Metadata、RSS、Sitemap、404 均检查通过。
- 已实际渲染并查看 X Mark、三幅项目 SVG 封面，确认图形和封面文字完整；这属于资源验收，不是网页截图验收。
- 独立代码审查：已修复目录锚点不一致、移动无 JS 导航、Hero／Lab 指针动画清理、详情 OG 分享图片。复查无阻断问题，独立测试 6/6 与类型检查通过。
- 项目公开状态经 GitHub 连接器读取，独立审查再以公开 API 核对；未使用私有仓库内容。
- haoqi.design 的页面文本与 CSS 公开色板实际访问成功；Codrops 首页返回 HTTP 403。没有复制其素材、布局或动画代码。

## 环境限制与未完成的验收

本会话已发现 managed Sites 预览 CLI，但没有可调用的 Browser `js` / `cua_repl.js` 工具。Sites 工作流规定此时不启动替代浏览器或自建预览通道，因此未执行桌面／手机网页截图、真实点击、滚动流畅度、控制台或 60 FPS 测量。不能将构建与静态检查视为这些验收已通过。

桌面和移动样式、键盘操作、减少动态效果与动画清理均已实现并经过代码审查，但仍需要具备浏览器控制能力的环境完成真实视觉和设备验收。没有提供伪造的网页截图或录屏。

## 内容与使用边界

- Contact 使用已提供的 GitHub 作为真实联系入口，没有编造邮箱。
- Notes 仅包含本次网站制作记录，没有虚构技术文章或统计。
- About 与 Now 没有填入未经确认的学历、经历、奖项或生活信息。
- 项目封面是原创概念表达，详情已标明非界面截图。
- 知乎项目的公网体验已下线；Vibe Knowledge Film 明确保留上游署名。
- 默认 Sites 发布为所有者私有，未擅自改变网站受众。
- 不引入数据库、AI 调用或 WebGL；没有实时拉取 GitHub 数据，内容是可编辑的已核实快照。

## 设计判断

使用 SVG / GSAP 实现曲带与轻量交互，以减少首屏资源和移动端负担；采用原生滚动。X、封面、Token、MDX 与数据源均随代码交付，可继续修改。

## 后续维护

新的文章或项目修改后重新运行测试、构建与导出验证。若更换正式域名，更新 `src/data/site.ts` 中的 `site.url`，并重新构建以更新 canonical、RSS 和 Sitemap。

## 2026-11-06 · XUANYI 2.0 分支验证

本节对应 `feat/curiosity-in-motion`，不覆盖上面的 1.0 历史记录。

- `npm test`：8/8 通过，新增路径端点／输入限幅与弹簧恢复测试。
- `npm run typecheck`：通过。
- `npm run build`：通过，原静态路由、MDX、RSS、SEO 保留。
- `npm run check:export`：10 个内容路由、内链、资源、目录、代码高亮及搜索引擎资源检查通过。
- 独立代码审查发现的筛选卡片隐藏问题已修复并复查通过：卡片 ScrollTrigger 入场只应用首页，Work 筛选列表正文始终可见。
- 全站所有路由产出的 JS 文件合计 795,217 bytes，逐文件 gzip 合计 262,291 bytes；这不是单页首屏下载量，也不是运行性能测试。没有新增 npm 依赖。
- 新增真实项目截图 137,735 bytes，来源为用户自身公开仓库 `Xuanyi-king/zhihu-multiverse/public/screenshots/home.jpg`。它不是本网站的浏览器验收截图。
- 1440×900、768×1024、390×844、375×812：四档真实浏览器验收均未执行。浏览器工具仍不可调用，没有伪造截图／视频。FPS、长任务、真实触摸和跨文档转场实际效果均未验证。
- 技术调研、文件职责与设计取舍详见 `docs/motion-2.md`。PR 保持 Draft，未合并，也未更新生产网站。


## 2026-11-06 · PR #1 质量复审修复验证

对应 `feat/curiosity-in-motion`，在原 PR 分支追加提交，不重写历史、不合并。

### 实际执行的工程检查

- `npm test`：15/15 通过。新增预设切换保持位置与速度、运动中强度变化、运动中重置、减少动态效果立即收敛、取消待执行帧、稳定边界指针限幅、异步加载在偏好变化/卸载后失效等测试。它们是 Node 状态测试，不是浏览器 E2E。
- `npm run typecheck`、`npm run build`、`npm run check:export`、`git diff --check`：全部通过。
- 静态导出仍含 10 个内容路由及 MDX、代码高亮、SEO、RSS、Sitemap、404。额外核验项目链接尾斜杠、原生返回/下一项目链接、转场名唯一性、命名对象为完整场景而非 img、列表/详情图片源一致。
- 独立代码复审覆盖 Hero 网格、LivingX 生命周期、场景复用、异步取消和原生导航回退，未发现新的阻断问题。它不是视觉验收。

### 产物层面的性能证据

以导出首页 HTML 的 `<script src>` 集合为口径，修改前 11 个初始脚本共 735,424 bytes，逐文件 gzip 合计 238,640 bytes；本轮为 9 个脚本共 611,610 bytes，gzip 190,213 bytes。GSAP 核心与 SplitText 所在分块不在该初始脚本集合内。减少动态效果不触发动画模块的动态 import，普通模式仍会按需请求这些分块。

全部路由产出 JS 合计 799,115 bytes，逐文件 gzip 合计 263,576 bytes。拆分主要改变加载时机，并非删除动画代码。这些值不包含字体、CSS、图片或 hydration 内联数据，不是实际网络瀑布、总首屏下载量、LCP、长任务或 FPS 测量。

### 仍未执行的真实浏览器验收

再次检索可用工具，没有 Browser js / cua_repl / 其他可调用浏览器工具。当前 `SITES_MANAGED_LINUX_CONTAINER=1`；Sites 技能明确规定：`If cua_repl.js is unavailable, skip browser QA: do not start a preview server, install a browser, or improvise another browser-control path.` 因此没有启动替代通道，也没有生成网页截图或录屏。

以下项目全部仍为待验收，不能标记通过：

- 1440×900 和 390×844 首页截图；768×1024、375×812 补充布局检查。
- 首屏真实字体换行、X 尺寸与视觉重心、CTA 可见性、触摸误触和键盘焦点。
- 5—15 秒 LivingX 预设/强度/拖放录屏、项目悬停录屏、卡片→详情→返回与浏览器后退录屏。
- Chromium 跨文档转场以及 Safari / Firefox 各实际版本的能力和回退；当前只验证了普通 HTML href 和无 JS 静态内容，不声称浏览器实际连续性通过。
- 真机帧率、长任务与动画流畅度。

已查看的 `public/covers/zhihu-real.jpg` 是项目素材，不是这次 Portfolio 页面验收截图。Hero 构图和封面包装属于待视觉复核的修改，不能据代码认定已达到最终美术质量。PR 保持 Draft，生产网站未更新。
