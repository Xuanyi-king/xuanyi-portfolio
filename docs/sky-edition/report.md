# XUANYI · Skylight / 3D Sky Edition

Selected direction: **B · Sky Ribbon**. A softer Cloud Silk candidate was built and compared in the real browser, then archived. The stronger B silhouette, asymmetric editorial layout and quiet blue/white material give the brand a more recognizable center.

**Recommendation: retain as a Draft Lab preview for review; do not replace production yet.** The visual direction is convincing enough to continue. Fine material seams, physical-phone/Safari validation and final homepage/content/detail integration remain before a production replacement. No live site or existing PR has been merged or overwritten.

## What is delivered

| Requested output | Evidence |
| --- | --- |
| Two X prototypes and two Hero directions | [Desktop A/B/old](../evidence/sky-edition/static/comparison-1440.jpg), [phone A/B/old](../evidence/sky-edition/static/comparison-390.jpg); real `/lab/sky-edition/cloud-silk/` and `/lab/sky-edition/sky-ribbon/` routes |
| Color and material system | [Art decision](art-decision.md), scoped `src/app/lab/sky-edition/sky.css`, numeric 3D surface renderer |
| Selected desktop/phone Hero, pointer and scroll states | [Final evidence index](../evidence/sky-edition/README.md) |
| Gallery and content page treatment | Actual LivingGallery + original project data; Work/About/Notes preview wrappers reuse existing components |
| Browser recordings after motion integration | [Desktop WebM](../evidence/sky-edition/films/skylight-1440.webm), [phone WebM](../evidence/sky-edition/films/skylight-390.webm), complete recorded actions and frame sheets in the index |
| Independent aesthetic/engineering review | [Review and fixes](review.md) |
| Validation and performance | [Verification](verification.md), [raw samples](../evidence/sky-edition/performance/samples.json) |
| PR and status | New Draft PR against existing2.3 branch; URL/status recorded in final handoff |

## Artistic result

Air is expressed by diffuse illumination, a clear white reading surface, low-saturation blue and one restrained atmospheric background. No sky photo, cloud stickers, particles, heavy glass or metallic speculars. The original real project covers and content remain intact.

The X has sampled out-of-plane surface coordinates, curved cross-sections and normal-derived diffuse shading. Its visible thin edge and crossing shadow are camera-specific projected approximations. It is intentionally a lightweight shallow-view SVG sculpture, not an arbitrary-camera WebGL object or volumetrically transparent material.

The first static pass exposed phone text collisions and an oversized desktop object. Those were repaired before motion was connected. Independent review later caught a different moving-phone collision in the inherited fold; its rendered text-line regression is now fixed. Phone transport stays in the right margin rather than crossing reading text to reach navigation.

The more elaborate continuous mesh deformation was actually measured, then **discarded**. Final motion keeps the accepted surface cached and uses restrained spatial attitude, reversible native-scroll transport, a depth turn and the real content surface opening. There is no scroll capture, sticky phone scene or continuous idle spectacle. Gallery keeps its controller, spring, horizontal gestures and native vertical scrolling; adjacent card yaw is reduced to about20° on desktop.

## Scope and limits

- Production homepage remains2.2; PR#1/#2/#3/#4 remain untouched and unmerged. Sky is a new stacked Draft PR against2.3.
- The final preview uses only Sky Ribbon. Cloud Silk remains an archived direct-access prototype for review, without a visitor-facing theme switch.
- Work/About/Notes use the original server/content components with scoped palette/background treatment. Project details and MDX articles retain original native routes and their production styling; this preserves content and history but is not full theme continuity.
- Fine contour seams remain visible near ribbon ends. They are a deferred material-polish item.
- Local Chromium/Firefox are browser evidence, not physical device tests. Local WebKit launch failed for missing system libraries. The new dedicated CI workflow supplies official browser dependencies for a three-engine check; a pending/failed remote run is never reported as a pass.
- Real WebM recordings are delivered. Decoded frame-sequence inspection can catch gross jumps and overlap; it cannot establish original-speed smoothness or subframe timing. No60FPS, field INP or thermal-performance claim is made.
- The old chatgpt.site URL returned a sign-in page in this environment. Its capture is explicitly labeled unavailable; the accessible GitHub preview and exact local2.2 baseline provide the actual old/new comparison.
