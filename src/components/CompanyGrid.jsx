import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import CompanyCard from './CompanyCard';
import { Search, X, Star, Sparkles, Building2, Flame, Trophy } from 'lucide-react';

const CATEGORIES = [
  'All Companies',
  'Favorites',
  'FAANG / Big Tech',
  'HFT & Quant',
  'Tier 1 Tech',
  'Fintech & Banking',
  'Enterprise & Startups'
];

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function CompanyGrid() {
  const { companies, loadingCompanies, favCompaniesMap } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Companies');
  const [selectedLetter, setSelectedLetter] = useState('ALL');
  const [sortBy, setSortBy] = useState('questions-desc'); // 'questions-desc' | 'name-asc' | 'hard-desc' | 'medium-desc'
  const [displayCount, setDisplayCount] = useState(36);

  // Filter and sort companies
  const filteredCompanies = useMemo(() => {
    let result = [...companies];

    // Category filter
    if (selectedCategory === 'Favorites') {
      result = result.filter((c) => !!favCompaniesMap[c.slug]);
    } else if (selectedCategory !== 'All Companies') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Alphabet filter
    if (selectedLetter !== 'ALL') {
      result = result.filter((c) => c.name.toUpperCase().startsWith(selectedLetter));
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) => 
        c.name.toLowerCase().includes(q) ||
        (c.topTopics && c.topTopics.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
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
  }, [companies, selectedCategory, selectedLetter, searchQuery, sortBy, favCompaniesMap]);

  const displayedList = useMemo(() => {
    return filteredCompanies.slice(0, displayCount);
  }, [filteredCompanies, displayCount]);

  if (loadingCompanies) {
    return (
      <div className="empty-state">
        <Sparkles size={36} className="empty-state-icon" />
        <h3>Loading 470+ Companies...</h3>
        <p>Indexing question sets and recency data</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Header */}
      <section className="hero-header">
        <div className="hero-title-row">
          <div className="hero-main">
            <h1>Company-Wise LeetCode Archive</h1>
            <p className="hero-subtitle">
              Explore real interview questions asked at 470+ top tech companies, hedge funds, and startups across 30-day, 3-month, 6-month, and all-time frequencies.
            </p>
          </div>

          <div className="hero-stats-banner">
            <div className="stat-item">
              <span className="stat-label">Companies</span>
              <span className="stat-number">{companies.length}</span>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--border-subtle)' }} />
            <div className="stat-item">
              <span className="stat-label">Unique Problems</span>
              <span className="stat-number">3,392</span>
            </div>
            <div style={{ width: 1, height: 32, background: 'var(--border-subtle)' }} />
            <div className="stat-item">
              <span className="stat-label">Timeframes</span>
              <span className="stat-number">5 Periods</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Chips */}
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

      {/* Search and Sort Toolbar */}
      <div className="controls-bar">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search 470+ companies or topics (e.g. Google, Jane Street, Dynamic Programming)..."
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

      {/* Alphabet Quick Jump Bar */}
      <div className="alphabet-bar">
        <button
          className={`alphabet-btn ${selectedLetter === 'ALL' ? 'active' : ''}`}
          onClick={() => {
            setSelectedLetter('ALL');
            setDisplayCount(36);
          }}
        >
          ALL
        </button>
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            className={`alphabet-btn ${selectedLetter === letter ? 'active' : ''}`}
            onClick={() => {
              setSelectedLetter(letter);
              setDisplayCount(36);
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{displayedList.length}</strong> of <strong>{filteredCompanies.length}</strong> companies
        </span>
      </div>

      {/* Grid */}
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

      {/* Load More Button */}
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
