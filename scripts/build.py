"""Rebuild skill distributions, the offline viewer and vector example posters."""
import json
from pathlib import Path
from shutil import copyfile
from subprocess import run
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "skill" / "strata-atlas"
WEB = ROOT / "web"
RELEASES = ROOT / "releases"
VERSION = "0.2.2"


def examples():
    data = {}
    for name in ("gpu", "robotics"):
        src = ROOT / "examples" / (name + ".json")
        data[name] = json.loads(src.read_text())
        copyfile(src, SKILL / "references" / src.name)
        run(["node", SKILL / "scripts/render.mjs", src, src.with_suffix(".svg")], check=True)
    return data


def build_viewer(data):
    instruction = (SKILL / "SKILL.md").read_text().split("---", 2)[2].strip()
    prompt = ("请用「图个明白」把我接下来给出的内容整理成一张高清拆解图。\n\n"
              + instruction.split("## 制作与交付")[0]
              + "\n直接按下面的字段说明提供完整 JSON，以便粘入查看器。\n\n"
              + (SKILL / "references/format.md").read_text()
              + "\n参考下面的有效图稿格式。主题、图形和依据按实际材料选择。\n"
              + json.dumps(data["gpu"], ensure_ascii=False, indent=2))
    (RELEASES / "layerlens-web-prompt.txt").write_text(prompt)
    module = ("export const examples = " + json.dumps(data, ensure_ascii=False, indent=2)
              + ";\nexport const webPrompt = " + json.dumps(prompt, ensure_ascii=False) + ";\n")
    (WEB / "examples.mjs").write_text(module)
    # Inline the same modules, with independent scopes, for browsers that restrict local ES imports.
    legacy = (SKILL / "scripts/legacy.mjs").read_text().replace("export ", "")
    core = (SKILL / "scripts/core.mjs").read_text().split("\n", 1)[1].replace("export function", "function")
    app = "\n".join(line for line in (WEB / "app.mjs").read_text().splitlines() if not line.startswith("import "))
    js = ("const renderClassic = (()=>{\n" + legacy + "\nreturn renderSvg;\n})();\n"
          + core + "\n" + module.replace("export const", "const") + "\n" + app)
    html = (WEB / "index.html").read_text()
    html = html.replace('<link rel="stylesheet" href="./style.css">', '<style>' + (WEB / "style.css").read_text() + '</style>')
    html = html.replace('<script type="module" src="./app.mjs"></script>', '<script type="module">\n' + js + '\n</script>')
    (RELEASES / "LayerLens.html").write_text(html)


def build_package(platform):
    metadata = """display_name: 图个明白
display_name_en: LayerLens
description_zh: 将技术机制与产业链拆成一张有依据的高清图鉴。
description_en: Visual teardowns of technical mechanisms and industrial value chains.
author: LayerLens contributors
version: "0.2.2"
"""
    with ZipFile(RELEASES / f"layerlens-{VERSION}-{platform}.zip", "w", ZIP_DEFLATED) as z:
        for p in sorted(SKILL.rglob("*")):
            if not p.is_file() or p.name.startswith("."):
                continue
            name = "strata-atlas/" + p.relative_to(SKILL).as_posix()
            if platform == "workbuddy" and p.name == "SKILL.md":
                z.writestr(name, "---\n" + metadata + p.read_text()[4:])
            else:
                z.write(p, name)
        z.write(ROOT / "LICENSE", "strata-atlas/LICENSE")


if __name__ == "__main__":
    RELEASES.mkdir(exist_ok=True)
    build_viewer(examples())
    for platform in ("agent-skills", "workbuddy"):
        build_package(platform)
