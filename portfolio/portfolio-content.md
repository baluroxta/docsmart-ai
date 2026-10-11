# DocSmart AI — Enterprise Document Intelligence & Workflow Automation

**Tagline:** Turn documents into decisions.  
**Author:** Kandala Guru Balaji  
**Target Profile:** Enterprise AI Solutions Engineering, Applied AI & Full-Stack Systems  
**License:** MIT License

---

## Project Title
**DocSmart AI — Enterprise Document Intelligence & Workflow Automation**

## One-Line Description
A production-grade document intelligence platform that extracts structured data, runs deterministic mathematical & date compliance verification, enables grounded Q&A with verbatim citations, and orchestrates downstream enterprise automation.

## The Business Problem
Enterprise operations spend thousands of billable hours manually re-keying unstructured PDFs (invoices, contracts, resumes, compliance forms) into ERPs and CRMs. Traditional OCR yields unstructured text dumps, while naive LLM chat wrappers suffer from silent arithmetic errors, hallucinated dates, and zero audit trails.

## The Solution
DocSmart AI implements an industrial, fail-closed document processing pipeline:
1. **Idempotent Ingestion:** SHA-256 deduplication and MIME validation.
2. **Hybrid OCR/Text Extraction:** High-speed digital text extraction via `pdfplumber` with Tesseract OCR fallback.
3. **Structured Pydantic Extraction:** Strict classification into Invoices, Contracts, Resumes, and Forms, extracting strongly-typed Pydantic schemas.
4. **Deterministic Verification Engine:** Code-level mathematical invariant validation (`|Subtotal + Tax - Total| <= $0.05`, $\sum \text{Line Items} == \text{Subtotal}$), chronological date validation (`Issue Date <= Due Date`), and entity conflict checks.
5. **Grounded Document Q&A:** Citation attribution quoting exact verbatim excerpts and section line references with honest fallback.
6. **Enterprise Web Workspace:** Modern React 18 + TypeScript glassmorphism UI with real-time analytics, instant sample seeder, and CSV export.
7. **Downstream Automation:** HMAC-SHA256 signed outbound webhooks triggering n8n, ERPs, and accounting workflows.

## Key Capabilities & Features
- **Deterministic Math & Rule Auditing:** Zero tolerance for math discrepancies. Flags `ARITHMETIC_INCONSISTENCY` and date inversions with granular human-readable exceptions.
- **Grounded Q&A with Line-Anchored Citations:** Verbatim source citations ensure auditors can verify every answer in seconds.
- **Fail-Closed State Machine:** If confidence is below threshold or validation fails, documents transition to `NEEDS_REVIEW` rather than silently corrupting downstream ledgers.
- **Zero-Config Dual Database Engine:** Runs locally with SQLite for instantaneous recruiter demos, or connects to PostgreSQL 15 for enterprise clustering.
- **Multi-Provider AI Resilience:** Native multi-provider LLM routing with deterministic offline fallback for air-gapped or zero-API-key demonstrations.
- **RFC-Compliant CSV Export:** One-click tabular exports formatted for financial accounting software.
- **Live Real-Time Analytics:** Extraction volume, average latency, processing success rate, and append-only audit trail.

## Tech Stack
- **Backend:** Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic v2, SQLite / PostgreSQL 15, ReportLab, pdfplumber, Tesseract OCR
- **Frontend:** React 18, TypeScript, Vite, Tailwind-grade Vanilla CSS tokens, Glassmorphism UI
- **Workflow & Security:** HMAC-SHA256 webhook signatures, constant-time API key verification, prompt injection guardrails, n8n orchestration
- **DevOps & QA:** Docker, docker-compose, Pytest (21 tests passing), GitHub Actions CI

## Architecture Flow
```
Upload / Seeder -> SHA-256 Dedupe -> Native pdfplumber / OCR
    -> Type Classifier (Invoice, Contract, Resume, Form)
    -> Structured Schema Extractor (Pydantic Registry)
    -> Deterministic Verification Engine (Math, Dates, Entities)
    -> Persistent Store (SQLite / PostgreSQL)
    -> Grounded Q&A Engine (Line tracking + Verbatim Citations)
    -> HMAC Webhook -> n8n / ERP
    -> React 18 Enterprise UI (Workspace + Analytics + CSV)
```

## Business Impact & Consulting Value
- **85%+ Reduction in Manual Processing Time:** Eliminates manual re-keying while guaranteeing mathematical precision.
- **Audit-Ready Compliance:** Append-only latency and stage logging ensures full regulatory transparency.
- **Decoupled Workflow Orchestration:** Uses webhook abstractions so enterprise clients can modify downstream targets without engineering intervention.

## Repository & Links
- **GitHub Repository:** https://github.com/kandalabalaji/DocSmart-AI
- **License:** MIT License
- **Attribution:** DocSmart AI © 2026 | Developed by Kandala Guru Balaji
