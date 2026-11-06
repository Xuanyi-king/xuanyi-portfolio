# Living Identity & Folding Canvas

稳定基线：PR #2 / `ea6528a`；[PR CI](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/runs/42228679492) 与 [push CI](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/runs/42228672474) 均成功，24 项测试、WebKit 窄屏检查及完整三浏览器回归通过。完整证据在 browser-evidence Artifact。本轮在独立 worktree / `experiment/living-identity`，不修改这条已验收分支，不新建或合并 PR。

目标：让 X 从等宽描边变成有真实边界、宽度起伏、前后关系的轻量 SVG 曲面；让 Hero 在普通滚动中收束，作品自然成为中心。保留品牌、文案、项目和全部路由。不开 WebGL，不锁滚动，不使用长 pin，不隐藏主标题。

比较两种原创曲面：Cloud Silk（舒展的前景暖色面与收束的蓝色后带）与 Bias Weave（反向交错、较纤细的前景）。从同一 cubic 中心线的切向/法向生成闭合带状轮廓，细边与局部接触阴影跟随同一几何；不靠大阴影、模糊或半透明叠灰。比较完整形态、形变、小图标、1440/390/320 实际页面，最终只保留一套。

控制边界：初始 HTML 有完整静态轮廓；几何入场由 JS 单一绘制器负责，完成后移交 spring，提前指针缓存，reduced-motion 直接静止。移除此新曲面模式的 CSS d 动画，避免两个系统写同一属性。滚动只控制外层变换，内部形变仍由 spring 单独负责；导航符号共享几何，保持静态可点。

Folding Canvas：原生 sticky Header，有限距离的 ScrollTrigger，X 先缩小再沿版面向导航区收束；Header 的实色背景避免叠影。标题轻微后退但不淡没，介绍和 CTA 仍可用；细线收束，作品进入。没有 pin / 克隆 DOM / 固定大场景。快速上下滚动必须恢复，迟 JS/无 JS 保持普通文档流。

采用与拒绝的最终理由、真实截图/录屏、兼容性和实测性能在原型比较后填写，不能以测试数量作为审美结论。

## 最终选择与动效编排

采用 **Cloud Silk**。两带从中心线采样法向，生成有宽度起伏的闭合轮廓；浅曲面投影改变边缘走向。薄边高光与仅落在后带上的局部接触阴影，取代等宽描边的平面感。没有大面积模糊、全局投影、WebGL 或新增依赖。这是 SVG 艺术曲面，不是布料物理仿真。

入场从完整静态形状开始，两带先后有一轮小幅呼吸式形变（错开 160ms，约 1.54s 收束），不隐藏标题、不开场遮罩、不阻止导航。晚到的 JS 也只从已展示的形状开始；重复访问跳过。内部 `d` 只有一个 renderer；入场持有绘制权，提前指针缓存，完成在标准形状移交 spring。CSS `d` 动画与对应旧规则已删除。无 JS / reduced-motion 是完整静态版本。

Folding Canvas 使用原生滚动与 `scrub:true`，没有 pin。最初先收小，随后沿外层变换靠近导航；手机与桌面采用不同弧度，避免经过中文。实色 sticky Header 遮住最后进入导航区的大 X，静态导航图标始终可用。标题只轻微退后，细线安静收束；背景层次渐弱，作品依照正常文档流进入。向上可逆，快速滚动不等待时间轴追赶。滚动不参与内部形变。

`resetHero()` 在重挂载及偏好变化时清理自己拥有的 transform/opacity，避免缓存页面把中间矩阵当成静态起点。实际历史导航采用可见位置的鼠标/触摸坐标，避免自动化工具先对 sticky 元素做预滚动。等待真实恢复状态，而不是用固定延时冒充完成。

主动删除：落选蓝前带、两个研究路由、候选切换参数、CSS path 入场、旧 selvedge/ink 规则。拒绝 pin、全程固定大场景、克隆飞行 Logo、WebGL 与新的动画库。代价是视觉衔接依靠匹配几何和遮挡，而非物理移动同一个 DOM；换来更可靠的导航与静态降级。

## 验证与边界

实际图片、两个原型、前后比较、Artifact 索引见 [证据目录](evidence/living-identity/README.md)。代码继续沿用 Next.js、React、TypeScript、GSAP、SVG、MDX 与静态导出。`npm ci`、30 项单测（原 24 项 + 6 项曲面/入场测试）、typecheck、生产构建、10 个内容路由的 export 检查已通过。

浏览器完整命令为 `npm run check:browser`：保留 Chromium 12 组、三个引擎各 7 组，另加三引擎 × 三宽度的折叠、密集 CTA 留白、快速回滚、历史恢复、resize、减少动态效果。平板 768×1024 与 375×812 仍由原有回归覆盖。本地最终全套已通过，9 个组合均为零运行时错误；摘要保存在 [browser-results.json](evidence/living-identity/browser-results.json)。远程结果与原始证据见该分支最新成功 CI / Artifact。

本地 WebKit 使用实际 WebKit 26 引擎和补齐的动态库，跳过的是安装位置检查，不是浏览器测试；Ubuntu CI 使用官方 `playwright install --with-deps`。一次本地运行因请求中断失败，另一次因固定 1600ms 恢复等待不足失败；没有忽略异常，改用稳定生产地址及实际静态曲线条件等待后，WebKit 7 组和 3 个尺寸的折叠均通过。

独立代码与看图审查：无 Critical；一个 Important（桌面后段 CTA 碰撞）已 RED→GREEN；一个 Minor 保留：边界测试证明有限、坐标范围与可变宽度，不证明任意曲面的数学无自交。真实拖动与预设已实测，但不把采样图当作数学证明。

尚未验证真实 iPhone / Android 硬件、移动网络与长期浏览器版本组合；Playwright WebKit 不是 iPhone 验收。性能以本机抽样为限，不以截图或单次帧率宣称稳定 60FPS。性能原始数据另见证据目录中的 JSON。

稳定 PR #2 保留在 `ea6528a`，本实现只推送 `experiment/living-identity`，不新建 PR、不合并、不重写历史。采用新曲面并不等于自动替换稳定分支。

最终代码 [40cd489 CI](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/runs/42248475631) 全部成功，包括官方 Ubuntu WebKit 依赖安装及完整三浏览器回归。推送后的 Author / Committer 均由 GitHub API 关联到 Xuanyi-king。

[同机顺序性能抽样](evidence/living-identity/performance.json)：新版 1440 与 390 视口帧间隔中位均约 16.7ms，P95 均约 33.3ms；旧版分别为 50ms / 16.8ms P95。短样本含首次滚入的延迟内容，不能据此宣称新版全面更快或全程 60FPS。新版手机视口样本出现一次 103ms 长任务，仍需真实设备 profile。几何弹簧在静止后停止自身 RAF；没有引入持续 WebGL 场景。首页 gzip HTML 从约 12.9KB 增至 40.5KB，这是闭合曲面及其分层 SVG 的明确成本，未隐藏为零成本升级。

独立视觉结论：Cloud 的边缘、宽度变化和暖色前景比原 Silk 更有层次；关闭动画时仍保持原有清爽构图。后段 CTA 碰撞已修正。当前适合在实验分支审阅与设备试用；真实移动设备性能尚未完成，不自动替换稳定 PR #2。
