#!/usr/bin/env bash
# DocSmart AI — One-Click Launch Script (Linux/macOS)
# Developed by Kandala Guru Balaji

set -e

echo "=========================================================="
echo "DocSmart AI — Enterprise Document Intelligence Platform"
echo "Turn documents into decisions."
echo "Developed by Kandala Guru Balaji"
echo "=========================================================="

echo -e "\n[1/3] Initializing SQLite database and sample business PDFs..."
python3 scripts/init_db.py || python scripts/init_db.py
python3 scripts/generate_samples.py || python scripts/generate_samples.py

if [ ! -d "frontend/dist" ]; then
    echo -e "\n[2/3] Building React 18 production frontend bundle..."
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo -e "\n[2/3] Production frontend bundle ready in frontend/dist/"
fi

echo -e "\n[3/3] Launching FastAPI backend server at http://127.0.0.1:8000..."
echo "DocSmart AI is live! Open http://127.0.0.1:8000 in your browser."
echo -e "Press Ctrl+C to stop the server.\n"
python3 -m uvicorn src.main:app --host 127.0.0.1 --port 8000 || python -m uvicorn src.main:app --host 127.0.0.1 --port 8000
