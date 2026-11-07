# Canvas Response Implementation Plan

> Execute inline with superpowers:executing-plans; one fresh final reviewer.

Goal: 在现有PR #3上增加克制的X受力反馈，以真实A/B与trace完成曲面和性能精修。
Architecture: Gallery连续位置 → scoped response input → 现有LivingX弹簧与唯一renderer；滚动仍只控制外层。分析追踪与正常测量分离。
Spec: docs/superpowers/specs/2026-11-07-canvas-response-design.md

## Global Constraints
- 同一PR/分支，保留XUANYI/玄屹、真实项目、MDX/SEO/RSS/静态导出；无新动画库、无合并/强推。
- 不使用每帧React state，不争抢SVG d；导航独立；reduced/noJS/键盘/原生纵向触摸可用。
- Android物理设备未知不得冒充已验证；视频/trace只入Artifact。

## Review Focus
- 连续位置绕回、100次快切、暂停后重启时受力是否有界且方向稳定。
- StrictMode/SPA/媒体偏好切换是否重复订阅，静止后是否仍有RAF。
- 曲面优化是否改变旧轮廓或极端形变的遮挡，是否损坏小图标。
- profiler/录像/图片冷加载开销是否被误判成动画瓶颈。
- 25/50/75/90%反向输入时小X是否突然藏入header或碰撞正文。

### Task 1 — Baseline and gallery response
Files: scripts/measure-canvas.mjs, motion/gallery-response.ts, components/living-x.tsx, living-gallery.tsx, gallery.css, tests/gallery-response.test.ts.
Interface: createGalleryResponse returns sample(position,time), reset(), subscribe(listener); listener receives bounded force or zero. LivingX accepts stable drive subscription and compact mode, retaining the same geometry writer.
- [ ] 构建811a2d4生产快照；记录相同操作的trace/CPU profile与未追踪性能样本。
- [ ] 先写有界/方向/绕回/归零/取消订阅测试，运行缺失API失败，再实现不含RAF的输入桥。
- [ ] 接入编号旁小X；真实拖动/点击/纵向/键盘/reduced/返回/StrictMode验证，并检查静止资源。
- [ ] 全单测/类型/构建通过后核验身份提交，不立即推送。

### Task 2 — Surface candidate and folding
Files: motion/surface.ts, components/x-mark.tsx, living-x.tsx, canvas-study.tsx, tests/surface*.test.ts; browser evidence.
- [ ] 为候选随形薄边和扭转的有限闭合轮廓补测试，先失败再实现；旧默认几何不因实验改变。
- [ ] 同姿态/视口真实A/B静止、舒展、受力及小图标；实际看图决定采用或保留基线，记理由。
- [ ] 真实捕获25/50/75/90%及反向连续滚动；若发现问题先复现测试再修。
- [ ] 全单测/类型/构建与针对性浏览器检查通过后提交。

### Task 3 — Trace-led optimization and delivery
Files: trace analysis helper/tests as needed, only evidence-identified hot path source, browser regression, CI, docs/evidence/canvas-response.
- [ ] 从trace定位具体JS/布局/绘制或自动化测量开销；单一假设验证，先行为/几何回归再优化。
- [ ] 使用同一脚本/CPU/视口前后多样本复测；保存原始数据和trace，不以一次最好成绩作结论。
- [ ] npm test/typecheck/build/check:export/check:browser/check:strict；原有回归保留。
- [ ] 一次新鲜独立终审，Important先RED→GREEN并全套验证；保存前后图/短录屏/明确限制。
- [ ] 作者核验后推送现有PR #3，读取最终CI与Artifact；不合并，真实判断Draft/Ready。
