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



def wrap_notes(text, max_words=20):
    """Line break every ~20 words, preferring sentence ends, so notes are easy to read aloud."""
    out = []
    for para in text.strip().split("\n\n"):
        for raw in para.split("\n"):
            words, line, lines = raw.split(), [], []
            for i, w in enumerate(words):
                line.append(w)
                n, left = len(line), len(words) - i - 1
                end = w[-1] in ".?!"
                if left == 0:
                    break
                if left <= 3 and n < max_words + 4:
                    continue  # avoid an orphan line of 1-3 words
                if n >= max_words or (end and n >= 10) or (w[-1] == "," and n >= 16):
                    lines.append(" ".join(line))
                    line = []
            if line:
                lines.append(" ".join(line))
            out.extend(lines)
        out.append("")
    return "\n".join(out).strip()


NOTES = {
    "title": """[0:00 - 0:25]
Hi everyone. Today I will talk about RAG. It means Retrieval-Augmented Generation.

In simple words: how to give an AI your own data, at the moment of the question.

We have five minutes. What it is, how it works, and a real example from a small project.""",

    "problem": """[0:25 - 1:00]
An LLM learns from public data, until a certain date. So it does not know your company. It does not know your documents, your policies, or what changed last week.

And when it does not know, it can invent an answer, with a lot of confidence. We call this hallucination.

A first idea: paste all your documents in the prompt. But there is a size limit. And you pay for every token, in every question.

So we need a better way.""",

    "what": """[1:00 - 1:45]
RAG is that better way. Think about an open-book exam. You do not need to remember everything. You open the book, find the right page, and then you write the answer.

RAG does the same, in three steps.

First, retrieve. That means: find the pieces of text that are related to the question.

Second, augment. Put these pieces inside the prompt.

Third, generate. The LLM writes the answer, using that text.

The model does not change. We only change what we send to it.""",

    "how": """[1:45 - 2:30]
There are two parts. The first part happens one time, before the questions. We take the documents and cut them in small pieces. We call them chunks.

Then a model turns each chunk into a list of numbers. This is called an embedding. Texts with a similar meaning get similar numbers. We save all of it in a vector store.

The second part happens at every question. We turn the question into numbers, in the same way. We search for the chunks that are closest. We take the top few, we put them in the prompt, and the LLM answers.

The key idea: we search by meaning, not by exact words.""",

    "example": """[2:30 - 3:50]  EXAMPLE (static slide, no live demo)
Here is a real example, from a small project I built. We have an internal handbook, with six documents. They were cut in twenty chunks.

The question is: can I work from another country, and for how long?

Look at chunk number 1. This is the right one, score about 0.7. It says: up to 30 days per year.

Look at chunk number 3. It is noise, score about 0.3. The search always brings the same number of chunks, even when they are weak. This is a real limit.

And look at the last line. We send only 3 chunks, not the whole handbook. This is how we save tokens.

One more thing. In another question, I wrote call. The document says page the on-call engineer. Different words, same meaning. The search still found it.

This example stops at the prompt. The next step is to send it to the LLM.""",

    "compare": """[3:50 - 4:35]
How does it compare? Fine-tuning changes the model itself. It is good to change style or behavior. But it is hard to update, and it does not show sources.

A long context means pasting everything in the prompt. It is simple, but you pay for all the tokens, in every question.

RAG sends only the pieces that matter. So it uses fewer tokens, the data can change every day, and you can show the sources.

Now the real limits. The answer is only as good as the search. Bad chunks give bad answers. The top results can have noise, like we saw. And you need to control who can see which document.""",

    "close": """[4:35 - 5:00]
To finish. RAG is retrieve, augment, generate. The answer is only as good as the search.

And you can start small: a few documents and a local model, like in this example.

The code is on my GitHub, in the poc-rag folder. Thank you. Questions?""",
}


def new_slide(notes):
    s = prs.slides.add_slide(BLANK)
    s.background.fill.solid()
    s.background.fill.fore_color.rgb = BG
    s.notes_slide.notes_text_frame.text = wrap_notes(notes)
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


def code(s, x, y, w, h, src, size=15, hl=None, header=None, plain=False):
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
        if plain:
            _run(p, line or ' ', CODE, size)
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



GOOD, BAD, MID = GREEN, RED, AMBER

# ---------------------------------------------------------------- 1. Title
s = new_slide(NOTES["title"])
text(s, 0.8, 2.0, 11.8, 1.9, "RAG", size=96, bold=True)
text(s, 0.8, 4.0, 11.8, 0.9, "Retrieval-Augmented Generation", size=32, color=TEAL, bold=True)
text(s, 0.8, 4.9, 11.8, 0.6, "Give the LLM your data, at question time", size=22, color=MUTED)
box(s, 0.8, 6.55, 3.0, 0.06, fill=TEAL, shape=MSO_SHAPE.RECTANGLE)

# ---------------------------------------------------------------- 2. Problem
s = new_slide(NOTES["problem"])
title(s, "The problem", "An LLM only knows what it saw in training")
cards = [("Doesn't know your data", "your docs, your policies"),
         ("Can invent answers", "hallucination"),
         ("Stops at a date", "training cutoff")]
for i, (a, b) in enumerate(cards):
    label(s, 0.8 + i * 4.05, 2.3, 3.85, 1.9, f"{a}\n{b}", size=28, color=RED, line=RED)
box(s, 0.8, 4.9, 11.7, 1.4, fill=PANEL, radius=0.05)
text(s, 1.0, 5.0, 11.3, 0.5, "Paste all the documents in the prompt?", size=24, bold=True)
text(s, 1.0, 5.55, 11.3, 0.6, "Size limit  +  you pay for every token, in every question", size=22, color=AMBER)

# ---------------------------------------------------------------- 3. What
s = new_slide(NOTES["what"])
title(s, "What is RAG?", "Like an open-book exam: find the right page, then write the answer")
steps = [("1  Retrieve", "find the relevant text"), ("2  Augment", "put it in the prompt"),
         ("3  Generate", "the LLM answers")]
for i, (a, b) in enumerate(steps):
    x = 0.8 + i * 4.1
    label(s, x, 2.5, 3.5, 1.9, f"{a}\n{b}", size=32, color=TEAL, line=TEAL)
    if i < 2:
        text(s, x + 3.5, 3.0, 0.6, 0.8, "→", size=36, color=AMBER, bold=True, align=PP_ALIGN.CENTER)
text(s, 0.8, 5.3, 11.8, 0.6, "The model does not change. We change what we send to it.", size=26, color=MUTED)

# ---------------------------------------------------------------- 4. How
s = new_slide(NOTES["how"])
title(s, "How it works", "Two parts: index once, search at every question")
text(s, 0.8, 1.9, 6, 0.5, "INDEX  (one time)", size=18, color=AMBER, bold=True)
lane1 = [("Documents", "your files"), ("Chunks", "small pieces"), ("Embeddings", "numbers = meaning"),
         ("Vector store", "saved index")]
for i, (a, b) in enumerate(lane1):
    x = 0.8 + i * 2.85
    label(s, x, 2.4, 2.3, 1.2, f"{a}\n{b}", size=22)
    if i < 3:
        text(s, x + 2.3, 2.65, 0.55, 0.7, "→", size=28, color=AMBER, bold=True, align=PP_ALIGN.CENTER)
text(s, 0.8, 4.0, 6, 0.5, "ASK  (every question)", size=18, color=AMBER, bold=True)
lane2 = [("Question", "in words"), ("Embed", "same model"), ("Top-k search", "closest chunks"),
         ("Prompt", "question + chunks"), ("LLM", "writes the answer")]
for i, (a, b) in enumerate(lane2):
    x = 0.8 + i * 2.35
    hot = a == "Top-k search"
    label(s, x, 4.5, 1.95, 1.2, f"{a}\n{b}", size=20, color=TEAL if hot else TEXT, line=TEAL if hot else None)
    if i < 4:
        text(s, x + 1.95, 4.75, 0.4, 0.7, "→", size=26, color=AMBER, bold=True, align=PP_ALIGN.CENTER)
text(s, 0.8, 6.2, 11.8, 0.6, "We search by meaning, not by exact words.", size=24, color=MUTED)

OUT = """$ npm run ask:remote

Question: Can I work from another country, and for how long?

#1  score 0.71  remote-work.md
    You can work from another country for up to 30 days...
#2  score 0.39  remote-work.md
    Acme Labs is remote-first. You can work from home...
#3  score 0.34  learning.md
    Certifications are paid in full if they are related...

Chunks sent to the LLM: 3 of 20"""
s = new_slide(NOTES["example"])
title(s, "Example", "6 documents, 20 chunks, one question")
code(s, 0.6, 1.9, 7.9, 4.6, OUT, size=14, plain=True, header="top 3 chunks",
     hl={4: GREEN, 5: GREEN, 8: AMBER, 9: AMBER})
label(s, 8.8, 1.9, 3.95, 4.6,
      "Notice\n#1  right chunk (0.71)\n#3  noise (0.34)\n3 of 20 chunks sent\nnot the whole handbook",
      size=28, color=TEAL, line=TEAL)

# ---------------------------------------------------------------- 6. Compare
s = new_slide(NOTES["compare"])
title(s, "RAG vs. the alternatives")
rows = [
    [("", TEXT), ("RAG", TEAL), ("Fine-tuning", TEXT), ("Long context", TEXT)],
    [("Data changes often", TEXT), ("works", GOOD), ("retrain", BAD), ("works", GOOD)],
    [("Tokens per question", TEXT), ("few", GOOD), ("few", GOOD), ("many", BAD)],
    [("Shows sources", TEXT), ("yes", GOOD), ("no", BAD), ("partly", MID)],
    [("Setup effort", TEXT), ("medium", MID), ("high", BAD), ("low", GOOD)],
]
tbl = s.shapes.add_table(len(rows), 4, Inches(0.6), Inches(1.6), Inches(7.6), Inches(3.6)).table
for c, wd in enumerate((2.7, 1.4, 1.7, 1.8)):
    tbl.columns[c].width = Inches(wd)
for r, row in enumerate(rows):
    for c, (val, col) in enumerate(row):
        cell = tbl.cell(r, c)
        cell.fill.solid()
        cell.fill.fore_color.rgb = PANEL if r else BG
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = cell.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.LEFT if c == 0 else PP_ALIGN.CENTER
        run = p.add_run()
        run.text = val
        run.font.name = FONT
        run.font.size = Pt(20)
        run.font.bold = (r == 0 or c == 1)
        run.font.color.rgb = col
text(s, 0.6, 5.4, 7.6, 0.5, "General guidance, not a benchmark.", size=14, color=MUTED)
label(s, 8.6, 1.6, 4.15, 3.6,
      "Limits\nAnswer = only as good as the search\nBad chunks, bad answers\nTop results can have noise\nControl who sees what",
      size=24, color=AMBER, line=AMBER)

# ---------------------------------------------------------------- 7. Close
s = new_slide(NOTES["close"])
title(s, "Remember")
points = [("Retrieve  →  Augment  →  Generate", "the model does not change"),
          ("Only as good as the search", "chunking and retrieval matter most"),
          ("Start small", "a few docs and a local model")]
for i, (a, b) in enumerate(points):
    label(s, 0.8, 1.6 + i * 1.45, 11.7, 1.25, f"{a}\n{b}", size=30, color=TEAL if i == 0 else TEXT,
          line=TEAL if i == 0 else None)
text(s, 0.8, 6.15, 11.8, 0.6, "github.com/mateuzor/my_pocs  ·  poc-rag  ·  Questions?", size=24, color=TEAL, bold=True)

import os
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rag-intro.pptx")
prs.save(out)
print("saved", out)
