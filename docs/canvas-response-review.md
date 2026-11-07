# Living Canvas — X Response 质量复审

2026-11-07；沿用 PR #3 / `feat/xuanyi-2-2-living-canvas`。开始时重新读取的远端 head 为 `811a2d4656bae7c80885211d3e55bec0d9d8f790`，PR #2 仍未合并，base 未变。没有改 main、合并、强推或新增依赖。

## 实际修复

- **作品区的 X 受力反馈**：编号旁的小 X 根据展廊的连续位置速度轻微反向受力；正反绕回使用未取模的位置，力限制在 ±28。松手收束、隐藏页面、resize、卸载时释放。Hero 滚离后反馈仍可见，导航品牌与链接完全独立。
- `gallery-response.ts` 只有 scoped 订阅与输入采样，没有自己的 RAF。它向现有 `LivingX` / `living-spring` 输入；唯一 renderer 写几何，ScrollTrigger 继续只写外层 transform。没有每帧 React state，也没有 CSS/JS 争抢 `d`。
- **捕获丢失的恢复**：Firefox 窄视口下，鼠标拖出窗口并在窗口外松开，会漏掉 pointerup。重新进入且 `buttons===0` 时取消旧手势，恢复原生详情点击；没有添加平行的鼠标交互引擎。
- **90% 桌面收束**：真实复审发现小 X 距导航仍约 42px 时，约 93% 的包围框高度已被 header 遮住。现让它先沿 header 下方靠近导航的横向通道，再向上收束；移动端路径和两端位置不变。读取边界仅在 refresh，非每帧。
- **图层与小标识开销**：Gallery 保留真实 perspective / translate3d / rotateY；内部平面封面去掉重复 preserve-3d。小 X 只生成可见轮廓，控制输入量化为 1 SVG 单位，跳过重复绘制；满尺寸 Hero/Lab 精度不变。最大控制输入误差 0.5 SVG 单位，在 64px 标识上小于 .064px（不等于对所有表面边缘误差的数学证明）。

## 曲面 A/B 与美术判断

新增真实可操作的 **Tensioned Silk**：截面扭转、随形侧边和局部遮挡；研究页 `/lab/canvas-study/` 同姿态比较静止、舒展、收束及 16/24/32/64px 图标。

**正式版本保留原 Sculpted Silk。** 候选在交叉处更窄、更像薄片，中心承托感反而减弱，未带来足够的空间收益。没有把研究结果强行应用到品牌。原始正式曲面在九个极端姿态下与 `811a2d4` 可见路径逐字节一致，小图标仍做光学校正。

独立审查与实际看图后的结论：新的作品区反馈清楚而克制，不再让不可见的 Hero 承担轮播反馈；没有扩大徽标或再加装饰线。90% 小 X 早消失比材质细节更影响连续性，因此先修轨迹。整体依然保持奶油白、清透蓝和杏子橙，正文与 CTA 不被装饰覆盖。没有采纳未证明有效的 containment / 额外图层 CSS，也没有新增 WebGL。

## 性能：同一脚本，保留不利结果

`npm run compare:canvas` 把精确 `811a2d4` 归档到独立临时目录，执行 npm ci / build，与当前生产导出交替测量。Chromium 145、同一主机、4× CPU、桌面 1440×900 与模拟手机 390×844；正常运行三轮，trace + CPU profiler 另跑，分析仅取 interaction marks 范围。采样期间没有并发构建、其他浏览器或录像。

本地最终性能样本源码为 **825577b**，随后仅修正桌面收束路径的 `25b8664` 另有浏览器验收；CI 会对完整最终 head 重新执行相同测量。不得把这里的数据冒充不同 head 的测量。

| 正常运行 / 3 次样本 | 811a2d4 前 | 825577b 后 |
| --- | --- | --- |
| 桌面 RAF P95 ms | 16.8 / 16.8 / 16.8 | **33.3 / 33.3 / 16.8** |
| 桌面 RAF P99 ms | 50 / 50 / 50 | 50 / 33.4 / 33.4 |
| 桌面 >50ms 间隔合计 | 9 | 6 |
| 桌面最大观测交互 ms | 56 / 72 / 72 | 96 / 88 / 56 |
| 模拟手机 RAF P95 ms | 16.8 / 16.8 / 16.8 | 16.8 / 16.8 / 16.8 |
| 模拟手机 RAF P99 ms | 83.4 / 33.4 / 50 | 33.4 / 33.3 / 33.3 |
| 模拟手机 >50ms 间隔合计 | 6 | 5 |
| 模拟手机最大观测交互 ms | 80 / 72 / 96 | 64 / 96 / 64 |
| CLS（全部样本） | 0 | 0 |

单独 profiler 的 Layerize / 帧：桌面 2.18→1.83ms，手机 1.99→1.21ms。桌面主线程 task 总量 5125→5280ms；手机 paint 121→159ms，新增响应依然有开销。trace 中的 Task、Layout、Paint 等可嵌套，不相加成总耗时。CPU profile 记录 SVG 写入和样条计算热点；分析不将 profiler 的额外成本混入正常 RAF 数据。

结论：定位并降低了嵌套图层的开销，P99 样本有改善，**桌面 P95 退步，不能宣称整体提速或稳定 60 FPS**。此前未经小标识量化的第一组完整对比同样表现混合，保留在本地 `comparison-initial`，没有只挑最好一轮。原有 GSAP ScrollTrigger 的空闲 RAF 在前后都存在；没有声称整页零空闲 RAF。

测量范围：桌面包含 Hero 指针、滚动、三次切换及拖动；手机性能脚本包含滚动和三次触摸按钮切换，横滑正确性及录屏由独立原生 CDP 手势脚本验证。最大观测交互是短实验 Event Timing，不是线上 INP。堆内存短样本与三次进出不等于长期泄漏证明。

## 验证与证据

- 本地 npm ci；最终产品源码 **58 项单测、TypeScript、生产构建、11 内容路由静态导出**通过，MDX / SEO / RSS / Sitemap 保留。
- 新响应回归：Chromium / Firefox / Playwright WebKit × 1440 / 390 / 320 共 9 组，受力上限、方向、归零、导航不动、窗口外松开、详情原生返回、reduced 均验证。
- 收束回归：三引擎 × 1440×900 / 768×1024 / 390×844 / 320×740 共 12 组；25/50/75/90% 正反、原生连续 wheel、resize、端点和 CTA。新增桌面中间可见性测试先 RED，修复后 GREEN。
- 展廊原有三引擎四视口、桌面正反各 100 次、详情返回、无 JS / reduced、多次 SPA 保留；Chromium 原生 CDP 横滑期间新 X 确实改变，纵滑不误切。Next dev StrictMode 三次进出、按住影片暂停、无 runtime/hydration 错误已本地验证。
- Firefox `hasTouch:true` 在空白页也不派发鼠标 PointerEvents；窄屏鼠标回归使用正常鼠标上下文，未用额外事件引擎掩盖模拟器行为。CDP 触摸与物理手机明确区分。
- CI 保留 npm ci / test / typecheck / build / check:export / check:browser / 性能 / StrictMode，并加入完整基线对比与原始 trace 上传，timeout 35 分钟。**远程最终结果以 PR #3 当前 head 的 Checks 为准，不能用旧 811a2d4 的绿灯代替。**

[本轮关键截图、JSON 与视频索引](evidence/canvas-response/README.md)。大体积录屏、原始 PNG、trace 与 CPU profile 放 Actions Artifact（14 天）；旧证据未删除。

## 仍未完成 / 是否 Ready

**保持 Draft。** 新响应和中间收束已修复并有实测证据，但桌面 P95 与部分 layout/paint 代价仍需复核；三次短样本不足以确认所有长尾原因。没有 adb、USB 或远程 Android 调试能力，物理 Android 的横拖 / 纵滑 / 快速点击 / 浏览器返回未验证；Playwright WebKit 也不等于真实 iPhone Safari。低端 GPU、热降频、耗电、长期后台恢复与内存趋势、线上 INP/FPS 尚未验证。研究候选没有取代正式曲面，空间质感的提升不算已经完成。

一次新鲜独立终审为 0 Critical / 1 Important / 0 Minor；Important 为桌面 90% 过早遮挡，已先复现再修复。没有把通过自动化当作美术合格证明，也没有合并 PR。
