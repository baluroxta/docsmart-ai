"""
Generates clean, realistic enterprise sample PDFs for DocSmart AI demonstration:
1. Acme Cloud Services Invoice
2. Enterprise Master Services Agreement (Contract)
3. Senior AI Engineer Resume
"""
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def create_invoice_pdf(dest_path: Path):
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(dest_path), pagesize=letter)
    width, height = letter

    # Header / Vendor Info
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 60, "ACME CLOUD TECHNOLOGIES INC.")
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 78, "100 Innovation Way, Suite 400, San Francisco, CA 94105")
    c.drawString(50, height - 92, "billing@acmecloud.io | www.acmecloud.io | +1 (800) 555-0199")

    # Title & Invoice Meta
    c.setFont("Helvetica-Bold", 16)
    c.drawString(420, height - 60, "TAX INVOICE")
    c.setFont("Helvetica-Bold", 10)
    c.drawString(420, height - 80, "Invoice Number:")
    c.setFont("Helvetica", 10)
    c.drawString(510, height - 80, "INV-2026-8842")

    c.setFont("Helvetica-Bold", 10)
    c.drawString(420, height - 95, "Issue Date:")
    c.setFont("Helvetica", 10)
    c.drawString(510, height - 95, "2026-10-01")

    c.setFont("Helvetica-Bold", 10)
    c.drawString(420, height - 110, "Due Date:")
    c.setFont("Helvetica", 10)
    c.drawString(510, height - 110, "2026-10-31")

    # Divider
    c.setLineWidth(1)
    c.setStrokeColorRGB(0.8, 0.8, 0.8)
    c.line(50, height - 130, width - 50, height - 130)

    # Bill To
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, height - 150, "BILL TO:")
    c.setFont("Helvetica", 10)
    c.drawString(50, height - 165, "Meridian Global Enterprises LLC")
    c.drawString(50, height - 179, "Attn: Accounts Payable")
    c.drawString(50, height - 193, "750 Enterprise Blvd, New York, NY 10001")
    c.drawString(50, height - 207, "ap@meridianglobal.com")

    # Table Header
    y = height - 250
    c.setFillColorRGB(0.94, 0.96, 0.98)
    c.rect(50, y - 5, width - 100, 22, fill=True, stroke=False)
    c.setFillColorRGB(0.1, 0.1, 0.1)
    c.setFont("Helvetica-Bold", 10)
    c.drawString(60, y + 2, "Description")
    c.drawString(330, y + 2, "Quantity")
    c.drawString(410, y + 2, "Unit Price")
    c.drawString(490, y + 2, "Total Amount")

    # Line Items
    items = [
        ("Enterprise Document Intelligence Platform License", "1", "3000.00", "3000.00"),
        ("Custom ML Model Fine-Tuning & Prompt Architecture", "10", "150.00", "1500.00"),
        ("Dedicated Cloud Cluster & SLA Support (Tier 1)", "1", "500.00", "500.00"),
    ]

    c.setFont("Helvetica", 10)
    y -= 25
    for desc, qty, unit, tot in items:
        c.drawString(60, y, desc)
        c.drawString(345, y, qty)
        c.drawString(410, y, f"${unit}")
        c.drawString(490, y, f"${tot}")
        y -= 22

    # Totals Section
    c.line(350, y - 5, width - 50, y - 5)
    y -= 25
    c.setFont("Helvetica-Bold", 10)
    c.drawString(380, y, "Subtotal:")
    c.setFont("Helvetica", 10)
    c.drawString(490, y, "$5000.00")

    y -= 20
    c.setFont("Helvetica-Bold", 10)
    c.drawString(380, y, "Tax (8.0%):")
    c.setFont("Helvetica", 10)
    c.drawString(490, y, "$400.00")

    y -= 25
    c.setLineWidth(1.5)
    c.line(350, y + 18, width - 50, y + 18)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(380, y, "Total Amount Due:")
    c.drawString(490, y, "$5400.00")

    # Payment Notes
    y -= 60
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Payment Terms & Wire Instructions:")
    c.setFont("Helvetica", 9)
    y -= 16
    c.drawString(50, y, "Payment due within 30 days of invoice date via ACH or wire transfer.")
    y -= 14
    c.drawString(50, y, "Bank: Silicon Valley Commercial Bank | Routing: 121000358 | Account: 9988223311")
    y -= 14
    c.drawString(50, y, "Thank you for partnering with Acme Cloud Technologies.")

    c.save()


def create_contract_pdf(dest_path: Path):
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(dest_path), pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 18)
    c.drawCentredString(width / 2, height - 60, "MASTER SERVICES AGREEMENT")
    
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, height - 90, "Effective Date: November 01, 2026")
    c.drawString(380, height - 90, "Expiration Date: October 31, 2027")

    c.setLineWidth(1)
    c.setStrokeColorRGB(0.8, 0.8, 0.8)
    c.line(50, height - 105, width - 50, height - 105)

    c.setFont("Helvetica", 10)
    y = height - 130
    c.drawString(50, y, "This Master Services Agreement (\"Agreement\") is entered into by and between:")
    y -= 20
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Party A (Client): Meridian Global Enterprises LLC, a Delaware corporation")
    y -= 15
    c.drawString(50, y, "Party B (Vendor): NexaCloud AI Solutions Inc., a California corporation")

    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "1. Scope of Services & Key Terms")
    y -= 18
    c.setFont("Helvetica", 10)
    c.drawString(50, y, "Vendor shall deliver AI document intelligence and workflow automation systems to Client.")
    y -= 15
    c.drawString(50, y, "All deliverables must comply with enterprise security standards and API verification rules.")

    y -= 25
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "2. Compensation & Contract Value")
    y -= 18
    c.setFont("Helvetica", 10)
    c.drawString(50, y, "The total annual contract value is $120,000.00 USD, payable in monthly milestones of $10,000.00.")

    y -= 25
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "3. Confidentiality & Intellectual Property")
    y -= 18
    c.setFont("Helvetica", 10)
    c.drawString(50, y, "Both parties agree to hold all proprietary data and document models strictly confidential.")
    y -= 15
    c.drawString(50, y, "Client retains full ownership of all uploaded corporate documents and extracted structured data.")

    y -= 25
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "4. Term and Termination")
    y -= 18
    c.setFont("Helvetica", 10)
    c.drawString(50, y, "Either party may terminate this agreement upon 30 days prior written notice for material breach.")

    y -= 25
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "5. Governing Law and Jurisdiction")
    y -= 18
    c.setFont("Helvetica", 10)
    c.drawString(50, y, "This Agreement shall be governed by and construed under the laws of the State of Delaware.")

    y -= 50
    c.line(50, y, 220, y)
    c.line(340, y, 510, y)
    y -= 15
    c.setFont("Helvetica-Bold", 9)
    c.drawString(50, y, "Authorized Signature: Meridian Global Enterprises")
    c.drawString(340, y, "Authorized Signature: NexaCloud AI Solutions")

    c.save()


def create_resume_pdf(dest_path: Path):
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(dest_path), pagesize=letter)
    width, height = letter

    # Name and Title
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, height - 60, "Kandala Guru Balaji")
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 80, "Senior AI Engineer & Full-Stack Systems Architect")
    c.setFont("Helvetica", 9)
    c.drawString(50, height - 95, "balaji.kandala@example.com | +1 (555) 234-5678 | San Francisco, CA | github.com/kandalabalaji")

    c.setLineWidth(1)
    c.setStrokeColorRGB(0.8, 0.8, 0.8)
    c.line(50, height - 110, width - 50, height - 110)

    # Summary
    y = height - 130
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "PROFESSIONAL SUMMARY")
    y -= 15
    c.setFont("Helvetica", 10)
    c.drawString(50, y, "AI Systems Engineer with 5+ years of experience designing enterprise document intelligence pipelines,")
    y -= 14
    c.drawString(50, y, "RAG question-answering systems, and scalable full-stack applications with FastAPI, React, and PostgreSQL.")

    # Core Skills
    y -= 25
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "TECHNICAL SKILLS")
    y -= 15
    c.setFont("Helvetica", 10)
    c.drawString(50, y, "Languages & Frameworks: Python, TypeScript, React, FastAPI, Node.js, Next.js, SQL")
    y -= 14
    c.drawString(50, y, "AI & Document Intelligence: LLM Orchestration, Anthropic Claude, OpenAI, PyMuPDF, pdfplumber, RAG")
    y -= 14
    c.drawString(50, y, "Data & Infrastructure: PostgreSQL, SQLite, Docker, Redis, Celery, n8n Automation, AWS")

    # Experience
    y -= 25
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "WORK EXPERIENCE")

    y -= 18
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Lead Document Intelligence Architect | DocSmart AI")
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(450, y, "2024 – Present")
    y -= 14
    c.setFont("Helvetica", 9)
    c.drawString(60, y, "- Designed and deployed end-to-end document processing engine converting PDFs to verified schemas.")
    y -= 13
    c.drawString(60, y, "- Implemented deterministic arithmetic & date validation rules reducing manual audit exceptions by 74%.")
    y -= 13
    c.drawString(60, y, "- Integrated grounded Q&A with citation verification ensuring zero-hallucination compliance.")

    y -= 20
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Full-Stack AI Software Engineer | Axivest Platforms")
    c.setFont("Helvetica-Oblique", 9)
    c.drawString(450, y, "2021 – 2024")
    y -= 14
    c.setFont("Helvetica", 9)
    c.drawString(60, y, "- Built high-throughput financial document analytics services supporting 250k+ daily transactions.")
    y -= 13
    c.drawString(60, y, "- Created responsive enterprise dashboards in React and TypeScript with sub-100ms API response times.")

    # Education
    y -= 25
    c.setFont("Helvetica-Bold", 11)
    c.drawString(50, y, "EDUCATION")
    y -= 16
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "B.S. in Computer Science & Artificial Intelligence")
    c.setFont("Helvetica", 9)
    c.drawString(450, y, "2017 – 2021")

    c.save()


if __name__ == "__main__":
    out_dir = Path(__file__).resolve().parent.parent / "samples"
    out_dir.mkdir(exist_ok=True)
    create_invoice_pdf(out_dir / "sample_acme_invoice.pdf")
    create_contract_pdf(out_dir / "sample_saas_contract.pdf")
    create_resume_pdf(out_dir / "sample_ai_engineer_resume.pdf")
    print(f"Generated 3 sample business PDFs in {out_dir}")
