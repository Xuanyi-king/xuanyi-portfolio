# Real browser verification and viewing limits

视觉源码3d0a4d96ce3a498edb0234b344470b5672062809；无新运行时依赖。61个单元测试、typecheck、production build及12内容路由静态导出通过。SEO/MDX/TOC/高亮/RSS/Sitemap/404由原有export检查验证。正式首页源文件和Gallery Controller没有本轮diff。

## Browser checks

本轮本机完整跑过Chromium145 / Firefox146 / WebKit26 ×1440×900、768×1024、390×844、320×740的12组。之后完整影片发现首帧Gallery闪现，补充SSR禁用JS的初始状态断言并修正，再跑Chromium四视口全部通过；最终提交的全部引擎重跑结果以PR最新CI Artifact为准，不把前一版本的12组当成最后markup的原始JSON。

[三引擎原始通过日志](../../evidence/passing-curve/three-engine-pre-film.log)；[影片修正后的本机Chromium4组](../../evidence/passing-curve/local-chromium-results.json)。CI执行同一脚本，会输出最新12组passing-curve/browser-results.json。

检查包括八个关键帧、标题/技术栈与控制区边界、70%停住时切项目的全强度活动卡、resize暂停、暂停后偏好往返、滚动停止、快速正向/反向落位、减少动态效果、详情返回、键盘/指针拖动与无横向溢出。Chromium手机视口通过CDP实际触摸拖动并断言position改变，再从Gallery上纵向滑动并断言真实window.scrollY增加，保留pan-y。

注意：本机WebKit软件环境的自动化落位等待曾达约748–783ms（包括工具调度），其功能通过不证明该环境动画稳定流畅。没有物理Android/iPhone结果。

## Complete actual recordings

最终六片全部完整解码，并实际查看8fps的全时段序列，共558个采样画面；没有只看0/50/100。每个转折、停顿、反向和片尾拖动都在其中。[逐片时长/哈希/采样清单](../../evidence/passing-curve/film-manifest.json)。电影包含加载/画布定位与片尾操作，所以总长约8.8–15秒，不是预渲染影片替代网页。

- director-1440：约1.5–3.5s标准X停顿；4–6s真实封面开口与X同场；6–8s文字与侧卡错时进入；8–11s稳定阅读；12–15s实际Gallery拖动/落位。
- director-390与320：中文Intro在X上方；曲线短且在封面之外；项目先建立，随后整个展廊轻微落位并停下。片尾实际触摸切到Film。320px文字自然换行，不卡住CTA。
- scroll-1440：约2–3s中段停住，3.5–5s多次快速反向恢复X/封面/展廊；继续滚动可以直接离开舞台，6s后拖动Gallery。
- scroll-390与320：中段停在约50%（220px原生推进），Intro与第一封面仍成立；快速反向能回到Hero，快速向下可直接越过展廊到页脚；返回后触摸Gallery正常。没有曲线的手机原生版本弱于预演的因果表现，艺术决策保留这一限制。

完整WebM在PR最新Portfolio CI → browser-evidence Artifact → passing-curve/films/，保留14天；Git保留全部12张8fps时间码contact sheets。原始PNG、trace、CPU profile也在Artifact，不以JPEG或JSON冒充录屏。

**没有完成实时原速播放验收。** 当前环境声明remote_desktop enabled但state unknown，未提供可调用cua_repl.js/open_in_codex工具，无法实际操作播放器。使用FFmpeg完整解码与逐帧序列，是本次已完成的观看方式；不能据此判断亚125ms抖动或宣称运动已达到最终艺术水准。

复核命令：`ffmpeg -i film.webm -f null -`完整解码；`ffmpeg -i film.webm -vf fps=8,scale=240:-1 frame-%04d.png`生成密集序列（手机用120px）。Git contact sheets仅缩小/排列实际帧并加时间标签。源影片以manifest哈希核验。

## Fixed findings

独立审查见[review](review.md)。四个Important均已处理；停住切卡、resize暂停和平板60%重叠都观察过真实失败后通过。窄屏还修正进度output宽度变化引起的section起点重排；首帧闪现由实际录屏发现，禁用JS断言先读到visible失败，加入初始data-progress=0后通过。旧A/B入口及原Gallery机制保留。

## 原首页回归的等待竞态（保留失败）

第一次原回归在Chromium320→390 resize的2px对齐断言失败，第二次在WebKit动态减少运动后的transform=none断言失败。[首次失败](../../evidence/passing-curve/original-regression-first-failure.log) · [第二次失败](../../evidence/passing-curve/original-regression-second-failure.log)。同一诊断脚本隔离执行当前首页与精确2.2的窄屏resize，以及精确2.2的WebKit桌面偏好切换，均通过；相关业务源码无本轮diff。

原测试以180/250ms固定等待后读取状态，完整软件浏览器流程中会先于刷新/偏好清理完成。只改回归等待条件：5秒上限内等待真实目标对齐/transform清除，再执行原来的2px与none断言；没有放宽容差、跳过引擎或改变正式首页业务代码。等待时间也写入结果，不能拿它当作延迟性能通过。修改后[原首页12组完整回归](../../evidence/passing-curve/homepage-identity-results.json)通过，[原始日志](../../evidence/passing-curve/homepage-identity-final.log)保留。独立正常性能测试在修改测试等待之前已经完成，网页代码仍是同一3d0a4d9。
