# 性能实测

源码d85da9d4a825300b26f752b74af6a00b0bfb4d2c，精确基线75a1e19fe63206c348548b3cfe969355499f7713。同机4×CPU，三轮交替，不带profiler。以下为正式首页；未集成实验。

| 视口/指标 | Before 三轮 | After 三轮 |
|---|---|---|
|1440x900 medianMs|16.7 / 16.7 / 16.7|16.7 / 16.7 / 16.7|
|1440x900 p95Ms|33.3 / 16.8 / 16.8|33.3 / 33.2 / 33.3|
|1440x900 p99Ms|50.1 / 33.4 / 49.9|66.7 / 49.9 / 50|
|1440x900 over50ms|6 / 1 / 2|5 / 4 / 4|
|390x844 medianMs|16.7 / 16.7 / 16.7|16.7 / 16.7 / 16.7|
|390x844 p95Ms|16.8 / 16.8 / 16.8|16.8 / 16.8 / 16.8|
|390x844 p99Ms|49.9 / 33.4 / 33.3|33.4 / 33.3 / 33.3|
|390x844 over50ms|2 / 2 / 0|1 / 2 / 1|

独立profiler，不能与正常RAF采样合并；Task/Layout/Paint可嵌套，不相加：

| 视口/指标 | Before | After |
|---|---|---|
|1440 mainTaskMs|5596.6|5200.98|
|1440 layerizePerFrameMs|1.95|1.9|
|1440 layoutMs|204.57|204.82|
|1440 paintMs|454.73|427.51|
|390 mainTaskMs|2342.65|2435.2|
|390 layerizePerFrameMs|1.47|1.49|
|390 layoutMs|53.23|60.63|
|390 paintMs|168.88|161.48|

样片单样本见 [原始数据](../evidence/motion-direction-2-3/prototype-performance.json)。记录RAF、LongTask、JS、Layout、RecalcStyle、LCP/CLS；没有单独采集样片Paint。A桌面长尾明显，不据此声称B稳定更快或正式首页整体提速。没有线上INP、真机或长期FPS结论。
