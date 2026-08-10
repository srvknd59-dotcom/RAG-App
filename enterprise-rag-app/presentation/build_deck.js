// Enterprise RAG demo deck generator.
const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const A = (p) => path.join(__dirname, "assets", p);
const ico = (name, color) => A(`${name}_${color}.png`);
const DIAGRAM = path.join(__dirname, "..", "artefacts", "RAG Diagram.png");

// ---- Palette -------------------------------------------------------------
const C = {
  ink: "1A1F36",
  muted: "5B6478",
  navy: "1B2559",
  indigo: "4C5BD4",
  cyan: "0EA5E9",
  green: "16A34A",
  purple: "8B5CF6",
  amber: "F59E0B",
  rose: "E11D48",
  white: "FFFFFF",
  tint: "F5F7FC",
  tint2: "EEF2FB",
  border: "E1E7F5",
  onDark: "FFFFFF",
  onDarkMuted: "C3CBEC",
  onDarkFaint: "8E97C4",
};
const HEAD = "Calibri";
const BODY = "Calibri";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pres.defineLayout({ name: "W", width: 13.33, height: 7.5 });
pres.author = "Northwind Gadgets — Engineering";
pres.title = "Enterprise RAG — Project Demo";

const PW = 13.33, PH = 7.5;

// ---- Helpers -------------------------------------------------------------
function newSlide(dark = false, bg = null) {
  const s = pres.addSlide();
  if (dark) {
    s.background = { path: bg || A("bg_dark.png") };
  } else {
    s.background = { color: C.white };
  }
  return s;
}

function shadow(color = "9AA6C8", opacity = 0.35, blur = 9, offset = 3, angle = 90) {
  return { type: "outer", color, opacity, blur, offset, angle };
}

// Standard light-slide header (eyebrow + title)
function header(s, eyebrow, title, accent = C.indigo) {
  s.addText(eyebrow.toUpperCase(), {
    x: 0.62, y: 0.44, w: 11, h: 0.3, fontFace: HEAD, fontSize: 12.5, bold: true,
    color: accent, charSpacing: 2.5, align: "left",
  });
  s.addText(title, {
    x: 0.6, y: 0.72, w: 12.1, h: 0.72, fontFace: HEAD, fontSize: 29, bold: true,
    color: C.navy, align: "left",
  });
}

function footer(s, n) {
  s.addText("Retrieval-Augmented Generation  ·  Enterprise Reference Application", {
    x: 0.62, y: 7.06, w: 9, h: 0.3, fontFace: BODY, fontSize: 9, color: C.muted, align: "left",
  });
  s.addText(`${n}`, {
    x: 12.4, y: 7.06, w: 0.5, h: 0.3, fontFace: BODY, fontSize: 9, color: C.muted, align: "right",
  });
}

// Icon inside a rounded/round colored chip
function iconChip(s, x, y, d, name, iconColor, fill, opts = {}) {
  const round = opts.round !== false;
  s.addShape(round ? pres.ShapeType.ellipse : pres.ShapeType.roundRect, {
    x, y, w: d, h: d, fill: { color: fill }, line: opts.line || { type: "none" },
    rectRadius: round ? undefined : Math.min(0.14, d * 0.28),
    shadow: opts.shadow || undefined,
  });
  const pad = d * 0.26;
  s.addImage({ path: ico(name, iconColor), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad });
}

// A soft content card
function card(s, x, y, w, h, opts = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.1,
    fill: { color: opts.fill || C.tint },
    line: opts.line === null ? { type: "none" } : { color: opts.border || C.border, width: 1 },
    shadow: opts.shadow || undefined,
  });
}

// ==========================================================================
// SLIDE 1 — TITLE
// ==========================================================================
(function () {
  const s = newSlide(true);
  s.addText("ENTERPRISE AI  ·  TECHNICAL PROJECT DEMO", {
    x: 0.9, y: 1.55, w: 11, h: 0.35, fontFace: HEAD, fontSize: 14, bold: true,
    color: C.cyan, charSpacing: 3,
  });
  s.addText(
    [
      { text: "Retrieval-Augmented", options: { color: C.onDark } },
      { text: "\n", options: { breakLine: true } },
      { text: "Generation", options: { color: C.onDark } },
    ],
    { x: 0.86, y: 1.95, w: 11.4, h: 1.9, fontFace: HEAD, fontSize: 52, bold: true, lineSpacingMultiple: 0.98 }
  );
  s.addText(
    "A production-shaped RAG reference application — grounding a large language model in your own private documents for accurate, cited answers.",
    { x: 0.9, y: 3.95, w: 9.6, h: 0.9, fontFace: BODY, fontSize: 18, color: C.onDarkMuted, lineSpacingMultiple: 1.1 }
  );

  // Stack chips
  const chips = [
    ["server", "FastAPI"],
    ["database", "Elasticsearch"],
    ["wandsparkles", "OpenAI"],
    ["code", "React + TypeScript"],
  ];
  let cx = 0.9;
  const cy = 5.15, ch = 0.56;
  chips.forEach(([icn, label]) => {
    const w = 0.5 + 0.14 * label.length + 0.5;
    s.addShape(pres.ShapeType.roundRect, {
      x: cx, y: cy, w, h: ch, rectRadius: 0.28,
      fill: { color: "FFFFFF", transparency: 88 }, line: { color: C.onDarkFaint, width: 1 },
    });
    s.addImage({ path: ico(icn, "cyan"), x: cx + 0.16, y: cy + 0.15, w: 0.26, h: 0.26 });
    s.addText(label, { x: cx + 0.46, y: cy, w: w - 0.5, h: ch, fontFace: BODY, fontSize: 13.5, bold: true, color: C.onDark, valign: "middle" });
    cx += w + 0.2;
  });

  // Meta footer line
  s.addShape(pres.ShapeType.line, { x: 0.9, y: 6.35, w: 11.5, h: 0, line: { color: C.onDarkFaint, width: 0.75, transparency: 40 } });
  s.addText("Northwind Gadgets  ·  Knowledge Assistant", {
    x: 0.9, y: 6.5, w: 7, h: 0.4, fontFace: BODY, fontSize: 13, color: C.onDarkMuted,
  });
  s.addText("Project Demonstration  ·  2026", {
    x: 6.4, y: 6.5, w: 6, h: 0.4, fontFace: BODY, fontSize: 13, color: C.onDarkMuted, align: "right",
  });
})();

// ==========================================================================
// SLIDE 2 — AGENDA
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "What we'll cover", "Agenda");
  const items = [
    ["warning", "rose", "The problem", "Why standalone LLMs fall short for enterprise knowledge"],
    ["brain", "indigo", "What RAG is", "Retrieval + generation, explained end to end"],
    ["sitemap", "cyan", "System architecture", "How the reference application is built"],
    ["boxesstacked", "green", "Ingestion pipeline", "Turning documents into searchable knowledge"],
    ["search", "purple", "Query & grounding", "Retrieval, citations, and hallucination control"],
    ["moneybill", "amber", "Business value & roadmap", "Outcomes, use cases, and the path to production"],
  ];
  const x0 = 0.62, y0 = 1.75, cw = 6.0, chg = 1.62, colGap = 0.6;
  items.forEach(([icn, col, title, desc], i) => {
    const row = i % 3, coln = Math.floor(i / 3);
    const x = x0 + coln * (cw + colGap);
    const y = y0 + row * chg;
    card(s, x, y, cw, 1.42, { fill: C.tint, shadow: shadow() });
    iconChip(s, x + 0.28, y + 0.34, 0.74, icn, "white", C[col]);
    s.addText(`0${i + 1}`, { x: x + cw - 1.05, y: y + 0.16, w: 0.9, h: 0.5, fontFace: HEAD, fontSize: 26, bold: true, color: C.tint2, align: "right" });
    s.addText(title, { x: x + 1.2, y: y + 0.26, w: cw - 1.4, h: 0.4, fontFace: HEAD, fontSize: 17, bold: true, color: C.navy });
    s.addText(desc, { x: x + 1.2, y: y + 0.68, w: cw - 1.4, h: 0.6, fontFace: BODY, fontSize: 12.5, color: C.muted, lineSpacingMultiple: 1.02 });
  });
  footer(s, 2);
})();

// ==========================================================================
// SLIDE 3 — THE PROBLEM
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "The problem", "Why a plain LLM isn't enough", C.rose);
  s.addText("A powerful language model still can't see your documents — so when it's asked about them, it guesses.", {
    x: 0.62, y: 1.5, w: 12.1, h: 0.5, fontFace: BODY, fontSize: 14, color: C.muted,
  });
  const probs = [
    ["warning", "rose", "Hallucination", "Models invent plausible-sounding but false answers when they don't know — with total confidence and no warning."],
    ["lock", "amber", "No private knowledge", "Your handbooks, policies, and product data were never in the training set. The model simply can't see them."],
    ["bookmark", "purple", "No sources", "A bare answer can't be trusted or audited — there's no citation to verify where a claim came from."],
    ["gauge", "indigo", "Stale & costly to retrain", "Retraining a model on every document change is slow and expensive. Knowledge goes out of date fast."],
  ];
  const x0 = 0.62, y0 = 2.15, cw = 6.0, cgx = 0.6, ch = 2.05, cgy = 0.35;
  probs.forEach(([icn, col, t, d], i) => {
    const x = x0 + (i % 2) * (cw + cgx);
    const y = y0 + Math.floor(i / 2) * (ch + cgy);
    card(s, x, y, cw, ch, { fill: C.tint, shadow: shadow() });
    iconChip(s, x + 0.34, y + 0.36, 0.82, icn, "white", C[col]);
    s.addText(t, { x: x + 1.36, y: y + 0.42, w: cw - 1.6, h: 0.45, fontFace: HEAD, fontSize: 19, bold: true, color: C.navy });
    s.addText(d, { x: x + 1.36, y: y + 0.92, w: cw - 1.65, h: 0.95, fontFace: BODY, fontSize: 13, color: C.muted, lineSpacingMultiple: 1.05 });
  });
  footer(s, 3);
})();

// ==========================================================================
// SLIDE 4 — WHAT IS RAG
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "The concept", "What is Retrieval-Augmented Generation?");
  s.addText(
    [
      { text: "RAG connects a language model to a searchable library of ", options: {} },
      { text: "your own documents", options: { bold: true, color: C.indigo } },
      { text: ". Before answering, it ", options: {} },
      { text: "retrieves", options: { bold: true, color: C.cyan } },
      { text: " the passages most relevant to the question, then ", options: {} },
      { text: "generates", options: { bold: true, color: C.purple } },
      { text: " an answer grounded only in what it found — with citations.", options: {} },
    ],
    { x: 0.62, y: 1.55, w: 12.1, h: 0.9, fontFace: BODY, fontSize: 16.5, color: C.ink, lineSpacingMultiple: 1.12 }
  );

  // Two big pillars: Retrieval + Generation
  const py = 2.75, pw = 5.55, ph = 2.55;
  // Retrieval
  card(s, 0.62, py, pw, ph, { fill: C.tint, border: C.border, shadow: shadow() });
  iconChip(s, 0.95, py + 0.32, 0.95, "search", "white", C.cyan);
  s.addText("RETRIEVAL", { x: 2.1, y: py + 0.42, w: 3, h: 0.35, fontFace: HEAD, fontSize: 13, bold: true, color: C.cyan, charSpacing: 2 });
  s.addText("Find the right context", { x: 2.1, y: py + 0.72, w: 3.3, h: 0.4, fontFace: HEAD, fontSize: 18, bold: true, color: C.navy });
  s.addText(
    "The question is turned into a vector and matched against an index of document chunks. The closest passages are pulled back as evidence.",
    { x: 0.98, y: py + 1.42, w: pw - 0.7, h: 1.0, fontFace: BODY, fontSize: 13.5, color: C.muted, lineSpacingMultiple: 1.08 }
  );
  // Plus sign
  s.addShape(pres.ShapeType.ellipse, { x: 6.4, y: py + ph / 2 - 0.33, w: 0.66, h: 0.66, fill: { color: C.navy }, shadow: shadow("1B2559", 0.35, 8, 2) });
  s.addText("+", { x: 6.4, y: py + ph / 2 - 0.42, w: 0.66, h: 0.66, fontFace: HEAD, fontSize: 30, bold: true, color: C.white, align: "center", valign: "middle" });
  // Generation
  card(s, 7.16, py, pw, ph, { fill: C.tint, border: C.border, shadow: shadow() });
  iconChip(s, 7.49, py + 0.32, 0.95, "brain", "white", C.purple);
  s.addText("GENERATION", { x: 8.64, y: py + 0.42, w: 3, h: 0.35, fontFace: HEAD, fontSize: 13, bold: true, color: C.purple, charSpacing: 2 });
  s.addText("Answer, grounded & cited", { x: 8.64, y: py + 0.72, w: 4.0, h: 0.4, fontFace: HEAD, fontSize: 18, bold: true, color: C.navy });
  s.addText(
    "The LLM writes an answer using only the retrieved passages, citing each fact inline — and says \"I don't know\" when the answer isn't there.",
    { x: 7.52, y: py + 1.42, w: pw - 0.7, h: 1.0, fontFace: BODY, fontSize: 13.5, color: C.muted, lineSpacingMultiple: 1.08 }
  );

  // Bottom takeaway strip
  card(s, 0.62, 5.62, 12.09, 1.06, { fill: C.navy, line: null, shadow: shadow() });
  iconChip(s, 0.92, 5.83, 0.66, "shield", "white", C.green, { round: true });
  s.addText(
    [
      { text: "The result:  ", options: { bold: true, color: C.white } },
      { text: "the fluency of an LLM, anchored to facts from ", options: { color: C.onDarkMuted } },
      { text: "your", options: { color: C.cyan, bold: true } },
      { text: " knowledge base — no retraining, always current, fully auditable.", options: { color: C.onDarkMuted } },
    ],
    { x: 1.8, y: 5.62, w: 10.7, h: 1.06, fontFace: BODY, fontSize: 15, valign: "middle", lineSpacingMultiple: 1.05 }
  );
  footer(s, 4);
})();

// ==========================================================================
// SLIDE 5 — HOW RAG WORKS (TWO FLOWS)
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "End to end", "How RAG works — two flows");

  // Flow 1: Ingest (green)
  const drawFlow = (y, label, sub, color, steps) => {
    s.addShape(pres.ShapeType.roundRect, { x: 0.62, y, w: 2.35, h: 1.5, rectRadius: 0.1, fill: { color }, shadow: shadow() });
    s.addText(label, { x: 0.62, y: y + 0.28, w: 2.35, h: 0.45, fontFace: HEAD, fontSize: 18, bold: true, color: C.white, align: "center" });
    s.addText(sub, { x: 0.72, y: y + 0.78, w: 2.15, h: 0.55, fontFace: BODY, fontSize: 11, color: "FFFFFF", align: "center", transparency: 12, lineSpacingMultiple: 1.0 });
    const sx = 3.28, sw = 1.72, gap = 0.28;
    steps.forEach(([icn, t], i) => {
      const x = sx + i * (sw + gap);
      card(s, x, y, sw, 1.5, { fill: C.tint, border: C.border, shadow: shadow("AAB4D4", 0.3, 6, 2) });
      iconChip(s, x + sw / 2 - 0.32, y + 0.2, 0.64, icn, "white", color);
      s.addText(t, { x: x + 0.06, y: y + 0.92, w: sw - 0.12, h: 0.52, fontFace: BODY, fontSize: 11.5, bold: true, color: C.navy, align: "center", valign: "top", lineSpacingMultiple: 0.95 });
      if (i < steps.length - 1) {
        s.addShape(pres.ShapeType.rightArrow, { x: x + sw + 0.02, y: y + 0.62, w: 0.24, h: 0.26, fill: { color: color }, line: { type: "none" } });
      }
    });
  };

  s.addText("① INGEST  —  build the knowledge index (offline)", { x: 0.62, y: 1.55, w: 12, h: 0.3, fontFace: HEAD, fontSize: 13.5, bold: true, color: C.green });
  drawFlow(1.92, "Ingest", "documents → index", C.green, [
    ["file", "Load files"], ["layers", "Split into chunks"], ["circlenodes", "Embed vectors"], ["database", "Store in index"],
  ]);

  s.addText("② ASK  —  answer a question, grounded & cited (online)", { x: 0.62, y: 3.85, w: 12, h: 0.3, fontFace: HEAD, fontSize: 13.5, bold: true, color: C.purple });
  drawFlow(4.22, "Ask", "question → answer", C.purple, [
    ["circlenodes", "Embed question"], ["search", "kNN search"], ["quote", "Build context"], ["brain", "LLM answers"],
  ]);

  // callout at bottom
  s.addText(
    [
      { text: "Both flows are driven by one class — ", options: { color: C.muted } },
      { text: "RagPipeline", options: { color: C.indigo, bold: true, fontFace: "Consolas" } },
      { text: "  (backend/app/rag/pipeline.py)", options: { color: C.muted } },
    ],
    { x: 0.62, y: 6.35, w: 12, h: 0.4, fontFace: BODY, fontSize: 13, align: "center" }
  );
  footer(s, 5);
})();

// ==========================================================================
// SLIDE 6 — SECTION DIVIDER: THE PROJECT
// ==========================================================================
(function () {
  const s = newSlide(true, A("bg_section.png"));
  s.addText("PART TWO", { x: 0.9, y: 2.55, w: 6, h: 0.4, fontFace: HEAD, fontSize: 15, bold: true, color: C.cyan, charSpacing: 3 });
  s.addText("The Reference Application", { x: 0.86, y: 2.95, w: 11.5, h: 1.0, fontFace: HEAD, fontSize: 44, bold: true, color: C.white });
  s.addText("Architecture, pipelines, and the enterprise use case in detail.", {
    x: 0.9, y: 4.0, w: 10, h: 0.5, fontFace: BODY, fontSize: 18, color: C.onDarkMuted,
  });
  // three mini icon chips
  const mini = [["sitemap", "Architecture"], ["boxesstacked", "Ingestion"], ["search", "Retrieval"]];
  let mx = 0.9;
  mini.forEach(([icn, lbl]) => {
    iconChip(s, mx, 4.9, 0.62, icn, "cyan", "FFFFFF", { round: true, line: { type: "none" } });
    // overlay transparency circle
    mx += 0.62 + 0.15;
    s.addText(lbl, { x: mx, y: 4.9, w: 1.9, h: 0.62, fontFace: BODY, fontSize: 13.5, bold: true, color: C.onDark, valign: "middle" });
    mx += 1.9 + 0.35;
  });
})();

// ==========================================================================
// SLIDE 7 — PROJECT USE CASE
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "The use case", "Northwind Gadgets — Knowledge Assistant", C.cyan);
  s.addText("A single chat assistant that answers employee and customer questions from the company's own documents — instantly, and always with a source.", {
    x: 0.62, y: 1.5, w: 12.1, h: 0.55, fontFace: BODY, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.05,
  });

  // Left: the source documents
  s.addText("KNOWLEDGE SOURCES", { x: 0.62, y: 2.2, w: 5, h: 0.3, fontFace: HEAD, fontSize: 12.5, bold: true, color: C.navy, charSpacing: 1.5 });
  const docs = [
    ["file", "green", "Employee Handbook", "Hours, PTO, remote work, expenses, IT support"],
    ["headset", "purple", "Product FAQ", "GlowMug setup, charging, troubleshooting"],
    ["scale", "amber", "Return & Warranty Policy", "Return window, warranty terms, refund process"],
  ];
  let dy = 2.58;
  docs.forEach(([icn, col, t, d]) => {
    card(s, 0.62, dy, 5.75, 1.12, { fill: C.tint, shadow: shadow("AAB4D4", 0.28, 6, 2) });
    iconChip(s, 0.9, dy + 0.24, 0.64, icn, "white", C[col]);
    s.addText(t, { x: 1.72, y: dy + 0.2, w: 4.5, h: 0.38, fontFace: HEAD, fontSize: 15.5, bold: true, color: C.navy });
    s.addText(d, { x: 1.72, y: dy + 0.58, w: 4.55, h: 0.45, fontFace: BODY, fontSize: 12, color: C.muted, lineSpacingMultiple: 1.0 });
    dy += 1.27;
  });

  // Right: example conversation
  s.addText("A GROUNDED ANSWER", { x: 6.75, y: 2.2, w: 5, h: 0.3, fontFace: HEAD, fontSize: 12.5, bold: true, color: C.navy, charSpacing: 1.5 });
  card(s, 6.75, 2.58, 5.96, 3.92, { fill: C.tint2, line: null, shadow: shadow() });
  // question bubble
  s.addShape(pres.ShapeType.roundRect, { x: 8.0, y: 2.85, w: 4.5, h: 0.62, rectRadius: 0.14, fill: { color: C.indigo }, shadow: shadow("4C5BD4", 0.3, 6, 2) });
  s.addText("How many days can I work remotely?", { x: 8.12, y: 2.85, w: 4.26, h: 0.62, fontFace: BODY, fontSize: 12.5, color: C.white, valign: "middle" });
  // answer bubble
  s.addShape(pres.ShapeType.roundRect, { x: 6.97, y: 3.7, w: 5.05, h: 1.5, rectRadius: 0.14, fill: { color: C.white }, line: { color: C.border, width: 1 }, shadow: shadow("AAB4D4", 0.3, 6, 2) });
  s.addText(
    [
      { text: "Employees may work remotely up to ", options: { color: C.ink } },
      { text: "3 days per week", options: { color: C.navy, bold: true } },
      { text: ". More than that requires director approval, reviewed quarterly ", options: { color: C.ink } },
      { text: "[1]", options: { color: C.indigo, bold: true } },
      { text: ".", options: { color: C.ink } },
    ],
    { x: 7.14, y: 3.82, w: 4.7, h: 1.3, fontFace: BODY, fontSize: 12.5, valign: "top", lineSpacingMultiple: 1.06 }
  );
  // source chip
  s.addShape(pres.ShapeType.roundRect, { x: 6.97, y: 5.4, w: 5.05, h: 0.86, rectRadius: 0.1, fill: { color: "FFFFFF" }, line: { color: C.border, width: 1 } });
  s.addShape(pres.ShapeType.roundRect, { x: 7.12, y: 5.54, w: 0.42, h: 0.42, rectRadius: 0.06, fill: { color: C.green } });
  s.addText("1", { x: 7.12, y: 5.54, w: 0.42, h: 0.42, fontFace: HEAD, fontSize: 13, bold: true, color: C.white, align: "center", valign: "middle" });
  s.addText([
    { text: "company_handbook.md", options: { bold: true, color: C.navy } },
    { text: "   ·   similarity 0.91", options: { color: C.muted } },
  ], { x: 7.66, y: 5.5, w: 4.2, h: 0.28, fontFace: BODY, fontSize: 11.5 });
  s.addText("“Employees may work remotely up to 3 days per week…”", { x: 7.66, y: 5.78, w: 4.25, h: 0.4, fontFace: BODY, fontSize: 10.5, italic: true, color: C.muted });

  footer(s, 7);
})();

// ==========================================================================
// SLIDE 8 — SYSTEM ARCHITECTURE (diagram)
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "System architecture", "One pipeline, two lifecycles");
  // Left rail: 3 takeaways
  const rail = [
    ["boxesstacked", "green", "Offline indexing", "Documents are loaded, chunked, embedded and persisted to the vector store."],
    ["search", "purple", "Online retrieval", "Each question is embedded and matched against the index to fetch context."],
    ["shield", "cyan", "Grounded output", "The LLM answers from retrieved context and returns sources with every reply."],
  ];
  let ry = 1.75;
  rail.forEach(([icn, col, t, d]) => {
    iconChip(s, 0.62, ry, 0.6, icn, "white", C[col]);
    s.addText(t, { x: 1.34, y: ry - 0.04, w: 2.9, h: 0.35, fontFace: HEAD, fontSize: 14, bold: true, color: C.navy });
    s.addText(d, { x: 1.34, y: ry + 0.32, w: 2.95, h: 1.0, fontFace: BODY, fontSize: 11.5, color: C.muted, lineSpacingMultiple: 1.03 });
    ry += 1.66;
  });
  // Diagram on the right
  const dw = 8.1, dh = dw * (1024 / 1536); // 5.4
  card(s, 4.45, 1.62, 8.4, dh + 0.34, { fill: C.white, border: C.border, shadow: shadow() });
  s.addImage({ path: DIAGRAM, x: 4.62, y: 1.79, w: dw, h: dh });
  footer(s, 8);
})();

// ==========================================================================
// SLIDE 9 — INGESTION PIPELINE DETAIL
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "Ingestion pipeline", "From files to a searchable index", C.green);
  s.addText("POST /ingest rebuilds the index end to end from backend/data/documents/.", {
    x: 0.62, y: 1.5, w: 12, h: 0.35, fontFace: "Consolas", fontSize: 13, color: C.muted,
  });

  const steps = [
    ["file", "Load", "Read every .txt / .md / .pdf on disk into content units."],
    ["layers", "Split", "Long text → overlapping word windows so nothing exceeds the embed limit."],
    ["circlenodes", "Embed", "Each chunk becomes a 1536-dim vector via text-embedding-3-small."],
    ["database", "Store", "Bulk-index vectors + metadata into an Elasticsearch dense_vector field."],
  ];
  const x0 = 0.62, y0 = 2.15, sw = 2.94, gap = 0.18, sh = 2.3;
  steps.forEach(([icn, t, d], i) => {
    const x = x0 + i * (sw + gap);
    card(s, x, y0, sw, sh, { fill: C.tint, shadow: shadow() });
    s.addShape(pres.ShapeType.ellipse, { x: x + 0.28, y: y0 + 0.28, w: 0.5, h: 0.5, fill: { color: C.green } });
    s.addText(`${i + 1}`, { x: x + 0.28, y: y0 + 0.28, w: 0.5, h: 0.5, fontFace: HEAD, fontSize: 16, bold: true, color: C.white, align: "center", valign: "middle" });
    s.addImage({ path: ico(icn, "green"), x: x + sw - 0.86, y: y0 + 0.3, w: 0.46, h: 0.46 });
    s.addText(t, { x: x + 0.28, y: y0 + 0.92, w: sw - 0.5, h: 0.4, fontFace: HEAD, fontSize: 17, bold: true, color: C.navy });
    s.addText(d, { x: x + 0.28, y: y0 + 1.34, w: sw - 0.5, h: 0.9, fontFace: BODY, fontSize: 12, color: C.muted, lineSpacingMultiple: 1.05 });
    if (i < steps.length - 1) {
      s.addShape(pres.ShapeType.rightArrow, { x: x + sw - 0.02, y: y0 + sh / 2 - 0.11, w: 0.2, h: 0.22, fill: { color: C.green }, line: { type: "none" } });
    }
  });

  // Parameter stat callouts
  const stats = [
    ["180", "words per chunk", C.green],
    ["30", "words overlap", C.cyan],
    ["1,536", "vector dimensions", C.indigo],
    ["cosine", "similarity metric", C.purple],
  ];
  const sx0 = 0.62, sy = 4.85, cwid = 2.94, cg = 0.18;
  stats.forEach(([n, l, col], i) => {
    const x = sx0 + i * (cwid + cg);
    card(s, x, sy, cwid, 1.35, { fill: C.navy, line: null, shadow: shadow() });
    s.addText(n, { x: x + 0.1, y: sy + 0.2, w: cwid - 0.2, h: 0.7, fontFace: HEAD, fontSize: 34, bold: true, color: col, align: "center" });
    s.addText(l.toUpperCase(), { x: x + 0.1, y: sy + 0.92, w: cwid - 0.2, h: 0.3, fontFace: BODY, fontSize: 11, bold: true, color: C.onDarkMuted, align: "center", charSpacing: 1 });
  });
  footer(s, 9);
})();

// ==========================================================================
// SLIDE 10 — MULTIMODAL INGESTION
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "Beyond plain text", "Multimodal ingestion — text, tables & images");
  s.addText("PDFs rarely hold only prose. The pipeline preserves three kinds of evidence, each treated as an equally valid source at answer time.", {
    x: 0.62, y: 1.5, w: 12.1, h: 0.55, fontFace: BODY, fontSize: 15, color: C.muted, lineSpacingMultiple: 1.05,
  });
  const modes = [
    ["file", "green", "Text", "Page text is split into overlapping word windows.", "One or more chunks per section — clean, embeddable prose."],
    ["table", "cyan", "Tables", "extract_tables() serializes each table to Markdown.", "Kept as one atomic chunk — a table is never split mid-row."],
    ["image", "purple", "Images", "Embedded images ≥80px are pulled out as PNG.", "A vision model writes a caption; decorative logos are skipped."],
  ];
  const x0 = 0.62, y0 = 2.25, cw = 3.94, gap = 0.14, ch = 3.55;
  modes.forEach(([icn, col, t, d1, d2], i) => {
    const x = x0 + i * (cw + gap);
    card(s, x, y0, cw, ch, { fill: C.tint, shadow: shadow() });
    // top color band via icon chip only (no stripe)
    iconChip(s, x + 0.36, y0 + 0.36, 0.92, icn, "white", C[col], { shadow: shadow(C[col], 0.3, 7, 2) });
    s.addText(t, { x: x + 1.44, y: y0 + 0.55, w: cw - 1.6, h: 0.55, fontFace: HEAD, fontSize: 22, bold: true, color: C.navy });
    s.addShape(pres.ShapeType.line, { x: x + 0.36, y: y0 + 1.6, w: cw - 0.72, h: 0, line: { color: C.border, width: 1 } });
    s.addText(d1, { x: x + 0.36, y: y0 + 1.78, w: cw - 0.7, h: 0.85, fontFace: BODY, fontSize: 13, color: C.ink, lineSpacingMultiple: 1.08 });
    s.addText(d2, { x: x + 0.36, y: y0 + 2.62, w: cw - 0.7, h: 0.85, fontFace: BODY, fontSize: 12.5, color: C.muted, italic: true, lineSpacingMultiple: 1.08 });
  });
  // bottom note
  s.addText(
    [
      { text: "Every chunk carries metadata — ", options: { color: C.muted } },
      { text: "source, page, content_type", options: { color: C.indigo, bold: true, fontFace: "Consolas" } },
      { text: " — so answers can cite the exact file, page and evidence type.", options: { color: C.muted } },
    ],
    { x: 0.62, y: 6.05, w: 12.1, h: 0.5, fontFace: BODY, fontSize: 13.5, align: "center", valign: "middle" }
  );
  footer(s, 10);
})();

// ==========================================================================
// SLIDE 11 — QUERY & RETRIEVAL PIPELINE
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "Query pipeline", "Answering a question, step by step", C.purple);

  const steps = [
    ["chat", "Question", "User asks in natural language via the chat UI."],
    ["circlenodes", "Embed", "The question is embedded with the same model as the documents."],
    ["search", "kNN search", "Elasticsearch returns the top_k = 4 closest chunks."],
    ["quote", "Build context", "Chunks become a numbered [1]…[4] context block."],
    ["brain", "Generate", "The LLM answers from context + last 6 turns of history."],
    ["shield", "Respond", "Answer + ranked sources returned to the UI."],
  ];
  const x0 = 0.62, y0 = 1.8, cw = 3.9, gap = 0.19, ch = 1.75;
  steps.forEach(([icn, t, d], i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = x0 + col * (cw + gap);
    const y = y0 + row * (ch + 0.32);
    card(s, x, y, cw, ch, { fill: C.tint, shadow: shadow() });
    iconChip(s, x + 0.28, y + 0.3, 0.7, icn, "white", C.purple);
    s.addText(`STEP ${i + 1}`, { x: x + 1.12, y: y + 0.26, w: 2.6, h: 0.28, fontFace: HEAD, fontSize: 10.5, bold: true, color: C.purple, charSpacing: 1.5 });
    s.addText(t, { x: x + 1.12, y: y + 0.5, w: cw - 1.3, h: 0.4, fontFace: HEAD, fontSize: 16.5, bold: true, color: C.navy });
    s.addText(d, { x: x + 0.28, y: y + 1.06, w: cw - 0.5, h: 0.6, fontFace: BODY, fontSize: 12, color: C.muted, lineSpacingMultiple: 1.03 });
    // connector arrows within a row
    if (col < 2) {
      s.addShape(pres.ShapeType.rightArrow, { x: x + cw - 0.01, y: y + ch / 2 - 0.1, w: 0.2, h: 0.2, fill: { color: C.purple }, line: { type: "none" } });
    }
  });

  footer(s, 11);
})();

// ==========================================================================
// SLIDE 12 — GROUNDING & CITATIONS
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "Trust by design", "Grounded answers, not guesses", C.green);

  // Left: the rules (system prompt)
  s.addText("THE GROUNDING CONTRACT", { x: 0.62, y: 1.6, w: 6, h: 0.3, fontFace: HEAD, fontSize: 12.5, bold: true, color: C.navy, charSpacing: 1.5 });
  const rules = [
    ["check", "Answer only from retrieved context", "The model is instructed to use nothing but the numbered passages."],
    ["quote", "Cite every fact inline", "Each claim carries its passage number — [1], [2] — traceable to a source."],
    ["shield", "Say “I don't know”", "If the answer isn't in the context, the model refuses to invent one."],
    ["gauge", "Low temperature (0.2)", "Deterministic, faithful phrasing over creative embellishment."],
  ];
  let ry = 2.05;
  rules.forEach(([icn, t, d]) => {
    iconChip(s, 0.62, ry, 0.58, icn, "white", C.green);
    s.addText(t, { x: 1.32, y: ry - 0.02, w: 5.2, h: 0.35, fontFace: HEAD, fontSize: 14.5, bold: true, color: C.navy });
    s.addText(d, { x: 1.32, y: ry + 0.34, w: 5.25, h: 0.6, fontFace: BODY, fontSize: 12, color: C.muted, lineSpacingMultiple: 1.03 });
    ry += 1.12;
  });

  // Right: system prompt code card
  card(s, 7.0, 1.95, 5.72, 4.55, { fill: "0F1533", line: null, shadow: shadow() });
  s.addText("SYSTEM PROMPT  (excerpt)", { x: 7.3, y: 2.15, w: 5, h: 0.3, fontFace: HEAD, fontSize: 11, bold: true, color: C.cyan, charSpacing: 1.5 });
  const code = [
    { text: "You answer using ONLY the numbered\ncontext passages below.\n\n", options: { color: "C7CEEA" } },
    { text: "Rules:\n", options: { color: "8E97C4" } },
    { text: "• ", options: { color: C.green } },
    { text: "If the answer isn't in the context,\n  say you don't know — never make\n  something up.\n", options: { color: "E4E9F8" } },
    { text: "• ", options: { color: C.green } },
    { text: "Cite every fact inline using its\n  passage number, e.g. ", options: { color: "E4E9F8" } },
    { text: "[1]", options: { color: C.cyan, bold: true } },
    { text: ".\n", options: { color: "E4E9F8" } },
    { text: "• ", options: { color: C.green } },
    { text: "Reproduce relevant table rows as\n  Markdown when useful.\n", options: { color: "E4E9F8" } },
    { text: "• ", options: { color: C.green } },
    { text: "Keep answers concise.", options: { color: "E4E9F8" } },
  ];
  s.addText(code, { x: 7.3, y: 2.55, w: 5.15, h: 3.85, fontFace: "Consolas", fontSize: 12.5, lineSpacingMultiple: 1.12, valign: "top" });
  footer(s, 12);
})();

// ==========================================================================
// SLIDE 13 — TECHNOLOGY STACK
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "Under the hood", "Technology stack");
  const stack = [
    ["server", "green", "FastAPI", "Backend & API", "Typed Python service. Pydantic schemas are the contract; every route wires to RagPipeline."],
    ["database", "cyan", "Elasticsearch", "Vector store", "Native kNN over a dense_vector field. Bulk indexing, aggregations, cosine similarity."],
    ["wandsparkles", "purple", "OpenAI", "Embeddings & LLM", "text-embedding-3-small for vectors; gpt-4o-mini for answers and image captioning."],
    ["code", "indigo", "React + TypeScript", "Frontend", "Vite SPA, Tailwind UI. A typed client mirrors the backend; chat renders answers with cited sources."],
  ];
  const x0 = 0.62, y0 = 1.75, cw = 2.94, gap = 0.18, ch = 4.15;
  stack.forEach(([icn, col, t, sub, d], i) => {
    const x = x0 + i * (cw + gap);
    card(s, x, y0, cw, ch, { fill: C.tint, shadow: shadow() });
    iconChip(s, x + cw / 2 - 0.5, y0 + 0.4, 1.0, icn, "white", C[col], { shadow: shadow(C[col], 0.3, 8, 2) });
    s.addText(t, { x: x + 0.15, y: y0 + 1.55, w: cw - 0.3, h: 0.45, fontFace: HEAD, fontSize: 17.5, bold: true, color: C.navy, align: "center" });
    s.addText(sub.toUpperCase(), { x: x + 0.15, y: y0 + 2.0, w: cw - 0.3, h: 0.3, fontFace: HEAD, fontSize: 10.5, bold: true, color: C[col], align: "center", charSpacing: 1.5 });
    s.addShape(pres.ShapeType.line, { x: x + 0.5, y: y0 + 2.42, w: cw - 1.0, h: 0, line: { color: C.border, width: 1 } });
    s.addText(d, { x: x + 0.28, y: y0 + 2.58, w: cw - 0.56, h: 1.45, fontFace: BODY, fontSize: 12, color: C.muted, align: "center", lineSpacingMultiple: 1.08 });
  });
  footer(s, 13);
})();

// ==========================================================================
// SLIDE 14 — API SURFACE
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "The interface", "A small, typed API surface");
  const rows = [
    ["POST", "/ingest", "green", "Rebuild the index from data/documents/ end to end."],
    ["POST", "/documents/upload", "green", "Save an uploaded .txt / .md / .pdf to disk."],
    ["GET", "/documents", "cyan", "List indexed files with per-file chunk counts."],
    ["POST", "/chat/start", "purple", "Open a chat session and return its id."],
    ["POST", "/chat/send", "purple", "Ask a question — returns the answer plus ranked sources."],
    ["GET", "/health", "indigo", "Index status and chunk / table / image counts."],
  ];
  const x0 = 0.62, y0 = 1.75, w = 12.09, rh = 0.76, gap = 0.11;
  rows.forEach((r, i) => {
    const [m, ep, col, d] = r;
    const y = y0 + i * (rh + gap);
    card(s, x0, y, w, rh, { fill: C.tint, shadow: shadow("AAB4D4", 0.25, 5, 2) });
    // method badge
    s.addShape(pres.ShapeType.roundRect, { x: x0 + 0.22, y: y + 0.18, w: 0.92, h: 0.4, rectRadius: 0.07, fill: { color: C[col] } });
    s.addText(m, { x: x0 + 0.22, y: y + 0.18, w: 0.92, h: 0.4, fontFace: HEAD, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle" });
    s.addText(ep, { x: x0 + 1.32, y: y, w: 3.4, h: rh, fontFace: "Consolas", fontSize: 15, bold: true, color: C.navy, valign: "middle" });
    s.addText(d, { x: x0 + 4.9, y: y, w: w - 5.1, h: rh, fontFace: BODY, fontSize: 13, color: C.muted, valign: "middle" });
  });
  footer(s, 14);
})();

// ==========================================================================
// SLIDE 15 — BUSINESS VALUE
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "Why it matters", "Business value");
  // Stat row
  const stats = [
    ["24/7", "instant answers", C.green],
    ["100%", "answers carry a source", C.cyan],
    ["0", "model retraining needed", C.purple],
    ["3", "evidence types indexed", C.amber],
  ];
  const sx0 = 0.62, sy = 1.72, cw = 2.94, cg = 0.18;
  stats.forEach(([n, l, col], i) => {
    const x = sx0 + i * (cw + cg);
    card(s, x, sy, cw, 1.5, { fill: C.tint, shadow: shadow() });
    s.addText(n, { x: x + 0.1, y: sy + 0.22, w: cw - 0.2, h: 0.75, fontFace: HEAD, fontSize: 40, bold: true, color: col, align: "center" });
    s.addText(l.toUpperCase(), { x: x + 0.12, y: sy + 1.02, w: cw - 0.24, h: 0.35, fontFace: BODY, fontSize: 10.5, bold: true, color: C.muted, align: "center", charSpacing: 1 });
  });

  // Benefit cards
  const bens = [
    ["headset", "green", "Deflect support load", "Employees and customers self-serve answers from policies, FAQs and handbooks — instantly."],
    ["shield", "cyan", "Trust & auditability", "Every answer is grounded and cited, so claims can be verified against the source document."],
    ["gauge", "purple", "Always current", "Update a document and re-ingest — no retraining, no waiting. Knowledge stays live."],
    ["scale", "amber", "Governed & private", "Answers are confined to your own approved documents — not the open internet."],
  ];
  const bx0 = 0.62, by0 = 3.5, bw = 6.0, bgx = 0.09, bh = 1.55, bgy = 0.28;
  bens.forEach(([icn, col, t, d], i) => {
    const x = bx0 + (i % 2) * (bw + bgx + 0.5);
    const y = by0 + Math.floor(i / 2) * (bh + bgy);
    card(s, x, y, bw, bh, { fill: C.tint, shadow: shadow("AAB4D4", 0.28, 6, 2) });
    iconChip(s, x + 0.3, y + 0.36, 0.78, icn, "white", C[col]);
    s.addText(t, { x: x + 1.28, y: y + 0.28, w: bw - 1.5, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: C.navy });
    s.addText(d, { x: x + 1.28, y: y + 0.72, w: bw - 1.55, h: 0.75, fontFace: BODY, fontSize: 12, color: C.muted, lineSpacingMultiple: 1.04 });
  });
  footer(s, 15);
})();

// ==========================================================================
// SLIDE 16 — ROADMAP
// ==========================================================================
(function () {
  const s = newSlide();
  header(s, "The path forward", "From reference app to production");
  s.addText("The demo deliberately keeps some things simple. Here's what hardening for production looks like.", {
    x: 0.62, y: 1.5, w: 12, h: 0.4, fontFace: BODY, fontSize: 15, color: C.muted,
  });

  const phases = [
    ["check", "green", "Today — Reference app", ["Dense-vector kNN retrieval", "Multimodal ingest (text/table/image)", "Grounded, cited answers", "Typed API + React UI"]],
    ["gears", "cyan", "Next — Hardening", ["Hybrid search (BM25 + vector)", "Persistent session & chat store", "Auth, roles & access control", "Incremental re-indexing"]],
    ["rocket", "purple", "Later — Scale", ["HyDE & multi-query expansion", "Re-ranking & evaluation harness", "Monitoring, logging & feedback loop", "Multi-tenant knowledge bases"]],
  ];
  const x0 = 0.62, y0 = 2.15, cw = 3.94, gap = 0.14, ch = 4.35;
  phases.forEach(([icn, col, t, items], i) => {
    const x = x0 + i * (cw + gap);
    card(s, x, y0, cw, ch, { fill: i === 0 ? C.tint : C.tint, border: C.border, shadow: shadow() });
    iconChip(s, x + 0.32, y0 + 0.34, 0.8, icn, "white", C[col]);
    s.addText(t, { x: x + 1.24, y: y0 + 0.36, w: cw - 1.4, h: 0.8, fontFace: HEAD, fontSize: 15.5, bold: true, color: C.navy, valign: "middle", lineSpacingMultiple: 0.98 });
    s.addShape(pres.ShapeType.line, { x: x + 0.32, y: y0 + 1.4, w: cw - 0.64, h: 0, line: { color: C.border, width: 1 } });
    const bullets = items.map((it, k) => ({
      text: it, options: { bullet: { code: "2022", indent: 14 }, color: C.ink, breakLine: true, paraSpaceAfter: 8, fontSize: 12.5 },
    }));
    s.addText(bullets, { x: x + 0.4, y: y0 + 1.58, w: cw - 0.72, h: 2.6, fontFace: BODY, color: C.ink, valign: "top" });
  });
  footer(s, 16);
})();

// ==========================================================================
// SLIDE 17 — CLOSING
// ==========================================================================
(function () {
  const s = newSlide(true);
  s.addText("THANK YOU", { x: 0.9, y: 1.9, w: 8, h: 0.4, fontFace: HEAD, fontSize: 15, bold: true, color: C.cyan, charSpacing: 3 });
  s.addText("Answers you can trust,\nfrom knowledge you own.", {
    x: 0.86, y: 2.35, w: 11.5, h: 1.8, fontFace: HEAD, fontSize: 40, bold: true, color: C.white, lineSpacingMultiple: 1.0,
  });
  s.addText("Retrieval-Augmented Generation pairs the fluency of a language model with the authority of your own documents — grounded, cited, and always current.", {
    x: 0.9, y: 4.15, w: 10.2, h: 0.9, fontFace: BODY, fontSize: 17, color: C.onDarkMuted, lineSpacingMultiple: 1.12,
  });

  // recap chips
  const recap = [["brain", "Grounded"], ["quote", "Cited"], ["gauge", "Always current"], ["shield", "Auditable"]];
  let rx = 0.9;
  recap.forEach(([icn, lbl]) => {
    const w = 0.62 + 0.135 * lbl.length + 0.5;
    s.addShape(pres.ShapeType.roundRect, { x: rx, y: 5.35, w, h: 0.6, rectRadius: 0.3, fill: { color: "FFFFFF", transparency: 88 }, line: { color: C.onDarkFaint, width: 1 } });
    s.addImage({ path: ico(icn, "cyan"), x: rx + 0.2, y: 5.51, w: 0.28, h: 0.28 });
    s.addText(lbl, { x: rx + 0.54, y: 5.35, w: w - 0.6, h: 0.6, fontFace: BODY, fontSize: 13.5, bold: true, color: C.white, valign: "middle" });
    rx += w + 0.22;
  });

  s.addShape(pres.ShapeType.line, { x: 0.9, y: 6.4, w: 11.5, h: 0, line: { color: C.onDarkFaint, width: 0.75, transparency: 40 } });
  s.addText("Northwind Gadgets — Knowledge Assistant", { x: 0.9, y: 6.55, w: 7, h: 0.4, fontFace: BODY, fontSize: 13, color: C.onDarkMuted });
  s.addText("srvknd59@gmail.com", { x: 6.4, y: 6.55, w: 6, h: 0.4, fontFace: BODY, fontSize: 13, color: C.onDarkMuted, align: "right" });
})();

// ---- Speaker notes -------------------------------------------------------
const notes = [
  "Title. Introduce the project: a production-shaped RAG reference app that grounds an LLM in Northwind Gadgets' own documents. Stack shown as chips.",
  "Agenda. Six parts: the problem, what RAG is, architecture, ingestion, query & grounding, then value & roadmap.",
  "The problem. Plain LLMs hallucinate, can't see private data, give no sources, and are costly to retrain. RAG addresses all four.",
  "What is RAG. Two moves: retrieve the most relevant passages from your docs, then generate an answer grounded only in them, with citations.",
  "How it works. One RagPipeline class drives both flows: offline ingest (files→index) and online ask (question→grounded answer).",
  "Section divider — the reference application.",
  "Use case. Northwind Gadgets assistant answers from 3 real docs (handbook, FAQ, return policy). Example: a remote-work question answered with a citation.",
  "Architecture. Walk the canonical diagram: offline indexing pipeline on top, online retrieval pipeline below, grounded output.",
  "Ingestion detail. Load → split (180-word chunks, 30 overlap) → embed (1536-dim) → store in Elasticsearch dense_vector with cosine similarity.",
  "Multimodal ingest. Text is word-chunked; tables kept atomic as Markdown; images captioned by a vision model (decorative ones skipped).",
  "Query pipeline. Embed question → kNN top_k=4 → numbered context → LLM answers with last 6 turns of history → returns answer + ranked sources.",
  "Grounding. System prompt forces context-only answers, inline citations, 'I don't know' behavior, and low temperature (0.2).",
  "Stack. FastAPI backend, Elasticsearch vector store, OpenAI embeddings+LLM, React+TypeScript frontend.",
  "API surface. Small typed API — ingest, upload, documents, chat start/send, health.",
  "Business value. 24/7 instant answers, every answer sourced, no retraining, governed to your own private documents.",
  "Roadmap. Today's reference app → hardening (hybrid search, auth, persistence) → scale (HyDE, re-ranking, monitoring, multi-tenant).",
  "Close. Answers you can trust, from knowledge you own. Q&A.",
];
pres.slides.forEach((sl, i) => { if (notes[i]) sl.addNotes(notes[i]); });

const OUT = path.join(__dirname, "RAG-Enterprise-Demo.pptx");
pres.writeFile({ fileName: OUT }).then(() => console.log("Wrote", OUT));
