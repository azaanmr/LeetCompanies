import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  Shuffle, 
  Download, 
  ChevronDown, 
  Check, 
  RotateCcw,
  Tag
} from 'lucide-react';

export default function FilterToolbar({
  searchQuery,
  setSearchQuery,
  selectedDifficulties,
  toggleDifficulty,
  selectedTopics,
  toggleTopic,
  clearTopics,
  minFrequency,
  setMinFrequency,
  statusFilter,
  setStatusFilter,
  availableTopics = [],
  onPickRandom,
  onExportCSV,
  onResetFilters,
  totalFilteredCount,
}) {
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [topicSearch, setTopicSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTopicDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAvailableTopics = availableTopics.filter((t) =>
    t.toLowerCase().includes(topicSearch.toLowerCase())
  );

  const hasActiveFilters = 
    searchQuery.trim() !== '' ||
    selectedDifficulties.length > 0 ||
    selectedTopics.length > 0 ||
    minFrequency > 0 ||
    statusFilter !== 'ALL';

  return (
    <div className="filter-toolbar">
      {/* Top Filter Row: Search & Action Buttons */}
      <div className="filter-row">
        <div className="search-input-wrapper" style={{ maxWidth: '420px' }}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Filter questions by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            className="action-btn-primary"
            onClick={onPickRandom}
            title="Pick a random question matching your current filters"
          >
            <Shuffle size={15} />
            <span>Random Problem</span>
          </button>

          <button
            className="action-btn-secondary"
            onClick={onExportCSV}
            title="Export this question sheet as CSV"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>

          {hasActiveFilters && (
            <button
              className="action-btn-secondary"
              onClick={onResetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Filter Controls: Difficulty, Topics, Status, Frequency */}
      <div className="filter-row" style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        {/* Difficulty Filter */}
        <div className="filter-group">
          <span className="filter-label">Difficulty:</span>
          {['EASY', 'MEDIUM', 'HARD'].map((diff) => {
            const isActive = selectedDifficulties.includes(diff);
            return (
              <button
                key={diff}
                className={`diff-filter-btn ${diff.toLowerCase()} ${isActive ? 'active' : ''}`}
                onClick={() => toggleDifficulty(diff)}
              >
                {diff}
              </button>
            );
          })}
        </div>

        {/* Topics Dropdown */}
        <div className="filter-group topic-filter-wrapper" ref={dropdownRef}>
          <span className="filter-label">Topic:</span>
          <button
            className="topic-select-btn"
            onClick={() => setTopicDropdownOpen((prev) => !prev)}
          >
            <Tag size={14} />
            <span>
              {selectedTopics.length === 0
                ? 'All Topics'
                : `${selectedTopics.length} Selected`}
            </span>
            <ChevronDown size={14} />
          </button>

          {topicDropdownOpen && (
            <div className="topic-dropdown-menu">
              <div style={{ padding: '0.25rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.8rem',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                  }}
                  autoFocus
                />
              </div>

              {selectedTopics.length > 0 && (
                <button
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-lc)',
                    padding: '0.3rem 0.5rem',
                    textAlign: 'left',
                    fontWeight: 600,
                  }}
                  onClick={clearTopics}
                >
                  Clear all topic filters
                </button>
              )}

              {filteredAvailableTopics.map((topic) => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <div
                    key={topic}
                    className={`topic-option-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTopic(topic)}
                  >
                    <span>{topic}</span>
                    {isSelected && <Check size={14} color="var(--accent-lc)" />}
                  </div>
                );
              })}

              {filteredAvailableTopics.length === 0 && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem' }}>
                  No matching topics
                </span>
              )}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <span className="filter-label">Status:</span>
          {[
            { key: 'ALL', label: 'All' },
            { key: 'UNSOLVED', label: 'Unsolved' },
            { key: 'SOLVED', label: 'Solved' },
            { key: 'BOOKMARKED', label: 'Starred' },
          ].map((st) => (
            <button
              key={st.key}
              className={`status-filter-btn ${statusFilter === st.key ? 'active' : ''}`}
              onClick={() => setStatusFilter(st.key)}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Frequency Slider */}
        <div className="filter-group" style={{ marginLeft: 'auto' }}>
          <span className="filter-label">Min Freq:</span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={minFrequency}
            onChange={(e) => setMinFrequency(Number(e.target.value))}
            style={{ width: '90px', accentColor: 'var(--accent-lc)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', minWidth: '35px' }}>
            {minFrequency}%
          </span>
        </div>
      </div>

      {/* Selected Topics Cloud */}
      {selectedTopics.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', paddingTop: '0.25rem' }}>
          {selectedTopics.map((t) => (
            <span
              key={t}
              className="tag-pill"
              style={{
                background: 'rgba(255, 161, 22, 0.15)',
                color: 'var(--accent-lc)',
                borderColor: 'rgba(255, 161, 22, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                cursor: 'pointer',
              }}
              onClick={() => toggleTopic(t)}
            >
              {t} <X size={12} />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
