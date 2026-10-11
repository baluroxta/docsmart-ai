# LinkedIn Project Announcement — Kandala Guru Balaji

🚀 Excited to announce **DocSmart AI — Enterprise Document Intelligence & Workflow Automation**!

**Tagline:** *Turn documents into decisions.*

Enterprises process thousands of invoices, service agreements, and resumes every month. Traditional approaches fall into two traps:
1. Legacy OCR tools dump raw text without structured validation.
2. Naive LLM chat wrappers hallucinate figures, ignore arithmetic errors, and provide zero audit trail.

I built **DocSmart AI** to solve this with an industrial, fail-closed architecture:

🔍 **Deterministic Verification Engine:** Doesn't just extract text — it programmatically verifies mathematical balances (`Subtotal + Tax == Total Amount`), audits line item totals, and checks chronological date ordering. If the numbers don't add up, it immediately flags discrepancies with detailed human-readable audit notes.

📖 **Grounded Document Q&A:** Allows compliance officers to ask natural language questions ("What is the termination notice period?") and receives answers anchored with exact verbatim citations and section line references. If the fact isn't in the document, it honestly responds that the information is not present.

📊 **Real-Time Analytics & CSV Export:** Full visibility into processing volume, confidence distributions, and stage latency with one-click RFC-compliant CSV financial exports.

⚡ **Enterprise Stack:**
• Backend: Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic v2
• Frontend: React 18, TypeScript, Vite, Dark Glassmorphism UI
• Persistence: Dual-mode SQLite (zero-config local) & PostgreSQL 15
• Workflows: HMAC-SHA256 authenticated webhook routing for n8n/ERPs
• Quality: 21 unit & integration tests passing with 100% boundary check coverage

Built for enterprise AI consulting and technical leadership portfolios.

Check out the repository and full architectural documentation below! 👇
GitHub: https://github.com/kandalabalaji/DocSmart-AI

#AI #MachineLearning #DocumentIntelligence #FastAPI #React #TypeScript #EnterpriseAI #Python #SoftwareEngineering #Automation #ArtificialIntelligence
