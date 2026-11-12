# XUANYI · Skylight — design brief

The user's detailed Sky Edition brief is the authority. The user explicitly requests autonomous visual exploration, A/B selection, static acceptance before motion, and a reviewable PR; there is no authorization to merge or replace production before the visual case is established.

## Intent
A bright, spacious author portfolio centered on a floating X sculpture. Sky is expressed through diffuse light and atmospheric color, never sky photography or cartoon clouds. Preserve actual projects, navigation, content, and browser scrolling.

## Approaches
A, Cloud Silk: broad soft porcelain-blue/white curved silk, centered editorial hero, diffuse blue perimeter. More dreamlike; risks looking inflated and generic.
B, Sky Ribbon: clearly tensioned blue/white surfaces with visible thin edges and deliberate overlap, asymmetrical editorial hero. More recognizable silhouette; risks excessive stiffness.
Both are real SVG projections of sampled 3D ribbon surfaces with diffuse normal-based lighting. No WebGL, external image, new runtime dependency or full-screen animation. Reuse LivingX's spring and curve ownership and LivingGallery's data, controller and input.

## Scope
Prototype A/B routes under /lab/sky-edition/. Static browser captures and explicit decision precede motion integration. The selected /lab/sky-edition/ experience includes hero, reversible native-scroll handoff, real gallery and light editorial content; full-production replacement remains a recommendation, not a deployment. The rejected candidate is an archived prototype, never a visitor-facing theme switch.

## Material and layout
Cloud white #f8fbfd, sky veil #e6f2fb, daylight blue #b9d9f0, blue ink #253f55, air grey #5b7285. Warm light appears only as a restrained off-white. Serif editorial heading and clear existing sans typography. Hero X may rotate by a few degrees in response to the pointer. Static is the fallback; reduced motion disables pose/scroll animation. Phone preserves text and CTA before the gallery with normal document flow.

## Acceptance
Compare exact 2.2 homepage and both actual browser-rendered candidates at 1440×900 and 390×844; inspect 320 and 768. Record selected hover/touch, forward/reverse scroll, gallery controls, native detail/back. Validate no horizontal overflow, menu, keyboard, reduced motion and no JS. No claim of physical-device performance or true volumetric transparency. SVG is projected 3D geometry, not an interactive 3D scene engine.
