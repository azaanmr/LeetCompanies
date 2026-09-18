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
  Code2,
  Smartphone,
  Puzzle
} from 'lucide-react';

export default function Header({ onOpenApps, onOpenExtension }) {
  const {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
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
          title="Leet Companies • Created by Muhammad Azaan M R (AZN Labs)"
        >
          <div className="nav-brand-logo" style={{ overflow: 'hidden', padding: '1px', background: 'transparent', boxShadow: 'none' }}>
            <img src="/icon-192.png" alt="Leet Companies Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="nav-brand-text-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.1rem', marginTop: '0.15rem' }}>
            <div className="nav-brand-text">
              <img src="/logo-cropped.svg" alt="Leet Companies" style={{ width: '195px', height: 'auto', display: 'block' }} />
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenApps) onOpenApps();
              }}
              className="azn-brand-badge" 
              style={{ transform: 'scale(0.8)', transformOrigin: 'right top', marginRight: '0.2rem', cursor: 'pointer', border: 'none' }}
              title="AZN Labs • Created by Muhammad Azaan M R (Click to view Android apps)"
            >
              BY AZN LABS
            </button>
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
          <button
            className="action-btn-secondary"
            onClick={onOpenExtension}
            style={{ 
              padding: '0.45rem 0.85rem', 
              fontSize: '0.8rem', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              borderColor: 'rgba(255, 161, 22, 0.4)',
              background: 'rgba(255, 161, 22, 0.08)',
              color: '#ffa116'
            }}
            title="Download Leet Companies Chrome Extension (v1.0.2)"
          >
            <Puzzle size={14} />
            <span style={{ fontWeight: 700 }}>Extension</span>
          </button>

          <button
            className="action-btn-secondary"
            onClick={onOpenApps}
            style={{ 
              padding: '0.45rem 0.85rem', 
              fontSize: '0.8rem', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
            title="Explore AZN Labs Android Apps (Any Alarm, NET, MineSaves)"
          >
            <Smartphone size={14} />
            <span style={{ fontWeight: 600 }}>AZN Apps</span>
          </button>

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
