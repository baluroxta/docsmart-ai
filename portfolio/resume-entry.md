# Resume Entry — Kandala Guru Balaji

## DocSmart AI — Enterprise Document Intelligence & Workflow Automation
*Enterprise Full-Stack AI Platform (FastAPI, React 18, TypeScript, Python, SQLAlchemy, PostgreSQL/SQLite, Pydantic, n8n)*

- **Engineered an enterprise document intelligence platform** that ingests multi-format business documents (invoices, contracts, resumes, forms), extracts strongly-typed Pydantic schemas, and automates downstream enterprise ERP/accounting workflows.
- **Implemented a Deterministic Verification Engine** enforcing mathematical balance invariants ($|\text{Subtotal} + \text{Tax} - \text{Total}| \le \$0.05$, line item summations), chronological date order, and entity sanity checks, preventing silent arithmetic corruption before persistence.
- **Built a Grounded Document Q&A Engine** with line-anchored semantic chunking, verbatim passage quotes, and strict provenance attribution, guaranteeing zero-hallucination auditor verification with an honest "Not Found" state.
- **Architected a fail-closed dual-engine storage model** supporting zero-configuration SQLite for immediate local execution and PostgreSQL for clustered deployments, coupled with HMAC-SHA256 authenticated webhook routing for n8n/ERP systems.
- **Constructed a modern React 18 / TypeScript SPA** featuring dark glassmorphism design, real-time KPI analytics dashboard, split-pane schema verification workspace, and RFC-compliant CSV financial exports.
- **Authored comprehensive test suite** with 21 unit and integration tests (pytest) covering schema coercions, date/math verification boundary conditions, cryptographic webhook signatures, and grounded Q&A extraction.
