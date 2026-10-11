# DocSmart AI — One-Click Launch Script (Windows PowerShell)
# Developed by Kandala Guru Balaji

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "DocSmart AI — Enterprise Document Intelligence Platform" -ForegroundColor Cyan
Write-Host "Turn documents into decisions." -ForegroundColor White
Write-Host "Developed by Kandala Guru Balaji" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Initialize Database & Generate Realistic Sample PDFs
Write-Host "`n[1/3] Initializing SQLite database and sample business PDFs..." -ForegroundColor Green
python scripts/init_db.py
python scripts/generate_samples.py

# 2. Check if frontend dist exists
if (-not (Test-Path "frontend/dist")) {
    Write-Host "`n[2/3] Building React 18 production frontend bundle..." -ForegroundColor Green
    Push-Location frontend
    npm install
    npm run build
    Pop-Location
} else {
    Write-Host "`n[2/3] Production frontend bundle ready in frontend/dist/" -ForegroundColor Green
}

# 3. Launch Server
Write-Host "`n[3/3] Launching FastAPI backend server at http://127.0.0.1:8000..." -ForegroundColor Cyan
Write-Host "DocSmart AI is live! Open http://127.0.0.1:8000 in your browser." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server.`n" -ForegroundColor Gray
python -m uvicorn src.main:app --host 127.0.0.1 --port 8000
