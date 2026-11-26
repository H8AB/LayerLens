export const examples = {
  "en": {
    "gpu": {
      "mode": "mechanism",
      "lang": "en",
      "title": "How does a GPU add 4,096 pairs of numbers?",
      "scope": "One-dimensional vector addition in NVIDIA CUDA",
      "lead": "Each thread adds one pair of numbers. Because the sums are independent, the GPU can work on many elements in parallel.",
      "figure": "Follow one block down to its first warp",
      "relation": "Zoom into the highlight",
      "stages": [
        {
          "name": "Grid",
          "caption": "32 blocks",
          "detail": "Each tile is a block. Follow the highlighted block, number 0.",
          "visual": {
            "type": "matrix",
            "rows": 4,
            "cols": 8,
            "lit": 1
          }
        },
        {
          "name": "Thread block",
          "caption": "128 threads per block",
          "detail": "Each tile is a thread. The highlighted row of 32 threads forms the first warp.",
          "visual": {
            "type": "matrix",
            "rows": 4,
            "cols": 32,
            "lit": 32
          }
        },
        {
          "name": "Warp",
          "caption": "32 lanes",
          "detail": "The same warp is drawn in two rows. Its threads add different pairs of numbers.",
          "visual": {
            "type": "matrix",
            "rows": 2,
            "cols": 16,
            "lit": 32
          }
        }
      ],
      "notes": [
        {
          "title": "Who assigns the work?",
          "body": "The CPU launches 32 blocks of 128 threads. With zero-based indexing, thread 5 in block 2 handles element 2 × 128 + 5 = 261.",
          "refs": [
            1
          ]
        },
        {
          "title": "Where do threads run?",
          "body": "A block is assigned to one streaming multiprocessor (SM). The SM issues instructions to ready warps. Available hardware resources limit how many can run concurrently.",
          "refs": [
            1,
            2
          ]
        },
        {
          "title": "Where do results go?",
          "body": "Thread i reads A[i] and B[i] and writes their sum to C[i]. When neighboring threads access consecutive addresses, the GPU can combine their memory requests.",
          "refs": [
            2
          ]
        }
      ],
      "insight": {
        "title": "What might limit speed?",
        "body": "For 4-byte floats, one addition needs two reads (8 bytes) and one write (4 bytes). Memory bandwidth can limit throughput even when arithmetic units have capacity.",
        "refs": [
          2
        ]
      },
      "boundary": "The example uses 128 threads per block. The tiles depict logical groups. The number executing at once depends on the hardware.",
      "sources": [
        {
          "label": "NVIDIA · CUDA Programming Model",
          "url": "https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html"
        },
        {
          "label": "NVIDIA · CUDA Best Practices Guide",
          "url": "https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html"
        }
      ]
    },
    "robotics": {
      "mode": "industry",
      "lang": "en",
      "title": "How does a robot arm become a welding cell?",
      "scope": "Industrial robots used in arc welding",
      "lead": "Follow the handoffs from a joint reducer to an accepted weld. Each supplier delivers a different capability.",
      "figure": "Four roles from joint motion to weld quality",
      "relation": "Deliver to the next role",
      "stages": [
        {
          "name": "Component maker",
          "caption": "Joint transmission",
          "detail": "A precision reducer works with the motor to deliver the speed and torque a joint needs.",
          "visual": {
            "type": "symbol",
            "symbol": "gear"
          }
        },
        {
          "name": "Robot maker",
          "caption": "Controlled motion",
          "detail": "Mechanical joints, drives and a controller move the arm along a programmed path.",
          "visual": {
            "type": "symbol",
            "symbol": "arm"
          }
        },
        {
          "name": "System integrator",
          "caption": "Welding cell",
          "detail": "The integrator selects the torch, power supply, fixtures and guarding, then programs and tests the cell.",
          "visual": {
            "type": "symbol",
            "symbol": "cell"
          }
        },
        {
          "name": "Factory",
          "caption": "Accepted parts",
          "detail": "The factory checks weld quality and cycle time against its requirements and plans maintenance.",
          "visual": {
            "type": "symbol",
            "symbol": "weld"
          }
        }
      ],
      "notes": [
        {
          "title": "What does the joint supply?",
          "body": "A reducer transmits motion at the joint. Motor sizing, sensing and control also shape how the arm moves.",
          "refs": [
            1,
            2
          ]
        },
        {
          "title": "What does integration add?",
          "body": "The arm can reach a point in space. Making a repeatable weld also takes a fixture that locates the part and a torch and power source working together.",
          "refs": [
            2,
            3
          ]
        },
        {
          "title": "How is value verified?",
          "body": "Trial-weld a representative part, inspect the joint and time the full cycle. These checks show whether the cell meets production needs.",
          "refs": [
            3,
            4
          ]
        }
      ],
      "insight": {
        "title": "What if the fixture shifts?",
        "body": "The real seam can move away from the programmed path. An integrator can improve the fixture or add seam finding, then check how the extra motion affects cycle time.",
        "refs": [
          3
        ]
      },
      "boundary": "These roles can overlap. Welding equipment and tooling may be supplied directly to the integrator. The diagram covers industrial arc welding.",
      "sources": [
        {
          "label": "Harmonic Drive · Joint reducers",
          "url": "https://www.hds.co.jp/english/company/business/example/"
        },
        {
          "label": "ABB · Robotics glossary",
          "url": "https://global.abb/content/dam/abb/global/group/investors/documents/ir-events/2017/Glossary%20of%20technical%20terms%20-%20abb-innovation-technology-day%20-%202017.pdf"
        },
        {
          "label": "Lincoln Electric · Arc sensing",
          "url": "https://qacd10.lincolnelectric.com/en-GB/Welding-and-Cutting-Resource-Center/Process-and-Theory/Intelligent-Robotic-Arc-Sensing"
        },
        {
          "label": "Lincoln Electric · Customer case",
          "url": "https://ch-delivery.lincolnelectric.com/api/public/content/20f948ba18cf4c10a276d54630974fb1?v=1b992607"
        }
      ],
      "feedback": "The factory specifies part size, weld locations and cycle time. The integrator uses these to select equipment."
    }
  },
  "zh-CN": {
    "gpu": {
      "mode": "mechanism",
      "title": "GPU 怎样同时算出许多结果？",
      "scope": "NVIDIA CUDA 的一维向量加法",
      "lead": "把 4,096 对数字逐项相加。每个线程负责一个下标，GPU 可以并行处理互不依赖的元素。",
      "figure": "沿着一个线程块，放大到一组线程",
      "relation": "放大",
      "stages": [
        {
          "name": "网格 Grid",
          "caption": "32 个线程块",
          "detail": "每格代表一个块，亮格对应第 0 块。",
          "visual": {
            "type": "matrix",
            "rows": 4,
            "cols": 8,
            "lit": 1
          }
        },
        {
          "name": "线程块 Block",
          "caption": "每块 128 个线程",
          "detail": "每格是一个线程，每行 32 个。亮行组成第一个 warp。",
          "visual": {
            "type": "matrix",
            "rows": 4,
            "cols": 32,
            "lit": 32
          }
        },
        {
          "name": "线程束 Warp",
          "caption": "32 个执行位置",
          "detail": "两行共 32 个线程。本例中它们执行相同的加法指令，各自使用不同下标。",
          "visual": {
            "type": "matrix",
            "rows": 2,
            "cols": 16,
            "lit": 32
          }
        }
      ],
      "notes": [
        {
          "title": "谁把工作交给 GPU？",
          "body": "CPU 启动核函数，指定 32 块 × 128 线程。块号和块内编号从 0 计起，第 2 块的 5 号线程处理下标 2 × 128 + 5 = 261。",
          "refs": [
            1
          ]
        },
        {
          "title": "线程在哪里执行？",
          "body": "一个块分配给一个流式多处理器（SM）。SM 在就绪的 warp 中选择并发出指令，实际并发量受硬件资源约束。",
          "refs": [
            1,
            2
          ]
        },
        {
          "title": "算好的数字去哪儿？",
          "body": "线程 i 读 A[i] 和 B[i]，将和写到 C[i]。相邻线程访问连续的全局内存地址，有利于合并访存请求。",
          "refs": [
            2
          ]
        }
      ],
      "insight": {
        "title": "为什么再加算术单元也可能加速有限？",
        "body": "若三组数据都是 4 字节浮点数，每个结果只做 1 次加法，逻辑上却要读 8 字节、写 4 字节。内存带宽可能先成为瓶颈。",
        "refs": [
          2
        ]
      },
      "boundary": "4,096 和每块 128 个线程是本例设定。图中格子表示逻辑分组，格数不代表物理核心数或同时运行的线程数。",
      "sources": [
        {
          "label": "NVIDIA · CUDA 编程模型",
          "url": "https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html"
        },
        {
          "label": "NVIDIA · CUDA 最佳实践",
          "url": "https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html"
        }
      ],
      "lang": "zh-CN"
    },
    "robotics": {
      "mode": "industry",
      "title": "一台机械臂，怎样变成焊接产能？",
      "scope": "工业机器人产业链 · 弧焊工作站",
      "lead": "沿着一件焊接工件追踪交付物。减速器、机器人和整套工作站各解决一个不同的问题。",
      "figure": "从关节部件到可投产的工作站",
      "relation": "交付",
      "stages": [
        {
          "name": "部件供应商",
          "caption": "关节传动",
          "detail": "提供精密减速器，配合电机传递关节所需的转速和转矩。",
          "visual": {
            "type": "symbol",
            "symbol": "gear"
          }
        },
        {
          "name": "机器人制造商",
          "caption": "受控运动",
          "detail": "把机械结构、驱动和控制器组成能够按轨迹运动的机器人。",
          "visual": {
            "type": "symbol",
            "symbol": "arm"
          }
        },
        {
          "name": "系统集成商",
          "caption": "焊接工作站",
          "detail": "匹配焊源、焊枪、夹具和防护，编程并调试整站。",
          "visual": {
            "type": "symbol",
            "symbol": "cell"
          }
        },
        {
          "name": "制造工厂",
          "caption": "合格工件",
          "detail": "按产品要求验证焊缝质量与生产节拍，并安排日常维护。",
          "visual": {
            "type": "symbol",
            "symbol": "weld"
          }
        }
      ],
      "feedback": "工厂提出工件尺寸、焊缝位置和目标节拍，集成商据此选型与布置。",
      "notes": [
        {
          "title": "部件提供什么能力？",
          "body": "减速器可用于机器人关节。关节的运动表现还取决于电机、传感与控制，单个部件只是整机性能的一项因素。",
          "refs": [
            1,
            2
          ]
        },
        {
          "title": "为什么要单列集成？",
          "body": "机械臂能够到达一个位置，焊接还需要可靠地定位工件，并让焊枪、焊接电源及工装协调工作。",
          "refs": [
            2,
            3
          ]
        },
        {
          "title": "价值如何被验证？",
          "body": "可用同一个工件做试焊，检查接头质量并记录完整循环用时。工厂据此判断工作站能否满足产线要求。",
          "refs": [
            3,
            4
          ]
        }
      ],
      "insight": {
        "title": "夹具偏一点，影响会传到哪一层？",
        "body": "工件偏移会使实际焊缝偏离程序轨迹。集成商可改善定位或加入寻位功能，同时评估额外动作对节拍的影响。",
        "refs": [
          3
        ]
      },
      "boundary": "按交付角色划分，同一家企业可以兼任制造与集成。焊源、工装等也可直接供给集成商。范围限于工业弧焊场景。",
      "sources": [
        {
          "label": "Harmonic Drive · 关节减速器",
          "url": "https://www.hds.co.jp/english/company/business/example/"
        },
        {
          "label": "ABB · 工业机器人术语",
          "url": "https://global.abb/content/dam/abb/global/group/investors/documents/ir-events/2017/Glossary%20of%20technical%20terms%20-%20abb-innovation-technology-day%20-%202017.pdf"
        },
        {
          "label": "Lincoln Electric · 焊缝寻位",
          "url": "https://qacd10.lincolnelectric.com/en-GB/Welding-and-Cutting-Resource-Center/Process-and-Theory/Intelligent-Robotic-Arc-Sensing"
        },
        {
          "label": "Lincoln Electric · 应用案例",
          "url": "https://ch-delivery.lincolnelectric.com/api/public/content/20f948ba18cf4c10a276d54630974fb1?v=1b992607"
        }
      ],
      "lang": "zh-CN"
    }
  }
};
export const webPrompt = {"en": "Use LayerLens to explain the subject I provide in a single, sourced diagram. For a mechanism, trace an input through the system. For an industry, follow a deliverable between roles. State assumptions and one limiting condition. Use English unless I request another supported language. Return editable JSON using this format.\n# Diagram format\n\nSupply a UTF-8 JSON object. See [the CUDA example](gpu.json) for a complete file.\n\n- `lang` accepts `en` or `zh-CN`. English is the default for new diagrams. Set the language and write all content in that language.\n- `mode` is `mechanism` or `industry`.\n- `title` states the question. `scope` limits the subject. `lead` gives the short answer.\n- `figure` names the main illustration. `relation` defines what the arrows mean, such as “Zoom into the highlight” or “Deliver to the next role”.\n- `stages` contains 2–5 objects with `name`, `caption`, `detail` and `visual`. Explain the object's output or the next level of detail.\n- A matrix visual uses `{\"type\":\"matrix\",\"rows\":4,\"cols\":8,\"lit\":1}`. Use 1–8 rows and 1–32 columns. The first lit cells are highlighted. Use counts the reader can verify.\n- Symbol visuals use `{\"type\":\"symbol\",\"symbol\":\"input\"}`. Choose input, process, output, stack, gear, arm, cell or weld.\n- Optional `feedback` describes a requirement sent back from the final stage to the preceding one.\n- `notes` contains 2–4 annotations. `insight` is one annotation explaining a bottleneck, acceptance test, or failure condition. Every annotation has `title`, `body` and `refs`. Reference numbers start at 1.\n- `boundary` explains the assumptions behind the example and where the conclusion applies.\n- `sources` lists up to 8 entries with a short `label` and an optional HTTP(S) `url`. Use a document title and page number for local sources. For an original example, identify the assumptions and use an empty references list if appropriate.\n\n{\n  \"mode\": \"mechanism\",\n  \"lang\": \"en\",\n  \"title\": \"How does a GPU add 4,096 pairs of numbers?\",\n  \"scope\": \"One-dimensional vector addition in NVIDIA CUDA\",\n  \"lead\": \"Each thread adds one pair of numbers. Because the sums are independent, the GPU can work on many elements in parallel.\",\n  \"figure\": \"Follow one block down to its first warp\",\n  \"relation\": \"Zoom into the highlight\",\n  \"stages\": [\n    {\n      \"name\": \"Grid\",\n      \"caption\": \"32 blocks\",\n      \"detail\": \"Each tile is a block. Follow the highlighted block, number 0.\",\n      \"visual\": {\n        \"type\": \"matrix\",\n        \"rows\": 4,\n        \"cols\": 8,\n        \"lit\": 1\n      }\n    },\n    {\n      \"name\": \"Thread block\",\n      \"caption\": \"128 threads per block\",\n      \"detail\": \"Each tile is a thread. The highlighted row of 32 threads forms the first warp.\",\n      \"visual\": {\n        \"type\": \"matrix\",\n        \"rows\": 4,\n        \"cols\": 32,\n        \"lit\": 32\n      }\n    },\n    {\n      \"name\": \"Warp\",\n      \"caption\": \"32 lanes\",\n      \"detail\": \"The same warp is drawn in two rows. Its threads add different pairs of numbers.\",\n      \"visual\": {\n        \"type\": \"matrix\",\n        \"rows\": 2,\n        \"cols\": 16,\n        \"lit\": 32\n      }\n    }\n  ],\n  \"notes\": [\n    {\n      \"title\": \"Who assigns the work?\",\n      \"body\": \"The CPU launches 32 blocks of 128 threads. With zero-based indexing, thread 5 in block 2 handles element 2 × 128 + 5 = 261.\",\n      \"refs\": [\n        1\n      ]\n    },\n    {\n      \"title\": \"Where do threads run?\",\n      \"body\": \"A block is assigned to one streaming multiprocessor (SM). The SM issues instructions to ready warps. Available hardware resources limit how many can run concurrently.\",\n      \"refs\": [\n        1,\n        2\n      ]\n    },\n    {\n      \"title\": \"Where do results go?\",\n      \"body\": \"Thread i reads A[i] and B[i] and writes their sum to C[i]. When neighboring threads access consecutive addresses, the GPU can combine their memory requests.\",\n      \"refs\": [\n        2\n      ]\n    }\n  ],\n  \"insight\": {\n    \"title\": \"What might limit speed?\",\n    \"body\": \"For 4-byte floats, one addition needs two reads (8 bytes) and one write (4 bytes). Memory bandwidth can limit throughput even when arithmetic units have capacity.\",\n    \"refs\": [\n      2\n    ]\n  },\n  \"boundary\": \"The example uses 128 threads per block. The tiles depict logical groups. The number executing at once depends on the hardware.\",\n  \"sources\": [\n    {\n      \"label\": \"NVIDIA · CUDA Programming Model\",\n      \"url\": \"https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html\"\n    },\n    {\n      \"label\": \"NVIDIA · CUDA Best Practices Guide\",\n      \"url\": \"https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html\"\n    }\n  ]\n}", "zh-CN": "请用图个明白拆解我提供的主题。运行原理请追踪输入到输出，产业链请追踪各环节的交付物。标明依据、假设和适用条件。使用简体中文，按以下格式返回完整 JSON。\n# 图稿字段\n\nUTF-8 JSON 对象。字段名用英文，正文跟随用户语言。网页端和命令行共用同一格式。\n\n- `lang` 可选 en 或 zh-CN。生成中文图稿时设为 zh-CN。\n- `mode` 取 `mechanism` 或 `industry`。\n- `title` 提出核心问题，`scope` 限定对象，`lead` 用一两句话直接回答。\n- `figure` 是主图标题，`relation` 说明相邻对象间的箭头含义，如“沿数据路径”“放大高亮部分”“交付实物与系统”。选用一种贯穿主图的关系。\n- `stages` 列出 2–5 个对象。每个包含 `name`、`caption`、`detail`、`visual`。caption 写关键数量、功能或交付物；detail 解释它与下一个对象的关系。\n- `visual` 可用 `{\"type\":\"matrix\",\"rows\":4,\"cols\":8,\"lit\":1}`。行数 1–8，列数 1–32，高亮前 lit 个格。数量应从材料或明确的例题得出。\n- 其他对象可用 `{\"type\":\"symbol\",\"symbol\":\"input\"}`。通用语义图形有 input、process、output、stack；机械图形有 gear、arm、cell、weld。任取适合的形状。图注承担精确定义。\n- `feedback` 可省略。有下游向前一环提出的要求时，写出发出方、接收方与要求。\n- `notes` 是 2–4 个分析段落，`insight` 是一个能揭示瓶颈、验收标准或失效条件的推论。两者的条目都含 `title`、`body`、`refs`。refs 为来源编号数组。\n- `boundary` 写明具体条件与简化。例题中的数值要明确注明。\n- `sources` 是最多 8 个对象组成的数组，元素包含简短 `label` 和可选 `url`。官方网页使用 http(s) 链接，用户文档在 label 中写文档名及页码。无外部依据的自拟示例可用空数组并交代来历。\n\n{\n  \"mode\": \"mechanism\",\n  \"title\": \"GPU 怎样同时算出许多结果？\",\n  \"scope\": \"NVIDIA CUDA 的一维向量加法\",\n  \"lead\": \"把 4,096 对数字逐项相加。每个线程负责一个下标，GPU 可以并行处理互不依赖的元素。\",\n  \"figure\": \"沿着一个线程块，放大到一组线程\",\n  \"relation\": \"放大\",\n  \"stages\": [\n    {\n      \"name\": \"网格 Grid\",\n      \"caption\": \"32 个线程块\",\n      \"detail\": \"每格代表一个块，亮格对应第 0 块。\",\n      \"visual\": {\n        \"type\": \"matrix\",\n        \"rows\": 4,\n        \"cols\": 8,\n        \"lit\": 1\n      }\n    },\n    {\n      \"name\": \"线程块 Block\",\n      \"caption\": \"每块 128 个线程\",\n      \"detail\": \"每格是一个线程，每行 32 个。亮行组成第一个 warp。\",\n      \"visual\": {\n        \"type\": \"matrix\",\n        \"rows\": 4,\n        \"cols\": 32,\n        \"lit\": 32\n      }\n    },\n    {\n      \"name\": \"线程束 Warp\",\n      \"caption\": \"32 个执行位置\",\n      \"detail\": \"两行共 32 个线程。本例中它们执行相同的加法指令，各自使用不同下标。\",\n      \"visual\": {\n        \"type\": \"matrix\",\n        \"rows\": 2,\n        \"cols\": 16,\n        \"lit\": 32\n      }\n    }\n  ],\n  \"notes\": [\n    {\n      \"title\": \"谁把工作交给 GPU？\",\n      \"body\": \"CPU 启动核函数，指定 32 块 × 128 线程。块号和块内编号从 0 计起，第 2 块的 5 号线程处理下标 2 × 128 + 5 = 261。\",\n      \"refs\": [\n        1\n      ]\n    },\n    {\n      \"title\": \"线程在哪里执行？\",\n      \"body\": \"一个块分配给一个流式多处理器（SM）。SM 在就绪的 warp 中选择并发出指令，实际并发量受硬件资源约束。\",\n      \"refs\": [\n        1,\n        2\n      ]\n    },\n    {\n      \"title\": \"算好的数字去哪儿？\",\n      \"body\": \"线程 i 读 A[i] 和 B[i]，将和写到 C[i]。相邻线程访问连续的全局内存地址，有利于合并访存请求。\",\n      \"refs\": [\n        2\n      ]\n    }\n  ],\n  \"insight\": {\n    \"title\": \"为什么再加算术单元也可能加速有限？\",\n    \"body\": \"若三组数据都是 4 字节浮点数，每个结果只做 1 次加法，逻辑上却要读 8 字节、写 4 字节。内存带宽可能先成为瓶颈。\",\n    \"refs\": [\n      2\n    ]\n  },\n  \"boundary\": \"4,096 和每块 128 个线程是本例设定。图中格子表示逻辑分组，格数不代表物理核心数或同时运行的线程数。\",\n  \"sources\": [\n    {\n      \"label\": \"NVIDIA · CUDA 编程模型\",\n      \"url\": \"https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/programming-model.html\"\n    },\n    {\n      \"label\": \"NVIDIA · CUDA 最佳实践\",\n      \"url\": \"https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/index.html\"\n    }\n  ],\n  \"lang\": \"zh-CN\"\n}"};
