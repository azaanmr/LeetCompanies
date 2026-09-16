import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home,
  Building2, 
  Search, 
  BarChart3, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Code2
} from 'lucide-react';

export default function Header() {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    clearSelectedCompany,
    solvedCount,
  } = useApp();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div 
          className="nav-brand" 
          onClick={() => handleTabClick('home')}
          title="LeetCode Company Explorer Home"
        >
          <div className="nav-brand-logo">
            <Code2 size={22} strokeWidth={2.5} />
          </div>
          <div className="nav-brand-text-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem', marginTop: '0.2rem' }}>
            <div className="nav-brand-text">
              <img src="/logo-cropped.svg" alt="LeetCompanies" style={{ width: '260px', height: 'auto', display: 'block' }} />
            </div>
            <span className="azn-brand-badge" style={{ transform: 'scale(0.8)', transformOrigin: 'right top', marginRight: '0.2rem' }}>BY AZN LABS</span>
          </div>
        </div>
        <nav className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleTabClick('home')}
          >
            <Home size={16} />
            <span>Home</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => handleTabClick('companies')}
          >
            <Building2 size={16} />
            <span>Companies</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => handleTabClick('search')}
          >
            <Search size={16} />
            <span>Search & Overlap</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => handleTabClick('tracker')}
          >
            <BarChart3 size={16} />
            <span>My Tracker</span>
          </button>
        </nav>
        <div className="nav-actions">
          <div className="nav-stat-pill" title="Total Problems Solved">
            <CheckCircle2 size={15} color="var(--status-solved)" />
            <span>Solved: <strong className="nav-stat-val">{solvedCount}</strong></span>
          </div>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
