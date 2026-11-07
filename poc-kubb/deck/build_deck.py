import re
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

BG = RGBColor(0x0B, 0x0F, 0x19)
PANEL = RGBColor(0x15, 0x1B, 0x2B)
TEXT = RGBColor(0xE6, 0xEA, 0xF2)
MUTED = RGBColor(0x8B, 0x95, 0xA8)
TEAL = RGBColor(0x2D, 0xD4, 0xBF)
AMBER = RGBColor(0xF5, 0xA5, 0x24)
GREEN = RGBColor(0x7E, 0xE7, 0x87)
RED = RGBColor(0xF0, 0x6B, 0x6B)
KW = RGBColor(0xC7, 0x92, 0xEA)
STR = RGBColor(0xC3, 0xE8, 0x8D)
CMT = RGBColor(0x63, 0x77, 0x77)
FN = RGBColor(0x82, 0xAA, 0xFF)
CODE = RGBColor(0xD6, 0xDE, 0xEB)

FONT = "Calibri"
MONO = "Consolas"

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
BLANK = prs.slide_layouts[6]


def new_slide(notes):
    s = prs.slides.add_slide(BLANK)
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = BG
    s.notes_slide.notes_text_frame.text = notes
    return s


def text(s, x, y, w, h, t, size=24, color=TEXT, bold=False, align=PP_ALIGN.LEFT,
         font=FONT, anchor=MSO_ANCHOR.TOP):
    tb = s.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = tf.margin_right = Inches(0.05)
    for i, line in enumerate(t.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        r = p.add_run()
        r.text = line
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.name = font
        r.font.color.rgb = color
    return tb


def box(s, x, y, w, h, fill=PANEL, line=None, shape=MSO_SHAPE.ROUNDED_RECTANGLE, radius=0.08):
    sh = s.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    sh.fill.solid()
    sh.fill.fore_color.rgb = fill
    if line is None:
        sh.line.fill.background()
    else:
        sh.line.color.rgb = line
        sh.line.width = Pt(1.5)
    if shape == MSO_SHAPE.ROUNDED_RECTANGLE:
        sh.adjustments[0] = radius
    sh.shadow.inherit = False
    return sh


def label(s, x, y, w, h, t, size=20, color=TEXT, fill=PANEL, line=None, bold=True, font=FONT):
    sh = box(s, x, y, w, h, fill=fill, line=line)
    tf = sh.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    for i, ln in enumerate(t.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        r = p.add_run()
        r.text = ln
        r.font.size = Pt(size if i == 0 else size - 6)
        r.font.bold = bold if i == 0 else False
        r.font.name = font
        r.font.color.rgb = color if i == 0 else MUTED
    return sh


def title(s, t, sub=None):
    bar = box(s, 0.6, 0.62, 0.08, 0.62, fill=TEAL, shape=MSO_SHAPE.RECTANGLE)
    text(s, 0.8, 0.5, 11.5, 0.9, t, size=38, bold=True)
    if sub:
        text(s, 0.8, 1.25, 11.5, 0.6, sub, size=20, color=MUTED)


TOKEN = re.compile(
    r"(?P<cmt>//[^\n]*|#[^\n]*)|(?P<str>'[^']*'|\"[^\"]*\")|"
    r"(?P<kw>\b(?:import|from|export|default|type|const|function|openapi|paths|components|"
    r"required|properties|schemas|servers|info|get|responses|parameters)\b)|"
    r"(?P<fn>\b(?:defineConfig|pluginTs|pluginAxios|pluginZod)\b)"
)


def code(s, x, y, w, h, src, size=15, hl=None, header=None):
    """Code panel with light syntax highlighting. hl: {line_index: color} for diff lines."""
    hl = hl or {}
    box(s, x, y, w, h, fill=PANEL, radius=0.03)
    ty = y
    if header:
        text(s, x + 0.15, y + 0.08, w - 0.3, 0.35, header, size=12, color=MUTED, font=MONO)
        ty = y + 0.4
    tb = s.shapes.add_textbox(Inches(x + 0.1), Inches(ty + 0.05), Inches(w - 0.2), Inches(h - 0.5))
    tf = tb.text_frame
    tf.word_wrap = False
    for i, line in enumerate(src.split("\n")):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        if i in hl:
            r = p.add_run()
            r.text = line
            r.font.size = Pt(size)
            r.font.name = MONO
            r.font.bold = True
            r.font.color.rgb = hl[i]
            continue
        pos = 0
        for m in TOKEN.finditer(line):
            if m.start() > pos:
                _run(p, line[pos:m.start()], CODE, size)
            kind = m.lastgroup
            _run(p, m.group(), {"cmt": CMT, "str": STR, "kw": KW, "fn": FN}[kind], size)
            pos = m.end()
        if pos < len(line):
            _run(p, line[pos:], CODE, size)
        if not line:
            _run(p, " ", CODE, size)


def _run(p, t, color, size):
    r = p.add_run()
    r.text = t
    r.font.size = Pt(size)
    r.font.name = MONO
    r.font.color.rgb = color


# ---------------------------------------------------------------- 1. Hook
s = new_slide(
    "[0:00 - 0:45]\n"
    "Quick question: who here has shipped a bug because the API changed and the frontend didn't? "
    "[pause] Frontend, backend, QA, infra... everyone has.\n\n"
    "Today I'll show you Kubb, a tool that makes that kind of bug much harder to ship.\n\n"
    "Eight minutes: what it is, how it works, a live demo in VS Code, and when you should, and shouldn't, use it."
)
text(s, 0.8, 2.2, 11.8, 1.9, "Kubb", size=96, bold=True)
text(s, 0.8, 4.3, 11.8, 0.9, "Generate your API layer from the OpenAPI spec", size=30, color=TEAL, bold=True)
text(s, 0.8, 5.1, 11.8, 0.6, "kubb.dev", size=20, color=MUTED)
box(s, 0.8, 6.55, 3.0, 0.06, fill=TEAL, shape=MSO_SHAPE.RECTANGLE)

# ---------------------------------------------------------------- 2. What
s = new_slide(
    "[0:45 - 1:45]\n"
    "Kubb is an open-source, MIT-licensed code generator. You give it an OpenAPI spec, versions 2.0, 3.0 or 3.1, "
    "and it generates the code around your API: TypeScript types, typed HTTP clients, React Query, Vue Query "
    "and SWR hooks, Zod schemas, Faker data, MSW mock handlers, even Cypress tests and an MCP server.\n\n"
    "You pick what you need with plugins, in a single config file. And the generated files live in your repo. "
    "No runtime magic, you can read every line. When the spec changes, you regenerate. That's the whole idea.\n\n"
    "Why does this matter in this room? Backend: the spec becomes a real contract. Frontend: no hand-written types. "
    "QA: mocks and test data come for free. Infra and leads: run it in CI and you can catch drift before merge."
)
title(s, "What is Kubb?", "OpenAPI in  →  typed code out. Open source (MIT). One config file.")
chips = ["TS types", "Axios / Fetch clients", "React / Vue Query", "SWR hooks", "Zod schemas",
         "Faker data", "MSW mocks", "Cypress tests", "MCP server"]
for i, c in enumerate(chips):
    col, row = i % 3, i // 3
    label(s, 0.8 + col * 4.05, 2.15 + row * 1.0, 3.85, 0.8, c, size=22, color=TEAL, line=TEAL)
roles = [("Backend", "spec = contract"), ("Frontend", "no hand-written types"),
         ("QA", "mocks for free"), ("Infra / Leads", "catch drift in CI")]
for i, (r, d) in enumerate(roles):
    label(s, 0.8 + i * 3.04, 5.5, 2.9, 1.1, f"{r}\n{d}", size=22, fill=PANEL)

# ---------------------------------------------------------------- 3. How
s = new_slide(
    "[1:45 - 2:45]\n"
    "How does it work? Think of a pipeline. An adapter reads your spec once and resolves all the references. "
    "That produces an AST: a neutral tree of schemas and operations. It knows nothing about Axios or React.\n\n"
    "Then plugins take that same tree, and each plugin owns one output: one for types, one for the client, one for Zod. "
    "Generators turn nodes into files, and a printer and parser write the final source, to disk, or to memory, "
    "which is handy in tests.\n\n"
    "The key point: the spec is parsed once and feeds many plugins in a single run. Add a plugin, get a new output, "
    "without touching the others. And it's extensible: you can write your own plugin or adapter."
)
title(s, "How it works", "Parse once, generate many outputs")
steps = [("OpenAPI\nspec", "2.0 / 3.0 / 3.1"), ("Adapter", "reads + resolves $ref"), ("AST", "schemas + operations"),
         ("Plugins", "one per output"), ("Files", "disk or memory")]
for i, (a, b) in enumerate(steps):
    x = 0.7 + i * 2.5
    hot = a == "Plugins"
    label(s, x, 2.6, 2.0, 1.5, f"{a}\n{b}", size=24, color=TEAL if hot else TEXT,
          line=TEAL if hot else None)
    if i < len(steps) - 1:
        text(s, x + 2.0, 3.0, 0.5, 0.7, "→", size=32, color=AMBER, bold=True, align=PP_ALIGN.CENTER)
for i, c in enumerate(["plugin-ts", "plugin-axios", "plugin-zod"]):
    label(s, 8.2, 4.35 + i * 0.6, 2.0, 0.5, c, size=16, color=KW, fill=PANEL, font=MONO)
text(s, 0.8, 6.3, 11.8, 0.6, "One AST feeds several plugins in a single run. Add a plugin, get a new output.",
     size=22, color=MUTED)


# ---------------------------------------------------------------- Live demo (VS Code)
s = new_slide(
    "[2:45 - 5:30]  LIVE DEMO in VS Code (about 2:45). Full script in DEMO.md.\n"
    "Switch to VS Code now. [Alt-tab]\n\n"
    "1. Show petStore.yaml: one endpoint, one Pet schema. Then kubb.config.ts: input, output, three plugins.\n"
    "2. Show src/index.ts: red squiggles, because the generated code doesn't exist yet.\n"
    "3. Terminal: npx kubb generate. Nine files in about 200 ms. The squiggles disappear.\n"
    "4. Open models/Pet.ts and clients/getPetById.ts. Point at the header: 'Generated by Kubb, do not edit manually'.\n"
    "5. In index.ts change pet.name to pet.tag. Red squiggle: the spec has no tag yet.\n"
    "6. Add 'tag: type: string' to the spec, run generate again. The squiggle disappears, and Pet has tag?: string. "
    "Nobody wrote a type by hand. If a field were removed, the compiler would show every place that breaks.\n\n"
    "Heads-up: int64 IDs are generated as bigint, so check how your serializers handle that.\n"
    "Kubb 5 needs Node 22.22 or newer.\n\n"
    "If anything breaks: go to the hidden slides at the end (config and spec diff), or play the backup video."
)
title(s, "Live demo", "Switch to VS Code")
demo_steps = [("1", "Spec + config"), ("2", "Generate"), ("3", "Read the output"), ("4", "Edit spec, regenerate")]
for i, (n, t) in enumerate(demo_steps):
    label(s, 0.8 + i * 3.04, 2.6, 2.9, 1.9, f"{n}\n{t}", size=34, color=TEAL, line=TEAL)
text(s, 0.8, 5.1, 11.8, 0.6, "$ npx kubb generate", size=30, color=GREEN, font=MONO, bold=True)
text(s, 0.8, 5.9, 11.8, 0.6, "Node 22.22+  ·  never edit src/gen by hand", size=20, color=MUTED)

# ---------------------------------------------------------------- 4. Demo 1
CONFIG = """import { defineConfig } from 'kubb/config'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginAxios } from '@kubb/plugin-axios'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
  input: './petStore.yaml',
  output: { path: './src/gen', clean: true },
  plugins: [
    pluginTs({ output: { path: 'models' } }),
    pluginAxios({ output: { path: 'clients' } }),
    pluginZod({ output: { path: 'zod' } }),
  ],
})"""
s = new_slide(
    "BACKUP SLIDE (hidden). Use only if the live demo fails.\n"
    "Let's see it. I have a tiny Petstore spec: one endpoint, get pet by ID.\n\n"
    "This is the entire config: the input, an output folder, and three plugins: types, client, and Zod.\n\n"
    "[run: npx kubb generate]\n\n"
    "In about 200 milliseconds, nine files. Models with the types, a typed client, and Zod schemas. "
    "Notice the header in each file: 'Generated by Kubb, do not edit manually'. That's the contract: "
    "never edit it, always regenerate.\n\n"
    "One practical note: Kubb 5 needs Node 22.22 or newer."
)
title(s, "Demo: one config, three outputs")
code(s, 0.6, 1.6, 7.4, 5.2, CONFIG, size=14, header="kubb.config.ts")
box(s, 8.3, 1.6, 4.45, 1.0, fill=PANEL, radius=0.05)
text(s, 8.45, 1.78, 4.2, 0.6, "$ npx kubb generate", size=22, color=GREEN, font=MONO, bold=True)
TREE = "src/gen/\n├── clients/\n│   └── getPetById.ts\n├── models/\n│   ├── GetPetById.ts\n│   └── Pet.ts\n└── zod/\n    ├── getPetByIdSchema.ts\n    └── petSchema.ts"
box(s, 8.3, 2.85, 4.45, 3.2, fill=PANEL, radius=0.05)
text(s, 8.45, 2.95, 4.2, 3.0, TREE, size=15, color=CODE, font=MONO)
text(s, 8.3, 6.2, 4.45, 0.6, "9 files · ~200 ms · Node 22.22+", size=18, color=TEAL, bold=True)

# ---------------------------------------------------------------- 5. Demo 2
SPEC = """components:
  schemas:
    Pet:
      type: object
      required: [id, name]
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
+       tag:
+         type: string"""
PET = """export type Pet = {
  id: bigint;
  name: string;
+ tag?: string;
};"""
s = new_slide(
    "BACKUP SLIDE (hidden). Use only if the live demo fails.\n"
    "Now the part that matters. The backend adds an optional 'tag' field to Pet. I change the spec, two lines, "
    "and run generate again.\n\n"
    "Look at the result: two files modified, and Pet now has an optional tag property. Nobody wrote a type by hand. "
    "If a field were renamed or removed instead, the TypeScript compiler would point at every place that breaks.\n\n"
    "A small heads-up from my own test: int64 IDs are generated as bigint, so check how your serializers handle that "
    "before adopting it."
)
title(s, "Demo: the spec changes, the code follows")
code(s, 0.6, 1.6, 6.0, 4.6, SPEC, size=15, header="petStore.yaml", hl={11: GREEN, 12: GREEN})
text(s, 6.65, 3.3, 0.7, 0.8, "→", size=40, color=AMBER, bold=True, align=PP_ALIGN.CENTER)
code(s, 7.4, 1.6, 5.35, 2.4, PET, size=16, header="src/gen/models/Pet.ts", hl={3: GREEN})
text(s, 7.4, 4.3, 5.35, 0.5, "$ npx kubb generate", size=20, color=GREEN, font=MONO, bold=True)
text(s, 7.4, 4.85, 5.35, 1.4, "2 files modified · +2 lines\nid: int64 → bigint (check your serializers)",
     size=18, color=MUTED)
text(s, 0.6, 6.45, 12, 0.6, "Never edit src/gen by hand. Change the spec, then regenerate.",
     size=22, color=TEAL, bold=True)

# ---------------------------------------------------------------- 6. Compare
s = new_slide(
    "[5:30 - 6:45]\n"
    "How does it compare? Orval is the closest in breadth. HeyAPI has nice runtime validation. "
    "openapi-typescript is great, and the fastest, if you only need types.\n\n"
    "Kubb's edge is breadth: it's the only one in this table that also generates Cypress tests and Redoc docs, "
    "and its clients return results you can narrow by status code.\n\n"
    "Trade-offs, honestly: OpenAPI 3.2 support is partial; some AI-related features need the paid Pro plan; "
    "and the speed and memory numbers come from Kubb's own benchmarks, so test on your own spec.\n\n"
    "And it's overkill if you have three endpoints that never change, or no OpenAPI spec at all."
)
title(s, "Kubb vs. the alternatives")
Y, N, P = "✓", "✕", "~"
rows = [
    ("", "Kubb", "orval", "HeyAPI", "openapi-ts"),
    ("TypeScript types", Y, Y, Y, Y),
    ("HTTP client", Y, Y, Y, P),
    ("React Query hooks", Y, Y, Y, P),
    ("Zod schemas", Y, Y, Y, N),
    ("MSW + Faker mocks", Y, Y, N, N),
    ("Cypress tests", Y, N, N, N),
    ("MCP server", Y, Y, N, N),
    ("Redoc docs", Y, N, N, N),
]
tbl = s.shapes.add_table(len(rows), 5, Inches(0.6), Inches(1.5), Inches(7.6), Inches(4.9)).table
tbl.columns[0].width = Inches(2.6)
for c, wd in zip(range(1, 5), (1.1, 1.1, 1.2, 1.6)):
    tbl.columns[c].width = Inches(wd)
for r, row in enumerate(rows):
    for c, val in enumerate(row):
        cell = tbl.cell(r, c)
        cell.fill.solid()
        cell.fill.fore_color.rgb = PANEL if r else BG
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = cell.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.LEFT if c == 0 else PP_ALIGN.CENTER
        run = p.add_run()
        run.text = val
        run.font.name = FONT
        run.font.size = Pt(18)
        run.font.bold = (r == 0 or c == 1)
        run.font.color.rgb = (TEAL if c == 1 else TEXT) if r == 0 else \
            {Y: GREEN, N: RED, P: AMBER}.get(val, TEXT)
text(s, 0.6, 6.85, 7.6, 0.4, "✓ built in   ~ partial / separate package   ✕ not supported   (source: kubb.dev comparison)",
     size=13, color=MUTED)
label(s, 8.6, 1.5, 4.15, 2.3, "Strengths\nBroadest set of outputs\nStatus-code-aware responses\nLow memory, small install",
      size=22, color=GREEN, line=GREEN)
label(s, 8.6, 4.05, 4.15, 2.3, "Trade-offs\nOpenAPI 3.2 only partial\nSome AI features need Pro\nTypes-only: openapi-ts is faster",
      size=22, color=AMBER, line=AMBER)

# ---------------------------------------------------------------- 7. Wrap-up
s = new_slide(
    "[6:45 - 8:00]\n"
    "To wrap up: if you have an OpenAPI spec and more than a handful of endpoints, try Kubb. "
    "It's good when the API changes often and many people depend on it. It's not worth it for a few stable endpoints, "
    "or if you don't have a spec.\n\n"
    "The quickstart takes a few minutes: npm install kubb, write a config, run generate. "
    "My suggestion for Monday: pick one service in your team and run it against its real spec.\n\n"
    "Thank you. I'll take questions now, and I'm happy to show the demo again if anyone wants to see a specific part."
)
title(s, "Should you try it?")
label(s, 0.8, 1.7, 5.9, 2.7, "Use it when\nYou have an OpenAPI spec\nThe API changes often\nSeveral teams consume it",
      size=26, color=GREEN, line=GREEN)
label(s, 7.0, 1.7, 5.5, 2.7, "Skip it when\nA few endpoints, rarely changing\nNo spec, and you won't write one",
      size=26, color=AMBER, line=AMBER)
box(s, 0.8, 4.7, 11.7, 1.3, fill=PANEL, radius=0.05)
text(s, 1.0, 4.75, 11.3, 1.2, "$ npm i -D kubb @kubb/plugin-ts   # add kubb.config.ts\n$ npx kubb generate", size=20, color=GREEN,
     font=MONO, bold=True, anchor=MSO_ANCHOR.MIDDLE)
text(s, 0.8, 6.2, 11.7, 0.6, "Try it on one real service this week  ·  kubb.dev  ·  Questions?", size=24,
     color=TEAL, bold=True)

# Reorder: live demo stays at position 4; the two old demo slides become hidden backups at the end.
lst = prs.slides._sldIdLst
ids = list(lst)
order = [0, 1, 2, 3, 6, 7, 4, 5]
for el in ids:
    lst.remove(el)
for i in order:
    lst.append(ids[i])
for i in (4, 5):
    ids[i].getparent()  # keep reference
slides = list(prs.slides)
for sl in slides[-2:]:
    sl._element.set("show", "0")

import os
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "kubb-intro.pptx")
prs.save(out)
print("saved", out)
