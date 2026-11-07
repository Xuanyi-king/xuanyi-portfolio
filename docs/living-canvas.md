# XUANYI 2.2 — The Living Canvas

## 基线与交付范围

开始与结束阶段均重新读取 GitHub：PR #2 未合并，head 为 `ea6528a42888086ec507e5c7e43aa78d66374e4e`。本轮从这个 head 建立 `feat/xuanyi-2-2-living-canvas`，以 PR #2 分支 `feat/xuanyi-2-1-art-direction` 为 base 创建 [PR #3](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/3)。没有从旧 main 开始，没有重写历史、强推或合并。

保留 Editorial Flow、XUANYI / 玄屹、Curiosity Takes Shape、Living Thread、真实项目材料与详情、Work 搜索筛选、MDX、SEO、RSS、Sitemap 和静态导出。选择性复用先前实验提交 `e508f26` 已验证的曲面与收束源码，重新进行本轮材料对比与集成验收；没有把旧实验结果冒充本轮新验证。

## 美术选择

两套实际 SVG 原型在 `/lab/canvas-study/` 以相同静止、舒展、收束状态比较，另有同源 16 / 24 / 32 / 64px 标识。研究页明确标注实验并设置 noindex，正式首页只有一套材质。

- **Sculpted Silk（采用）**：沿贝塞尔中心线采样切线、法线，以变化的宽度生成闭合曲面；浅曲面明暗、极薄侧边、细高光和局部接触遮挡区分前后。杏色带在前、蓝色带在后，小图标使用更实的光学校正版。
- **Translucent Fold（研究页保留）**：薄片透光，交叉处局部遮罩避免脏灰。静态清透，但在相同运动状态下前后关系较弱，不能胜过 Sculpted Silk 的识别度。

真实看图后主动减薄、减淡最初偏硬的侧边，避免纸板切边；没有增加大面积阴影、模糊或等宽粗描边来代替曲面。新图形属于轻量 **SVG 2.5D 表达**，不是完整三维布料模拟。没有引入 Three.js、Motion、Theatre.js、mo.js 或其他动画依赖，也没有复制参考站素材。

## 一套控制权，一次空间转移

| 层 | 唯一控制者 | 边界 |
| --- | --- | --- |
| 曲线与曲面 SVG 几何 | LivingX renderer / curve-owner | 入场状态与弹簧输入统一计算；旧 CSS `d:path()` 动画移除 |
| Hero X 外层空间 | GSAP ScrollTrigger | 仅 transform；不写 path；无 pin、滚动劫持或文档流变化 |
| 标题、介绍、细线与背景 | Hero 滚动时间轴 | 有限的后退与收束，阅读区保持自然滚动 |
| 展廊位置与卡片 transform | 独立 Gallery Controller | 单一可取消 RAF；不与通用 reveal 叠加 |
| 项目语义与状态 | React | 只更新离散活动项目，不逐帧重绘卡片 |

首帧品牌、文字与 CTA 直接可见。首次客户端入场用同一个几何控制器错时舒展两条曲带，延迟加载不会隐藏已经绘制的文字；重复访问和 reduced-motion 进入安静状态。滚动只变换外层，因此快速滚动或入场时移动指针不会争抢 SVG 属性。

**Folding Canvas / Living Identity**：大 X 缩小并向导航标识的坐标与比例靠拢，最后由始终可用、背景不透明的 header 遮挡完成视觉交接。没有把导航链接与动画绑定，也不要求移动同一个 DOM。布局锚点仅在刷新时测量，滚动逐帧使用缓存数据和纯函数 `foldFrame`。

手机采用独立投影路径：先在正文右侧收束，再靠近导航。终审实际发现旧路径在中途提早消失到 header 后面；已改成可见侧向接近，逐段检查 390 / 320px 中间状态与 CTA 留白。向上滚动恢复原构图，resize、历史返回与减少动态效果均会正确重算或清理。

## The Living Gallery

首页 Selected Work 采用真实 CSS perspective、translate3d、rotateY 和深度；中央作品清晰，两侧后退。手机只突出中央卡和侧边提示。Work 页面继续保留普通网格、搜索与筛选。

- 只使用 `src/data/projects.ts` 的 Router、Film、知乎平行宇宙三个项目，各一个语义化 article / 原生详情链接，没有镜像可访问副本。原概念封面、真实界面和视频继续明确区分，来源见 [项目视觉材料](project-visual-sources.md)。
- 连续虚拟位置、有符号距离与正模运算实现双向循环；重定位发生在透明边界，没有复制更多项目。1 / 2 / 3 项布局在研究页真实渲染；4 / 6 项只用控制器与数学测试验证，没有伪造作品。
- 按下中断惯性；水平意图明确后才捕获，松手有界惯性与吸附。8px 方向判断、500ms 长按区分，普通 wheel 和纵向触摸保留页面滚动。
- 中央卡直接进入详情，侧卡先居中；修饰键链接维持原生行为。左右按钮、方向键、Enter、Escape、可见焦点和真实 `01 / 03` 编号；默认不自动播放。
- 实际平板复看发现 768px 侧卡说明挤近中央标题：1100px 以下只保留两侧封面提示，中央作品说明完整可读，首绘与客户端采用相同规则；无 JS 网格仍显示全部说明。
- Film 仅中央卡明确 hover / focus 才加载静音真实节选，拖动、按住、切换、离开、页面隐藏与 reduced-motion 时停止。指针属性只在状态切换时写入，避免媒体观察器每帧重新执行。
- 按路由和真实项目 slug 保存有界位置；一个小型首绘脚本只设置初始 CSS 变量，原生返回无需先闪回第一项。仅根 html 对这些有意预设属性使用 hydration 例外，子树错误仍被验收捕获。
- 无 JS 使用同一批项目恢复普通静态网格；同时开启 reduced-motion 也能看到全部作品。减少动态效果的 JS 版本使用即时平面切换。
- X Rail 在研究页做了真实可拖动原型，但首页舍弃：符号与方向含义不如箭头、编号直观，也会与品牌 X 争抢注意力。

## 回归与独立审查

执行 `npm ci`、`npm test`（44 / 44）、`npm run typecheck`、`npm run build`、`npm run check:export`（11 个内容路由及内链、资源、MDX 目录、高亮、SEO、RSS、Sitemap、404）、`npm run check:browser`、`npm run measure:canvas`、`npm run check:strict`。

生产浏览器覆盖 Chromium 145.0.7632.6、Firefox 146.0.1、Playwright WebKit 26.0；每引擎 1440×900、768×1024、390×844、320×740。保留原 Chromium 12 组与三引擎各 7 组回归，新增 12 组身份收束与 12 组展廊视口组合。每引擎桌面正反各 100 次切换，另查拖动/点击/长按/捕获丢失、惯性中断、拖动中 resize、详情及原生返回、三次 SPA 往返、reduced、无 JS 与二者组合。真实开发模式另验证 StrictMode 三次往返、单次按键仅走一步、影片暂停及无 hydration / runtime 错误。

原生触摸事件只通过 Chromium CDP 模拟；Firefox / WebKit 使用鼠标、键盘与可触摸视口，不声称已验证这些引擎的原生手势。Playwright WebKit 不等于真实 iPhone Safari。

一次独立只读终审发现 0 Critical、3 Important。全部先在运行页面复现，再修复并运行完整回归：

1. 无 JS + reduced 只剩一张可见卡 → 加强 noscript 的级联优先级，全部三个作品与标题可见。
2. 拖动中 resize 后 1px 输入跳动 → resize 取消捕获与本次点击，位置稳定。
3. 手机 X 收束中途提早隐藏 → 独立移动路径，保持可见并避开中文和 CTA。

本轮全套原生触摸回归又捕获一处真实问题：子链接的隐式触摸捕获转交给舞台时，冒泡 `lostpointercapture` 被误当成手势结束。现在只响应舞台自身丢失捕获；保留真实 CDP 断言，没有用合成 PointerEvent 替代。

最后一次 CI 曾因 StrictMode 脚本使用 `127.0.0.1` 被 Next.js 开发来源限制阻止。脚本改用 `localhost`，未放宽来源策略；同时在自己启动的 dev server 退出后恢复自动改写的 `next-env.d.ts`。本地默认命令已通过。远程最终结果以 [PR #3 Checks](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/3/checks) 为准。

## 性能样本与边界

测量脚本：`npm run measure:canvas`。新建生产静态页上下文，记录 buffered LCP / CLS / EventTiming / Long Task，字体与入场稳定后采样实际指针、滚动、切换和拖动时的 RAF 间隔；另取三次导航及 GC 请求后的近似 JS heap。下表对应未降速样本；另实际执行 `CANVAS_CPU_RATE=4 BROWSER_EVIDENCE_DIR=artifacts/browser/cpu4 npm run measure:canvas`，结果见独立 JSON。

| 本地 Chromium 样本 | 1440×900 | 390×844 模拟视口 |
| --- | --- | --- |
| LCP | 164ms | 124ms |
| CLS | 0 | 0 |
| RAF 样本数 | 398 | 245 |
| 帧间隔 P95 / P99 | 16.8 / 99.9ms | 16.8 / 33.3ms |
| 超过 50ms 的间隔 | 5 | 1 |
| 观测到的最大交互 duration | 48ms | 168ms |
| Long Task 数量 | 3 | 3 |

这些是 loopback、无头桌面主机的短样本，不是线上 Core Web Vitals，不是正式 INP，也不能证明持续 60 FPS 或真实手机流畅。桌面 P99 仍有明显长尾，移动视口也观察到 168ms 交互；不能把 median 接近 16.7ms 宣称为性能目标完全达成。近似 heap 值受浏览器精度限制，不能据此证明无内存泄漏或 GPU 资源无增长。

4× CPU 追加样本（仍非真实低端设备）：桌面 / 手机视口 LCP 376 / 324ms、CLS 均 0、RAF P95 33.4 / 16.8ms、P99 66.7 / 33.4ms、最大观测交互 80 / 96ms。桌面出现 7 个超过 50ms 的帧间隔；不能把短样本差异理解为降速反而改善了正式性能。

## 证据与尚未验证

[关键截图、对比与录屏索引](evidence/living-canvas/README.md)。所有画面来自运行中的网站；JPEG 只压缩或拼接真实截图。新增视频不进入 Git，由 GitHub Actions 的 `browser-evidence` Artifact 保存 14 天，既有旧证据保留。

未验证真实 iPhone / Android、低端设备、非支持 CSS3D 的 GPU / 浏览器组合、线上网络和正式 INP、长时间 GPU / 内存稳定性。曲面完整性是有界极端形变下的离散采样交叉检查，不是所有连续形态的数学证明。建议下一轮集中做真机与长尾性能复核，不继续增加视觉特效。

独立美术判断：新版的改进来自更清楚的曲面、可见的移动端收束路径和作品之间的空间关系；文字与品牌仍是首屏主角。关闭动画时，完整静态标识、编辑式版面与真实作品仍可使用。没有通过增加装饰数量来制造复杂度。
