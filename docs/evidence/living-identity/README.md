# Living Identity — 真实浏览器证据

所有画面来自静态生产导出 `out/`，由 Playwright 实际启动浏览器采集。JPEG 仅压缩、缩放或将两张真实截图并排；没有生成图、假 UI 或合成动画。旧证据未删除。

## 两套实际原型

原型源码比较点：[42dd0e6](https://github.com/Xuanyi-king/xuanyi-portfolio/commit/42dd0e6b1bf6b9204880e9b648c54692fd2e14f0)。该提交曾真实导出 `/surface-study/cloud/` 与 `/surface-study/bias/`；正式代码已移除两个临时路由、候选参数与落选曲面。

| 比较 | Cloud Silk / 云绸（采用） | Bias Weave / 斜织（不采用） |
| --- | --- | --- |
| 静态、形变、16/24/32/64px | [真实 SVG 渲染](cloud-forms.jpg) | [真实 SVG 渲染](bias-forms.jpg) |
| 桌面 1440×900 | [Cloud](cloud-desktop.jpg) | [Bias](bias-desktop.jpg) |
| 手机 390×844 | [Cloud](cloud-mobile.jpg) | [Bias](bias-mobile.jpg) |
| 窄屏 320×740 | [Cloud](cloud-narrow.jpg) | [Bias](bias-narrow.jpg) |
| 实际指针形变 | [Hero](cloud-deformed.jpg) / [捕获拖动](cloud-drag.jpg) | [Hero](bias-deformed.jpg) / [捕获拖动](bias-drag.jpg) |

Cloud 的暖色前带使交错方向更清楚，窄蓝后带避免中心堆叠发灰，与蓝色标题形成温暖的平衡。Bias 蓝前带会与标题争夺视觉重心，较薄的暖色后带在手机上显弱。小图标均采用同源实色轮廓，不把微小高光硬塞进 16px。

## 最终状态与前后对比

- [桌面前后](before-after-desktop.jpg)、[手机前后](before-after-mobile.jpg)：左边为已验收 Silk 基线，右边为 Cloud Silk；布局与品牌文案保留。
- [1440×900](hero-desktop.jpg)、[390×844](hero-mobile.jpg)、[320×740](hero-narrow.jpg)。
- [收束中段](fold-middle.jpg)、[避开 CTA 的后段](fold-clear-cta.jpg)、[导航衔接](fold-navigation.jpg)、[手机中间帧](fold-mobile.jpg)、[作品成为中心](selected-work.jpg)。

独立审查发现桌面 75% 收束位置的小 X 曾从 CTA 下缘露出。已先复现失败断言，再推迟横向移动；最终回归检查 25/50/65/70/75/78/80/90/100% 位置的实际曲面边界与可见 CTA 无交叠。完整反向滚动要求回到原始变换矩阵。

## 原始 PNG 与 WebM

体积较大的可重复证据保存在 [此实验分支的 GitHub Actions](https://github.com/Xuanyi-king/xuanyi-portfolio/actions?query=branch%3Aexperiment%2Fliving-identity) → 最新成功运行 → **browser-evidence** Artifact（保存 14 天），不再向 Git 叠加视频。

| Artifact 路径 | 内容 |
| --- | --- |
| `living-identity/chromium/desktop-folding-canvas.webm` | 约 11 秒，连续原生 wheel 滚动与反向恢复，实际运行页面 |
| `living-identity/chromium/mobile-folding-canvas.webm` | 手机视口完整收束、作品区与回滚；视口模拟，不是真机录制 |
| `chromium/hero-motion.webm` | 首屏与真实指针形变 |
| `chromium/project-transition.webm` | 项目悬停、详情、返回 |
| `chromium/lab-interaction.webm` / `lab-touch.webm` | 鼠标、触摸捕获与控制点同步 |
| `living-identity/{chromium,firefox,webkit}/*.png` | 三引擎 × 1440/390/320 的展开、四个中间帧、作品区、恢复与 reduced-motion |
| `living-identity/results.json` | 每个组合的历史返回、resize、导航对齐、CTA 留白与偏好恢复断言 |
| `{chromium,firefox,webkit}/polish/curve-audit.json` | 入场所有权、早指针、连续交接和静态标题审计 |

本地相同文件由 `npm run check:browser` 生成至 `artifacts/browser/`（已 gitignore）。该命令保留原有 Chromium、三引擎回归，并增加 `check-identity.mjs`。

## 结果摘要

- [browser-results.json](browser-results.json)：最终本地三浏览器回归与 9 组折叠结果，含 resize / CTA 留白，零运行时错误。
- [performance.json](performance.json)：同机短时基线与新版的原始帧间隔/长任务；不是物理手机性能结论。
- [最终代码 CI](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/runs/42248475631)：全部成功。此后证据文档提交不改变该代码内容。

已保留约 1MiB 的关键 JPEG/JSON；完整 PNG、12 秒左右的折叠/回滚录屏与交互视频进 Artifact。录屏的首尾与中间序列已实际抽帧查看，最终回到完整 Hero；此检查不能代替真实设备现场观看。
