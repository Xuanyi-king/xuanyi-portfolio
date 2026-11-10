# 验证边界与复现

源码：d85da9d（后续测量脚本/文档提交不改变画布源码）。59单测、TypeScript、生产构建与12内容路由导出已在本机执行通过。新增实验路由noindex，不进入Sitemap，原MDX/SEO/RSS保持。

`npm run check:direction`：Chromium / Firefox / Playwright WebKit × 1440×900 / 768×1024 / 390×844 / 320×740 共12组；另对最终视觉CSS重拍Chromium四视口。暂停与偏好往返路径相同、进度可逆、控制行不碰标签/不裁出画布、无横向溢出与运行错误。记录输出明确aria-live=off。原有整站回归仍由CI执行，最终状态以本PR的Checks为准，不借用PR #3的绿灯。

`npm run record:direction`：实际网页10秒预演，A/B×桌面/手机，共4段约11秒WebM，另有真实滚动/快速反向与reduced。原生滚动测试不是物理手机，也不是正式主页的sticky改造。观看限制：没有直接播放界面，已完整解码为时间码序列观察；不能声称实时速度或全部帧无抖动。

`npm run measure:direction`：单独Chromium、同机4×CPU、同视口负载、无录像和profiler；A/B各一次10秒预演，记录RAF P50/P95/P99、>50间隔、LongTask、Script/Layout/RecalcStyle/Task、LCP/CLS。未在该脚本采集Paint，正式主页前后比较的独立trace另采Layout/Paint/CPU。不是物理设备、线上Vitals或INP，不能声称60FPS。

`CANVAS_BASELINE_SHA=75a1e19fe63206c348548b3cfe969355499f7713 npm run compare:canvas`：对精确75a1e19归档独立安装/构建，前后三轮交替4×CPU，原始RAF数据与另跑trace/CPU profile分开。测试的是保留的正式首页，**不是导演样片**；它回答可选direct接口有无影响默认路径，不能证明候选样片同样快。第一次本地测量意外与浏览器截图任务重叠，已丢弃，不进入结果表；之后隔离重测。

本轮独立曲面和Gallery Controller未被重写。实验direct输入的spring时钟被停用，现有renderer仍为唯一d写入者；默认生产分支行为保留。未添加依赖、视频素材或虚构项目。

已知未完成：没有Android/iPhone实机；没有对导演版亚帧抖动实时播放验收；A桌面长尾明显；B中途X退出和作品出现有叙事空档；两套均未达到正式集成艺术门槛。预演比真正首页拥有更多可控停顿，尚未证明可直接映射到生产自然滚动。保持实验Draft，不合并。

实验范围限制：导演页目前不保存预演进度到浏览器历史，进入详情再返回可能回到初始预演构图；正式首页的作品选中恢复逻辑保持原样。该能力尚未作为实验页的新连续转场完成，不把原站返回回归冒充实验页的完整导演历史回归。
