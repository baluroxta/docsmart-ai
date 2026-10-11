# DocSmart AI — Technical Interview Preparation & Defense Guide
**Candidate:** Kandala Guru Balaji  
**Target:** Enterprise AI Solutions Engineering, Applied AI & Full-Stack Systems

---

## 1. Executive & Architecture Fundamentals

### Q1: What is DocSmart AI and what business problem does it solve?
**Answer:**  
"DocSmart AI is an enterprise document intelligence and workflow automation platform. Enterprises process thousands of invoices, contracts, statements of work, and candidate profiles monthly. Standard OCR solutions dump unstructured text, while naive LLM chat wrappers hallucinate missing facts and fail to detect arithmetic errors. DocSmart AI provides an end-to-end, fail-closed pipeline: idempotent ingestion via SHA-256 deduplication, type classification, structured schema extraction against Pydantic models, deterministic mathematical and date verification, grounded Q&A with verbatim citations, and HMAC-signed webhook dispatch to n8n/ERP systems."

### Q2: Why did you build a single unified pipeline instead of separate microservices per document type?
**Answer:**  
"The fundamental ingestion stages — text extraction, classification, schema extraction, verification, persistence, and webhook dispatch — are identical across document types. Only the classification target and extraction schemas differ. Using a type-keyed schema registry (`EXTRACTION_SCHEMAS`) keeps the orchestration DRY and maintainable. Adding a new enterprise document type (e.g., Purchase Orders or Bills of Lading) requires only adding a Pydantic schema and prompt, without altering the underlying state machine in `document_service.py`."

### Q3: Why did you implement a dual database architecture (SQLite + PostgreSQL)?
**Answer:**  
"In enterprise software evaluation and interview demonstrations, friction is the enemy. Requiring a recruiter or client to provision a running PostgreSQL cluster, create databases, and configure connection strings creates high drop-off. By implementing dual-engine support in `src/database.py`, DocSmart AI runs out of the box with zero configuration using SQLite (`sqlite:///./docsmart.db`), while seamlessly switching to PostgreSQL 15 in production when `DATABASE_URL` is configured."

---

## 2. Deterministic Verification & Validation

### Q4: Why use code-level deterministic verification instead of asking the LLM to verify the math?
**Answer:**  
"LLMs are probabilistic token predictors, not algebraic calculators. Asking an LLM 'Does subtotal + tax equal total?' frequently leads to confirmation bias or hallucinated arithmetic reconciliations. In `src/services/verification_service.py`, we execute deterministic Python math checks:
- We enforce $| \text{Subtotal} + \text{Tax} - \text{Total} | \le \$0.05$ to account for minor rounding.
- We check that $\sum \text{Line Items} == \text{Subtotal}$.
- We verify chronological date sanity: `Issue Date <= Due Date`.
- We verify entity logic (e.g., ensuring contracting parties are distinct).  
If any check fails, the document is tagged with `NEEDS_REVIEW` and specific human-readable exception codes (`ARITHMETIC_INCONSISTENCY`, `DATE_INVERSION`). This guarantees 100% audit accuracy."

### Q5: What does 'fail-closed' mean in DocSmart AI?
**Answer:**  
"Fail-closed means the system assumes an extraction is invalid until proven otherwise. If classification confidence falls below the threshold, or if mathematical invariants are violated, or if critical fields are missing, the system never silently marks the document as `completed`. Instead, it moves the document to a `needs_review` state and halts downstream automation. In financial and legal workflows, an explicit flag for human review is far cheaper than writing corrupt or unverified data to an enterprise ledger."

### Q6: Why allow null fields in the Pydantic extraction schemas?
**Answer:**  
"Real-world business documents are imperfect. Not every invoice specifies a purchase order number; not every contract specifies a separate governing law jurisdiction. If we made those fields mandatory in Pydantic, the LLM would be incentivized to hallucinate values to satisfy validation. Allowing `Optional` fields allows the model to output honest nulls, which our `validation_service.py` then scores objectively based on completeness."

---

## 3. Grounded Q&A & Citation Provenance

### Q7: How does DocSmart AI implement Grounded Document Q&A without hallucination?
**Answer:**  
"In `src/services/qa_service.py`, we do not simply pass the entire document and prompt an open-ended conversational response. Instead:
1. We chunk the document text into discrete paragraphs and maintain explicit line-number offsets.
2. We perform semantic query expansion (e.g. mapping 'parties' to 'agreement', 'between', 'client', 'vendor').
3. We score and retrieve candidate passages containing exact lexical overlap.
4. We extract concise answers directly from the matching passage and quote the verbatim source text with exact line coordinates (e.g., 'Lines 4–6').
5. If no passage meets the relevance threshold, the system returns an honest `is_grounded: False` state stating the fact could not be located in the document. Auditors can immediately click to verify the citation."

---

## 4. Security, Resilience & Enterprise Workflows

### Q8: How does DocSmart AI protect against prompt injection in untrusted PDFs?
**Answer:**  
"Every extraction and classification prompt strictly isolates the document content as untrusted data within boundary tags. Furthermore:
1. The model is constrained to output schema-validated JSON with no tool-calling or shell access.
2. The system does not execute any instructions contained within document text.
3. The extracted payload is parsed into Pydantic models with strict typing before database persistence."

### Q9: How do you guarantee downstream webhook integrity for n8n/ERP systems?
**Answer:**  
"Every outbound webhook dispatched by DocSmart AI is cryptographically signed using HMAC-SHA256 (`src/security.py`). The signature is computed over the payload using a shared `WEBHOOK_SIGNING_SECRET` and transmitted in the `X-Signature` header. The receiver (such as an n8n workflow node or API gateway) verifies the signature using constant-time comparison before processing, ensuring complete tamper-proofing and authenticity."

### Q10: How does the system handle demo environments without external LLM API keys?
**Answer:**  
"We built `src/ai/intelligent_demo.py` — an intelligent offline deterministic engine. When `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` are not set, the platform transparently switches to the offline engine. It extracts high-fidelity structured data, executes full verification rules, and populates the database and analytics without breaking or crashing. This guarantees that any recruiter, interviewer, or client can run a 100% functional demo immediately upon cloning."

---

## 5. Frontend & Full-Stack Integration

### Q11: What is the frontend architecture and how is it served?
**Answer:**  
"The frontend is built with React 18, TypeScript, and Vite. It utilizes a custom enterprise dark-theme glassmorphism design system built with CSS variables. It features:
- A responsive landing page showcasing enterprise KPI metrics and architectural blueprints.
- An interactive document workspace with split-pane view: document metadata, interactive QA with verbatim citations, and deterministic verification results.
- A real-time analytics dashboard tracking processing success rate, average latency, and live audit logs.
- A one-click sample seeder enabling recruiters to test the full pipeline in 3 seconds.  
For production deployment, FastAPI statically mounts the pre-built SPA bundle from `frontend/dist`, allowing the entire application to be run and hosted from a single web service."

---

## 6. Enterprise Value & Client Presentation

### Q12: How would you present DocSmart AI to an enterprise stakeholder or client?
**Answer:**  
"I would frame it through operational ROI and risk mitigation:
1. **Time-to-Value:** Traditional systems take 4-6 weeks to build custom extraction models. DocSmart AI provides instant Pydantic schema validation out of the box.
2. **Compliance & Audit Assurance:** Zero mathematical hallucinations. Financial auditors have an immutable audit trail (`processing_logs`) and line-anchored citations.
3. **Low Total Cost of Ownership:** Native digital extraction via `pdfplumber` eliminates unnecessary OCR compute for digital PDFs, and n8n webhook integration allows enterprise clients to wire up their existing accounting, ATS, and CRM stacks without custom backend development."
