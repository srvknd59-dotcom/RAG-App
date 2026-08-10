# Enterprise RAG — Project Demo Deck

`RAG-Enterprise-Demo.pptx` is a 17-slide, enterprise-grade presentation that
explains Retrieval-Augmented Generation and walks through this repository's
reference application (the **Northwind Gadgets Knowledge Assistant**) in
detail — architecture, ingestion and query pipelines, grounding/citations,
tech stack, API surface, business value, and a production roadmap.

The `.pptx` is self-contained (all images are embedded) — just open it in
PowerPoint, Keynote, or Google Slides. Speaker notes are included on every
slide.

## Slide map

1. Title
2. Agenda
3. The problem — why a plain LLM isn't enough
4. What is RAG?
5. How RAG works — two flows (ingest / ask)
6. Section divider — the reference application
7. Use case — Northwind Gadgets Knowledge Assistant
8. System architecture (diagram)
9. Ingestion pipeline in detail
10. Multimodal ingestion — text, tables & images
11. Query & retrieval pipeline
12. Grounding & citations
13. Technology stack
14. API surface
15. Business value
16. Roadmap — from reference app to production
17. Closing

## Regenerating the deck

The deck is generated with [`pptxgenjs`](https://gitbrent.github.io/PptxGenJS/).
Icons are rendered from `react-icons` and the gradient backgrounds from SVG;
both are written to `assets/` (git-ignored — regenerated on demand).

```bash
cd enterprise-rag-app/presentation
npm install                 # pptxgenjs, react-icons, react, react-dom, sharp
node gen_icons.js           # -> assets/*.png  (icon set, multiple colors)
node gen_backgrounds.js     # -> assets/bg_*.png
node build_deck.js          # -> RAG-Enterprise-Demo.pptx
```

The architecture diagram on slide 8 is sourced from
`../artefacts/RAG Diagram.png`.

## Files

| File | Purpose |
| --- | --- |
| `RAG-Enterprise-Demo.pptx` | The deliverable presentation |
| `build_deck.js` | Deck generator (layout, copy, speaker notes) |
| `gen_icons.js` | Renders the react-icons icon set to PNGs |
| `gen_backgrounds.js` | Renders the dark gradient backgrounds |
| `package.json` | Node dependencies for regeneration |
