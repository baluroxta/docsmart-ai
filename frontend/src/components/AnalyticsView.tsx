import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  ShieldAlert,
  Activity,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { AnalyticsData } from '../api';

interface AnalyticsViewProps {
  analytics: AnalyticsData | null;
  loading: boolean;
  onRefresh: () => void;
  onSeedSamples: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  loading,
  onRefresh,
  onSeedSamples,
}) => {
  if (loading && !analytics) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Calculating real-time analytics from database...</div>
      </div>
    );
  }

  if (!analytics || analytics.total_documents === 0) {
    return (
      <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <BarChart3 size={48} color="var(--accent-cyan)" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>No Application Data Yet</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 24px auto' }}>
            The analytics dashboard visualizes live metrics computed from real database records. Ingest documents or load the demo set to generate live metrics.
          </p>
          <button className="btn-primary" onClick={onSeedSamples}>
            Load Demo Documents Suite
          </button>
        </div>
      </div>
    );
  }

  const {
    total_documents,
    completed_count,
    needs_review_count,
    discrepancy_count,
    verification_rate,
    avg_latency_ms,
    documents_by_type,
    recent_activity,
  } = analytics;

  return (
    <div style={{ maxWidth: '1200px', margin: '32px auto 80px auto', padding: '0 24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Enterprise Analytics & Observability</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Real-time pipeline throughput, verification rates, and stage latencies aggregated from the processing logs database.
          </p>
        </div>
        <button className="btn-secondary" onClick={onRefresh} style={{ fontSize: '0.85rem' }}>
          Refresh Metrics
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {/* KPI 1 */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Ingested
            </span>
            <FileText size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
            {total_documents}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            SHA-256 deduplicated records
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Completed Pipeline
            </span>
            <CheckCircle2 size={18} color="var(--status-verified-text)" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--status-verified-text)' }}>
            {completed_count}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {Math.round((completed_count / total_documents) * 100)}% of total uploads
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Verification Rate
            </span>
            <ShieldAlert size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8' }}>
            {verification_rate}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Passed deterministic math & date checks
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Avg Stage Latency
            </span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24' }}>
            {avg_latency_ms} ms
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Extraction & classification runtime
          </div>
        </div>
      </div>

      {/* Middle Grid: Breakdown & Recent Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '24px',
      }}>
        {/* Document Types Distribution */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-cyan)" /> Documents By Type
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(documents_by_type).map(([type, count]) => {
              const pct = total_documents > 0 ? Math.round((count / total_documents) * 100) : 0;
              return (
                <div key={type}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{type}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: type === 'invoice' ? '#0ea5e9' : type === 'contract' ? '#a855f7' : type === 'resume' ? '#10b981' : '#f59e0b',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: '28px',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
          }}>
            <strong style={{ color: '#ffffff' }}>Fail-Closed Auditing:</strong> Documents with conflicting or missing fields are routed to <span className="badge badge-review" style={{ fontSize: '0.7rem' }}>needs_review</span> and recorded in the audit trail rather than silently persisted as verified.
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#34d399" /> Real-Time Audit Log
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '360px', overflowY: 'auto' }}>
            {recent_activity.map((act) => (
              <div key={act.id} style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: act.status === 'success' ? 'var(--status-verified-text)' : act.status === 'failed' ? 'var(--status-error-text)' : '#fbbf24',
                    }}>
                      {act.stage}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Doc: {act.document_id.slice(0, 8)}...
                    </span>
                  </div>
                  {act.message && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {act.message}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  {act.latency_ms !== null && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff' }}>
                      {act.latency_ms}ms
                    </div>
                  )}
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                    {new Date(act.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
