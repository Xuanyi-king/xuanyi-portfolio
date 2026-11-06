# PR #2 · Final Polish · 真实运行证据

所有图都来自生产静态导出页面的 Playwright 实际渲染；JPEG 仅压缩 PNG 或拼接真实画面，没有生成图。旧证据未覆盖、未删除。本目录约 608 KiB，没有新增视频到 Git。

## 品牌识别比较

相同的 1440×900 / 390×844 视口、同一现有页面中的 DOM/CSS 原型：

| 方案 | 桌面 | 手机 | 选择 |
| --- | --- | --- | --- |
| Author Byline：姓名在主句之前 | [桌面](author-byline-desktop.jpg) | [手机](author-byline-mobile.jpg) | 采用：先识别人，再进入艺术主句 |
| Artist Signature：姓名在 X 下方 | [桌面](artist-signature-desktop.jpg) | [手机](artist-signature-mobile.jpg) | 不采用：手机挤近介绍，身份较像作品签名 |

产品仅保留一套正式设计，没有切换器或备用页面。

## 最终首屏与作品

- 之前：[桌面](../final/hero-desktop.png) / [手机](../final/hero-mobile.png)。
- 现在：[1440×900](hero-desktop.jpg) / [390×844](hero-mobile.jpg) / [320×740 修正后](hero-narrow-fixed.jpg)。[修正前窄屏](hero-narrow.jpg)保留作历史证据。
- [Living Thread 实际录屏关键帧](thread-keyframes.jpg)：按时间先上排、后下排，0、0.5、1、1.5、2、2.5 秒。
- [Router 前后](router-before-after.jpg)：左为旧运行截图，右为新运行截图的同尺寸局部；都来自同一真实设置页，未重绘 UI。
- [Film 真实节选播放](film-preview.jpg) / [Multiverse 真实经历揭示界面](multiverse-preview.jpg)。

## 验收与录屏

本地执行 `npm ci`、`npm test`（24/24，保留原 21 项）、`npm run typecheck`、`npm run build`、`npm run check:export`、`npm run check:browser`。Chromium 原有 12 组，加三浏览器各 7 组；页面运行异常 0。

| 浏览器 | CSS 路径形变 | 跨文档转场检测 | 实测 |
| --- | --- | --- | --- |
| Chromium 145.0.7632.6 | 支持 | 支持 | 完整入场、单一控制权、预览、导航、减少动态效果 |
| Firefox 146.0.1 | 支持 | 未支持 | 曲线正常，普通原生导航与返回正常 |
| Playwright WebKit 26.0 | 未支持 | 支持 | 静态曲线入场，JS 指针形变、影片、导航正常 |

逐帧审计：Chromium / Firefox 初始 CSS 控制阶段 JS 路径写入为 **0**，交接控制点差值为 **0**；提前进入的指针在交接后生效，无需再移动。WebKit 没有 CSS 路径入场，直接进入稳定 spring 状态。标题从不隐藏。曲线、影片停止等异步状态用实际条件等待，不能用一帧的事件到达时间判断功能失败。

完整 PNG、JSON 和 WebM 不再进 Git。运行 `npm run check:browser` 后在本地忽略目录 `artifacts/browser/`，远程在 [Portfolio CI](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/workflows/ci.yml) 的 **browser-evidence** Artifact（14 天）中：

- `chromium/hero-motion.webm`：首屏入场与指针，约 9 秒。
- `chromium/home-scroll.webm`：首页到作品。
- `chromium/project-transition.webm`：真实预览、详情、浏览器后退与返回。
- `chromium/lab-interaction.webm` / `lab-touch.webm`：真实页面的鼠标、键盘和模拟触摸。
- `{chromium,firefox,webkit}/polish/interaction.webm`：本轮跨浏览器完整交互。
- `chromium/results.json`、`cross-browser-results.json`、各引擎 `polish/curve-audit.json`：版本、能力、写入审计、检查结果。

可复现：`npx playwright install --with-deps chromium firefox webkit`，然后执行六条项目命令。CI Ubuntu 24.04 使用完整依赖安装。本地无 root，WebKit 依赖解压到临时目录并链接进浏览器运行时；实际浏览器成功启动及验收后才计为通过。仅跳过无法看到临时库的 ldconfig 安装检查，没有跳过网站测试。

独立视觉复核实际看过两套署名、预览及三浏览器的桌面 / 手机 / 窄屏九张图。最终结论：身份辨识更清楚，句末与 X 有连续视线，320px 线条不碰说明，关闭动画仍成立；无剩余阻塞问题。中文系统字体有轻微平台差异。

边界：没有 iPhone / Android 真机或 macOS Safari 测试；Playwright WebKit 不等于这些设备。未测真实设备 FPS、LCP、长任务；稳定帧检查和录屏不是性能评分。没有重新运行上游项目，素材固定来源见 [素材记录](../../../project-visual-sources.md)。
