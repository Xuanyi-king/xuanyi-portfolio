"""Package the existing static export and a review page. Never deploys anything."""
from pathlib import Path
import json
import zipfile
import hashlib
import shutil
root = Path(__file__).resolve().parents[1]
docs = root / 'docs/creative-direction/phase-2'
evidence = docs / 'evidence'
sections = []
for key, name, description in [
    ('A', 'Sky Editorial Sculpture', '文字、中央雕塑与真实作品切片共处一张编辑式画面。'),
    ('B', 'Living Spatial Canvas', '斜向折面通过原生滚动展开为正面作品空间。'),
    ('C', 'Creative Playground', '真实路由工具、地图影像与交互叙事直接组成个人实践台。'),
]:
    sections.append(f'''<section><header><div><span>方向 {key}</span><h2>{name}</h2><p>{description}</p></div><a class="enter" href="/lab/creative-direction/?variant={key}">体验 {key} ↗</a></header>
<div class="stills"><figure><img src="evidence/{key}-1440-chromium-hero.png" alt="方向{key}桌面真实首屏"><figcaption>1440 × 900 · Chromium</figcaption></figure><figure class="phone"><img src="evidence/{key}-390-chromium-hero.png" alt="方向{key}手机真实首屏"><figcaption>390 × 844 · 触屏模拟</figcaption></figure></div>
<div class="films"><figure><video controls playsinline preload="none" poster="evidence/{key}-1440-chromium-hero.png" src="evidence/films/{key}-1440.webm"></video><figcaption>完整桌面交互 · 原速</figcaption></figure><figure class="phone"><video controls playsinline preload="none" poster="evidence/{key}-390-chromium-hero.png" src="evidence/films/{key}-390.webm"></video><figcaption>完整手机交互 · 原速</figcaption></figure></div></section>''')
html = '''<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>XUANYI · 三种好奇的形状</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f4f8fa;color:#173e53;font:15px/1.7 system-ui,sans-serif}main{max-width:1380px;margin:auto;padding:60px 5vw}h1{font-size:clamp(35px,5vw,72px);line-height:1.1;letter-spacing:-.055em;margin:20px 0}h2{font-size:28px;letter-spacing:-.04em;margin:6px 0}p{max-width:800px}a{color:inherit}nav{display:flex;gap:25px;flex-wrap:wrap;margin:30px 0}section{border-top:1px solid #afc8d4;padding:38px 0 55px}header{display:flex;justify-content:space-between;align-items:center;gap:20px}header p{font-size:13px}.enter{padding:12px 25px;border:1px solid #477990;white-space:nowrap}figure{margin:0}img,video{display:block;width:100%;border:1px solid #c9dbe2}figcaption{font-size:12px;color:#507183;margin-top:9px}.stills,.films{display:grid;grid-template-columns:3fr 1fr;gap:25px;align-items:start;margin-top:28px}.phone{max-width:310px}.films video{max-height:510px;background:#dae8ef}aside{border-left:3px solid #82b4d0;padding:10px 22px;background:#e6f1f6;margin:35px 0}footer{font-size:13px;border-top:1px solid #afc8d4;padding-top:25px}@media(max-width:700px){main{padding:30px 6vw}header{display:block}.enter{display:inline-block;margin:10px 0}.stills,.films{grid-template-columns:1fr}.phone{max-width:270px}h2{font-size:25px}}</style>
<main><p>XUANYI / 玄屹 · CREATIVE DIRECTION LAB</p><h1>三种好奇的形状。</h1><p>这是三个真实可运行的原创交互实验，以及同一浏览器、同一视口下采集的原始画面。现有首页保留为对照；没有发布或替换正式站。</p><nav><a href="/lab/creative-direction/?variant=A">体验 A</a><a href="/lab/creative-direction/?variant=B">体验 B</a><a href="/lab/creative-direction/?variant=C">体验 C</a><a href="/">稳定对照</a></nav><aside>推荐下一轮以 C 为主方向：让真实作品和作者的方法先建立辨识度。A 提供排版/材质参照，B 继续研究空间连续性。当前三维是程序化天空光照近似；Firefox 在此环境采用静态回退，WebKit 尚缺运行库。尚未完成真机和 Safari 验收。</aside>''' + '\n'.join(sections) + '''<footer>影片包含初始加载/入场、X交互、滚动、作品互动及返回。无加速、无概念合成。所有素材均来自仓库既有真实项目；参考站素材未进入原型。<p><a href="https://github.com/Xuanyi-king/xuanyi-portfolio/pull/6">审计 PR</a> · <a href="https://github.com/Xuanyi-king/xuanyi-portfolio/tree/experiment/creative-direction-abc/docs/creative-direction/phase-2">完整源码与验证报告</a></p></footer></main></html>'''
(docs / 'experience.html').write_text(html)
assert (root / 'out/lab/creative-direction/index.html').is_file(), 'Build with NEXT_PUBLIC_CREATIVE_LAB=1 first'
artifact = root / 'artifacts/creative-direction'
artifact.mkdir(parents=True, exist_ok=True)
archive = artifact / 'xuanyi-creative-direction.zip'
selected = [evidence / f'{key}-{width}-chromium-hero.png' for key in 'ABC' for width in (1440,390)] + list((evidence/'films').glob('*.webm'))
review = root / 'out/review'
review.mkdir(parents=True, exist_ok=True)
shutil.copy2(docs/'experience.html', review/'index.html')
for file in selected:
    target = review/'evidence'/file.relative_to(evidence)
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(file, target)
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as package:
    for file in sorted((root/'out').rglob('*')):
        if file.is_file(): package.write(file, str(file.relative_to(root/'out')))
    package.writestr('START-HERE.txt', 'XUANYI Creative Direction Lab\n\nUnzip, then run: python3 -m http.server 8000\nOpen http://localhost:8000/review/ for screenshots and films.\nOpen http://localhost:8000/lab/creative-direction/?variant=C for interaction.\nDo not open index.html directly with file://; WebGL/modules need HTTP.\nThis is a local experiment, not a production deployment.\n')
with zipfile.ZipFile(archive) as package: assert package.testzip() is None
manifest = {'file':archive.name, 'bytes':archive.stat().st_size, 'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(), 'includes':'Static export + six hero images + six raw interaction films + review page', 'deploys':False}
(evidence/'portable-package.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest,indent=2))
