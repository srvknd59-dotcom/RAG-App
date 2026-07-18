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

## Learning resources

- [`enterprise-rag-app/ONE_DAY_PLAN.md`](./enterprise-rag-app/ONE_DAY_PLAN.md) —
  a guided, day-by-day walkthrough for understanding, running, and
  extending the app.
- [`enterprise-rag-app/TRAINER_GUIDE.md`](./enterprise-rag-app/TRAINER_GUIDE.md) —
  how to prepare and run a training session for someone else.
