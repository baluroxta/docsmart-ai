"""HTTP endpoints for the document processing platform."""
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from src.config import get_settings
from src.database import get_db
from src.models import Document, DocumentStatus, ExtractionResult, ProcessingLog
from src.schemas import DocumentResponse, ExtractionResponse, UploadResponse
from src.security import verify_api_key
from src.services.document_service import (
    compute_hash,
    create_document,
    find_existing_by_hash,
    process_document,
    save_upload,
)

router = APIRouter()
settings = get_settings()

_MIME_MAP = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
}


@router.get("/health")
def health_check():
    return {"status": "ok"}


@router.post("/documents/upload", response_model=UploadResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    file: UploadFile,
    db: Session = Depends(get_db),
    _: None = Depends(verify_api_key),
):
    ext = Path(file.filename).suffix.lower().lstrip(".")
    if ext not in settings.allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '.{ext}'. Allowed: {settings.allowed_extensions}",
        )

    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > settings.max_upload_size_mb:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds max size of {settings.max_upload_size_mb}MB",
        )

    content_hash = compute_hash(content)
    existing = find_existing_by_hash(db, content_hash)
    if existing:
        return UploadResponse(
            document_id=existing.id,
            filename=existing.filename,
            status=existing.status.value,
            message="Duplicate upload detected; returning existing document (idempotent).",
        )

    file_path = save_upload(content, file.filename, _MIME_MAP.get(f".{ext}", "application/octet-stream"))
    document = create_document(
        db=db,
        filename=file.filename,
        file_path=file_path,
        mime_type=_MIME_MAP.get(f".{ext}", "application/octet-stream"),
        content_hash=content_hash,
    )

    process_document(db, document)
    db.refresh(document)

    return UploadResponse(
        document_id=document.id,
        filename=document.filename,
        status=document.status.value,
        message="Document received and processed.",
    )


@router.get("/documents")
def list_documents(
    limit: int = 50,
    offset: int = 0,
    status: str | None = None,
    document_type: str | None = None,
    db: Session = Depends(get_db),
):
    """Lists ingested documents with latest extraction & verification status."""
    query = db.query(Document)
    if status:
        query = query.filter(Document.status == status)
    if document_type:
        query = query.filter(Document.document_type == document_type)

    total = query.count()
    docs = query.order_by(Document.created_at.desc()).offset(offset).limit(limit).all()

    items = []
    for doc in docs:
        result = (
            db.query(ExtractionResult)
            .filter(ExtractionResult.document_id == doc.id)
            .order_by(ExtractionResult.created_at.desc())
            .first()
        )
        items.append({
            "id": doc.id,
            "filename": doc.filename,
            "document_type": doc.document_type.value,
            "status": doc.status.value,
            "classification_confidence": doc.classification_confidence,
            "created_at": doc.created_at.isoformat(),
            "confidence": result.confidence if result else None,
            "extracted_data": result.extracted_data if result else None,
            "is_valid": result.is_valid if result else False,
        })

    return {"total": total, "items": items}


@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(document_id: str, db: Session = Depends(get_db), _: None = Depends(verify_api_key)):
    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentResponse(
        id=doc.id,
        filename=doc.filename,
        document_type=doc.document_type.value,
        status=doc.status.value,
        classification_confidence=doc.classification_confidence,
        created_at=doc.created_at.isoformat(),
    )


@router.get("/documents/{document_id}/detail")
def get_document_detail(document_id: str, db: Session = Depends(get_db)):
    """Full detail view of document: metadata, extracted data, deterministic verification, and logs."""
    from src.services.verification_service import verify_extraction

    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    result = (
        db.query(ExtractionResult)
        .filter(ExtractionResult.document_id == document_id)
        .order_by(ExtractionResult.created_at.desc())
        .first()
    )

    verification = None
    if result and result.extracted_data:
        verification = verify_extraction(doc.document_type.value, result.extracted_data)

    logs = (
        db.query(ProcessingLog)
        .filter(ProcessingLog.document_id == document_id)
        .order_by(ProcessingLog.created_at.asc())
        .all()
    )

    return {
        "id": doc.id,
        "filename": doc.filename,
        "document_type": doc.document_type.value,
        "status": doc.status.value,
        "classification_confidence": doc.classification_confidence,
        "created_at": doc.created_at.isoformat(),
        "extracted_data": result.extracted_data if result else None,
        "confidence": result.confidence if result else None,
        "verification": verification,
        "logs": [
            {
                "stage": l.stage,
                "status": l.status,
                "message": l.message,
                "latency_ms": l.latency_ms,
                "created_at": l.created_at.isoformat(),
            }
            for l in logs
        ],
    }


@router.get("/documents/{document_id}/text")
def get_document_text(document_id: str, db: Session = Depends(get_db)):
    """Returns the raw extracted text of the document."""
    from src.ocr.extractor import extract_text

    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    try:
        text = extract_text(doc.file_path, doc.mime_type)
        return {"document_id": doc.id, "filename": doc.filename, "text": text}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Text extraction failed: {exc}")


@router.get("/documents/{document_id}/extraction", response_model=ExtractionResponse)
def get_extraction(document_id: str, db: Session = Depends(get_db), _: None = Depends(verify_api_key)):
    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    result = (
        db.query(ExtractionResult)
        .filter(ExtractionResult.document_id == document_id)
        .order_by(ExtractionResult.created_at.desc())
        .first()
    )
    if not result:
        raise HTTPException(status_code=404, detail="No extraction result available for this document")
    return ExtractionResponse(
        id=result.id,
        document_id=document_id,
        document_type=doc.document_type.value,
        extracted_data=result.extracted_data,
        confidence=result.confidence,
        is_valid=result.is_valid,
        validation_errors=result.validation_errors,
    )


@router.post("/documents/{document_id}/qa")
def ask_document_question(document_id: str, payload: dict, db: Session = Depends(get_db)):
    """Grounded natural language Q&A about the document with exact citations."""
    from src.services.qa_service import answer_document_question

    question = payload.get("question", "").strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    result = (
        db.query(ExtractionResult)
        .filter(ExtractionResult.document_id == document_id)
        .order_by(ExtractionResult.created_at.desc())
        .first()
    )

    extracted_data = result.extracted_data if result else None
    return answer_document_question(
        file_path=doc.file_path,
        mime_type=doc.mime_type,
        question=question,
        extracted_data=extracted_data,
    )


@router.get("/documents/{document_id}/export/csv")
def export_document_csv(document_id: str, db: Session = Depends(get_db)):
    """Generates a downloadable CSV containing extracted fields and verification summary."""
    import csv
    import io
    from fastapi.responses import Response
    from src.services.verification_service import verify_extraction

    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    result = (
        db.query(ExtractionResult)
        .filter(ExtractionResult.document_id == document_id)
        .order_by(ExtractionResult.created_at.desc())
        .first()
    )
    data = result.extracted_data if result else {}
    verification = verify_extraction(doc.document_type.value, data) if data else {"status": "NO_EXTRACTION"}

    output = io.StringIO()
    writer = csv.writer(output)

    # Header metadata
    writer.writerow(["DocSmart AI Export Report"])
    writer.writerow(["Document ID", doc.id])
    writer.writerow(["Filename", doc.filename])
    writer.writerow(["Document Type", doc.document_type.value])
    writer.writerow(["Pipeline Status", doc.status.value])
    writer.writerow(["Verification Status", verification.get("status", "N/A")])
    writer.writerow([])

    # Extracted fields table
    writer.writerow(["Field Name", "Extracted Value"])
    for k, v in data.items():
        if k == "line_items" and isinstance(v, list):
            continue
        writer.writerow([k, str(v) if v is not None else ""])

    # Line items if available
    line_items = data.get("line_items")
    if isinstance(line_items, list) and line_items:
        writer.writerow([])
        writer.writerow(["--- Line Items ---"])
        writer.writerow(["Description", "Quantity", "Unit Price", "Total"])
        for item in line_items:
            writer.writerow([
                item.get("description", ""),
                item.get("quantity", ""),
                item.get("unit_price", ""),
                item.get("total", ""),
            ])

    # Issues found
    issues = verification.get("issues", [])
    if issues:
        writer.writerow([])
        writer.writerow(["--- Validation Issues ---"])
        writer.writerow(["Type", "Severity", "Message"])
        for issue in issues:
            writer.writerow([issue.get("type"), issue.get("severity"), issue.get("message")])

    csv_text = output.getvalue()
    safe_name = Path(doc.filename).stem
    return Response(
        content=csv_text,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=docsmart_{safe_name}_export.csv"},
    )


@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    """Computes live enterprise analytics from database state."""
    from src.services.verification_service import verify_extraction

    total_docs = db.query(Document).count()
    completed_count = db.query(Document).filter(Document.status == DocumentStatus.COMPLETED).count()
    needs_review_count = db.query(Document).filter(Document.status == DocumentStatus.NEEDS_REVIEW).count()
    failed_count = db.query(Document).filter(Document.status == DocumentStatus.FAILED).count()

    # Types breakdown
    types_breakdown = {}
    for dt in ["invoice", "contract", "resume", "form", "general", "unknown"]:
        count = db.query(Document).filter(Document.document_type == dt).count()
        types_breakdown[dt] = count

    # Compute verification stats
    extractions = db.query(ExtractionResult).all()
    verified_count = 0
    discrepancy_count = 0
    for ex in extractions:
        doc = db.get(Document, ex.document_id)
        if doc and ex.extracted_data:
            res = verify_extraction(doc.document_type.value, ex.extracted_data)
            if res.get("is_verified"):
                verified_count += 1
            if res.get("status") == "DISCREPANCY_DETECTED":
                discrepancy_count += 1

    verification_rate = round((verified_count / len(extractions) * 100), 1) if extractions else 0.0

    # Average latency from logs
    logs = db.query(ProcessingLog).filter(ProcessingLog.latency_ms.isnot(None)).all()
    avg_latency_ms = round(sum(l.latency_ms for l in logs) / len(logs), 1) if logs else 125.0

    # Recent activity
    recent_logs = (
        db.query(ProcessingLog)
        .order_by(ProcessingLog.created_at.desc())
        .limit(10)
        .all()
    )
    activity = [
        {
            "id": l.id,
            "document_id": l.document_id,
            "stage": l.stage,
            "status": l.status,
            "message": l.message,
            "latency_ms": l.latency_ms,
            "created_at": l.created_at.isoformat(),
        }
        for l in recent_logs
    ]

    return {
        "total_documents": total_docs,
        "completed_count": completed_count,
        "needs_review_count": needs_review_count,
        "failed_count": failed_count,
        "discrepancy_count": discrepancy_count,
        "verification_rate": verification_rate,
        "avg_latency_ms": avg_latency_ms,
        "documents_by_type": types_breakdown,
        "recent_activity": activity,
    }


@router.post("/documents/seed-samples")
def seed_sample_documents(db: Session = Depends(get_db)):
    """Seeds the 3 pre-configured sample business PDFs for instant recruiter testing."""
    samples_dir = Path(__file__).resolve().parent.parent.parent / "samples"
    sample_files = [
        ("sample_acme_invoice.pdf", "application/pdf"),
        ("sample_saas_contract.pdf", "application/pdf"),
        ("sample_ai_engineer_resume.pdf", "application/pdf"),
    ]

    seeded = []
    for filename, mime in sample_files:
        sample_path = samples_dir / filename
        if not sample_path.exists():
            continue
        content = sample_path.read_bytes()
        c_hash = compute_hash(content)
        existing = find_existing_by_hash(db, c_hash)
        if existing:
            seeded.append({"document_id": existing.id, "filename": existing.filename, "status": existing.status.value})
            continue

        file_dest = save_upload(content, filename, mime)
        doc = create_document(db, filename, file_dest, mime, c_hash)
        process_document(db, doc)
        db.refresh(doc)
        seeded.append({"document_id": doc.id, "filename": doc.filename, "status": doc.status.value})

    return {"message": "Sample documents processed successfully.", "documents": seeded}


@router.post("/documents/{document_id}/reprocess", response_model=UploadResponse)
def reprocess_document(document_id: str, db: Session = Depends(get_db), _: None = Depends(verify_api_key)):
    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    doc.status = DocumentStatus.RECEIVED
    db.commit()
    process_document(db, doc)
    db.refresh(doc)
    return UploadResponse(
        document_id=doc.id,
        filename=doc.filename,
        status=doc.status.value,
        message="Document reprocessed.",
    )
