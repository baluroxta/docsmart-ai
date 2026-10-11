import React from 'react';
import { Shield, Sparkles, Database, GitBranch } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(8, 12, 19, 0.95)',
      padding: '48px 24px 32px 24px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '32px',
        marginBottom: '40px',
      }}>
        <div style={{ maxWidth: '380px' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
            DocSmart <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
            Enterprise document intelligence platform engineered for automated ingestion, schema-grounded extraction, deterministic arithmetic verification, and downstream workflow orchestration.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Shield size={14} color="var(--accent-cyan)" /> Fail-Closed Verification
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Database size={14} color="#38bdf8" /> PostgreSQL / SQLite
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <GitBranch size={14} color="#a855f7" /> n8n Orchestrated
            </span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            Core Capabilities
          </div>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '2' }}>
            <li>Digital & Scanned PDF Ingestion</li>
            <li>Multi-Type Auto Classification</li>
            <li>Schema Validation & Pydantic Coercion</li>
            <li>Deterministic Arithmetic Verification</li>
            <li>Grounded Citations Q&A</li>
          </ul>
        </div>

        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            Enterprise Use Cases
          </div>
          <ul style={{ listStyle: 'none', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '2' }}>
            <li>Accounts Payable (Invoice Auditing)</li>
            <li>Legal Ops (MSA & Contract Analysis)</li>
            <li>Talent Intelligence (Resume Parsing)</li>
            <li>Intake & Operational Forms</li>
            <li>n8n Webhook Automations</li>
          </ul>
        </div>

        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            Independent Platform
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '240px' }}>
            Developed independently as an enterprise AI portfolio project demonstrating production-grade document intelligence and verifiable workflows.
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '24px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        fontSize: '0.82rem',
        color: 'var(--text-dim)',
      }}>
        {/* Exact required footer attribution */}
        <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
          DocSmart AI © 2026 | Developed by Kandala Guru Balaji
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Turn documents into decisions.</span>
          <span>•</span>
          <span>Production Ready Architecture</span>
        </div>
      </div>
    </footer>
  );
};
