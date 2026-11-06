# XUANYI 2.0 · Curiosity in Motion

## 已核对的基线

2026-11-06，main `5ec8f79`。原版通用 reveal、整体 X 变换、静态 SVG 封面、缺少跨页封面连接与缺少真实浏览器验收的问题均存在。原代码清理已有改进，但指针移动仍逐次创建 tween。

## 实现

- `src/motion/tokens.ts`：主要时长、缓动、弹簧与形变幅度；`geometry.ts`：保持端点不动的双曲线生成及有界时间步积分。
- `hero.ts`：背景亮度 → 字母分组遮罩 → 两条曲带错时展开 → 文案与辅助元素落定。约 1.65 秒完成，无交互锁。重复访问缩短文字阶段。
- `living-x.tsx`：两条曲线及各自高光同步形变，只有运动期间运行一个 rAF；停止后休眠，卸载取消。首屏对鼠标温和响应；Lab 两个 48px 牵引点支持指针捕获、触摸、方向键、取消与失焦恢复。
- `pointer.ts`：卡片使用可复用 GSAP quickTo，细指针设备才启用。
- `intro.ts`：仅首页按需加载 INTRO SplitText 逐行遮罩（自动重分行）；首页作品图片裁切与文字错位；ABOUT 小幅纸张转动；NOTES 纯淡入；LAB 单次轻转。Work 筛选列表保持正文可见，避免位置重排导致旧 ScrollTrigger 隐藏文字。
- `project-preview.tsx`：沿原有图形绘制透明路由信号与胶片边缘高光，保留原始封面，不再整屏替换。仅 hover / keyboard focus 播放；静态图仍完整可见。没有视频请求。
- 作品封面与标题使用原生链接。完整可见的 ProjectScene 在列表与详情共享唯一 `view-transition-name`，配合跨文档 View Transitions；返回列表同样使用原生链接。未拦截导航，也未覆写浏览器历史，不支持时正常跳转。
- 三个公开项目均进入首页。知乎项目使用账号自身公开仓库 `public/screenshots/home.jpg` 的真实截图；详情注明出处。其他两个仍为明确标识的原创概念展示，不冒充产品界面。
- 导航下划线、箭头、按压、筛选、形态预设、返回顶部采用不同的轻量反馈。
- 减少动态效果：关闭入场、滚动与鼠标装饰运动；Lab 的明确操作直接更新静态形态；CSS 概念循环停止。禁用 JS 时内容默认可见。

## 调研与取舍

实际读取了以下官方页面和仓库文档／部分实现资料。当前没有 Browser js 或 cua_repl 工具，**没有观看这些 Demo 的真实播放**，不把文档调研称作视觉观察。

- https://haoqi.design/ ：延续清晰作品入口与编辑式结构的方向；未复制布局、素材与动效代码。
- https://gsap.com/docs/v3/GSAP/gsap.quickTo()/ ：采用复用 tween 的指针方式。
- https://gsap.com/docs/v3/Plugins/SplitText/ ：采用自适应逐行遮罩并由 GSAP context 回收。
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


## PR #1 质量复审修复

- `living-spring.ts` 保存位置、速度和指针输入。组件的形态、强度和 resetToken 只更新目标，不重建控制器；重置也不再通过 React key 重挂载。原生 rAF 使用包装函数，避免 Window receiver 兼容性问题。
- `project-scene.tsx` 统一列表与详情的图片、透明动效层和真实截图画框。整个可见场景命名，图片本身不命名；所有项目详情入口、下一项目与回到作品均使用带尾斜杠的原生链接。没有导航拦截、延时跳转或 history 覆写。
- 知乎项目真实截图完整呈现在浅蓝画框内，保留原比例，配合细线位移反馈。序号移到图片外的项目分类行，避免覆盖封面原有标题。其他两个项目仍为概念封面，没有新增或伪造产品功能素材。
- Hero 独立代码美术审查后改为共享网格：桌面与平板图文共同分配空间；手机 X 占据自己的单元格，中文介绍自然接在下一行。移除固定 118px 避让空白，手机隐藏 edition/orbit 辅助小字。美术结论仍需运行页面截图复核。
- `preference.ts` 管理可取消的异步动画加载，偏好改变与卸载均撤销旧任务；`page.ts` 按需装载 Hero / Intro。减少动态效果时不请求 GSAP，SplitText 仅随首页 Intro 加载。历史恢复不重播章节入场，慢加载不重新隐藏已读 Hero。
- `pointer.ts` 测量不旋转的链接，而非旋转中的封面；入场缓存边界，滚动/尺寸变化时失效。quickTo 只负责外层倾斜，移除原有内层图片同时旋转、缩放的规则。
- `motion.css` 集中动画样式，去掉重复字母遮罩规则、旧的全屏预览样式及根页面滑动转场。无 JS 的静态内容和不支持跨文档转场的普通导航保留。

这轮没有真实浏览器结果。不能用上述结构审查或 Node 测试确认 Safari、Firefox、移动触摸、返回动画或画面完成度。


## 本轮交互与真实页面验收

详见 verification.md 最新一节。Lab 手柄来自与路径相同的 cubic 取样点，每帧跟随真实几何；指针用 SVG screen CTM 反变换，持有时直接定位、释放时弹簧恢复。键盘提供累加微调、Shift 精调和 Esc 复原。抓取回弹中的手柄会锁住当前位置，重置释放指针捕获与内部状态。力度控件文案明确为回弹节奏，并实际进入弹簧刚度/阻尼参数。

Hero 不再以“加载 800ms 后跳过全部入场”处理普通移动端。文字已经绘制较久时保持静态可读，仅让图形小幅 settle；滚动离开首屏、隐藏页签、历史恢复或减少动态效果时不重播。SplitText 的实例、动画和原始 DOM 有显式恢复。

实际 Chromium 页面已提供截图与录屏，并经独立视觉审查。修正手机标语换行、去掉 Hero 次要装饰和盖住作品标题的悬停按钮；没有新增装饰特效。项目详情增加固定版本来源的真实设置页和成片帧，概念封面继续明确说明。新增 Actions 自动验证及浏览器证据产出。
