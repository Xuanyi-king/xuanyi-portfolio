# X Response · 本轮真实证据

截图来自实际运行的生产导出。JPEG 只做压缩、裁切或并排拼接，未生成或重绘 UI。完整说明见 [复审记录](../../canvas-response-review.md)。旧轮次证据原样保留。

| 看什么 | 实际截图 |
| --- | --- |
| 展廊前后，编号旁 X 受力 | [桌面](gallery-desktop-before-after.jpg) · [390px](gallery-mobile-before-after.jpg) |
| 现有曲面与未采用候选 | [同姿态三状态与小图标](surface-candidates.jpg) · [手机舒展态](surface-mobile.jpg) |
| 桌面 90% 提前藏到 header 的修复 | [相同 reverse 90% 前后](fold-desktop-before-after.jpg) |
| 桌面中间状态 | [25 / 50 / 75 / 90%](fold-desktop-stages.jpg) |
| 手机连续反向恢复 | [25 / 50 / 75 / 90%](fold-mobile-reverse.jpg) |
| 完整首屏保持 Editorial Flow | [1440×900](hero-desktop.jpg) · [390×844](hero-mobile.jpg) · [320×740](hero-narrow.jpg) |

曲面图左为 Current Sculpted Silk（正式），右为 Tensioned Silk（未采用）。上下依次静止、舒展、收束；候选交叉较窄、承托感较弱，因此保留正式版本。研究入口 `/lab/canvas-study/`，不是设计切换器。

## JSON 与实际录屏

[响应 9 组](response-results.json) · [收束 12 组](identity-results.json) · [性能前后三轮与独立 trace 摘要](performance-local.json)。性能本地源码 825577b；轨迹修复验收源码 25b8664。两者范围不同，详见记录。

打开 [PR #3 Checks](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/3/checks)，选择当前 head 的成功 Portfolio CI → `browser-evidence` Artifact。以下均为实际浏览器录制，非示意动画；保留 14 天，到期可在同提交重新运行脚本。

| 证据 | Artifact 路径 |
| --- | --- |
| 新 X 与真实展廊受力、恢复、点击返回 | `response-review/chromium-1440-gallery-response.webm`、`chromium-390-gallery-response.webm` |
| 新候选同姿态实际比较 | `response-review/depth-study/desktop-candidate.webm`、`mobile-candidate.webm` |
| 收束、反向、作品区接续 | `living-identity/chromium/desktop-folding-canvas.webm`、`mobile-folding-canvas.webm` |
| 慢拖、快甩、吸附、中断与首尾循环 | `living-canvas/chromium/gallery-drag-wrap.webm` |
| 模拟手机横滑与纵向滚动、X 实际形变 | `living-canvas/chromium/gallery-touch-and-page-scroll.webm` |
| 原生详情与浏览器后退 | `living-canvas/chromium/gallery-detail-return.webm` |
| 正常性能测量（三轮，前后交替） | `response-review/comparison/{before,after}/round-{1,2,3}/living-canvas/performance.json` |
| 带 profiler 的独立性能追踪 | `response-review/comparison/{before,after}/profile/living-canvas/trace-*.json`、`cpu-*.cpuprofile`、`analysis-*.json` |
| 精确基线 / 源码 / 三轮合并信息 | `response-review/comparison/comparison.json` |

原始多引擎 PNG 和完整结果随 Artifact 保存。CI 在最终 head 重跑；本目录是明确标注源码的本地快照，不提前声称 CI 成功。没有真机 Android / iPhone 测试，不以移动视口或模拟触摸代替。

复现：`npm ci && npm test && npm run typecheck && npm run build && npm run check:export`；安装 Playwright 三引擎后运行 `npm run check:browser`、`npm run check:strict`、`npm run compare:canvas`。性能脚本期间避免并发浏览器、构建或录像；`CANVAS_CPU_RATE` 默认 4，前后必须相同。
