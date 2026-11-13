# 实际验证与未完成项

## 工程与浏览器

- 独立静态构建：`NEXT_PUBLIC_CREATIVE_LAB=1 npm run build` 成功，新增路由可导出；没有执行预览路径重写或部署命令。
- TypeScript成功；既有67项单测通过；既有18个内容路由的SEO、MDX、TOC、内部链接、资源、RSS与sitemap导出检查通过。[日志](evidence/logs/)。新增实验路由还由实际浏览器打开，并不冒充已经被原18路由检查覆盖。
- Chromium156.0.8078.79 × A/B/C × 1440×900/390×844：六组完整交互通过，全部真实WebGL网格，4304三角形。无横向溢出、无未捕获运行错误，包含入场、X输入、原生滚动、实际作品互动和上滚恢复。
- Firefox146.0.1 × 同六组：页面交互通过，**全部为静态回退**。这个云端headless环境没有得到其WebGL渲染能力；不写成“Firefox3D效果通过”。
- 另行验证两引擎三案的键盘输入/不抢作品方向键、运行中reduced-motion、URL方案切换、真实详情/返回、320px溢出。Chromium验证网格静止后不继续drawArrays、方案切换后旧context真实丢弃；Firefox回退不声称验证了网格生命周期。无JS时静态HTML提供真实作品索引。
- WebKit已下载并尝试启动，但缺少 `libgtk-4`、graphene、harfbuzz-icu、manette、hyphen、woff2dec、GLES 等宿主库；没有可用的受限系统包安装器，未修改审批/沙箱/sudo策略。此项**未运行**，不是通过。[错误记录](evidence/webkit-availability.json)。

B的最终Chromium复核保留6条 `net::ERR_ABORTED` 请求记录，目标是首页和项目详情；它们没有成为未捕获JS异常，独立详情导航检查也通过。此处不据此声称“全部网络请求成功”。

原始矩阵：[browser-results.json](evidence/browser-results.json)；独立交互检查：[interaction-results.json](evidence/interaction-results.json)。这些是自动化浏览器检查，不等于VoiceOver/NVDA、Safari或实体手机验收。

## 采样与影片

六段Chromium影片为最终静态导出的真实录屏：桌面/手机各三段，尺寸及hash见 [films-manifest.json](evidence/films-manifest.json)。初始加载fallback、真实入场、操作和返回均保留，无后期速度调整。每段还有等时距10帧接触表；主代理实际查看了这六份样本，不声称完成全片原速人眼审片。

性能另用未录屏的三次冷上下文采样，共48条：稳定首页与三案×两宽度×普通/4×CPU。原始值、统计口径、布局移动问题和LCP候选的解释见 [performance.md](performance.md)。**浏览器功能通过不等于性能预算通过。** A/B的大型空间场景未达到应有的平滑标准；B混合序列布局移动也高于原计划目标。

## 发现并修正的问题

1. C根元素从嵌套main改为div后，生产构建发现ref仍使用HTMLElement泛型，已收窄为HTMLDivElement；重新构建和类型检查通过。
2. 独立审查发现C淡出后的雕塑/材料仍可能获得焦点。现在使用inert+visibility与滚动进度同步，逆滚和reduced-motion恢复；独立交互检查验证了该行为。
3. 验收器原先可在缺失全部引擎时退出成功。现在强制要求完整六组Chromium结果，并明确把静态回退与真实网格输入分开记录。
4. 初次B手机采样点落到前景说明文字，触摸被拦截。保留 [初次结果](evidence/browser-results-before-fixes.json)；最终按elementFromPoint选择可见且实际接受输入的网格部位，不使用force或直接派发click绕过UI。面向用户的说明也改成真实支持的“轻触X”。
5. 画布原来每帧读取变换后的rect，可能随CSS缩放重新分配buffer。已改为ResizeObserver缓存未变换尺寸，限制像素预算，保持静止停止和卸载释放。
6. B底部选择器对比度、C手机作品标签与切换器冲突、C雕塑高度被共用样式覆盖均已在实际观察后修正。没有通过删作品或隐藏失败数据来“优化”结果。

## 已保护的范围

A保留原Gallery既有的会话内位置恢复；原型未新增远程写入或数据库。

原首页、原Lab、SEO/MDX、真实项目数据、LivingGallery实现、根AGENTS、既有测试和部署工作流保持不变。A仅在实验CSS作用域内让真实媒体默认显现；未改原Gallery。包依赖与package-lock不变，没有新增框架。实验仅增加一个 `npm run prototype` 命令、新路由、新验证脚本及本目录。

## 尚未完成

- 没有真正用户的去名识别测试；推荐C是有证据的设计判断，不是记忆率结论。
- 没有物理手机、Safari/WebKit、触屏GPU、慢网、200%完整辅助技术验收。
- 材质没有共同场景光、自投影、几何遮挡、体积透射或完整PBR；部分高光偏白、边缘锯齿仍可见。
- A的真实作品优先级不足；B的展开比喻、手机中间态、布局移动和性能仍需研究；C的X尚未充分解释三种实践的关系。
- 原型按探索约束实现，未完成生产级组件/API清理和完整bundle归因；不能直接把实验代码提升为正式首页。
- 没有集成、合并或部署。下一轮先选方向，再明确哪些已验证的关系值得正式实现。

最终另收紧了B的中间态焦点：作品解读在尚未到达“观看”或“静态展开”前保持inert、aria-hidden及非Tab目标，与其可用阶段一致。只针对B重跑两引擎×两视口及中间态检查，最终矩阵合并未受影响的A/C结果与B复核结果；最终B影片也以复核后的文件为准。该调整没有改变构图、着色或性能采样算法，未重复整套48条性能循环。原始整组结果保留，复核见 evidence/recheck-b 与 b-focus-recheck.json。
