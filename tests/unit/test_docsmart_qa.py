"""Unit tests for Grounded Q&A service."""
from pathlib import Path
from src.services.qa_service import answer_document_question


def test_qa_grounded_answer(tmp_path: Path):
    doc_path = tmp_path / "test_doc.txt"
    doc_path.write_text(
        "MASTER SERVICES AGREEMENT\n"
        "This Agreement is between Acme Corp and Beta LLC.\n"
        "Effective Date: January 15, 2026.\n"
        "The total compensation is $50,000.00 USD.\n"
        "Governing Law: This agreement shall be governed by Delaware law.\n"
    )

    # 1. Total amount question
    res = answer_document_question(str(doc_path), "text/plain", "What is the total amount?")
    assert res["found"] is True
    assert "50,000" in res["answer"]
    assert len(res["citations"]) > 0

    # 2. Parties question
    res_parties = answer_document_question(str(doc_path), "text/plain", "Who are the parties in this contract?")
    assert res_parties["found"] is True
    assert "Acme Corp" in res_parties["answer"]

    # 3. Absent information question
    res_absent = answer_document_question(str(doc_path), "text/plain", "What is the penalty for late rocket delivery to Mars?")
    assert res_absent["found"] is False
    assert "not" in res_absent["answer"].lower()


def test_qa_booking_confirmation(tmp_path: Path):
    doc_path = tmp_path / "booking_doc.txt"
    doc_path.write_text(
        "Booking confirmation\n"
        "CONFIRMATION NUMBER: 5771.476.556\n"
        "PIN CODE: 2832\n"
        "Guest name: KANDALA GURU BALAJI\n"
        "Newly Built Beautiful 2BHK Premium Stay with AC Bedrooms in Tirupati\n"
        "Check-in: 18 October 2026\n"
        "Check-out: 20 October 2026\n"
        "Price: ₹ 4,056.00\n"
        "Goods & services tax: ₹ 202.80\n"
        "Final price: ₹ 4,258.80\n"
        "Free private parking is possible on site.\n"
        "Cancellation cost until 16 October 2026: ₹ 0.\n",
        encoding="utf-8",
    )

    # 1. Guest name
    res_guest = answer_document_question(str(doc_path), "text/plain", "Who is the guest?")
    assert res_guest["found"] is True
    assert "KANDALA GURU BALAJI" in res_guest["answer"]

    # 2. Confirmation number
    res_conf = answer_document_question(str(doc_path), "text/plain", "What is the confirmation number?")
    assert res_conf["found"] is True
    assert "5771.476.556" in res_conf["answer"]

    # 3. Total price
    res_price = answer_document_question(str(doc_path), "text/plain", "What is the final price?")
    assert res_price["found"] is True
    assert "4,258.80" in res_price["answer"]

    # 4. Parking facility
    res_parking = answer_document_question(str(doc_path), "text/plain", "Is parking free?")
    assert res_parking["found"] is True
    assert "parking" in res_parking["answer"].lower()


def test_qa_medical_record(tmp_path: Path):
    doc_path = tmp_path / "medical_doc.txt"
    doc_path.write_text(
        "CLINICAL HEALTHCARE RECORD\n"
        "Patient Name: Jane Doe\n"
        "Attending Physician: Dr. Robert Smith, MD\n"
        "Clinical Assessment: Acute Bronchitis with mild wheezing\n"
        "Prescription: Amoxicillin 500mg capsules twice daily for 7 days\n"
        "Follow-up Appointment: 2 weeks from date of discharge\n",
        encoding="utf-8",
    )

    # 1. Patient Name
    res_patient = answer_document_question(str(doc_path), "text/plain", "Who is the patient?")
    assert res_patient["found"] is True
    assert "Jane Doe" in res_patient["answer"]

    # 2. Prescription
    res_rx = answer_document_question(str(doc_path), "text/plain", "What medication was prescribed?")
    assert res_rx["found"] is True
    assert "Amoxicillin" in res_rx["answer"]

    # 3. Assessment
    res_diag = answer_document_question(str(doc_path), "text/plain", "What is the clinical assessment?")
    assert res_diag["found"] is True
    assert "Bronchitis" in res_diag["answer"]


def test_qa_bank_statement(tmp_path: Path):
    doc_path = tmp_path / "bank_statement.txt"
    doc_path.write_text(
        "FIRST NATIONAL BANK - MONTHLY STATEMENT\n"
        "Account Holder: Alpha Global Corp\n"
        "Account Number: 9876-5432-10\n"
        "Statement Period: October 1, 2026 to October 31, 2026\n"
        "Opening Balance: $45,000.00\n"
        "Total Deposits: $85,250.00\n"
        "Closing Balance: $130,250.00\n",
        encoding="utf-8",
    )

    # 1. Account Number
    res_acct = answer_document_question(str(doc_path), "text/plain", "What is the account number?")
    assert res_acct["found"] is True
    assert "9876-5432-10" in res_acct["answer"]

    # 2. Closing Balance
    res_bal = answer_document_question(str(doc_path), "text/plain", "What is the closing balance?")
    assert res_bal["found"] is True
    assert "130,250.00" in res_bal["answer"]


def test_qa_policy_guideline(tmp_path: Path):
    doc_path = tmp_path / "policy_doc.txt"
    doc_path.write_text(
        "CORPORATE SECURITY AND REMOTE WORK POLICY\n"
        "Eligibility: Full-time employees after completing 90 days of tenure\n"
        "Core Working Hours: 10:00 AM to 4:00 PM EST\n"
        "Hardware: Company encrypted laptop provided to all approved staff\n"
        "Expense Reimbursement: High-speed internet up to $75 per month\n",
        encoding="utf-8",
    )

    # 1. Eligibility
    res_elig = answer_document_question(str(doc_path), "text/plain", "Who is eligible for remote work?")
    assert res_elig["found"] is True
    assert "90 days" in res_elig["answer"]

    # 2. Hardware
    res_hw = answer_document_question(str(doc_path), "text/plain", "Is a company laptop provided?")
    assert res_hw["found"] is True
    assert "laptop" in res_hw["answer"].lower()


def test_qa_railway_train_ticket(tmp_path: Path):
    doc_path = tmp_path / "train_ticket.txt"
    doc_path.write_text(
        "WL Electronic Reservation Slip (ERS)-Normal User WL\n"
        "Booked From To\n"
        "KACHEGUDA (KCG) KACHEGUDA (KCG) TIRUPATI (TPTY)\n"
        "Start Date* 09-Oct-2026 Departure* 20:05 09-Oct-2026 Arrival* 06:55 10-Oct-2026\n"
        "PNR Train No./Name Class\n"
        "THIRD AC ECONOMY\n"
        "4953281463 12797 / VENKATADRI SF\n"
        "(3E)\n"
        "Quota Distance Booking Date\n"
        "GENERAL (GN) 636 KM 08-Oct-2026 11:23:18 HRS\n"
        "Passenger Details\n"
        "# Name Age Gender Booking Status Current Status\n"
        "1. ARAMANAIDU 60 M WL/41 WL/21\n"
        "2. L NAGASUBBAREDDY 61 M WL/42 WL/22\n"
        "Payment Details\n"
        "Ticket Fare ₹ 1,940.00\n"
        "IRCTC Convenience Fee (Incl. of GST) ₹ 23.60\n"
        "Total Fare (all inclusive) ₹ 1,963.60\n",
        encoding="utf-8",
    )

    # 1. Who is travelling in the train? (User's specific encounter)
    res_passengers = answer_document_question(str(doc_path), "text/plain", "Who is travelling in the train?")
    assert res_passengers["found"] is True
    assert "ARAMANAIDU" in res_passengers["answer"]
    assert "L NAGASUBBAREDDY" in res_passengers["answer"]
    assert len(res_passengers["citations"]) == 2

    # 2. PNR Number
    res_pnr = answer_document_question(str(doc_path), "text/plain", "What is the PNR?")
    assert res_pnr["found"] is True
    assert "4953281463" in res_pnr["answer"]

    # 3. Train Name / Number
    res_train = answer_document_question(str(doc_path), "text/plain", "What is the train number and name?")
    assert res_train["found"] is True
    assert "12797" in res_train["answer"]
    assert "VENKATADRI" in res_train["answer"]

    # 4. Route
    res_route = answer_document_question(str(doc_path), "text/plain", "What is the route?")
    assert res_route["found"] is True
    assert "KACHEGUDA" in res_route["answer"]
    assert "TIRUPATI" in res_route["answer"]

    # 5. Total fare
    res_fare = answer_document_question(str(doc_path), "text/plain", "What is the total fare?")
    assert res_fare["found"] is True
    assert "1,963.60" in res_fare["answer"]


def test_qa_resume_profile(tmp_path: Path):
    doc_path = tmp_path / "candidate_resume.txt"
    doc_path.write_text(
        "GURU BALAJI KANDALA\n"
        "Computer Science & Business Systems Student\n"
        "Tirupati Urban, Andhra Pradesh, India | kandalabalaji1965@gmail.com | 6305143995\n"
        "EDUCATION\n"
        "Vellore Institute of Technology (AP) 2023–2027\n"
        "B.Tech. – Computer Science & Business Systems; CGPA: 8.61/10 Amaravati, Andhra Pradesh\n"
        "EXPERIENCE\n"
        "Tata Consultancy Services – Cyber Security Analyst, Virtual Internship Jun 2025\n"
        "PROJECTS\n"
        "OptionPilot – Stock Options Analysis Platform 2026\n"
        "Earthquake Detector Using Raspberry Pi Academic Project\n"
        "SKILLS\n"
        "Technology: AWS, SQL, Python, C, C++, JavaScript, Next.js, Node.js\n",
        encoding="utf-8",
    )

    # 1. Who is the candidate?
    res_cand = answer_document_question(str(doc_path), "text/plain", "Who is the candidate?")
    assert res_cand["found"] is True
    assert "GURU BALAJI KANDALA" in res_cand["answer"]

    # 2. Education
    res_edu = answer_document_question(str(doc_path), "text/plain", "What is his education?")
    assert res_edu["found"] is True
    assert "Vellore Institute of Technology" in res_edu["answer"]
    assert "8.61" in res_edu["answer"]

    # 3. Projects
    res_proj = answer_document_question(str(doc_path), "text/plain", "What projects has he worked on?")
    assert res_proj["found"] is True
    assert "OptionPilot" in res_proj["answer"]

    # 4. Contact
    res_phone = answer_document_question(str(doc_path), "text/plain", "What is his phone number?")
    assert res_phone["found"] is True
    assert "6305143995" in res_phone["answer"]


def test_qa_flight_itinerary(tmp_path: Path):
    doc_path = tmp_path / "flight_itinerary.txt"
    doc_path.write_text(
        "EMIRATES AIRLINES ELECTRONIC TICKET & BOARDING PASS\n"
        "Passenger Name: KANDALA GURU BALAJI\n"
        "Booking Reference / PNR: EK78921X\n"
        "Flight Number: EK 543\n"
        "Departure: 15-Nov-2026 04:30 Dubai International Airport (DXB) Terminal 3 Gate B12\n"
        "Arrival: 15-Nov-2026 09:15 London Heathrow (LHR) Terminal 3\n"
        "Seat: 14A (Business Class)\n"
        "Baggage Allowance: 2 pieces (up to 32kg each)\n"
        "Total Fare Paid: $ 2,450.00 USD\n",
        encoding="utf-8",
    )

    # 1. Passenger name
    res_pass = answer_document_question(str(doc_path), "text/plain", "Who is the passenger?")
    assert res_pass["found"] is True
    assert "KANDALA GURU BALAJI" in res_pass["answer"]

    # 2. PNR
    res_pnr = answer_document_question(str(doc_path), "text/plain", "What is the PNR or booking reference?")
    assert res_pnr["found"] is True
    assert "EK78921X" in res_pnr["answer"]

    # 3. Flight number
    res_flt = answer_document_question(str(doc_path), "text/plain", "What is the flight number?")
    assert res_flt["found"] is True
    assert "EK 543" in res_flt["answer"]

    # 4. Conversational question with filler words
    res_bag = answer_document_question(str(doc_path), "text/plain", "Can you tell me what the baggage allowance is please?")
    assert res_bag["found"] is True
    assert "32kg" in res_bag["answer"]


def test_qa_universal_conversational_questions(tmp_path: Path):
    doc_path = tmp_path / "general_report.txt"
    doc_path.write_text(
        "ANNUAL SUSTAINABILITY AND ENERGY AUDIT REPORT\n"
        "Prepared By: GreenTech Engineering Solutions\n"
        "Inspection Date: September 20, 2026\n"
        "Facility Location: Hyderabad Technology Park, Building 4\n"
        "Primary Findings: Energy consumption reduced by 24% across cooling systems.\n"
        "Solar Panel Capacity: 450 kW installed on rooftop.\n"
        "Compliance Status: Certified ISO 50001 compliant with zero non-conformities.\n"
        "Total Energy Cost Savings: $ 185,000.00 annually.\n",
        encoding="utf-8",
    )

    # 1. Conversational "tell me who prepared this"
    res_author = answer_document_question(str(doc_path), "text/plain", "Can you tell me who prepared this document?")
    assert res_author["found"] is True
    assert "GreenTech" in res_author["answer"]

    # 2. "Where is the facility located?"
    res_loc = answer_document_question(str(doc_path), "text/plain", "Where is the facility located?")
    assert res_loc["found"] is True
    assert "Hyderabad" in res_loc["answer"]

    # 3. "What are the primary findings?"
    res_find = answer_document_question(str(doc_path), "text/plain", "What are the primary findings?")
    assert res_find["found"] is True
    assert "24%" in res_find["answer"]

    # 4. "What is the compliance status?"
    res_comp = answer_document_question(str(doc_path), "text/plain", "What is the compliance status?")
    assert res_comp["found"] is True
    assert "ISO 50001" in res_comp["answer"]



