# 图稿字段

UTF-8 JSON 对象。字段名用英文，正文跟随用户语言。网页端和命令行共用同一格式。

- `lang` 可选 en 或 zh-CN。生成中文图稿时设为 zh-CN。
- `mode` 取 `mechanism` 或 `industry`。
- `title` 提出核心问题，`scope` 限定对象，`lead` 用一两句话直接回答。
- `figure` 是主图标题，`relation` 说明相邻对象间的箭头含义，如“沿数据路径”“放大高亮部分”“交付实物与系统”。选用一种贯穿主图的关系。
- `stages` 列出 2–5 个对象。每个包含 `name`、`caption`、`detail`、`visual`。caption 写关键数量、功能或交付物；detail 解释它与下一个对象的关系。
- `visual` 可用 `{"type":"matrix","rows":4,"cols":8,"lit":1}`。行数 1–8，列数 1–32，高亮前 lit 个格。数量应从材料或明确的例题得出。
- 其他对象可用 `{"type":"symbol","symbol":"input"}`。通用语义图形有 input、process、output、stack；机械图形有 gear、arm、cell、weld。任取适合的形状。图注承担精确定义。
- `feedback` 可省略。有下游向前一环提出的要求时，写出发出方、接收方与要求。
- `notes` 是 2–4 个分析段落，`insight` 是一个能揭示瓶颈、验收标准或失效条件的推论。两者的条目都含 `title`、`body`、`refs`。refs 为来源编号数组。
- `boundary` 写明具体条件与简化。例题中的数值要明确注明。
- `sources` 是最多 8 个对象组成的数组，元素包含简短 `label` 和可选 `url`。官方网页使用 http(s) 链接，用户文档在 label 中写文档名及页码。无外部依据的自拟示例可用空数组并交代来历。
