# Verification record

Product source: **388ead1**. The latest commits after it update test readiness and evidence, not the application tree.

- Local `npm test`:67/67, original61 retained. Types, production build and export checks pass;18 content routes retain links, media sources, TOC, highlighted code, RSS, sitemap and SEO.
- Original Chromium homepage/Lab regression:12 checks passed. Original Living Identity:8 available-engine/viewport cases passed. Default production profiles/controllers remain unchanged.
- Local final three-engine matrix covers WebKit/Chromium/Firefox ×1440/768/390/320, no overflow, native pointer tilt/return, cached mesh, reversible scroll positions, Gallery controls/keyboard, native detail/back, resize, reduced-motion and no JS. Full captures and JSON are in the evidence index.
- The actual painted-X vs rendered-text-line check passes at320/390 across eight intermediate positions. Actual CDP touch keeps vertical scrolling separate from horizontal project navigation.
- [Sky CI43336881471](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/runs/43336881471), product388ead1, **passed** all steps including67 tests, build/export,12 browser cases, native touch/copy checks and two films. Its39,389,265-byte artifact13997009935 was downloaded, ZIP-checked and SHA256-verified against `3dbc7847d8014e74e54104f3d8b6052967164c0f6436940b7d1c3e5be7a23722`. Extracted JSON confirms12 cases/zero runtime errors and two completed films.
- This single CI success is not presented as universal stability. Repeats on0d5536e failed the fixed-delay pointer check before a pose frame was visible. The stricter final test observes an actual first pose frame, a nonzero3D tilt and its return to rest, exact native-scroll arrival, and reduced-motion reset. It preserves the same functional assertions instead of assuming100/220/600ms completion. Latest-head remote status is reported in the final PR handoff.
- Complete CI desktop/phone films and all5 contact sheets/155 samples were actually inspected. This is4fps composition/continuity inspection, not original-speed playback acceptance or a physical-device claim.
- Final numerical-spring performance sampling is independent of recording; all raw slow experiments and final rounds are retained in performance.md. No field INP, thermal or universal60FPS assertion.

## Environment and failure history

WebKit initially could not launch because shared libraries were missing and no sudo/system package helper was available. Official configured Debian package indexes/debs were downloaded into scratch and extracted into a user-owned library directory. A scratch launcher preserves the library path because the bundled MiniBrowser wrapper replaces it. Host package discovery is bypassed only for that custom rootless launcher; actual browser execution, library loading and normal browser security remain active. The standard CI launcher uses official Playwright system dependencies with no such override.

The original static/motion source on515bab1 failed both remote Sky runs at WebKit1440 pointer response; d381bd9 diagnostics confirmed the native event target, visible page, no reduced-motion and progress0 while its DOM tween stayed at0deg. The numerical spring simplifies ownership but later repeats showed that attributing the failure solely to GSAP was insufficient. All logs are retained under `audit/ci/`, including the0d5536e repetition. A local fixed100ms reduced-motion check and a fixed220ms reverse-scroll check also raced actual browser state; observation-based checks keep the same exact endpoint/cleared-style requirements.

No PR was merged, no history rewritten and no deployment changed. Verified Xuanyi-king Author/Committer identity and post-push GitHub account association are maintained. Exact replacement readiness remains an art/product decision; the recommendation is still to keep this as a Draft Lab.
