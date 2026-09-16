import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import CompanyGrid from './components/CompanyGrid';
import CompanyDetail from './components/CompanyDetail';
import GlobalSearch from './components/GlobalSearch';
import CompanyOverlap from './components/CompanyOverlap';
import UserTracker from './components/UserTracker';

export default function App() {
  const { activeTab, selectedCompanySlug } = useApp();

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {activeTab === 'companies' && (
          selectedCompanySlug ? <CompanyDetail /> : <CompanyGrid />
        )}

        {activeTab === 'search' && <GlobalSearch />}

        {activeTab === 'overlap' && <CompanyOverlap />}

        {activeTab === 'tracker' && <UserTracker />}
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
            <strong>LeetCompanies Explorer</strong> • 470+ Companies • 3,390+ Questions Archive
          </div>
          <div>
            Data parsed across 30 Days, 3 Months, 6 Months, & All-Time frequencies
          </div>
        </div>
      </footer>
    </div>
  );
}
