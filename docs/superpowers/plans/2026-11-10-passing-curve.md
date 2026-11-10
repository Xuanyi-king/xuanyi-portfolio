# The Passing Curve Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline. User already explicitly authorized review → refinement → render → art comparison → performance → integration decision.

**Goal:** Repair A’s empty middle with a causal X → curve → real project handoff, retaining an honest Lab if adoption gates fail.
**Architecture:** Existing study gains a passing variant. Pure shared visual mapping, timed or viewport-position drive, scoped outer-node writes. LivingGallery controller stays untouched.
**Tech Stack:** Existing Next/React/TypeScript/SVG/CSS/Playwright/FFmpeg.
**Spec:** `docs/motion-direction-2-3/directors-cut/design.md` and user’s full 15-section brief.

## Global Constraints

Only PR #4; base75a1e19, starting head453caa4. No merge/history rewrite/force push. Verified Xuanyi-king Author/Committer. No fake projects, no new dependency, no controller rewrite. No production adoption without all six gates.

## Review Focus

Fast scroll/reverse and stopped middle must remain coherent. Resize/reduced-motion must cancel playback without stale geometry. Native mobile scrolling and Gallery drag must coexist. First project title/tags/controls must stay within canvas and clickable. Detail back navigation must recover usable study progress.

### Task 1: Audit existing A
- [x] Build untouched head and exact2.2; preserve separate exports and source metadata.
- [x] Measure normal A and separate trace; ablate guide, X, parent3D independently. Document observations vs hypotheses before implementation.
### Task 2: Shared mapping and refined stage
Files: src/motion/passing.ts, src/components/motion-direction.tsx, src/app/lab/motion-direction/passing.css, tests/passing.test.ts.
- [x] Red: reversible finite mapping, focus overlap, final settle; viewport-scroll clamp and reverse.
- [x] Green: passingFrame(p,mobile), passingScrollProgress(rect,viewport) plus local-node renderer; old directionFrame unchanged.
- [x] Add default Director’s Cut selector, fixed SVG guide, independent desktop/mobile layouts, same actual LivingGallery. Run unit suite and typecheck/build.
### Task 3: Actual rendering and motion evidence
Files: scripts/check-passing.mjs, scripts/record-passing.mjs, docs/evidence/passing-curve/.
- [x] Render all eight frames and old A50/75 at four viewports; inspect before accepting art.
- [ ] Browser checks three engines, scroll/reverse/stop, pause, reduced, resize, detail return, navigation, Gallery keyboard/pointer/touch; record desktop/mobile sequences.
- [x] Decode dense film sequences and inspect; state playback limitation honestly. Preserve raw videos in Actions artifact.
### Task 4: Performance and final judgment
Files: scripts/measure-passing.mjs, .github/workflows/ci.yml, docs/motion-direction-2-3/directors-cut/.
- [x] Exact2.2 / oldA / cut in three alternating rounds, desktop/mobile4×CPU same scroll/drag sequence; independent trace and CPU profile.
- [x] Record all RAF percentiles, >50, longtasks, main/style/layout/paint/layerize/LCP/CLS. No selective round reporting.
- [x] Independent whole-change review; fix significant findings and rerun affected checks. Run required original regressions.
- [x] Decide all six adoption gates; leave homepage intact if any unproven. Publish evidence, append verified identity commits, update existing Draft PR and check latest Actions.

## Execution ledger

Dedicated fresh task clone used in place on existing PR4 branch; no pre-existing user changes. Exact2.2 rebuilt with its own npm ci after Turbopack rejected a symlinked dependency directory. Never substituted a baseline. Initial profiler overlapped setup; excluded from acceptance and retained separately. Four reviewer findings reproduced/fixed; state+tablet checks observed RED→GREEN. Final 12/12 engine/viewport checks,61/61 unit tests, typecheck, production build and12-route export passed before implementation commit. Native phone omits cross-region guide intentionally; this weakens adoption case and is disclosed. Source implementation frozen for clean performance/film runs.

Final evidence: six films/558 inspected8fps samples; first-paint flash found and fixed RED→GREEN, films regenerated. Clean normal18+director12+profile6 samples completed on3d0a4d9 with dirty=false. Desktop improves; mobile third-roundP99=66.7ms retained. Art/no-full-native-phone-curve and tail risk keep production2.2. Original identity test had two fixed-delay races, isolated current/exact2.2 cases passed; readiness waits retain original2px/none assertions and final12 cases passed. Existing PR publication/Actions state is recorded online in PR4.

Final CI follow-up: both93f2cf0 runs failed on WebKit native same-origin Fetch Inspector diagnostics, not a proven uncaught JS exception.24-round DOM+Inspector reproduction and3-engine exception/rejection/forged-text sentinels are retained. Test-only observer records native diagnostics separately and keeps real DOM errors fatal. Await latest-head full CI; production decision remains unchanged.
