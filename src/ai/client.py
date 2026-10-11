"""
Thin wrapper around the Anthropic client.

Keeping this isolated means:
- Only this module needs credentials/config for the LLM provider.
- Swapping providers (e.g. to OpenAI) means implementing this same
  interface elsewhere, not touching classifier/extractor logic.
- Retry/backoff policy lives in one place.
"""
import json
import logging

from anthropic import Anthropic
from tenacity import retry, stop_after_attempt, wait_exponential

from src.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_client: Anthropic | None = None


def get_client() -> Anthropic:
    global _client
    if _client is None:
        _client = Anthropic(api_key=settings.anthropic_api_key)
    return _client


class LLMCallError(Exception):
    pass


def _call_anthropic(system_prompt: str, user_prompt: str, max_tokens: int) -> dict:
    client = Anthropic(api_key=settings.anthropic_api_key)
    response = client.messages.create(
        model=settings.anthropic_model,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )
    text_blocks = [block.text for block in response.content if block.type == "text"]
    raw_text = "".join(text_blocks).strip()
    cleaned = raw_text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    return json.loads(cleaned)


def _call_openai(system_prompt: str, user_prompt: str, max_tokens: int) -> dict:
    from openai import OpenAI

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.chat.completions.create(
        model=settings.openai_model,
        max_tokens=max_tokens,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    raw_text = response.choices[0].message.content or "{}"
    return json.loads(raw_text)


def _call_demo_engine(system_prompt: str, user_prompt: str, doc_type: str | None = None) -> dict:
    from src.ai.intelligent_demo import (
        demo_classify,
        demo_extract_contract,
        demo_extract_form,
        demo_extract_general,
        demo_extract_invoice,
        demo_extract_resume,
    )

    logger.info("Operating in DocSmart AI Offline Deterministic Engine mode (target=%s).", doc_type)
    if doc_type == "classify":
        return demo_classify(user_prompt)
    if doc_type == "invoice":
        return demo_extract_invoice(user_prompt)
    if doc_type == "contract":
        return demo_extract_contract(user_prompt)
    if doc_type == "resume":
        return demo_extract_resume(user_prompt)
    if doc_type == "form":
        return demo_extract_form(user_prompt)
    if doc_type in ("general", "unknown"):
        return demo_extract_general(user_prompt)

    # Fallback to inspecting prompt
    sys_lower = system_prompt.lower()
    if "classify" in sys_lower or "classification" in sys_lower:
        return demo_classify(user_prompt)
    if "general" in sys_lower or "travel" in sys_lower or "booking" in sys_lower:
        return demo_extract_general(user_prompt)
    if "invoice" in sys_lower:
        return demo_extract_invoice(user_prompt)
    if "contract" in sys_lower:
        return demo_extract_contract(user_prompt)
    if "resume" in sys_lower:
        return demo_extract_resume(user_prompt)
    if "form" in sys_lower:
        return demo_extract_form(user_prompt)

    return demo_extract_general(user_prompt)


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=1, max=8), reraise=True)
def call_structured(system_prompt: str, user_prompt: str, max_tokens: int = 1500, doc_type: str | None = None) -> dict:
    """
    Calls LLM with system prompt instructing strict JSON-only output.
    Supports Anthropic Claude, OpenAI, and seamless offline deterministic fallback.
    """
    # 1. Anthropic Claude
    if settings.anthropic_api_key and settings.anthropic_api_key != "changeme":
        try:
            return _call_anthropic(system_prompt, user_prompt, max_tokens)
        except Exception as exc:  # noqa: BLE001
            logger.error("Anthropic LLM call failed: %s", exc)
            raise LLMCallError(str(exc)) from exc

    # 2. OpenAI
    if settings.openai_api_key and settings.openai_api_key != "changeme":
        try:
            return _call_openai(system_prompt, user_prompt, max_tokens)
        except Exception as exc:  # noqa: BLE001
            logger.error("OpenAI call failed: %s", exc)
            raise LLMCallError(str(exc)) from exc

    # 3. Intelligent deterministic fallback mode
    try:
        return _call_demo_engine(system_prompt, user_prompt, doc_type=doc_type)
    except Exception as exc:  # noqa: BLE001
        logger.error("Offline demo engine error: %s", exc)
        raise LLMCallError(f"Deterministic extraction error: {exc}") from exc
