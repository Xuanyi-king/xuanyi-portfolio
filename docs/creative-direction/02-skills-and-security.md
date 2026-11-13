# Skill 安装、安全与职责

> 第一阶段历史审计快照。第二阶段保存范围与来源复核见 [07-audit-publication.md](07-audit-publication.md)；文中的“尚未提交/尚未制作原型”描述第一阶段结束时的状态。

## 审查方法与结论

先克隆四个指定仓库至项目外 `/workspace/skill-audit/`，读取 README、准确目标 SKILL.md、目标目录文件清单，以及涉及的安装脚本、Hook 清单和可执行入口。随后检查命令执行、网络请求、环境继承、写入位置与权限参数。CLI 也先阅读官方 `vercel-labs/skills` 的 README、安装/agent/telemetry 实现与帮助；没有执行各 Skill 仓库自己的全套安装器。

上游均固定到 [audited-sources.json](audited-sources.json) 中的 SHA。安装后的三份目录逐文件比对上游对应目录，排除安装器不复制的 `metadata.json` 后完全相同。完整安装文件 SHA256 在 [installed-files-sha256.json](evidence/installed-files-sha256.json)。这是一轮针对相关入口及危险模式的人工源码审查，不宣称完成整个上游仓库的形式化安全证明。

| 对象 | 密钥与上传 | 执行、审批与沙箱 | 写入、全局安装与 AGENTS | 决定 |
|---|---|---|---|---|
| Taste 2.5.1 | 相关入口未见收集密钥；photos/icons 可下载公网素材，本轮未使用 | gate 启动本地 Node 检查器和 Chromium；未见 Codex 审批绕过。SKILL frontmatter 有 Claude Stop Hook | `install.sh` 默认用户级软链，未运行；`start/gate --start` 可写 `.taste-skill`，未调用。无覆盖根 AGENTS 的安装步骤 | 仅用指定 skills CLI 安装目标目录；不注册 Hook、不拷贝其网站模板 |
| Impeccable 4.9.0 | Live 会把元素 HTML、附近文字、URL、候选路径交给回退代理，并继承运行环境；**这不等于已发现密钥上传** | **确有跳过审批/沙箱的回退参数**；launcher 可下载后执行引擎；README 说明 Hook 可在模型审批之外运行 | 原装 installer 可写 Hook/agent 配置；Live 可回写源码。未执行安装器、Hook、launcher | **停止对应安装与执行**，仅研究文档 |
| Matt prototype | 目标目录是 Markdown 与 `agents/openai.yaml`，无上传脚本 | 无可执行脚本和 Hook；其指令要求未来原型可运行，但不会自行创建 | 无安装脚本；不需要全局配置；没有修改根 AGENTS 的步骤 | 仅安装 prototype |
| Vercel React | 目标目录为文档/规则，无密钥读取或上传脚本 | React Skill 没有 Hook 或部署命令；同仓库 deploy-to-vercel 等未安装 | 自带的 `AGENTS.md` 是**Skill 内的规则汇编**，不是仓库根文件，未复制到根目录 | 仅安装 vercel-react-best-practices |

## Impeccable 停装的精确证据

审查版本：`c4cd1924c389f68d37c687d9c2bbf13f12547c41`。

- [README.md 的 Live 说明](https://github.com/pbakaus/impeccable/blob/c4cd1924c389f68d37c687d9c2bbf13f12547c41/README.md#iterate-in-the-browser)：无活跃聊天轮询时，Apply 可启动本地 codex / claude，明确关闭 approvals、permission checks 和 sandboxing，并继承环境。
- [crates/live/src/copy_edit_agent.rs](https://github.com/pbakaus/impeccable/blob/c4cd1924c389f68d37c687d9c2bbf13f12547c41/crates/live/src/copy_edit_agent.rs#L1516)：`run_codex` 的参数包含 `--dangerously-bypass-approvals-and-sandbox`；`run_claude` 包含 `--permission-mode bypassPermissions`。
- [plugin/hooks/hooks.json](https://github.com/pbakaus/impeccable/blob/c4cd1924c389f68d37c687d9c2bbf13f12547c41/plugin/hooks/hooks.json) 注册 SessionStart、PostToolUse、Stop。README 单独声明 “Hooks run outside model approval”。
- [launcher](https://github.com/pbakaus/impeccable/blob/c4cd1924c389f68d37c687d9c2bbf13f12547c41/plugin/skills/impeccable/scripts/impeccable) 会下载版本固定的二进制并校验仓库附带 SHA256。这比不校验下载可靠，但不能证明二进制所有行为符合本任务权限边界。

上游提供 `IMPECCABLE_LIVE_COPY_AGENT=chat/off` 作为控制项，但它不抹去已发现的绕过实现。用户明确要求发现此类行为停止对应安装，因此本轮没有仅设置环境变量便继续安装，没有执行 `npx impeccable install` 或给出宽泛权限。相关源码摘录保存在 [impeccable-security-excerpts.txt](evidence/impeccable-security-excerpts.txt)。

读取 critique、bolder、animate、polish 文档用于研究：Experience 模式、先判断品牌专属性、只编排一个有意义的运动主句、精修不暗中改版。这些原则用于报告，但**不是成功运行 Impeccable 的完整 critique**。其原版 critique 要求隔离评估及 detector 等步骤；本轮因停装没有进入这个流程，也没有伪造评分、overlay 或 detector 成功。

## 实际安装

当前 `skills@latest` 解析为 **1.8.1**，支持用户给出的 `--skill … -a codex`。以下三条命令成功；`--yes` 仅跳过安装器的选择确认，不更改 Codex 审批。无 `-g`、无 `--all`。

```bash
DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 npm_config_ignore_scripts=true npx --yes skills@latest add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend -a codex -y
DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 npm_config_ignore_scripts=true npx --yes skills@latest add https://github.com/mattpocock/skills --skill prototype -a codex -y
DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 npm_config_ignore_scripts=true npx --yes skills@latest add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices -a codex -y
```

Impeccable 的用户指定命令在安全审查后**没有执行**。不尝试替换成另一个未经要求的审美 Skill。

每项安装只选择一个 Skill。prototype 的 CLI 日志出现同仓库无关 `software-factory` YAML 解析警告；它被跳过，目标 prototype 安装与 Codex 解析成功，没有安装其它 Skill。[安装日志](evidence/README.md)。

| 名称 | 实际 SKILL.md 路径 | 本轮调用证据 |
|---|---|---|
| Taste | `.agents/skills/design-taste-frontend/SKILL.md` | 读取并应用层级/排版/真实画面检查；原装 `shoot.mjs` 输出 1440×3440 PNG，`perf.mjs` 完成 1440/390、各三次加载取样 |
| prototype | `.agents/skills/prototype/SKILL.md` | 读取 `UI.md`，选择 UI 分支，落实三种结构、单路由切换、抛弃式分支、状态可见等计划要求；尚未实施原型 |
| Vercel | `.agents/skills/vercel-react-best-practices/SKILL.md` | 应用 transient refs、SVG wrapper、batch DOM、dynamic imports、SVG precision 规则进行源码/测量交叉审查 |

三个文件均可读取。`skills list -a codex --json` 只能证明安装器清单；额外启动 **Codex CLI 0.167.0-alpha.4** app-server，initialize 后请求 `skills/list {cwds:[项目绝对路径],forceReload:true}`，三项都返回 `scope: repo`、`enabled: true`、errors 空。[原始结果](evidence/codex-skills-list.json)。`hooks/list` 返回 hooks 空、warnings/errors 空：[结果](evidence/codex-hooks-list.json)。Taste frontmatter Hook 没有成为这个本地 Codex 的活动 Hook。

当前聊天的 executor `skills.list` 返回空列表，本地文件安装不会自动成为云端工具目录项。这里明确用文件读取加载指令；没有另外启动模型会话冒充“自动调用验收”。新 Codex 进程无需修改配置即可识别；已有聊天是否热加载未证实，下一轮从项目目录开启新会话更稳妥。

## 在 XUANYI 中的职责与冲突

| 能力 | 在本项目的具体工作 | 必须服从的边界 |
|---|---|---|
| Taste | 检查画面主次、字号与行长、构图张力、颜色/材质一致性、品牌能否被替换 | 不执行禁 Carousel/tilt、固定章节高度、统一 hover、禁止图注、模板经销式布局与文案规则；真实项目说明和来源标注保留 |
| Impeccable 文档研究 | 用专属性、体验主句、高潮/停顿、完整路径检查建立批判语言 | 本轮无运行能力；未来需先解决停装原因，再谈正式工具调用。不开 overdrive，不把 Experience 的野心挪到文章阅读页 |
| prototype | 把构图假设变成下一轮可切换、可操作的 A/B/C 证据 | 用户明确本阶段不做原型，其“立即构建/折入正式代码”的默认流程延后；不自动提升胜出方案或合并 |
| Vercel React | 判断每帧更新路径、SVG/脚本成本、加载与布局稳定性；给方向设预算 | 先测量再分包，不把所有 SVG 换 WebGL，不以 `ssr:false` 隐藏首屏主角；不把工程通过当成审美通过 |

统一决策顺序：**用户阶段与品牌目标 → 可用性/无障碍 → 真实内容与证据 → 空间/排版/动效提案 → 工程预算 → Skill 默认偏好**。冲突在具体位置记录取舍，不把工具得分当审美裁判。本轮没有修改任何 Skill 指令来伪造通过。

Taste 的 40MB 左右模板/素材仅存在于工具目录，不进入 `public/`、应用 import 或运行时包。它的最新版偏公司站固定规约，与原创个人作品集存在明显适配成本；采用其中可验证的观察能力，保留用户指定的 Living Gallery、连续叙事与原创 3D。
