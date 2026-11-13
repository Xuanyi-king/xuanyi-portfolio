# XUANYI · 艺术升级基线

> 第一阶段历史审计快照。第二阶段保存范围与来源复核见 [07-audit-publication.md](07-audit-publication.md)；文中的“尚未提交/尚未制作原型”描述第一阶段结束时的状态。

审查日期：2026-11-13 UTC。阶段：工具准备、独立观察、方向提案。**没有制作或提交新的正式首页，没有部署，没有合并 PR。**

本轮最重要的判断：现有 Sky Ribbon 已有一致的蓝白语言、明显的字体层级和真正可交互的空间 Gallery；需要推进的是个人创作方法、文字、雕塑和项目证据之间的关系，而不是单纯增加特效。

## 交付索引

| 文件 | 内容 |
|---|---|
| [01-source-baseline.md](01-source-baseline.md) | main、PR #1–#5、预览分支、部署与 AGENTS.md 核对 |
| [02-skills-and-security.md](02-skills-and-security.md) | 安装前审查、职责、冲突、实际识别与调用边界 |
| [03-independent-review.md](03-independent-review.md) | A–H 独立视觉审查、五个核心问题、真实截图及源码证据 |
| [04-visual-directions.md](04-visual-directions.md) | A/B/C 原创方向、构图图解与运动分镜 |
| [05-prototype-plan.md](05-prototype-plan.md) | 下一阶段可运行原型的实施与比较计划 |
| [06-reproduction-and-verification.md](06-reproduction-and-verification.md) | 重建、验证、Git 变化与限制 |
| [audited-sources.json](audited-sources.json) | 四个上游审查 SHA、目标目录与安装状态 |
| [evidence/README.md](evidence/README.md) | 本轮采集证据索引与观察范围 |

## 四项 Skill 的真实结果

| Skill | 安装 | Codex 本地识别 | 本轮实际使用 |
|---|---|---|---|
| design-taste-frontend | 项目级成功 | `skills/list`：repo / enabled | 已读取并应用审美检查；原装 `shoot.mjs`、`perf.mjs` 实际运行并产出文件。没有运行其整套建站流程或 Gate |
| impeccable | **因安全审查停止安装** | 没有安装，未识别 | 只研究上游 critique / bolder / animate / polish 文档；未运行 context、detector、Live、Hook 或引擎，不能称完整 critique 调用成功 |
| prototype | 项目级成功 | `skills/list`：repo / enabled | 已读取 SKILL.md / UI.md 并用于下一阶段计划；**没有运行或验收 A/B/C 原型** |
| vercel-react-best-practices | 项目级成功 | `skills/list`：repo / enabled | 已读取具体规则并进行 React / SVG / 资源性能审查；属于指令型 Skill 的实际应用，无独立引擎 |

当前聊天的 executor Skill 服务返回空列表；它与本地 Codex app-server 的 Skill 发现机制不同。本轮对项目文件的读取与应用是手动显式调用，没有证据证明当前云聊天已热加载这三项或会自动触发它们。新启动的本地 Codex 已能识别；后续新会话应从本仓库目录启动并复查。

Impeccable 停装原因有精确源码证据：其 Live 回退代理使用跳过审批/沙箱参数，详见安全报告。这里执行了用户要求的停装规则，没有擅自更改安全设置。

所有艺术结论均为本轮审查判断，不是用户测试结果；原型优劣尚待下一轮交互比较。
