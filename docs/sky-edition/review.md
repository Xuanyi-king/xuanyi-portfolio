# Independent review and final rulings

A fresh reviewer inspected the whole implementation from 31222d9 to 3f850fa, read the design, and actually inspected both comparison boards and final desktop/phone captures. It independently ran the then-current 66 unit tests, native CDP touch scrolling, mid-scroll resize, reduced-motion off/on, nonzero gallery selection detail/back, and combined no-JS + reduced-motion.

- Critical: none.
- Important: the inherited mobile flight crossed full-width Chinese copy/CTA around70–75%. Reproduced independently and by `check-sky-copy.mjs` using the actual painted SVG bounds against actual text-line rectangles. Fixed with a Sky-only margin trajectory. The first fix still contacted the last320px line; a narrower mark/margin corrected it. The production2.2 fold is unchanged.
- Minor, deferred: fine strip seams near the ribbon ends. They are visible in real captures and need material polish before production replacement.
- Minor, addressed in documentation: face coordinates and diffuse normals are3D; rim thickness and contact shadow use camera-specific2D approximations. We do not claim arbitrary-view volumetric3D.

The author subsequently found performance costs in normal recording-free sampling and did a separate paint-freeze diagnostic. The author tried finer precision gating, smaller forces and cached common projection rows, but repeated tests still showed a desktop cost. The final version discards continuous hero mesh deformation and keeps the accepted sculpture cached; only its spatial pose and the document-flow receiving surfaces animate. The small Gallery identity still uses the existing spring. Rest/canonical and extreme accepted surfaces are byte-identical before/after caching, verified via SHA256 over both candidates at three extreme/rest poses. Final refinements were verified by unit/browser checks by the author, not a second independent review.

Rulings:
1. On phones, a tiny mark yields in the right margin rather than crossing the text to dock in navigation. This makes the phone narrative subtler; it protects reading.
2. Content preview pages reuse actual existing Work/About/Notes components. Detail/article links remain their original native URLs. This avoids duplicate project content but preview theme continuity ends on detail pages.
3. Publication and production replacement remain outside this exploration delivery. The full experiment is a Draft PR with source, screenshots and recordings, not a silent homepage replacement.

The reviewer did not assess physical-device performance, WebKit/Safari, arbitrary camera rotations, volumetric transparency, or original-speed film playback. Those exclusions remain limitations, not implied passes. Local WebKit was attempted and could not launch because the environment lacks required shared libraries; the system package helper/sudo are unavailable. A dedicated GitHub runner workflow is supplied to test all three browser engines with official Playwright dependencies.
