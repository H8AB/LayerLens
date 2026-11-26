# LayerLens

LayerLens 的中文名是「图个明白」。它把技术机制、抽象知识与产业分工做成一张可缩放的专业图解。图中用带含义的箭头连接对象，给出一个具体情境、值得追问的瓶颈、适用条件与可追溯的资料。当前提供运行原理和产业链两种拆法。

## 从一张图开始

- [GPU 怎样同时算出许多结果？](examples/gpu.svg) 追踪向量加法从一个网格到一个线程束，并核算一次加法需要的逻辑读写量。[可编辑稿](examples/gpu.json)
- [一台机械臂，怎样变成焊接产能？](examples/robotics.svg) 从关节减速器、机器人、工作站走到合格工件，再沿需求回传看选型。[可编辑稿](examples/robotics.json)

每张图底部的资料索引可在独立 SVG 的浏览器页面点击。完整网址也保存在 JSON 内。

## 使用

**网页对话**　复制 [生成指令](releases/layerlens-web-prompt.txt) 到 AI 对话，附上你的原文、链接或问题。将生成的 JSON 粘贴到[离线查看器](releases/LayerLens.html)。下载该 HTML 后双击即可打开，支持缩放、SVG 与 3200 像素宽 PNG 导出。

**Codex / Claude Code**　将仓库中的 `skill/strata-atlas/` 整个目录复制到项目的 `.agents/skills/` 或 `.claude/skills/`。用中文描述主题，或用 `$strata-atlas`（Codex）和 `/strata-atlas`（Claude Code）指定技能。

**Claude 网页端 / WorkBuddy**　在各自技能管理页导入 [Claude 通用包](releases/layerlens-0.2.2-agent-skills.zip) 或 [WorkBuddy 专用包](releases/layerlens-0.2.2-workbuddy.zip)。Claude 自定义技能需启用相应的执行与文件功能，企业环境取决于管理员设置。

可以这样提问：“用「图个明白」讲讲工业机器人产业链。以弧焊工作站为例，在图上注明各方的交付物、工厂的验收条件，以及一个会传导到下游的问题。”

## 开发与兼容

发布包自带无第三方依赖的 Node.js 渲染器。使用 Node.js 18+ 与 Python 3.9+ 重建。命令在仓库根目录运行。

```sh
node skill/strata-atlas/scripts/render.mjs examples/gpu.json gpu.svg
python3 scripts/build.py
node --test tests/*.test.mjs
```

[图稿字段](skill/strata-atlas/references/format.md)包含可用图形、分析段落和来源索引的定义。旧版 One Picture Explainer 的 flow、grid 稿也能在新版查看器打开。离线 HTML 可直接作为静态网站入口。两个平台包均用解压后的渲染器验证。宿主账号的实际上传、启用与自动调用仍需在对应客户端验收。

项目使用 [MIT 许可证](LICENSE)。示例图为原创矢量示意，引用的资料归各自权利人所有。
