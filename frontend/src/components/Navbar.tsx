import React from 'react';
import { FileText, Cpu, BarChart3, Sparkles, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'landing' | 'workspace' | 'analytics';
  setActiveTab: (tab: 'landing' | 'workspace' | 'analytics') => void;
  onSeedSamples: () => void;
  isSeeding: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSeedSamples,
  isSeeding,
}) => {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(11, 15, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 24px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Brand & Logo */}
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        onClick={() => setActiveTab('landing')}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(14, 165, 233, 0.4)',
        }}>
          <FileText size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
              DocSmart <span style={{ color: 'var(--accent-cyan)' }}>AI</span>
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.12)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              textTransform: 'uppercase',
            }}>
              Enterprise v1.0
            </span>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.01em' }}>
            Turn documents into decisions.
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => setActiveTab('landing')}
          style={{
            background: activeTab === 'landing' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            color: activeTab === 'landing' ? '#ffffff' : 'var(--text-muted)',
            border: activeTab === 'landing' ? '1px solid var(--border-medium)' : '1px solid transparent',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={16} /> Overview
        </button>

        <button
          onClick={() => setActiveTab('workspace')}
          style={{
            background: activeTab === 'workspace' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            color: activeTab === 'workspace' ? '#ffffff' : 'var(--text-muted)',
            border: activeTab === 'workspace' ? '1px solid var(--border-medium)' : '1px solid transparent',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Cpu size={16} /> Workspace & Q&A
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          style={{
            background: activeTab === 'analytics' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
            color: activeTab === 'analytics' ? '#ffffff' : 'var(--text-muted)',
            border: activeTab === 'analytics' ? '1px solid var(--border-medium)' : '1px solid transparent',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <BarChart3 size={16} /> Analytics
        </button>
      </div>

      {/* Action CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          className="btn-secondary"
          onClick={onSeedSamples}
          disabled={isSeeding}
          style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          title="Seed realistic business documents (Invoice, Contract, Resume) for instant testing"
        >
          <ShieldCheck size={16} color="var(--accent-cyan)" />
          {isSeeding ? 'Seeding...' : 'Load Demo Set'}
        </button>

        <button
          className="btn-primary"
          onClick={() => setActiveTab('workspace')}
          style={{ fontSize: '0.82rem', padding: '8px 16px' }}
        >
          Open Workspace
        </button>
      </div>
    </nav>
  );
};
