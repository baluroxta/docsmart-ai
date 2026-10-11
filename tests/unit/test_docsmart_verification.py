"""Unit tests for DocSmart AI deterministic verification service."""
from src.services.verification_service import verify_contract, verify_invoice, verify_resume


def test_verify_invoice_arithmetic_valid():
    data = {
        "invoice_number": "INV-100",
        "vendor_name": "Acme Corp",
        "issue_date": "2026-01-01",
        "due_date": "2026-01-31",
        "subtotal": 100.0,
        "tax": 10.0,
        "total_amount": 110.0,
        "line_items": [{"description": "Item 1", "quantity": 1, "unit_price": 100.0, "total": 100.0}],
    }
    result = verify_invoice(data)
    assert result["status"] == "VERIFIED"
    assert result["is_verified"] is True
    assert result["issue_count"] == 0


def test_verify_invoice_arithmetic_discrepancy():
    data = {
        "invoice_number": "INV-100",
        "vendor_name": "Acme Corp",
        "issue_date": "2026-01-01",
        "due_date": "2026-01-31",
        "subtotal": 100.0,
        "tax": 10.0,
        "total_amount": 150.0,  # 100 + 10 != 150
    }
    result = verify_invoice(data)
    assert result["status"] == "DISCREPANCY_DETECTED"
    assert any(i["type"] == "ARITHMETIC_INCONSISTENCY" for i in result["issues"])


def test_verify_invoice_date_inversion():
    data = {
        "invoice_number": "INV-100",
        "vendor_name": "Acme Corp",
        "issue_date": "2026-05-15",
        "due_date": "2026-05-01",  # Due date is before issue date!
        "total_amount": 100.0,
    }
    result = verify_invoice(data)
    assert result["status"] == "NEEDS_REVIEW"
    assert any(i["type"] == "DATE_CHRONOLOGY_ERROR" for i in result["issues"])


def test_verify_contract_valid():
    data = {
        "party_a": "Alpha Inc",
        "party_b": "Beta LLC",
        "effective_date": "2026-01-01",
        "expiration_date": "2027-01-01",
    }
    result = verify_contract(data)
    assert result["status"] == "VERIFIED"


def test_verify_contract_identical_parties():
    data = {
        "party_a": "Acme Corp",
        "party_b": "Acme Corp",
        "effective_date": "2026-01-01",
    }
    result = verify_contract(data)
    assert result["status"] == "NEEDS_REVIEW"
    assert any(i["type"] == "CONFLICTING_VALUES" for i in result["issues"])


def test_verify_resume_valid():
    data = {
        "candidate_name": "Jane Doe",
        "email": "jane@example.com",
        "skills": ["Python", "FastAPI"],
    }
    result = verify_resume(data)
    assert result["status"] == "VERIFIED"
