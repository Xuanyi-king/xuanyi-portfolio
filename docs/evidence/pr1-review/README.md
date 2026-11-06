# PR #1 真实运行证据

本目录中的图片和 WebM 均来自 Playwright 打开的实际静态导出页面。不是生成图或重绘界面。`before` 是修改前的真实页面；`after` 是本轮修复后的真实页面。

- [桌面 1440×900](after/hero-desktop.png)、[手机 390×844](after/hero-mobile.png)、[375×812](after/hero-narrow.png)、[320×740](after/hero-small.png)
- [Lab 拖动](after/lab-drag.png)、[触摸](after/lab-touch.png)、[键盘焦点](after/keyboard-focus.png)
- [作品悬停](after/work-hover.png)、[详情页](after/project-detail.png)、[无 JS 详情](after/detail-no-js.png)
- [真实 Router 材料](after/router-evidence.png)、[真实 Film 材料](after/film-evidence.png)
- [慢加载手机首屏](after/hero-slow-mobile.png)、[减少动态效果](after/hero-reduced.png)
- [首屏与鼠标，约 8 秒](after/hero-motion.webm)
- [悬停、详情与返回，约 12 秒](after/project-transition.webm)
- [Lab 拖动、键盘与预设，约 10 秒](after/lab-interaction.webm)
- [结构化结果](after/results.json)

录屏来自浏览器录制，没有用项目成片冒充网站交互。详情中的项目图片是原仓库材料，具体来源见 [project-visual-sources.md](../../project-visual-sources.md)。网页截图与项目素材的用途不同。

复现：`npm ci` → `npm run build` → `npx playwright install --with-deps chromium` → `npm run check:browser`。CI 使用独立的 `artifacts/browser` 输出目录，上传 `browser-evidence`，避免把仓库保留的旧截图当作新 CI 证据。
