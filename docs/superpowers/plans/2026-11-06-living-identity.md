# Living Identity Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline. One fresh whole-branch review at the end.

**Goal:** 在稳定 2.1 之外完成两套真实曲面比较及一套可逆的 Folding Canvas 实现。
**Architecture:** cubic 中心线与法线构成闭合 SVG 轮廓；一个绘制函数控制内部几何，ScrollTrigger 仅控制外层 transform。沿用 React、GSAP、静态导出。
**Spec:** `docs/living-identity.md` 和用户的 Living Identity & Folding Canvas 指令。

## Global Constraints

- 保留 XUANYI / 玄屹、Curiosity Takes Shape、Editorial Flow、全部真实内容及功能。
- 不 WebGL、不新增动画依赖、不劫持滚动、不 pin、不隐藏主文字。
- reduced-motion、触摸、键盘、无 JS、正常历史返回均可用。
- 独立实验分支，保持 PR #2 的已验收基线；不强推、不重写、不自动合并。
- 实际看图选择一个方案，完整录屏进 Artifact，Git 只收关键图。

## Review Focus

- 极端拖动使轮廓法线翻转或边缘自交：几何边界测试 + Lab 实测。
- 早指针、偏好改变、卸载使入场/弹簧同时绘制：控制器测试 + 浏览器审计。
- 中间收束遮挡中文/CTA 或碰导航：三宽度中间帧与真实视频。
- 快速滚动、返回和 resize 恢复错误：浏览器往返及反向滚动断言。
- SVG 外扩、字体、sticky Header 挡焦点：WebKit 窄屏 smoke、三浏览器、键盘与无 JS。

### Task 1: 带状曲面与实际原型

Files: `src/motion/geometry.ts`, new `src/motion/surface.ts`, `src/components/x-mark.tsx`, temporary study route, `tests/surface.test.ts`.
Interface: geometry exposes `curves: Point[][]`; `silkSurface(curve, index, variant)` returns closed outline/face/edge and highlight paths from shared samples.
- [x] 先写有限性、端点、宽度起伏、形变跟随的几何测试，运行确认缺失功能失败。
- [x] 实现中心线法向轮廓、两种实际宽度/交错关系及简化小图标。
- [x] 真实渲染两套正常/形变/图标/手机比较，记录选择，最终移除另一套生产代码。
- [x] `npm test`、typecheck 和实际看图；按 AGENTS 核验身份提交。

### Task 2: 单一几何入场与 spring 交接

Files: new `src/motion/identity-intro.ts`, `living-x.tsx`, `hero.tsx`, `identity.css`, `tests/identity-intro.test.ts`.
Interface: `introPose(elapsedMs)` returns four bounded offsets and a completion flag; existing curve-owner gates spring until the intro renderer ends at rest.
- [x] 先验证首尾为静态轮廓、错时曲带、有限偏移和取消清理。
- [x] 同一 renderer 更新中心线/轮廓/高光/锚点/细线；移除该模式 CSS d 所有权。
- [x] 实际早指针、重复/返回、偏好切换、Lab 拖放；保留完整静态 SSR。
- [x] 全套测试和浏览器针对性检查通过后提交。

### Task 3: Folding Canvas

Files: `src/motion/hero.ts`, `page.ts`, `tokens.ts`, `identity.css`, `nav.tsx`.
Interface: ScrollTrigger owns only outer `.hero-artwork`, title/copy/thread transforms; geometry renderer never reads/writes those transforms.
- [x] 浏览器先记录现有不收束行为，建立正向/反向/快速滚动检查。
- [x] Header 原生 sticky；X 先缩再向导航区移动；标题轻微后退，CTA 保持可点；不 pin。
- [x] 对 1440/390/320 的展开、中间、作品、回滚帧进行视觉比较，主动删不舒服的运动。
- [x] 检查历史/resize/reduced/no-JS，测试通过再提交。

### Task 4: 完整验收与交付

Files: browser scripts, CI, docs/evidence/living-identity, identity assets.
- [x] 更新静态 SVG/Favicon，删除临时研究路由/切换器，最终只有一个曲面。
- [x] npm ci/test/typecheck/build/check:export/check:browser，保留既有回归并补滚动关键路径。
- [x] 三引擎真截图、完整滚动/回滚录屏、真实几何/性能数据，少量关键图进 Git。
- [x] Fresh whole-branch code/visual review，修复阻塞问题后推送独立分支，保持 PR #2 不动。
