# Axiom RAG: Autonomous Multi-Agent Document Intelligence Engine

[![Python 3.10+](https://img.shields.io/badge/python-3.10%2B-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Multi--Agent-orange.svg)](https://langchain-ai.github.io/langgraph/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)

A production-grade, multi-user **Retrieval-Augmented Generation (RAG)** system engineered to ingest complex PDFs, including multi-row tables, synthesize answers with grounded source citations, and **autonomously self-correct** low-quality or hallucinated drafts through an automated critique-and-retry loop.

Built with **LangGraph**, **FastAPI**, **Qdrant Cloud**, **Neon Serverless PostgreSQL**, and a modern **React (Vite)** interface.

---

## Key Highlights

* **Multi-Agent Orchestration**: Specialized LangGraph nodes for query rewriting, dense retrieval, grounded synthesis, and fact-checking.

* **Table-Aware Hierarchical Ingestion**: Row-based table chunking that repeats headers across splits, preventing table fragmentation.

* **Interactive Citation Inspector**: Inspect exact vector matches, similarity scores, page numbers, and parent contexts in real time.

* **Whole-Document Map-Reduce Summarization**: Bypasses nearest-neighbor search to aggregate full-document coverage with adaptive rate-limit backoff.

* **Strict Multi-Tenant Isolation**: Deterministic point IDs and indexed payload filters structurally prevent cross-user data leakage.

* **Production Resilience**: Solved cross-event-loop database collisions, Hugging Face proxy CORS preflight stripping, and constrained-memory OOMs.

---

## Architecture Overview

Axiom RAG executes as a **LangGraph state machine** with conditional routing and safety short-circuits:

```mermaid
flowchart TD

    START(["User Query"]) --> REWRITE["Query Rewrite Agent<br/>Resolves follow-ups and pronouns"]

    REWRITE --> DETECT{"Summary Request?"}

    DETECT -->|Yes| SCROLL["Qdrant scroll API<br/>Fetches all chunks in reading order"]

    SCROLL --> MAPREDUCE["Map-Reduce Summarizer<br/>Batches summarized with adaptive delays<br/>Then reduced into final brief"]

    MAPREDUCE --> DONE(["Save and Stream Result"])

    DETECT -->|No| RESEARCH["Research Agent<br/>Vector similarity search in Qdrant<br/>Strictly scoped by user ID and document"]

    RESEARCH --> SYNTH["Synthesis Agent<br/>Grounded answer with page citations"]

    SYNTH --> CRITIQUE["Critique Agent<br/>Strict JSON schema fact-checker"]

    CRITIQUE --> DECISION{"Passed?"}

    DECISION -->|Yes| DONE

    DECISION -->|No, revisions less than 3| RETRY["Widen top-k 8 to 10<br/>Trigger LangGraph retry loop"]

    RETRY --> RESEARCH

    DECISION -->|No, revisions equal 3| GIVEUP(["Best-Effort Answer<br/>Tagged as Unverified"])

    DECISION -->|API rate limit or 413 error| GIVEUP

    style REWRITE fill:#4f46e5,color:#fff
    style RESEARCH fill:#4f46e5,color:#fff
    style SYNTH fill:#4f46e5,color:#fff
    style CRITIQUE fill:#4f46e5,color:#fff
    style MAPREDUCE fill:#4f46e5,color:#fff
    style DONE fill:#10b981,color:#fff
    style GIVEUP fill:#f59e0b,color:#000
```

---

## Agent Responsibilities

| Agent Node         | Model / Provider                | Primary Responsibility                                                                                                          |
| :----------------- | :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------ |
| **Query Rewrite**  | Groq `llama-3.1-8b-instant`     | Rephrases conversational follow-up questions such as *"what about that one?"* into standalone search queries using prior turns. |
| **Research Node**  | `fastembed` ONNX + Qdrant Cloud | Embeds search queries and executes filtered vector search scoped to `user_id` and `source_file`.                                |
| **Synthesis Node** | `openai/gpt-oss-120b` (Groq)    | Synthesizes comprehensive answers using strictly the retrieved context. Includes page citations such as `(page 3)`.             |
| **Critique Node**  | `openai/gpt-oss-120b` (Groq)    | Uses strict JSON structured output (`{passed: bool, feedback: str}`) to verify grounding, relevance, and completeness.          |
| **Summarizer**     | `openai/gpt-oss-120b` (Groq)    | Executes map-reduce over approximately 4,500-word batches with exponential backoff for full-document synthesis.                 |

---

## Engineering Deep Dive: Hard Problems Solved

### 1. Multi-Tenant Vector Isolation & Deterministic Upserts

* **Problem**: In multi-user RAG, user A querying the vector store could accidentally retrieve chunks from user B, and two users uploading `report.pdf` could overwrite each other if point IDs were based on filename alone.

* **Solution**: Point IDs are generated deterministically as `md5(user_id + ":" + chunk_id)`. Both `source_file` and `user_id` are indexed payload fields in Qdrant. Retrieval enforces an `AND` filter on `user_id`, guaranteeing structural data isolation.

### 2. Table-Aware Ingestion with Header Propagation

* **Problem**: Conventional character splitters slice tables arbitrarily, cutting rows in half and separating cell data from column headers.

* **Solution**: PyMuPDF extracts tables via `find_tables()`. The table chunker splits purely on row boundaries, up to 15 rows, and **repeats the column header row on every child chunk**, keeping table slices semantically valid when embedded.

### 3. Cross-Event-Loop Connection Safety

* **Problem**: In FastAPI, sync route wrappers calling `asyncio.run()` with standard SQLAlchemy connection pools caused `asyncpg` to crash with `Task attached to a different loop` across keep-alive requests.

* **Solution**: Switched the database engine to `NullPool` and isolated database executions inside a dedicated thread worker pool.

### 4. Memory Footprint Optimization

* **Problem**: Running heavy PyTorch embedding pipelines using `sentence-transformers` routinely triggered out-of-memory crashes on resource-constrained containers with a 512 MB RAM ceiling.

* **Solution**: Migrated to `fastembed` with ONNX Runtime, cutting memory usage by over 70% and lazy-loading the model on first request rather than blocking container startup.

---

## Tech Stack

* **Orchestration**: LangGraph, LangChain Text Splitters
* **LLM Runtime**: Groq API (`gpt-oss-120b`, `llama-3.1-8b-instant`)
* **Embedding Engine**: FastEmbed (`BAAI/bge-small-en-v1.5`) ONNX
* **Vector Database**: Qdrant Cloud (Cosine metric, indexed payload filtering)
* **Relational Store**: Neon Serverless PostgreSQL, SQLAlchemy 2.0 (async + `NullPool`)
* **Backend API**: FastAPI, Pydantic v2, Server-Sent Events (SSE)
* **Frontend Client**: React 19, Vite, React Markdown, Remark GFM
* **Evaluation**: RAGAS (Faithfulness, Answer Relevancy, Context Precision, Context Recall)

---

## Evaluation Results

Axiom RAG was evaluated against a diverse test suite of single-hop, multi-hop, and negative/out-of-scope questions:

| Metric                | Score     | Interpretation                                      |
| :-------------------- | :-------- | :-------------------------------------------------- |
| **Faithfulness**      | **0.954** | High grounding with minimal unsupported claims.     |
| **Answer Relevancy**  | **0.795** | Concise, direct answers without unnecessary filler. |
| **Context Precision** | **0.724** | High signal-to-noise ratio in retrieved context.    |
| **Context Recall**    | **1.000** | Complete retrieval of required source facts.        |

---

## Running Locally

### 1. Prerequisites

* Python 3.10+
* Node.js 18+
* Accounts for Groq, Qdrant Cloud, and Neon Postgres

### 2. Backend Setup

```bash
cd backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

# Create your .env file
cp .env.example .env

# Configure:
# GROQ_API_KEY=your_groq_key
# QDRANT_URL=your_qdrant_url
# QDRANT_API_KEY=your_qdrant_key
# DATABASE_URL=postgresql+asyncpg://user:pass@ep-xyz.neon.tech/neondb
# JWT_SECRET_KEY=your_random_secret_hex

# Start the server
uvicorn api.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

npm install

# Configure .env
# VITE_API_BASE_URL=http://localhost:8000

npm run dev
```

Open `http://localhost:5173` to enter the Axiom research workspace.
