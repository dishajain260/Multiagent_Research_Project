import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from retrieval.embedding_model import get_embedding_model

from api.routes_query import router as query_router
from api.routes_upload import router as upload_router
from api.routes_evaluation import router as evaluation_router
from api.routes_auth import router as auth_router
from api.routes_conversations import router as conversations_router
from db.database import init_db

app = FastAPI(
    title="SynapseDocs AI - Autonomous Multi-Agent Research Platform",
    description="Enterprise-grade autonomous multi-agent Retrieval-Augmented Generation engine by Disha Jain. Ingests complex PDFs with table-aware chunking, performs self-correcting retrieval via LangGraph, and generates cited verified synthesis.",
    version="2.0.0",
)

# CORS: allow local development and cloud-deployed frontends (Vercel, Netlify, Render, etc.)
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

frontend_env = os.getenv("FRONTEND_URL")
if frontend_env:
    origins.append(frontend_env.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*(\.vercel\.app|\.netlify\.app|\.onrender\.com|\.railway\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query_router)
app.include_router(upload_router)
app.include_router(evaluation_router)
app.include_router(auth_router)
app.include_router(conversations_router)


@app.on_event("startup")
async def startup_tasks():
    """Combined startup tasks with timeout protection and lazy loading"""
    import asyncio
    
    print("===== Starting application initialization =====")
    
    # Database initialization with timeout
    try:
        print("1/2: Initializing database connection...")
        await asyncio.wait_for(init_db(), timeout=30.0)
        print("✓ Database ready")
    except asyncio.TimeoutError:
        print("⚠ Database initialization timed out - will retry on first request")
    except Exception as e:
        print(f"⚠ Database initialization failed: {e} - will retry on first request")
    
    # LAZY LOAD embedding model instead of preloading
    # This prevents blocking startup - model loads on first /upload or /query request
    print("2/2: Embedding model will load on first use (lazy loading)")
    print("✓ Application ready to accept requests")
    print("===== Startup complete =====")


@app.get("/")
def root():
    """Root endpoint to verify the API is running"""
    return {
        "status": "running",
        "service": "Axiom RAG - Multi-Agent Research Assistant API",
        "version": "1.0.0",
        "health_check": "/health",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint for monitoring services"""
    return {
        "status": "ok",
        "service": "Axiom RAG Research Assistant",
        "version": "1.0.0"
    }