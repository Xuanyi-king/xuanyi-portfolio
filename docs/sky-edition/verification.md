# Verification record

Final product checks were run after removing continuous Hero mesh deformation and correcting the phone path.

- `npm test`: **67/67 pass**. Original61 retained; new tests cover finite/closed/depth geometry at extreme forces, different A/B materials, compact complexity, reversible handoff, gentler spatial profile and safe mobile margin. A temporary precision-gate experiment had68 passing tests but was discarded;67 is the delivered suite.
- `npm run typecheck`: pass.
- `npm run build`: pass; static export includes the six new Sky routes without changing original routes.
- `npm run check:export`: **18 content routes**, links, assets, metadata, project scene sources, TOC, code highlighting, RSS and sitemap pass.
- Original `check-browser.mjs`: **12 checks pass**, zero runtime errors. Covers homepage/Lab/detail/back, keyboard, named scenes, real media, delayed JS, no JS, reduced motion, SplitText restoration and original viewport layouts.
- Original `check-identity.mjs`: **8 combinations pass** across available Chromium/Firefox, including original forward/reverse/brand alignment/history/reduced motion.
- Final `SKY_ENGINES=chromium,firefox node scripts/check-sky.mjs`: **8 engine/viewport cases pass**, each covering1440/768/390/320, no overflow, pointer pose on desktop, touch input on phone, five progress positions plus reverse, Gallery controls/keyboard, native detail/back, resize and reduced-motion change. Runtime errors0; native fetch diagnostics0. Full no-JS captures at1440/390 for both engines.
- `node scripts/check-sky-copy.mjs`: pass at320/390 and eight intermediate progress states, comparing actual painted SVG bounds against actual rendered text-line rectangles. Initial RED reproduced the independently observed overlap; a second320px RED caught residual contact before final GREEN.
- `node scripts/check-sky-touch.mjs`: pass. Actual CDP vertical touch moves document≈146px with project delta0; horizontal touch moves Gallery≈one project. No wheel substitution for this check.
- `git diff --check`: pass.

Local WebKit was actually attempted. It could not launch because libgtk4, graphene, harfbuzz-icu, manette, hyphen, woff and GLES shared libraries are absent. There is no available sudo/system-package helper. A user-local package download attempt also failed to find package metadata. This is an environment blocker, not a Safari pass. The new Sky review workflow installs official Playwright dependencies on Ubuntu24.04 and attempts the three-engine matrix plus touch/copy checks and films; remote status is reported separately.

Product source is05259b8. Two real Playwright WebM recordings cover the final desktop and phone experience. Raw movies are retained with hashes and decoded contact sheets; all5 sheets/165 sampled frames were actually inspected. Frame sequence inspection checks composition, visible stops, forward/reverse transport and native detail return, but does not establish original-speed timing quality. No real-time playback acceptance, physical phone or field-performance claim is made.

The measured effect-rejection decision and all unfavorable earlier performance runs are in [performance.md](performance.md). Screenshots in `static/` are the earlier static acceptance checkpointadf2f0a; `final/` and final films are the delivered pose-only implementation. Camera-specific rim/shadow and tip seams remain disclosed limitations.

No PR was merged, no remote history rewritten, no existing preview deployment changed. New commits use API-verified Xuanyi-king author/committer identity; account association is checked again after push.

## First remote run retained

On515bab1 both [PR Sky CI43334439881](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/runs/43334439881) and [push Sky CI43334357156](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/runs/43334357156) passed install/unit/types/build/export and all8 Chromium/Firefox cases, then failed WebKit1440 pointer-pose assertion. They are not passes. The first failure log is retained in `docs/evidence/sky-edition/audit/ci/515bab1-webkit-pointer.log`.

A rootless local WebKit runtime was subsequently assembled from official configured Debian package sources into scratch (no system/sudo changes); its full four-viewport Sky matrix passes. A custom launcher preserves the local library path because the official MiniBrowser wrapper replaces LD_LIBRARY_PATH. Host package validation is skipped only for that scratch launcher; actual WebKit runs with the real libraries and normal browser security. This enables local investigation but does not invalidate the independent CI failure. Additional native-event/pose diagnostics are being captured without weakening the failed assertion.
