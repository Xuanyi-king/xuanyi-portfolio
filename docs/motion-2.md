# XUANYI 2.0 · Curiosity in Motion

## 已核对的基线

2026-11-06，main `5ec8f79`。原版通用 reveal、整体 X 变换、静态 SVG 封面、缺少跨页封面连接与缺少真实浏览器验收的问题均存在。原代码清理已有改进，但指针移动仍逐次创建 tween。

## 实现

- `src/motion/tokens.ts`：主要时长、缓动、弹簧与形变幅度；`geometry.ts`：保持端点不动的双曲线生成及有界时间步积分。
- `hero.ts`：背景亮度 → 字母分组遮罩 → 两条曲带错时展开 → 文案与辅助元素落定。约 1.65 秒完成，无交互锁。重复访问缩短文字阶段。
- `living-x.tsx`：两条曲线及各自高光同步形变，只有运动期间运行一个 rAF；停止后休眠，卸载取消。首屏对鼠标温和响应；Lab 两个 48px 牵引点支持指针捕获、触摸、方向键、取消与失焦恢复。
- `pointer.ts`：卡片使用可复用 GSAP quickTo，细指针设备才启用。
- `reveals.ts`：INTRO SplitText 逐行遮罩（自动重分行）；首页作品图片裁切与文字错位；ABOUT 小幅纸张转动；NOTES 纯淡入；LAB 单次轻转。Work 筛选列表保持正文可见，避免位置重排导致旧 ScrollTrigger 隐藏文字。
- `project-preview.tsx`：原创路由线与知识影像概念动效。仅 hover / keyboard focus 播放；移动端使用完整静态封面。没有视频请求。
- 作品封面与标题使用原生链接。封面图片与详情图片共享唯一 `view-transition-name`，配合跨文档 View Transitions；返回列表同样使用原生链接。未拦截导航，也未覆写浏览器历史，不支持时正常跳转。
- 三个公开项目均进入首页。知乎项目使用账号自身公开仓库 `public/screenshots/home.jpg` 的真实截图；详情注明出处。其他两个仍为明确标识的原创概念展示，不冒充产品界面。
- 导航下划线、箭头、按压、筛选、形态预设、返回顶部采用不同的轻量反馈。
- 减少动态效果：关闭入场、滚动与鼠标装饰运动；Lab 的明确操作直接更新静态形态；CSS 概念循环停止。禁用 JS 时内容默认可见。

## 调研与取舍

实际读取了以下官方页面和仓库文档／部分实现资料。当前没有 Browser js 或 cua_repl 工具，**没有观看这些 Demo 的真实播放**，不把文档调研称作视觉观察。

- https://haoqi.design/ ：延续清晰作品入口与编辑式结构的方向；未复制布局、素材与动效代码。
- https://gsap.com/docs/v3/GSAP/gsap.quickTo()/ ：采用复用 tween 的指针方式。
- https://gsap.com/docs/v3/Plugins/SplitText/ ：采用自适应逐行遮罩并由 matchMedia context 回收。
- https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/ ：现有路径拓扑相同，只改变四个控制坐标，无需额外 MorphSVG 运行代码。
- https://gsap.com/docs/v3/Plugins/Flip/ ：跨文档 DOM 生命周期不适合持有旧节点；选原生 View Transitions，避免 App Router 导航阻塞。
- https://github.com/giraffe-tree/awesome-web-effects ：查阅效果目录，未复制实现。
- https://github.com/Jakubantalik/transitions.dev ：查阅交互分类和可移植 CSS 思路，采用原点清晰、有限按压和箭头反馈。
- https://github.com/ckissi/kinetics ：查阅弹簧模拟器的时间步与静止停止策略；独立实现本项目的曲线积分器，未引入库代码。
- https://github.com/codse/animata 、https://motion.dev/ ：能力与依赖调研。已有 GSAP 足够，因此没有新增 Motion、Three.js、Theatre.js 或其他动画引擎依赖。

GSAP / SplitText 随已有 gsap 包使用，遵守其标准许可；没有把 GSAP 宣称为 MIT，也没有复制其他仓库素材／付费配方。

## 验证与未完成事项

数学测试覆盖静态品牌路径、极端输入约束、弹簧恢复和后台长帧后的稳定性；原内容与筛选测试保留。运行四个要求的命令，结果另见 verification.md。

**浏览器验收未完成。** 当前 managed Sites 环境仍无可调用浏览器工具，按其环境规则未启动替代浏览器渠道。1440×900、768×1024、390×844、375×812 的截图、真实触摸、点击／返回、首屏录屏、FPS 与长任务检查均未执行。没有生成伪造证据。构建、数学测试和代码审查不能证明视觉完成度，因此 PR 保持 Draft，待真实浏览器验收后再决定是否合并。

性能措施属于代码层证据：弹簧静止时停止 rAF，quickTo 复用，触摸禁用卡片视差，所有监听器卸载清理，预览动画仅在交互时播放，没有新增视频或 WebGL。不能据此声称 60 FPS 已验证。
