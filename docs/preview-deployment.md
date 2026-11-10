# Independent XUANYI 2.3 preview

This separate branch snapshots PR #4 at
31222d9a6140ec84574156dddd13d6179d9343cf.
It never changes main, the four development PRs or the old ChatGPT Sites URL.

ONE-TIME REPOSITORY SETTING
Open Settings > Pages > Build and deployment > Source > GitHub Actions.
Skip the default Jekyll workflow suggestion. This repository currently has Pages disabled.

The workflow publishes the static Next.js export on GitHub project Pages.
After a SUCCESSFUL Pages deployment, the expected preview URL is:
https://xuanyi-king.github.io/xuanyi-portfolio/
Do not assume this URL is live before GitHub confirms it.

Check these paths on the deployed site:
- /xuanyi-portfolio/
- /xuanyi-portfolio/work/
- /xuanyi-portfolio/lab/motion-direction/
- /xuanyi-portfolio/preview-version.json

The build uses Next.js basePath and rewrites native anchors/static public asset
paths ONLY IN THE GITHUB ACTIONS RUNNER, leaving the source build compatible
with the original ChatGPT Sites. The deployed HTML carries noindex metadata
and a preview commit marker. Robots exclusion is not access control: the Pages
preview is publicly accessible once deployed.

The build uploads a downloadable xuanyi-preview-static ZIP artifact even if
Pages deployment is blocked. To update to a newer PR #4 commit, carefully sync
this preview branch to the approved new source version; do not force-push or
merge these preview-only configuration files into production.
