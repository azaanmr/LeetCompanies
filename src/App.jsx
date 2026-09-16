import React from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import HomeTab from './components/HomeTab';
import CompanyGrid from './components/CompanyGrid';
import CompanyDetail from './components/CompanyDetail';
import GlobalSearchTab from './components/GlobalSearchTab';
import UserTracker from './components/UserTracker';

export default function App() {
  const { activeTab, selectedCompanySlug } = useApp();

  return (
    <div className="app-container">
      <Header />

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
            <strong>LeetCompanies Explorer</strong> • <span className="azn-brand-badge">BY AZN LABS</span>
          </div>
          <div>
            Real interview questions archive across 470+ companies
          </div>
        </div>
      </footer>
    </div>
  );
}
