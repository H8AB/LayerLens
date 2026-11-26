---
name: strata-atlas
description: 拆开看 (Take It Apart) creates a single zoomable, sourced visual teardown of technical mechanisms and industry value chains. Use for requests such as 拆解 GPU 运作原理、机器人产业链、系统工作机制 or a professional illustrated explanation of how a system works and who delivers what.
license: MIT
---

# 拆开看

为有背景知识但初次接触此主题的读者制作一张可放大的专业图解。根据用户指定的对象、语言与深度调整表达。成品包括 SVG 主图和可继续修改的 JSON 稿。

## 拆解方法

1. 将宽泛主题收窄为一个可以验证的问题。在 scope 中写明架构、产品类别或具体应用。若材料覆盖多个问题，选能解释核心关系的一条作主图，其余放入边界说明。
2. **运行原理**用一个输入贯穿到输出。对应到部件、软件抽象和硬件执行位置，写出各自改变了什么。箭头可以表示流动或层级放大，应写明含义。用一个可核验的推导解释瓶颈或失效条件。避免把逻辑上的并行数画成物理单元数。
3. **产业链条**从一个终端场景倒推。每个角色说清交付物、接收方与新增能力。指出不同供应路径、集成责任和下游验收条件。在有依据时加入需求回传。按职能定义角色，同一家企业可以跨层参与。
4. 根据用户材料或已核对的一手资料写图。把原文事实、例题设定与推论用清晰措辞区分。示例计算要带单位、前提和可复核的算式。来源索引按文内引用编号从 1 开始。没有检索条件时引用用户文档名称和页码，标注尚待核实的主张。涉及市场规模、份额或成本时须说明时间和口径。
5. 让图形承担解释工作。空间位置表示层级、流向或交付顺序。用阵列只表示可核对的数量，亮格须在图注中解释。检查读者能否顺着图回答“怎么运作、为什么、在哪个条件下结论会变”。

## 制作与交付

按 [字段说明](references/format.md) 编写 JSON。可参考 [GPU 示范稿](references/gpu.json) 或 [产业链示范稿](references/robotics.json) 的构图，替换为当前主题的材料与证据。主图使用 2–5 个对象，说明区使用 2–4 段逐层追问。需要修改时保留用户未要求变动的事实、出处和范围。

在有 Node.js 18+ 的环境执行 `node <skill-folder>/scripts/render.mjs input.json output.svg`。输出一张含主图、解释、限制条件与来源索引的独立 SVG，附可编辑稿。查看导出的画面，核对数字、箭头含义、文内来源和文字边界。优先展示图片。

网页对话若能输出文件但没有 Node.js，可直接根据稿件生成独立 SVG，并附 JSON。仅支持文本时，给可复制的 JSON，说明将其粘贴到项目离线查看器即可预览、缩放和导出。只有图片文件已经生成时才报告出图成功。
