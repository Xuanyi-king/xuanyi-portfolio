# 复现、验证与 Git 工作区

> 第一阶段历史审计快照。第二阶段保存范围与来源复核见 [07-audit-publication.md](07-audit-publication.md)；文中的“尚未提交/尚未制作原型”描述第一阶段结束时的状态。

## 本轮文件变化

仓库：`/workspace/xuanyi-portfolio`；独立分支：`chore/creative-direction-baseline`，HEAD 仍为 `922da015ffe1677c4ebc55a4702d7905bc9c6803`。取消了报告分支的 upstream，未向预览分支推送。

新增范围：

```text
.agents/skills/design-taste-frontend/      # 上游审查快照，项目级
.agents/skills/prototype/                  # 仅目标 Skill
.agents/skills/vercel-react-best-practices/
skills-lock.json                          # v2，内容 hash + 已核对 commit
docs/creative-direction/                  # 报告、图解、证据和复现脚本
```

三项共1710个文件，工具目录约41MB；Taste 占其中约40MB，主要是自带资产和示例。这些未导入应用、未放入 public，不增加网站运行时脚本。完整保留是为了可复查与离线读取，不应顺手把它的模板拷进首页。

没有改动 `src/`、`public/`、项目 `package.json/package-lock.json`、根 `AGENTS.md`、`.github/`、已有 scripts/tests 或旧报告；没有执行 `npm install`/`npm ci` 修改项目依赖。没有新的正式首页，没有原型路由，没有生产配置修改。

**没有 commit、push、PR 创建/合并、部署、强推、重写历史或删除远端分支。当前新增文件保留为未提交工作区内容。** 用户可先阅读，再通过自己的分支/提交流程保留；不能把本工作区状态说成已经远端保存。

项目外临时目录：`/workspace/skill-audit` 是上游审查克隆，`/workspace/skill-restore-check` 是空白复装测试，`/workspace/scratch` 保存工具中间产物。它们不属于交付 Git 目录，不依赖它们运行已交付的核验脚本。

云环境已有 Node24.22.1、Chromium、Playwright、Codex CLI。为 Playwright 录屏补齐了官方 FFmpeg v1011 的用户缓存（`~/.cache/ms-playwright/ffmpeg-1011`），没有全局 npm 安装或系统权限变更。`npx` 自身的下载缓存不属于项目依赖。

## 一次性复核

在仓库根运行：

```bash
python3 docs/creative-direction/tools/verify-skills.py
node docs/creative-direction/tools/inspect-codex-skills.cjs
```

第一条逐文件比较已审查 SHA256，按官方算法复算 v2 computedHash、核对锁定 commit、检查只存在三项，且被停装的 Impeccable 不存在；再确认网站、依赖与根 AGENTS 相对基线没有差异。[本轮结果](evidence/verification.json)。

第二条仅启动本地 `codex app-server --stdio`，先 initialize，再执行 `skills/list` 和 `hooks/list`，然后退出。**不发起模型轮次，不执行 Skill 脚本或 Hook，不更改审批/沙箱，不输出认证配置或 stderr。** [本轮复核结果](evidence/codex-discovery-recheck.json)。

预期：三项 Skill 均为 `scope: repo / enabled: true`；本地 hooks 空；无 Skill 解析错误。这个结果证明本地 Codex 能发现项目 Skill，不等于当前云端聊天工具目录热加载成功。

## 云端重建后

若整个分支文件已保留/恢复，包括 `.agents/skills`，Skill 指令可直接从项目目录读取，无需网络复装。在项目目录开启新 Codex 会话，再用上面的发现命令核实。不能只在 `/workspace` 启动后假设它会发现子仓库配置。

若只恢复了报告与锁文件、没有 Skill 副本：

```bash
bash docs/creative-direction/tools/restore-skills.sh
```

脚本使用审查时的 `skills@1.8.1` 与 `--frozen-lockfile -a codex`，锁文件记录精确上游 commit；关闭 CLI telemetry/security-audit请求与 npm生命周期脚本。只恢复三项，不安装 Impeccable，不调用各仓库安装器，不写全局 agent 配置。若 Skill 目录已经存在但哈希不同，脚本停止，保护本地修改，不自动覆盖或更新。

**实际复装测试已做：** 在同一云实例的空白目录 `/workspace/skill-restore-check` 中，仅复制 lock、初始化空仓库后执行冻结恢复，三项恢复成功。1710个文件与审查副本一致，锁文件字节不变。[机器结果](evidence/restore-check.json)、[日志](evidence/restore-check.log)。这证明锁定恢复路径可用；不是声称已创建或重建另一台云机器。

新环境仍需 Node≥22.20、npm、Git、访问 GitHub/npm 的网络；发现测试需兼容 `skills/list` / `hooks/list` 的 Codex。Taste 浏览器脚本还需 Chromium、Node WebSocket/fetch；录屏需 Playwright 的 FFmpeg。依赖或网络不齐时应报告缺项，不降低审批或 TLS 设置。上游更新应重新审查和生成 manifest，不能静默重新跑 `@latest` 后沿用旧的安全结论。

## 浏览器证据复现

采集工具在 [tools/](tools/)：`observe.cjs` 记录桌面/手机/参考站、`motion.cjs` 记录中间态和方向键、`followup.cjs` 记录实际详情/返回、触屏和失败请求。它们使用环境已有 Playwright，默认 `/usr/bin/chromium`；不安装进网站 package.json。输出写入 evidence，重跑前保留本轮文件，避免混淆版本。网页会变化，重新采集须先核对 preview-version。

Taste 原装脚本本轮实际运行：

```bash
CHROME_PATH=/usr/bin/chromium node .agents/skills/design-taste-frontend/scripts/shoot.mjs --url https://xuanyi-king.github.io/xuanyi-portfolio/ --w 1440 --h 1000 --out docs/creative-direction/evidence/taste-shoot.png --profile /tmp/xuanyi-taste-audit-profile --no-tiles
CHROME_PATH=/usr/bin/chromium node .agents/skills/design-taste-frontend/scripts/perf.mjs https://xuanyi-king.github.io/xuanyi-portfolio/ --w 1440 --w 390 --runs 3 --profile /tmp/xuanyi-taste-perf --json docs/creative-direction/evidence/taste-perf.json
```

截图脚本退出0，保存1440×3440图；性能脚本完成取样并退出1（真实 FAIL），不是执行崩溃。原始失败和人工分类都见审查报告。没有执行 Taste 的建站 Gate、consistency 固定规约，也未为了清空告警更改网站。

概念图源为 SVG，渲染预览：

```bash
node docs/creative-direction/tools/render-concept-board.cjs
```

脚本仅在随机 localhost 端口提供一张 SVG 并截图，结束即关闭。云端 Chrome 拒绝 `file://` 导航，所以采用本地 HTTP；没有修改浏览器策略或绕过管理员限制。图解已实际渲染并查看，不代表 A/B/C 动效或材质已运行。

## 本轮验证边界

| 验证 | 结果 |
|---|---|
| 版本归属 | 在线版本戳、Git 分支/组件、成功 deployment 三方一致 |
| Skill 安装内容 | 三项1710文件与上游对应快照一致；hash/锁定 SHA核验成功 |
| 本地 Codex 识别 | 三项 repo/enabled；解析错误0；活动 Hook0 |
| 空白目录复装 | 精确恢复、内容一致、锁文件不变 |
| 实际浏览器观察 | 桌面/手机视口、真实触屏媒体规则、正反滚动/中间态、Gallery键盘循环、详情/返回、手机reduced-motion已采集 |
| 性能 | 两尺寸各三次，完整保留 FAIL/WARN；不是全通过 |
| 报告与图解 | 本地文件链接检查、SVG渲染、证据索引、脚本语法和范围检查完成后见 final-verification.json |
| 网站构建/单测 | 本轮未跑；没有改产品代码或依赖，不声称通过。远端同预览 SHA 的历史 Portfolio CI 失败已保留 |
| 真机/跨引擎/完整无障碍 | 未完成；本轮不冒充 Safari、实际手机或屏幕阅读器验收 |
| A/B/C 原型 | 未实现；仅图解、概念与下一阶段实施计划 |

## 最终调用口径

- **Taste：** 指令已实际应用，两个原装脚本已运行并有产物。整套 Gate 建站流程未调用。
- **Vercel React：** 指令型 Skill 已应用到具体源码与测量审查，无需要启动的独立服务。
- **prototype：** 安装、读取、识别及计划应用成功；完整可运行原型调用尚未发生，不能宣称原型成功。
- **Impeccable：** 因已证实的安全边界冲突停装；本云环境没有运行其 context/detector/Live/Hook。原因是本任务安全要求，不是伪称网络或系统不支持。只研究了文档。
- **当前云聊天自动发现：** 未验证成功；executor Skill 清单为空。三项本地 Codex 发现成功与这一限制同时成立。
