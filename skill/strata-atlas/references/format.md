# Diagram format

Supply a UTF-8 JSON object. See [the CUDA example](gpu.json) for a complete file.

- `lang` accepts `en` or `zh-CN`. English is the default for new diagrams. Set the language and write all content in that language.
- `mode` is `mechanism` or `industry`.
- `title` states the question. `scope` limits the subject. `lead` gives the short answer.
- `figure` names the main illustration. `relation` defines what the arrows mean, such as “Zoom into the highlight” or “Deliver to the next role”.
- `stages` contains 2–5 objects with `name`, `caption`, `detail` and `visual`. Explain the object's output or the next level of detail.
- A matrix visual uses `{"type":"matrix","rows":4,"cols":8,"lit":1}`. Use 1–8 rows and 1–32 columns. The first lit cells are highlighted. Use counts the reader can verify.
- Symbol visuals use `{"type":"symbol","symbol":"input"}`. Choose input, process, output, stack, gear, arm, cell or weld.
- Optional `feedback` describes a requirement sent back from the final stage to the preceding one.
- `notes` contains 2–4 annotations. `insight` is one annotation explaining a bottleneck, acceptance test, or failure condition. Every annotation has `title`, `body` and `refs`. Reference numbers start at 1.
- `boundary` explains the assumptions behind the example and where the conclusion applies.
- `sources` lists up to 8 entries with a short `label` and an optional HTTP(S) `url`. Use a document title and page number for local sources. For an original example, identify the assumptions and use an empty references list if appropriate.
