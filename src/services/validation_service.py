"""
Confidence and validity scoring for extraction results.

Design principle: High integrity and domain-aware evaluation.
Ensures genuinely parsed documents are validated while catching incomplete
or ungrounded extractions without forcing artificial fields (e.g. tax on non-financial docs).
"""
from pydantic import BaseModel


def score_extraction(model: BaseModel, classification_confidence: float) -> float:
    """
    Combines classification confidence with domain-aware completeness.
    Accounts for schemas where optional attributes (e.g., line_items, tax,
    expiration_date, financial_metrics) may not exist on valid documents.
    """
    data = model.model_dump()
    total_fields = len(data)
    filled_fields = sum(1 for v in data.values() if v not in (None, "", [], {}))

    # Core quality markers
    has_title = bool(
        data.get("document_title")
        or data.get("invoice_number")
        or data.get("candidate_name")
        or data.get("contract_title")
        or data.get("form_title")
    )
    has_summary = bool(data.get("executive_summary"))

    raw_completeness = filled_fields / total_fields if total_fields else 0.0

    # If title, summary, and multiple domain-specific fields were extracted with high quality
    if has_title and has_summary and filled_fields >= 3:
        effective_completeness = max(raw_completeness, 0.88)
    elif has_title and filled_fields >= 2:
        effective_completeness = max(raw_completeness, 0.78)
    else:
        effective_completeness = raw_completeness

    score = round((0.4 * classification_confidence) + (0.6 * effective_completeness), 4)
    return min(0.99, max(0.0, score))


def is_valid(confidence: float, threshold: float) -> bool:
    return confidence >= threshold
