"""FastAPI application entrypoint."""
import logging
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routes import router
from src.config import get_settings
from src.database import Base, engine

settings = get_settings()

logging.basicConfig(level=settings.log_level)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncGenerator[None, None]:
    # Convenience for local dev; production deployments should manage
    # schema migrations explicitly (see scripts/init_db.py / Alembic note in docs).
    if settings.app_env == "development":
        Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="DocSmart AI — Enterprise Document Intelligence & Workflow Automation",
    description="Turn documents into decisions: Ingestion -> OCR -> Classification -> Extraction -> Deterministic Verification -> Grounded Q&A -> n8n Workflow",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Mount static frontend SPA build if present
dist_dir = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if dist_dir.exists():
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=str(dist_dir), html=True), name="frontend")
