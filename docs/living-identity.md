# Living Identity & Folding Canvas

稳定基线：PR #2 / `ea6528a`；[PR CI](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/runs/42228679492) 与 [push CI](https://github.com/Xuanyi-king/xuanyi-portfolio/actions/runs/42228672474) 均成功，24 项测试、WebKit 窄屏检查及完整三浏览器回归通过。完整证据在 browser-evidence Artifact。本轮在独立 worktree / `experiment/living-identity`，不修改这条已验收分支，不新建或合并 PR。

目标：让 X 从等宽描边变成有真实边界、宽度起伏、前后关系的轻量 SVG 曲面；让 Hero 在普通滚动中收束，作品自然成为中心。保留品牌、文案、项目和全部路由。不开 WebGL，不锁滚动，不使用长 pin，不隐藏主标题。

比较两种原创曲面：Cloud Silk（舒展的前景暖色面与收束的蓝色后带）与 Bias Weave（反向交错、较纤细的前景）。从同一 cubic 中心线的切向/法向生成闭合带状轮廓，细边与局部接触阴影跟随同一几何；不靠大阴影、模糊或半透明叠灰。比较完整形态、形变、小图标、1440/390/320 实际页面，最终只保留一套。

控制边界：初始 HTML 有完整静态轮廓；几何入场由 JS 单一绘制器负责，完成后移交 spring，提前指针缓存，reduced-motion 直接静止。移除此新曲面模式的 CSS d 动画，避免两个系统写同一属性。滚动只控制外层变换，内部形变仍由 spring 单独负责；导航符号共享几何，保持静态可点。

Folding Canvas：原生 sticky Header，有限距离的 ScrollTrigger，X 先缩小再沿版面向导航区收束；Header 的实色背景避免叠影。标题轻微后退但不淡没，介绍和 CTA 仍可用；细线收束，作品进入。没有 pin / 克隆 DOM / 固定大场景。快速上下滚动必须恢复，迟 JS/无 JS 保持普通文档流。

采用与拒绝的最终理由、真实截图/录屏、兼容性和实测性能在原型比较后填写，不能以测试数量作为审美结论。
