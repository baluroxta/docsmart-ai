/**
 * DocSmart AI Frontend API Client
 * Connects directly to the FastAPI backend.
 * Zero hardcoded mock data: 100% genuine extraction, verification, and grounded Q&A.
 */

// Wipe any previous demo mock data from browser storage
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('docsmart_demo_documents_v2');
    localStorage.removeItem('docsmart_demo_documents');
  } catch (e) {
    // ignore
  }
}

export const getApiBase = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('docsmart_custom_api_url');
    if (custom) return custom.replace(/\/+$/, '');
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000';
    }
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
};

const DEFAULT_HEADERS = {
  'X-API-Key': import.meta.env.VITE_API_KEY || 'changeme',
};

export interface DocumentItem {
  id: string;
  filename: string;
  document_type: string;
  status: string;
  classification_confidence: number | null;
  created_at: string;
  confidence: number | null;
  extracted_data: Record<string, any> | null;
  is_valid: boolean;
}

export interface VerificationIssue {
  type: string;
  field?: string;
  severity: string;
  message: string;
}

export interface VerificationResult {
  status: 'VERIFIED' | 'NEEDS_REVIEW' | 'DISCREPANCY_DETECTED' | string;
  is_verified: boolean;
  issue_count: number;
  issues: VerificationIssue[];
  checks_passed: string[];
}

export interface ProcessingLog {
  stage: string;
  status: string;
  message?: string;
  latency_ms?: number;
  created_at: string;
}

export interface DocumentDetail {
  id: string;
  filename: string;
  document_type: string;
  status: string;
  classification_confidence: number | null;
  created_at: string;
  extracted_data: Record<string, any> | null;
  confidence: number | null;
  verification: VerificationResult | null;
  logs: ProcessingLog[];
}

export interface QACitation {
  excerpt: string;
  page_or_section?: string;
}

export interface QAResponse {
  answer: string;
  found: boolean;
  citations: QACitation[];
  confidence: number;
}

export interface AnalyticsData {
  total_documents: number;
  completed_count: number;
  needs_review_count: number;
  failed_count: number;
  discrepancy_count: number;
  verification_rate: number;
  avg_latency_ms: number;
  documents_by_type: Record<string, number>;
  recent_activity: Array<{
    id: number;
    document_id: string;
    stage: string;
    status: string;
    message?: string;
    latency_ms?: number;
    created_at: string;
  }>;
}

export const api = {
  async getDocuments(status?: string, type?: string): Promise<{ total: number; items: DocumentItem[] }> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (type) params.append('document_type', type);
    const res = await fetch(`${getApiBase()}/documents?${params.toString()}`, {
      headers: DEFAULT_HEADERS,
    });
    if (!res.ok) throw new Error(`Failed to fetch documents: ${res.statusText}`);
    return res.json();
  },

  async getDocumentDetail(id: string): Promise<DocumentDetail> {
    const res = await fetch(`${getApiBase()}/documents/${id}/detail`, {
      headers: DEFAULT_HEADERS,
    });
    if (!res.ok) throw new Error(`Failed to fetch document detail: ${res.statusText}`);
    return res.json();
  },

  async getDocumentText(id: string): Promise<{ text: string }> {
    const res = await fetch(`${getApiBase()}/documents/${id}/text`, {
      headers: DEFAULT_HEADERS,
    });
    if (!res.ok) throw new Error(`Failed to fetch text: ${res.statusText}`);
    return res.json();
  },

  async askQA(id: string, question: string): Promise<QAResponse> {
    const res = await fetch(`${getApiBase()}/documents/${id}/qa`, {
      method: 'POST',
      headers: {
        ...DEFAULT_HEADERS,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error(`Q&A request failed: ${res.statusText}`);
    return res.json();
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${getApiBase()}/analytics`, {
      headers: DEFAULT_HEADERS,
    });
    if (!res.ok) throw new Error(`Failed to fetch analytics: ${res.statusText}`);
    return res.json();
  },

  async uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${getApiBase()}/documents/upload`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `Upload failed: ${res.statusText}`);
    }
    return res.json();
  },

  async seedSamples(): Promise<any> {
    const res = await fetch(`${getApiBase()}/documents/seed-samples`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
    });
    if (!res.ok) throw new Error(`Failed to seed samples: ${res.statusText}`);
    return res.json();
  },

  async reprocess(id: string): Promise<any> {
    const res = await fetch(`${getApiBase()}/documents/${id}/reprocess`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
    });
    if (!res.ok) throw new Error(`Reprocess failed: ${res.statusText}`);
    return res.json();
  },

  getCsvExportUrl(id: string): string {
    return `${getApiBase()}/documents/${id}/export/csv`;
  },
};
