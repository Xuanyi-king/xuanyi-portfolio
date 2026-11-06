# Living Canvas · 真实浏览器证据

所有截图来自本轮生产静态导出的实际页面。JPEG 仅对原始 PNG 压缩或拼接，没有生成图、重绘 UI 或伪造录屏。旧轮次证据未删除。完整运行方法与边界见 [实现和验收记录](../../living-canvas.md)。

## 先看画面

| 项目 | 证据 |
| --- | --- |
| 正式 Hero | [1440×900](hero-desktop.jpg) · [390×844](hero-mobile.jpg) · [320×740](hero-narrow.jpg) |
| 之前的 2.1 | [桌面](../visual-2-1/polish/hero-desktop.jpg) · [手机](../visual-2-1/polish/hero-mobile.jpg) |
| 两套曲面，同一状态比较 | [静止 / 舒展 / 收束与小图标](materials-comparison.jpg) · [手机](materials-mobile.jpg) |
| 可逆移动端收束 | [25% / 50% / 75% / 90% 实际滚动](folding-mobile.jpg) |
| Living Gallery | [桌面](gallery-desktop.jpg) · [平板修正后](gallery-tablet.jpg) · [手机](gallery-mobile.jpg) · [窄屏](gallery-narrow.jpg) |
| 真实 Router 预览 | [悬停后的实际设置页局部](router-preview.jpg) |
| 无 JS + 减少动态效果 | [全部项目静态可用](no-js-reduced.jpg) |

曲面比较上至下为静止、舒展、收束，左为 Sculpted Silk，右为 Translucent Fold。各自原型均能实际交互，入口 `/lab/canvas-study/`。正式首页采用 Sculpted Silk；研究页的 X Rail 不进入主浏览路径。

## 动态证据

GitHub Actions：打开 [PR #3 Checks](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/3/checks)，进入最新成功的 Portfolio CI → Artifacts → `browser-evidence`。ZIP 中路径如下；保留 14 天，到期可在相同提交重新运行工作流生成。大体积 WebM 与原始 PNG 不新增到 Git 历史。

| 观看目标 | Artifact 中的真实录屏 |
| --- | --- |
| A：两套曲面静态及同状态形变 | `living-canvas/materials/desktop-materials.webm`、`mobile-materials.webm` |
| B：首屏入场和指针局部形变 | `chromium/hero-motion.webm` |
| C / D：Hero 向下收束、向上展开与作品接续 | `living-identity/chromium/desktop-folding-canvas.webm`、`mobile-folding-canvas.webm` |
| E / F / G / H：慢拖、快甩、吸附、中断、3→1 及反向循环 | `living-canvas/chromium/gallery-drag-wrap.webm` |
| I：模拟手机横滑和正常纵向滚动 | `living-canvas/chromium/gallery-touch-and-page-scroll.webm` |
| J：点击详情并原生返回当前项目 | `living-canvas/chromium/gallery-detail-return.webm` |

这些录屏来自 Chromium 的实际运行页面。原生触摸输入是 CDP 模拟，不是物理手机。Firefox / WebKit 的截图与结构化回归也在 Artifact 中，不把其移动视口称为原生手势或真机证据。

## 可核验结果

本目录的 JSON 是本地最终产品源码验收快照，远程同一套脚本会生成自己的独立结果：

- [展廊三引擎四视口](gallery-results.json)：12 组；每引擎桌面正反各 100 次、原生详情返回及多次 SPA 进出。
- [收束与导航衔接](identity-results.json)：12 组，含反向、resize、reduced 与 CTA 留白。
- [开发 StrictMode](strict-mode.json)：三次进出、单键一步、按住暂停影片、无运行及 hydration 错误。
- [性能原始样本](performance.json)：桌面 / 模拟手机，不能当作线上指标、正式 INP 或稳定 60 FPS 保证。
- [追加 4× CPU 本地样本](performance-cpu4.json)：使用同一脚本实际降速，仍不是物理低端设备。

原有 Chromium 12 组、三引擎各 7 组与全部原始图保留在 Artifact。1 / 2 / 3 项研究页真实布局也有截图；4 / 6 项仅验证控制器，没有增加虚构作品。

真实设备与低端硬件尚未验证；Playwright WebKit 不等于 iPhone Safari。最终远程 CI 的链接和状态见 PR，不能用这些自动结果代替美术判断。
