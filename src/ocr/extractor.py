"""
Text extraction layer with multi-tiered OCR fallback.

Strategy:
1. If the file is a PDF, try native text extraction first (pdfplumber) —
   fast, free, and accurate for digitally-created PDFs.
2. If little/no text is found (scanned PDF) or the file is an image:
   a. Try Tesseract OCR if available on PATH or configured in settings.
   b. On Windows hosts, fall back seamlessly to high-speed Windows Media OCR
      using the native Windows.Media.Ocr subsystem without external dependencies.
3. If the file is plain text, read with robust encoding fallback.
"""
import logging
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

import pdfplumber
import pytesseract
from PIL import Image

from src.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

if settings.tesseract_cmd:
    pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd

MIN_NATIVE_TEXT_CHARS = 10
_WINDOWS_OCR_SCRIPT = Path(__file__).resolve().parent.parent.parent / "scripts" / "windows_ocr.ps1"


class ExtractionError(Exception):
    pass


def _is_tesseract_available() -> bool:
    """Checks whether the configured Tesseract binary exists or is on PATH."""
    if settings.tesseract_cmd and os.path.exists(settings.tesseract_cmd):
        return True
    return bool(shutil.which("tesseract"))


def _run_windows_ocr(image_path: Path) -> str:
    """Invokes native Windows.Media.Ocr via PowerShell helper."""
    if not _WINDOWS_OCR_SCRIPT.exists():
        logger.warning("Windows OCR helper script not found at %s", _WINDOWS_OCR_SCRIPT)
        return ""
    try:
        cmd = [
            "powershell",
            "-NoProfile",
            "-ExecutionPolicy",
            "Bypass",
            "-File",
            str(_WINDOWS_OCR_SCRIPT),
            "-ImagePath",
            str(image_path.resolve()),
        ]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=35, check=False)
        if res.returncode == 0:
            return res.stdout.strip()
        logger.warning("Windows OCR returned non-zero code %d: %s", res.returncode, res.stderr)
        return ""
    except Exception as exc:  # noqa: BLE001
        logger.warning("Windows Media OCR execution error: %s", exc)
        return ""


def _ocr_single_image(image_path: Path) -> str:
    """Attempts Tesseract first, then falls back to Windows Media OCR."""
    # 1. Try Tesseract if available
    if _is_tesseract_available():
        try:
            with Image.open(image_path) as img:
                txt = pytesseract.image_to_string(img).strip()
                if txt:
                    return txt
        except Exception as exc:  # noqa: BLE001
            logger.info("Tesseract failed on %s: %s. Trying Windows Media OCR...", image_path, exc)

    # 2. Try Windows native OCR
    if os.name == "nt":
        win_txt = _run_windows_ocr(image_path)
        if win_txt:
            return win_txt

    raise ExtractionError(
        f"Could not perform OCR on image '{image_path.name}'. Neither Tesseract nor Windows Media OCR succeeded."
    )


def extract_text(file_path: str, mime_type: str) -> str:
    path = Path(file_path)
    if not path.exists():
        raise ExtractionError(f"File not found: {file_path}")

    if mime_type == "application/pdf":
        return _extract_pdf(path)
    if mime_type.startswith("image/"):
        return _ocr_image(path)
    if mime_type == "text/plain":
        return path.read_text(encoding="utf-8", errors="replace")

    # Fallback by extension
    ext = path.suffix.lower()
    if ext == ".pdf":
        return _extract_pdf(path)
    if ext in [".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".webp"]:
        return _ocr_image(path)

    raise ExtractionError(f"Unsupported document format: {mime_type} ({path.suffix})")


def _extract_pdf(path: Path) -> str:
    text_parts: list[str] = []
    try:
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                text_parts.append(page_text)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Native PDF text extraction failed for %s: %s", path, exc)
        text_parts = []

    native_text = "\n".join(text_parts).strip()
    if len(native_text) >= MIN_NATIVE_TEXT_CHARS:
        return native_text

    logger.info("Native text insufficient (%d chars) for %s; launching OCR engine...", len(native_text), path)
    try:
        ocr_text = _ocr_pdf(path)
        if ocr_text.strip():
            return ocr_text
    except Exception as exc:  # noqa: BLE001
        logger.warning("OCR PDF fallback was unsuccessful: %s", exc)
        if native_text:
            return native_text
        raise ExtractionError(
            f"Scanned PDF contains no digital text and OCR failed: {exc}"
        ) from exc

    return native_text


def _ocr_pdf(path: Path) -> str:
    """Rasterizes PDF pages using pypdfium2 and runs OCR per page."""
    import pypdfium2 as pdfium

    try:
        pdf = pdfium.PdfDocument(str(path))
    except Exception as exc:  # noqa: BLE001
        raise ExtractionError(f"Failed to open PDF document for rendering: {exc}") from exc

    pages_text: list[str] = []
    with tempfile.TemporaryDirectory(prefix="docsmart_ocr_") as tmpdir:
        for i, page in enumerate(pdf):
            try:
                # Render at 2x scale for high OCR accuracy
                bitmap = page.render(scale=2.0)
                page_img_path = Path(tmpdir) / f"page_{i + 1}.png"
                bitmap.to_pil().save(page_img_path)
                page_text = _ocr_single_image(page_img_path)
                if page_text:
                    pages_text.append(page_text)
            except Exception as page_exc:  # noqa: BLE001
                logger.warning("OCR failed on page %d of %s: %s", i + 1, path.name, page_exc)

    combined = "\n\n".join(pages_text).strip()
    if not combined:
        raise ExtractionError("OCR processed all PDF pages but no legible text was recognized.")
    return combined


def _ocr_image(path: Path) -> str:
    return _ocr_single_image(path)
