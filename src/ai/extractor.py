"""Type-specific structured extraction via LLM."""
from pathlib import Path

from pydantic import BaseModel

from src.ai.client import call_structured
from src.schemas import EXTRACTION_SCHEMAS

_PROMPTS_DIR = Path(__file__).resolve().parent.parent.parent / "prompts"

_PROMPT_FILES = {
    "invoice": "invoice_extraction_prompt.txt",
    "contract": "contract_extraction_prompt.txt",
    "resume": "resume_extraction_prompt.txt",
    "form": "form_extraction_prompt.txt",
    "general": "general_extraction_prompt.txt",
    "unknown": "general_extraction_prompt.txt",
}

MAX_TEXT_CHARS = 12000


class UnsupportedDocumentTypeError(Exception):
    pass


def extract_fields(document_type: str, text: str) -> tuple[BaseModel, dict]:
    """
    Runs extraction for the given document type and validates the LLM
    output against the matching Pydantic schema.
    """
    target_type = document_type if document_type in _PROMPT_FILES else "general"
    prompt_path = _PROMPTS_DIR / _PROMPT_FILES[target_type]
    system_prompt = prompt_path.read_text()

    truncated = text[:MAX_TEXT_CHARS]
    raw = call_structured(system_prompt=system_prompt, user_prompt=truncated, max_tokens=2000, doc_type=target_type)

    schema_cls = EXTRACTION_SCHEMAS[target_type]
    validated = schema_cls.model_validate(raw)
    return validated, raw
