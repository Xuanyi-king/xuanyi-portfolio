# Independent read-only review · 2026-11-10

One fresh reviewer inspected the working changes, plan, and actual Chromium stills. No browser runs or edits by reviewer. Original snapshot had no Critical, four Important findings:

1. Stopped70% + select another project could leave new active link at old side opacity. Reproduced in real browser before fix. Local renderer now supplies side opacity; semantic `[data-gallery-active=true]` always restores full link opacity via CSS, preserving controller ownership.
2. Resize recomputed geometry but kept director clock playing. Real browser regression reproduced continuing progress; resize now stops then reads layout and repaints.
3. Shallow CI did not ensure both historical SHA objects exist before archive. Exact `cat-file` / fetch-by-SHA added before archive; no ref is substituted.
4. Actual768px60% frame had Intro over category text. Bounds regression reproduced overlap. Tablet gets earlier Intro withdrawal before metadata starts and a wider single-line block. A fixed tablet guide avoids a dangling curve start below the smaller X.

Added actual horizontal touch movement AND vertical touch over Gallery with window.scrollY assertion, rather than inferring compatibility from CSS. Measurements run only after implementation commit; source fingerprint/dirty state also recorded. These address the reviewer’s two evidence notes.

Reviewer’s art verdict: clearly improves old A’s empty middle; does not establish an overall winner over2.2’s editorial hierarchy. Native phone deliberately omits the curve in normal document flow. Keep Lab unless all adoption gates independently pass. No numerical score was requested or manufactured.

Considered/set aside by reviewer: clamped scroll/reverse; reduced-motion/visibility; cached resize geometry; existing Gallery input ownership; saved final title/tag/control containment at four widths; endpoint detail return; no mobile pin; performance/browser completion pending; no assessment of full-speed playback or physical phones. Final verification report is authoritative for checks run after fixes, not this preliminary review.
