import React from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Cpu,
  Layers,
  Database,
  Search,
  Lock,
  Workflow,
  Sparkles,
  BarChart,
  FileCheck2,
  Award,
  Ticket,
  GraduationCap,
} from 'lucide-react';

interface LandingPageProps {
  onOpenWorkspace: () => void;
  onLoadSamples: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenWorkspace,
  onLoadSamples,
}) => {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Ambient Glows */}
      <div
        className="glow-orb"
        style={{
          top: '-100px',
          left: '20%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="glow-orb"
        style={{
          top: '30%',
          right: '-80px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.14) 0%, transparent 70%)',
        }}
      />

      {/* Hero Section */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '80px 24px 60px 24px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          color: 'var(--accent-cyan)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '24px',
        }}>
          <Sparkles size={16} />
          Universal Autonomous Document Intelligence Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
          lineHeight: '1.12',
          marginBottom: '24px',
          color: '#ffffff',
          fontWeight: 800,
        }}>
          Turn Any Unstructured Document<br />
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Into Verified Business Intelligence.
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-muted)',
          maxWidth: '820px',
          margin: '0 auto 36px auto',
          lineHeight: '1.6',
        }}>
          DocSmart AI autonomously ingests and parses any PDF, scanned image, credential, booking, invoice, contract, resume, or enterprise report with multi-tier OCR, zero-hallucination grounded extraction, deterministic integrity verification, and citation-backed Q&A.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '56px',
        }}>
          <button
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: '1.02rem' }}
            onClick={onOpenWorkspace}
          >
            Launch Enterprise Workspace <ArrowRight size={18} />
          </button>

          <button
            className="btn-secondary"
            style={{ padding: '14px 24px', fontSize: '1.02rem' }}
            onClick={onLoadSamples}
          >
            <Database size={18} color="var(--accent-cyan)" />
            Ingest Benchmark Corpus
          </button>
        </div>

        {/* Live Metrics Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Validation Engine</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--status-verified-text)', marginTop: '4px' }}>Deterministic Audit</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Zero fake guesses or placeholders</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Multi-Tier Ingestion</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>PDF & Scanned OCR</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Digital vectors + Windows native OCR</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Grounded Intelligence</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>Verbatim Citations</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Line-level source verification</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Autonomous Hand-off</div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>Signed Webhooks</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>n8n, Zapier & ERP API dispatch</div>
          </div>
        </div>
      </section>

      {/* The Enterprise Document Problem */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>
            The Enterprise Document Problem
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto' }}>
            Organizations process diverse unstructured files every day—from commercial contracts and invoices to credentials and travel itineraries. Manual processing introduces four critical bottlenecks:
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <AlertTriangle size={22} color="#f87171" />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Silent Hallucinations</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Standard LLM prompts invent dummy companies, Delaware laws, or fake numbers when fields are missing. DocSmart AI strictly grounds extractions in verbatim text.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <FileText size={22} color="#fbbf24" />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Scanned & Mixed Format Failures</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Basic tools crash when given image-only receipts or scanned tickets. DocSmart uses automatic rasterization and high-speed native OCR to ingest any image or PDF.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <Search size={22} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Unverifiable Answers</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Generic chatbots answer questions without citing where in the document facts came from. DocSmart delivers verbatim quoted excerpts with exact line numbers.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}>
              <Lock size={22} color="#c084fc" />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Compliance & Audit Blindspots</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Enterprise legal and finance operations require complete transparency: immutable cryptographic content hashes, stage latency logs, and automated consistency checks.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Workflow Architecture Section */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        <div className="glass-panel" style={{ padding: '48px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              End-to-End Pipeline
            </div>
            <h2 style={{ fontSize: '2rem' }}>How DocSmart AI Processes Any Document</h2>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            {/* Step 1 */}
            <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(14, 165, 233, 0.15)',
                border: '1px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}>
                <FileText size={22} color="#38bdf8" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>1. Ingestion</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>PDF, Scan, PNG, JPG, Text</div>
            </div>

            <ArrowRight size={20} color="var(--border-medium)" />

            {/* Step 2 */}
            <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid #818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}>
                <Cpu size={22} color="#818cf8" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>2. OCR Extraction</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Native Vectors + Hardware OCR</div>
            </div>

            <ArrowRight size={20} color="var(--border-medium)" />

            {/* Step 3 */}
            <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid #c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}>
                <Layers size={22} color="#c084fc" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>3. Dynamic Classification</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Zero-Hallucination Schema</div>
            </div>

            <ArrowRight size={20} color="var(--border-medium)" />

            {/* Step 4 */}
            <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}>
                <ShieldCheck size={22} color="#34d399" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>4. Verification</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Deterministic Math & Date Logic</div>
            </div>

            <ArrowRight size={20} color="var(--border-medium)" />

            {/* Step 5 */}
            <div style={{ textAlign: 'center', flex: 1, minWidth: '150px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}>
                <Workflow size={22} color="#fbbf24" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>5. Integration</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Signed Webhooks & CSV/JSON Export</div>
            </div>
          </div>
        </div>
      </section>

      {/* Universal Document Domains */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>
            Built for Any Document, Across Every Domain
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto' }}>
            DocSmart AI natively handles the entire spectrum of modern digital and scanned documents:
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}>
          {/* Card 1 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Award size={20} color="#c084fc" />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Professional Certifications & Degrees</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              AWS, Oracle, Microsoft, Google Cloud, and university degrees. Extracts awardee name, accreditation title, issuing body, verification hex/alphanumeric code, issue date, and validity period.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              ✓ Validation code verified &nbsp;•&nbsp; ✓ Direct portal link extraction
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Ticket size={20} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Travel, Transit & Event Passes</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Booking.com confirmations, railway reservation slips (IRCTC), temple darshan receipts (TTD), and summit passes. Extracts PNRs, booking IDs, reporting venues, attendees, and prices with taxes.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              ✓ Multi-passenger parsing &nbsp;•&nbsp; ✓ Schedule chronology check
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FileText size={20} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Invoices, Bills & Commercial Receipts</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Vendor name, invoice number, issue and payment due dates, subtotal, GST/tax, and itemized line items. Automatically validates whether line item additions match subtotal and subtotal + tax equals total.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              ✓ Arithmetic consistency check &nbsp;•&nbsp; ✓ Line-item verification
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShieldCheck size={20} color="#fbbf24" />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Contracts, NDAs & Legal Covenants</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Identifies Party A, Party B, effective date, expiration date, consideration valuation, and governing jurisdiction. Protects against inverted dates and conflicting party signatures.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              ✓ Legal entity validation &nbsp;•&nbsp; ✓ Jurisdiction mapping
            </div>
          </div>

          {/* Card 5 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(236, 72, 153, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <GraduationCap size={20} color="#f472b6" />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Resumes, CVs & Candidate Profiles</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Catalogs candidate name, direct email and phone contact details, education history, years of experience, and complete technical skill taxonomy with zero data loss.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              ✓ Full skill taxonomy &nbsp;•&nbsp; ✓ Academic credential parsing
            </div>
          </div>

          {/* Card 6 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Search size={20} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.2rem' }}>Grounded Q&A With Verbatim Citations</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Ask any natural language question about any uploaded document. Every single response provides the exact excerpt and section line reference without hallucinated references.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              ✓ Verbatim proof quoting &nbsp;•&nbsp; ✓ Line-by-line attribution
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '40px 24px 80px 24px',
      }}>
        <div className="glass-panel" style={{
          padding: '48px 36px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
          borderColor: 'rgba(56, 189, 248, 0.3)',
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>
            Experience Autonomous Enterprise Document Processing
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 28px auto' }}>
            Upload any document or PDF to inspect extracted schemas, verify deterministic business logic, and query your data via citation-grounded natural language Q&A.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onOpenWorkspace} style={{ padding: '12px 26px' }}>
              Open Document Workspace <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={onLoadSamples} style={{ padding: '12px 20px' }}>
              Ingest Benchmark Corpus
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
