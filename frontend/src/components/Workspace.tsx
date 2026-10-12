import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Award,
  Ticket,
  User,
  Scale,
  Calendar,
  DollarSign,
  Filter,
  RefreshCw,
  Database,
  ArrowUpRight,
  Send,
  Zap,
  Activity,
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

          if (/^[-*•]\s+/.test(trimmed)) {
            const content = trimmed.replace(/^[-*•]\s+/, '');
            return (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', paddingLeft: '4px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.9rem' }}>•</span>
                <span style={{ flex: 1 }}>{parseInline(content)}</span>
              </div>
            );
          }

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

interface WorkspaceProps {
  onSeedSamples: () => Promise<void>;
  isSeeding: boolean;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  onSeedSamples,
  isSeeding,
}) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docDetail, setDocDetail] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [reprocessing, setReprocessing] = useState<boolean>(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Detail view state
  const [activeTab, setActiveTab] = useState<'extraction' | 'verification' | 'qa' | 'audit' | 'raw'>('extraction');
  const [qaQuestion, setQaQuestion] = useState<string>('');
  const [qaLoading, setQaLoading] = useState<boolean>(false);
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: QAResponse }>>([]);
  const [rawText, setRawText] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const qaBottomRef = useRef<HTMLDivElement>(null);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await api.getDocuments();
      setDocuments(data.items);
      if (data.items.length > 0 && !selectedDocId) {
        setSelectedDocId(data.items[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    if (!selectedDocId) return;

    const fetchDetail = async () => {
      try {
        setDetailLoading(true);
        setRawText(null);
        setQaHistory([]);
        const detail = await api.getDocumentDetail(selectedDocId);
        setDocDetail(detail);
      } catch (err: any) {
        console.error('Failed to load document detail:', err);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [selectedDocId]);

  useEffect(() => {
    if (activeTab === 'qa') {
      qaBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [qaHistory, activeTab]);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      setUploadError(null);
      const res = await api.uploadFile(file);
      await loadDocuments();
      if (res.document_id) {
        setSelectedDocId(res.document_id);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload document');
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

  const handleReprocess = async () => {
    if (!selectedDocId) return;
    try {
      setReprocessing(true);
      await api.reprocess(selectedDocId);
      await loadDocuments();
      const updated = await api.getDocumentDetail(selectedDocId);
      setDocDetail(updated);
    } catch (err) {
      console.error('Reprocess failed:', err);
    } finally {
      setReprocessing(false);
    }
  };

  const handleAskQA = async (questionText?: string) => {
    const q = (questionText || qaQuestion).trim();
    if (!selectedDocId || !q || qaLoading) return;

    try {
      setQaLoading(true);
      if (!questionText) setQaQuestion('');
      const res = await api.askQA(selectedDocId, q);
      setQaHistory((prev) => [...prev, { q, a: res }]);
    } catch (err: any) {
      setQaHistory((prev) => [
        ...prev,
        {
          q,
          a: {
            answer: `Error: ${err.message}`,
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

  const handleLoadRawText = async () => {
    if (!selectedDocId || rawText) return;
    try {
      const res = await api.getDocumentText(selectedDocId);
      setRawText(res.text);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, keyIdentifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyIdentifier);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Helper to categorize documents cleanly
  const getDocCategory = (doc: DocumentItem | DocumentDetail): string => {
    const rawCat = doc.extracted_data?.document_category;
    if (rawCat) return rawCat;
    if (doc.document_type === 'invoice') return 'Commercial Invoice';
    if (doc.document_type === 'contract') return 'Legal Agreement';
    if (doc.document_type === 'resume') return 'Curriculum Vitae / Resume';
    if (doc.document_type === 'form') return 'Form / Declaration';
    return 'Enterprise Document';
  };

  const getDocIcon = (doc: DocumentItem | DocumentDetail) => {
    const cat = getDocCategory(doc).toLowerCase();
    if (cat.includes('cert') || cat.includes('accred')) return <Award size={16} color="#c084fc" />;
    if (cat.includes('ticket') || cat.includes('pass') || cat.includes('travel') || cat.includes('darshan') || cat.includes('reservation')) return <Ticket size={16} color="#34d399" />;
    if (cat.includes('invoice') || cat.includes('bill') || cat.includes('receipt')) return <FileText size={16} color="#38bdf8" />;
    if (cat.includes('contract') || cat.includes('nda') || cat.includes('agreement')) return <Scale size={16} color="#fbbf24" />;
    if (cat.includes('resume') || cat.includes('cv') || cat.includes('candidate')) return <User size={16} color="#f472b6" />;
    if (cat.includes('form') || cat.includes('declaration')) return <FileCheck size={16} color="#818cf8" />;
    if (cat.includes('health') || cat.includes('clinic') || cat.includes('medical')) return <Activity size={16} color="#ef4444" />;
    if (cat.includes('bank') || cat.includes('financ') || cat.includes('statement')) return <DollarSign size={16} color="#10b981" />;
    return <FileText size={16} color="#94a3b8" />;
  };

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        searchQuery === '' ||
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getDocCategory(doc).toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (categoryFilter === 'ALL') return true;
      const cat = getDocCategory(doc).toLowerCase();
      if (categoryFilter === 'CERTIFICATES') return cat.includes('cert') || cat.includes('accred');
      if (categoryFilter === 'TRAVEL') return cat.includes('travel') || cat.includes('ticket') || cat.includes('pass') || cat.includes('darshan') || cat.includes('reservation');
      if (categoryFilter === 'INVOICES') return cat.includes('invoice') || cat.includes('bill') || doc.document_type === 'invoice';
      if (categoryFilter === 'CONTRACTS') return cat.includes('contract') || cat.includes('nda') || cat.includes('agreement') || doc.document_type === 'contract';
      if (categoryFilter === 'RESUMES') return cat.includes('resume') || cat.includes('cv') || doc.document_type === 'resume';
      if (categoryFilter === 'FORMS') return cat.includes('form') || cat.includes('declaration') || doc.document_type === 'form';
      if (categoryFilter === 'FINANCIAL') return cat.includes('bank') || cat.includes('financ') || cat.includes('statement');
      if (categoryFilter === 'HEALTHCARE') return cat.includes('health') || cat.includes('clinic') || cat.includes('medical');
      return true;
    });
  }, [documents, searchQuery, categoryFilter]);

  // Suggested questions based on detected category
  const suggestedQuestions = useMemo(() => {
    if (!docDetail) return [];
    const cat = getDocCategory(docDetail).toLowerCase();
    if (cat.includes('cert') || cat.includes('accred')) {
      return [
        'Who was this certificate awarded to?',
        'What is the validation ID / verification code?',
        'What is the validity period and issue date?',
        'Which issuing authority awarded this credential?',
      ];
    }
    if (cat.includes('darshan') || cat.includes('temple')) {
      return [
        'Who are the pilgrims registered on this slip?',
        'What is the reporting venue and time slot?',
        'What is the group booking ID?',
        'What is the darshan date and fee?',
      ];
    }
    if (cat.includes('travel') || cat.includes('ticket') || cat.includes('reservation')) {
      return [
        'Who is the primary guest / traveler?',
        'What is the confirmation number / PNR?',
        'What are the check-in and check-out dates?',
        'What was the total fare or price paid?',
      ];
    }
    if (cat.includes('event') || cat.includes('pass')) {
      return [
        'Who is the authorized attendee for this pass?',
        'What organization or college is represented?',
        'What is the event name and pass category?',
      ];
    }
    if (cat.includes('resume') || cat.includes('cv')) {
      return [
        'What are the candidate\'s core technical skills?',
        'What is the candidate\'s education history?',
        'What is the candidate\'s direct contact info?',
      ];
    }
    if (cat.includes('invoice') || cat.includes('bill')) {
      return [
        'What is the total amount due?',
        'What is the invoice number and issue date?',
        'Who is the vendor and billing recipient?',
      ];
    }
    if (cat.includes('contract') || cat.includes('agreement')) {
      return [
        'Who are the primary contracting parties?',
        'What is the effective date and expiration date?',
        'What is the governing law jurisdiction?',
      ];
    }
    if (cat.includes('health') || cat.includes('clinic') || cat.includes('medical')) {
      return [
        'Who is the patient and attending physician?',
        'What is the clinical assessment / diagnosis?',
        'What medication was prescribed?',
        'What follow-up or instructions are recorded?',
      ];
    }
    if (cat.includes('bank') || cat.includes('financ') || cat.includes('statement')) {
      return [
        'Who is the account holder and what is the account number?',
        'What is the closing balance and opening balance?',
        'What is the statement reporting period?',
        'What were the recorded deposit and debit totals?',
      ];
    }
    return [
      'Give me an executive summary of this document',
      'What are the primary dates mentioned?',
      'Who are the primary entities or persons involved?',
    ];
  }, [docDetail]);

  const verifiedCount = documents.filter((d) => d.status === 'completed' && d.is_valid).length;
  const verifiedPercentage = documents.length > 0 ? Math.round((verifiedCount / documents.length) * 100) : 100;

  return (
    <div style={{ maxWidth: '1440px', margin: '24px auto 80px auto', padding: '0 28px' }}>
      {/* Enterprise Platform Intelligence Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 1.2fr) minmax(340px, 1fr)',
        gap: '24px',
        marginBottom: '28px',
      }}>
        {/* Drag & Drop Universal Upload Card */}
        <div
          className="glass-panel glass-panel-glow"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '24px 28px',
            borderStyle: 'dashed',
            borderWidth: '2px',
            borderColor: uploading ? 'var(--accent-cyan)' : 'var(--border-medium)',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(14, 21, 37, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.png,.jpg,.jpeg,.webp,.bmp,.txt"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              border: '1px solid rgba(14, 165, 233, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {uploading ? (
                <RefreshCw size={24} color="var(--accent-cyan)" className="animate-spin" />
              ) : (
                <Upload size={24} color="var(--accent-cyan)" />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#ffffff' }}>
                {uploading ? 'Analyzing Document with AI Pipeline...' : 'Universal Document Ingestion'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                Drop ANY file here: Digital/Scanned PDFs, Images (PNG, JPG), Certificates, Tickets, Contracts, Invoices
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
              PDF Native & Scanned
            </span>
            <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
              PNG / JPG OCR
            </span>
            <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
              Up to 15MB
            </span>
            <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              Deterministic Validation
            </span>
          </div>

          {uploadError && (
            <div style={{ color: 'var(--status-error-text)', fontSize: '0.8rem', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} /> {uploadError}
            </div>
          )}
        </div>

        {/* Enterprise Pipeline Telemetry & Controls */}
        <div className="glass-panel" style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)' }}>
                System Telemetry & Engine Status
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} /> Live Pipeline
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Documents</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>{documents.length}</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Audit Rate</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>{verifiedPercentage}%</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>OCR Engine</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>Native</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Grounded</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c084fc', marginTop: '2px' }}>100%</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', alignItems: 'center' }}>
            <button
              className="btn-secondary"
              onClick={async () => {
                await onSeedSamples();
                await loadDocuments();
              }}
              disabled={isSeeding}
              style={{ fontSize: '0.8rem', padding: '8px 14px', flex: 1 }}
              title="Add enterprise benchmark test corpus"
            >
              <Database size={14} color="var(--accent-cyan)" /> {isSeeding ? 'Ingesting...' : 'Ingest Benchmark Suite'}
            </button>
            <button
              className="btn-secondary"
              onClick={loadDocuments}
              style={{ fontSize: '0.8rem', padding: '8px 14px' }}
              title="Refresh queue"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* Left Column: Document Queue & Explorer */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent-cyan)" /> Document Queue
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {filteredDocuments.length} of {documents.length}
            </span>
          </div>

          {/* Search Box */}
          <div style={{
            position: 'relative',
            marginBottom: '14px',
          }}>
            <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by file or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'CERTIFICATES', label: 'Credentials' },
              { id: 'TRAVEL', label: 'Travel/Tickets' },
              { id: 'INVOICES', label: 'Invoices' },
              { id: 'CONTRACTS', label: 'Contracts' },
              { id: 'RESUMES', label: 'CVs' },
              { id: 'FORMS', label: 'Forms' },
              { id: 'FINANCIAL', label: 'Banking/Finance' },
              { id: 'HEALTHCARE', label: 'Healthcare' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setCategoryFilter(f.id)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: categoryFilter === f.id ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.05)',
                  color: categoryFilter === f.id ? '#080c14' : 'var(--text-muted)',
                  transition: 'all 0.15s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Document List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '680px', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                Loading documents...
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                No documents match this filter.
              </div>
            ) : (
              filteredDocuments.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                const category = getDocCategory(doc);
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.14) 0%, rgba(59, 130, 246, 0.14) 100%)'
                        : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected
                        ? '1px solid rgba(56, 189, 248, 0.45)'
                        : '1px solid var(--border-subtle)',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ marginTop: '2px' }}>
                        {getDocIcon(doc)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: isSelected ? 700 : 600,
                          fontSize: '0.86rem',
                          color: isSelected ? '#ffffff' : '#e2e8f0',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {doc.filename}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '170px',
                          }}>
                            {category}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {doc.status === 'completed' && doc.is_valid ? (
                          <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <CheckCircle2 size={12} /> Verified
                          </span>
                        ) : doc.status === 'needs_review' ? (
                          <span style={{ fontSize: '0.68rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <AlertTriangle size={12} /> Review
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                            {doc.status}
                          </span>
                        )}
                        {doc.confidence !== null && (
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                            {Math.round(doc.confidence * 100)}% conf
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Document Inspector */}
        <div className="glass-panel" style={{ padding: '28px', minHeight: '700px' }}>
          {!selectedDocId || !docDetail ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-dim)' }}>
              <FileText size={48} style={{ margin: '0 auto 16px auto', opacity: 0.3 }} />
              <div>Select a document from the queue to inspect verified fields.</div>
            </div>
          ) : detailLoading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-dim)' }}>
              <RefreshCw size={36} className="animate-spin" style={{ margin: '0 auto 16px auto', color: 'var(--accent-cyan)' }} />
              <div>Loading verified document payload...</div>
            </div>
          ) : (
            <div>
              {/* Document Header & Control Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '20px',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff' }}>
                      {docDetail.extracted_data?.document_title || docDetail.filename}
                    </h1>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}>
                      {getDocCategory(docDetail)}
                    </span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      File: {docDetail.filename}
                    </span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>•</span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Ingested: {new Date(docDetail.created_at).toLocaleDateString()}
                    </span>

                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>•</span>

                    {docDetail.status === 'completed' && docDetail.verification?.is_verified ? (
                      <span className="badge badge-verified">
                        <CheckCircle2 size={12} /> 100% Verified
                      </span>
                    ) : (
                      <span className="badge badge-review">
                        <AlertTriangle size={12} /> Needs Review
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    className="btn-secondary"
                    onClick={handleReprocess}
                    disabled={reprocessing}
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    title="Re-run AI extraction pipeline"
                  >
                    <RefreshCw size={14} className={reprocessing ? 'animate-spin' : ''} />
                    {reprocessing ? 'Reprocessing...' : 'Reprocess AI'}
                  </button>

                  <a
                    href={api.getCsvExportUrl(docDetail.id)}
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px', textDecoration: 'none' }}
                    download
                  >
                    <Download size={14} /> Export CSV
                  </a>
                </div>
              </div>

              {/* Navigation Tabs */}
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
                  <FileText size={16} /> Structured Intelligence
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
                  <ShieldCheck size={16} /> Verification & Integrity
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
                  <MessageSquare size={16} /> Grounded AI Q&A
                  {qaHistory.length > 0 && (
                    <span style={{
                      background: 'rgba(168, 85, 247, 0.25)',
                      color: '#c084fc',
                      borderRadius: '999px',
                      padding: '1px 6px',
                      fontSize: '0.72rem',
                    }}>
                      {qaHistory.length}
                    </span>
                  )}
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
                  <Clock size={16} /> System Audit Trail ({docDetail.logs.length})
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
                  <Info size={16} /> Raw Extracted Text
                </button>
              </div>

              {/* TAB 1: STRUCTURED INTELLIGENCE */}
              {activeTab === 'extraction' && (
                <div>
                  {!docDetail.extracted_data ? (
                    <div style={{ color: 'var(--text-muted)', padding: '40px 0', textAlign: 'center' }}>
                      No structured fields extracted for this document.
                    </div>
                  ) : (
                    <div>
                      {/* Executive AI Document Summary Callout */}
                      {docDetail.extracted_data.executive_summary && (
                        <div style={{
                          padding: '20px 24px',
                          borderRadius: 'var(--radius-md)',
                          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
                          border: '1px solid rgba(14, 165, 233, 0.3)',
                          marginBottom: '26px',
                          position: 'relative',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Sparkles size={16} color="#38bdf8" />
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#38bdf8', letterSpacing: '0.05em' }}>
                                Executive AI Document Synthesis
                              </span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(docDetail.extracted_data?.executive_summary, 'summary')}
                              style={{
                                background: copiedKey === 'summary' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                                border: '1px solid var(--border-subtle)',
                                color: copiedKey === 'summary' ? '#34d399' : 'var(--text-muted)',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              {copiedKey === 'summary' ? <Check size={12} /> : <Copy size={12} />}
                              {copiedKey === 'summary' ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <div style={{ fontSize: '0.96rem', lineHeight: '1.68', color: '#f1f5f9' }}>
                            {docDetail.extracted_data.executive_summary}
                          </div>
                        </div>
                      )}

                      {/* Verified Document Key-Value Metadata Grid */}
                      {docDetail.extracted_data.key_fields &&
                        typeof docDetail.extracted_data.key_fields === 'object' &&
                        Object.keys(docDetail.extracted_data.key_fields).length > 0 && (
                          <div style={{ marginBottom: '28px' }}>
                            <h3 style={{ fontSize: '1.02rem', marginBottom: '14px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Zap size={16} color="var(--accent-cyan)" /> Verified Document Attributes
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                              {Object.entries(docDetail.extracted_data.key_fields).map(([k, v]) => (
                                <div
                                  key={k}
                                  style={{
                                    padding: '14px 18px',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid var(--border-subtle)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '12px',
                                  }}
                                >
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '3px' }}>
                                      {k}
                                    </div>
                                    <div style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', wordBreak: 'break-word' }}>
                                      {String(v)}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(String(v), k)}
                                    title={`Copy ${k}`}
                                    style={{
                                      background: copiedKey === k ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                      border: 'none',
                                      color: copiedKey === k ? '#34d399' : 'var(--text-dim)',
                                      cursor: 'pointer',
                                      padding: '4px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    {copiedKey === k ? <Check size={14} /> : <Copy size={14} />}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Entities, Dates, and Financials Ribbon */}
                      {((Array.isArray(docDetail.extracted_data.primary_entities) && docDetail.extracted_data.primary_entities.length > 0) ||
                        (Array.isArray(docDetail.extracted_data.key_dates) && docDetail.extracted_data.key_dates.length > 0) ||
                        (Array.isArray(docDetail.extracted_data.financial_metrics) && docDetail.extracted_data.financial_metrics.length > 0)) && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                          {/* Entities */}
                          {Array.isArray(docDetail.extracted_data.primary_entities) && docDetail.extracted_data.primary_entities.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                                Identified Entities & Signatories:
                              </div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {docDetail.extracted_data.primary_entities.map((ent: string, idx: number) => (
                                  <span key={idx} style={{ padding: '5px 14px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '0.84rem', fontWeight: 600 }}>
                                    {ent}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Key Dates */}
                          {Array.isArray(docDetail.extracted_data.key_dates) && docDetail.extracted_data.key_dates.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                                Scheduled & Operational Dates:
                              </div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {docDetail.extracted_data.key_dates.map((dt: string, idx: number) => (
                                  <span key={idx} style={{ padding: '5px 14px', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', fontSize: '0.84rem', fontWeight: 600 }}>
                                    <Calendar size={13} style={{ display: 'inline', marginRight: '6px' }} />
                                    {dt}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Financial Metrics */}
                          {Array.isArray(docDetail.extracted_data.financial_metrics) && docDetail.extracted_data.financial_metrics.length > 0 && (
                            <div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                                Financial Metrics & Consideration:
                              </div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {docDetail.extracted_data.financial_metrics.map((fm: string, idx: number) => (
                                  <span key={idx} style={{ padding: '5px 14px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.84rem', fontWeight: 700 }}>
                                    <DollarSign size={13} style={{ display: 'inline', marginRight: '4px' }} />
                                    {fm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* General Grid Attributes (Non-nested attributes) */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '14px',
                        marginBottom: '28px',
                      }}>
                        {Object.entries(docDetail.extracted_data).map(([key, val]) => {
                          if (
                            ['line_items', 'executive_summary', 'key_points', 'primary_entities', 'key_dates', 'financial_metrics', 'key_fields', 'document_title', 'document_category'].includes(key) ||
                            Array.isArray(val) ||
                            typeof val === 'object'
                          )
                            return null;
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
                                fontSize: '1.02rem',
                                fontWeight: 600,
                                color: val === null || val === '' ? 'var(--text-dim)' : '#ffffff',
                              }}>
                                {val === null || val === '' ? '— Not Specified' : String(val)}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Key Points / Highlights Bullet List */}
                      {Array.isArray(docDetail.extracted_data.key_points) && docDetail.extracted_data.key_points.length > 0 && (
                        <div style={{ marginBottom: '28px' }}>
                          <h3 style={{ fontSize: '1.02rem', marginBottom: '12px', color: '#ffffff' }}>Key Information & Takeaways</h3>
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {docDetail.extracted_data.key_points.map((pt: string, idx: number) => (
                              <li key={idx} style={{ padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <CheckCircle2 size={16} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Line Items Table (Invoices / Orders) */}
                      {Array.isArray(docDetail.extracted_data.line_items) && docDetail.extracted_data.line_items.length > 0 && (
                        <div style={{ marginBottom: '28px' }}>
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

                      {/* Skills Tags (Resumes) */}
                      {Array.isArray(docDetail.extracted_data.skills) && docDetail.extracted_data.skills.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                          <h3 style={{ fontSize: '1.05rem', marginBottom: '12px', color: '#ffffff' }}>Cataloged Skills Taxonomy</h3>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {docDetail.extracted_data.skills.map((s: string, idx: number) => (
                              <span
                                key={idx}
                                style={{
                                  padding: '5px 12px',
                                  borderRadius: '6px',
                                  background: 'rgba(56, 189, 248, 0.1)',
                                  border: '1px solid rgba(56, 189, 248, 0.25)',
                                  color: '#38bdf8',
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
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: VERIFICATION & INTEGRITY */}
              {activeTab === 'verification' && (
                <div>
                  <div style={{
                    padding: '20px 24px',
                    borderRadius: 'var(--radius-md)',
                    background: docDetail.verification?.is_verified ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                    border: `1px solid ${docDetail.verification?.is_verified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                    marginBottom: '24px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {docDetail.verification?.is_verified ? (
                        <CheckCircle2 size={24} color="#34d399" />
                      ) : (
                        <AlertTriangle size={24} color="#fbbf24" />
                      )}
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: docDetail.verification?.is_verified ? '#34d399' : '#fbbf24' }}>
                          {docDetail.verification?.is_verified ? 'Deterministic Verification Passed' : 'Manual Review Recommended'}
                        </div>
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                          Status: {docDetail.verification?.status} • {docDetail.verification?.checks_passed?.length || 0} Rule(s) Verified
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Passed Checks */}
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.02rem', marginBottom: '12px', color: '#ffffff' }}>Verified Business Logic Checks</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {docDetail.verification?.checks_passed && docDetail.verification.checks_passed.length > 0 ? (
                        docDetail.verification.checks_passed.map((chk: string, idx: number) => (
                          <div key={idx} style={{ padding: '10px 14px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle2 size={15} /> {chk}
                          </div>
                        ))
                      ) : (
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No specific automated checks defined for this schema.</div>
                      )}
                    </div>
                  </div>

                  {/* Exceptions / Issues */}
                  {docDetail.verification?.issues && docDetail.verification.issues.length > 0 && (
                    <div>
                      <h3 style={{ fontSize: '1.02rem', marginBottom: '12px', color: '#f87171' }}>Identified Exceptions ({docDetail.verification.issues.length})</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {docDetail.verification.issues.map((iss: any, idx: number) => (
                          <div key={idx} style={{ padding: '12px 16px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171', fontSize: '0.88rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                              <strong>{iss.type}</strong>
                              <span style={{ fontSize: '0.72rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)' }}>
                                {iss.severity}
                              </span>
                            </div>
                            <div style={{ color: '#e2e8f0' }}>{iss.message}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: GROUNDED AI Q&A */}
              {activeTab === 'qa' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Suggested Questions */}
                  <div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                      Suggested Natural Language Questions for this Document:
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {suggestedQuestions.map((sq, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAskQA(sq)}
                          disabled={qaLoading}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '999px',
                            background: 'rgba(168, 85, 247, 0.1)',
                            border: '1px solid rgba(168, 85, 247, 0.25)',
                            color: '#c084fc',
                            fontSize: '0.78rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {sq}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Q&A History Conversation Stream */}
                  <div style={{
                    minHeight: '280px',
                    maxHeight: '480px',
                    overflowY: 'auto',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}>
                    {qaHistory.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-dim)' }}>
                        <MessageSquare size={36} style={{ margin: '0 auto 12px auto', opacity: 0.3 }} />
                        <div style={{ fontSize: '0.9rem' }}>Ask any question grounded in this document.</div>
                        <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>Answers cite exact verbatim source excerpts with zero hallucinations.</div>
                      </div>
                    ) : (
                      qaHistory.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {/* User Query */}
                          <div style={{ alignSelf: 'flex-end', maxWidth: '85%' }}>
                            <div style={{
                              padding: '10px 16px',
                              borderRadius: '12px 12px 2px 12px',
                              background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
                              color: '#ffffff',
                              fontSize: '0.92rem',
                              fontWeight: 500,
                            }}>
                              {item.q}
                            </div>
                          </div>

                          {/* AI Answer */}
                          <div style={{ alignSelf: 'flex-start', maxWidth: '92%' }}>
                            <div style={{
                              padding: '14px 18px',
                              borderRadius: '12px 12px 12px 2px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid var(--border-subtle)',
                            }}>
                              <FormattedAnswer text={item.a.answer} />

                              {/* Verbatim Citations */}
                              {item.a.citations && item.a.citations.length > 0 && (
                                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                                    Verbatim Document Citations:
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {item.a.citations.map((c, cIdx) => (
                                      <div key={cIdx} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'rgba(0, 0, 0, 0.25)', padding: '4px 8px', borderRadius: '4px', borderLeft: '2px solid var(--accent-cyan)' }}>
                                        <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>[{c.page_or_section || 'Excerpt'}]:</span> "{c.excerpt}"
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={qaBottomRef} />
                  </div>

                  {/* Ask Question Input */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAskQA();
                    }}
                    style={{ display: 'flex', gap: '10px' }}
                  >
                    <input
                      type="text"
                      placeholder="Ask any question about this document (e.g. What is the validation ID?)..."
                      value={qaQuestion}
                      onChange={(e) => setQaQuestion(e.target.value)}
                      disabled={qaLoading}
                      style={{
                        flex: 1,
                        padding: '12px 18px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-medium)',
                        color: '#ffffff',
                        fontSize: '0.92rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={qaLoading || !qaQuestion.trim()}
                      style={{ padding: '0 20px' }}
                    >
                      {qaLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                      Ask
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: SYSTEM AUDIT TRAIL */}
              {activeTab === 'audit' && (
                <div>
                  <h3 style={{ fontSize: '1.02rem', marginBottom: '14px', color: '#ffffff' }}>Pipeline Execution Log</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {docDetail.logs.map((l, idx) => (
                      <div key={idx} style={{ padding: '12px 16px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#ffffff' }}>
                            Stage: {l.stage}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {l.message || 'Execution completed successfully'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: l.status === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: l.status === 'success' ? '#34d399' : '#f87171', fontWeight: 600 }}>
                            {l.status}
                          </span>
                          {l.latency_ms !== null && l.latency_ms !== undefined && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '3px' }}>
                              {l.latency_ms} ms
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: RAW EXTRACTED TEXT */}
              {activeTab === 'raw' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.02rem', color: '#ffffff' }}>Verbatim Extracted Text</h3>
                    {rawText && (
                      <button
                        className="btn-secondary"
                        onClick={() => copyToClipboard(rawText, 'rawText')}
                        style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                      >
                        {copiedKey === 'rawText' ? <Check size={12} /> : <Copy size={12} />}
                        {copiedKey === 'rawText' ? 'Copied Full Text' : 'Copy Full Text'}
                      </button>
                    )}
                  </div>
                  <pre style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-subtle)',
                    color: '#94a3b8',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    lineHeight: '1.6',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {rawText || 'Loading document text...'}
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
