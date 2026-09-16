import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  Search, 
  Layers, 
  BarChart3, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Code2
} from 'lucide-react';

export default function Navbar() {
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
    if (tabId === 'companies') {
      clearSelectedCompany();
    }
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <div 
          className="nav-brand" 
          onClick={() => handleTabClick('companies')}
          title="LeetCode Company Explorer Home"
        >
          <div className="nav-brand-logo">
            <Code2 size={22} strokeWidth={2.5} />
          </div>
          <div className="nav-brand-text">
            <span>Leet</span>Companies
          </div>
          <span className="nav-brand-badge">Premium Free</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
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
            <span>Problem Search</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'overlap' ? 'active' : ''}`}
            onClick={() => handleTabClick('overlap')}
          >
            <Layers size={16} />
            <span>Company Overlap</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => handleTabClick('tracker')}
          >
            <BarChart3 size={16} />
            <span>My Tracker</span>
          </button>
        </nav>

        {/* Right Stats & Theme Controls */}
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
