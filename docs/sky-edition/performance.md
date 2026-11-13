# Performance decision: remove continuous mesh deformation

The static artwork was accepted first. Continuous per-frame geometry deformation was then built, measured, and rejected. The delivered version keeps the accepted SVG surface at rest; the lightweight spatial pose, scroll depth-turn and receiving-content opening still respond. Gallery's tiny identity continues using its existing spring.

Protocol: local headless Chromium145; 1440×900 and390×844; native pointer/wheel over a three-second window; two rounds with reversed old/new order; CPU1× and synthetic4×; no recording or profiler during normal samples. Baseline is exact production2.2 homepage from PR#4's31222d9 checkout, selected case is `/lab/sky-edition/`. These are different page compositions, not an isolated shader benchmark. The initial mesh trial was exploratory and may include incidental test-process contention; final pose-only trials ran without competing browser/test/build work. All rows are retained rather than selecting favorable runs.

| P95 frame interval, ms | Mesh trial R1/R2 | Cached mesh R1/R2 | Delivered pose R1/R2 | 2.2 during delivered trial R1/R2 |
| --- | --- | --- | --- | --- |
| Desktop1× |50.1 /50.0 |33.4 /33.4 |16.7 /16.8 |16.8 /16.8 |
| Desktop4× |66.7 /66.7 |66.8 /66.6 |16.8 /16.8 |16.8 /16.8 |
| Phone1× |33.4 /16.8 |16.8 /16.8 |16.8 /16.8 |16.7 /16.8 |
| Phone4× |50.0 /50.1 |50.0 /50.0 |16.8 /16.8 |16.8 /16.8 |

The final run is not perfectly tail-free: desktop4× R1 has one interval>50ms and two Long Tasks; phone4× R2 has one interval>50ms and one Long Task. Phone4× R1 has two Long Tasks without a>50ms RAF interval. The baseline also has Long Tasks/tails in several4× cases; every raw row is linked below. All final normal1× cases have zero measured Long Tasks and zero intervals>50ms.

Separate diagnostic, not pooled with normal samples: freezing hero `d`/`stop-color` writes changed P95≈33.3→16.8ms in a2.5s pointer-only profile, Script≈648→509ms and Task≈982→608ms. This supported investigating SVG updates; it is not proof of a universal GPU explanation. Row/side caching preserved accepted paths and diffuse colors byte-for-byte, but did not remove the4× desktop penalty. The final art decision removes that effect entirely.

Raw data: [initial](../evidence/sky-edition/performance/before-samples.json), [cached mesh](../evidence/sky-edition/performance/cached-mesh-samples.json), [delivered](../evidence/sky-edition/performance/samples.json), [independent paint-freeze diagnostic](../evidence/sky-edition/performance/ablation.json). Reproduce with `node scripts/measure-sky.mjs` while serving baseline on4188 and selected build on4187.

No field INP, real-phone thermal behavior, Safari timing, power draw or universal60FPS claim follows from these synthetic headless samples.
