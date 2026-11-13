# XUANYI · Creative Direction Phase 2

本轮完成三套真实可运行的抛弃式原型，保留现有首页。**没有接入正式首页，没有合并，没有部署 Pages 或 ChatGPT Sites。**

审计已先保存为 [PR #6](https://github.com/Xuanyi-king/xuanyi-portfolio/pull/6)，base 为 preview/xuanyi-2-3；1710个本地 Skill 文件未提交。本目录属于之后的实验分支 `experiment/creative-direction-abc`，原型PR以审计分支为base，保持diff只含本次实验。

## 现在体验

在该实验分支：

```bash
npm ci
npm run prototype
```

- [A · Sky Editorial Sculpture](http://localhost:3000/lab/creative-direction/?variant=A)
- [B · Living Spatial Canvas](http://localhost:3000/lab/creative-direction/?variant=B)
- [C · Creative Playground](http://localhost:3000/lab/creative-direction/?variant=C)
- [稳定对照首页](http://localhost:3000/)

这里的 localhost 是运行项目的机器，不是已发布的公网地址。底部切换条可点击或用页面上的左右键切换；作品控件和输入焦点不会被抢走。视频/图像证据不依赖本地服务器。

也可制作可直接用任意HTTP静态服务器体验的导出：

```bash
NEXT_PUBLIC_CREATIVE_LAB=1 npm run build
python3 -m http.server 3000 --directory out
```

不带显式实验flag的生产构建会关闭实验内容/切换器；原页面不受影响。不要将此实验构建上传至现有Pages。阶段交付另附便携ZIP，包含静态站和图像/影片评审页，不包含node_modules、Skill或凭证。

## 看结果

| 方案 | 1440×900 | 390×844 | 完整桌面交互 | 完整手机交互 |
|---|---|---|---|---|
| A | [首屏](evidence/A-1440-chromium-hero.png) | [首屏](evidence/A-390-chromium-hero.png) | [18.4秒 WebM](evidence/films/A-1440.webm) | [12.6秒 WebM](evidence/films/A-390.webm) |
| B | [首屏](evidence/B-1440-chromium-hero.png) | [首屏](evidence/B-390-chromium-hero.png) | [19.3秒 WebM](evidence/films/B-1440.webm) | [13.5秒 WebM](evidence/films/B-390.webm) |
| C | [首屏](evidence/C-1440-chromium-hero.png) | [首屏](evidence/C-390-chromium-hero.png) | [14.5秒 WebM](evidence/films/C-1440.webm) | [11.8秒 WebM](evidence/films/C-390.webm) |

六段影片由同一Chromium版本、相同两组视口录制，包含真实初始加载/入场、X交互、向下滚动、作品互动和向上恢复；原速保留，无加速或概念合成。每段时长、尺寸、hash见 [films-manifest.json](evidence/films-manifest.json)。交互与作品状态图以 `*-interaction.png` / `*-work.png` / `*-restored.png` 保存。手机使用触屏上下文；滚动由验收脚本按固定时序输入，不冒充真人或物理设备操作。

- [三案设计优劣与独立判断](design-comparison.md)
- [实际 prototype Skill 使用证据](skill-invocation.json)
- [实现与阶段合同](implementation-plan.md)
- [验证结果与尚未完成问题](verification.md)
- [不录屏的相对性能比较](performance.md)
- [图像/视频评审页](experience.html)

## Skill 真正做了什么

本轮读取已安装的 Matt Pocock `prototype/SKILL.md` 和 `UI.md`，实际执行 UI 分支：三个结构不同的组件，一个 `?variant=` 实验路由，浮动切换条、状态可见、真实项目、原型独立保留。此处“调用”是显式加载指令并完成其工作流；没有虚构原型生成器进程、云端自动触发或Skill专属运行引擎。上游SHA、指令文件hash及规则到实现的对应关系在调用证据中。没有重新安装任何Skill；Impeccable继续停装。

## 素材与三维边界

所有项目图像/片段来自仓库已有 `public/projects` 与 `src/data/projects.ts`：DSH真实设置页、地图影片第10秒/真实片段、知乎项目真实界面。原有来源、署名和下线/开发中状态保留。不使用参考站截图、第三方设计图、虚构产品或UI。

X 为本轮自行编写的参数化封闭网格与WebGL着色器，三个方向有不同几何参数、材质与空间角色。最终每实例4304三角形，显示分辨率受42万像素预算限制；无外部模型、HDRI、纹理下载或新增框架。它有真实透视、厚度和法线光照，**没有完整PBR、自投影、共同场景遮挡或体积透射**。这些缺口不被“高级3D”字样掩盖。
