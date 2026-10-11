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
        maxWidth: '1200px',
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
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          color: 'var(--accent-cyan)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '24px',
        }}>
          <Sparkles size={16} />
          Enterprise Document Intelligence & Automation
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
          lineHeight: '1.12',
          marginBottom: '24px',
          color: '#ffffff',
          fontWeight: 800,
        }}>
          Turn Unstructured Documents<br />
          <span style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Into Verified Decisions.
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-muted)',
          maxWidth: '780px',
          margin: '0 auto 36px auto',
          lineHeight: '1.6',
        }}>
          DocSmart AI transforms invoices, contracts, and candidate resumes into validated, audit-ready data. Powered by bounded LLM extraction, deterministic arithmetic verification, and grounded citations.
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
            Try the Interactive Demo <ArrowRight size={18} />
          </button>

          <button
            className="btn-secondary"
            style={{ padding: '14px 24px', fontSize: '1.02rem' }}
            onClick={onLoadSamples}
          >
            <ShieldCheck size={18} color="var(--accent-cyan)" />
            Load Sample Suite (1-Click)
          </button>
        </div>

        {/* Live Metrics Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          maxWidth: '960px',
          margin: '0 auto',
        }}>
          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Validation Mode</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-verified-text)', marginTop: '4px' }}>Fail-Closed</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Never guesses missing values</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Deterministic Rules</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>Subtotal + Tax = Total</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Strict mathematical verification</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Document Q&A</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>Verbatim Citations</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Zero hallucinated page references</div>
          </div>

          <div className="glass-panel" style={{ padding: '20px', textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Downstream Hand-off</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>HMAC Webhook</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>n8n / ERP ready with signatures</div>
          </div>
        </div>
      </section>

      {/* The Business Problem Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>
            The Enterprise Document Problem
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            Enterprises receive thousands of varied invoices, MSAs, and intake forms monthly. Manual handling introduces four critical operational bottlenecks:
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
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Silent Arithmetic Errors</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Standard OCR and basic LLM prompts often extract rounded totals while ignoring mismatched line-item additions or tax calculations.
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
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Manual Re-Keying Overhead</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Operations and AP teams spend hundreds of hours manually reading PDFs and typing vendor names, invoice numbers, and line items into ERPs.
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
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Hallucinated Citations</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Generic AI chatbots make up clause numbers or dates when answering inquiries. Enterprise legal ops require non-negotiable verbatim proof.
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
            <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>Zero Audit Visibility</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Black-box processing leaves no record of who extracted what, at what timestamp, and with what latency or validation flags.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Workflow Architecture Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '8px' }}>
            End-To-End Architecture
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>
            How DocSmart AI Operates
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            A deterministic, fail-closed pipeline with explicit state machine transitions and complete stage audit logging.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '36px', overflowX: 'auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '900px',
            gap: '12px',
          }}>
            {/* Step 1 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}>
                <FileCheck2 size={22} color="#38bdf8" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>1. Ingestion</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>SHA-256 Deduplication & Type Validation</div>
            </div>

            <ArrowRight size={20} color="var(--border-medium)" />

            {/* Step 2 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
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
                <Search size={22} color="#c084fc" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>2. OCR / Parse</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Fast Native PDF + Tesseract Fallback</div>
            </div>

            <ArrowRight size={20} color="var(--border-medium)" />

            {/* Step 3 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(14, 165, 233, 0.15)',
                border: '1px solid #0ea5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
              }}>
                <Cpu size={22} color="#0ea5e9" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>3. AI Classify</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Bounded 4-Type Schema Selection</div>
            </div>

            <ArrowRight size={20} color="var(--border-medium)" />

            {/* Step 4 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
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
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Deterministic Math & Date Validation</div>
            </div>

            <ArrowRight size={20} color="var(--border-medium)" />

            {/* Step 5 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
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
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>5. Automation</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>HMAC Webhook to n8n / ERP Hub</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>
            Built for High-Stakes Enterprise Scenarios
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            Designed specifically for consulting deliverables and enterprise AI production deployments.
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
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <FileText size={20} color="#38bdf8" />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Accounts Payable (Invoices)</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Extracts vendor name, invoice number, issue/due dates, subtotal, tax, and individual itemized line items. Automatically validates whether sum of line items matches subtotal, and subtotal + tax equals total amount.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              ✓ Deterministic mathematical check &nbsp;•&nbsp; ✓ CSV Export ready
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ShieldCheck size={20} color="#c084fc" />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Legal Operations (Contracts)</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Parses Party A, Party B, effective date, expiration date, annual contract value, and governing law. Flags chronological inversions and conflicting identical party signatures for legal compliance review.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              ✓ Entity identity validation &nbsp;•&nbsp; ✓ Date chronology checks
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(52, 211, 153, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Search size={20} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Grounded Q&A With Citations</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
              Ask questions in plain English: "What is the payment deadline?", "Who are the parties?", "What is the total amount?". Every response quotes the exact verbatim source text and section line reference.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              ✓ Zero hallucination &nbsp;•&nbsp; ✓ Verbatim quoted excerpts
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        maxWidth: '1200px',
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
            Ready to Experience DocSmart AI?
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 28px auto' }}>
            Explore the workspace, inspect real extracted schemas, review deterministic verification checks, and test natural language Q&A.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={onOpenWorkspace} style={{ padding: '12px 24px' }}>
              Open Document Workspace <ArrowRight size={16} />
            </button>
            <button className="btn-secondary" onClick={onLoadSamples} style={{ padding: '12px 20px' }}>
              Load Pre-Configured Test Suite
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
