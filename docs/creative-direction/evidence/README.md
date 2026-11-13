# 本轮证据索引

采集于2026-11-13 UTC，浏览器具体版本与视口在 [observations.json](observations.json)。源码基线为 preview `922da01` / product `ac6fe8c`。本目录是本轮新采集，没有复制旧审查截图作为现状证据。

## 真实网站

| 文件 | 说明 |
|---|---|
| [live-desktop-hero.png](live-desktop-hero.png) / [live-mobile-hero.png](live-mobile-hero.png) | 1440×1000、390×844首屏 |
| [live-desktop-pointer.png](live-desktop-pointer.png) | 指针移动后姿态；不以一张截图宣称物理模拟质量 |
| [live-desktop-scroll-0.png](live-desktop-scroll-0.png) | 默认 Gallery；旁边卡片是空间透视，不是独立页面 |
| [live-desktop-scroll-1.png](live-desktop-scroll-1.png) | Gallery→About，查看材质/节奏连续性 |
| [live-desktop-scroll-4.png](live-desktop-scroll-4.png) | Notes与页脚 |
| [live-desktop-full.png](live-desktop-full.png) / [live-mobile-full.png](live-mobile-full.png) | 全页记录；固定元素和动画以视口图为准 |
| [live-desktop.json](live-desktop.json) / [live-mobile.json](live-mobile.json) | 实际文本、字体、章节坐标/高度和链接 |
| [motion-contact.jpg](motion-contact.jpg) | 9个中间态按序3×3；不是原速播放证明 |
| [motion-states.json](motion-states.json) | scrollY 0→140→280→420→560→700→560→280→0及实际transform、进度 |
| [motion-2.jpg](motion-2.jpg) / [motion-3.jpg](motion-3.jpg) | 280px/420px状态，检查X转向与接棒关系 |
| [gallery-state-0.png](gallery-state-0.png) / [gallery-state-1.png](gallery-state-1.png) / [gallery-state-2.png](gallery-state-2.png) | 方向键三次切换：02/03/01 |
| [project-detail.png](project-detail.png) | 等到详情H1出现后采集的真实详情；没有用导航前的画面冒充 |
| [network-and-detail.json](network-and-detail.json) | fetch取消、详情URL/title和返回计数 |
| [touch-mobile-gallery.png](touch-mobile-gallery.png) / [touch-mobile.json](touch-mobile.json) | 390px + isMobile/hasTouch，确认hover:none与真实媒体隐藏 |
| [reduced-mobile.png](reduced-mobile.png) | reduced-motion下的手机滚动状态 |
| [video/](video/) | 一段真实桌面浏览器WebM，包含指针、阶段滚动与返回；仅按采样观察，没有宣称完整原速人工/真机验收 |
| [initial-visual-notes.md](initial-visual-notes.md) | 性能取样前记录的初步视觉判断 |

`motion.cjs` 初次在导航开始后过早截图；本目录最终 project-detail.png 已由 followup 脚本等待真实标题后重新采集。版本/结论以最终证据为准。视口截图不是完整可用性认证。

## 设计参考与图解

- [reference-desktop-hero.png](reference-desktop-hero.png)、[reference-desktop-work.png](reference-desktop-work.png)、[reference-desktop.json](reference-desktop.json)：实际访问 haoqi.design 的首屏与滚动850px后的介绍段。第二张文件名 work 只是采集标签，画面实际是个人介绍；未声称观察其全部项目。
- [concept-atlas.png](concept-atlas.png)：本轮构图/运动图解，源在上级 concept-atlas.svg；它是计划说明，不是最终设计稿或交互原型。

## Skill、部署与验证

| 文件 | 说明 |
|---|---|
| [preview-version.json](preview-version.json)、[runs.json](runs.json)、[deployments.json](deployments.json)、[deployment-statuses.json](deployment-statuses.json) | 版本归属与工作流状态，保留失败的Portfolio CI |
| [install-taste.log](install-taste.log)、[install-prototype.log](install-prototype.log)、[install-vercel.log](install-vercel.log) | 三项安装输出，去ANSI显示控制码；没有Impeccable安装日志，因为未执行 |
| [cli-help.txt](cli-help.txt) | 官方CLI实际支持的语法 |
| [codex-skills-list.json](codex-skills-list.json)、[codex-hooks-list.json](codex-hooks-list.json)、[codex-discovery-recheck.json](codex-discovery-recheck.json) | 本地Codex只读发现，过滤掉无关系统Skill；没有模型调用 |
| [installed-files-sha256.json](installed-files-sha256.json)、[verification.json](verification.json) | 1710文件完整hash及工作区范围核验 |
| [restore-check.json](restore-check.json)、[restore-check.log](restore-check.log) | 从锁文件在空目录恢复的实际结果 |
| [impeccable-security-excerpts.txt](impeccable-security-excerpts.txt) | 固定SHA的权限绕过、Hook与下载执行相关原文 |
| [taste-shoot.png](taste-shoot.png)、[taste-shoot.log](taste-shoot.log) | 原装Taste截图脚本的真实输出 |
| [taste-perf.json](taste-perf.json)、[taste-perf.log](taste-perf.log) | 原装性能脚本两尺寸×三次，包含FAIL/WARN，不修改原判定 |
| [final-verification.json](final-verification.json) | 最终文档、脚本、范围与发现检查 |

本轮没有源码改动，功能问题未被“顺便修复”；后续重新采集应另记日期和版本，不覆盖本目录的历史判断而不说明。
