import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  RotateCcw,
  MessageSquare,
  Search,
  ShieldCheck,
  FileCheck,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Info,
  Copy,
  Check,
} from 'lucide-react';
import {
  api,
  DocumentItem,
  DocumentDetail,
  QAResponse,
} from '../api';

const FormattedAnswer: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to parse bold **bold text**
  const parseInline = (line: string) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} style={{ color: '#ffffff', fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const lines = text.split('\n');

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
        <button
          onClick={handleCopy}
          title="Copy answer to clipboard"
          style={{
            background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${copied ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-subtle)'}`,
            color: copied ? '#34d399' : 'var(--text-muted)',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div style={{ fontSize: '0.92rem', lineHeight: '1.65', color: '#e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} style={{ height: '6px' }} />;
          }

          // Bullet point (starts with -, *, or •)
          if (/^[-*•]\s+/.test(trimmed)) {
            const content = trimmed.replace(/^[-*•]\s+/, '');
            return (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', paddingLeft: '4px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.9rem' }}>•</span>
                <span style={{ flex: 1 }}>{parseInline(content)}</span>
              </div>
            );
          }

          // Numbered list (starts with 1., 2., etc.)
          const numMatch = trimmed.match(/^([0-9]{1,2})\.\s+(.+)$/);
          if (numMatch) {
            return (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', paddingLeft: '4px' }}>
                <span style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--accent-cyan)',
                  background: 'rgba(14, 165, 233, 0.15)',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  borderRadius: '4px',
                  padding: '1px 6px',
                  minWidth: '20px',
                  textAlign: 'center',
                  marginTop: '2px',
                }}>
                  {numMatch[1]}
                </span>
                <span style={{ flex: 1 }}>{parseInline(numMatch[2])}</span>
              </div>
            );
          }

          // Heading or bold label
          if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 50) {
            return (
              <div key={idx} style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' }}>
                {trimmed.slice(2, -2)}
              </div>
            );
          }

          return (
            <div key={idx}>
              {parseInline(trimmed)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getCategoryBadge = (doc: DocumentItem) => {
  const dt = doc.document_type?.toLowerCase();
  const cat = (doc.extracted_data?.document_category || '').toLowerCase();
  const fn = doc.filename.toLowerCase();

  if (cat.includes('railway') || cat.includes('train') || fn.includes('irctc') || fn.includes('4953281463')) {
    return { label: 'Railway Ticket', bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' };
  }
  if (cat.includes('flight') || cat.includes('airline') || fn.includes('flight') || fn.includes('ticket')) {
    return { label: 'Flight Ticket', bg: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' };
  }
  if (cat.includes('booking') || cat.includes('hotel') || fn.includes('booking')) {
    return { label: 'Travel Booking', bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' };
  }
  if (cat.includes('medical') || cat.includes('clinical') || fn.includes('medical') || fn.includes('patient')) {
    return { label: 'Healthcare', bg: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' };
  }
  if (cat.includes('bank') || cat.includes('financial') || fn.includes('statement') || fn.includes('bank')) {
    return { label: 'Banking', bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' };
  }
  if (dt === 'invoice') {
    return { label: 'Invoice', bg: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8' };
  }
  if (dt === 'contract') {
    return { label: 'Contract', bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' };
  }
  if (dt === 'resume') {
    return { label: 'Resume / CV', bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' };
  }
  if (cat) {
    return { label: cat.slice(0, 18), bg: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1' };
  }
  return { label: doc.document_type || 'General', bg: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1' };
};

interface WorkspaceProps {
  onSeedSamples: () => void;
  isSeeding: boolean;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  onSeedSamples,
  isSeeding,
}) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docDetail, setDocDetail] = useState<DocumentDetail | null>(null);
  const [rawText, setRawText] = useState<string | null>(null);
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Inspector tabs: 'extraction' | 'verification' | 'qa' | 'audit' | 'raw'
  const [activeTab, setActiveTab] = useState<'extraction' | 'verification' | 'qa' | 'audit' | 'raw'>('extraction');

  // Q&A state
  const [qaQuestion, setQaQuestion] = useState<string>('');
  const [qaLoading, setQaLoading] = useState<boolean>(false);
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: QAResponse }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch document library
  const loadDocuments = async () => {
    try {
      setLoadingDocs(true);
      const res = await api.getDocuments();
      setDocuments(res.items);
      if (res.items.length > 0 && !selectedDocId) {
        setSelectedDocId(res.items[0].id);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // Fetch document details when selection changes
  useEffect(() => {
    if (!selectedDocId) {
      setDocDetail(null);
      setRawText(null);
      return;
    }

    const loadDetail = async () => {
      try {
        setLoadingDetail(true);
        const detail = await api.getDocumentDetail(selectedDocId);
        setDocDetail(detail);
        // Reset QA history on document change
        setQaHistory([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDetail(false);
      }
    };

    loadDetail();
  }, [selectedDocId]);

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    if (!file.name.toLowerCase().endsWith('.pdf') && !file.type.startsWith('image/')) {
      setUploadError('Please upload a valid PDF or image document.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File exceeds 15MB limit.');
      return;
    }

    try {
      setUploading(true);
      const res = await api.uploadFile(file);
      await loadDocuments();
      setSelectedDocId(res.document_id);
    } catch (err: any) {
      setUploadError(err.message || 'Upload processing failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Q&A submit
  const handleAskQA = async (qText?: string) => {
    const q = (qText || qaQuestion).trim();
    if (!q || !selectedDocId) return;

    try {
      setQaLoading(true);
      const res = await api.askQA(selectedDocId, q);
      setQaHistory((prev) => [...prev, { q, a: res }]);
      setQaQuestion('');
    } catch (err: any) {
      setQaHistory((prev) => [
        ...prev,
        {
          q,
          a: {
            answer: `Error answering question: ${err.message}`,
            found: false,
            citations: [],
            confidence: 0,
          },
        },
      ]);
    } finally {
      setQaLoading(false);
    }
  };

  // Fetch raw text on demand
  const handleLoadRawText = async () => {
    if (!selectedDocId || rawText) return;
    try {
      const res = await api.getDocumentText(selectedDocId);
      setRawText(res.text);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReprocess = async () => {
    if (!selectedDocId) return;
    try {
      await api.reprocess(selectedDocId);
      await loadDocuments();
      const updated = await api.getDocumentDetail(selectedDocId);
      setDocDetail(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '24px auto 80px auto', padding: '0 24px' }}>
      {/* Upload Zone & Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px',
        marginBottom: '28px',
      }}>
        {/* Drag & Drop Upload Card */}
        <div
          className="glass-panel glass-panel-glow"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '24px',
            borderStyle: 'dashed',
            borderWidth: '2px',
            borderColor: uploading ? 'var(--accent-cyan)' : 'var(--border-medium)',
            cursor: 'pointer',
            textAlign: 'center',
            background: 'rgba(17, 24, 39, 0.6)',
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'rgba(14, 165, 233, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
          }}>
            <Upload size={22} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
            {uploading ? 'Processing Document with AI Pipeline...' : 'Upload Business Document'}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Drag & drop PDF, PNG, or JPG (Up to 15MB)
          </div>
          {uploadError && (
            <div style={{ color: 'var(--status-error-text)', fontSize: '0.8rem', marginTop: '8px' }}>
              {uploadError}
            </div>
          )}
        </div>

        {/* Quick Demo Pre-sets Card */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            Recruiter & Interview Demo Set
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
            Instant Pre-Configured Enterprise Documents
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.5' }}>
            Click below to automatically ingest sample documents (Acme Invoice, SaaS MSA, AI Engineer Resume) for immediate testing.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={async () => {
                await onSeedSamples();
                await loadDocuments();
              }}
              disabled={isSeeding}
              style={{ fontSize: '0.82rem', padding: '8px 16px' }}
            >
              <Sparkles size={15} /> {isSeeding ? 'Seeding...' : 'Load All 3 Demo Files'}
            </button>
            <button
              className="btn-secondary"
              onClick={loadDocuments}
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              Refresh Library
            </button>
          </div>
        </div>
      </div>

      {/* Workspace Split Layout: Document Library & Detailed Inspector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* Left Column: Document Library */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent-cyan)" /> Document Queue
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {documents.length} File(s)
            </span>
          </div>

          {loadingDocs && documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Loading queue...
            </div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No documents yet. Upload a file above or click "Load Demo Files".
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '680px', overflowY: 'auto' }}>
              {documents.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(14, 165, 233, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      {(() => {
                        const bInfo = getCategoryBadge(doc);
                        return (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: bInfo.bg,
                            color: bInfo.color,
                            letterSpacing: '0.03em',
                          }}>
                            {bInfo.label}
                          </span>
                        );
                      })()}
                      <span className={`badge ${doc.status === 'completed' ? 'badge-verified' : doc.status === 'needs_review' ? 'badge-review' : 'badge-neutral'}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                        {doc.status}
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: isSelected ? '#ffffff' : 'var(--text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {doc.filename}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                      {doc.confidence !== null && (
                        <span>Confidence: {Math.round(doc.confidence * 100)}%</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Inspector */}
        <div className="glass-panel" style={{ padding: '28px', minHeight: '680px' }}>
          {!selectedDocId ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
              <FileText size={48} color="var(--border-medium)" style={{ margin: '0 auto 16px auto' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '6px' }}>No Document Selected</div>
              <div style={{ fontSize: '0.88rem' }}>Select a document from the queue on the left to inspect extractions, verification checks, and Q&A.</div>
            </div>
          ) : loadingDetail || !docDetail ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
              Loading document inspection data...
            </div>
          ) : (
            <div>
              {/* Top Document Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '16px',
                paddingBottom: '20px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '20px',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{docDetail.filename}</h1>
                    <span className={`badge ${docDetail.status === 'completed' ? 'badge-verified' : docDetail.status === 'needs_review' ? 'badge-review' : 'badge-error'}`}>
                      {docDetail.status}
                    </span>
                    {docDetail.verification && (
                      <span className={`badge ${docDetail.verification.status === 'VERIFIED' ? 'badge-verified' : docDetail.verification.status === 'DISCREPANCY_DETECTED' ? 'badge-error' : 'badge-review'}`}>
                        {docDetail.verification.status}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'flex', gap: '16px' }}>
                    <span>ID: {docDetail.id}</span>
                    <span>Ingested: {new Date(docDetail.created_at).toLocaleString()}</span>
                    <span>Type: <strong style={{ textTransform: 'capitalize', color: 'var(--text-main)' }}>{docDetail.document_type}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={api.getCsvExportUrl(docDetail.id)}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '8px 14px', textDecoration: 'none' }}
                    download
                  >
                    <Download size={15} /> Export CSV
                  </a>
                  <button
                    className="btn-secondary"
                    onClick={handleReprocess}
                    style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                    title="Re-run extraction and validation pipeline"
                  >
                    <RotateCcw size={15} /> Reprocess
                  </button>
                </div>
              </div>

              {/* Inspector Navigation Tabs */}
              <div style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '12px',
                marginBottom: '24px',
                overflowX: 'auto',
              }}>
                <button
                  onClick={() => setActiveTab('extraction')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: activeTab === 'extraction' ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                    color: activeTab === 'extraction' ? '#38bdf8' : 'var(--text-muted)',
                    border: activeTab === 'extraction' ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid transparent',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileText size={16} /> Structured Extraction
                </button>

                <button
                  onClick={() => setActiveTab('verification')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: activeTab === 'verification' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    color: activeTab === 'verification' ? '#34d399' : 'var(--text-muted)',
                    border: activeTab === 'verification' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ShieldCheck size={16} /> Verification & Exceptions
                  {docDetail.verification?.issue_count ? (
                    <span style={{
                      background: 'rgba(239, 68, 68, 0.25)',
                      color: '#f87171',
                      borderRadius: '999px',
                      padding: '1px 6px',
                      fontSize: '0.72rem',
                    }}>
                      {docDetail.verification.issue_count}
                    </span>
                  ) : null}
                </button>

                <button
                  onClick={() => setActiveTab('qa')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: activeTab === 'qa' ? 'rgba(168, 85, 247, 0.15)' : 'transparent',
                    color: activeTab === 'qa' ? '#c084fc' : 'var(--text-muted)',
                    border: activeTab === 'qa' ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <MessageSquare size={16} /> AI Grounded Q&A
                </button>

                <button
                  onClick={() => setActiveTab('audit')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: activeTab === 'audit' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: activeTab === 'audit' ? '#fbbf24' : 'var(--text-muted)',
                    border: activeTab === 'audit' ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid transparent',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Clock size={16} /> Audit Trail ({docDetail.logs.length})
                </button>

                <button
                  onClick={() => {
                    setActiveTab('raw');
                    handleLoadRawText();
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: activeTab === 'raw' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: activeTab === 'raw' ? '#ffffff' : 'var(--text-muted)',
                    border: activeTab === 'raw' ? '1px solid var(--border-medium)' : '1px solid transparent',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Info size={16} /> Extracted Text
                </button>
              </div>

              {/* TAB 1: STRUCTURED EXTRACTION */}
              {activeTab === 'extraction' && (
                <div>
                  {!docDetail.extracted_data ? (
                    <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
                      No structured fields extracted for this document.
                    </div>
                  ) : (
                    <div>
                      {/* Executive AI Document Summary Banner */}
                      {docDetail.extracted_data.executive_summary && (
                        <div style={{
                          padding: '18px 22px',
                          borderRadius: 'var(--radius-md)',
                          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(168, 85, 247, 0.08))',
                          border: '1px solid rgba(14, 165, 233, 0.3)',
                          marginBottom: '24px',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Sparkles size={16} color="#38bdf8" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.05em' }}>
                              Executive AI Document Summary
                            </span>
                          </div>
                          <div style={{ fontSize: '0.96rem', lineHeight: '1.65', color: '#f1f5f9' }}>
                            {docDetail.extracted_data.executive_summary}
                          </div>
                        </div>
                      )}

                      {/* Primary Entities & Dates Tags if present */}
                      {(Array.isArray(docDetail.extracted_data.primary_entities) && docDetail.extracted_data.primary_entities.length > 0) ||
                       (Array.isArray(docDetail.extracted_data.key_dates) && docDetail.extracted_data.key_dates.length > 0) ||
                       (Array.isArray(docDetail.extracted_data.financial_metrics) && docDetail.extracted_data.financial_metrics.length > 0) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                          {Array.isArray(docDetail.extracted_data.primary_entities) && docDetail.extracted_data.primary_entities.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                                Primary Identified Entities & Parties:
                              </div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {docDetail.extracted_data.primary_entities.map((ent: string, idx: number) => (
                                  <span key={idx} style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '0.84rem', fontWeight: 500 }}>
                                    {ent}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {Array.isArray(docDetail.extracted_data.key_dates) && docDetail.extracted_data.key_dates.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                                Operational & Scheduled Dates:
                              </div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {docDetail.extracted_data.key_dates.map((dt: string, idx: number) => (
                                  <span key={idx} style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', fontSize: '0.84rem', fontWeight: 500 }}>
                                    {dt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {Array.isArray(docDetail.extracted_data.financial_metrics) && docDetail.extracted_data.financial_metrics.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                                Financial Metrics & Amounts:
                              </div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {docDetail.extracted_data.financial_metrics.map((fm: string, idx: number) => (
                                  <span key={idx} style={{ padding: '4px 12px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.84rem', fontWeight: 600 }}>
                                    {fm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : null}

                      {/* General Key Fields Map if present */}
                      {docDetail.extracted_data.key_fields && typeof docDetail.extracted_data.key_fields === 'object' && Object.keys(docDetail.extracted_data.key_fields).length > 0 && (
                        <div style={{ marginBottom: '28px' }}>
                          <h3 style={{ fontSize: '1.02rem', marginBottom: '14px', color: '#ffffff' }}>Verified Document Fields</h3>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                            {Object.entries(docDetail.extracted_data.key_fields).map(([k, v]) => (
                              <div key={k} style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '3px' }}>{k}</div>
                                <div style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>{String(v)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Structured Grid Attributes */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '16px',
                        marginBottom: '28px',
                      }}>
                        {Object.entries(docDetail.extracted_data).map(([key, val]) => {
                          if (['line_items', 'executive_summary', 'key_points', 'primary_entities', 'key_dates', 'financial_metrics', 'key_fields'].includes(key) || Array.isArray(val) || typeof val === 'object') return null;
                          return (
                            <div
                              key={key}
                              style={{
                                padding: '14px 18px',
                                borderRadius: 'var(--radius-md)',
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid var(--border-subtle)',
                              }}
                            >
                              <div style={{
                                fontSize: '0.74rem',
                                color: 'var(--text-dim)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                fontWeight: 700,
                                marginBottom: '4px',
                              }}>
                                {key.replace(/_/g, ' ')}
                              </div>
                              <div style={{
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                color: val === null || val === '' ? 'var(--text-dim)' : '#ffffff',
                              }}>
                                {val === null || val === '' ? '— Not Found' : String(val)}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Key Points / Clauses Bullet List */}
                      {Array.isArray(docDetail.extracted_data.key_points) && docDetail.extracted_data.key_points.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                          <h3 style={{ fontSize: '1.02rem', marginBottom: '12px', color: '#ffffff' }}>Key Information & Provisions</h3>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {docDetail.extracted_data.key_points.map((pt: string, idx: number) => (
                              <li key={idx} style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CheckCircle2 size={15} color="#38bdf8" style={{ flexShrink: 0 }} />
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Line Items Table if present (Invoices) */}
                      {Array.isArray(docDetail.extracted_data.line_items) && docDetail.extracted_data.line_items.length > 0 && (
                        <div>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#ffffff' }}>Itemized Line Items</h3>
                          <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                              <thead>
                                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-muted)' }}>
                                  <th style={{ padding: '12px 16px' }}>Description</th>
                                  <th style={{ padding: '12px 16px' }}>Qty</th>
                                  <th style={{ padding: '12px 16px' }}>Unit Price</th>
                                  <th style={{ padding: '12px 16px' }}>Total Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {docDetail.extracted_data.line_items.map((item: any, idx: number) => (
                                  <tr key={idx} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                    <td style={{ padding: '12px 16px', color: '#ffffff', fontWeight: 500 }}>{item.description}</td>
                                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{item.quantity ?? '—'}</td>
                                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{item.unit_price ? `$${item.unit_price}` : '—'}</td>
                                    <td style={{ padding: '12px 16px', color: '#38bdf8', fontWeight: 600 }}>{item.total ? `$${item.total}` : '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Skills tags if present (Resume) */}
                      {Array.isArray(docDetail.extracted_data.skills) && docDetail.extracted_data.skills.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', color: '#ffffff' }}>Cataloged Skills</h3>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {docDetail.extracted_data.skills.map((s: string, idx: number) => (
                              <span
                                key={idx}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  background: 'rgba(56, 189, 248, 0.1)',
                                  border: '1px solid rgba(56, 189, 248, 0.25)',
                                  color: 'var(--accent-cyan)',
                                  fontSize: '0.82rem',
                                  fontWeight: 500,
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Key terms list if present (Contract) */}
                      {Array.isArray(docDetail.extracted_data.key_terms) && docDetail.extracted_data.key_terms.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', color: '#ffffff' }}>Extracted Key Clauses</h3>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {docDetail.extracted_data.key_terms.map((term: string, idx: number) => (
                              <li
                                key={idx}
                                style={{
                                  padding: '10px 14px',
                                  borderRadius: 'var(--radius-sm)',
                                  background: 'rgba(255, 255, 255, 0.02)',
                                  border: '1px solid var(--border-subtle)',
                                  color: 'var(--text-main)',
                                  fontSize: '0.86rem',
                                }}
                              >
                                {term}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: VERIFICATION & EXCEPTION DETECTION */}
              {activeTab === 'verification' && (
                <div>
                  {!docDetail.verification ? (
                    <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
                      No verification report generated yet.
                    </div>
                  ) : (
                    <div>
                      {/* Status Banner */}
                      <div
                        style={{
                          padding: '18px 24px',
                          borderRadius: 'var(--radius-md)',
                          background: docDetail.verification.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.1)' : docDetail.verification.status === 'DISCREPANCY_DETECTED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          border: `1px solid ${docDetail.verification.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.3)' : docDetail.verification.status === 'DISCREPANCY_DETECTED' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          marginBottom: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                        }}
                      >
                        {docDetail.verification.status === 'VERIFIED' ? (
                          <CheckCircle2 size={24} color="#34d399" />
                        ) : docDetail.verification.status === 'DISCREPANCY_DETECTED' ? (
                          <AlertTriangle size={24} color="#f87171" />
                        ) : (
                          <AlertTriangle size={24} color="#fbbf24" />
                        )}
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                            Verification Status: {docDetail.verification.status}
                          </div>
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {docDetail.verification.is_verified
                              ? 'All deterministic business logic checks and arithmetic validations passed.'
                              : `${docDetail.verification.issue_count} exception(s) flagged for human compliance review.`}
                          </div>
                        </div>
                      </div>

                      {/* Issues / Exceptions List */}
                      {docDetail.verification.issues.length > 0 && (
                        <div style={{ marginBottom: '28px' }}>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#ffffff' }}>Flagged Exceptions & Discrepancies</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {docDetail.verification.issues.map((iss, i) => (
                              <div
                                key={i}
                                style={{
                                  padding: '14px 18px',
                                  borderRadius: 'var(--radius-sm)',
                                  background: iss.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                                  border: `1px solid ${iss.severity === 'HIGH' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '12px',
                                }}
                              >
                                <AlertTriangle size={18} color={iss.severity === 'HIGH' ? '#f87171' : '#fbbf24'} style={{ marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: iss.severity === 'HIGH' ? '#f87171' : '#fbbf24' }}>
                                      {iss.type}
                                    </span>
                                    {iss.field && (
                                      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                                        Field: {iss.field}
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.88rem', color: '#ffffff', marginTop: '4px' }}>
                                    {iss.message}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Passed Checks List */}
                      <div>
                        <h3 style={{ fontSize: '1.05rem', marginBottom: '14px', color: '#ffffff' }}>Verified Validation Rules</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {docDetail.verification.checks_passed.map((chk, i) => (
                            <div
                              key={i}
                              style={{
                                padding: '10px 14px',
                                borderRadius: 'var(--radius-sm)',
                                background: 'rgba(16, 185, 129, 0.06)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '0.86rem',
                                color: '#ffffff',
                              }}
                            >
                              <CheckCircle2 size={16} color="#34d399" />
                              {chk}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: GROUNDED AI Q&A ASSISTANT */}
              {activeTab === 'qa' && (
                <div>
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(168, 85, 247, 0.08)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    marginBottom: '20px',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                  }}>
                    <strong style={{ color: '#ffffff' }}>Grounded Document Assistant:</strong> Answers are retrieved strictly from the document content with verbatim excerpt citations. Answers will state "Not found" rather than inventing facts.
                  </div>

                  {/* Sample Prompt Chips */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '8px' }}>
                      Suggested Questions for this Document:
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(() => {
                        const docType = docDetail?.document_type?.toUpperCase();
                        const cat = (docDetail?.extracted_data?.document_category || '').toLowerCase();
                        const title = (docDetail?.extracted_data?.document_title || docDetail?.filename || '').toLowerCase();

                        if (cat.includes('railway') || cat.includes('train') || title.includes('electronic reservation slip') || title.includes('ers') || title.includes('4953281463')) {
                          return [
                            'Who is travelling in the train?',
                            'What is the PNR?',
                            'What is the train number and name?',
                            'What is the route?',
                            'What is the total fare?',
                            'What are the departure and arrival times?',
                            'What is the waitlist cancellation rule?',
                          ];
                        }
                        if (cat.includes('flight') || cat.includes('airline') || title.includes('boarding pass') || title.includes('flight')) {
                          return [
                            'Who is the passenger?',
                            'What is the flight number?',
                            'What is the PNR or booking reference?',
                            'What are the departure and arrival times?',
                            'What is the baggage allowance?',
                            'What is the total fare paid?',
                          ];
                        }
                        if (cat.includes('medical') || cat.includes('clinical') || cat.includes('health') || title.includes('medical') || title.includes('patient')) {
                          return [
                            'Who is the patient?',
                            'What is the clinical assessment or diagnosis?',
                            'What medication was prescribed?',
                            'Who is the attending physician?',
                            'What are the follow-up instructions?',
                          ];
                        }
                        if (cat.includes('bank') || cat.includes('financial') || title.includes('bank') || title.includes('statement')) {
                          return [
                            'Who is the account holder?',
                            'What is the account number?',
                            'What is the closing balance?',
                            'What is the statement period?',
                            'What are the total deposits?',
                          ];
                        }
                        if (docType === 'RESUME') {
                          return [
                            'Who is the candidate?',
                            'What is his education and CGPA?',
                            'What projects has he worked on?',
                            'What technical skills does he have?',
                            'What is his professional experience?',
                            'What is his contact info and phone number?',
                          ];
                        }
                        if (cat.includes('booking') || cat.includes('hotel') || title.includes('booking')) {
                          return [
                            'Who is the guest?',
                            'What is the PIN Code?',
                            'What is the total price?',
                            'What are check-in and check-out dates?',
                            'Is parking free?',
                            'What is the cancellation policy?',
                          ];
                        }
                        if (docType === 'INVOICE') {
                          return [
                            'What is the total amount due?',
                            'Who is the vendor and customer?',
                            'What is the due date?',
                            'What tax or GST is applied?',
                            'What are the line items?',
                          ];
                        }
                        if (docType === 'CONTRACT') {
                          return [
                            'Who are the contracting parties?',
                            'What is the contract value?',
                            'What is the governing law?',
                            'What are the key terms?',
                          ];
                        }
                        return [
                          'Summarize this document',
                          'Who are the primary entities?',
                          'What are the primary findings?',
                          'What are the key dates?',
                          'What are the financial metrics?',
                          'What are the key takeaways?',
                        ];
                      })().map((chip) => (
                        <button
                          key={chip}
                          onClick={() => handleAskQA(chip)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-subtle)',
                            color: 'var(--text-muted)',
                            padding: '6px 12px',
                            borderRadius: '999px',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* QA Conversation Stream */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px', maxHeight: '420px', overflowY: 'auto' }}>
                    {qaHistory.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
                        No questions asked yet. Type a question below or pick a suggestion above.
                      </div>
                    ) : (
                      qaHistory.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {/* Question */}
                          <div style={{
                            alignSelf: 'flex-end',
                            background: 'rgba(14, 165, 233, 0.2)',
                            border: '1px solid rgba(14, 165, 233, 0.4)',
                            padding: '10px 16px',
                            borderRadius: '12px 12px 2px 12px',
                            color: '#ffffff',
                            fontSize: '0.9rem',
                            maxWidth: '85%',
                          }}>
                            {item.q}
                          </div>

                          {/* Answer */}
                          <div style={{
                            alignSelf: 'flex-start',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-subtle)',
                            padding: '14px 18px',
                            borderRadius: '12px 12px 12px 2px',
                            color: '#ffffff',
                            fontSize: '0.9rem',
                            maxWidth: '92%',
                          }}>
                            <FormattedAnswer text={item.a.answer} />

                            {/* Citations */}
                            {item.a.citations && item.a.citations.length > 0 && (
                              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                                  Verified Source Excerpt:
                                </div>
                                {item.a.citations.map((c, cIdx) => (
                                  <div
                                    key={cIdx}
                                    style={{
                                      padding: '8px 12px',
                                      borderRadius: 'var(--radius-sm)',
                                      background: 'rgba(0, 0, 0, 0.3)',
                                      border: '1px solid rgba(56, 189, 248, 0.2)',
                                      fontFamily: 'var(--font-mono)',
                                      fontSize: '0.78rem',
                                      color: '#93c5fd',
                                    }}
                                  >
                                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>[{c.page_or_section || 'Document'}]:</span> "{c.excerpt}"
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Ask Question Form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAskQA();
                    }}
                    style={{ display: 'flex', gap: '10px' }}
                  >
                    <input
                      type="text"
                      placeholder="Ask any question about this document..."
                      value={qaQuestion}
                      onChange={(e) => setQaQuestion(e.target.value)}
                      style={{
                        flex: 1,
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        padding: '12px 16px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={qaLoading || !qaQuestion.trim()}
                      style={{ padding: '0 20px' }}
                    >
                      {qaLoading ? 'Analyzing...' : 'Ask AI'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: AUDIT TRAIL */}
              {activeTab === 'audit' && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '16px', color: '#ffffff' }}>Chronological Processing Audit</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {docDetail.logs.map((l, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: l.status === 'success' ? '#34d399' : l.status === 'failed' ? '#f87171' : '#fbbf24',
                            }}>
                              {l.stage}
                            </span>
                            <span className={`badge ${l.status === 'success' ? 'badge-verified' : 'badge-review'}`} style={{ fontSize: '0.65rem' }}>
                              {l.status}
                            </span>
                          </div>
                          {l.message && (
                            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                              {l.message}
                            </div>
                          )}
                        </div>

                        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {l.latency_ms !== null && (
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#38bdf8' }}>
                              {l.latency_ms}ms
                            </div>
                          )}
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {new Date(l.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: RAW EXTRACTED TEXT */}
              {activeTab === 'raw' && (
                <div>
                  <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', color: '#ffffff' }}>Extracted Document Text</h3>
                  <pre style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    color: '#e2e8f0',
                    maxHeight: '480px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.6',
                  }}>
                    {rawText || 'Loading text...'}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
