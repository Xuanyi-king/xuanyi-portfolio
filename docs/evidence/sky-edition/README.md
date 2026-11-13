# Skylight evidence

All site images are actual browser captures. Comparison/contact boards only arrange those captures and decoded video frames. No generated image stands in for an implemented page.

Standalone renderer exports: [Cloud Silk SVG](prototypes/cloud-silk.svg) · [Sky Ribbon SVG](prototypes/sky-ribbon.svg).

## Static exploration, before motion

- [1440px old / Cloud Silk / Sky Ribbon comparison](static/comparison-1440.jpg)
- [390px comparison](static/comparison-390.jpg)
- A: [desktop](static/cloud-1440-hero.png), [phone](static/cloud-390-hero.png)
- B: [desktop](static/ribbon-1440-hero.png), [phone](static/ribbon-390-hero.png)
- The full `static/` folder also contains768/320px captures, both gallery treatments, exact local2.2 and accessible GitHub preview.
- `old-site-1440.png` is an access-limited sign-in page, **not a successful old-site capture**. Actual old/new reference is local2.2 and `github-preview-1440.png`.
- Static acceptance source: commitadf2f0a. Candidate A remains archived; only B enters the selected experience.

Final Hero old/new: [desktop](final/hero-comparison-1440.jpg) · [phone](final/hero-comparison-390.jpg).

Gallery old/new boards: [desktop](final/gallery-comparison-1440.jpg) · [phone](final/gallery-comparison-390.jpg).

## Selected browser states

| State | Desktop | Phone |
| --- | --- | --- |
| Hero | [1440](final/chromium-1440-hero.png) | [390](final/chromium-390-hero.png) |
| Pointer / pose | [1440](final/chromium-1440-pointer.png) | [touch](final/chromium-390-touch.png) |
| Scroll25% | [1440](final/chromium-1440-scroll-25.png) | [390](final/chromium-390-scroll-25.png) |
| Scroll50% | [1440](final/chromium-1440-scroll-50.png) | [390](final/chromium-390-scroll-50.png) |
| Scroll75% | [1440](final/chromium-1440-scroll-75.png) | [390](final/chromium-390-scroll-75.png) |
| Gallery | [1440](final/chromium-1440-gallery.png) | [390](final/chromium-390-gallery.png) |
| Work | [1440](final/work-1440.png) | [390](final/work-390.png) |
| About | [1440](final/about-1440.png) | [390](final/about-390.png) |
| Notes | [1440](final/notes-1440.png) | [390](final/notes-390.png) |

The `final/` folder includes WebKit/Chromium/Firefox,768/320px, reduced-motion and no-JS captures. Product source is388ead1. [Verification JSON](final/verification.json), [native touch results](final/touch.json). [Pre-fix phone overlap](audit/mobile-overlap-before.png) is retained as a failure reference; it is superseded by final captures.

## Real browser films

- [Desktop1440×900](films/skylight-1440.webm)
- [Phone390×844](films/skylight-390.webm)
- [Recorded actions and runtime errors](films/recordings.json)
- Complete decoded frame contact sheets are under `films/contact/` with a [manifest](films/contact/manifest.json), timestamps and [inspection record](films/contact/review.md). They inspect gross motion/composition only, not original-speed playback or subframe fluidity.

The delivered films come from successful CI43336881471 on product388ead1; the full downloaded artifact digest was verified. The films include a quiet Hero, pointer/touch response, native forward and reverse scroll, actual Gallery drag, next control, native project detail/back, and return to Hero. They were recorded separately from performance sampling.

## Decision and measured limits

[Delivery report](../../sky-edition/report.md) · [Art decision](../../sky-edition/art-decision.md) · [Independent review](../../sky-edition/review.md) · [Performance, including rejected slow trials](../../sky-edition/performance.md)
