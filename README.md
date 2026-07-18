# RAG-App

An enterprise-grade Retrieval-Augmented Generation (RAG) reference app:
a typed **FastAPI** backend backed by **Elasticsearch** (dense-vector kNN
search), paired with a **React + TypeScript** frontend. Ingest documents
(`.txt`, `.md`, `.pdf` — including tables and images) into a vector index,
then chat over them and get grounded, cited answers.

No Docker required — Elasticsearch runs as a local process you start
yourself.

## Where the code lives

Everything currently lives in [`enterprise-rag-app/`](./enterprise-rag-app):

```
enterprise-rag-app/
  backend/     FastAPI app, RAG pipeline, Elasticsearch vector store
  frontend/    React + Vite + TypeScript chat UI
```

Start with its [README](./enterprise-rag-app/README.md) for the full
architecture, project structure, and API reference.

## How it works, end to end

Two flows, both driven by `enterprise-rag-app/backend/app/rag/pipeline.py`'s
`RagPipeline` class:

**Ingest** — `POST /ingest` reads every `.txt`/`.md`/`.pdf` in
`backend/data/documents/`, turns each into one or more embeddable chunks,
embeds them with OpenAI, and writes them into Elasticsearch:

```
files on disk → load & split → embed (OpenAI) → store (Elasticsearch)
```

**Ask** — `POST /chat/send` embeds the question, retrieves the closest
chunks from Elasticsearch, and asks the LLM to answer using only those
chunks, with citations:

```
question → embed → kNN search (top_k chunks) → LLM answer, grounded + cited
```

## Backend — what's implemented and how

`enterprise-rag-app/backend/`, a FastAPI service in `app/`:

| File | Responsibility |
| --- | --- |
| `main.py` | Declares every HTTP route and wires them to `RagPipeline`. Holds chat sessions in an in-memory `dict` (a teaching simplification — no database). |
| `config.py` | A `pydantic-settings` `Settings` class that reads `backend/.env` — OpenAI keys/models, Elasticsearch connection, chunk size, image-captioning toggles. Everything else in the app reads from this one object. |
| `schemas.py` | Pydantic request/response models. This *is* the API contract the frontend's TypeScript types mirror. |
| `rag/chunking.py` | Turns files into `ContentUnit`s. `.txt`/`.md` become one text unit. `.pdf` is walked page by page with `pdfplumber`: page text becomes a text unit, `page.extract_tables()` hits are serialized to a Markdown table and kept as **one atomic unit** (never split mid-row), and `pypdf` pulls out embedded images ≥80px as PNG bytes. `chunk_text()` then splits long text into overlapping word windows (default 180 words, 30-word overlap) so nothing sent to the embedding model is too long. |
| `rag/embeddings.py` | Two OpenAI calls: `embed_texts()` batches strings through the embeddings endpoint (`text-embedding-3-small` by default), and `caption_image()` sends an extracted image to a vision-capable chat model asking for a 1–3 sentence factual description — replying `DECORATIVE` (and being skipped) if it's just a logo/icon/divider. |
| `rag/vector_store.py` | `ElasticsearchVectorStore` — a thin wrapper around the `elasticsearch` client. `reset_collection()` creates an index with a `dense_vector` field (cosine similarity); `add()` bulk-indexes chunks; `query()` runs a native Elasticsearch `knn` search and returns the top-k hits with their metadata; `list_documents()`/`count_by_content_type()` use aggregations for the sidebar and health check. |
| `rag/pipeline.py` | `RagPipeline` ties the above together. `ingest_documents()` loads units, renders each into (text, content_type, metadata) via `_render_unit()` — text units get word-chunked, table units pass through as-is, image units get captioned (skipped if `CAPTION_IMAGES=false` or the per-document cap is hit) and their PNG is cached to disk under a content-hash id — then embeds every chunk in one batch and writes it to Elasticsearch. `retrieve()` embeds a question and runs the kNN query. `answer()` builds a numbered context block from the retrieved chunks, sends it plus the last 6 turns of history to the chat model with a system prompt that forces citations (`[1]`, `[2]`, …) and "say you don't know" behavior, and returns the answer alongside its sources. |

Routes, all in `main.py`:

| Method & path | What it does |
| --- | --- |
| `GET /health` | Reports index status and chunk/table/image counts. |
| `POST /ingest` | Rebuilds the Elasticsearch index from `data/documents/` end to end. |
| `POST /documents/upload` | Saves an uploaded `.txt`/`.md`/`.pdf` into `data/documents/` (doesn't index it — `/ingest` still needs to run). |
| `GET /documents` | Lists indexed source files and each one's chunk count. |
| `GET /images/{image_id}` | Serves a cached extracted-image PNG by its 16-char hex id (path traversal is closed off by a strict regex on the id before it ever touches the filesystem). |
| `POST /chat/start` | Creates a session id and an empty history entry. |
| `POST /chat/send` | Runs the ask flow above and appends both turns to that session's history. |
| `GET /chat/{session_id}/history` | Replays a session's stored messages. |

## Frontend — what's implemented and how

`enterprise-rag-app/frontend/`, a Vite + React + TypeScript single-page app
styled with Tailwind:

| File | Responsibility |
| --- | --- |
| `src/types.ts` | TypeScript interfaces mirroring the backend's Pydantic schemas (`Source`, `HealthStatus`, `DocumentInfo`, …) — the frontend's half of the API contract. |
| `src/api/client.ts` | Every backend call in one place: a shared `axios` instance (`VITE_API_BASE_URL`, defaults to `http://localhost:8000`) plus one typed function per endpoint (`getHealth`, `runIngest`, `getDocuments`, `uploadDocument`, `startChatSession`, `sendChatMessage`, `imageUrl`). No component talks to `axios` directly. |
| `src/App.tsx` | Top-level state: polls `/health` and `/documents` on load via a shared `refresh()`, drives the "Sync documents" button (`runIngest()` then `refresh()`), and lays out `Header` / `Sidebar` / `ChatWindow`. |
| `src/hooks/useChat.ts` | A custom hook owning the chat session: starts a session on mount (`POST /chat/start`), and `sendMessage()` optimistically appends the user's message plus a "pending" assistant bubble, calls `POST /chat/send`, then fills the pending bubble in with the real answer and sources (or removes it and surfaces an error on failure). |
| `src/components/Header.tsx` | Shows a status badge (`Ready` / `No documents yet` / `Can't connect`, derived from the health response) and the "Sync documents" button that triggers ingestion. |
| `src/components/Sidebar.tsx` | Drag-and-drop / click-to-browse upload widget (`uploadDocument()`) and the list of currently indexed documents with per-file chunk counts. |
| `src/components/ChatWindow.tsx` | Scrollable message list (auto-scrolls to bottom on new messages) rendered via `useChat()`, an empty-state with clickable example questions, and the input bar. |
| `src/components/ChatInput.tsx` | Auto-growing textarea; Enter sends, Shift+Enter inserts a newline. |
| `src/components/MessageBubble.tsx` | Renders one turn: user messages are plain bubbles; assistant messages render the answer as Markdown (`react-markdown` + `remark-gfm`, so lists/tables/code in answers render properly), show a typing-dots animation while `pending`, a copy-to-clipboard button, and the `SourcesPanel` underneath. |
| `src/components/SourcesPanel.tsx` | Collapsible citation list. Each source shows its rank badge, filename, a `Table`/`Image` badge and page number when applicable, and a similarity score. Text sources show a clamped snippet; table sources render the Markdown table; image sources show a thumbnail (linked to `GET /images/{image_id}`) next to its caption. |

Data flow on a typical question: `ChatInput` → `useChat.sendMessage()` →
`api/client.sendChatMessage()` → `POST /chat/send` → response's `answer` +
`sources` land back in `useChat`'s state → `MessageBubble` re-renders with
the Markdown answer and `SourcesPanel` renders the citations underneath it.

## Getting started

Full setup instructions (Elasticsearch install, backend, frontend) live in
[`enterprise-rag-app/README.md`](./enterprise-rag-app/README.md#quick-start-windows).
Short version:

1. Install and start Elasticsearch — see
   [`enterprise-rag-app/backend/README_ELASTICSEARCH.md`](./enterprise-rag-app/backend/README_ELASTICSEARCH.md)
2. Set up and run the backend and frontend:

```powershell
cd enterprise-rag-app\backend
.\setup.ps1
.\run.ps1

# in a second terminal
cd enterprise-rag-app\frontend
.\setup.ps1
.\run.ps1
```

Then open http://localhost:5173, click **Sync documents**, and start
asking questions.
