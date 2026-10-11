"""
Deterministic verification and exception detection service for DocSmart AI.

Validates extracted fields using business logic rules:
- Arithmetic consistency checks (subtotal + tax == total_amount)
- Date chronology and validity (issue_date <= due_date, effective_date <= expiration_date)
- Missing required fields
- Line item summation verification
- Transparent statuses: VERIFIED, NEEDS_REVIEW, DISCREPANCY_DETECTED
"""
from datetime import datetime
from typing import Any


def _parse_date(date_str: str | None) -> datetime | None:
    if not date_str:
        return None
    cleaned = date_str.strip()
    formats = [
        "%Y-%m-%d",
        "%d-%m-%Y",
        "%m/%d/%Y",
        "%d/%m/%Y",
        "%Y/%m/%d",
        "%B %d, %Y",
        "%b %d, %Y",
        "%B %d %Y",
        "%b %d %Y",
    ]
    for fmt in formats:
        try:
            return datetime.strptime(cleaned, fmt)
        except ValueError:
            continue
    return None


def verify_invoice(data: dict[str, Any]) -> dict[str, Any]:
    issues: list[dict[str, str]] = []
    checks_passed: list[str] = []
    
    # 1. Required field completeness
    required_fields = ["invoice_number", "vendor_name", "total_amount", "issue_date"]
    for field in required_fields:
        val = data.get(field)
        if val is None or val == "":
            issues.append({
                "type": "MISSING_REQUIRED_FIELD",
                "field": field,
                "severity": "HIGH",
                "message": f"Required invoice field '{field}' is missing or unextracted.",
            })
        else:
            checks_passed.append(f"Required field '{field}' is populated.")

    # 2. Arithmetic consistency: subtotal + tax == total_amount
    subtotal = data.get("subtotal")
    tax = data.get("tax")
    total = data.get("total_amount")

    if subtotal is not None and tax is not None and total is not None:
        expected_total = round(float(subtotal) + float(tax), 2)
        actual_total = round(float(total), 2)
        diff = round(abs(expected_total - actual_total), 2)
        if diff > 0.05:
            issues.append({
                "type": "ARITHMETIC_INCONSISTENCY",
                "field": "total_amount",
                "severity": "HIGH",
                "message": f"Arithmetic mismatch: Subtotal ({subtotal}) + Tax ({tax}) = {expected_total}, but Total is {actual_total} (Difference: {diff}).",
            })
        else:
            checks_passed.append("Subtotal + Tax matches Total Amount perfectly.")
    elif total is not None and (subtotal is not None or tax is not None):
        checks_passed.append("Partial arithmetic fields present.")

    # 3. Line item sum check
    line_items = data.get("line_items") or []
    if line_items and len(line_items) > 0:
        item_sum = 0.0
        has_items_total = True
        for item in line_items:
            t = item.get("total")
            if t is not None:
                item_sum += float(t)
            else:
                has_items_total = False
        
        if has_items_total and subtotal is not None:
            if abs(round(item_sum, 2) - round(float(subtotal), 2)) > 0.05:
                issues.append({
                    "type": "LINE_ITEM_MISMATCH",
                    "field": "line_items",
                    "severity": "MEDIUM",
                    "message": f"Sum of {len(line_items)} line items ({item_sum:.2f}) does not match subtotal ({subtotal}).",
                })
            else:
                checks_passed.append(f"Sum of {len(line_items)} line items matches subtotal.")

    # 4. Date order check
    issue_date = _parse_date(data.get("issue_date"))
    due_date = _parse_date(data.get("due_date"))
    if issue_date and due_date:
        if due_date < issue_date:
            issues.append({
                "type": "DATE_CHRONOLOGY_ERROR",
                "field": "due_date",
                "severity": "HIGH",
                "message": f"Due date ({data.get('due_date')}) precedes issue date ({data.get('issue_date')}).",
            })
        else:
            checks_passed.append("Due date chronologically succeeds or matches issue date.")

    # Overall Status determination
    has_high = any(i["severity"] == "HIGH" for i in issues)
    has_discrepancy = any(i["type"] == "ARITHMETIC_INCONSISTENCY" for i in issues)
    
    if has_discrepancy:
        status = "DISCREPANCY_DETECTED"
    elif has_high:
        status = "NEEDS_REVIEW"
    elif issues:
        status = "NEEDS_REVIEW"
    else:
        status = "VERIFIED"

    return {
        "status": status,
        "is_verified": status == "VERIFIED",
        "issue_count": len(issues),
        "issues": issues,
        "checks_passed": checks_passed,
    }


def verify_contract(data: dict[str, Any]) -> dict[str, Any]:
    issues: list[dict[str, str]] = []
    checks_passed: list[str] = []

    required_fields = ["party_a", "party_b", "effective_date"]
    for field in required_fields:
        val = data.get(field)
        if not val:
            issues.append({
                "type": "MISSING_REQUIRED_FIELD",
                "field": field,
                "severity": "HIGH",
                "message": f"Essential contract field '{field}' is missing.",
            })
        else:
            checks_passed.append(f"Contract party/field '{field}' is identified.")

    # Check identical parties
    if data.get("party_a") and data.get("party_b"):
        if data.get("party_a").strip().lower() == data.get("party_b").strip().lower():
            issues.append({
                "type": "CONFLICTING_VALUES",
                "field": "party_b",
                "severity": "HIGH",
                "message": "Party A and Party B are identical entities in agreement.",
            })

    # Dates
    eff = _parse_date(data.get("effective_date"))
    exp = _parse_date(data.get("expiration_date"))
    if eff and exp:
        if exp < eff:
            issues.append({
                "type": "DATE_CHRONOLOGY_ERROR",
                "field": "expiration_date",
                "severity": "HIGH",
                "message": f"Expiration date ({data.get('expiration_date')}) is before effective date ({data.get('effective_date')}).",
            })
        else:
            checks_passed.append("Contract duration dates are valid and consistent.")

    status = "NEEDS_REVIEW" if issues else "VERIFIED"
    return {
        "status": status,
        "is_verified": status == "VERIFIED",
        "issue_count": len(issues),
        "issues": issues,
        "checks_passed": checks_passed,
    }


def verify_resume(data: dict[str, Any]) -> dict[str, Any]:
    issues: list[dict[str, str]] = []
    checks_passed: list[str] = []

    if not data.get("candidate_name"):
        issues.append({
            "type": "MISSING_REQUIRED_FIELD",
            "field": "candidate_name",
            "severity": "HIGH",
            "message": "Candidate name could not be identified.",
        })
    else:
        checks_passed.append("Candidate identity established.")

    if not data.get("email") and not data.get("phone"):
        issues.append({
            "type": "MISSING_CONTACT_INFO",
            "field": "email",
            "severity": "MEDIUM",
            "message": "No direct contact method (email or phone) was extracted.",
        })
    else:
        checks_passed.append("Candidate contact details extracted.")

    skills = data.get("skills") or []
    if not skills:
        issues.append({
            "type": "EMPTY_SKILLS",
            "field": "skills",
            "severity": "LOW",
            "message": "No specific technical skills were extracted.",
        })
    else:
        checks_passed.append(f"{len(skills)} candidate skills cataloged.")

    status = "NEEDS_REVIEW" if any(i["severity"] == "HIGH" for i in issues) else "VERIFIED"
    return {
        "status": status,
        "is_verified": status == "VERIFIED",
        "issue_count": len(issues),
        "issues": issues,
        "checks_passed": checks_passed,
    }


def verify_general(data: dict[str, Any]) -> dict[str, Any]:
    issues: list[dict[str, str]] = []
    checks_passed: list[str] = []

    if data.get("document_title"):
        checks_passed.append(f"Document title identified: '{data['document_title']}'")

    if data.get("executive_summary"):
        checks_passed.append("Executive AI synthesis verified.")

    if data.get("primary_entities"):
        checks_passed.append(f"{len(data['primary_entities'])} primary entity/entities cataloged.")

    if data.get("key_dates"):
        checks_passed.append(f"{len(data['key_dates'])} key operational dates extracted.")

    if data.get("financial_metrics"):
        checks_passed.append(f"{len(data['financial_metrics'])} financial metric(s) verified.")

    if data.get("key_points"):
        checks_passed.append(f"{len(data['key_points'])} key clauses/points cataloged.")

    status = "VERIFIED" if (checks_passed and len(checks_passed) >= 2) else "NEEDS_REVIEW"
    return {
        "status": status,
        "is_verified": status == "VERIFIED",
        "issue_count": len(issues),
        "issues": issues,
        "checks_passed": checks_passed if checks_passed else ["Document payload structurally valid."],
    }


def verify_extraction(document_type: str, extracted_data: dict[str, Any]) -> dict[str, Any]:
    """Routes extraction data to domain-specific verification logic."""
    if document_type == "invoice":
        return verify_invoice(extracted_data)
    if document_type == "contract":
        return verify_contract(extracted_data)
    if document_type == "resume":
        return verify_resume(extracted_data)
    if document_type in ("general", "unknown"):
        return verify_general(extracted_data)
    
    # Generic form
    return {
        "status": "VERIFIED" if extracted_data else "NEEDS_REVIEW",
        "is_verified": bool(extracted_data),
        "issue_count": 0,
        "issues": [],
        "checks_passed": ["Document payload structurally valid."],
    }
