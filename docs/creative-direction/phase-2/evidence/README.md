# Phase 2 证据

最终页面矩阵见 browser-results.json：6组Chromium真实网格、6组Firefox静态回退，均有桌面1440×900和手机390×844。它由完整矩阵中未改变的A/C结果与B定向复核合成；不是把重复复核算成更多种设备。

- `browser-results-full-matrix.json`：第一次完整通过的12组。
- `recheck-b/browser-results.json`：B可访问性收紧后的4组定向复核；图像/影片已整理回本目录，不保留冗余副本。
- `browser-results-before-fixes.json`、`*-FAIL.png`：早期B手机采样点被前景文字挡住的记录，不能当最终状态。
- `b-focus-recheck.json`：B展开中间态的inert/aria-hidden/Tab目标检查。
- `interaction-results.json`：6条跨引擎功能路径、两条320px组检查、一个无JS入口检查。Firefox回退不声称验证WebGL。
- `webkit-availability.json`：真实启动失败，记录缺失宿主库。
- `performance.json`：不录屏的48次同条件采样；rAF间隔不等于渲染FPS，末次LCP候选包含脚本滚动，不作为初始LCP结论。
- `logs/`：构建、类型、67项既有单测、18路由导出、浏览器、交互与性能输出。
- `implementation-files-sha256.json`：本轮实际产品文件和package.json的内容hash。
- `films-manifest.json`：最终六段影片的尺寸、时长、字节与SHA256。
- `final-verification.json`：提交前范围、媒体hash、ZIP校验和测试结果核对。
- `portable-package.json`：可下载的本地静态包hash；不是部署。

每案/视口/引擎的 `*-hero.png`、`*-interaction.png`、`*-work.png`、`*-restored.png` 是真实页面截图。Chromium六段影片位于films，保留原速和真实加载。每段 `*-film-contact.jpg` 是等时间距10帧接触表，主代理检查了这些样本，未宣称完整原速人眼看过所有影片。Firefox图像显示其回退路径，不代表同等三维效果。

素材全部为仓库已有真实项目截图/片段或本轮自行编写的三维网格；没有将参考站素材放入原型。来源与状态见上级README及src/data/projects.ts。
