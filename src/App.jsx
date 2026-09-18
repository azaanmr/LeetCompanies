import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import HomeTab from './components/HomeTab';
import CompanyGrid from './components/CompanyGrid';
import CompanyDetail from './components/CompanyDetail';
import GlobalSearchTab from './components/GlobalSearchTab';
import UserTracker from './components/UserTracker';
import AznAppsModal from './components/apps/AznAppsModal';

export default function App() {
  const { activeTab, selectedCompanySlug } = useApp();
  const [showAppsModal, setShowAppsModal] = useState(false);

  return (
    <div className="app-container">
      <Header onOpenApps={() => setShowAppsModal(true)} />

      <main className="main-content">
        {selectedCompanySlug ? (
          <CompanyDetail />
        ) : (
          <>
            {activeTab === 'home' && <HomeTab />}
            {activeTab === 'companies' && <CompanyGrid />}
            {activeTab === 'search' && <GlobalSearchTab />}
            {activeTab === 'tracker' && <UserTracker />}
          </>
        )}
      </main>

      <footer style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        borderTop: '1px solid var(--border-subtle)',
        fontSize: '0.825rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>Leet Companies</strong> •{' '}
            <button 
              onClick={() => setShowAppsModal(true)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              title="Developed by Muhammad Azaan M R • AZN Labs"
            >
              <span className="azn-brand-badge">BY AZN LABS</span>
            </button>
            <span style={{ marginLeft: '0.65rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              Crafted by <strong style={{ color: 'var(--text-secondary)' }}>Muhammad Azaan M R</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>🔒 100% Client-Side Local Storage</span>
            <span>•</span>
            <button
              onClick={() => setShowAppsModal(true)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-lc)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
            >
              More Apps (Any Alarm, NET, MineSaves)
            </button>
            <span>•</span>
            <span>470+ Companies Question Archive</span>
          </div>
        </div>
      </footer>

      <AznAppsModal isOpen={showAppsModal} onClose={() => setShowAppsModal(false)} />
    </div>
  );
}
