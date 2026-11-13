# 源码与预览基线

> 第一阶段历史审计快照。第二阶段保存范围与来源复核见 [07-audit-publication.md](07-audit-publication.md)；文中的“尚未提交/尚未制作原型”描述第一阶段结束时的状态。

核对日期：2026-11-13。仓库：<https://github.com/Xuanyi-king/xuanyi-portfolio>。

## 分支、PR 与部署

| 对象 | SHA | 当前关系与状态 |
|---|---|---|
| main | `5ec8f791589de83e1ab70c266e2ce99c4c3a68ce` | 较早稳定分支；不是当前 Pages 预览的首页源码 |
| [PR #1](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/1) | `471805fe992ccc578fcaacf34a400c68b17deec2` | feat/curiosity-in-motion → main；open / draft / 未合并 |
| [PR #2](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/2) | `ea6528a42888086ec507e5c7e43aa78d66374e4e` | feat/xuanyi-2-1-art-direction → #1 分支；open / 非 draft / 未合并 |
| [PR #3](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/3) | `75a1e19fe63206c348548b3cfe969355499f7713` | feat/xuanyi-2-2-living-canvas → #2 分支；open / draft / 未合并 |
| [PR #4](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/4) | `31222d9a6140ec84574156dddd13d6179d9343cf` | feat/xuanyi-2-3-motion-direction → #3 分支；open / draft / 未合并 |
| [PR #5](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/5) | `ac6fe8cd0ef2b30634f8e6f6c3721eaa48702826` | feat/xuanyi-sky-edition → #4 分支；open / draft / 未合并 |
| preview/xuanyi-2-3 | `922da015ffe1677c4ebc55a4702d7905bc9c6803` | PR #5 后的预览包装提交；当前 Pages 部署来源 |

三个交叉证据确认当前真实预览使用最新 Sky Ribbon：

1. 在线 [`preview-version.json`](https://xuanyi-king.github.io/xuanyi-portfolio/preview-version.json) 的 `source_sha=ac6fe8c…`、`preview_build_sha=922da01…`、构建时间 `2026-11-13T01:03:54.710Z`。原始内容保存在 [evidence/preview-version.json](evidence/preview-version.json)。
2. [Pages 工作流 43341919562](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/runs/43341919562) 在 `preview/xuanyi-2-3@922da01` 上成功；deployment `7754115426` 在 `01:04:13Z` 返回 success，目标 URL 正是用户给出的预览。[工作流记录](evidence/runs.json)、[部署记录](evidence/deployments.json)、[状态](evidence/deployment-statuses.json)。
3. 本分支 [src/app/page.tsx](../../src/app/page.tsx) 只包装 `<SkyStudy variant="sky" />`，加载 Sky CSS；浏览器标题为 `Sky Ribbon — XUANYI 3D Sky Edition Preview`，真实画面与该组件一致。

`preview/xuanyi-2-3` 相对 PR #5 的四文件差异是预览工作流、预览部署说明、路径处理脚本及预览首页包装。没有理由从旧 main 重建当前设计。本轮从 **922da01** 建立 `chore/creative-direction-baseline`，未移动任何远端分支。报告分支已取消对预览分支的 upstream 跟踪，减少误推风险。

## AGENTS.md 与工作区

初始 `/workspace` 没有现成项目；正常克隆到 `/workspace/xuanyi-portfolio`，克隆后工作区干净。已读取仓库根 [AGENTS.md](../../AGENTS.md)，并比较预览与 PR #5 的版本；本轮不修改它。

其身份约束要求每次提交前可靠核验 Xuanyi-king 的已验证邮箱；本轮没有创建提交、推送或猜测身份，因此没有触发提交身份配置。历史保护规则继续有效。Next.js 附加说明要求写产品代码前读取对应版本文档；本阶段没有写产品代码，也没有启动 `next dev`。

本轮没有阅读旧的 `docs/sky-edition/review.md`、报告或旧证据作为审美结论来源。读取 PR 元数据时见到了历史交付描述；它仅用于版本定位，没有作为视觉质量证据。新截图、初步观察和源码共同构成本轮判断。

## 检查边界

远端记录显示预览部署成功，同时同 SHA 的 Portfolio CI `43341919541` 失败；两者是不同工作流，不能写成“所有检查已通过”。本轮没有复跑或修复该历史 CI，也没有用旧 PR 的通过宣称代替当前验证。本阶段的文件与浏览器检查见 [复现与验证](06-reproduction-and-verification.md)。
