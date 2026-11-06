# Git 提交身份与历史保护

本规范仅适用于 `Xuanyi-king/xuanyi-portfolio`。

## 每次创建提交之前

- 确认远程仓库、当前分支、暂存区和工作区状态。
- 默认作者与提交者名称均使用 `Xuanyi-king`，邮箱必须是该 GitHub 账号已验证的邮箱；优先使用可靠取得的 GitHub noreply 邮箱，不得猜测或拼接邮箱。
- 可通过已认证的 GitHub API `user/emails` 核验邮箱的 `verified` 状态及所属账号。无法可靠验证时，先要求用户提供正确邮箱，不得用 Codex 身份代替。
- 检查仓库、全局、系统与 include 配置的覆盖顺序，并检查 `GIT_AUTHOR_NAME`、`GIT_AUTHOR_EMAIL`、`GIT_COMMITTER_NAME`、`GIT_COMMITTER_EMAIL` 等环境覆盖。
- 使用仓库级 `git config user.name` / `git config user.email`，并通过 `git var GIT_AUTHOR_IDENT` 和 `git var GIT_COMMITTER_IDENT` 核对实际身份。
- 不使用 `codex` / `Codex` 作为普通 Git 提交的作者或提交者，也不使用其邮箱。

## 每次创建提交之后、推送之前

- 用 `git log -1 --format=fuller` 核对实际 Author 与 Committer。若不符合已验证身份，停止推送并修正原因。
- 若平台强制覆盖身份，必须如实报告，不能声称身份已修复。
- 推送后通过 GitHub Commit API 检查 `author.login` 与 `committer.login` 的账号关联。
- 暂存区不得包含密钥、Token、私有环境配置、依赖目录或构建缓存。

## 历史保护

- 未获用户明确授权，不重写历史，不强制推送。
- 获准重写时，先在 `.git` 之外备份完整有效文件并校验可恢复性；同时检查其他分支、PR、协作者工作及分支保护。
- 使用精确旧 SHA 的 `--force-with-lease=refs/heads/main:<已核验的旧 SHA>`，禁止无条件 `--force`。远端发生变化时立即停止，不更新预期旧 SHA 来绕过冲突。
- 不擅自绕过分支保护，不修改其他仓库，也不删除需要保留的分支或协作者工作。
