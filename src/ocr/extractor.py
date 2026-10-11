"""
Text extraction layer.

Strategy:
1. If the file is a PDF, try native text extraction first (pdfplumber) —
   fast, free, and accurate for digitally-created PDFs.
2. If little/no text is found (scanned PDF) or the file is an image,
   fall back to OCR via Tesseract.

This keeps cost and latency down: OCR only runs when it's actually needed.
"""
import logging
from pathlib import Path

import pdfplumber
import pytesseract
from PIL import Image

from src.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()
pytesseract.pytesseract.tesseract_cmd = settings.tesseract_cmd

MIN_NATIVE_TEXT_CHARS = 10


class ExtractionError(Exception):
    pass


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

    raise ExtractionError(f"Unsupported mime type: {mime_type}")


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

    logger.info("Native text insufficient (%d chars) for %s, attempting OCR fallback", len(native_text), path)
    try:
        ocr_text = _ocr_pdf(path)
        if ocr_text.strip():
            return ocr_text
    except Exception as exc:  # noqa: BLE001
        logger.warning("OCR fallback was unsuccessful: %s", exc)
        if native_text:
            return native_text
        raise ExtractionError(
            f"Scanned PDF requires OCR, but OCR engine is not configured on this host ({exc}). Please upload native text PDFs."
        ) from exc

    return native_text


def _ocr_pdf(path: Path) -> str:
    from pdf2image import convert_from_path

    try:
        images = convert_from_path(str(path))
    except Exception as exc:  # noqa: BLE001
        raise ExtractionError(f"Failed to rasterize PDF for OCR: {exc}") from exc

    pages_text = []
    for img in images:
        try:
            pages_text.append(pytesseract.image_to_string(img))
        except Exception as exc:
            raise ExtractionError(f"Tesseract OCR failed: {exc}") from exc
    return "\n".join(pages_text).strip()


def _ocr_image(path: Path) -> str:
    try:
        image = Image.open(path)
    except Exception as exc:  # noqa: BLE001
        raise ExtractionError(f"Failed to open image: {exc}") from exc
    try:
        return pytesseract.image_to_string(image).strip()
    except Exception as exc:
        raise ExtractionError(
            f"Image OCR requires Tesseract installation ({exc}). Please upload digitally-rendered PDFs or configure Tesseract in .env."
        ) from exc
