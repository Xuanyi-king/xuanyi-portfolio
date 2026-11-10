> 新一轮：[The Passing Curve · Director’s Cut证据](../passing-curve/README.md)。旧A/B证据仍保留。

# Motion Direction 2.3 · 真实实验

正式页面仍选择2.2；这里是未通过集成门槛的导演研究。实验入口 `/lab/motion-direction/`，noindex，可Play/Pause/Restart/拖动进度，或切换原生滚动。

- [1440×900 A/B关键状态](AB-1440.jpg)：0/25/50/75/90/100%。
- [768×1024](AB-768.jpg) · [390×844](AB-390.jpg) · [320×740](AB-320.jpg)：0/50/100%；全部中间帧在Artifact。
- [三引擎四视口12组结果](browser-results.json)。
- [样片性能](prototype-performance.json) 与 [正式首页三轮前后原始数据](homepage-comparison.json)。
- [审查](../../motion-direction-2-3/audit.md) · [Motion Score](../../motion-direction-2-3/motion-score.md) · [美术判断与评分](../../motion-direction-2-3/decision.md) · [性能解释](../../motion-direction-2-3/performance.md) · [验证限制](../../motion-direction-2-3/verification.md)。

JPEG只缩小、压缩、拼接运行中截图；没有生成图。源码d85da9d，后续证据/脚本提交不改变画布视觉。旧轮次证据未删除，新Git证据约0.5MB。

## 完整实际录屏

打开本实验PR的Portfolio CI → browser-evidence Artifact，保留14天，过期可同提交重新运行。路径：

- `motion-direction/films/A-1440-score.webm`、`B-1440-score.webm`：10秒网页导演预演，文件约11秒。
- `motion-direction/films/A-390-score.webm`、`B-390-score.webm`：手机视口。
- `motion-direction/films/scroll-reverse.webm`：真实wheel与快速反向。
- `motion-direction/films/reduced.webm`：减少动态效果的静态分段。
- `motion-direction/chromium-{1440,768,390,320}-interaction.webm`：进度、暂停、偏好往返、键盘作品切换与原生滚动控制。
- `living-canvas/chromium/gallery-drag-wrap.webm`、`gallery-detail-return.webm`：保持的正式2.2路径，不冒充实验页新增的历史恢复能力。
- `response-review/comparison/{before,after}/profile/living-canvas/`：正式首页的独立原始trace、CPU profile与Layout/Paint分析。

已完整解码全时段时间码序列并实际看图；当前没有直接视频播放界面，未完成实时播放审美验收，原始WebM供直接播放复审。不声称手机视口是真机Android/iPhone。

## 复现

`npm ci`、`npm test`、`npm run typecheck`、`npm run build`、`npm run check:export`。
安装Playwright三引擎，运行 `npm run check:browser` 和 `npm run check:direction`。
录制需先服务out（例如3010端口），再运行 `BROWSER_BASE_URL=http://localhost:3010 npm run record:direction`。
性能：同URL运行 `npm run measure:direction`；正式前后比较用 `CANVAS_BASELINE_SHA=75a1e19fe63206c348548b3cfe969355499f7713 npm run compare:canvas`。不并发运行录像、构建、其他浏览器或图像转换。

实验页面不保存预演历史进度；进入详情后返回可能回到预演初始。未通过正式集成门槛，保持Draft。
