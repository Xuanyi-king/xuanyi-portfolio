# Living Canvas Implementation Plan

> Execute inline with superpowers:executing-plans; one fresh whole-branch reviewer at the end.

Goal: 以最新PR2为基线交付一套闭合曲面、可逆Hero和无限3D作品展廊。
Architecture: SVG geometry owner / ScrollTrigger outer transforms / independent scalar gallery controller; native links and static fallback.
Spec: docs/superpowers/specs/2026-11-06-living-canvas-design.md

## Global Constraints
- XUANYI / 玄屹；Curiosity Takes Shape；只有真实三个项目；无新动画库/WebGL/pin/auto-play。
- 保留路由、真实素材、SEO/MDX/RSS/静态导出；不强推、不合并；身份核验后提交。
- 一个语义项目实例；无JS静态网格、reduced、键盘和纵向触摸。

## Review Focus
- 无限边界两侧的淡出是否隐藏跳变，2项目降级是否空白。
- 拖动中点开链接/长按/多触点/垂直滑动是否误导航。
- 侧卡焦点、影片播放与快切的活动状态是否一致。
- 带状边界在极限形变下的遮挡与裁切。
- 快速返回/resize/reduced/StrictMode是否残留RAF、路径或变换。

### Task 1 — Curved identity and folding
Files: x-mark/living-x, motion surface/intro/hero/page, canvas-study route, tests/surface, browser identity.
Consumes existing curve-owner/spring; produces silkSurface + single renderer and reversible outer ScrollTrigger.
- [ ] 复用e508f26已验证几何/收束源码与6个测试，保留来源说明；先跑基线24项。
- [ ] 同状态真实渲染 Sculpted Silk / Translucent Fold，比较厚度、交叉、光照和小图标；选择正式材质。
- [ ] 验证回滚/导航对齐/CTA留白/reduced与极端Lab拖动；静态SVG资产同源生成。
- [ ] 身份核验、测试/看图后提交。

### Task 2 — Independent gallery controller
Files: motion/gallery-model.ts, gallery-controller.ts, gallery-gesture.ts, tests/gallery*.test.ts.
Interface: frameFor(index,position,count,width,reduced) → transform/opacity/zIndex; createGalleryController(count,callbacks,scheduler) → press/drag/release/step/select/cancel/resize/reduced/dispose/read.
- [ ] 先写模运算/边界连续/1,2,3,4,6/正反100步/中断/dispose/方向锁与长按测试，确认缺失功能失败。
- [ ] 实现单RAF、受界惯性、吸附、目标累加、方向锁与点击抑制。
- [ ] 所有单测通过后提交。

### Task 3 — Real 3D study and homepage
Files: living-gallery.tsx, gallery.css, app/page.tsx, project-media.tsx; study route.
Consumes frameFor/controller/gesture and existing ProjectScene/projects; emits semantic native links and actual gallery.
- [ ] 先在study页面实测鼠标/键盘/触摸/循环/视频，再接首页。
- [ ] 同一份项目DOM、明确焦点、无JS网格、reduced即时平面模式、影片仅中心且明确意图。
- [ ] 浏览器复现拖动和点击区分、100次往返、惯性中断、纵向不误触、详情返回与resize。
- [ ] 试验X Rail；只在比箭头编号清楚时采用；看图通过再提交。

### Task 4 — Verification, evidence, stacked PR
Files: browser scripts/performance harness, CI, docs/evidence/living-canvas and verification doc.
- [ ] npm ci/test/typecheck/build/check:export/check:browser；保留既有回归并扩展三浏览器四视口。
- [ ] 实际截图、曲面/正反滚动/慢快拖动/首尾/反向/触摸/详情录屏，视频只入Artifact。
- [ ] 可复现性能样本，独立视觉与代码终审；Important修复先RED后GREEN再全套。
- [ ] 作者核验、推送，创建base为PR2分支的新PR；如缺阶段保持Draft，不合并。
