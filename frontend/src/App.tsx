import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Workspace } from './components/Workspace';
import { AnalyticsView } from './components/AnalyticsView';
import { Footer } from './components/Footer';
import { api, AnalyticsData } from './api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'landing' | 'workspace' | 'analytics'>('landing');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoadingAnalytics(true);
      const data = await api.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleSeedSamples = async () => {
    try {
      setIsSeeding(true);
      await api.seedSamples();
      await fetchAnalyticsData();
      setToastMessage('Successfully processed 3 enterprise sample documents!');
      setTimeout(() => setToastMessage(null), 4000);
      setActiveTab('workspace');
    } catch (err: any) {
      setToastMessage(`Sample seeding failed: ${err.message}`);
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.9rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {toastMessage}
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSeedSamples={handleSeedSamples}
        isSeeding={isSeeding}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'landing' && (
          <LandingPage
            onOpenWorkspace={() => setActiveTab('workspace')}
            onLoadSamples={handleSeedSamples}
          />
        )}

        {activeTab === 'workspace' && (
          <Workspace
            onSeedSamples={handleSeedSamples}
            isSeeding={isSeeding}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            analytics={analytics}
            loading={loadingAnalytics}
            onRefresh={fetchAnalyticsData}
            onSeedSamples={handleSeedSamples}
          />
        )}
      </main>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
};

export default App;
