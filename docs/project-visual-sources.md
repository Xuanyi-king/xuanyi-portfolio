# 详情页项目素材来源

这些是项目仓库中的实际材料；首页 Router / Film 的图形仍为原创概念封面。素材截图不代表此次 Portfolio 浏览器验收。

- `public/projects/router-settings.png`：原文件完整复制自 [DSH-Adaptive-Router / s43-settings-desktop-light.png](https://github.com/Xuanyi-king/DSH-Adaptive-Router/blob/c988ce7fcb4cc6b711c13f65a075fcc46a35c61a/docs/screenshots/s43-settings-desktop-light.png)。用户自身公开仓库，固定版本 `c988ce7`。画面为含离线验证候选项的原生设置页，不作为线上模型路由效果的证明。未重绘或更改截图中的数据。
- `public/projects/atlas-frame.jpg`：从 [Vibe Knowledge Film / evidence/atlas/final.mp4](https://github.com/Xuanyi-king/vibe-knowledge-film/blob/fa4749548d868a43bd22c9b24ff7a8ae89fdbb5d/evidence/atlas/final.mp4) 的第 10 秒抽帧，固定版本 `fa47495`。命令：`ffmpeg -ss 10 -i final.mp4 -frames:v 1 -q:v 3 atlas-frame.jpg`。原始帧未重绘或生成替换；JPEG 编码仅用于网页加载。
- Atlas 是仓库自己的原创影片《地图是一种选择》，[制作说明](https://github.com/Xuanyi-king/vibe-knowledge-film/blob/fa4749548d868a43bd22c9b24ff7a8ae89fdbb5d/examples/atlas/README.md)标明影片脚本/绘制/配乐方法为 MIT，地理数据使用 D3 与 Natural Earth。保留 [原 MIT 许可与参考片排除条款](licenses/vibe-knowledge-film.txt)；没有采用被排除的 stim_B / info_C 参考片材料。完整第三方声明仍以源仓库为准。
- `public/covers/zhihu-real.jpg`：此前 PR 中已采用的自身公开项目首页截图，本轮继续保留。

详情页有可见材料类型、说明和固定版本源码链接，另可打开完整原图核验。没有在这个 Portfolio 中重新运行上述项目，也不把仓库截图称作本次现场运行截图。

## 2.1 补充材料

- `atlas-excerpt.webm`：同一固定版本的 `evidence/atlas/final.mp4`，截取 00:08—00:16，去音频、缩至 960px、24fps、VP9，作为明确标注的静音节选，不冒充完整影片。
- `atlas-sphere.jpg` / `atlas-scale.jpg` / `atlas-area.jpg`：同一成片 3、26、49 秒抽帧（JPEG），没有重绘地图或字幕。原仓库 MIT 与 D3 / Natural Earth 声明继续适用；完整源链接保留在影片案例中。
- `multiverse-experience-reveal.jpg` / `multiverse-play-act1.jpg`：完整复制自 [zhihu-multiverse 固定版本 2901348 的 public/screenshots](https://github.com/Xuanyi-king/zhihu-multiverse/tree/290134821dceb9a41d41925f0b8c0f469d95b211/public/screenshots)，对应 `experience-reveal.jpg` 和 `play-act1.jpg`。只作为原项目的真实界面档案，不声称本轮重新运行了该项目。

影片处理示例：`ffmpeg -ss 8 -i final.mp4 -t 8 -an -vf 'scale=960:-2,fps=24' -c:v libvpx-vp9 -crf 39 -b:v 0 atlas-excerpt.webm`。首屏默认不请求视频；只有明确预览才赋予 src。项目视觉与 Portfolio 验收截图分别位于 public/projects 与 docs/evidence，不能混为证据。
