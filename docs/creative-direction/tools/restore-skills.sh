#!/usr/bin/env bash
# Restore only the three audited project Skills. No global install or Hook setup.
set -euo pipefail
task_repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$task_repo_root"

# Refuse to overwrite any existing Skill copy. Inspect a mismatch explicitly first.
if [[ -d .agents/skills ]]; then
  python3 docs/creative-direction/tools/verify-skills.py
else
  DISABLE_TELEMETRY=1 DO_NOT_TRACK=1 npm_config_ignore_scripts=true CI=1 \
    npx --yes skills@1.8.1 install -a codex --frozen-lockfile
  python3 docs/creative-direction/tools/verify-skills.py
fi
node docs/creative-direction/tools/inspect-codex-skills.cjs
