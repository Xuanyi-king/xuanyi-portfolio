# XUANYI 2.1 · 真实页面证据

这里的 PNG 和 WebM 都来自实际运行的页面。`studies` 为真实 DOM/CSS 原型对比，`final` 为正式视觉的浏览器验收；没有生成图。

## 比较后选一

- [Editorial 桌面](studies/editorial-flow-desktop.png) · [手机](studies/editorial-flow-mobile.png)
- [Canvas 桌面](studies/playful-canvas-desktop.png) · [手机](studies/playful-canvas-mobile.png)
- [Glass](studies/mark-glass-rest.png) · [Paper](studies/mark-paper-rest.png) · [Silk](studies/mark-silk-rest.png) · [实际材质/形变比较录屏](studies/x-materials.webm)

正式版只保留 Editorial + Silk。完整理由与动效编排见 [设计记录](../../visual-2-1.md)。

## 正式版截图

- [1440×900](final/hero-desktop.png) · [768×1024](final/hero-tablet.png) · [390×844](final/hero-mobile.png) · [320×740](final/hero-small.png)
- [作品静态](final/selected-work.png) · [真实界面悬停](final/work-hover.png) · [键盘影片预览](final/film-preview.png)
- [Router 案例](final/router-evidence.png) · [Film 案例](final/film-evidence.png) · [Multiverse 案例](final/multiverse-desktop.png)
- [About](final/about-desktop.png) · [中文文章](final/notes-mobile.png)
- [Lab 受力](final/lab-drag.png) · [触摸](final/lab-touch.png)
- [慢 JS](final/hero-slow-mobile.png) · [减少动态效果](final/hero-reduced.png) · [无 JS](final/hero-no-js.png)

## 运行录屏

- [Hero 入场与鼠标](final/hero-motion.webm)
- [首页滚动至作品](final/home-scroll.webm)
- [真实预览→详情→返回](final/project-transition.webm)
- [Lab 形变与键盘](final/lab-interaction.webm)
- [手机触摸](final/lab-touch.webm)

[结构化结果](final/results.json)记录实际浏览器、视口、场景与异常。关键首屏等待本地字体与一次性动画收束后，在同一会话比较相邻稳定帧；这能发现持续漂移，不是跨系统字体的像素金标，也不作为审美评分。

复现：`npm ci`、`npm test`、`npm run typecheck`、`npm run build`、`npm run check:export`、`npx playwright install --with-deps chromium`、`npm run check:browser`。CI 使用独立 artifacts/browser 目录，上传真实 browser-evidence artifact，不把这里保留的旧图作为新运行结果。

边界：Chromium 移动模拟/CDP 触摸不是真机；没有声称 Safari/Firefox、iOS/Android 真机、FPS/LCP/长任务已验证。录屏帧率也不代表网页渲染帧率。项目成片节选与网站 UI 录屏分开保存，来源见 docs/project-visual-sources.md。
