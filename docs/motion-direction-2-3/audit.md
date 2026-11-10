> 2026-11-10：[The Passing Curve 补充审查与最终交付](directors-cut/report.md)。正式2.2保留；下文为上一轮记录。

# Motion Art Direction Audit — 2.2 → 2.3

基线：执行时重新读取 PR #3，OPEN / 未合并，head 75a1e19fe63206c348548b3cfe969355499f7713。独立实验分支 feat/xuanyi-2-3-motion-direction，以 PR #3 head 分支为 base。

## 证据与观看限制

GitHub 最新成功 push run 42332256637，Artifact 13558820299，API 再查未过期。使用上一轮已实际下载、哈希核验的完整文件（SHA256 7a95a7ceb8b6fc070dfc7c62c28b30b7049b9d5f9f34d27228933eb1b6bf3b62）。六段均全时段以 2fps 解码为带时间标记的序列并实际观察；没有直接视频播放界面，因此不是实时播放验收，不能据此精确判断亚帧抖动。原始 WebM 保留供直接播放复审。时间点是各录屏相对时间，不是网站统一时间轴。

## 四个值得改善的问题

1. **连续性断在退出之后**：desktop-folding-canvas.webm 3.5s 主标题开始退出，4.0s X 已很小，4.5s Intro 成为主体，5.0s Gallery 标题进入。运动主角从 X 切换为自然文档滚动，几乎没有方向或形态的接棒。应研究同一条弧线如何成为作品的落点，而非继续延长收缩。
2. **手机收束的视觉优先级较弱**：mobile-folding-canvas.webm 2.0s X 在右侧，2.5s 已变为小符号而 CTA 仍在上方，3.0s Intro / Gallery 切换。可读性很好，但缩小发生在作品世界尚未进入之前；中间画面成立，叙事关联不足。新样片需让作品先建立落点，再让 X 退为线索。
3. **展廊焦点更多来自尺寸，缺少接续原因**：gallery-drag-wrap.webm 2.0—3.5s Film 进入中央，4.0s 实际帧出现；6.0—8.0s 快速反向时侧卡与中心关系依旧是标准 Coverflow。轮播是可靠的，不重写；研究它进入画面的空间组织，避免给三个作品强加相同的新 hover。
4. **品牌反馈与作品脱节**：gallery-response.webm 1.5—4.0s，X 在编号旁有真实局部形变，但在全画面中难成为空间语言。放大徽标会抢作品；更值得尝试把前幕路径转成作品的水平基线，或把 X 的曲面方向转成作品扇面。

## 六项判断

- Hierarchy：静止首屏标题为主，运动主要由 X 承担；清楚。后续主角传递不足。
- Choreography：Hero 0—1.5s 曲带错时舒展较精致；2—7s 指针演示保留标题稳定，这是应保留的停顿。
- Continuity：详情返回值得保留。gallery-detail-return.webm 2.5—3.5s 封面进入 Film 详情，4.0—5.0s 回到作品，原生路径没有多余观看步骤。
- Spatial composition：收束重排了 Hero，但 Intro / Gallery 主要仍是独立 reveal，尚未共享空间线索。
- Material：杏色前、蓝色后可辨；轻薄表面合适，不应继续加模糊和阴影。更剧烈形变反而会损坏它。
- Restraint：没有理由加常驻旋转或自动轮播。应删去候选中多余的轨道、贯穿正文的线和持续呼吸。

## 实验边界

A Continuous Thread：把曲线从标题旁的弧线展开为作品落点。B Spatial Unfolding：X 侧退，作品从曲面交叉处以不同深度展开。两套使用真实 LivingX、ProjectScene、LivingGallery，10s 可拖动导演预演与原生滚动模式；一个外层进度映射，不写 SVG d、不写轮播内部 transform。正式首页保持 2.2，只有真实视觉与性能门槛通过才集成。
