import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import CompanyCard from './CompanyCard';
import AznAppStrip from './apps/AznAppStrip';
import { Search, X, Star, Sparkles, Building2 } from 'lucide-react';

const CATEGORIES = [
  'All Companies',
  'Favorites',
  'FAANG / Big Tech',
  'HFT & Quant',
  'Tier 1 Tech',
  'Fintech & Banking',
  'Enterprise & Startups'
];

export default function CompanyGrid() {
  const { companies, loadingCompanies, favCompaniesMap } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Companies');
  const [sortBy, setSortBy] = useState('questions-desc'); // 'questions-desc' | 'name-asc' | 'hard-desc' | 'medium-desc'
  const [displayCount, setDisplayCount] = useState(36);
  const filteredCompanies = useMemo(() => {
    let result = [...companies];
    if (selectedCategory === 'Favorites') {
      result = result.filter((c) => !!favCompaniesMap[c.slug]);
    } else if (selectedCategory !== 'All Companies') {
      result = result.filter((c) => c.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) => 
        c.name.toLowerCase().includes(q) ||
        (c.topTopics && c.topTopics.some(t => t.toLowerCase().includes(q)))
      );
    }
    result.sort((a, b) => {
      if (sortBy === 'questions-desc') {
        return (b.totalQuestions || 0) - (a.totalQuestions || 0);
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'hard-desc') {
        return (b.difficultyCounts?.HARD || 0) - (a.difficultyCounts?.HARD || 0);
      }
      if (sortBy === 'medium-desc') {
        return (b.difficultyCounts?.MEDIUM || 0) - (a.difficultyCounts?.MEDIUM || 0);
      }
      return 0;
    });

    return result;
  }, [companies, selectedCategory, searchQuery, sortBy, favCompaniesMap]);

  const displayedList = useMemo(() => {
    return filteredCompanies.slice(0, displayCount);
  }, [filteredCompanies, displayCount]);

  if (loadingCompanies) {
    return (
      <div className="empty-state">
        <Sparkles size={36} className="empty-state-icon" />
        <h3>Loading 470+ Companies...</h3>
        <p>Indexing company catalog and problem counts</p>
      </div>
    );
  }

  return (
    <div>

      <div className="category-filter-bar">
        {CATEGORIES.map((cat) => {
          const isFav = cat === 'Favorites';
          const favCount = Object.keys(favCompaniesMap).length;
          return (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat);
                setDisplayCount(36);
              }}
            >
              {isFav && <Star size={14} fill={selectedCategory === cat ? '#000' : 'var(--accent-lc)'} />}
              {cat}
              {isFav && favCount > 0 && ` (${favCount})`}
            </button>
          );
        })}
      </div>
      <div className="controls-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search company or topics (e.g. Google, Jane Street, Dynamic Programming)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDisplayCount(36);
            }}
          />
          {searchQuery && (
            <button 
              className="search-clear-btn" 
              onClick={() => setSearchQuery('')}
              title="Clear Search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="view-controls">
          <select 
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="questions-desc">Sort: Most Questions</option>
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="hard-desc">Sort: Most Hard Questions</option>
            <option value="medium-desc">Sort: Most Medium Questions</option>
          </select>
        </div>
      </div>

      <AznAppStrip 
        appId="anyalarm" 
        headline="⚡ All types of alarms in one powerful app"
        customText="GPS Commute Alarm, Math puzzles, Barcode/QR scanner & Step counter challenges." 
      />

      {displayedList.length > 0 ? (
        <div className="company-grid">
          {displayedList.map((company) => (
            <CompanyCard key={company.slug} company={company} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Building2 size={42} className="empty-state-icon" />
          <h3>No companies found</h3>
          <p>Try adjusting your search query or category filters.</p>
        </div>
      )}
      {displayedList.length < filteredCompanies.length && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <button
            className="action-btn-secondary"
            style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
            onClick={() => setDisplayCount((prev) => prev + 36)}
          >
            Load More Companies ({filteredCompanies.length - displayedList.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
