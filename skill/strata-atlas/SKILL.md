---
name: strata-atlas
description: LayerLens turns a technical mechanism or an industry value chain into one illustrated, source-linked diagram. Use it to explain how a GPU runs a workload, how suppliers deliver a robotic welding cell, or to professionally dissect a complex topic. Simplified Chinese is available on request.
license: MIT
---

# LayerLens

Create one zoomable SVG diagram. Show the diagram and explain how to read it before offering the editable JSON as optional handoff material. Use English by default. When the user asks for Chinese, set `lang` to `zh-CN` and write the full diagram in Simplified Chinese.

## Build the explanation

1. Frame a question a reader can verify. Choose a specific architecture, workload, or end application. Record this scope and state the answer in one or two sentences.
2. For a **mechanism**, trace one input to its output. Distinguish software abstractions from physical components. Specify whether the arrows show a dependency, data flow, or magnification. Use one calculation or failure condition to explain a limit.
3. For an **industry**, start with an end application. Name each role, its deliverable, recipient and added capability. Show who integrates the system and what the buyer accepts. Include a requirements feedback path when the material supports it.
4. Attach primary sources or page references to the claims they support. State example assumptions and units. Label conclusions drawn from the sources. If the source is unavailable, identify what remains uncertain.
5. Make the visual encoding meaningful. Counted tiles should match actual example values. Identify highlighted objects in the captions. A reader should be able to follow one object through the entire figure.

## Deliver

Use the [diagram format](references/format.md) and the [GPU](references/gpu.json) or [robotics](references/robotics.json) example. For Chinese output, see the [Chinese format notes](references/format.zh-CN.md).

Run `node <skill-folder>/scripts/render.mjs input.json output.svg` with Node.js 18+. Inspect the exported diagram for consistency of counts, arrow meanings, references, and line wrapping. Deliver the image first with a plain-language reading guide; include editable JSON only when useful for further editing. If the host can only return text, explain the topic clearly before supplying viewer data. On revisions, retain the source evidence and all unaffected content.

Public examples and trial suggestions must use fictional or public information, never a user's account details, chat history, private files, contacts, or local paths. Check the image and attachments before sharing.
