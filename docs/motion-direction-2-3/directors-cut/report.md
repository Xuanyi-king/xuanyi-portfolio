# XUANYI 2.3 · Director’s Cut delivery

**结论：The Passing Curve明显改善旧A的空白中段，尚未证明整体胜过正式2.2。正式首页保持2.2；PR#4继续作为实验Draft，不合并。**

## A — Motion Audit补充

[审查补充](audit.md)：重新核对PR最新head/base、Actions与AGENTS；旧A50/75实际复现；原版长尾、继承根变量、大SVG与3D合成成本分开研究。最新干净诊断冻结根变量后Style从4338ms降到293ms，但去掉父级perspective单独测试反而出现66.7ms P95，不用单一“少做特效”解释成本。

## B / C — Director’s Cut与真实关键帧

实验入口`/lab/motion-direction/`默认The Passing Curve，保留旧A/B。Play/Pause/Restart/进度拖动/真实滚动保留。共享状态映射，导演时间与网页位置各自驱动；不把10秒强加给访客。[设计与逐帧意图](design.md) · [Motion Score](motion-score.md)。

[旧A50/75与新版并排](../../evidence/passing-curve/comparison-1440.jpg) · [手机比较](../../evidence/passing-curve/comparison-390.jpg) · [八帧四视口](../../evidence/passing-curve/README.md)。截图来自实际浏览器，不画假UI；第一作品仍是DSH Adaptive Router，其余Film与知乎平行宇宙仍由原Gallery无限循环访问。

## D — 动态证据与实际观看

六个最终完整WebM包含桌面/390/320预演及原生滚动、快速反向、中途停止和作品拖动。全部完整解码，实际检查558张8fps时段帧，并保留全部12张contact sheets。第一次影片发现了SSR Gallery闪现，实测禁用JS的初始状态失败后修正，再重新录制并检查最终影片。

[录屏/序列索引与hash](../../evidence/passing-curve/README.md) · [观看日志和限制](verification.md)。本环境没有可操作的播放器工具，**没有声称完成实时原速播放验收**。

## E — 性能

[完整性能全表](performance.md)保留所有轮次及不利数据。精确2.2 /旧A /精修A，同机1440×900与390×844、4×CPU、同一滚动/停顿/反向/按钮/拖动序列，三轮轮换执行；另做三轮A/Cut导演预演，profile另采6组。

桌面原生P95：旧A33.4/33.3/33.3ms，精修16.7/16.8/16.7ms。手机原生第三轮精修P99=66.7ms，5次>50ms、3个Long Tasks；同轮2.2 P99=33.3ms。没有隐藏这一轮，不能宣称全面提速或稳定60FPS。独立Paint也未普遍降低。完整源提交和fingerprint保存在原始JSON。

## F — 回归与修复

61个单元测试、typecheck、production build、12内容路由export通过。三引擎四视口完成回归；影片修正前的12组日志与修正后Chromium4组分别标明，最终全部引擎以PR最新CI的原始JSON为准。[验证详情](verification.md)。

独立只读审查的四项Important均已处理，真实失败后通过的检查覆盖70%停住切作品、resize暂停、平板60%阅读区重叠。另修正窄屏进度文字改变布局起点、偏好切换取消待处理滚动、首帧闪现。手机实际横向touch改变Gallery位置，纵向touch可滚动页面；无横向溢出。详情返回恢复样片进度与原Gallery位置。原首页测试曾两次抢先读取resize/偏好状态，保留失败与精确2.2隔离检查记录；测试改为等待同一真实目标状态后，原首页12组通过，2px/none断言和业务代码不变。

## G / H — 艺术选型与集成决定

[独立比较与艺术结论](decision.md)。50%不再只有小X与大环：完整可辨的X和真实封面共享画面，开放曲线把目光送到封面边缘。75%作品已落在中心，标题、类别、技术标签与入口清楚；曲线退场，让内容保持稳定。这更符合XUANYI以蓝/杏云绸表达好奇、以真实作品作为落点的品牌。

但2.2的完整个人介绍、首屏编辑层级和自然文档节奏仍更成熟。手机原生版为了短Hero和阅读删去核心曲线，320px中段中文换行也未像正式版一样从容；预演的空间接棒未在所有真实滚动布局里同样强。再加手机性能尾部与实时观看证据不足，未满足全部集成门槛。**H不执行。**

## I — 实际范围与未完成

实际修改仅为Lab精修视图/状态映射/局部渲染、控制生命周期与返回状态、证据/基准脚本和CI采集。没有重写LivingX、LivingGallery、Gallery Controller、项目详情、导航、SEO、MDX或静态导出。没有新增运行时依赖、虚构项目或软件UI，没有3D舞台/粒子/模糊堆叠。

未完成：明确胜过2.2的全站艺术证明；手机完整空间接棒；排除手机尾部风险；实时原速观看；物理手机/GPU长期表现。前四项直接限制本次采用，后两项是验证边界。保留精修实验与真实证据就是本轮交付，不将“未集成”包装成已通过。

## J — PR与Git

继续[PR#4](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/4)，base仍feat/xuanyi-2-2-living-canvas /75a1e19。旧453caa4为祖先，仅追加提交；不新建PR、不改PR#3分支、不强推、不合并。Author/Committer使用当前认证Xuanyi-king账号已验证邮箱，推送后核查GitHub账号关联。PR最新head、Actions与完整Artifact链接见PR正文。
