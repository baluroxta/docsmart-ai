@echo off
title DocSmart AI - Enterprise Document Intelligence Platform
echo ========================================================
echo   DocSmart AI - Developed by Kandala Guru Balaji
echo ========================================================
echo Starting FastAPI Backend Server at http://127.0.0.1:8000 ...
start "" http://127.0.0.1:8000
python -m uvicorn src.main:app --host 127.0.0.1 --port 8000
pause
