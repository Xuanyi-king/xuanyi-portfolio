# XUANYI Sky Ribbon independent GitHub Pages preview

This preview branch displays Sky Ribbon (3D Sky Edition) from PR #5, source commit
ac6fe8cd0ef2b30634f8e6f6c3721eaa48702826, on the homepage.

Preview destination (after successful GitHub Pages deployment):
https://xuanyi-king.github.io/xuanyi-portfolio/

Additional previews:
- /xuanyi-portfolio/lab/sky-edition/ — 3D Sky Edition
- /xuanyi-portfolio/lab/sky-edition/cloud-silk/ — Cloud Silk A
- /xuanyi-portfolio/lab/sky-edition/sky-ribbon/ — Sky Ribbon B
- /xuanyi-portfolio/lab/motion-direction/ — older motion study
- /xuanyi-portfolio/preview-version.json — source SHA

This branch is preview-only. It does not modify main, PR #5 or the original
https://xuanyi-curiosity.astutebook516.chatgpt.site/
The homepage intentionally previews Sky Ribbon even though PR #5 keeps its
official homepage unchanged. The lab banner indicates an experimental design.

The workflow applies a GitHub Pages basePath and adjusts native anchor/public
asset paths in its runner checkout. All HTML includes noindex,nofollow and robots
disallows indexing. The site is still publicly accessible.

To update the preview in future, sync from an approved PR #5 SHA while preserving
preview-specific configuration. Do not merge preview scripts into production.
GitHub Pages source must stay set to GitHub Actions.
