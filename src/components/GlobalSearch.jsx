import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  X, 
  ExternalLink, 
  Building2, 
  CheckCircle2, 
  Circle, 
  Star, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function GlobalSearch() {
  const { selectCompany, solvedMap, toggleSolved, bookmarkMap, toggleBookmark } = useApp();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [minCompanies, setMinCompanies] = useState(1);
  const [displayLimit, setDisplayLimit] = useState(30);

  // Lazy load global problems database
  useEffect(() => {
    fetch('./data/global_problems.json')
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch((err) => console.error('Failed to load global problems:', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter global problems
  const filteredProblems = useMemo(() => {
    let result = [...problems];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.topics && p.topics.some((t) => t.toLowerCase().includes(q))) ||
          (p.companies && p.companies.some((c) => c.name.toLowerCase().includes(q)))
      );
    }

    if (selectedDifficulty !== 'ALL') {
      result = result.filter((p) => p.difficulty === selectedDifficulty);
    }

    if (selectedTag !== 'ALL') {
      result = result.filter((p) => p.topics && p.topics.includes(selectedTag));
    }

    if (minCompanies > 1) {
      result = result.filter((p) => (p.companyCount || 0) >= minCompanies);
    }

    return result;
  }, [problems, searchQuery, selectedDifficulty, selectedTag, minCompanies]);

  const displayedList = useMemo(() => {
    return filteredProblems.slice(0, displayLimit);
  }, [filteredProblems, displayLimit]);

  if (loading) {
    return (
      <div className="empty-state">
        <Sparkles size={36} className="empty-state-icon" />
        <h3>Loading Universal Problem Database...</h3>
        <p>Indexing 3,300+ LeetCode problems across 470 companies</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search Header */}
      <section className="hero-header">
        <div className="hero-main">
          <h1>Universal Problem Search</h1>
          <p className="hero-subtitle">
            Search any LeetCode problem to see every company that asks it, along with question frequencies and recency.
          </p>
        </div>
      </section>

      {/* Search Toolbar */}
      <div className="filter-toolbar">
        <div className="filter-row">
          <div className="search-input-wrapper" style={{ maxWidth: '540px' }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search problem title, algorithm, or company name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayLimit(30);
              }}
              autoFocus
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Difficulty Chips */}
          <div className="filter-group">
            <span className="filter-label">Difficulty:</span>
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
              <button
                key={diff}
                className={`diff-filter-btn ${diff.toLowerCase()} ${selectedDifficulty === diff ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setDisplayLimit(30);
                }}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Min Companies Filter */}
          <div className="filter-group">
            <span className="filter-label">Asked in ≥</span>
            <select
              value={minCompanies}
              onChange={(e) => {
                setMinCompanies(Number(e.target.value));
                setDisplayLimit(30);
              }}
              className="sort-select"
              style={{ padding: '0.4rem 0.6rem' }}
            >
              <option value="1">1+ Companies</option>
              <option value="5">5+ Companies</option>
              <option value="10">10+ Companies</option>
              <option value="20">20+ Top Companies</option>
              <option value="50">50+ Universal (Hot 🔥)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Meta */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Found <strong>{filteredProblems.length}</strong> problems matching your criteria
        </span>
      </div>

      {/* Problems List */}
      {displayedList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {displayedList.map((prob) => {
            const isSolved = !!solvedMap[prob.slug];
            const isBookmarked = !!bookmarkMap[prob.slug];

            return (
              <div
                key={prob.slug}
                className="company-card"
                style={{ cursor: 'default', padding: '1.25rem' }}
              >
                {/* Problem Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      className="table-action-btn"
                      onClick={() => toggleSolved(prob.slug)}
                      title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                    >
                      {isSolved ? (
                        <CheckCircle2 size={20} color="var(--status-solved)" />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>

                    <div>
                      <a
                        href={prob.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="problem-title-link"
                        style={{ fontSize: '1.1rem', textDecoration: isSolved ? 'line-through' : 'none', opacity: isSolved ? 0.7 : 1 }}
                      >
                        {prob.title}
                        <ExternalLink size={14} style={{ opacity: 0.6 }} />
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className={`diff-badge ${prob.difficulty}`}>
                      {prob.difficulty}
                    </span>
                    <button
                      className={`table-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
                      onClick={() => toggleBookmark(prob.slug)}
                      title="Star for revision"
                    >
                      <Star size={18} fill={isBookmarked ? 'var(--status-bookmarked)' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Topics */}
                {prob.topics && prob.topics.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {prob.topics.map((t) => (
                      <span key={t} className="tag-pill">{t}</span>
                    ))}
                  </div>
                )}

                {/* Company Appearances Pills */}
                <div style={{ marginTop: '0.25rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Asked at {prob.companyCount} {prob.companyCount === 1 ? 'Company' : 'Companies'}:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {prob.companies.slice(0, 12).map((comp) => (
                      <button
                        key={comp.slug}
                        className="tag-pill"
                        style={{
                          background: 'var(--bg-tertiary)',
                          color: 'var(--text-primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          cursor: 'pointer',
                        }}
                        onClick={() => selectCompany(comp.slug)}
                        title={`View ${comp.name} interview sheet (${comp.frequency}% frequency)`}
                      >
                        <Building2 size={12} color="var(--accent-lc)" />
                        <strong>{comp.name}</strong>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          {comp.frequency}%
                        </span>
                      </button>
                    ))}
                    {prob.companies.length > 12 && (
                      <span className="tag-pill" style={{ color: 'var(--text-muted)' }}>
                        +{prob.companies.length - 12} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <HelpCircle size={40} className="empty-state-icon" />
          <h3>No matching problems found</h3>
          <p>Try searching for a different question title or algorithm tag.</p>
        </div>
      )}

      {/* Load More */}
      {displayedList.length < filteredProblems.length && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <button
            className="action-btn-secondary"
            onClick={() => setDisplayLimit((prev) => prev + 30)}
            style={{ padding: '0.65rem 1.5rem' }}
          >
            Load More Results ({filteredProblems.length - displayedList.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
