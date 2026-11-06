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


## 2026-11-06 · PR #1 真实浏览器验收与交互复审

本节更新当前状态；前文“浏览器不可用”是之前各轮的历史记录。本轮用户明确要求使用 Playwright；探测发现已安装系统 Chromium 和 Playwright，实际启动成功，随后使用项目锁定的 Playwright 1.58.2 与配套 Chromium 145 完成验收。没有用生成图替代页面证据。

- 安装与工程检查：`npm ci`、`npm test`（21/21）、`npm run typecheck`、`npm run build`、`npm run check:export` 通过。Next 静态路由、MDX、SEO、RSS 保留。
- `npm run check:browser`：10 组场景通过，捕获页面异常 0。具体项目与浏览器版本记录于 [results.json](evidence/pr1-review/after/results.json)。
- 1440×900、390×844、375×812、320×740：实际浏览器打开并截图，无横向溢出。鼠标使 Hero 双曲线实际形变，手机标语稳定两行；键盘焦点有截图。
- Lab：实际鼠标拖动、触摸拖动/取消，手柄中心到独立解析的 SVG 曲线锚点误差小于 1px；测试范围内手柄位移对应指针位移。几何有界，超出边界后不会无限跟随。方向键累加、Esc、预设、重置均通过实际操作；鼠标录屏保留。触摸为 Chromium 移动模拟与 CDP 输入，不是真机测量。
- 代码复审另发现并修正“回弹途中再次抓住跳回预设”和“力度滑杆被跟手映射抵消”：前者锁定当前值，后者现在实际调节弹簧回弹速度。均有独立状态测试。
- SplitText：实际通过 SPA 导航离开/回到首页三次，离开后旧标题的 innerHTML 与原始静态 HTML 完全一致，返回后节点数量没有递增。减少动态效果时无 SplitText 包装。显式 restore 会撤销自身 tween/ScrollTrigger 并 revert，外层 GSAP context 随页面清理。
- 慢加载：对所有 JS chunk 加 1500ms 延迟，采样已显示标题，没有再移入遮罩隐藏。以首个内容绘制后的时间选择完整入场或仅图形 settle，替换以加载开始计时的 800ms 全跳过策略。
- 项目：实际悬停、进入详情、浏览器后退、显式返回列表；真实素材区域有截图。普通原生链接在禁用 JS 时也实际进入详情并返回。无脚本不启用跨文档转场；减少动态效果也关闭该转场。
- GitHub Actions 配置执行用户要求的五条命令，另安装匹配 Chromium、运行浏览器检查并上传 `browser-evidence` artifact。远程运行状态以 GitHub Actions 为准，不能拿本地命令替代远程结果。

### 实际证据与独立视觉审查

[证据索引](evidence/pr1-review/README.md)包含桌面、手机、窄屏、Lab、悬停与详情截图，三段 WebM 为运行页面的 Playwright 录屏，不是概念动画。

独立审查者实际查看 before/after 截图后确认：新版手机标语与 X 分组稳定，四档宽度未见拥挤或溢出；桌面标题、标语、X 主次清晰；真实影片帧提高项目可信度。无需继续增加装饰或重排 Hero。提出的悬停 pill 压住封面文字、箭头重复问题已修复：去掉图片上的按钮覆盖，保留封面与项目标题入口。另移除 Hero 手绘线和薄荷点，减少视觉噪声。

### 验证边界

没有实际运行 Firefox、Safari / iOS WebKit 或 Android/iPhone 真机。无 JS 的原生回退已验证，但不等同这些浏览器的完整转场验收。没有测量 FPS、LCP、长任务或移动真机性能；录屏显示的是本次环境的实际操作，不是性能基准。未重新运行上游 Router / Film 项目，详情材料来源和许可见 [project-visual-sources.md](project-visual-sources.md)。PR 保留 Draft，未合并、未部署生产。

## 2026-11-06 · XUANYI 2.1

基于未合并 PR #1 的 `471805f`；2.1 使用独立功能分支，保留前述修复。

- 已执行 `npm ci`、`npm test`（21 项）、`npm run typecheck`、`npm run build`、`npm run check:export`。静态 10 个内容路由、MDX/代码高亮、SEO、RSS/Sitemap、404 和内链保留。
- 实际 Playwright Chromium 145 检查 12 组场景，0 页面异常，包含 1440×900、768×1024、390×844、375×812、320×740；同会话稳定帧对照；不提前加载视频；键盘影片预览；触摸捕获；详情/返回；SplitText 三次恢复；1500ms 延迟 JS；减少动态效果；无 JS CSS 曲线入场与原生链接；重复访问安静状态。
- 独立审查通过实际看图选择 Editorial Flow + Silk，修正小图标对比度和平板孤字。发现的视频播放请求竞态已用失败断言复现，再用独立 hover/focus 与幂等 play 修正；强度检查从“时间>0”提高为“未暂停且时间持续增长”。
- 真正页面 PNG、5 段 UI WebM、材质比较 WebM、两个真实 Hero 原型与结构化结果见 [visual-2-1](evidence/visual-2-1/README.md)。不是生图，不把项目成片当网站录屏。
- 源图片、影片帧和节选的固定版本、MIT 与第三方边界见 [素材记录](project-visual-sources.md)。没有重新运行上游三个项目或编造个人背景。
- 未实测 Safari/Firefox、iOS/Android 真机、FPS/LCP/长任务。CSS path 不支持时保持完整静态 X；不把 Chromium 模拟作为其他浏览器或真机证明。审美结论来自独立观察，不来自自动化指标。


2.1 性能产物口径：首页 HTML 初始 script 集合 10 个文件，共 615,550 bytes，逐文件 gzip 191,801 bytes；2.0 对应为 611,610 / 190,213 bytes。本轮初始脚本 gzip 约增加 1.6 KB，保留 GSAP/SplitText 按需加载。影片节选 107,633 bytes，首次明确预览才请求。以上不包括 CSS、字体、图片和内联 hydration 数据，不是完整首屏下载量或实测帧率。

## 2026-11-06 · PR #2 Final Polish

从 `9287b16` 在同一 PR 分支继续，保留 Editorial Flow + Silk。此前的“未验证 Firefox/WebKit”是历史状态，本节更新为实际运行结果。

- 执行 `npm ci`、`npm test`（24/24，保留原 21 项并新增 3 项曲线控制权回归）、`npm run typecheck`、`npm run build`、`npm run check:export`。10 个内容路由与 SEO、MDX、高亮、RSS、Sitemap 保留。
- `npm run check:browser`：原 Chromium 12 组，新增 Chromium / Firefox / WebKit 各 7 组，0 页面异常。真实 1440×900 / 390×844 / 320×740 三引擎图；768×1024 / 375×812、模拟触摸、三次 SplitText 恢复、1500ms 迟 JS、无 JS、稳定相邻帧的原回归保留。
- 实际逐帧检查 CSS/JS 路径交接，Chromium 与 Firefox 0 次争抢写入，交接帧控制点差值 0。早进入、移出、重复访问和偏好变化有回归。WebKit 26 不支持当前 CSS path，静态入场和 JS 交互正常。Firefox 跨文档转场能力检测为 false，实际原生进入/后退/显式返回正常。
- 真实影片请求、时间推进、暂停、快速 hover 出入、键盘焦点和减少动态效果均通过三引擎实测。WebKit 媒体偏好事件异步到达，测试等待实际暂停状态，不把同一帧的事件时序当作已停止。
- 独立图面审查实际查看最终三引擎桌面/390/320 共九张图，确认 320 细线及字体回退问题已修正，没有剩余阻塞问题。审美结论不来自 CI。
- [最新证据](evidence/visual-2-1/polish/README.md)保留少量 JPEG；本轮完整 PNG/WebM/审计 JSON 写入忽略的 artifacts/browser，CI 上传 browser-evidence（14 天），没有新增视频到 Git，也没有覆盖旧图。

性能范围：首页 10 个初始 script 共 617,092 bytes，逐文件 gzip 193,251 bytes，比精修前增加 1,450 gzip bytes。新增正常/斜体本地字体合计 55,456 bytes，保留原字形，斜体预加载；未增加动画依赖。影片仍 107,633 bytes，明确预览才请求。没有声称真实设备 60 FPS、LCP 或长任务结果。

本地 WebKit 运行库通过无 root 的临时解压安装成功；实际启动、媒体播放、页面交互和截图均完成。远程 CI 使用 Playwright --with-deps 正常安装。Playwright WebKit 不是 macOS Safari / iPhone，尚未进行真机测试。没有部署或合并 PR。

远程补充：Ubuntu WebKit 的 320px 回归随后发现页脚横向溢出。新增实际元素边界日志定位到 contact-circle 的右边界为 328.875px；页脚标题的最小内容宽度和 80px 按钮加间距超出视口。<=370px 改为标题在上、按钮在下，保留字号和触摸目标，没有屏蔽整页横向溢出来隐藏问题。浏览器脚本继续使用原有无溢出断言，并在失败前保存该视口截图。

页脚修复后远程残余 4px 来自窄屏 Hero 容器的右侧伸出；将 <=370px 的图形右边距由 -27px 收回到 -20px。CI 增加 WebKit 390/320 快速布局检查，先确认真实布局，再执行完整三浏览器交互回归；默认 `npm run check:browser` 仍运行全部引擎与全部场景，不使用目标引擎参数跳过完整验收。
